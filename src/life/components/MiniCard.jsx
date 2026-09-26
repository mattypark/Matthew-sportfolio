import { useEffect, useState } from 'react'
import { useCountUp, useInView, prefersReducedMotion } from '../hooks/motion'

// Each project card is a tiny live interface instead of a screenshot.

function Counter({ p, on }) {
  const n = useCountUp(p.value, on)
  return (
    <div className="mini mini--counter">
      <span className="mini__big">
        {n}
        <span className="red">{p.suffix}</span>
      </span>
      <span className="mono">{p.label}</span>
    </div>
  )
}

function Bars({ p, on }) {
  return (
    <div className="mini mini--bars">
      <div className="mini__bar" style={{ '--h': `${(p.from / p.to) * 100}%` }} data-on={on}>
        <span className="mono">${p.from}{p.unit}</span>
      </div>
      <div className="mini__bar mini__bar--red" style={{ '--h': '100%' }} data-on={on}>
        <span className="mono">${p.to}{p.unit}</span>
      </div>
      <span className="mini__x">7×</span>
    </div>
  )
}

function Terminal({ p, on }) {
  const [shown, setShown] = useState(() => (prefersReducedMotion() ? p.lines.length : 0))
  useEffect(() => {
    if (!on || prefersReducedMotion()) return undefined
    const id = setInterval(() => setShown((s) => (s >= p.lines.length ? s : s + 1)), 420)
    return () => clearInterval(id)
  }, [on, p.lines.length])
  return (
    <div className="mini mini--terminal" aria-hidden>
      <span className="mini__dots">
        <i />
        <i />
        <i />
      </span>
      {p.lines.slice(0, shown).map((l) => (
        <code key={l}>{l}</code>
      ))}
      <code className="mini__caret">▍</code>
    </div>
  )
}

function Chat({ p }) {
  return (
    <div className="mini mini--chat" aria-hidden>
      <span className="mini__bubble mini__bubble--me">{p.lines[0]}</span>
      <span className="mini__bubble">{p.lines[1]}</span>
    </div>
  )
}

function Poster({ p }) {
  return (
    <div className="mini mini--poster">
      <span className="mini__poster-big">{p.big}</span>
      <span className="mono">{p.label}</span>
    </div>
  )
}

const KINDS = { counter: Counter, bars: Bars, terminal: Terminal, chat: Chat, poster: Poster, price: Poster }

export default function MiniCard({ p, n, total }) {
  const [ref, on] = useInView({ threshold: 0.4 })
  const Face = KINDS[p.card]
  const Tag = p.href ? 'a' : 'article'
  const linkProps = p.href
    ? { href: p.href, ...(p.href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {}) }
    : {}

  return (
    <Tag ref={ref} className={`work-card work-card--${p.id}`} {...linkProps}>
      <Face p={p} on={on} />
      <p className="work-card__meta mono">
        <span>
          {p.kind} · {p.years}
        </span>
        <span>
          #MP-{String(n).padStart(4, '0')} / {String(total).padStart(2, '0')}
        </span>
      </p>
      <h3 className="work-card__name">
        {p.name}
        {p.href && <span className="red"> ↗</span>}
      </h3>
      <p className="work-card__line">
        <span className="mono">{p.role} — </span>
        {p.line}
      </p>
    </Tag>
  )
}
