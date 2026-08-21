// Tests the two /lut serverless handlers. No test runner and no new
// dependencies — `node scripts/test-lut-api.mjs`, exits non-zero on failure.
//
// Nothing real is contacted: the Apps Script relay points at a local echo
// server, and Stripe is stubbed by swapping global.fetch. No key required.

import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

let failed = 0
const check = (name, got, want) => {
  const ok = got === want
  if (!ok) failed++
  console.log(`${ok ? 'ok  ' : 'FAIL'}  ${name}${ok ? '' : ` — got ${got}, want ${want}`}`)
}

// Minimal stand-in for Vercel's response object.
function makeRes() {
  const r = { code: 0, payload: null, body: null, headers: {} }
  r.setHeader = (k, v) => { r.headers[k] = v }
  r.status = (c) => { r.code = c; return r }
  r.json = (p) => { r.payload = p; return r }
  r.send = (b) => { r.body = b; return r }
  return r
}

// --- api/lut-claim.js ----------------------------------------------------

const relayed = []
const echo = http.createServer((req, res) => {
  let body = ''
  req.on('data', (c) => (body += c))
  req.on('end', () => {
    relayed.push(JSON.parse(body))
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ success: true }))
  })
})
await new Promise((resolve) => echo.listen(0, resolve))
process.env.TERMINAL_WEBHOOK_URL = `http://localhost:${echo.address().port}/`

const { default: claim } = await import(path.join(ROOT, 'api/lut-claim.js'))
const png = 'data:image/png;base64,' + 'A'.repeat(120)

console.log('api/lut-claim.js')
for (const [name, req, want] of [
  ['rejects GET', { method: 'GET', body: {} }, 405],
  ['swallows honeypot submissions', { method: 'POST', body: { website: 'bot', email: 'a@b.co', screenshot: png } }, 200],
  ['rejects a bad email', { method: 'POST', body: { email: 'nope', screenshot: png } }, 400],
  ['requires a screenshot', { method: 'POST', body: { email: 'a@b.co' } }, 400],
  ['rejects a non-image data url', { method: 'POST', body: { email: 'a@b.co', screenshot: 'data:text/html;base64,AAAA' } }, 400],
  ['rejects an oversized screenshot', { method: 'POST', body: { email: 'a@b.co', screenshot: 'data:image/png;base64,' + 'A'.repeat(4 * 1024 * 1024) } }, 413],
  ['accepts a real claim', { method: 'POST', body: { email: 'A@B.co', platform: 'TikTok', postUrl: 'https://x', screenshot: png } }, 200],
]) {
  const res = makeRes()
  await claim(req, res)
  check(name, res.code, want)
}
check('only the real claim reached the relay', relayed.length, 1)
check('email is normalised', relayed[0]?.email, 'a@b.co')
echo.close()

// --- api/lut-download.js -------------------------------------------------

console.log('\napi/lut-download.js')
const cube = path.join(ROOT, 'private', 'matthew-lut.cube')
const fixture = !fs.existsSync(cube)
if (fixture) fs.writeFileSync(cube, 'TITLE "fixture"\nLUT_3D_SIZE 2\n')

const { default: download } = await import(path.join(ROOT, 'api/lut-download.js'))
const realFetch = global.fetch

delete process.env.STRIPE_SECRET_KEY
delete process.env.LUT_FILE_URL

let res = makeRes()
await download({ method: 'GET', query: { session_id: 'cs_1' } }, res)
check('503s when no Stripe key is configured', res.code, 503)

process.env.STRIPE_SECRET_KEY = 'sk_test_fixture'

for (const [name, req, want] of [
  ['rejects POST', { method: 'POST', query: {} }, 405],
  ['rejects a missing session', { method: 'GET', query: {} }, 400],
  ['rejects a malformed session id', { method: 'GET', query: { session_id: '../../etc/passwd' } }, 400],
]) {
  const r = makeRes()
  await download(req, r)
  check(name, r.code, want)
}

const stubStripe = (paymentStatus) => {
  global.fetch = async (url) => {
    if (String(url).startsWith('https://api.stripe.com')) {
      return { ok: true, json: async () => ({ payment_status: paymentStatus }) }
    }
    return { ok: true, arrayBuffer: async () => new TextEncoder().encode('REMOTE CUBE').buffer }
  }
}

stubStripe('unpaid')
res = makeRes()
await download({ method: 'GET', query: { session_id: 'cs_1' } }, res)
check('402s on an unpaid session', res.code, 402)

stubStripe('paid')
res = makeRes()
await download({ method: 'GET', query: { session_id: 'cs_1' } }, res)
check('serves the local file on a paid session', res.code, 200)
check('sends it as an attachment', res.headers['Content-Disposition'], 'attachment; filename="Matthew-01.cube"')
check('never caches the file', res.headers['Cache-Control'], 'no-store')

process.env.LUT_FILE_URL = 'https://example.invalid/matthew.cube'
res = makeRes()
await download({ method: 'GET', query: { session_id: 'cs_1' } }, res)
check('prefers the remote source when set', res.body?.toString(), 'REMOTE CUBE')

global.fetch = realFetch
if (fixture) fs.unlinkSync(cube)

console.log(failed ? `\n${failed} failing` : '\nall passing')
process.exit(failed ? 1 : 0)
