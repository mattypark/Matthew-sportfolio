import MiniCard from './MiniCard'
import Marker from './Marker'
import Slot from './Slot'
import { projects, everything } from '../data/work'

const REELS = ['reel-1', 'reel-2', 'reel-3', 'reel-4', 'reel-5', 'reel-6']

export default function Built() {
  return (
    <section id="built" className="sec sec--paper built" aria-labelledby="built-title">
      <div className="sec-head">
        <p className="sec-index">03 / Built</p>
        <h2 id="built-title" className="sec-title">
          Things I <Marker kind="circle">shipped</Marker>
        </h2>
      </div>

      <div className="built__grid">
        {projects.map((p, i) => (
          <MiniCard key={p.id} p={p} n={i + 1} total={projects.length} />
        ))}
      </div>

      <div className="reels" aria-labelledby="reels-title">
        <div className="reels__head">
          <h3 id="reels-title" className="reels__title">
            30M views, <em className="serif-em">give or take</em>
          </h3>
          <p className="mono reels__sub">Short-form · UGC · a YouTube documentary</p>
        </div>
        <div className="reels__row">
          {REELS.map((id) => (
            <Slot key={id} id={id} className="reels__item" sizes="220px" />
          ))}
        </div>
      </div>

      <div className="everything" aria-labelledby="everything-title">
        <p id="everything-title" className="sec-index">Everything, flattened</p>
        <ul className="everything__list">
          {everything.map((name, i) => (
            <li key={name} className="everything__row">
              <span className="everything__n mono">{String(i + 1).padStart(2, '0')}</span>
              <span className="everything__name">{name}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
