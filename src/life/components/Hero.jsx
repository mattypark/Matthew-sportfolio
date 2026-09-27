import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import TextPressure from './TextPressure'
import Typewriter from './Typewriter'
import Clock from './Clock'
import Slot from './Slot'
import NowPlaying from './NowPlaying'
import { status, BIRTHDAY, HOME_TZ, HERITAGE_TZ, HANGUL_NAME } from '../data/site'
import { prefersReducedMotion } from '../hooks/motion'

const ROLES = ['builder', 'creator', 'alto sax player', 'tennis player', 'debater', 'future Stanford kid']

// Photos float around the name at different depths and drift with the pointer.
const CONSTELLATION = [
  { id: 'portrait-suit', x: 74, y: 9, w: 15, depth: 0.9, rot: 2 },
  { id: 'portrait-seoul', x: 3, y: 57, w: 18, depth: 0.6, rot: -3 },
  { id: 'portrait-1', x: 66, y: 68, w: 7, depth: 1.6, rot: -5 },
  { id: 'portrait-3', x: 44, y: 71, w: 11, depth: 0.4, rot: -2 },
]

function ageOn(now = new Date()) {
  const [y, m, d] = BIRTHDAY.split('-').map(Number)
  let age = now.getFullYear() - y
  if (now.getMonth() + 1 < m || (now.getMonth() + 1 === m && now.getDate() < d)) age -= 1
  return age
}

export default function Hero({ ready }) {
  const root = useRef(null)

  // entrance, once the loader has cleared
  useEffect(() => {
    if (!ready || prefersReducedMotion()) return undefined
    const ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: 'expo.out' } })
        .from('.hero__line', { yPercent: 105, duration: 1.1, stagger: 0.08 })
        .from('.hero__sun', { scale: 0, duration: 1.3 }, 0.1)
        .from('.hero__photo', { opacity: 0, y: 40, duration: 1, stagger: 0.07 }, 0.3)
        .from('.hero__meta > *', { opacity: 0, y: 12, duration: 0.7, stagger: 0.05 }, 0.5)
    }, root)
    return () => ctx.revert()
  }, [ready])

  // pointer parallax on the constellation
  useEffect(() => {
    if (prefersReducedMotion() || window.matchMedia('(pointer: coarse)').matches) return undefined
    const photos = [...root.current.querySelectorAll('.hero__photo')]
    const movers = photos.map((p) => ({
      x: gsap.quickTo(p, 'x', { duration: 0.9, ease: 'power3' }),
      y: gsap.quickTo(p, 'y', { duration: 0.9, ease: 'power3' }),
      depth: Number(p.dataset.depth),
    }))
    const onMove = (e) => {
      const dx = e.clientX / window.innerWidth - 0.5
      const dy = e.clientY / window.innerHeight - 0.5
      movers.forEach((m) => {
        m.x(dx * -60 * m.depth)
        m.y(dy * -40 * m.depth)
      })
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  return (
    <section id="top" ref={root} className="hero" aria-labelledby="hero-name">
      <ul className="hero__status" aria-label="Status">
        {status.map((s) => (
          <li key={s.text} className="mono">
            <span className={`dot dot--${s.dot} ${s.pulse ? 'dot--pulse' : ''}`} aria-hidden />
            {s.text}
          </li>
        ))}
      </ul>

      <div className="hero__sun" aria-hidden />

      <div className="hero__photos" aria-hidden>
        {CONSTELLATION.map((p) => (
          <div
            key={p.id}
            className="hero__photo"
            data-depth={p.depth}
            style={{ left: `${p.x}%`, top: `${p.y}%`, width: `${p.w}%`, rotate: `${p.rot}deg` }}
          >
            <Slot id={p.id} eager={p.id === 'portrait-suit'} sizes="20vw" />
          </div>
        ))}
      </div>

      <h1 id="hero-name" className="hero__name">
        <span className="hero__mask">
          <span className="hero__line">
            <TextPressure text="MATTHEW" />
          </span>
        </span>
        <span className="hero__mask">
          <span className="hero__line hero__line--second">
            <TextPressure text="PARK" />
            <span className="hero__hangul" lang="ko">
              {HANGUL_NAME}
            </span>
          </span>
        </span>
      </h1>

      <div className="hero__meta">
        <p className="hero__lede">
          {ageOn()}, from Kentucky, and I do <em className="serif-em">everything</em>.
          <br />
          Right now I&apos;m a <Typewriter phrases={ROLES} className="red" />
        </p>
        <Clock {...HOME_TZ} className="hero__clock hero__clock--home" />
        <Clock {...HERITAGE_TZ} className="hero__clock hero__clock--seoul" />
        <NowPlaying className="hero__np" />
      </div>
    </section>
  )
}
