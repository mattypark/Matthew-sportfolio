// Markdown → email-safe HTML.
//
// Uses the SAME renderer as the site (react-markdown + remark-gfm), so an entry
// cannot render one way on the page and another in the inbox. The difference is
// purely the styling layer: the site gets CSS classes, the email gets inline
// styles, because email clients are a hostile 1999 rendering environment.
//
// Three rules drive every decision below:
//   1. Inline styles only. Gmail strips <style> blocks.
//   2. No pseudo-elements. The site's `—` list bullets (home.css .jr-prose ul
//      li::before) are impossible here, so lists fall back to real bullets.
//   3. No descendant selectors. The site kills the code background inside <pre>
//      with `.jr-prose pre code`; here we have to render <pre> ourselves.
//
// We emit a FRAGMENT, not a document. Kit wraps `content` in the account's email
// template, which supplies <html>, the branding, and the unsubscribe footer.
// Posting a full document would nest a document inside a document.

import { createElement as h } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

// Web fonts do not load in an inbox. Fraunces and JetBrains Mono are out.
const SERIF = "Georgia, 'Times New Roman', serif"
const MONO = "Menlo, Consolas, 'Courier New', monospace"
const INK = '#0a0a0a'
const SLATE = '#6f675b'
const RULE = '#dcdcdc'
const PAPER = '#ffffff'

const s = {
  p: { margin: '0 0 20px', fontSize: '17px', lineHeight: 1.7, color: INK },
  h2: {
    margin: '38px 0 14px',
    fontFamily: MONO,
    fontSize: '12px',
    fontWeight: 600,
    letterSpacing: '0.18em',
    textTransform: 'uppercase',
    color: INK,
  },
  a: { color: INK, textDecoration: 'underline' },
  ul: { margin: '0 0 20px', padding: '0 0 0 22px' },
  li: { margin: '0 0 8px', fontSize: '17px', lineHeight: 1.7, color: INK },
  blockquote: {
    margin: '0 0 20px',
    padding: '2px 0 2px 20px',
    borderLeft: `2px solid ${INK}`,
    fontStyle: 'italic',
    color: INK,
  },
  inlineCode: {
    fontFamily: MONO,
    fontSize: '14px',
    background: '#f0f0f0',
    padding: '1px 5px',
  },
  pre: {
    margin: '0 0 20px',
    padding: '16px 18px',
    background: INK,
    color: PAPER,
    fontFamily: MONO,
    fontSize: '13px',
    lineHeight: 1.6,
    overflowX: 'auto',
  },
  hr: { border: 0, borderTop: `1px solid ${RULE}`, margin: '32px 0' },
  img: { maxWidth: '100%', height: 'auto', display: 'block', margin: '0 0 20px' },
  table: { width: '100%', borderCollapse: 'collapse', margin: '0 0 20px', fontSize: '15px' },
  th: { border: `1px solid ${RULE}`, padding: '8px 10px', textAlign: 'left', background: '#f7f7f7' },
  td: { border: `1px solid ${RULE}`, padding: '8px 10px' },
}

// Pull the raw text out of a hast node. Used for fenced code blocks, where we
// have to bypass the `code` component entirely (see `pre` below).
function textOf(node) {
  if (!node) return ''
  if (node.type === 'text') return node.value
  return (node.children || []).map(textOf).join('')
}

const components = {
  p: ({ children }) => h('p', { style: s.p }, children),
  h1: ({ children }) => h('h2', { style: s.h2 }, children),
  h2: ({ children }) => h('h2', { style: s.h2 }, children),
  h3: ({ children }) => h('h2', { style: s.h2 }, children),
  a: ({ href, children }) => h('a', { href, style: s.a }, children),
  strong: ({ children }) => h('strong', { style: { fontWeight: 700 } }, children),
  em: ({ children }) => h('em', { style: { fontStyle: 'italic' } }, children),
  ul: ({ children }) => h('ul', { style: s.ul }, children),
  ol: ({ children }) => h('ol', { style: s.ul }, children),
  li: ({ children }) => h('li', { style: s.li }, children),
  hr: () => h('hr', { style: s.hr }),
  img: ({ src, alt }) => h('img', { src, alt: alt || '', style: s.img }),
  table: ({ children }) => h('table', { style: s.table }, children),
  th: ({ children }) => h('th', { style: s.th }, children),
  td: ({ children }) => h('td', { style: s.td }, children),

  // The site zeroes the inner <p>'s margin with a descendant selector. We have
  // no such thing, so strip the wrapper and inline the text.
  blockquote: ({ children }) => h('blockquote', { style: s.blockquote }, children),

  // A fenced block arrives as pre > code. If we let the `code` component style
  // it, we get a padded grey box nested inside the dark block. So `pre` reads
  // the text straight off the hast node and renders its own <code>, and the
  // `code` component below then only ever sees INLINE code.
  pre: ({ node }) =>
    h('pre', { style: s.pre }, h('code', { style: { fontFamily: MONO } }, textOf(node))),

  code: ({ children }) => h('code', { style: s.inlineCode }, children),
}

// A blockquote's child <p> carries a bottom margin, leaving dead space inside
// the quote rule. Cheapest reliable fix: collapse it after render.
function tightenBlockquotes(html) {
  return html.replace(
    /(<blockquote[^>]*>)([\s\S]*?)(<\/blockquote>)/g,
    (_, open, inner, close) =>
      open + inner.replace(/margin:0 0 20px/g, 'margin:0') + close,
  )
}

// Relative URLs are dead in an inbox. Every href="/x" and src="/x" — including
// every entry's cover image — has to become an absolute URL on the live site.
function absolutize(html, siteUrl) {
  const base = siteUrl.replace(/\/$/, '')
  return html.replace(/(href|src)="\/(?!\/)/g, `$1="${base}/`)
}

// The entry body, rendered as an email-ready HTML fragment.
export function renderEntryHtml(entry, siteUrl) {
  const body = renderToStaticMarkup(
    h(ReactMarkdown, { remarkPlugins: [remarkGfm], components }, entry.body),
  )

  const url = `${siteUrl.replace(/\/$/, '')}/journal/${entry.slug}`

  const cover = entry.cover
    ? `<img src="${entry.cover}" alt="" style="max-width:100%;height:auto;display:block;margin:0 0 28px;border:1px solid ${RULE}" />`
    : ''

  // Explicit color + background on the wrapper: without them, Apple Mail and
  // Gmail dark-mode auto-inversion can land on unreadable contrast.
  const fragment = `
<div style="max-width:600px;margin:0 auto;padding:8px 0;background:${PAPER};color:${INK};font-family:${SERIF}">
  ${cover}
  <p style="margin:0 0 6px;font-family:${MONO};font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:${SLATE}">
    Journal · ${entry.minutes} min read
  </p>
  <h1 style="margin:0 0 14px;font-size:32px;line-height:1.15;font-weight:normal;color:${INK}">
    ${escapeHtml(entry.title)}
  </h1>
  <p style="margin:0 0 32px;font-family:${MONO};font-size:13px;line-height:1.7;color:${SLATE}">
    ${escapeHtml(entry.dek)}
  </p>

  ${body}

  <hr style="border:0;border-top:1px solid ${RULE};margin:40px 0 20px" />
  <p style="margin:0;font-family:${MONO};font-size:12px;line-height:1.7;color:${SLATE}">
    Read this on the site: <a href="${url}" style="color:${INK}">${url}</a>
  </p>
</div>`.trim()

  return absolutize(tightenBlockquotes(fragment), siteUrl)
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
