import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import BackButton from './BackButton'
import Subscribe from './Subscribe'
import JournalCard from './JournalCard'
import { Crosshair, useClock } from './WorkSite'
import { getEntries } from '../../lib/journal'
import './home.css'

// THE JOURNAL — the index.
// A hairline grid of cards: cover, title, dek, date. The cards share rules
// rather than each carrying its own box, so the whole section reads as one
// ruled sheet — the quiet side's grammar, not a stack of floating tiles.
//
// The count stays visible. It is the book's page count, and it should grow.

const FIRST_ROW = 3

export default function JournalPage() {
  const root = useRef(null)
  const local = useClock('America/New_York')
  const away = useClock('Asia/Seoul')
  const entries = getEntries()

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.l-reveal',
        { y: 22, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.05, ease: 'power3.out', stagger: 0.09, delay: 0.15 },
      )
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={root} className="home-left relative min-h-[100svh] px-6 pb-24 md:px-[5vw]">
      <BackButton />

      <header className="pt-[11vh] pb-[5vh]">
        <h1 className="l-reveal font-mono text-[clamp(16px,1.4vw,20px)] font-medium tracking-[0.14em] uppercase">
          Journal
        </h1>
        <p className="l-reveal mt-3 max-w-[54ch] font-mono text-[12px] leading-[1.8] text-slate">
          What I&rsquo;m building and what it taught me, written the week it happens. In a
          year this is a book. Right now it&rsquo;s the notes.
        </p>
      </header>

      <div className="l-reveal">
        <Subscribe />
      </div>

      <section className="jr-index" aria-labelledby="jr-entries">
        <div className="l-reveal jr-index-head">
          <h2 id="jr-entries" className="ok-eyebrow">
            Entries
          </h2>
          <span className="jr-count tabular-nums">
            {String(entries.length).padStart(3, '0')} written
          </span>
        </div>

        {entries.length === 0 ? (
          <p className="l-reveal jr-empty">
            Nothing published yet. First entry is being written.
          </p>
        ) : (
          <ul className="jr-grid">
            {entries.map((entry, i) => (
              <JournalCard key={entry.slug} entry={entry} eager={i < FIRST_ROW} />
            ))}
          </ul>
        )}
      </section>

      <span className="ok-clock ok-clock-left tabular-nums">Louisville {local}</span>
      <span className="ok-clock ok-clock-right tabular-nums">Seoul {away}</span>

      <Crosshair />
    </div>
  )
}
