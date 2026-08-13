import { useCallback, useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { gsap } from 'gsap'
import MenuMeter from './MenuMeter'

// NAV — big, bold, sporadic, and breakable.
//
// Closed: four words scattered at deliberately uneven positions and sizes
// around the viewport edges. Open: a full-bleed overlay of red and black
// bars at display scale.
//
// The meter on the left rail is wired to this component rather than to the
// pages, because the two are one mechanism: the meter charges as your
// pointer approaches the toggle, cracks each time you click it, and on the
// third click shatters — taking the toggle with it. A pixel RETRY button
// rebuilds them both.

const LINKS = [
  { to: '/', label: 'HOME' },
  { to: '/about', label: 'ABOUT' },
  { to: '/work', label: 'WORK' },
  { to: '/values', label: 'VALUES' },
]

const HITS_TO_BREAK = 3

export default function Nav({ onLeave }) {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)
  const overlay = useRef(null)
  const toggle = useRef(null)

  // meter state
  const [charge, setCharge] = useState(0)
  const [damage, setDamage] = useState(0)
  const [broken, setBroken] = useState(false)
  const [shatterKey, setShatterKey] = useState(0)
  const [reassembleKey, setReassembleKey] = useState(0)

  // charge tracks pointer distance to the toggle: 0 far away, 1 on top of it
  useEffect(() => {
    if (broken) return
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    if (!fine) return

    // full charge within 90px, nothing beyond 620px
    const NEAR = 90
    const FAR = 620

    const onMove = (e) => {
      const el = toggle.current
      if (!el) return
      const b = el.getBoundingClientRect()
      const dx = e.clientX - (b.left + b.width / 2)
      const dy = e.clientY - (b.top + b.height / 2)
      const dist = Math.hypot(dx, dy)
      const next = 1 - (dist - NEAR) / (FAR - NEAR)
      setCharge(Math.max(0, Math.min(1, next)))
    }

    window.addEventListener('pointermove', onMove)
    return () => window.removeEventListener('pointermove', onMove)
  }, [broken])

  // animate the overlay bars in from alternating sides
  useEffect(() => {
    if (!open) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.nv-bar',
        { xPercent: (i) => (i % 2 === 0 ? -104 : 104) },
        { xPercent: 0, duration: 0.62, ease: 'expo.out', stagger: 0.055 },
      )
    }, overlay)
    return () => ctx.revert()
  }, [open])

  // close on escape, and lock the page behind the overlay
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open])

  // every press of the toggle both works the menu and damages the meter
  const hitToggle = useCallback(() => {
    const next = damage + 1

    if (next >= HITS_TO_BREAK) {
      setDamage(HITS_TO_BREAK)
      setBroken(true)
      setOpen(false)
      setCharge(0)
      setShatterKey((k) => k + 1)
      return
    }

    setDamage(next)
    setOpen((o) => !o)
  }, [damage])

  const retry = useCallback(() => {
    setBroken(false)
    setDamage(0)
    setCharge(0)
    setReassembleKey((k) => k + 1)
  }, [])

  const go = useCallback(
    (to) => (e) => {
      e?.preventDefault()
      setOpen(false)
      if (to === pathname) return
      if (onLeave) onLeave(to)
      else navigate(to)
    },
    [navigate, onLeave, pathname],
  )

  return (
    <>
      <MenuMeter
        charge={charge}
        damage={damage}
        broken={broken}
        shatterKey={shatterKey}
        reassembleKey={reassembleKey}
      />

      {/* --- closed state: scattered, never in a row --- */}
      <nav className="nv-scatter" aria-label="Sections">
        {LINKS.map((l) => (
          <a
            key={l.to}
            href={l.to}
            onClick={go(l.to)}
            data-hover
            data-slot={l.label.toLowerCase()}
            className={`nv-word ${pathname === l.to ? 'is-here' : ''}`}
          >
            {l.label}
          </a>
        ))}
      </nav>

      {/* --- the red block that opens the overlay, until you break it --- */}
      {broken ? (
        <button className="nv-retry" onClick={retry} aria-label="Rebuild the menu">
          <span className="nv-retry-word">RETRY</span>
        </button>
      ) : (
        <button
          ref={toggle}
          className="nv-toggle pixel-edge pixel-shadow"
          data-crack={damage}
          onClick={hitToggle}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          <span className="nv-toggle-glyph" aria-hidden="true">
            {open ? '×' : '≡'}
          </span>
        </button>
      )}

      {/* --- open state: full-bleed bars --- */}
      {open ? (
        <div ref={overlay} className="nv-overlay" role="dialog" aria-modal="true" aria-label="Menu">
          {LINKS.map((l, i) => (
            <a
              key={l.to}
              href={l.to}
              onClick={go(l.to)}
              data-hover
              className={`nv-bar ${i % 2 === 0 ? 'is-ink' : 'is-red'}`}
            >
              <span className="nv-bar-index">{String(i + 1).padStart(2, '0')}</span>
              <span className="nv-bar-word">{l.label}</span>
              {pathname === l.to ? <span className="nv-bar-here">you are here</span> : null}
            </a>
          ))}

          <div className="nv-overlay-foot">
            <a href="mailto:matthew.parkk0@gmail.com" data-hover>
              matthew.parkk0@gmail.com
            </a>
            <a href="/journal" onClick={go('/journal')} data-hover>
              Journal
            </a>
            <span>Louisville,&nbsp;[KY]</span>
          </div>
        </div>
      ) : null}
    </>
  )
}
