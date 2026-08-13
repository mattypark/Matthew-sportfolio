import { Link } from 'react-router-dom'
import { formatDate } from '../../lib/frontmatter'

// One card in the journal grid: cover on top, title and meta beneath.
//
// `eager` is passed for the first row only — those are above the fold and should
// not wait for the intersection observer.
//
// When an entry has no cover yet, we do NOT render a hole. We set the title
// large in Fraunces on paper instead, so a post can go up before its artwork
// exists and the grid still reads as a grid.

const COVER_W = 800
const COVER_H = 500

export default function JournalCard({ entry, eager = false }) {
  return (
    <li className="l-reveal jr-cell">
      <Link to={`/journal/${entry.slug}`} data-hover className="jr-card">
        <div className="jr-card-cover">
          {entry.cover ? (
            <img
              src={entry.cover}
              alt=""
              width={COVER_W}
              height={COVER_H}
              loading={eager ? 'eager' : 'lazy'}
              fetchpriority={eager ? 'high' : undefined}
              decoding="async"
            />
          ) : (
            <span className="jr-card-fallback" aria-hidden="true">
              {entry.title}
            </span>
          )}
        </div>

        <div className="jr-card-body">
          <h3 className="jr-card-title">{entry.title}</h3>
          {entry.dek && <p className="jr-card-dek">{entry.dek}</p>}
          <p className="jr-card-meta tabular-nums">
            <time dateTime={entry.date}>{formatDate(entry.date)}</time>
            <span aria-hidden="true"> · </span>
            <span>{entry.minutes} min</span>
          </p>
        </div>
      </Link>
    </li>
  )
}
