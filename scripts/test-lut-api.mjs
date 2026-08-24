// Tests the two /lut serverless handlers. No test runner and no new
// dependencies — `node scripts/test-lut-api.mjs`, exits non-zero on failure.
//
// Nothing real is contacted: the Apps Script relay points at a local echo
// server, and Stripe is stubbed by swapping global.fetch. No key required.

import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { Readable } from 'node:stream'
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

// --- api/lut-download.js -------------------------------------------------

console.log('api/lut-download.js')
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
    return { ok: true, arrayBuffer: async () => new TextEncoder().encode('TITLE "remote"\nLUT_3D_SIZE 2\n').buffer }
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
check('sends it as an attachment', res.headers['Content-Disposition'], 'attachment; filename="Matthews-Cinematic-LUT.cube"')
check('never caches the file', res.headers['Cache-Control'], 'no-store')

process.env.LUT_FILE_URL = 'https://example.invalid/matthew.cube'
res = makeRes()
await download({ method: 'GET', query: { session_id: 'cs_1' } }, res)
check('prefers the remote source when set', res.body?.toString().startsWith('TITLE'), true)

// Drive answers 200 with an HTML consent or quota page often enough that
// serving it as a .cube is a real failure mode, not a hypothetical one.
global.fetch = async (url) => {
  if (String(url).startsWith('https://api.stripe.com')) {
    return { ok: true, json: async () => ({ payment_status: 'paid' }) }
  }
  return { ok: true, arrayBuffer: async () => new TextEncoder().encode('<!DOCTYPE html><html>Google Drive').buffer }
}
res = makeRes()
await download({ method: 'GET', query: { session_id: 'cs_1' } }, res)
check('refuses to serve an HTML page as the LUT', res.code, 500)

global.fetch = realFetch
if (fixture) fs.unlinkSync(cube)

// --- api/stripe-webhook.js -----------------------------------------------

console.log('\napi/stripe-webhook.js')

const SECRET = 'whsec_fixture'
process.env.STRIPE_WEBHOOK_SECRET = SECRET
process.env.RESEND_API_KEY = 're_fixture'
process.env.LUT_FROM_EMAIL = 'Matthew <lut@example.com>'

const { default: webhook, verifySignature } = await import(path.join(ROOT, 'api/stripe-webhook.js'))

const sign = (payload, at = Math.floor(Date.now() / 1000), secret = SECRET) =>
  `t=${at},v1=${crypto.createHmac('sha256', secret).update(`${at}.${payload}`, 'utf8').digest('hex')}`

// The handler reads a raw stream, so requests are fed as one.
const streamReq = (payload, signature) =>
  Object.assign(Readable.from([Buffer.from(payload)]), {
    method: 'POST',
    headers: signature ? { 'stripe-signature': signature } : {},
  })

const paidEvent = (overrides = {}) =>
  JSON.stringify({
    type: 'checkout.session.completed',
    data: { object: { id: 'cs_test_abc', amount_total: 499, customer_details: { email: 'Buyer@Example.com' }, ...overrides } },
  })

const body = paidEvent()
const now = Math.floor(Date.now() / 1000)
check('accepts its own signature', verifySignature(body, sign(body), SECRET, now), true)
check('rejects a tampered body', verifySignature(body + ' ', sign(body), SECRET, now), false)
check('rejects the wrong secret', verifySignature(body, sign(body, undefined, 'whsec_other'), SECRET, now), false)
check('rejects a stale timestamp', verifySignature(body, sign(body, now - 600), SECRET, now), false)
check('rejects a missing header', verifySignature(body, '', SECRET, now), false)

// Resend and the LUT source both stubbed — nothing real is contacted.
const sends = []
global.fetch = async (url, init) => {
  if (String(url).startsWith('https://api.resend.com')) {
    sends.push({ headers: init.headers, body: JSON.parse(init.body) })
    return { ok: true, status: 200, text: async () => '{}' }
  }
  return { ok: true, arrayBuffer: async () => new TextEncoder().encode('TITLE "x"\nLUT_3D_SIZE 2\n').buffer }
}
process.env.LUT_FILE_URL = 'https://example.invalid/matthew.cube'

res = makeRes()
await webhook(streamReq(body, 'garbage'), res)
check('400s on a bad signature', res.code, 400)

res = makeRes()
await webhook(Object.assign(Readable.from([]), { method: 'GET', headers: {} }), res)
check('rejects GET', res.code, 405)

res = makeRes()
await webhook(streamReq(body, sign(body)), res)
check('accepts a signed paid session', res.code, 200)
check('emails the buyer', sends[0]?.body?.to?.[0], 'Buyer@Example.com')
check('attaches the .cube', sends[0]?.body?.attachments?.[0]?.filename, 'Matthews-Cinematic-LUT.cube')
check('attachment is base64 of the file', Buffer.from(sends[0].body.attachments[0].content, 'base64').toString().startsWith('TITLE'), true)
check('keys the send on the session so retries do not double-send', sends[0]?.headers?.['Idempotency-Key'], 'lut-cs_test_abc')

const other = JSON.stringify({ type: 'invoice.paid', data: { object: {} } })
res = makeRes()
await webhook(streamReq(other, sign(other)), res)
check('acknowledges unrelated events', res.code, 200)
check('does not email on unrelated events', sends.length, 1)

const noEmail = paidEvent({ customer_details: {}, customer_email: undefined })
res = makeRes()
await webhook(streamReq(noEmail, sign(noEmail)), res)
check('does not retry a session with no email', res.code, 200)

// A Resend outage must make Stripe retry, not silently drop the order.
global.fetch = async (url) => {
  if (String(url).startsWith('https://api.resend.com')) {
    return { ok: false, status: 500, text: async () => 'upstream boom' }
  }
  return { ok: true, arrayBuffer: async () => new TextEncoder().encode('TITLE "x"\n').buffer }
}
res = makeRes()
await webhook(streamReq(body, sign(body)), res)
check('502s when Resend fails, so Stripe retries', res.code, 502)
check('says what actually broke', /resend responded 500/.test(res.payload?.error || ''), true)

global.fetch = realFetch

console.log(failed ? `\n${failed} failing` : '\nall passing')
process.exit(failed ? 1 : 0)
