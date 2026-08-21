// Vercel serverless function: relays a "free LUT for a repost" claim to the
// Google Apps Script webhook, which files the screenshot in Drive, appends a
// row to the LUT Claims tab, and emails Matthew a one-click approve link.
//
// The screenshot arrives as a data URL. The browser already downscaled it
// (see LutClaimForm.jsx) — the checks here exist because the browser is not
// something this endpoint gets to trust.

import { clean, readBody, relay, EMAIL_RE } from './_relay.js'

// Vercel caps a request body at 4.5MB. Refusing at 3MB leaves room for the
// base64 overhead and the rest of the payload.
const MAX_SCREENSHOT_BYTES = 3 * 1024 * 1024
const DATA_URL_RE = /^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/

export const config = {
  api: { bodyParser: { sizeLimit: '4mb' } },
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ success: false, error: 'method not allowed' })
  }

  const body = readBody(req)

  // Honeypot: a real person never fills this in.
  if (clean(body?.website)) {
    return res.status(200).json({ success: true })
  }

  const email = clean(body?.email).toLowerCase()
  const platform = clean(body?.platform)
  const postUrl = clean(body?.postUrl)
  const screenshot = typeof body?.screenshot === 'string' ? body.screenshot : ''

  if (!email || !EMAIL_RE.test(email)) {
    return res.status(400).json({ success: false, error: 'invalid email' })
  }
  if (!screenshot) {
    return res.status(400).json({ success: false, error: 'screenshot required' })
  }
  if (!DATA_URL_RE.test(screenshot)) {
    return res.status(400).json({ success: false, error: 'screenshot must be a jpeg, png or webp data url' })
  }
  if (screenshot.length > MAX_SCREENSHOT_BYTES) {
    return res.status(413).json({ success: false, error: 'screenshot too large' })
  }

  const { success } = await relay({
    type: 'lut-claim',
    email,
    platform,
    postUrl,
    screenshot,
  })

  if (!success) {
    return res.status(502).json({ success: false, error: 'upstream failed' })
  }
  return res.status(200).json({ success: true })
}
