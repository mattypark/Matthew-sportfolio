import { useEffect, useRef } from 'react'
import { prefersReducedMotion } from '../hooks/motion'
import { useScroller } from '../board/scroller'

const BASE_SPEED = 0.6 // px per frame at rest
const VELOCITY_GAIN = 0.12

// A huge headline that runs sideways, speeds up with scroll velocity and
// flips direction with scroll direction. The ✱ glyphs spin with it.
export default function Marquee({ text, className = '' }) {
  const track = useRef(null)
  // inside a board panel the panel scrolls, not the window
  const scroller = useScroller()

  useEffect(() => {
    const el = track.current
    if (!el || prefersReducedMotion()) return undefined
    let x = 0
    let dir = -1
    const scrollY = () => (scroller ? scroller.scrollTop : window.scrollY)
    let lastY = scrollY()
    let spin = 0
    let raf

    const frame = () => {
      const y = scrollY()
      const v = y - lastY
      lastY = y
      if (v !== 0) dir = v > 0 ? -1 : 1
      const speed = BASE_SPEED + Math.abs(v) * VELOCITY_GAIN
      const half = el.scrollWidth / 2
      x += dir * speed
      if (x <= -half) x += half
      if (x > 0) x -= half
      spin += speed * 2 * -dir
      el.style.transform = `translate3d(${x}px,0,0)`
      el.style.setProperty('--spin', `${spin}deg`)
      raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(raf)
  }, [scroller])

  const parts = text.split('✱')
  const run = parts.map((p, i) => (
    <span key={i}>
      {p}
      {i < parts.length - 1 && <span className="marquee__star">✱</span>}
    </span>
  ))

  return (
    <div className={`marquee ${className}`} aria-label={text.replaceAll('✱', ' ')} role="text">
      <div ref={track} className="marquee__track" aria-hidden>
        <span className="marquee__run">{run}</span>
        <span className="marquee__run">{run}</span>
      </div>
    </div>
  )
}
