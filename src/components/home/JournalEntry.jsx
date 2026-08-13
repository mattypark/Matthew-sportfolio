import { useEffect, useRef } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { gsap } from 'gsap'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import Subscribe from './Subscribe'
import { Crosshair } from './WorkSite'
import { getEntries, getEntry, formatDate } from '../../lib/journal'
import './home.css'

// GFM buys tables, strikethrough, task lists and bare-URL autolinking. The Kit
// send script loads the same plugin, so an entry renders identically in the
// inbox and on the page.
const PLUGINS = [remarkGfm]

// THE JOURNAL — one entry.
// A reading page, so it breaks the site's mono default: Fraunces at reading
// size, one narrow measure, generous leading. The chrome gets out of the way.

export default function JournalEntry() {
  const { slug } = useParams()
  const root = useRef(null)
  const entry = getEntry(slug)

  useEffect(() => {
    if (!entry) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.l-reveal',
        { y: 18, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.95, ease: 'power3.out', stagger: 0.1, delay: 0.1 },
      )
    }, root)
    return () => ctx.revert()
  }, [entry])

  if (!entry) return <Navigate to="/journal" replace />

  // neighbours, in reading order (list is newest-first)
  const entries = getEntries()
  const i = entries.findIndex((e) => e.slug === entry.slug)
  const newer = i > 0 ? entries[i - 1] : null
  const older = i < entries.length - 1 ? entries[i + 1] : null

  return (
    <div ref={root} className="home-left relative min-h-[100svh] px-6 pb-24 md:px-[5vw]">
      <Link to="/journal" data-hover className="back-btn" aria-label="Back to the journal">
        <span className="back-btn-arrow" aria-hidden="true">
          ←
        </span>
        <span className="back-btn-label">journal</span>
      </Link>

      <article className="jr-article">
        {entry.cover && (
          <figure className="l-reveal jr-article-cover">
            <img
              src={entry.cover}
              alt=""
              width={1200}
              height={750}
              loading="eager"
              fetchpriority="high"
              decoding="async"
            />
          </figure>
        )}

        <header className="jr-article-head">
          <div className="l-reveal jr-article-meta tabular-nums">
            <time dateTime={entry.date}>{formatDate(entry.date)}</time>
            <span aria-hidden="true">·</span>
            <span>{entry.minutes} min read</span>
          </div>
          <h1 className="l-reveal jr-article-title">{entry.title}</h1>
          {entry.dek && <p className="l-reveal jr-article-dek">{entry.dek}</p>}
        </header>

        <div className="l-reveal jr-prose">
          <ReactMarkdown remarkPlugins={PLUGINS}>{entry.body}</ReactMarkdown>
        </div>

        {entry.tags.length > 0 && (
          <ul className="jr-tags" aria-label="Tags">
            {entry.tags.map((tag) => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>
        )}
      </article>

      <div className="jr-article-foot">
        <Subscribe />

        {(newer || older) && (
          <nav className="jr-pager" aria-label="More entries">
            {older ? (
              <Link to={`/journal/${older.slug}`} data-hover className="jr-pager-link">
                <span className="jr-pager-key">← older</span>
                <span className="jr-pager-title">{older.title}</span>
              </Link>
            ) : (
              <span />
            )}
            {newer && (
              <Link
                to={`/journal/${newer.slug}`}
                data-hover
                className="jr-pager-link jr-pager-next"
              >
                <span className="jr-pager-key">newer →</span>
                <span className="jr-pager-title">{newer.title}</span>
              </Link>
            )}
          </nav>
        )}
      </div>

      <Crosshair />
    </div>
  )
}
