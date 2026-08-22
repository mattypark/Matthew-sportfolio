// Vercel serverless function: hands over the .cube, but only against a Stripe
// Checkout Session that actually got paid.
//
// The thank-you page is a plain client route, so its URL is guessable. Putting
// the file behind a session lookup means a guessed URL delivers nothing, and
// the LUT never needs a public path in /public that can be passed around.
//
// WHERE THE FILE LIVES
// This repo is public, so committing the .cube would hand it out for free on
// GitHub. Hence LUT_FILE_URL: an unlisted direct-download link (Google Drive,
// Dropbox, Vercel Blob) that only this function ever reads. The local
// private/ path is the fallback and is gitignored — it works for `vercel dev`
// and for anyone who later flips the repo private.
//
// Env:
//   STRIPE_SECRET_KEY — required, verifies the purchase
//   LUT_FILE_URL      — direct download URL for the .cube
// Matthew sets both in Vercel himself.

import { readFile } from 'node:fs/promises'
import path from 'node:path'

const LOCAL_FILE = path.join(process.cwd(), 'private', 'matthew-lut.cube')
const DOWNLOAD_NAME = 'Matthew-01.cube'
const SESSION_RE = /^cs_[A-Za-z0-9_]+$/

// A .cube is plain text and opens with a directive or a comment. Google Drive
// will happily answer a download URL with an HTML consent or quota page and a
// 200, and serving that as Matthew-01.cube would hand the buyer a file that
// silently does nothing in Premiere. Better to fail here and say why.
function assertLooksLikeCube(buffer) {
  const head = buffer.subarray(0, 200).toString('utf8').trimStart()
  if (/^(TITLE|LUT_3D_SIZE|LUT_1D_SIZE|DOMAIN_(MIN|MAX)|#)/i.test(head)) return
  throw new Error(`source did not return a .cube (starts with ${JSON.stringify(head.slice(0, 60))})`)
}

async function loadLut() {
  if (process.env.LUT_FILE_URL) {
    const upstream = await fetch(process.env.LUT_FILE_URL)
    if (!upstream.ok) throw new Error(`lut source responded ${upstream.status}`)
    const buffer = Buffer.from(await upstream.arrayBuffer())
    assertLooksLikeCube(buffer)
    return buffer
  }
  return readFile(LOCAL_FILE)
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET')
    return res.status(405).json({ success: false, error: 'method not allowed' })
  }

  const sessionId = typeof req.query?.session_id === 'string' ? req.query.session_id.trim() : ''
  if (!sessionId || !SESSION_RE.test(sessionId)) {
    return res.status(400).json({ success: false, error: 'missing session' })
  }

  const secret = process.env.STRIPE_SECRET_KEY
  if (!secret) {
    console.error('STRIPE_SECRET_KEY is not set — cannot verify the purchase')
    return res.status(503).json({ success: false, error: 'downloads not configured' })
  }

  let paid = false
  try {
    const upstream = await fetch(
      `https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(sessionId)}`,
      { headers: { Authorization: `Bearer ${secret}` } },
    )
    const session = await upstream.json()
    paid = upstream.ok && session?.payment_status === 'paid'
  } catch (err) {
    console.error('stripe session lookup failed', err)
    return res.status(502).json({ success: false, error: 'could not verify the purchase' })
  }

  if (!paid) {
    return res.status(402).json({ success: false, error: 'no paid session for that receipt' })
  }

  try {
    const file = await loadLut()
    res.setHeader('Content-Type', 'application/octet-stream')
    res.setHeader('Content-Disposition', `attachment; filename="${DOWNLOAD_NAME}"`)
    res.setHeader('Cache-Control', 'no-store')
    return res.status(200).send(file)
  } catch (err) {
    console.error('lut file unavailable', err)
    return res.status(500).json({ success: false, error: 'file unavailable' })
  }
}
