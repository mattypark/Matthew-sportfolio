// THE JOURNAL — entries live as plain markdown files in src/content/journal/.
//
// Drop a new .md file in, commit, push. Vercel rebuilds and it is on the site,
// and the GitHub Action drafts the email in Kit. No CMS, no database.
//
// That is deliberate: a year of these should concatenate into a manuscript, and
// plaintext is the only format that will still open in 2036.
//
// This module is the browser half — it hands the raw files to the shared parser
// in frontmatter.js, which scripts/send-entry.mjs also uses. Same parser both
// sides, so what you read on the site is what lands in the inbox.
//
// Files starting with an underscore (_template.md) are excluded from the bundle
// entirely — they are notes to self, not drafts to ship.

import { toEntry } from './frontmatter'

export { formatDate } from './frontmatter'

const FILES = import.meta.glob(['../content/journal/*.md', '!../content/journal/_*.md'], {
  query: '?raw',
  import: 'default',
  eager: true,
})

// Parse once at module load — the glob is eager, so the files are already here.
const ENTRIES = Object.entries(FILES)
  .map(([path, raw]) => toEntry(path, raw))
  .sort((a, b) => b.date.localeCompare(a.date))

export function getEntries() {
  return ENTRIES
}

export function getEntry(slug) {
  return ENTRIES.find((entry) => entry.slug === slug) || null
}
