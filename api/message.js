// Vercel serverless function: relays terminal messages to the Google Apps
// Script webhook (which appends them to a Google Sheet).

import { clean, readBody, relay, EMAIL_RE } from './_relay.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ success: false, error: 'method not allowed' })
  }

  const body = readBody(req)
  const name = clean(body?.name)
  const building = clean(body?.building)
  const email = clean(body?.email)
  const message = clean(body?.message)

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, error: 'missing required fields' })
  }
  if (!EMAIL_RE.test(email)) {
    return res.status(400).json({ success: false, error: 'invalid email' })
  }

  const { success } = await relay({ type: 'message', name, building, email, message })
  if (!success) {
    return res.status(502).json({ success: false, error: 'upstream failed' })
  }
  return res.status(200).json({ success: true })
}
