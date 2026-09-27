import MiniCard from './MiniCard'
import Marker from './Marker'
import ContentStrip from './ContentStrip'
import Everything from './Everything'
import { projects } from '../data/work'

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

      <ContentStrip />
      <Everything />
    </section>
  )
}
