import { Link } from 'react-router-dom'
import Kit from './Kit'
import TapeTeaser from '../../components/TapeTeaser'
import Numbers from '../../components/Numbers'
import Marquee from '../../components/Marquee'
import MiniCard from '../../components/MiniCard'
import Everything from '../../components/Everything'
import GitHub from '../../components/GitHub'
import { timeline, stamp } from '../../data/timeline'
import { projects } from '../../data/work'
import gh from '../../data/github.json'

const past = timeline.filter((e) => !e.plan)
// the big moments only; the whole tape is one click away
const HIGHLIGHTS = past.filter((e) => e.big).reverse()
// the LUT is a shop item and nothing on the board links to the shop
const BUILT = projects.filter((p) => p.id !== 'lut')

// ← Timeline: past results. The big moments, the latest from the tape, the
// numbers, what got built, GitHub, and the doors to the rest.
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

      <Kit label="Latest on the tape">
        <TapeTeaser />
      </Kit>

      <Kit label="Numbers">
        <Numbers />
      </Kit>

      <Kit className="kit--bleed">
        <Marquee text="BUILDER ✱ CREATOR ✱ SAX ✱ TENNIS ✱ DEBATE ✱ " />
      </Kit>

      <Kit label="Built">
        <h3 className="kit__title">
          Things I <em className="serif-em">shipped</em>
        </h3>
        <div className="built__grid">
          {BUILT.map((p, i) => (
            <MiniCard key={p.id} p={p} n={i + 1} total={BUILT.length} />
          ))}
        </div>
      </Kit>

      <Kit>
        <Everything />
      </Kit>

      <Kit label="GitHub">
        <GitHub />
      </Kit>

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
