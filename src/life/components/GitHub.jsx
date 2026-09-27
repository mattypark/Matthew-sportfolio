import { useMemo } from 'react'
import gh from '../data/github.json'

// Built in public: the contribution graph and repos, from a build-time
// snapshot (scripts/github-snapshot.mjs) so the page never calls GitHub.

const LEVELS = [0, 1, 3, 6, 10] // contributions/day thresholds for shades 0-4

function level(n) {
  let l = 0
  LEVELS.forEach((t, i) => {
    if (n >= t && t > 0) l = i
  })
  return l
}

function ago(iso) {
  const days = Math.floor((Date.now() - new Date(iso)) / 86_400_000)
  if (days < 1) return 'today'
  if (days === 1) return 'yesterday'
  if (days < 30) return `${days}d ago`
  const months = Math.floor(days / 30)
  return `${months}mo ago`
}

function Repo({ r, n }) {
  return (
    <a className="repo" href={r.url} target="_blank" rel="noopener noreferrer">
      <p className="repo__meta mono">
        <span>{String(n).padStart(2, '0')}</span>
        <span>{r.language ?? '—'}</span>
        <span>pushed {ago(r.pushedAt)}</span>
      </p>
      <h3 className="repo__name">
        {r.name}
        <span className="red"> ↗</span>
      </h3>
      <p className="repo__desc">{r.description ?? 'No description yet — the code says it all.'}</p>
    </a>
  )
}

export default function GitHub() {
  const busiest = useMemo(
    () => gh.weeks.flat().reduce((best, d) => (d[1] > best[1] ? d : best), ['', 0]),
    [],
  )

  return (
    <section id="github" className="sec sec--ink github" aria-labelledby="github-title">
      <div className="sec-head">
        <p className="sec-index">04 / GitHub</p>
        <h2 id="github-title" className="sec-title">
          Built in <em className="serif-em">public</em>
        </h2>
      </div>

      <p className="github__line">
        <span className="red">{gh.contributionsLastYear.toLocaleString()}</span> contributions in the last year ·{' '}
        {gh.publicRepos} public repos
      </p>

      <figure className="gh-graph">
        <div className="gh-graph__grid" role="img" aria-label={`${gh.contributionsLastYear} contributions in the last year`}>
          {gh.weeks.map((week, w) => (
            <div key={w} className="gh-graph__col">
              {week.map(([date, count]) => (
                <span
                  key={date}
                  className={`gh-graph__cell l${level(count)}`}
                  title={`${date} — ${count} contribution${count === 1 ? '' : 's'}`}
                />
              ))}
            </div>
          ))}
        </div>
        <figcaption className="mono gh-graph__cap">
          <span>
            Busiest day: {busiest[0]} · {busiest[1]} contributions
          </span>
          <span className="gh-graph__legend" aria-hidden>
            less <i className="l0" />
            <i className="l1" />
            <i className="l2" />
            <i className="l3" />
            <i className="l4" /> more
          </span>
        </figcaption>
      </figure>

      <p className="sec-index github__sub">Pinned</p>
      <div className="repos">
        {gh.pinned.map((r, i) => (
          <Repo key={r.name} r={r} n={i + 1} />
        ))}
      </div>

      <p className="sec-index github__sub">Latest pushes</p>
      <ul className="gh-recent">
        {gh.recent.map((r) => (
          <li key={r.name}>
            <a href={r.url} target="_blank" rel="noopener noreferrer">
              <span className="gh-recent__name">{r.name}</span>
              <span className="mono gh-recent__meta">
                {r.language ?? '—'} · {ago(r.pushedAt)}
              </span>
            </a>
          </li>
        ))}
      </ul>

      <a className="gh-follow mono" href={gh.url} target="_blank" rel="noopener noreferrer">
        github.com/{gh.login} ↗
      </a>
    </section>
  )
}
