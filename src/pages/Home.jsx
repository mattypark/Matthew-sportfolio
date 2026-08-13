import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { Crosshair, Clocks } from '../components/site/Chrome'
import Nav from '../components/site/Nav'
import PhotoPile from '../components/site/PhotoPile'
import RampedName from '../components/site/RampedName'
import { SOCIALS } from '../components/icons/Social'
import '../styles/site.css'

// HOME — the name, the pile, and nothing else.
//
// The old landing put a small nav in the middle of an empty page. This one
// commits: the name runs off the left edge at display scale, the photo pile
// sits low-right, and the eye has to travel diagonally to read the page.

const PHOTOS = [
  '/rotator-5566.jpg',
  '/rotator-5568.jpg',
  '/rotator-5569.jpg',
  '/rotator-5571.jpg',
  '/rotator-5572.jpg',
]

export default function Home({ onLeave }) {
  const root = useRef(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.hm-line-in',
        { yPercent: 108 },
        { yPercent: 0, duration: 1.15, ease: 'expo.out', stagger: 0.08, delay: 0.08 },
      )
      gsap.fromTo(
        '.pg-reveal',
        { y: 18, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, ease: 'expo.out', stagger: 0.06, delay: 0.35 },
      )
      gsap.fromTo(
        '.hm-pile',
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1.1, ease: 'expo.out', delay: 0.45 },
      )
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={root} className="pg hm">
      <Nav onLeave={onLeave} />

      {/* the name owns the full width — each line masked so the words rise in */}
      <RampedName />

      <div className="hm-stage">
        <div className="hm-said prose pg-reveal">
          <p>
            Fifteen. Building in Louisville, aimed at everywhere else. Nonprofits,
            AI agents, a tennis serve, and whatever else fits in a week.
          </p>
        </div>

        <div className="hm-pile">
          <PhotoPile photos={PHOTOS} size={252} />
        </div>
      </div>

      <div className="hm-foot">
        <span className="eyebrow pg-reveal">Currently — Axiom · 550+ interns</span>

        <nav className="socials pg-reveal" aria-label="Social">
          {SOCIALS.slice(0, 3).map(({ key, label, href, Icon }) => (
            <a
              key={key}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="social-link"
              data-hover
              aria-label={label}
            >
              <Icon />
            </a>
          ))}
        </nav>

        <a
          href="mailto:matthew.parkk0@gmail.com"
          className="eyebrow pg-reveal"
          data-hover
          style={{ textDecoration: 'none' }}
        >
          matthew.parkk0@gmail.com
        </a>
      </div>

      <Clocks />
      <Crosshair />
    </div>
  )
}
