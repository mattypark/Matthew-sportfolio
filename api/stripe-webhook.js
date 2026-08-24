// Stripe → email the LUT.
//
// The thank-you page hands over the file straight after checkout, but a buyer
// who pays on a phone, closes the tab, or comes back a week later needs a copy
// that does not depend on that one moment. Stripe calls this endpoint when a
// payment completes and the .cube goes out attached to an email.
//
// Delivery is Resend over plain HTTPS. An earlier version mailed from Google
// Apps Script, which meant granting Drive and Gmail scopes to a script that
// otherwise only touched a spreadsheet — and the grant would not take, because
// the project had been authorised years before for a narrower set and Apps
// Script never re-prompted. Sending from the same serverless function that
// already verifies the payment removes that whole class of problem.
//
// Signature verification is hand-rolled rather than pulling in the `stripe`
// SDK: it is an HMAC and a timestamp check, and this repo has no other
// dependency like it.
//
// SETUP
// 1. Stripe → Developers → Webhooks → Add endpoint
//      URL:    https://matthewnpark.com/api/stripe-webhook
//      Event:  checkout.session.completed
// 2. Signing secret (whsec_...) → Vercel as STRIPE_WEBHOOK_SECRET
// 3. Resend API key → Vercel as RESEND_API_KEY
// 4. LUT_FROM_EMAIL — a verified Resend sender, e.g. "Matthew <lut@your.domain>"

import crypto from 'node:crypto'
import { loadLut, DOWNLOAD_NAME } from './_lut.js'

// Stripe's own recommendation: reject anything older than five minutes so a
// captured request cannot be replayed later.
const TOLERANCE_SECONDS = 300
const PRODUCT_NAME = "Matthew's Cinematic LUT"
const REPLY_TO = 'mattyparkbusiness@gmail.com'

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

const BODY = [
  `Thanks for buying ${PRODUCT_NAME}.`,
  '',
  'The .cube is attached. Drop it into Premiere, DaVinci, Final Cut or CapCut',
  'and apply it to your footage.',
  '',
  'Premiere:  Lumetri Color → Creative → Look → Browse → pick the .cube',
  'DaVinci:   Project Settings → Color Management → Lookup Tables → Open LUT',
  '           Folder, drop it in, Update Lists, then right-click a clip → LUT',
  'Final Cut: add the Custom LUT effect → LUT → Choose Custom LUT',
  'CapCut:    Adjust → LUT → Import',
  '',
  'Keep this email — it is your copy of the file.',
  '',
  'Use it on anything you make. Just do not resell or redistribute the file.',
  '',
  '— Matthew',
].join('\n')

async function emailTheLut(to, sessionId) {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.LUT_FROM_EMAIL
  if (!apiKey || !from) throw new Error('RESEND_API_KEY or LUT_FROM_EMAIL is not set')

  const file = await loadLut()

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      // Stripe retries anything that is not a 200, and a retry must not mean a
      // second copy in someone's inbox. Resend collapses repeats of a key.
      'Idempotency-Key': `lut-${sessionId}`,
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: REPLY_TO,
      subject: `Your LUT — ${PRODUCT_NAME}`,
      text: BODY,
      attachments: [{ filename: DOWNLOAD_NAME, content: file.toString('base64') }],
    }),
  })

  if (!response.ok) {
    throw new Error(`resend responded ${response.status}: ${(await response.text()).slice(0, 200)}`)
  }
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

  if (!verifySignature(rawBody, req.headers['stripe-signature'], secret, Math.floor(Date.now() / 1000))) {
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
  const email = session.customer_details?.email || session.customer_email || ''

  if (!email) {
    // 200, not an error: retrying will not conjure an address. Logged so the
    // buyer can be chased by hand.
    console.error('paid session with no email', session.id)
    return res.status(200).json({ success: true, warning: 'no email on session' })
  }

  try {
    await emailTheLut(email, session.id || 'unknown')
  } catch (err) {
    // A non-200 makes Stripe retry, which is what we want if Resend blipped.
    // The message is logged in full rather than swallowed — the last version of
    // this reported a bare "send failed" and cost a day of guessing.
    console.error('could not email the LUT', session.id, err)
    return res.status(502).json({ success: false, error: String(err.message || err) })
  }

  return res.status(200).json({ success: true })
}
