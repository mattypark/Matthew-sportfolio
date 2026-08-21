// Stripe → email the LUT.
//
// The thank-you page already offers an instant download, but a buyer who
// closes the tab, pays on a phone, or loses the file a week later has nothing.
// So Stripe also calls this endpoint when a payment completes, and the buyer
// gets the .cube in their inbox.
//
// Delivery goes through the Apps Script the site already talks to: it mails
// the file straight out of Gmail with the .cube attached, so there is no
// second email service to sign up for and no public URL to the product.
//
// Signature verification is hand-rolled rather than pulling in the `stripe`
// SDK — it is an HMAC and a timestamp check, and this repo has no other
// dependency like it.
//
// SETUP
// 1. Stripe → Developers → Webhooks → Add endpoint
//      URL:    https://matthewnpark.com/api/stripe-webhook
//      Event:  checkout.session.completed
// 2. Copy the signing secret (starts whsec_) into Vercel as
//    STRIPE_WEBHOOK_SECRET.

import crypto from 'node:crypto'
import { relay } from './_relay.js'

// Stripe's own recommendation: reject anything older than five minutes so a
// captured request cannot be replayed later.
const TOLERANCE_SECONDS = 300

export const config = {
  api: { bodyParser: false },
}

function readRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = []
    req.on('data', (chunk) => chunks.push(chunk))
    req.on('end', () => resolve(Buffer.concat(chunks)))
    req.on('error', reject)
  })
}

// Returns true only if the signature header carries a v1 digest that matches.
export function verifySignature(rawBody, header, secret, nowSeconds) {
  if (!header || !secret) return false

  const parts = Object.fromEntries(
    header.split(',').map((piece) => {
      const [key, ...rest] = piece.split('=')
      return [key.trim(), rest.join('=')]
    }),
  )

  const timestamp = Number(parts.t)
  if (!Number.isFinite(timestamp)) return false
  if (Math.abs(nowSeconds - timestamp) > TOLERANCE_SECONDS) return false
  if (!parts.v1) return false

  const expected = crypto
    .createHmac('sha256', secret)
    .update(`${timestamp}.${rawBody}`, 'utf8')
    .digest('hex')

  const a = Buffer.from(expected, 'utf8')
  const b = Buffer.from(parts.v1, 'utf8')
  return a.length === b.length && crypto.timingSafeEqual(a, b)
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ success: false, error: 'method not allowed' })
  }

  const secret = process.env.STRIPE_WEBHOOK_SECRET
  if (!secret) {
    console.error('STRIPE_WEBHOOK_SECRET is not set — cannot trust this call')
    return res.status(503).json({ success: false, error: 'webhook not configured' })
  }

  const rawBody = (await readRawBody(req)).toString('utf8')
  const signature = req.headers['stripe-signature']

  if (!verifySignature(rawBody, signature, secret, Math.floor(Date.now() / 1000))) {
    return res.status(400).json({ success: false, error: 'bad signature' })
  }

  let event
  try {
    event = JSON.parse(rawBody)
  } catch {
    return res.status(400).json({ success: false, error: 'unparseable body' })
  }

  // Anything else is acknowledged and ignored, so Stripe stops retrying it.
  if (event?.type !== 'checkout.session.completed') {
    return res.status(200).json({ success: true, ignored: event?.type || 'unknown' })
  }

  const session = event.data?.object || {}
  const email =
    session.customer_details?.email || session.customer_email || ''

  if (!email) {
    // 200, not an error: retrying will not conjure an address. Log it so the
    // buyer can be chased by hand.
    console.error('paid session with no email', session.id)
    return res.status(200).json({ success: true, warning: 'no email on session' })
  }

  const { success } = await relay({
    type: 'lut-purchase',
    email: email.toLowerCase(),
    sessionId: session.id || '',
    amount: typeof session.amount_total === 'number' ? session.amount_total / 100 : '',
  })

  // A 502 makes Stripe retry, which is what we want if Gmail was briefly down.
  if (!success) {
    console.error('could not hand the purchase to Apps Script', session.id)
    return res.status(502).json({ success: false, error: 'delivery failed' })
  }

  return res.status(200).json({ success: true })
}
