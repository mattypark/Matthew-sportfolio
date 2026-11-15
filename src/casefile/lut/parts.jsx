// The LUT room's own parts: the grade's swatches, the buy button, the tone
// curves that stand where the Volume page has its map, and the before/after.

import { useCallback, useEffect, useRef, useState } from 'react'
import { product } from '../../oldschool/data/lut.js'

/// The grade's palette, sampled from public/lut/after-01.jpg the way the Volume
/// page samples its photo: the crushed shadow, the room's brown, the warm wall,
/// the lamp's cream, and a little of the sweater's red and the lamp's teal.
export const GRADE = [
  { name: 'shadow', hex: '#08080e' },
  { name: 'room', hex: '#3b2f2b' },
  { name: 'wall', hex: '#604c3c' },
  { name: 'cream', hex: '#a49476' },
  { name: 'sweater', hex: '#832619' },
  { name: 'lamp', hex: '#5a898a' },
]

export function Swatches({ className, colors = GRADE, offset = 0, labels = false }) {
  return (
    <div className={className} aria-hidden="true">
      {colors.map((c, i) => (
        <span key={c.name} className="sw" style={{ '--i': i + offset, '--c': c.hex }}>
          {labels && <em>{c.hex}</em>}
        </span>
      ))}
    </div>
  )
}

export function BuyButton({ className = '' }) {
  if (!product.stripeUrl) return <span className={`lut-buy lut-buy--off ${className}`}>Not on sale yet</span>
  return (
    <a className={`lut-buy ${className}`} href={product.stripeUrl}>
      <span>Buy the LUT</span>
      <b aria-hidden="true">+</b>
    </a>
  )
}

/// Three tone curves over a grid: the identity line dashed, then red, green and
/// blue bending into the grade's S. Drawn in by CSS (lut.css), like the map.
export function ToneCurves({ className }) {
  return (
    <svg className={className} viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      <g className="lut-curves__grid">
        {[25, 50, 75].map((p) => (
          <path key={p} d={`M${p} 0V100M0 ${p}H100`} />
        ))}
        <rect x="0" y="0" width="100" height="100" />
      </g>
      <path className="lut-curves__id" d="M0 100L100 0" />
      <path className="lut-curve lut-curve--b" pathLength="1" d="M0 96C22 92 34 74 50 54S82 12 100 6" />
      <path className="lut-curve lut-curve--g" pathLength="1" d="M0 100C26 96 36 72 50 50S76 6 100 2" />
      <path className="lut-curve lut-curve--r" pathLength="1" d="M0 100C30 98 38 70 50 46S72 4 100 0" />
    </svg>
  )
}

const STEP = 4
const clamp = (n) => Math.min(100, Math.max(0, n))

/**
 * Before/after wipe, the old page's logic (pointer capture for mouse, touch and
 * pen; arrow keys for everyone else) in the case file's dress. On arrival it
 * sweeps once, log to graded and back to the middle, so the grade shows itself
 * before anyone touches it. `position` is how much of the log frame shows.
 */
export function LutCompare({ before, after, label, note }) {
  const [position, setPosition] = useState(50)
  const [missing, setMissing] = useState(false)
  const frame = useRef(null)
  const touched = useRef(false)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    const keys = [
      [0, 100],
      [1700, 100],
      [2900, 0],
      [3900, 0],
      [4800, 50],
    ]
    const ease = (x) => (x < 0.5 ? 4 * x * x * x : 1 - (-2 * x + 2) ** 3 / 2)
    let raf = 0
    const t0 = performance.now()
    const tick = (now) => {
      if (touched.current) return
      const t = now - t0
      const i = keys.findIndex(([at]) => at > t)
      if (i === -1) {
        setPosition(50)
        return
      }
      const [a, pa] = keys[Math.max(0, i - 1)]
      const [b, pb] = keys[i]
      setPosition(pa + (pb - pa) * ease(Math.min(1, (t - a) / (b - a || 1))))
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  const moveTo = useCallback((clientX) => {
    const el = frame.current
    if (!el) return
    const { left, width } = el.getBoundingClientRect()
    if (width) setPosition(clamp(((clientX - left) / width) * 100))
  }, [])

  const onDown = (e) => {
    touched.current = true
    e.currentTarget.setPointerCapture(e.pointerId)
    moveTo(e.clientX)
  }
  const onMove = (e) => {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) moveTo(e.clientX)
  }
  const onKey = (e) => {
    const moves = { ArrowLeft: (p) => p - STEP, ArrowRight: (p) => p + STEP, Home: () => 0, End: () => 100 }
    if (!moves[e.key]) return
    touched.current = true
    setPosition((p) => clamp(moves[e.key](p)))
    e.preventDefault()
  }

  return (
    <figure className="lut-compare">
      <div ref={frame} className="lut-compare__frame" onPointerDown={onDown} onPointerMove={onMove}>
        {missing ? (
          <p className="lut-compare__missing">Frame not supplied yet</p>
        ) : (
          <>
            <img src={after} alt={`${label}, graded`} draggable="false" onError={() => setMissing(true)} />
            <img
              src={before}
              alt={`${label}, ungraded log`}
              draggable="false"
              onError={() => setMissing(true)}
              style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
            />
            <span className="lut-compare__tag lut-compare__tag--l">Log</span>
            <span className="lut-compare__tag lut-compare__tag--r">Graded</span>
          </>
        )}
        <div
          className="lut-compare__line"
          role="slider"
          tabIndex={0}
          aria-label={`${label}, before and after`}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(position)}
          aria-valuetext={`${Math.round(position)}% ungraded`}
          onKeyDown={onKey}
          style={{ left: `${position}%` }}
        >
          <span className="lut-compare__knob">
            <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
              <path d="M4.5 3 2 6l2.5 3M7.5 3 10 6l-2.5 3" />
            </svg>
          </span>
        </div>
      </div>
      <figcaption className="lut-compare__cap">
        <span>{label}</span>
        <span>{note}</span>
      </figcaption>
    </figure>
  )
}
