import { useCallback, useRef, useState } from 'react'
import { gsap } from 'gsap'

// BREAK BLOCK — Minecraft mining, ported to a portfolio.
//
// Click a red block: it cracks. Three hits and it bursts into pixel
// particles, then respawns 1.2s later like a broken block regrowing.
// Wraps nav words, section markers, work-row bullets — anything red.
//
// Under prefers-reduced-motion it is an inert box: no cracks, no burst.

const HITS_TO_BREAK = 3
const RESPAWN_MS = 1200
const PARTICLE_COUNT = 12

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export default function BreakBlock({
  children,
  as: Tag = 'span',
  className = '',
  onBreak,
  ...rest
}) {
  const host = useRef(null)
  const [hits, setHits] = useState(0)
  const [broken, setBroken] = useState(false)

  // scatter pixel chips on ballistic arcs, then clean them up
  const burst = useCallback(() => {
    const el = host.current
    if (!el) return
    const box = el.getBoundingClientRect()
    const chips = []

    for (let i = 0; i < PARTICLE_COUNT; i += 1) {
      const chip = document.createElement('span')
      chip.className = 'bb-chip'
      // chips are 4px or 6px — two sizes reads more like debris than one
      const s = i % 3 === 0 ? 6 : 4
      chip.style.width = `${s}px`
      chip.style.height = `${s}px`
      chip.style.left = `${box.left + box.width * (0.2 + Math.random() * 0.6)}px`
      chip.style.top = `${box.top + box.height * (0.2 + Math.random() * 0.6)}px`
      document.body.appendChild(chip)
      chips.push(chip)

      const dir = i % 2 === 0 ? 1 : -1
      gsap
        .timeline({ onComplete: () => chip.remove() })
        .to(chip, {
          x: dir * (18 + Math.random() * 46),
          y: -(20 + Math.random() * 34),
          duration: 0.22,
          ease: 'power2.out',
        })
        .to(chip, {
          y: 40 + Math.random() * 50,
          opacity: 0,
          duration: 0.42,
          ease: 'power2.in',
        })
    }

    return () => chips.forEach((c) => c.remove())
  }, [])

  const hit = useCallback(
    (e) => {
      if (prefersReducedMotion() || broken) return
      e.preventDefault()
      const next = hits + 1

      if (next >= HITS_TO_BREAK) {
        burst()
        setBroken(true)
        setHits(0)
        onBreak?.()
        window.setTimeout(() => setBroken(false), RESPAWN_MS)
        return
      }

      setHits(next)
      // a small recoil so each hit lands physically
      gsap.fromTo(
        host.current,
        { x: -2 },
        { x: 0, duration: 0.18, ease: 'elastic.out(1, 0.4)' },
      )
    },
    [broken, burst, hits, onBreak],
  )

  return (
    <Tag
      ref={host}
      className={`bb ${className}`}
      data-crack={broken ? 'gone' : hits}
      onPointerDown={hit}
      {...rest}
    >
      {children}
    </Tag>
  )
}
