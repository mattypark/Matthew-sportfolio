import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { gsap } from 'gsap'
import Arrow from './Arrow'
import Preview from './Preview'
import WrittenNote from './WrittenNote'
import MarkerTrail from './MarkerTrail'
import { SECTIONS, byId } from './sections'
import { createLiquid } from './liquid'
import TimelinePanel from './panels/TimelinePanel'
import NowPanel from './panels/NowPanel'
import ContactPanel from './panels/ContactPanel'
import PersonalityPanel from './panels/PersonalityPanel'
import Clock from '../components/Clock'
import { BOARD_CLOCKS } from '../data/site'
import { prefersReducedMotion } from '../hooks/motion'

const PANELS = { timeline: TimelinePanel, now: NowPanel, contact: ContactPanel, personality: PersonalityPanel }
const INK = '#0b0b0b'
const HIT_MS = 180
const AWAY_DEG = 7 // how far the other boxes lean away from the focused one

// A small random tilt per box, fresh every visit: Timeline ±1°, the rest ±2°.
function randomTilts() {
  return SECTIONS.map((s) => (Math.random() < 0.5 ? -1 : 1) * (s.id === 'timeline' ? 1 : 2))
}

// The home page: a whiteboard with four FNF-arrow boxes. Opening one floods
// the screen with its color (liquid fill, bottom → top), then its content
// reveals piece by piece. Closing reverses it. The URL is the source of truth
// (/timeline, /now, /contact, /personality), so back/forward and deep links
// run the same animation.
export default function Board() {
  const { section } = useParams()
  const navigate = useNavigate()
  const target = byId[section] ? section : null

  const [shown, setShown] = useState(null) // section whose content is mounted
  const [hit, setHit] = useState(null) // box flashing from a key press
  const [focus, setFocus] = useState(null) // index of the hovered / focused box
  const [tilts] = useState(randomTilts)
  const [wash, setWash] = useState({ x: 0, y: 0 }) // where the color flood starts
  const filled = useRef(null) // section the liquid currently holds
  const liquid = useRef(null)
  const svg = useRef(null)
  const back = useRef(null)
  const front = useRef(null)
  const panel = useRef(null)
  const boxes = useRef(null)
  const trailColor = useRef(INK)

  useEffect(() => {
    document.body.classList.add('life', 'on-board')
    liquid.current = createLiquid(svg.current, back.current, front.current)
    return () => {
      document.body.classList.remove('life', 'on-board')
      liquid.current.destroy()
    }
  }, [])

  // entrance: boxes drop onto the board, marker lines draw themselves
  useLayoutEffect(() => {
    if (prefersReducedMotion()) return undefined
    const ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: 'back.out(1.7)' } })
        .from('.board__name > *', { y: 40, opacity: 0, duration: 0.8, stagger: 0.08 })
        // tween the <li> wrappers: the boxes themselves carry CSS transitions
        // (focus / dim / tilt-away) that would fight a GSAP tween on them
        .from('.boxes__item', { y: -80, opacity: 0, duration: 0.8, stagger: 0.09 }, 0.15)
        .fromTo(
          '.doodle path',
          { strokeDashoffset: 1000 },
          { strokeDashoffset: 0, duration: 1.4, ease: 'power2.out', stagger: 0.1 },
          0.5,
        )
        .from(
          '.board__foot > *',
          { opacity: 0, y: 10, duration: 0.5, stagger: 0.06, ease: 'power2.out' },
          0.8,
        )
    })
    return () => ctx.revert()
  }, [])

  // URL → animation
  useEffect(() => {
    const L = liquid.current
    const reduced = prefersReducedMotion()

    const open = (id) => {
      const s = byId[id]
      filled.current = id
      if (reduced) {
        L.set({ color: s.color, dark: s.dark, full: true })
        setShown(id)
        return
      }
      gsap.to('.boxes__item', { scale: 0.94, duration: 0.5, ease: 'power2.out' })
      // completion checks what the liquid holds now, not a per-run flag:
      // StrictMode runs this effect twice and the first fill must still land
      L.fill({ color: s.color, dark: s.dark, onComplete: () => filled.current === id && setShown(id) })
    }

    const close = (then) => {
      const s = byId[filled.current]
      const finish = () => {
        setShown(null)
        if (reduced) {
          L.set({ color: s.color, dark: s.dark, full: false })
          filled.current = null
          then?.()
          return
        }
        gsap.to('.boxes__item', { scale: 1, duration: 0.7, ease: 'back.out(2)', delay: 0.35 })
        L.drain({
          onComplete: () => {
            filled.current = null
            then?.()
          },
        })
      }
      const pieces = panel.current?.querySelectorAll('.panel__head, [data-reveal]')
      if (!reduced && pieces?.length) {
        gsap.to([...pieces].reverse(), {
          y: -28,
          opacity: 0,
          duration: 0.24,
          stagger: 0.025,
          ease: 'power2.in',
          onComplete: finish,
        })
      } else {
        finish()
      }
    }

    if (target && filled.current !== target) {
      if (filled.current) close(() => open(target))
      else open(target)
    } else if (!target && filled.current) {
      close()
    }
  }, [target])

  // content reveals piece by piece once the liquid has filled
  useLayoutEffect(() => {
    if (!shown) return
    panel.current?.querySelector('.panel__title')?.focus({ preventScroll: true })
    if (prefersReducedMotion()) return
    gsap.fromTo(
      panel.current.querySelectorAll('.panel__head, [data-reveal]'),
      { y: 44, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, stagger: 0.07, ease: 'expo.out' },
    )
  }, [shown])

  const go = useCallback((id) => navigate(id ? `/${id}` : '/'), [navigate])

  // the flood only moves its origin when it starts; box-to-box keeps it full
  const washFrom = (el) => {
    if (focus !== null) return
    const r = el.getBoundingClientRect()
    setWash({ x: r.left + r.width / 2, y: r.top + r.height / 2 })
  }

  // keys: ← ↓ ↑ → open a box (like hitting a note), Esc closes
  useEffect(() => {
    const onKey = (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      if (e.key === 'Escape' && target) {
        go(null)
        return
      }
      if (target) return
      const s = SECTIONS.find((x) => x.key === e.key)
      if (!s) return
      e.preventDefault()
      setHit(s.id)
      setTimeout(() => setHit(null), HIT_MS)
      go(s.id)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [target, go])

  if (section && !target) return <Navigate to="/" replace />

  const washColor = focus !== null && !target ? SECTIONS[focus].color : null

  const Panel = shown ? PANELS[shown] : null
  const active = shown ? byId[shown] : null

  return (
    <div className={`board ${washColor ? 'is-washed' : ''}`}>
      {/* hovering a box floods the whole board with its color, spreading
          out from the box */}
      <div
        className={`board__wash ${washColor ? 'is-on' : ''}`}
        style={{ '--wash': washColor ?? 'transparent', '--wx': `${wash.x}px`, '--wy': `${wash.y}px` }}
        aria-hidden
      />
      <a href="#boxes" className="skip-link">
        Skip to the four boxes
      </a>

      <header className="board__top">
        <div className="board__name">
          <h1 className="board__title">Matthew Park</h1>
        </div>
      </header>

      <svg className="doodle doodle--line" viewBox="0 0 1000 120" preserveAspectRatio="none" aria-hidden>
        <path d="M 40 70 C 160 20, 250 110, 370 62 S 580 20, 640 66 S 860 110, 960 48" pathLength="1000" />
      </svg>

      <div className="board__stage">
        <WrittenNote className="board__note hand">pick one ↓ (or use your arrow keys)</WrittenNote>

        <ul id="boxes" ref={boxes} className={`boxes ${focus !== null ? 'has-focus' : ''}`} aria-label="Sections">
          {SECTIONS.map((s, i) => {
            // boxes left of the focused one lean left, boxes right of it lean right
            const away = focus === null || focus === i ? 0 : Math.sign(i - focus) * AWAY_DEG
            return (
              <li key={s.id} className="boxes__item">
                <button
                  type="button"
                  className={`box box--${s.id} ${hit === s.id ? 'is-hit' : ''} ${focus === i ? 'is-focus' : ''}`}
                  style={{ '--c': s.color, '--cd': s.dark, '--tilt': `${tilts[i]}deg`, '--away': `${away}deg` }}
                  onClick={() => go(s.id)}
                  onPointerEnter={(e) => {
                    trailColor.current = s.dark
                    washFrom(e.currentTarget)
                    setFocus(i)
                  }}
                  onPointerLeave={() => {
                    trailColor.current = INK
                    setFocus(null)
                  }}
                  onFocus={(e) => {
                    washFrom(e.currentTarget)
                    setFocus(i)
                  }}
                  onBlur={() => setFocus(null)}
                  aria-keyshortcuts={s.key}
                >
                  <Arrow dir={s.arrow} color={s.color} className="box__arrow" />
                  <span className="box__label">{s.label}</span>
                  <span className="box__sub hand">{s.sub}</span>
                  <span className="box__foot">
                    <span className="box__peek mono">{s.peek}</span>
                    <Preview id={s.id} />
                  </span>
                  <span className="box__key mono" aria-hidden>
                    {s.arrow}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      </div>

      <footer className="board__foot">
        {BOARD_CLOCKS.map((c) => (
          <Clock key={c.zone} {...c} />
        ))}
      </footer>

      <MarkerTrail colorRef={trailColor} active={!target} />

      <svg ref={svg} className="liquid" aria-hidden style={{ visibility: 'hidden' }}>
        <path ref={back} />
        <path ref={front} />
      </svg>

      {Panel && (
        <section
          ref={panel}
          className={`panel panel--${shown}`}
          style={{ '--c': active.color, '--cd': active.dark }}
          aria-labelledby="panel-title"
          data-lenis-prevent
        >
          <div className="panel__head">
            <Arrow dir={active.arrow} color={active.dark} className="panel__arrow" />
            <h2 id="panel-title" className="panel__title" tabIndex={-1}>
              {active.label}
            </h2>
            <button type="button" className="panel__close mono" onClick={() => go(null)}>
              Back to the board <span aria-hidden>· esc</span>
            </button>
          </div>
          <Panel />
          <nav className="panel__switch" aria-label="Other sections">
            {SECTIONS.filter((s) => s.id !== shown).map((s) => (
              <button key={s.id} type="button" className="panel__jump" onClick={() => go(s.id)}>
                <Arrow dir={s.arrow} color={s.color} className="panel__jump-arrow" />
                {s.label}
              </button>
            ))}
          </nav>
        </section>
      )}
    </div>
  )
}
