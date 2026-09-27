import { useEffect, useRef } from 'react'
import { prefersReducedMotion } from '../hooks/motion'

// "Pressure": the letter nearest the pointer stretches tall and bulges while
// its neighbours squash, like pressing into something soft. Idea from React
// Bits' Text Pressure (MIT). This version uses transforms, not font axes, so
// it works with any display face — including the custom font to come.
//
// Touch / idle pointer: a virtual pointer sweeps slowly across the word so
// the effect still reads on phones.

const STRETCH_Y = 0.34 // how much taller the pressed letter gets
const BULGE_X = 0.14 // how much wider it gets
const SQUASH_X = 0.08 // how much the far letters narrow
const LERP = 0.14
const IDLE_MS = 2200

export default function TextPressure({ text, className = '', radiusScale = 1.7 }) {
  const wrap = useRef(null)
  const chars = useRef([])

  useEffect(() => {
    const el = wrap.current
    if (!el || prefersReducedMotion()) return undefined
    const letters = chars.current.filter(Boolean)
    const pointer = { x: -9999, y: -9999, last: 0 }
    const current = letters.map(() => 0)
    let raf

    const onMove = (e) => {
      pointer.x = e.clientX
      pointer.y = e.clientY
      pointer.last = performance.now()
    }
    window.addEventListener('pointermove', onMove, { passive: true })

    const frame = (now) => {
      const box = el.getBoundingClientRect()
      if (box.bottom > 0 && box.top < window.innerHeight) {
        let px = pointer.x
        let py = pointer.y
        if (now - pointer.last > IDLE_MS) {
          px = box.left + box.width * ((Math.sin(now / 1500) + 1) / 2)
          py = box.top + box.height / 2
        }
        const radius = (box.width / letters.length) * radiusScale

        letters.forEach((s, i) => {
          // measure the untransformed slot: offsetLeft/Width ignore transforms
          const cx = box.left + s.offsetLeft + s.offsetWidth / 2
          const cy = box.top + s.offsetTop + s.offsetHeight / 2
          const d = Math.hypot(px - cx, py - cy)
          const target = Math.max(0, 1 - d / radius)
          current[i] += (target * target - current[i]) * LERP
          const t = current[i]
          const sx = 1 + BULGE_X * t - SQUASH_X * (1 - t)
          const sy = 1 + STRETCH_Y * t
          s.style.transform = `scale(${sx.toFixed(3)}, ${sy.toFixed(3)})`
        })
      }
      raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
    }
  }, [text, radiusScale])

  return (
    <span ref={wrap} className={`pressure ${className}`} aria-label={text} role="text">
      {text.split('').map((ch, i) => (
        <span
          key={`${ch}-${i}`}
          ref={(n) => {
            chars.current[i] = n
          }}
          className="pressure__ch"
          aria-hidden
        >
          {ch === ' ' ? ' ' : ch}
        </span>
      ))}
    </span>
  )
}
