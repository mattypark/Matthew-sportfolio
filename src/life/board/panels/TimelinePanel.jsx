import { Link } from 'react-router-dom'
import { timeline, stamp } from '../../data/timeline'
import { everything } from '../../data/work'
import gh from '../../data/github.json'

const past = timeline.filter((e) => !e.plan)
// the big moments only; the whole tape is one click away
const HIGHLIGHTS = past.filter((e) => e.big).reverse()

// ← Timeline: past results. Highlights by date, past projects, and the doors
// to the full tape, the long-form archive, and GitHub.
export default function TimelinePanel() {
  return (
    <div className="panel-timeline">
      <p className="panel__lede" data-reveal>
        {past.length} moments since 10.12.10. Here are the <em className="hand">big ones</em>.
      </p>

      <ol className="tl-list">
        {HIGHLIGHTS.map((e) => (
          <li key={`${e.date}-${e.title}`} className="tl-row" data-reveal>
            <span className="tl-row__date mono">{stamp(e.date)}</span>
            <span className="tl-row__title">{e.title}</span>
          </li>
        ))}
      </ol>

      <div className="tl-past" data-reveal>
        <p className="mono tl-past__h">Past projects</p>
        <ul className="tl-past__list">
          {everything.slice(0, 9).map((p) => (
            <li key={p.name} title={p.line ?? undefined}>
              {p.name}
            </li>
          ))}
        </ul>
      </div>

      <div className="panel__doors" data-reveal>
        <Link to="/tape" className="door">
          The full tape <span aria-hidden>→</span>
        </Link>
        <a href={gh.url} target="_blank" rel="noopener noreferrer" className="door">
          Everything else is on GitHub <span aria-hidden>↗</span>
        </a>
        <Link to="/archive" className="door door--quiet">
          The long version <span aria-hidden>→</span>
        </Link>
      </div>
    </div>
  )
}
