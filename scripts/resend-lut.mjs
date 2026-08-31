// Mails the LUT to people who already paid.
//
// The webhook covers new orders; this covers the ones that happened while it
// was not working. It reads paid Checkout Sessions straight from Stripe, so
// the list is the truth rather than a memory of who complained.
//
//   node --env-file-if-exists=.env scripts/resend-lut.mjs            # list only
//   node --env-file-if-exists=.env scripts/resend-lut.mjs --send     # send to all listed
//   node --env-file-if-exists=.env scripts/resend-lut.mjs --send cs_test_123
//
// Needs STRIPE_SECRET_KEY, RESEND_API_KEY, LUT_FROM_EMAIL and LUT_FILE_URL (or
// a local private/matthew-lut.cube) in the environment.

import { emailTheLut } from '../api/stripe-webhook.js'

const args = process.argv.slice(2)
const send = args.includes('--send')
const only = args.find((a) => a.startsWith('cs_'))
const days = Number(args.find((a) => a.startsWith('--days='))?.split('=')[1] || 90)

const key = process.env.STRIPE_SECRET_KEY
if (!key) {
  console.error('STRIPE_SECRET_KEY is not set')
  process.exit(1)
}

const stripe = async (path) => {
  const res = await fetch(`https://api.stripe.com/v1/${path}`, {
    headers: { Authorization: `Bearer ${key}` },
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json?.error?.message || `stripe responded ${res.status}`)
  return json
}

// Sessions come back newest first; paging stops at the cutoff rather than
// walking the whole history of the account.
const since = Math.floor(Date.now() / 1000) - days * 86400
const sessions = []

if (only) {
  sessions.push(await stripe(`checkout/sessions/${encodeURIComponent(only)}`))
} else {
  let startingAfter = ''
  for (;;) {
    const page = await stripe(
      `checkout/sessions?limit=100&created[gte]=${since}${startingAfter ? `&starting_after=${startingAfter}` : ''}`,
    )
    sessions.push(...page.data)
    if (!page.has_more) break
    startingAfter = page.data[page.data.length - 1].id
  }
}

const paid = sessions.filter((s) => s.payment_status === 'paid')
const targets = paid
  .map((s) => ({ id: s.id, email: s.customer_details?.email || s.customer_email || '', created: s.created }))
  .filter((t) => t.email)

console.log(`${paid.length} paid session(s) in the last ${days} days, ${targets.length} with an address:`)
for (const t of targets) {
  console.log(`  ${new Date(t.created * 1000).toISOString().slice(0, 10)}  ${t.email}  ${t.id}`)
}

const noAddress = paid.length - targets.length
if (noAddress) console.log(`  (${noAddress} paid session(s) carry no email — those need chasing by hand)`)

if (!send) {
  console.log('\nNothing sent. Re-run with --send to mail these.')
  process.exit(0)
}

let failed = 0
for (const t of targets) {
  try {
    // Keyed on the session, so re-running this does not double-send to anyone
    // Resend has already accepted a copy for.
    await emailTheLut(t.email, t.id)
    console.log(`sent  ${t.email}`)
  } catch (err) {
    failed++
    console.error(`FAIL  ${t.email} — ${err.message || err}`)
  }
}
console.log(failed ? `\n${failed} failed` : `\nall ${targets.length} sent`)
process.exit(failed ? 1 : 0)
