import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { gsap } from 'gsap'
import { Crosshair, useClock } from './WorkSite'
import './home.css'

// the middle image — a stack of moments, one every two seconds
const PORTRAITS = [
  '/rotator-5566.jpg',
  '/rotator-5568.jpg',
  '/rotator-5569.jpg',
  '/rotator-5571.jpg',
  '/rotator-5572.jpg',
]

// THE LANDING
// A quiet editorial index: a text nav at the vertical middle, a portrait
// dead-center, city clocks + crosshair at the edges. Pure white, pure black.
//   [ ] Projects / Minimal → /work   [ ] Maximal → /loud
// Leaving: everything slides up and fades, then the next side enters —
// /work fades text in one by one, /loud bounces its blocks into place.

export default function Gate() {
  const navigate = useNavigate()
  const root = useRef(null)
  const leaving = useRef(false)
  const local = useClock('America/New_York')
  const away = useClock('Asia/Seoul')
  const [frame, setFrame] = useState(0)

  // rotate the portrait every two seconds (static under reduced motion)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = setInterval(() => setFrame((f) => (f + 1) % PORTRAITS.length), 2000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.ld-reveal',
        { y: 16, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, ease: 'expo.out', stagger: 0.06, delay: 0.1 },
      )
      gsap.fromTo(
        '.ok-portrait',
        { opacity: 0, scale: 1.02 },
        { opacity: 1, scale: 1, duration: 1.1, ease: 'expo.out', delay: 0.25 },
      )
    }, root)
    return () => ctx.revert()
  }, [])

  // exit — the whole index slides up and fades away, then we route
  const leave = (dest) => (e) => {
    e.preventDefault()
    if (leaving.current) return
    leaving.current = true

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      navigate(dest)
      return
    }

    gsap
      .timeline({ onComplete: () => navigate(dest) })
      .to('.ok-portrait', { y: -60, opacity: 0, duration: 0.55, ease: 'power3.in' }, 0)
      .to(
        '.ld-reveal',
        { y: -34, opacity: 0, duration: 0.45, ease: 'power3.in', stagger: 0.035 },
        0.05,
      )
      .to('.ok-clock', { opacity: 0, duration: 0.3 }, 0.1)
  }

  return (
    <div ref={root} className="ok-landing">
      <header className="ok-nav">
        <nav className="ok-navgroup" aria-label="Sections">
          {/* projects — crossed out, coming back when the screenshots land */}
          <span className="ld-reveal ok-navlink ok-navlink-dead" aria-disabled="true">
            <span className="ok-navmark" aria-hidden="true" />Projects
          </span>
          <a href="/work" onClick={leave('/work')} data-hover className="ld-reveal ok-navlink">
            <span className="ok-navmark" aria-hidden="true" />Minimal
          </a>
          <a href="/values" onClick={leave('/values')} data-hover className="ld-reveal ok-navlink">
            <span className="ok-navmark" aria-hidden="true" />Values
          </a>
        </nav>

        <div className="ok-navgroup" aria-label="Contact">
          <a
            href="mailto:matthew.parkk0@gmail.com"
            data-hover
            className="ld-reveal ok-navlink ok-navline"
          >
            matthew.parkk0@gmail.com
          </a>
          <a
            href="https://www.instagram.com/matty.park/"
            target="_blank"
            rel="noopener noreferrer"
            data-hover
            className="ld-reveal ok-navlink ok-navline"
          >
            Instagram
          </a>
          <span className="ld-reveal ok-navlink ok-navlink-static">Louisville,&nbsp;[KY]</span>
        </div>
      </header>

      <main className="ok-landing-main">
        <div className="ok-portrait ok-rotator" aria-label="Matthew Park — photos">
          {PORTRAITS.map((src, i) => (
            <img
              key={src}
              src={src}
              alt=""
              className={i === frame ? 'is-on' : ''}
              width="543"
              height="812"
              fetchpriority={i === 0 ? 'high' : undefined}
              loading={i === 0 ? 'eager' : 'lazy'}
            />
          ))}
        </div>
      </main>

      <span className="ok-clock ok-clock-left tabular-nums">Louisville {local}</span>
      <span className="ok-clock ok-clock-right tabular-nums">Seoul {away}</span>

      <Crosshair />
    </div>
  )
}
