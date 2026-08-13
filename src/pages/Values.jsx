import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { Crosshair, Clocks } from '../components/site/Chrome'
import Nav from '../components/site/Nav'
import '../styles/site.css'

// VALUES — the operating system, written down.
// The typography changed; the text did not. These fourteen strings are
// carried over character for character, apostrophes and dashes included.

const VALUES = [
  'God #1 always. Even if you forget, remind yourself that he is the reason you are here today.',
  'Do. Everything. It gives you more opportunities to do more great things.',
  'Always tell the truth, for it will be better than making the mistake with major guilt.',
  'Why? or why not? Always ask yourself this, and you will find new questions to come.',
  "You will get nowhere running on a treadmill — always grinding, but not advancing.",
  'To do something exceptional, you have to be the exception.',
  'Failure > trying to be perfect. You WILL fail — but will you learn from your failure?',
  'Being cringe is never cringe. Just the saying of it is cringe.',
  'Never put off something tomorrow that can be done today.',
  "The goal isn't to live forever — it's to create something that can live forever.",
  "The wise don't complain about problems, but rather solve them.",
  'Be cautious of what you listen to and consume, for it will shape your mind, your future, and you.',
  "Never trust a person who talks behind another man's back, for you never know what they're saying about you.",
  'You are never behind in life. The closer you get to the sun, the bigger the shadow grows behind you — ignore the shadow, see the light in front of you.',
]

export default function Values({ onLeave }) {
  const root = useRef(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.pg-reveal',
        { y: 22, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.05, ease: 'power3.out', stagger: 0.05, delay: 0.15 },
      )
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={root} className="pg pg-cream">
      <Nav onLeave={onLeave} />

      <header className="vx-head">
        <h1 className="display vx-title pg-reveal">VALUES</h1>
        <p className="prose pg-reveal" style={{ maxWidth: '44ch', marginTop: 22 }}>
          The rules I run on. Written young, kept on purpose.
        </p>
      </header>

      {/* every value on one screen — two columns, no scrolling required */}
      <ol className="vx-grid">
        {VALUES.map((v, i) => (
          <li key={i} className="pg-reveal vx-row">
            <span className="vx-num tabular-nums">{String(i + 1).padStart(2, '0')}</span>
            <span className="vx-text">{v}</span>
          </li>
        ))}
      </ol>

      <div className="foot-rail">
        <span className="eyebrow">Fourteen, and counting</span>
        <span className="eyebrow">
          <a href="mailto:matthew.parkk0@gmail.com" data-hover>
            matthew.parkk0@gmail.com
          </a>
        </span>
      </div>

      <Clocks />
      <Crosshair />
    </div>
  )
}
