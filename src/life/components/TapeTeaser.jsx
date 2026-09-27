import { Link } from 'react-router-dom'
import { timeline, CHAPTERS, stamp } from '../data/timeline'

const past = timeline.filter((e) => !e.plan)
const LATEST = past.slice(-4).reverse()

// The home page only shows the last few moments; the whole tape is /tape.
export default function TapeTeaser() {
  return (
    <section id="tape" className="sec sec--paper teaser" aria-labelledby="teaser-title">
      <div className="sec-head">
        <p className="sec-index">02 / The tape</p>
        <h2 id="teaser-title" className="sec-title">
          Every step, <em className="serif-em">in order.</em>
        </h2>
      </div>

      <ol className="teaser__list">
        {LATEST.map((e) => (
          <li key={`${e.date}-${e.title}`} className="teaser__row">
            <span className="mono teaser__date">{stamp(e.date)}</span>
            <span className={`chip chip--${e.chapter} mono`}>{CHAPTERS[e.chapter]}</span>
            <span className="teaser__title">{e.title}</span>
          </li>
        ))}
      </ol>

      <Link to="/tape" className="teaser__cta">
        <span>
          See all {past.length} moments, <em className="serif-em">born → now</em>
        </span>
        <span className="teaser__arrow" aria-hidden>
          →
        </span>
      </Link>
    </section>
  )
}
