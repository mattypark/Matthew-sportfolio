// Vercel serverless function: journal signups.
//
// Writes to TWO places, on purpose:
//
//   Kit    — the system of record. This is where sending happens, so this is
//            where the list has to live.
//   Sheet  — the ledger. A durable record of every human who ever typed their
//            email into that box, independent of Kit's uptime, an API key
//            rotation, or Kit as a vendor.
//
// Both writes fire unconditionally (not fallback-on-failure — that only exercises
// the path you can least afford to have untested). We succeed if EITHER lands.
// The worst outcome in this whole system is "a real person subscribed and we have
// no idea who they were", and a second fetch call is a cheap price to make that
// impossible.
//
// Env: KIT_API_KEY (required for the Kit write; without it we still log to the
// Sheet rather than dropping the signup).

import { clean, readBody, relay, EMAIL_RE } from './_relay.js'

const KIT_SUBSCRIBERS = 'https://api.kit.com/v4/subscribers'
const MAX_PHONE_LENGTH = 32

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ success: false, error: 'method not allowed' })
  }

  const body = readBody(req)

  // honeypot — hidden from humans, so anything in it is a bot. Pretend it worked
  // and write nothing.
  if (clean(body?.website)) {
    return res.status(200).json({ success: true })
  }

  const email = clean(body?.email).toLowerCase()
  const phone = clean(body?.phone).slice(0, MAX_PHONE_LENGTH)
  const name = clean(body?.name)

  if (!email) {
    return res.status(400).json({ success: false, error: 'email required' })
  }
  if (!EMAIL_RE.test(email)) {
    return res.status(400).json({ success: false, error: 'invalid email' })
  }

  const [kit, sheet] = await Promise.allSettled([
    addToKit({ email, phone, name }),
    relay({ type: 'subscribe', email, phone, name }),
  ])

  const kitOk = kit.status === 'fulfilled' && kit.value === true
  const sheetOk = sheet.status === 'fulfilled' && sheet.value?.success === true

  if (kitOk && !sheetOk) {
    console.warn('subscribe: kit ok, sheet ledger failed', email)
  }
  if (!kitOk && sheetOk) {
    // Loud on purpose: this address is captured but NOT on the sending list.
    console.error('subscribe: KIT FAILED, sheet caught it — add manually:', email)
  }

  if (!kitOk && !sheetOk) {
    console.error('subscribe: both writes failed, signup lost', email)
    return res.status(502).json({ success: false, error: 'could not save your email' })
  }

  return res.status(200).json({ success: true })
}

// POST /v4/subscribers. Upserts on email, so a re-subscribe is a no-op rather
// than a duplicate.
//
// Two traps, both of which silently cost a subscriber if you get them wrong:
//
//   1. Kit answers 200/201 with { subscriber: {...} } and NO `success` field.
//      Reusing _relay.js's `!data?.success` predicate here would read every
//      successful signup as a failure.
//   2. A custom field key that does not exist on the account ERRORS the whole
//      request. If `phone_number` was never created in Kit, that would kill every
//      signup — email and all. So on a 4xx we retry without `fields`. The email
//      is the asset; the phone number is a garnish. Never let the garnish kill
//      the meal.
async function addToKit({ email, phone, name }) {
  const apiKey = process.env.KIT_API_KEY
  if (!apiKey) {
    console.error('subscribe: KIT_API_KEY is not set')
    return false
  }

  const base = {
    email_address: email,
    ...(name ? { first_name: name } : {}),
  }

  const withPhone = phone ? { ...base, fields: { phone_number: phone } } : base

  let ok = await postSubscriber(apiKey, withPhone)
  if (!ok && phone) {
    console.warn('subscribe: kit rejected the phone field, retrying without it')
    ok = await postSubscriber(apiKey, base)
  }
  return ok
}

async function postSubscriber(apiKey, payload) {
  try {
    const res = await fetch(KIT_SUBSCRIBERS, {
      method: 'POST',
      headers: {
        'X-Kit-Api-Key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      const text = await res.text()
      console.error('subscribe: kit rejected', res.status, text.slice(0, 200))
      return false
    }

    const data = await res.json().catch(() => null)
    return Boolean(data?.subscriber)
  } catch (err) {
    console.error('subscribe: kit request failed', err)
    return false
  }
}
