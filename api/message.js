// Vercel serverless function: relays terminal messages to the Google Apps
// Script webhook (which appends them to a Google Sheet).
//
// Why a relay: browsers hit CORS failures on Apps Script's 302-redirect
// responses to POST. Server-to-server has no CORS, and fetch follows the
// redirect (302 turns the POST into a GET on Google's echo endpoint, which
// serves the script's JSON result).
//
// Env (optional): TERMINAL_WEBHOOK_URL overrides the default deployment URL.

const DEFAULT_WEBHOOK_URL =
  'https://script.google.com/macros/s/AKfycbxb2NUFcSrGsi2YaC2L-gncyYOaZjzkzHaOMDTWPi8RuoeZKSCgp0SFAqvzyjvUbCwXHg/exec'

const MAX_FIELD_LENGTH = 2000
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function clean(value) {
  if (typeof value !== 'string') return ''
  return value.trim().slice(0, MAX_FIELD_LENGTH)
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ success: false, error: 'method not allowed' })
  }

  const body = typeof req.body === 'string' ? safeParse(req.body) : req.body
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

  const webhookUrl = process.env.TERMINAL_WEBHOOK_URL || DEFAULT_WEBHOOK_URL

  try {
    const upstream = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ name, building, email, message }),
      redirect: 'follow',
    })
    const text = await upstream.text()
    const data = safeParse(text)

    if (!upstream.ok || !data?.success) {
      console.error('apps script relay failed', upstream.status, text.slice(0, 200))
      return res.status(502).json({ success: false, error: 'upstream failed' })
    }
    return res.status(200).json({ success: true })
  } catch (err) {
    console.error('apps script relay error', err)
    return res.status(502).json({ success: false, error: 'relay error' })
  }
}

function safeParse(text) {
  try {
    return JSON.parse(text)
  } catch {
    return null
  }
}
