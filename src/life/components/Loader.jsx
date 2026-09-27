import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { animate } from 'animejs'
import { prefersReducedMotion } from '../hooks/motion'

const SEEN_KEY = 'life:loader-seen'
const MIN_MS = 1400

function seenThisSession() {
  try {
    return sessionStorage.getItem(SEEN_KEY) === '1'
  } catch {
    return false
  }
}

function markSeen() {
  try {
    sessionStorage.setItem(SEEN_KEY, '1')
  } catch {
    // private mode / blocked storage: the loader just shows again next time
  }
}

// 0 → 100 in the corner, tied to real readiness (fonts + the hero photo),
// then the sheet wipes up. Once per session. The board has no photo, so it
// passes image={null} and waits on fonts alone; `className` restyles it.
export default function Loader({ onDone, image = '/media/portrait-suit.webp', className = '' }) {
  const [skip] = useState(() => seenThisSession() || prefersReducedMotion())
  const [n, setN] = useState(0)
  const sheet = useRef(null)

  useEffect(() => {
    if (skip) {
      onDone()
      return undefined
    }

    let cancelled = false
    const count = { v: 0 }
    // the fake count never passes 90 until assets are actually ready
    const crawl = animate(count, {
      v: 90,
      duration: MIN_MS,
      ease: 'outCubic',
      onUpdate: () => setN(Math.round(count.v)),
    })

    const decoded = () => {
      if (!image) return Promise.resolve()
      const hero = new Image()
      hero.src = image
      return hero.decode().catch(() => undefined)
    }
    const ready = Promise.all([
      document.fonts?.ready ?? Promise.resolve(),
      decoded(),
      new Promise((r) => setTimeout(r, MIN_MS)),
    ])

    ready.then(() => {
      if (cancelled) return
      crawl.pause()
      animate(count, {
        v: 100,
        duration: 380,
        ease: 'outQuad',
        onUpdate: () => setN(Math.round(count.v)),
        onComplete: () => {
          markSeen()
          gsap
            .timeline({ onComplete: onDone })
            .to('.loader__num', { yPercent: -110, duration: 0.5, ease: 'power3.in' })
            .to(sheet.current, { clipPath: 'inset(0 0 100% 0)', duration: 0.9, ease: 'expo.inOut' }, '-=0.1')
        },
      })
    })

    return () => {
      cancelled = true
      crawl.pause()
    }
  }, [skip, onDone, image])

  if (skip) return null

  return (
    <div ref={sheet} className={`loader ${className}`} role="status" aria-label="Loading">
      <span className="loader__name mono">Matthew Park — every step, in order</span>
      <span className="loader__num-wrap" aria-hidden>
        <span className="loader__num">{String(n).padStart(3, '0')}</span>
      </span>
      <span className="loader__dot" aria-hidden />
    </div>
  )
}
