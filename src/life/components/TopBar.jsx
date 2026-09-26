import { useCallback, useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { nav, socials, shop } from '../data/site'
import { prefersReducedMotion } from '../hooks/motion'

// Fixed top bar: monogram left, section chips + shop + menu right. The menu
// grows out of its own button as a circle (clip-path) and lists everything.
export default function TopBar() {
  const [open, setOpen] = useState(false)
  const btn = useRef(null)
  const panel = useRef(null)

  const close = useCallback(() => setOpen(false), [])

  useEffect(() => {
    const el = panel.current
    const b = btn.current?.getBoundingClientRect()
    if (!el || !b) return
    const at = `${b.left + b.width / 2}px ${b.top + b.height / 2}px`
    const reduced = prefersReducedMotion()

    if (open) {
      el.hidden = false
      document.documentElement.style.overflow = 'hidden'
      gsap.fromTo(
        el,
        { clipPath: `circle(0px at ${at})` },
        { clipPath: `circle(150vmax at ${at})`, duration: reduced ? 0 : 0.75, ease: 'expo.inOut' },
      )
      gsap.fromTo(
        el.querySelectorAll('.menu__item'),
        { yPercent: 110 },
        { yPercent: 0, duration: reduced ? 0 : 0.7, stagger: 0.04, delay: reduced ? 0 : 0.25, ease: 'expo.out' },
      )
      el.querySelector('a')?.focus()
    } else if (!el.hidden) {
      document.documentElement.style.overflow = ''
      gsap.to(el, {
        clipPath: `circle(0px at ${at})`,
        duration: reduced ? 0 : 0.55,
        ease: 'expo.inOut',
        onComplete: () => {
          el.hidden = true
        },
      })
      btn.current?.focus()
    }
  }, [open])

  useEffect(() => {
    if (!open) return undefined
    const onKey = (e) => e.key === 'Escape' && close()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, close])

  return (
    <>
      <header className="topbar">
        <a href="#top" className="topbar__mark" aria-label="M/P — Matthew Park, back to top">
          M<span className="red">/</span>P
        </a>
        <nav className="topbar__nav" aria-label="Sections">
          {nav.map((n) => (
            <a key={n.id} href={`#${n.id}`} className="topbar__link mono">
              {n.label}
            </a>
          ))}
          <a href="/shop" className="topbar__shop mono">
            Shop
          </a>
        </nav>
        <button
          ref={btn}
          type="button"
          className={`burger ${open ? 'is-open' : ''}`}
          aria-expanded={open}
          aria-controls="life-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((o) => !o)}
        >
          <span />
          <span />
        </button>
      </header>

      <div id="life-menu" ref={panel} className="menu" hidden role="dialog" aria-modal="true" aria-label="Index">
        <div className="menu__grid">
          <ol className="menu__list">
            {nav.map((n, i) => (
              <li key={n.id} className="menu__row">
                <a href={`#${n.id}`} className="menu__item" onClick={close}>
                  <span className="menu__num mono">{String(i + 1).padStart(2, '0')}</span>
                  {n.label}
                </a>
              </li>
            ))}
          </ol>
          <div className="menu__side">
            <p className="mono menu__label">Shop</p>
            {shop.map((s) => (
              <a key={s.lot} href={s.href} className="menu__shop">
                <span className="mono">Lot {s.lot}</span> {s.name} <span className="red">{s.price}</span>
              </a>
            ))}
            <p className="mono menu__label">Elsewhere</p>
            <div className="menu__socials">
              {socials.map((s) => (
                <a key={s.id} href={s.href} target="_blank" rel="noopener noreferrer" className="mono">
                  {s.label} ↗
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
