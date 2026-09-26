import { useEffect, useRef } from 'react'
import { prefersReducedMotion } from '../hooks/motion'

// Variable-font "pressure": the letter nearest the pointer swells to full
// weight and width while distant letters collapse thin. Idea from React Bits'
// Text Pressure (MIT); rebuilt on Anybody's wght + wdth axes.
//
// Touch / no pointer: a virtual pointer sweeps slowly across the word so the
// effect still reads on phones.

const AXES = { wdthMin: 66, wdthMax: 132, wghtMin: 380, wghtMax: 900 }
const LERP = 0.14
const IDLE_MS = 2200

export default function TextPressure({ text, className = '', radiusScale = 1.8, accent = true }) {
  const wrap = useRef(null)
  const chars = useRef([])

  useEffect(() => {
    const el = wrap.current
    if (!el) return undefined
    const letters = chars.current.filter(Boolean)

    if (prefersReducedMotion()) {
      letters.forEach((s) => {
        s.style.fontVariationSettings = `'wght' 820, 'wdth' 88`
      })
      return undefined
    }

    const pointer = { x: -9999, y: -9999, last: 0 }
    const current = letters.map(() => ({ t: 0 }))
    let raf

    const onMove = (e) => {
      pointer.x = e.clientX
      pointer.y = e.clientY
      pointer.last = performance.now()
    }
    window.addEventListener('pointermove', onMove, { passive: true })

    const frame = (now) => {
      const box = el.getBoundingClientRect()
      // off-screen: skip the work
      if (box.bottom > 0 && box.top < window.innerHeight) {
        let px = pointer.x
        let py = pointer.y
        if (now - pointer.last > IDLE_MS) {
          const phase = (Math.sin(now / 1400) + 1) / 2
          px = box.left + box.width * phase
          py = box.top + box.height / 2
        }
        const radius = (box.width / letters.length) * radiusScale * 2

        letters.forEach((s, i) => {
          const r = s.getBoundingClientRect()
          const d = Math.hypot(px - (r.left + r.width / 2), py - (r.top + r.height / 2))
          const target = Math.max(0, 1 - d / radius)
          const c = current[i]
          c.t += (target * target - c.t) * LERP
          const wdth = AXES.wdthMin + (AXES.wdthMax - AXES.wdthMin) * c.t
          const wght = AXES.wghtMin + (AXES.wghtMax - AXES.wghtMin) * Math.min(1, c.t * 1.3 + 0.35)
          s.style.fontVariationSettings = `'wght' ${wght.toFixed(0)}, 'wdth' ${wdth.toFixed(1)}`
          if (accent) s.style.color = c.t > 0.72 ? 'var(--red)' : ''
        })
      }
      raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
    }
  }, [text, radiusScale, accent])

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
