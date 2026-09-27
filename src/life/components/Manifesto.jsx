import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Marker from './Marker'
import { prefersReducedMotion } from '../hooks/motion'

gsap.registerPlugin(ScrollTrigger)

// His own words (the /about page), set big. Words ink in as you scroll;
// numbers are red; one word switches to the serif.
const COPY = [
  ['This year I took Prayer Lock from '],
  ['$2K MRR to $14K', 'red'],
  [', started a nonprofit that has put '],
  ['550+ high schoolers', 'red'],
  [' into internships, went viral, qualified for state in speech & debate, played All-State sax '],
  ['twice', 'red'],
  [', and auditioned for JYP. I believe in doing '],
  ['everything', 'serif'],
  [' — the more you do, the more opportunities show up. To do something exceptional, you have to be '],
  ['the exception', 'marker'],
  ['.'],
]

function Words({ text, kind }) {
  const words = text.split(/(\s+)/)
  const spans = words.map((w, i) =>
    /\s+/.test(w) ? w : (
      <span key={i} className="why__w">
        {w}
      </span>
    ),
  )
  if (kind === 'red') return <span className="red">{spans}</span>
  if (kind === 'serif') return <em className="serif-em">{spans}</em>
  if (kind === 'marker') return <Marker kind="underline">{spans}</Marker>
  return spans
}

export default function Manifesto() {
  const root = useRef(null)

  useEffect(() => {
    if (prefersReducedMotion()) return undefined
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.why__w',
        { opacity: 0.22 },
        {
          opacity: 1,
          stagger: 0.05,
          ease: 'none',
          scrollTrigger: { trigger: '.why__text', start: 'top 78%', end: 'bottom 45%', scrub: 0.6 },
        },
      )
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section id="why" ref={root} className="sec sec--ink why" aria-labelledby="why-title">
      <div className="sec-head">
        <p className="sec-index">01 / Why</p>
        <h2 id="why-title" className="sr-only">
          Why
        </h2>
      </div>
      <p className="why__text">
        {COPY.map(([text, kind], i) => (
          <Words key={i} text={text} kind={kind} />
        ))}
      </p>
      <p className="why__sign mono">— Matthew, 15, Kentucky → wherever this goes</p>
    </section>
  )
}
