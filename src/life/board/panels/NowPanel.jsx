import Kit from './Kit'
import MiniCard from '../../components/MiniCard'
import Typewriter from '../../components/Typewriter'
import ContentStrip from '../../components/ContentStrip'
import Next from '../../components/Next'
import { now } from '../../data/now'

const WHEN = ['today', 'this week', 'right now']

// the now entries in the project-card shape, so each gets a live mini UI
const CARDS = now.map((n) => ({ ...n, kind: n.tag, years: `since ${n.since}` }))

// ↓ Right now: the three things that are live, the content side, and where
// it's all heading.
export default function NowPanel() {
  return (
    <div className="panel-now">
      <p className="panel__lede" data-reveal>
        Everything else is past results. This is what I’m doing{' '}
        <Typewriter phrases={WHEN} className="hand" />
      </p>

      <div className="now-cards">
        {CARDS.map((p, i) => (
          <div key={p.id} className="kit kit--tight" data-reveal>
            <MiniCard p={p} n={i + 1} total={CARDS.length} />
          </div>
        ))}
      </div>

      <Kit label="Content">
        <ContentStrip
          title={
            <>
              30K and <em className="serif-em">counting</em>
            </>
          }
        />
      </Kit>

      <Kit label="Next">
        <Next />
      </Kit>
    </div>
  )
}
