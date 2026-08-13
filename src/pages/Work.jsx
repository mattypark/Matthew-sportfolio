import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { Crosshair, Clocks } from '../components/site/Chrome'
import Nav from '../components/site/Nav'
import BreakBlock from '../components/site/BreakBlock'
import BlockDivider from '../components/site/BlockDivider'
import { SOCIALS } from '../components/icons/Social'
import '../styles/site.css'

// WORK — the ledger, kept. Names in Anthropic Serif, years in mono,
// and a red block on every row you can actually mine.

const ENGAGEMENTS = [
  { name: 'Stanford ASES Launchpad', year: '2026' },
  { name: 'Microsoft × Coinbase × Tavily Building Event', year: '2026' },
  {
    name: 'Axiom Pathways',
    tag: '550+ interns · 10+ startups',
    year: '2026',
    href: 'https://www.axiomapply.com',
  },
  { name: 'BayouGuard', tag: 'Congressional App Challenge', year: '2026' },
  { name: 'Instagram', tag: '13K+', year: '2026' },
  { name: 'SlapShift', tag: 'project', year: '2026' },
  { name: 'Bery', tag: 'AI agent', year: '2026' },
  { name: 'Media AI Agent', tag: 'project', year: '2026' },
  { name: 'Hand Vocoder', year: '2026' },
  { name: 'PrayerLock', year: '2026' },
  { name: 'Web Design Agency', year: '2025' },
]

export default function Work({ onLeave }) {
  const root = useRef(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.pg-reveal',
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out', stagger: 0.05, delay: 0.12 },
      )
      gsap.utils.toArray('.wk-row').forEach((row) => {
        gsap.fromTo(
          row,
          { y: 14, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            ease: 'power3.out',
            scrollTrigger: { trigger: row, start: 'top 92%' },
          },
        )
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={root} className="pg">
      <Nav onLeave={onLeave} />

      <header className="wk-head">
        <h1 className="display wk-title pg-reveal">WORK</h1>
        <p className="prose pg-reveal" style={{ maxWidth: '46ch', marginTop: 22 }}>
          Everything that shipped, and who it shipped with. Pull me in when
          something needs building rather than describing.
        </p>
      </header>

      <ul className="wk-list">
        {ENGAGEMENTS.map((e) => {
          const Name = e.href ? 'a' : 'span'
          return (
            <li key={e.name} className="wk-row">
              <BreakBlock className="wk-mark" aria-hidden="true" />
              <Name
                className="wk-name"
                {...(e.href
                  ? { href: e.href, target: '_blank', rel: 'noopener noreferrer', 'data-hover': true }
                  : {})}
              >
                {e.name}
                {e.href ? ' ↗' : ''}
              </Name>
              <span className="wk-tag">{e.tag || ''}</span>
              <span className="wk-year tabular-nums">{e.year}</span>
            </li>
          )
        })}
      </ul>

      <BlockDivider label="find me" />

      <nav className="socials" aria-label="Channels">
        {SOCIALS.map(({ key, label, href, Icon }) => (
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

      <div className="foot-rail">
        <span className="eyebrow">
          <a href="mailto:matthew.parkk0@gmail.com" data-hover>
            matthew.parkk0@gmail.com
          </a>
        </span>
        <span className="eyebrow">
          <a href="/journal" data-hover>
            Journal ↗
          </a>
        </span>
      </div>

      <Clocks />
      <Crosshair />
    </div>
  )
}
