// Vercel serverless function: hands over the .cube, but only against a Stripe
// Checkout Session that actually got paid.
//
// The thank-you page is a plain client route, so its URL is guessable. Putting
// the file behind a session lookup means a guessed URL delivers nothing, and
// the LUT never needs a public path in /public that can be passed around.
//
// Env:
//   STRIPE_SECRET_KEY — required, verifies the purchase
//   LUT_FILE_URL      — direct download URL for the .cube (see api/_lut.js)

import { loadLut, DOWNLOAD_NAME } from './_lut.js'

const SESSION_RE = /^cs_[A-Za-z0-9_]+$/

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
