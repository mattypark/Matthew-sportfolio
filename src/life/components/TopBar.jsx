import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { nav, socials } from '../data/site'
import { prefersReducedMotion } from '../hooks/motion'

// Fixed top bar: back-to-board left, section chips + menu right. The menu
// grows out of its own button as a circle (clip-path) and lists everything.
//
// `items` switches it to the board version: just the menu button, and the
// menu lists those items as in-app routes ({ id, label, to, color? }) so the
// board stays mounted and runs its own transition.
export default function TopBar({ home = true, items = null, away = false }) {
  // on the /tape page, section links have to go back to the home page first
  const to = (id) => (home ? `#${id}` : `/archive#${id}`)
  const board = Boolean(items)
  const rows = items ?? [...nav.map((n) => ({ ...n, href: to(n.id) })), { id: 'tape', label: 'The tape', href: '/tape' }]

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
      <header className={`topbar ${board ? 'topbar--board' : ''} ${away ? 'is-away' : ''}`}>
        {!board && (
          <>
            <a href="/" className="topbar__board mono">
              ← the board
            </a>
            <nav className="topbar__nav" aria-label="Sections">
              {nav.map((n) => (
                <a key={n.id} href={to(n.id)} className="topbar__link mono">
                  {n.label}
                </a>
              ))}
              <a href="/tape" className="topbar__link mono">
                The tape
              </a>
            </nav>
          </>
        )}
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

      <div
        id="life-menu"
        ref={panel}
        className={`menu ${board ? 'menu--board' : ''}`}
        hidden
        role="dialog"
        aria-modal="true"
        aria-label="Index"
      >
        <div className="menu__grid">
          <ol className="menu__list">
            {rows.map((n, i) => {
              const body = (
                <>
                  <span className="menu__num mono">{String(i + 1).padStart(2, '0')}</span>
                  {n.label}
                </>
              )
              return (
                <li key={n.id} className="menu__row" style={n.color ? { '--c': n.color } : undefined}>
                  {n.to ? (
                    <Link to={n.to} className="menu__item" onClick={close}>
                      {body}
                    </Link>
                  ) : (
                    <a href={n.href} className="menu__item" onClick={close}>
                      {body}
                    </a>
                  )}
                </li>
              )
            })}
          </ol>
          <div className="menu__side">
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
