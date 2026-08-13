import { useCallback, useRef, useState } from 'react'
import { gsap } from 'gsap'

// PHOTO PILE — the Eileen Yang move.
//
// The old landing crossfaded one photo at a time, which reads as a
// slideshow. A pile reads as a life: every photo present at once,
// physically stacked, slightly askew, the top one asking to be moved.
//
// Hover fans the stack out. Click flicks the top photo away and sends it
// to the back of the pile. Reduced motion: a static, still-legible stack.

// each photo gets a fixed tilt + offset so the pile is stable across renders
const LAYOUT = [
  { rot: -6, x: -14, y: 8 },
  { rot: 3, x: 10, y: -6 },
  { rot: -2, x: -4, y: 4 },
  { rot: 5, x: 14, y: 10 },
  { rot: -4, x: -10, y: -8 },
  { rot: 2, x: 6, y: 12 },
]

export default function PhotoPile({ photos, size = 300, className = '' }) {
  const root = useRef(null)
  const busy = useRef(false)
  // order[0] is the card on top
  const [order, setOrder] = useState(() => photos.map((_, i) => i))

  const shuffle = useCallback(() => {
    if (busy.current) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setOrder((o) => [...o.slice(1), o[0]])
      return
    }
    busy.current = true

    const top = root.current?.querySelector('[data-depth="0"]')
    if (!top) {
      busy.current = false
      return
    }

    // flick out, then drop back in at the bottom of the pile
    gsap
      .timeline({
        onComplete: () => {
          setOrder((o) => [...o.slice(1), o[0]])
          gsap.set(top, { x: 0, y: 0, rotate: 0, opacity: 1 })
          busy.current = false
        },
      })
      .to(top, {
        x: 150,
        y: -40,
        rotate: 14,
        duration: 0.28,
        ease: 'power3.in',
      })
      .to(top, { opacity: 0, duration: 0.12 }, '-=0.1')
  }, [])

  return (
    <div
      ref={root}
      className={`pile ${className}`}
      style={{ '--pile-size': `${size}px` }}
      onClick={shuffle}
      data-hover
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          shuffle()
        }
      }}
      aria-label="A stack of photos of Matthew — activate to shuffle"
    >
      {photos.map((src, i) => {
        const depth = order.indexOf(i)
        const l = LAYOUT[i % LAYOUT.length]
        return (
          <figure
            key={src}
            className="pile-card"
            data-depth={depth}
            style={{
              zIndex: photos.length - depth,
              '--rot': `${l.rot}deg`,
              '--ox': `${l.x}px`,
              '--oy': `${l.y}px`,
              '--depth': depth,
            }}
          >
            <img
              src={src}
              alt=""
              loading={depth === 0 ? 'eager' : 'lazy'}
              fetchpriority={depth === 0 ? 'high' : undefined}
              draggable="false"
            />
          </figure>
        )
      })}
    </div>
  )
}
