import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Slot from './Slot'
import { EMAIL } from '../data/site'
import { prefersReducedMotion } from '../hooks/motion'

gsap.registerPlugin(ScrollTrigger)

const STRIP = ['reel-1', 'reel-2', 'reel-3', 'reel-4', 'reel-5', 'reel-6']
const DM = 'hey @matty.park, can you make my brand go viral?'
const TYPE_MS = 38

// oryzo's "so portable, it's wearable" beat, redone for the content side:
// reels slide past behind a fixed phone frame, and a fake DM types itself.
// SEND is real — it opens an email.
export default function ContentStrip() {
  const root = useRef(null)
  const strip = useRef(null)
  const [typed, setTyped] = useState(() => (prefersReducedMotion() ? DM : ''))
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.to(strip.current, {
        xPercent: -50,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: 0.5 },
      })
      ScrollTrigger.create({ trigger: root.current, start: 'top 60%', once: true, onEnter: () => setStarted(true) })
    })
    return () => mm.revert()
  }, [])

  useEffect(() => {
    if (!started) return undefined
    let n = 0
    const id = setInterval(() => {
      n += 1
      setTyped(DM.slice(0, n))
      if (n >= DM.length) clearInterval(id)
    }, TYPE_MS)
    return () => clearInterval(id)
  }, [started])

  const subject = encodeURIComponent('Brand deal / UGC')
  const body = encodeURIComponent(`${DM}\n\n`)

  return (
    <div ref={root} className="cstrip" aria-labelledby="cstrip-title">
      <div className="cstrip__copy">
        <p className="sec-index">Content</p>
        <h3 id="cstrip-title" className="cstrip__title">
          30M views, <em className="serif-em">give or take</em>
        </h3>
        <p className="mono cstrip__sub">Short-form · UGC for brands · a YouTube documentary</p>
      </div>

      <div className="cstrip__stage">
        <div ref={strip} className="cstrip__strip" aria-hidden>
          {[...STRIP, ...STRIP].map((id, i) => (
            <Slot key={`${id}-${i}`} id={id} className="cstrip__reel" sizes="200px" />
          ))}
        </div>

        <div className="cstrip__phone">
          <Slot id="reel-5" className="cstrip__screen" sizes="300px" />
          <a
            className="cstrip__dm"
            href={`mailto:${EMAIL}?subject=${subject}&body=${body}`}
            aria-label="Email Matthew about a brand deal"
          >
            <span className="cstrip__dm-text">
              {typed}
              <span className="typewriter__cursor" aria-hidden>
                ▍
              </span>
            </span>
            <span className="cstrip__send">Send</span>
          </a>
        </div>
      </div>
    </div>
  )
}
