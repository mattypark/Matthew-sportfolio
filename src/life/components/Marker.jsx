import { useEffect, useRef } from 'react'
import { createDrawable, animate } from 'animejs'
import { prefersReducedMotion } from '../hooks/motion'

// "Color outside the lines": hand-drawn red strokes that deliberately
// overshoot whatever they mark. Wrap the words to annotate; the stroke draws
// itself the first time it scrolls into view.

const PATHS = {
  // a loose ellipse that doesn't quite close, overshooting on the right
  circle:
    'M 12 44 C 6 18, 60 4, 120 6 C 176 8, 206 22, 202 42 C 198 64, 140 80, 86 78 C 40 76, 8 66, 14 46 C 18 32, 52 20, 104 18',
  // a fast underline with a flick at the end
  underline: 'M 2 12 C 50 6, 120 4, 196 9 C 202 10, 204 13, 198 16',
  // a double strike, like crossing something out and meaning it
  strike: 'M 2 30 C 60 24, 140 22, 204 26 M 8 40 C 70 34, 150 34, 200 36',
}

const VIEWBOX = { circle: '0 0 210 84', underline: '0 0 206 20', strike: '0 0 210 50' }

export default function Marker({ kind = 'circle', children, className = '', delay = 0 }) {
  const svg = useRef(null)

  useEffect(() => {
    const el = svg.current
    if (!el || prefersReducedMotion()) return undefined
    const [drawable] = createDrawable(el.querySelector('path'))
    drawable.setAttribute('draw', '0 0')

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        io.disconnect()
        animate(drawable, { draw: ['0 0', '0 1'], duration: 900, delay, ease: 'outQuad' })
      },
      { threshold: 0.6 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [delay])

  return (
    <span className={`marker marker--${kind} ${className}`}>
      {children}
      <svg ref={svg} className="marker__svg" viewBox={VIEWBOX[kind]} preserveAspectRatio="none" aria-hidden>
        <path d={PATHS[kind]} />
      </svg>
    </span>
  )
}
