import { useMemo } from 'react'
import { stats } from '../data/work'
import { timeline, daysSince } from '../data/timeline'
import { BIRTHDAY } from '../data/site'
import { useCountUp, useInView } from '../hooks/motion'

function Stat({ s, on }) {
  const n = useCountUp(s.value, on)
  return (
    <div className="stat">
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

// Every dated moment in 2026 as a square, GitHub-contributions style.
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

// The numbers count up the first time they scroll into view, then the year
// so far as a heatmap. Lives in the Timeline box.
export default function Numbers() {
  const [ref, on] = useInView({ threshold: 0.05 })
  const days = daysSince(BIRTHDAY)

  return (
    <section className="numbers" aria-labelledby="numbers-title">
      <h3 id="numbers-title" className="kit__title">
        By the <em className="serif-em">numbers</em>
      </h3>

      <div ref={ref} className="stats">
        {stats.map((s) => (
          <Stat key={s.label} s={s} on={on} />
        ))}
      </div>

      <Heatmap />

      <p className="numbers__alive mono">
        ≈ {days.toLocaleString()} days alive · {timeline.filter((e) => !e.plan).length} of them on the tape
      </p>
    </section>
  )
}
