import { useEffect, useRef, useState } from 'react'
import { animate } from 'animejs'

// Fallback shown if /api/song hasn't responded yet or returned !ok
const FALLBACK = {
  title: 'Through My System',
  artist: "it's murph, Arlo, Emi Grace",
  plays: 47,
}

const shuffleAnagram = (title) => {
  const pool = title.replace(/\s+/g, '').split('')
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[pool[i], pool[j]] = [pool[j], pool[i]]
  }
  let k = 0
  return title
    .split('')
    .map((c) => (c === ' ' ? ' ' : pool[k++]))
    .join('')
}

export default function SongsOfTheWeek() {
  const titleRef = useRef(null)
  const animRef = useRef(null)
  const [song, setSong] = useState(FALLBACK)
  const [solved, setSolved] = useState(false)
  const [revealed, setRevealed] = useState(false)

  // Set initial scrambled state on mount + when song.title changes (after api fetch)
  useEffect(() => {
    if (titleRef.current) titleRef.current.textContent = shuffleAnagram(song.title)
    setSolved(false)
  }, [song.title])

  // Fetch live song-of-the-week from serverless endpoint
  useEffect(() => {
    let cancelled = false
    fetch('/api/song')
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return
        if (data && data.ok && data.title && data.artist) {
          setSong({ title: data.title, artist: data.artist, plays: data.plays ?? 0 })
        }
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [])

  const animateTo = (target) => {
    animRef.current?.pause?.()
    const pool = target.replace(/\s+/g, '').split('')
    const len = target.length
    const starts = Array.from({ length: len }, () => Math.random() * 0.65)
    const span = 0.3
    const state = { p: 0 }
    animRef.current = animate(state, {
      p: 1,
      duration: 1500,
      ease: 'inOutQuad',
      onUpdate: () => {
        const p = state.p
        const out = target
          .split('')
          .map((c, i) => {
            if (c === ' ') return ' '
            if (p >= starts[i] + span) return c
            return pool[Math.floor(Math.random() * pool.length)]
          })
          .join('')
        if (titleRef.current) titleRef.current.textContent = out
      },
      onComplete: () => {
        if (titleRef.current) titleRef.current.textContent = target
      },
    })
  }

  const onClick = () => {
    if (!revealed) setRevealed(true)
    if (solved) {
      animateTo(shuffleAnagram(song.title))
      setSolved(false)
    } else {
      animateTo(song.title)
      setSolved(true)
    }
  }

  return (
    <section id="songs" className="relative gutter pt-[18vh] pb-[14vh]">
      <div className="mb-12">
        <div className="section-label text-paper/55 mb-3">// SONG OF THE WEEK</div>
        <h2 className="font-display text-[clamp(40px,7vw,112px)] leading-[0.92]">
          CLICK TO SEE WHAT I'M <span style={{ color: 'var(--primary)' }}>ON</span> THIS WEEK
        </h2>
        <p className="mt-4 max-w-[560px] font-mono text-[12px] text-paper/65 leading-[1.55]">
          // click the underlined title to unscramble. same letters, different order. refreshes every sunday at midnight.
        </p>
      </div>

      <article className="border-t border-paper/15 pt-8 grid grid-cols-12 gap-6">
        <div className="col-span-12 md:col-span-8">
          <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.24em] uppercase text-paper/45 mb-4">
            <span className="tabular-nums">01</span>
            <span>CURRENT LOOP</span>
          </div>
          <button
            type="button"
            onClick={onClick}
            data-hover
            aria-label="Click to unscramble title"
            className="block text-left w-full group"
            style={{ background: 'transparent', border: 'none', padding: 0, cursor: 'pointer' }}
          >
            <div
              ref={titleRef}
              className="font-display text-[clamp(36px,6.4vw,116px)] leading-[1] text-paper select-none"
              style={{
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'clip',
                minHeight: '1.1em',
                textDecoration: 'underline',
                textDecorationColor: 'var(--primary)',
                textDecorationThickness: '0.06em',
                textUnderlineOffset: '0.12em',
              }}
            >
              {song.title}
            </div>
          </button>

          <div
            className="mt-5 font-mono text-[13px] text-paper/65"
            style={{
              opacity: revealed ? 1 : 0,
              transform: revealed ? 'translateY(0)' : 'translateY(6px)',
              transition: 'opacity 700ms ease 200ms, transform 700ms ease 200ms',
            }}
          >
            by <span className="italic-fraunces text-[17px] text-paper/95">{song.artist}</span>
          </div>

          <div className="mt-6 flex items-center gap-3">
            <span
              aria-hidden
              style={{
                display: 'inline-block',
                width: 28,
                height: 1,
                background: 'var(--primary)',
                opacity: solved ? 0.55 : 1,
                transition: 'opacity 300ms ease',
              }}
            />
            <span
              className="font-mono uppercase tracking-[0.28em]"
              style={{
                fontSize: 12,
                color: 'var(--paper)',
                opacity: solved ? 0.55 : 1,
                transition: 'opacity 300ms ease',
              }}
            >
              {solved ? 'click to shuffle' : 'click title'}
            </span>
          </div>
        </div>

        <aside className="col-span-12 md:col-span-4 md:pl-8 md:border-l border-paper/15 flex flex-col gap-6 font-mono text-[11px] tracking-[0.18em] uppercase text-paper/70">
          <div className="flex flex-col">
            <div className="text-paper/45 mb-3">// PLAYS THIS WEEK</div>
            <div
              className="font-display text-paper text-center"
              style={{ fontSize: 'clamp(120px, 13vw, 196px)', lineHeight: 0.9 }}
            >
              {song.plays}
            </div>
          </div>
        </aside>
      </article>
    </section>
  )
}
