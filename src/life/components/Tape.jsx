import { useMemo, useState } from 'react'
import Slot from './Slot'
import { timeline, CHAPTERS, stamp, yearOf, todayStamp } from '../data/timeline'

const past = timeline.filter((e) => !e.plan)
const future = timeline.filter((e) => e.plan)
const YEARS = [...new Set(past.map(yearOf))]
const ALL = 'all'

function Card({ e, n }) {
  const Tag = e.link ? 'a' : 'article'
  const linkProps = e.link
    ? { href: e.link, ...(e.link.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {}) }
    : {}
  return (
    <Tag className={`tape__card ${e.big ? 'tape__card--big' : ''} ${e.plan ? 'tape__card--plan' : ''}`} {...linkProps}>
      {e.big && e.slot && <Slot id={e.slot} className="tape__media" sizes="420px" />}
      <p className="tape__meta mono">
        <span className={`chip chip--${e.chapter}`}>{CHAPTERS[e.chapter]}</span>
        <span>{e.plan ? 'someday' : stamp(e.date)}</span>
        <span className="tape__no">#{String(n).padStart(3, '0')}</span>
      </p>
      <h3 className="tape__title">
        {e.title}
        {e.link && <span className="tape__arrow"> ↗</span>}
      </h3>
      {e.note && <p className="tape__note">{e.note}</p>}
    </Tag>
  )
}

// The full life tape, on its own page: a chronological card grid you can
// narrow to one year or one chapter.
export default function Tape() {
  const [year, setYear] = useState(ALL)
  const [chapter, setChapter] = useState(ALL)

  const shown = useMemo(
    () =>
      past
        .map((e, i) => ({ e, n: i + 1 }))
        .filter(({ e }) => (year === ALL || yearOf(e) === year) && (chapter === ALL || e.chapter === chapter)),
    [year, chapter],
  )
  const chapters = Object.keys(CHAPTERS).filter((c) => past.some((e) => e.chapter === c))
  const filtered = year !== ALL || chapter !== ALL

  let lastYear = null

  return (
    <section id="tape" className="tape sec--paper" aria-labelledby="tape-title">
      <div className="tape__head">
        <p className="sec-index">The tape</p>
        <h1 id="tape-title" className="sec-title">
          Every step, <em className="serif-em">in order.</em>
        </h1>
        <p className="tape__count mono">
          {past.length} moments · 2010 → {todayStamp()}
        </p>
      </div>

      <div className="tape__filters" role="group" aria-label="Filter the tape">
        <div className="tape__chips">
          {[ALL, ...YEARS].map((y) => (
            <button
              key={y}
              type="button"
              className={`fchip mono ${year === y ? 'is-on' : ''}`}
              aria-pressed={year === y}
              onClick={() => setYear(y)}
            >
              {y === ALL ? 'All years' : y}
            </button>
          ))}
        </div>
        <div className="tape__chips">
          {[ALL, ...chapters].map((c) => (
            <button
              key={c}
              type="button"
              className={`fchip mono ${chapter === c ? 'is-on' : ''}`}
              aria-pressed={chapter === c}
              onClick={() => setChapter(c)}
            >
              {c === ALL ? 'Everything' : CHAPTERS[c]}
            </button>
          ))}
        </div>
      </div>

      <div className="tape__track" aria-live="polite">
        {shown.map(({ e, n }) => {
          const y = yearOf(e)
          const newYear = !filtered && y !== lastYear
          lastYear = y
          return (
            <FragmentWithYear key={`${e.date}-${e.title}`} year={newYear ? y : null}>
              <Card e={e} n={n} />
            </FragmentWithYear>
          )
        })}
        {shown.length === 0 && <p className="mono tape__empty">Nothing in that combo — yet.</p>}

        {!filtered && (
          <>
            <div className="tape__now" aria-label="Today">
              <span className="dot dot--red dot--pulse" aria-hidden />
              <p className="mono">Now · {todayStamp()}</p>
              <p className="tape__now-q">???</p>
            </div>
            {future.map((e, i) => (
              <Card key={e.title} e={e} n={past.length + i + 1} />
            ))}
          </>
        )}
      </div>
    </section>
  )
}

function FragmentWithYear({ year, children }) {
  return (
    <>
      {year && (
        <div className="tape__year" aria-hidden>
          {year}
        </div>
      )}
      {children}
    </>
  )
}
