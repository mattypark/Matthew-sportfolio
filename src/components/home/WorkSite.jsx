import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import useMagnetic from '../../hooks/useMagnetic'
import BackButton from './BackButton'
import './home.css'

// WORK AREA — the quiet side, rebuilt in the otherkind mould.
// Near-white paper, a heavy Fraunces wordmark, a name↔year ledger, a small
// project grid, dual city clocks, and a crosshair that reads your cursor back.

const ENGAGEMENTS = [
  { name: 'Axiom Pathways', year: '2026', href: 'https://www.axiomapply.com' },
  { name: 'SlapShift', tag: 'project', year: '2026' },
  { name: 'Bery', tag: 'AI agent', year: '2026' },
  { name: 'Media AI Agent', tag: 'project', year: '2026' },
  { name: 'BayouGuard', year: '2026' },
  { name: 'Hand Vocoder', year: '2026' },
  { name: 'PrayerLock', year: '2026' },
  { name: 'Web Design Agency', year: '2025' },
]

// every channel, lined up at the very bottom of the page
const CHANNELS = [
  { label: 'Contact', href: 'mailto:matthew.parkk0@gmail.com' },
  { label: 'X', href: 'https://x.com/MattyparkW' },
  { label: 'YouTube', href: 'https://www.youtube.com/@matty_park' },
  { label: 'TikTok', href: 'https://www.tiktok.com/@mattparxy' },
  { label: 'Instagram', href: 'https://www.instagram.com/matty.park/' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/matthew-park-487889350/' },
  { label: 'Substack', href: 'https://substack.com/@mattyparkk' },
]

export function useClock(timeZone) {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 15000)
    return () => clearInterval(id)
  }, [])
  return new Intl.DateTimeFormat('en-US', {
    timeZone,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(now)
}

// crosshair that trails the pointer and prints X/Y — the otherkind tell.
// updates the DOM node directly so we never re-render on mousemove.
export function Crosshair() {
  const wrap = useRef(null)
  const readout = useRef(null)

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!fine || reduce) return

    const el = wrap.current
    const label = readout.current
    if (!el || !label) return

    const onMove = (e) => {
      el.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`
      el.style.opacity = '1'
      label.textContent = `X:${String(Math.round(e.clientX)).padStart(4, '0')}  Y:${String(
        Math.round(e.clientY),
      ).padStart(4, '0')}`
    }
    const onLeave = () => {
      if (el) el.style.opacity = '0'
    }

    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerleave', onLeave)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  return (
    <div ref={wrap} className="ok-crosshair" aria-hidden="true">
      <span className="ok-crosshair-mark" />
      <span ref={readout} className="ok-crosshair-readout">
        X:0000  Y:0000
      </span>
    </div>
  )
}

export default function WorkSite() {
  const root = useRef(null)
  const local = useClock('America/New_York')
  const away = useClock('Asia/Seoul')
  const emailRef = useMagnetic(0.4, 90)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.ok-wordmark',
        { yPercent: 12, opacity: 0, filter: 'blur(6px)' },
        { yPercent: 0, opacity: 1, filter: 'blur(0px)', duration: 1.1, ease: 'expo.out' },
      )
      // one by one, soft and unhurried — the apple cadence
      gsap.fromTo(
        '.l-reveal',
        { y: 22, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.05, ease: 'power3.out', stagger: 0.12, delay: 0.2 },
      )
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <div
      ref={root}
      className="home-left relative min-h-[100svh] px-6 pb-20 md:px-[5vw]"
    >
      {/* back to the index — the only chrome up top */}
      <BackButton />

      {/* the wordmark — dead center of the first screen */}
      <section className="ok-hero">
        <h1 className="ok-wordmark" aria-label="Matthew Park">
          Matthew <span className="ok-wordmark-break" />Park
        </h1>
      </section>

      {/* everything else drops low, in one offset column — otherkind rhythm */}
      <div className="ok-lower relative">
        <div className="ok-body">
          <p className="l-reveal max-w-[46ch] font-mono text-[13px] leading-[1.85] text-slate">
            Matthew Park is a fifteen-year-old founder, builder, and creator. You
            pull him in when you need to ship products, teach through Axiom, and
            make things people actually use.
          </p>
          <p className="l-reveal mt-10 max-w-[46ch] font-mono text-[13px] leading-[1.85] text-slate">
            Now — running Axiom with 500+ interns, building SlapShift, still in
            high school. Learning is the job.
          </p>
          <p className="l-reveal mt-12 font-mono text-[13px] leading-[1.85] text-slate">
            Get in touch:{' '}
            <a
              ref={emailRef}
              href="mailto:matthew.parkk0@gmail.com"
              data-hover
              className="ok-link inline-block underline underline-offset-4 decoration-ink/40"
            >
              matthew.parkk0@gmail.com
            </a>
          </p>

          <div className="ok-eyebrow mb-5 mt-24">Past Engagements</div>
          <ul className="ok-engagements">
            {ENGAGEMENTS.map((e) => {
              const inner = (
                <>
                  <span className="ok-eng-name">
                    {e.name}
                    {e.href && <span className="ok-eng-arrow" aria-hidden="true"> ↗</span>}
                    {e.tag && <span className="ok-eng-tag"> · {e.tag}</span>}
                  </span>
                  <span className="ok-eng-year tabular-nums">{e.year}</span>
                </>
              )
              return e.href ? (
                <li key={e.name}>
                  <a
                    href={e.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-hover
                    className="ok-eng-row ok-eng-link"
                  >
                    {inner}
                  </a>
                </li>
              ) : (
                <li key={e.name} className="ok-eng-row">
                  {inner}
                </li>
              )
            })}
          </ul>
        </div>
      </div>

      {/* channels — all the way down, the last line of the page */}
      <nav
        aria-label="Channels"
        className="ok-footnav l-reveal font-mono text-[11px] tracking-[0.16em] uppercase"
      >
        {CHANNELS.map((c) => (
          <a
            key={c.label}
            href={c.href}
            target={c.href.startsWith('http') ? '_blank' : undefined}
            rel={c.href.startsWith('http') ? 'noopener noreferrer' : undefined}
            data-hover
            className="ok-link inline-block py-1.5 underline underline-offset-4 decoration-ink/40"
          >
            {c.label}
          </a>
        ))}
      </nav>

      {/* corner clocks — two zones, like the reference */}
      <span className="ok-clock ok-clock-left tabular-nums">Louisville {local}</span>
      <span className="ok-clock ok-clock-right tabular-nums">Seoul {away}</span>

      <Crosshair />
    </div>
  )
}
