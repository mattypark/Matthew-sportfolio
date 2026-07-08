import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { Crosshair, useClock } from './WorkSite'
import BackButton from './BackButton'
import './home.css'

// VALUES — the operating system, written down.
// Same quiet grammar as the minimal side: white, black, one column,
// numbered mono lines that arrive one by one.

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

export default function ValuesPage() {
  const root = useRef(null)
  const local = useClock('America/New_York')
  const away = useClock('Asia/Seoul')

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.l-reveal',
        { y: 22, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.05, ease: 'power3.out', stagger: 0.08, delay: 0.2 },
      )
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={root} className="home-left relative min-h-[100svh] px-6 pb-24 md:px-[5vw]">
      <BackButton />

      <header className="pt-[11vh] pb-[5vh]">
        <h1 className="l-reveal font-mono text-[clamp(16px,1.4vw,20px)] font-medium tracking-[0.14em] uppercase">
          Values
        </h1>
        <p className="l-reveal mt-3 max-w-[52ch] font-mono text-[12px] leading-[1.8] text-slate">
          The rules I run on. Written young, kept on purpose.
        </p>
      </header>

      {/* every value on one screen — two columns, no scrolling required */}
      <ol className="vl-grid">
        {VALUES.map((v, i) => (
          <li key={i} className="l-reveal vl-row">
            <span className="vl-num tabular-nums">{String(i + 1).padStart(2, '0')}</span>
            <span className="vl-text">{v}</span>
          </li>
        ))}
      </ol>

      <span className="ok-clock ok-clock-left tabular-nums">Louisville {local}</span>
      <span className="ok-clock ok-clock-right tabular-nums">Seoul {away}</span>

      <Crosshair />
    </div>
  )
}
