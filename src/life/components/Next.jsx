import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { prefersReducedMotion } from '../hooks/motion'
import { useScroller } from '../board/scroller'

gsap.registerPlugin(ScrollTrigger)

// The route so far and the route planned, drawn as one hand-made line. Solid
// where it happened, dashed where it hasn't yet. Draws itself on scroll.
const STOPS = [
  { x: 60, y: 250, label: 'Kentucky', sub: '10.12.10', done: true },
  { x: 250, y: 120, label: 'Tennis, sax, debate', sub: '2021 — ', done: true },
  { x: 470, y: 220, label: 'Axiom · Prayer Lock', sub: '2025 — 26', done: true },
  { x: 640, y: 90, label: 'Stanford', sub: 'next', done: false },
  { x: 820, y: 210, label: 'San Francisco', sub: 'then', done: false },
  { x: 985, y: 110, label: 'NYC → the world', sub: 'after', done: false },
]

const PAST = 'M 60 250 C 120 170, 180 90, 250 120 S 390 270, 470 220'
const FUTURE = 'M 470 220 C 540 180, 580 60, 640 90 S 760 250, 820 210 S 940 70, 985 110'

export default function Next() {
  const root = useRef(null)
  const scroller = useScroller()

  useEffect(() => {
    if (prefersReducedMotion()) return undefined
    const ctx = gsap.context(() => {
      const past = root.current.querySelector('.route__past')
      const len = past.getTotalLength()
      gsap.fromTo(
        past,
        { strokeDasharray: len, strokeDashoffset: len },
        {
          strokeDashoffset: 0,
          ease: 'none',
          scrollTrigger: { trigger: '.route', scroller, start: 'top 75%', end: 'center 45%', scrub: 0.6 },
        },
      )
      gsap.from('.route__future', {
        opacity: 0,
        ease: 'none',
        scrollTrigger: { trigger: '.route', scroller, start: 'center 60%', end: 'center 35%', scrub: 0.6 },
      })
      gsap.from('.route__stop', {
        opacity: 0,
        y: 10,
        stagger: 0.15,
        scrollTrigger: { trigger: '.route', scroller, start: 'top 70%', end: 'center 35%', scrub: 0.6 },
      })
    }, root)
    return () => ctx.revert()
  }, [scroller])

  return (
    <section id="next" ref={root} className="sec sec--paper next" aria-labelledby="next-title">
      <div className="sec-head">
        <p className="sec-index">06 / Next</p>
        <h2 id="next-title" className="sec-title">
          Kentucky kid, <em className="serif-em">SF address</em>
        </h2>
      </div>

      <p className="next__lede">
        The plan: prove it academically first — that earns the room — then build things that reach the whole world. So:
        studying hard <em className="serif-em">and</em> shipping hard, at the same time.
      </p>

      <figure className="route">
        <svg viewBox="0 0 1060 320" className="route__svg" role="img" aria-label="Kentucky, then Stanford, San Francisco, New York">
          <path d={PAST} className="route__past" />
          <path d={FUTURE} className="route__future" />
          {STOPS.map((s) => (
            <g key={s.label} className="route__stop" transform={`translate(${s.x} ${s.y})`}>
              <circle r={s.done ? 7 : 6} className={s.done ? 'route__dot' : 'route__dot route__dot--plan'} />
              <text y={-18} className="route__label">
                {s.label}
              </text>
              <text y={-36} className="route__sub">
                {s.sub}
              </text>
            </g>
          ))}
        </svg>
        <figcaption className="mono route__cap">Solid = happened · dashed = on purpose</figcaption>
      </figure>
    </section>
  )
}
