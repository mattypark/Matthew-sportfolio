import { useMemo } from 'react'
import { stats, proofLogos } from '../data/work'
import { timeline, daysSince } from '../data/timeline'
import { BIRTHDAY } from '../data/site'
import { useCountUp, useInView } from '../hooks/motion'

function Stat({ s, on, hero }) {
  const n = useCountUp(s.value, on)
  return (
    <div className={`stat ${hero ? 'stat--hero' : ''}`}>
      <span className="stat__n">
        {s.prefix}
        {n}
        <span className="red">{s.suffix}</span>
      </span>
      <span className="stat__label">{s.label}</span>
      <span className="stat__src mono">{s.source}</span>
    </div>
  )
}

// Every dated moment in 2026 as a red square, GitHub-contributions style.
function Heatmap() {
  const { weeks, hits } = useMemo(() => {
    const hitSet = new Map()
    timeline
      .filter((e) => !e.plan && e.date.startsWith('2026'))
      .forEach((e) => hitSet.set(e.date, (hitSet.get(e.date) ?? []).concat(e.title)))
    const start = new Date(2026, 0, 1)
    start.setDate(start.getDate() - start.getDay())
    const cols = []
    for (let w = 0; w < 53; w += 1) {
      const col = []
      for (let d = 0; d < 7; d += 1) {
        const day = new Date(start)
        day.setDate(start.getDate() + w * 7 + d)
        const iso = `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, '0')}-${String(day.getDate()).padStart(2, '0')}`
        col.push({ iso, inYear: day.getFullYear() === 2026, titles: hitSet.get(iso) })
      }
      cols.push(col)
    }
    return { weeks: cols, hits: [...hitSet.values()].flat().length }
  }, [])

  return (
    <figure className="heat">
      <div className="heat__grid" role="img" aria-label={`${hits} logged moments in 2026`}>
        {weeks.map((col, w) => (
          <div key={w} className="heat__col">
            {col.map((d) => (
              <span
                key={d.iso}
                className={`heat__cell ${d.titles ? 'is-hit' : ''} ${d.inYear ? '' : 'is-out'}`}
                title={d.titles ? `${d.iso} — ${d.titles.join(' · ')}` : undefined}
              />
            ))}
          </div>
        ))}
      </div>
      <figcaption className="mono heat__cap">
        2026 so far · {hits} things worth writing down · one square = one day
      </figcaption>
    </figure>
  )
}

export default function Numbers() {
  const [ref, on] = useInView({ threshold: 0.25 })
  const days = daysSince(BIRTHDAY)

  return (
    <section id="numbers" className="sec sec--ink numbers" aria-labelledby="numbers-title">
      <div className="sec-head">
        <p className="sec-index">04 / Numbers</p>
        <h2 id="numbers-title" className="sec-title">
          Receipts, <em className="serif-em">not vibes</em>
        </h2>
      </div>

      <div ref={ref} className="stats">
        {stats.map((s, i) => (
          <Stat key={s.label} s={s} on={on} hero={i === 0} />
        ))}
      </div>

      <Heatmap />

      <p className="numbers__alive mono">
        ≈ {days.toLocaleString()} days alive · {timeline.filter((e) => !e.plan).length} of them on the tape
      </p>

      <div className="proof" aria-label="Places and programs">
        <p className="mono proof__label">
          <span className="proof__eyes" aria-hidden>
            ●●
          </span>{' '}
          as seen at
        </p>
        <div className="proof__viewport">
          <ul className="proof__track">
            {[...proofLogos, ...proofLogos].map((name, i) => (
              <li key={`${name}-${i}`} aria-hidden={i >= proofLogos.length}>
                {name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
