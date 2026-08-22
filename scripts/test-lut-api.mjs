// Tests the two /lut serverless handlers. No test runner and no new
// dependencies — `node scripts/test-lut-api.mjs`, exits non-zero on failure.
//
// Nothing real is contacted: the Apps Script relay points at a local echo
// server, and Stripe is stubbed by swapping global.fetch. No key required.

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
check('sends it as an attachment', res.headers['Content-Disposition'], 'attachment; filename="Matthew-01.cube"')
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

console.log(failed ? `\n${failed} failing` : '\nall passing')
process.exit(failed ? 1 : 0)
