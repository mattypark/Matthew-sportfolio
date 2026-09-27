import { now } from '../../data/now'

// ↓ Right now: the three things that are live. data-reveal marks the pieces
// the board reveals one by one after the liquid fills.
export default function NowPanel() {
  return (
    <div className="panel-now">
      <p className="panel__lede" data-reveal>
        Everything else is past results. This is what I’m doing <em className="hand">today</em>.
      </p>
      <div className="now-cards">
        {now.map((n, i) => {
          const Tag = n.href ? 'a' : 'article'
          const link = n.href ? { href: n.href, target: '_blank', rel: 'noopener noreferrer' } : {}
          return (
            <Tag key={n.id} className="now-card" data-reveal {...link}>
              <p className="now-card__meta mono">
                <span>{String(i + 1).padStart(2, '0')}</span>
                <span>
                  {n.role} · since {n.since}
                </span>
              </p>
              <h3 className="now-card__name">
                {n.name}
                {n.href && <span aria-hidden> ↗</span>}
              </h3>
              <p className="now-card__tag hand">{n.tag}</p>
              <p className="now-card__line">{n.line}</p>
            </Tag>
          )
        })}
      </div>
    </div>
  )
}
