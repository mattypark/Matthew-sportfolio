import { useCallback, useEffect, useRef } from 'react'
import { gsap } from 'gsap'

// MENU METER — a redstone charge that reads how close you are to the menu.
//
// The blocks fill as the pointer closes in on the toggle, so the meter is
// literally a proximity readout: far away it's dark, right on top of the
// button it's fully powered and shaking.
//
// It also takes the damage. Every click on the menu cracks it one stage;
// the third click shatters it into pixels, which is what hides the toggle.

export const METER_BLOCKS = 24

// past this charge the meter is "hot" — lit, and rattling
const SHAKE_AT = 0.82

export default function MenuMeter({ charge, damage, broken, shatterKey, reassembleKey }) {
  const root = useRef(null)
  const shaking = useRef(false)

  // paint the charge straight onto the DOM — this updates on every pointer
  // move, so it must never go through React state
  useEffect(() => {
    const el = root.current
    if (!el) return
    const blocks = el.querySelectorAll('.rs-block')
    const lit = Math.round(charge * blocks.length)

    blocks.forEach((b, i) => {
      const on = i < lit
      b.dataset.on = on ? 'true' : 'false'
      b.dataset.lead = on && i === lit - 1 ? 'true' : 'false'
    })

    el.dataset.hot = charge >= SHAKE_AT ? 'true' : 'false'

    // the rattle, once, while it's hot
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce || broken) return

    if (charge >= SHAKE_AT && !shaking.current) {
      shaking.current = true
      gsap.to(el, {
        x: 2,
        duration: 0.06,
        repeat: -1,
        yoyo: true,
        ease: 'none',
      })
    } else if (charge < SHAKE_AT && shaking.current) {
      shaking.current = false
      gsap.killTweensOf(el)
      gsap.set(el, { x: 0 })
    }
  }, [charge, broken])

  // shatter — every block flies off as debris
  const shatter = useCallback(() => {
    const el = root.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    gsap.killTweensOf(el)
    gsap.set(el, { x: 0 })
    shaking.current = false

    const blocks = Array.from(el.querySelectorAll('.rs-block'))
    blocks.forEach((b, i) => {
      const dir = i % 2 === 0 ? 1 : -1
      gsap
        .timeline()
        .to(b, {
          x: dir * (30 + Math.random() * 90),
          y: -(10 + Math.random() * 60),
          rotate: dir * (40 + Math.random() * 140),
          duration: 0.26,
          ease: 'power2.out',
        })
        .to(b, { y: 220, opacity: 0, duration: 0.5, ease: 'power2.in' })
    })
  }, [])

  // reassemble — the pixels fall back into the column
  const reassemble = useCallback(() => {
    const el = root.current
    if (!el) return
    const blocks = Array.from(el.querySelectorAll('.rs-block'))

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(blocks, { x: 0, y: 0, rotate: 0, opacity: 1 })
      return
    }

    blocks.forEach((b, i) => {
      gsap.fromTo(
        b,
        {
          x: (i % 2 === 0 ? 1 : -1) * (40 + Math.random() * 90),
          y: -(60 + Math.random() * 120),
          rotate: (i % 2 === 0 ? 1 : -1) * 90,
          opacity: 0,
        },
        {
          x: 0,
          y: 0,
          rotate: 0,
          opacity: 1,
          duration: 0.5,
          // snaps into the grid rather than easing — it's rebuilding, not sliding
          ease: 'steps(6)',
          delay: i * 0.022,
        },
      )
    })
  }, [])

  useEffect(() => {
    if (shatterKey > 0) shatter()
  }, [shatterKey, shatter])

  useEffect(() => {
    if (reassembleKey > 0) reassemble()
  }, [reassembleKey, reassemble])

  return (
    <div
      ref={root}
      className="rs-rail rs-rail-left"
      data-crack={damage}
      data-broken={broken ? 'true' : 'false'}
      aria-hidden="true"
    >
      {Array.from({ length: METER_BLOCKS }, (_, i) => (
        <span key={i} className="rs-block" data-on="false" data-lead="false" />
      ))}
    </div>
  )
}
