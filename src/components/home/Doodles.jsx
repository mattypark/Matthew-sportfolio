import { useEffect, useRef } from 'react'
import { animate, svg, stagger } from 'animejs'

// Hand-drawn SVG doodles for the loud half.
// Each one hides itself, then anime.js strokes it in when it scrolls into view.

function useDrawOnView(ref, { duration = 1200, delay = 0 } = {}) {
  useEffect(() => {
    const el = ref.current
    if (!el) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      el.classList.add('doodle-on')
      return
    }

    let played = false
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || played) return
        played = true
        el.classList.add('doodle-on')
        animate(svg.createDrawable(el.querySelectorAll('path')), {
          draw: ['0 0', '0 1'],
          ease: 'inOutQuad',
          duration,
          delay: stagger(140, { start: delay }),
        })
        io.disconnect()
      },
      { threshold: 0.35 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [duration, delay])
}

const strokeProps = (color, width = 3) => ({
  fill: 'none',
  stroke: color,
  strokeWidth: width,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
})

export function Squiggle({ className = '', color = 'var(--umber)', ...rest }) {
  const ref = useRef(null)
  useDrawOnView(ref)
  return (
    <svg ref={ref} {...rest} className={`doodle ${className}`} viewBox="0 0 180 36" aria-hidden="true">
      <path d="M6 22 Q 24 6 42 20 T 78 20 T 114 20 T 150 20 T 174 18" {...strokeProps(color, 3.5)} />
    </svg>
  )
}

export function Star({ className = '', color = '#14100B', ...rest }) {
  const ref = useRef(null)
  useDrawOnView(ref)
  return (
    <svg ref={ref} {...rest} className={`doodle ${className}`} viewBox="0 0 90 90" aria-hidden="true">
      <path
        d="M45 6 L55 33 L84 34 L61 51 L69 80 L45 63 L21 80 L29 51 L6 34 L35 33 Z"
        {...strokeProps(color, 3)}
      />
    </svg>
  )
}

export function Sun({ className = '', color = 'var(--umber)', ...rest }) {
  const ref = useRef(null)
  useDrawOnView(ref, { duration: 900 })
  return (
    <svg ref={ref} {...rest} className={`doodle ${className}`} viewBox="0 0 120 120" aria-hidden="true">
      <path d="M60 38 C 74 38 82 48 82 60 C 82 74 72 82 60 82 C 46 82 38 72 38 60 C 38 46 48 38 60 38 Z" {...strokeProps(color, 3.5)} />
      <path d="M60 4 L60 22" {...strokeProps(color, 3.5)} />
      <path d="M60 98 L60 116" {...strokeProps(color, 3.5)} />
      <path d="M4 60 L22 60" {...strokeProps(color, 3.5)} />
      <path d="M98 60 L116 60" {...strokeProps(color, 3.5)} />
      <path d="M20 20 L33 33" {...strokeProps(color, 3.5)} />
      <path d="M87 87 L100 100" {...strokeProps(color, 3.5)} />
      <path d="M100 20 L87 33" {...strokeProps(color, 3.5)} />
      <path d="M33 87 L20 100" {...strokeProps(color, 3.5)} />
    </svg>
  )
}

export function ArrowCurve({ className = '', color = '#14100B', flip = false, ...rest }) {
  const ref = useRef(null)
  useDrawOnView(ref, { duration: 1000 })
  return (
    <svg
      ref={ref}
      {...rest}
      className={`doodle ${className}`}
      viewBox="0 0 150 80"
      aria-hidden="true"
      style={flip ? { transform: 'scaleX(-1)' } : undefined}
    >
      <path d="M8 68 C 30 18 92 8 132 40" {...strokeProps(color, 3.5)} />
      <path d="M116 30 L134 41 L120 54" {...strokeProps(color, 3.5)} />
    </svg>
  )
}

export function Spiral({ className = '', color = 'var(--umber)', ...rest }) {
  const ref = useRef(null)
  useDrawOnView(ref, { duration: 1400 })
  return (
    <svg ref={ref} {...rest} className={`doodle ${className}`} viewBox="0 0 100 100" aria-hidden="true">
      <path
        d="M50 50 C 56 44 62 50 58 57 C 52 66 38 62 36 51 C 34 38 48 30 60 35 C 74 41 76 59 66 69 C 54 81 32 77 24 63 C 15 47 24 26 42 20 C 62 13 82 26 86 47"
        {...strokeProps(color, 3)}
      />
    </svg>
  )
}

export function CircleScribble({ className = '', color = 'var(--umber)', ...rest }) {
  const ref = useRef(null)
  useDrawOnView(ref, { duration: 1100 })
  return (
    <svg ref={ref} {...rest} className={`doodle ${className}`} viewBox="0 0 220 90" aria-hidden="true">
      <path
        d="M110 12 C 170 8 208 24 206 45 C 204 68 158 82 106 80 C 56 78 14 66 14 46 C 14 26 60 10 118 12 C 168 14 198 28 196 44"
        {...strokeProps(color, 3)}
      />
    </svg>
  )
}
