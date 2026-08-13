// Shared Apps Script relay for the serverless functions in this folder.
// (Vercel ignores files in api/ that start with an underscore, so this is a
// helper module, not a route.)
//
// Why a relay: browsers hit CORS failures on Apps Script's 302-redirect
// responses to POST. Server-to-server has no CORS, and fetch follows the
// redirect (302 turns the POST into a GET on Google's echo endpoint, which
// serves the script's JSON result).
//
// Env (optional): TERMINAL_WEBHOOK_URL overrides the default deployment URL.

const DEFAULT_WEBHOOK_URL =
  'https://script.google.com/macros/s/AKfycbxb2NUFcSrGsi2YaC2L-gncyYOaZjzkzHaOMDTWPi8RuoeZKSCgp0SFAqvzyjvUbCwXHg/exec'

export const MAX_FIELD_LENGTH = 2000
export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function clean(value) {
  if (typeof value !== 'string') return ''
  return value.trim().slice(0, MAX_FIELD_LENGTH)
}

export function safeParse(text) {
  try {
    return JSON.parse(text)
  } catch {
    return null
  }
}

export function readBody(req) {
  return typeof req.body === 'string' ? safeParse(req.body) : req.body
}

// Posts a payload to the Apps Script webhook. Resolves { success } — never
// throws, so callers can map failures straight to a 502.
export async function relay(payload) {
  const webhookUrl = process.env.TERMINAL_WEBHOOK_URL || DEFAULT_WEBHOOK_URL

  try {
    const upstream = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
      redirect: 'follow',
    })
    const text = await upstream.text()
    const data = safeParse(text)

    if (!upstream.ok || !data?.success) {
      console.error('apps script relay failed', upstream.status, text.slice(0, 200))
      return { success: false }
    }
    return { success: true }
  } catch (err) {
    console.error('apps script relay error', err)
    return { success: false }
  }
}
