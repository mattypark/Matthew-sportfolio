import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'

// THE LEDGER — the quiet hemisphere.
// Black, white text, one grotesk + one mono. Says what got done, then shuts up.

const WORKS = [
  { idx: '01', title: 'Axiom Pathways', meta: 'Nonprofit · 17 chapters live', href: null },
  { idx: '02', title: 'Web Design Agency', meta: 'Client work · active', href: null },
  { idx: '03', title: 'Social Media', meta: 'Content · 30M+ views', href: null },
  { idx: '04', title: 'SlapShift', meta: 'macOS app · building', href: 'https://slapshift.app' },
]

const CHANNELS = [
  { label: 'X', href: 'https://x.com/MattyparkW' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/matthew-park-487889350/' },
  { label: 'YouTube', href: 'https://www.youtube.com/@matty_park' },
  { label: 'TikTok', href: 'https://www.tiktok.com/@mattparxy' },
  { label: 'Instagram', href: 'https://www.instagram.com/matty.park/' },
  { label: 'Substack', href: 'https://substack.com/@mattyparkk' },
]

function useClock() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 15000)
    return () => clearInterval(id)
  }, [])
  return new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(now)
}

export default function LeftPanel({ booted }) {
  const root = useRef(null)
  const played = useRef(false)
  const time = useClock()

  useEffect(() => {
    if (!root.current || played.current) return
    gsap.set(root.current.querySelectorAll('.l-reveal'), { y: 24, opacity: 0 })
  }, [])

  useEffect(() => {
    if (!booted || played.current) return
    played.current = true
    const ctx = gsap.context(() => {
      gsap.to('.l-reveal', {
        y: 0,
        opacity: 1,
        duration: 0.9,
        ease: 'expo.out',
        stagger: 0.07,
      })
    }, root)
    return () => ctx.revert()
  }, [booted])

  return (
    <div ref={root} className="home-left flex h-full min-h-[100svh] flex-col justify-between px-8 py-8 md:px-12 md:py-10">
      {/* header */}
      <header className="l-reveal flex items-baseline justify-between font-mono text-[10px] tracking-[0.24em] uppercase text-bone/50">
        <span>Matthew Park</span>
        <span className="tabular-nums">Louisville, KY · {time} EST</span>
      </header>

      {/* name + bio + ledger */}
      <div className="my-12">
        <h1 className="l-reveal font-sans font-bold tracking-[-0.04em] text-[clamp(40px,4.6vw,72px)] leading-[0.98]">
          Matthew Park
        </h1>
        <p className="l-reveal mt-5 max-w-[42ch] font-mono text-[12.5px] leading-[1.7] text-bone/60">
          Fifteen. Founder, builder, creator. I ship products, teach through
          Axiom, and make things people actually use.
        </p>

        <div className="l-reveal mt-12">
          <div className="mb-4 font-mono text-[10px] tracking-[0.24em] uppercase text-bone/40">
            Index / Selected Work
          </div>
          {WORKS.map((w) => {
            const inner = (
              <>
                <span className="font-mono text-[11px] text-bone/40">{w.idx}</span>
                <span className="ledger-title font-sans text-[clamp(18px,1.6vw,24px)] font-medium tracking-[-0.02em]">
                  {w.title}
                </span>
                <span className="ledger-meta font-mono text-[11px] tracking-[0.08em] uppercase">
                  {w.meta}
                </span>
              </>
            )
            return w.href ? (
              <a
                key={w.idx}
                href={w.href}
                target="_blank"
                rel="noopener noreferrer"
                data-hover
                className="ledger-row"
              >
                {inner}
              </a>
            ) : (
              <div key={w.idx} className="ledger-row">
                {inner}
              </div>
            )
          })}
        </div>

        <p className="l-reveal mt-10 font-mono text-[11px] leading-[1.7] text-bone/40">
          Now — running Axiom across 17 chapters, building SlapShift,
          <br />
          still in high school. Learning is the job.
        </p>
      </div>

      {/* footer */}
      <footer className="l-reveal flex flex-wrap items-baseline justify-between gap-x-6 gap-y-3">
        <a
          href="mailto:matthew.parkk0@gmail.com"
          data-hover
          className="ledger-link font-mono text-[12px] underline underline-offset-4 decoration-bone/30"
        >
          matthew.parkk0@gmail.com
        </a>
        <nav aria-label="Social channels" className="flex flex-wrap gap-x-4 gap-y-1 font-mono text-[10.5px] tracking-[0.14em] uppercase">
          {CHANNELS.map((c) => (
            <a
              key={c.label}
              href={c.href}
              target="_blank"
              rel="noopener noreferrer"
              data-hover
              className="ledger-link"
            >
              {c.label}
            </a>
          ))}
        </nav>
      </footer>
    </div>
  )
}
