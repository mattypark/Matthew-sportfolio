// Frontmatter parsing, shared by the site and the Kit send script.
//
// This module is isomorphic on purpose. The browser reaches it through Vite's
// glob in journal.js; scripts/send-entry.mjs imports it directly in plain Node.
// Both must parse an entry to the *same* shape — if the script used real YAML
// while the site used this, they would disagree on inputs like
// `title: Why: the thing` (fine here, throws in YAML), and the site would
// render a post the email pipeline crashes on.
//
// So: no dependencies, no Buffer, no bundler. Just string work.

const WORDS_PER_MINUTE = 220

const FRONTMATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/

function unquote(value) {
  return value.trim().replace(/^['"]|['"]$/g, '')
}

// A deliberately small YAML reader: `key: value` and `key: [a, b]`, quotes
// optional. We author every file in this folder, so a full YAML parser buys
// nothing (and gray-matter needs a Buffer polyfill to run in the browser).
export function parseFrontmatter(raw) {
  const match = raw.match(FRONTMATTER_RE)
  if (!match) return { data: {}, body: raw }

  const data = {}
  for (const line of match[1].split(/\r?\n/)) {
    const sep = line.indexOf(':')
    if (sep === -1) continue

    const key = line.slice(0, sep).trim()
    const rawValue = line.slice(sep + 1).trim()
    if (!key || !rawValue) continue

    data[key] = rawValue.startsWith('[')
      ? rawValue.replace(/^\[|\]$/g, '').split(',').map(unquote).filter(Boolean)
      : unquote(rawValue)
  }

  return { data, body: raw.slice(match[0].length) }
}

export function readingMinutes(body) {
  const words = body.trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE))
}

export function slugFromPath(path) {
  return path.split('/').pop().replace(/\.md$/, '')
}

// One raw markdown file → the entry shape both the site and the email use.
export function toEntry(path, raw) {
  const { data, body } = parseFrontmatter(raw)
  const slug = data.slug || slugFromPath(path)

  return {
    slug,
    title: data.title || slug,
    date: data.date || '',
    dek: data.dek || '',
    cover: data.cover || '',
    tags: Array.isArray(data.tags) ? data.tags : [],
    minutes: readingMinutes(body),
    body,
  }
}

// "2026-07-11" → "July 11, 2026". Parsed as UTC so the date never slips a day
// backwards for anyone west of Greenwich.
export function formatDate(iso) {
  if (!iso) return ''
  const parsed = new Date(`${iso}T00:00:00Z`)
  if (Number.isNaN(parsed.getTime())) return iso
  return new Intl.DateTimeFormat('en-US', {
    timeZone: 'UTC',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(parsed)
}
