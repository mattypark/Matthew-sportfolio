# The Journal

Live at `/journal`. Replaces the crossed-out "Projects" link on the landing page.

**The loop:** write a markdown file → push → the post is on the site **and** a finished
email is waiting in Kit. You press Send. That's it.

---

## Posting

1. Copy `src/content/journal/_template.md`. **The filename is the URL:**
   `shipping-slapshift.md` → `/journal/shipping-slapshift`.
2. Drop a cover image in `public/journal/` and point `cover:` at it.
3. Write. Commit. Push.

```markdown
---
title: What shipping SlapShift taught me
date: 2026-07-18
dek: One line under the title. What the reader gets out of this.
cover: /journal/shipping-slapshift.png
tags: [building, macos]
---

Body in markdown. **Bold**, *italic*, `code`, lists, > quotes, ## subheads,
tables, ~~strikethrough~~.
```

| Field | Required | Notes |
|---|---|---|
| `title` | yes | The headline, and the email's subject line |
| `date` | yes | `YYYY-MM-DD`. Sorts the list, newest first |
| `dek` | yes | One-line summary. Also the email's preview text |
| `cover` | no | Card image. Omit it and the card sets the title in type instead |
| `tags` | no | `[a, b]` — shown at the foot of the entry |
| `slug` | no | Overrides the filename as the URL |

Reading time is computed automatically. Files starting with `_` are excluded from the
build **and** can never be emailed.

**Images:** keep them under ~300kb. The site has a <150kb JS budget and a stray 4MB
screenshot is the easiest way to wreck it. Export at ~1600px wide, WebP or AVIF.

### Why markdown files and not a CMS

Because the plan is a book. Fifty markdown files in a git repo concatenate into a
manuscript; fifty rows in someone else's database do not. This format still opens in ten
years.

---

## How the email goes out

```
entry.md ──push───────────► Vercel rebuild ──► live at /journal/slug

npm run draft -- <slug> ──► Kit DRAFT ──► you open Kit and press Send
```

Two separate moves, on purpose. Pushing publishes to the site. The email only happens when
**you** ask for it.

```bash
# see exactly what would be emailed — touches no API, sends nothing
npm run draft:preview -- shipping-slapshift

# create the draft in Kit
npm run draft -- shipping-slapshift
```

**It creates a draft. It never sends.** Kit's API has no "send now" — only a draft or a
scheduled timestamp. Draft is the right default anyway: pressing Send is one click, on a
screen that shows you exactly what your subscribers will get. That click *is* the review
step, and it makes an unrecallable mis-send impossible.

Run it twice on the same entry and the second run refuses — each broadcast carries a
`journal:<slug>` marker in its (subscriber-invisible) description, so you can't put two
copies of one post in front of the list.

---

## The signup form

Writes to **two** places, every time:

- **Kit** — the system of record. Sending happens here, so the list lives here.
- **The Google Sheet** — a ledger. A durable record of everyone who ever subscribed,
  independent of Kit's uptime or an API key rotation.

Both writes fire; the signup succeeds if **either** lands. The worst possible outcome is
"a real person subscribed and we have no idea who they were," and a second write makes
that impossible. If Kit fails but the Sheet catches it, the function logs the address
loudly so you can add it manually.

Email is required, phone optional. Duplicate emails upsert rather than duplicating. A
hidden honeypot field catches bots — those get a silent success and are never written.

---

## Setup

Three steps, once. **I never see your API key — you paste it yourself.**

### 1. Kit — get an API key

Kit → **Settings → Developer → API Keys** → create a **v4 API key**. Copy it.

### 2. Local — make your `.env`

```bash
cp .env.example .env
```

Open `.env` and paste in `KIT_API_KEY` and your real `SITE_URL`. Git ignores this file; it
never leaves your machine. This is all `npm run draft` needs.

### 3. Vercel — add the key

Vercel → your project → **Settings → Environment Variables** → add `KIT_API_KEY`. Redeploy.

This is for the *signup form* (it writes new subscribers into Kit). The drafting script
runs on your laptop and doesn't need Vercel to know anything.

### Also worth doing

**Create the phone custom field.** Kit → **Grow → Subscribers → Custom Fields** → add one
whose key is **`phone_number`**. Kit errors the whole request if you send a custom field
key that doesn't exist — the code retries without the phone so a signup still succeeds, but
phone numbers are silently dropped until this field exists.

**Check your opt-in setting.** If your Kit account uses double opt-in, subscribers added
through the form may not be in a sendable segment until they confirm. Subscribe yourself
and look.

---

## Known limits

- No rate limiting on `/api/subscribe` beyond the honeypot and length caps. If it ever
  gets abused, add Vercel KV or Upstash and cap by IP.
- `/api/*` does not run under `vite dev` — the form shows its error state locally. Test
  signups against a Vercel preview deployment.
- The Sheet's `Subscribers` tab needs the updated `google-apps-script/Code.gs` deployed
  (Apps Script → paste → Deploy → Manage deployments → **Version: New**). Until you do,
  the Kit write still works and the ledger write just fails quietly — you'll see the
  warning in the Vercel logs.
