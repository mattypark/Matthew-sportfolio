import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Slot from './Slot'
import { EMAIL } from '../data/site'
import { prefersReducedMotion } from '../hooks/motion'
import { useScroller } from '../board/scroller'

gsap.registerPlugin(ScrollTrigger)

const STRIP = ['reel-1', 'reel-2', 'reel-3', 'reel-4', 'reel-5', 'reel-6']
// Cycles like a real inbox. SEND emails whichever one is on screen.
const DMS = [
  'hey @matty.park, want to build something together?',
  'what are you working on right now?',
  'could you make a video for our brand?',
  'would you come speak at our event?',
  'how did Axiom get to 550+ interns??',
]
const TYPE_MS = 38
const DELETE_MS = 18
const HOLD_MS = 2200

// oryzo's "so portable, it's wearable" beat, redone for the content side:
// reels slide past behind a fixed phone frame, and a fake DM types itself.
// SEND is real — it opens an email.
//
// `title` / `sub` override the heading (the Right now box states its own
// figure); the defaults are the archive's copy.
export default function ContentStrip({
  title = (
    <>
      30M views, <em className="serif-em">give or take</em>
    </>
  ),
  sub = 'Short-form · UGC for brands · a YouTube documentary',
}) {
  const root = useRef(null)
  const strip = useRef(null)
  const scroller = useScroller()
  const [typed, setTyped] = useState(() => (prefersReducedMotion() ? DMS[0] : ''))
  const [current, setCurrent] = useState(0)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.to(strip.current, {
        xPercent: -50,
        ease: 'none',
        scrollTrigger: { trigger: root.current, scroller, start: 'top bottom', end: 'bottom top', scrub: 0.5 },
      })
      ScrollTrigger.create({ trigger: root.current, scroller, start: 'top 60%', once: true, onEnter: () => setStarted(true) })
    })
    return () => mm.revert()
  }, [scroller])

  useEffect(() => {
    if (!started || prefersReducedMotion()) return undefined
    let i = 0
    let n = 0
    let deleting = false
    let timer
    const tick = () => {
      const msg = DMS[i]
      if (!deleting) {
        n += 1
        setTyped(msg.slice(0, n))
        if (n === msg.length) {
          deleting = true
          timer = setTimeout(tick, HOLD_MS)
          return
        }
        timer = setTimeout(tick, TYPE_MS)
        return
      }
      n -= 1
      setTyped(msg.slice(0, n))
      if (n === 0) {
        deleting = false
        i = (i + 1) % DMS.length
        setCurrent(i)
      }
      timer = setTimeout(tick, DELETE_MS)
    }
    timer = setTimeout(tick, 300)
    return () => clearTimeout(timer)
  }, [started])

  const subject = encodeURIComponent('Hey Matthew')
  const body = encodeURIComponent(`${DMS[current]}\n\n`)

  return (
    <div ref={root} className="cstrip" aria-labelledby="cstrip-title">
      <div className="cstrip__copy">
        <p className="sec-index">Content</p>
        <h3 id="cstrip-title" className="cstrip__title">
          {title}
        </h3>
        <p className="mono cstrip__sub">{sub}</p>
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
          >
            <span className="sr-only">Email Matthew: </span>
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
