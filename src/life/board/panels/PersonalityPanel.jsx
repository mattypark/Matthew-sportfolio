import Kit from './Kit'
import NowPlaying from '../../components/NowPlaying'
import Manifesto from '../../components/Manifesto'
import Values from '../../components/Values'

const OFF_CLOCK = ['Tennis since 2021', 'Alto sax, All-State ×2', 'Drums', 'Guitar', 'Singing', 'Basketball', 'Calisthenics']

// → Personality: still a work in progress until Matthew decides what goes
// here. What's on repeat, off the keyboard, why he does it all, and the 14.
export default function PersonalityPanel() {
  return (
    <div className="panel-personality">
      <p className="panel__lede" data-reveal>
        Work in progress — like me. <em className="hand">More soon.</em>
      </p>

      <div data-reveal>
        <NowPlaying className="panel-np" />
      </div>

      <ul className="chips" data-reveal>
        {OFF_CLOCK.map((c) => (
          <li key={c}>{c}</li>
        ))}
      </ul>

      <Kit label="Why">
        <Manifesto />
      </Kit>

      <Kit label="Values">
        <Values />
      </Kit>
    </div>
  )
}
