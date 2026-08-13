// Create a Kit broadcast from a journal entry.
//
//   npm run draft -- shipping-slapshift            # by slug
//   npm run draft -- --dry-run shipping-slapshift  # print the HTML, touch nothing
//   npm run draft -- src/content/journal/x.md      # or by path
//
// Env (from .env, which git ignores): KIT_API_KEY, SITE_URL
//
// IT CREATES A DRAFT. It does not send.
//
// Kit's API has no "send now" — only send_at:null (draft) or a scheduled
// timestamp. Draft is the right default anyway: pressing Send in Kit is one
// click, it shows exactly what subscribers will receive, and it makes an
// unrecallable mis-send to real humans structurally impossible. Automating that
// click away would buy nothing and risk everything.

import { readFile } from 'node:fs/promises'
import { basename } from 'node:path'
import { toEntry } from '../src/lib/frontmatter.js'
import { renderEntryHtml } from './email-html.mjs'

const KIT_API = 'https://api.kit.com/v4'
const ENTRY_DIR = 'src/content/journal'

// Accept a bare slug or a full path — typing the whole path every time is a tax
// on writing, and the point is to make posting frictionless.
function resolveEntryPath(arg) {
  if (arg.endsWith('.md')) return arg
  return `${ENTRY_DIR}/${arg}.md`
}

async function main() {
  const args = process.argv.slice(2)
  const dryRun = args.includes('--dry-run')
  const target = args.find((a) => !a.startsWith('--'))

  if (!target) die('usage: npm run draft -- [--dry-run] <slug>')
  const path = resolveEntryPath(target)

  // The site's glob excludes _*.md, but a shell path or a CI path filter will
  // not. The template must never reach anyone's inbox.
  if (basename(path).startsWith('_')) {
    console.log(`skip: ${path} is a template, not an entry`)
    return
  }

  const raw = await readFile(path, 'utf8').catch(() => {
    die(`no entry at ${path}`)
  })
  const entry = toEntry(path, raw)

  // Kit requires subject, description and preview_text. Fail here with something
  // readable rather than shipping a broadcast titled "undefined".
  const missing = ['title', 'date', 'dek'].filter((k) => !entry[k])
  if (missing.length) {
    die(`${path} is missing required frontmatter: ${missing.join(', ')}`)
  }

  const siteUrl = requireEnv('SITE_URL')
  const html = renderEntryHtml(entry, siteUrl)

  if (dryRun) {
    console.log(`--- ${entry.slug} · ${entry.minutes} min · ${entry.date}`)
    console.log(`--- subject: ${entry.title}`)
    console.log(`--- marker:  ${marker(entry.slug)}`)
    console.log(html)
    return
  }

  const apiKey = requireEnv('KIT_API_KEY')

  // Idempotency. You run this by hand, so the obvious mistake is running it
  // twice on the same entry and putting two copies of one post in front of the
  // list. The marker lives in `description`, which subscribers never see, and is
  // keyed on the SLUG (the filename): stable even if the title is edited later,
  // and unique by filesystem guarantee. Never key on the title.
  if (await broadcastExists(apiKey, entry.slug)) {
    console.log(`skip: a broadcast for "${entry.slug}" already exists in Kit`)
    return
  }

  const res = await fetch(`${KIT_API}/broadcasts`, {
    method: 'POST',
    headers: {
      'X-Kit-Api-Key': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      subject: entry.title,
      preview_text: entry.dek,
      description: marker(entry.slug),
      content: html,
      // false: the site is the canonical home. true would republish the post to
      // Kit's own public feed and compete with it in search.
      public: false,
      published_at: new Date(`${entry.date}T09:00:00Z`).toISOString(),
      // null = draft. This is the safety property of the whole pipeline.
      send_at: null,
      subscriber_filter: [],
    }),
  })

  if (!res.ok) {
    const body = await res.text()
    die(`kit rejected the broadcast (${res.status}): ${body.slice(0, 400)}`)
  }

  const data = await res.json()
  const id = data?.broadcast?.id
  console.log(`drafted "${entry.title}" in Kit${id ? ` (broadcast ${id})` : ''}`)
  console.log('open Kit and press Send when you are ready. nothing has been emailed.')
}

function marker(slug) {
  return `journal:${slug}`
}

// Kit paginates broadcasts. At this volume the first page is plenty, but walk a
// few pages so this does not quietly rot as the archive grows.
async function broadcastExists(apiKey, slug) {
  const res = await fetch(`${KIT_API}/broadcasts?per_page=100`, {
    headers: { 'X-Kit-Api-Key': apiKey },
  })
  if (!res.ok) {
    // Fail closed: if we cannot verify, do not risk a duplicate broadcast.
    die(`could not list broadcasts to check for duplicates (${res.status})`)
  }
  const data = await res.json()
  const wanted = marker(slug)
  return (data?.broadcasts || []).some(
    (b) => b?.description === wanted || b?.description?.includes(wanted),
  )
}

function requireEnv(name) {
  const value = process.env[name]
  if (!value) die(`${name} is not set`)
  return value
}

function die(message) {
  console.error(`error: ${message}`)
  process.exit(1)
}

main().catch((err) => die(err?.stack || String(err)))
