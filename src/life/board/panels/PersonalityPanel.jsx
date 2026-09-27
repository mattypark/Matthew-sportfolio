import { values } from '../../data/work'
import NowPlaying from '../../components/NowPlaying'

const OFF_CLOCK = ['Tennis since 2021', 'Alto sax, All-State ×2', 'Drums', 'Guitar', 'Singing', 'Basketball', 'Calisthenics']

// → Personality: a placeholder until Matthew decides what goes here. Seeded
// with his values, what's on repeat, and what he does off the keyboard.
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

      <ol className="values-mini">
        {values.slice(0, 6).map((v, i) => (
          <li key={v.text} data-reveal>
            <span className="mono">{String(i + 1).padStart(2, '0')}</span> {v.text}
          </li>
        ))}
      </ol>
    </div>
  )
}
