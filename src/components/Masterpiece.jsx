import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const slides = [
  {
    year: '2010',
    title: 'BORN IN KENTUCKY',
    body: '10.12.10. Louisville. The whole thing starts here.',
    accent: 'ink',
  },
  {
    year: '2024',
    title: 'ALL-STATE SAX',
    body: 'KMEA all-state alto, second chair. Months in a practice room for ten minutes on a stage. Worth it.',
    accent: 'ink',
  },
  {
    year: '2025',
    title: 'FIRST VIRAL VIDEO',
    body: 'August 13. A talking-head clip on TikTok cracks open. The first time the algorithm decided I was worth showing to strangers.',
    accent: 'red',
  },
  {
    year: '2025',
    title: 'COFOUNDED AN APP',
    body: 'November 19. Started a thing with Mau. Not a deck, not a waitlist. A product people actually opened.',
    accent: 'blue',
  },
  {
    year: '2025',
    title: '7X\u2019D THE APP',
    body: 'December 5. Took it from two thousand to fourteen thousand in two weeks. Numbers stopped being theoretical.',
    accent: 'red',
  },
  {
    year: '2026',
    title: 'MIT RESEARCHER',
    body: 'March 4. Brought on as a Critical Data researcher at MIT. Fifteen years old in a room that does not usually let fifteen-year-olds in.',
    accent: 'ink',
  },
  {
    year: '2026',
    title: 'NATIONAL AWARD',
    body: 'March 7. Sustainable Development National Award at LRSEF. The science fair kid won the science fair.',
    accent: 'signal',
  },
  {
    year: '2026',
    title: '50K SUBS · 30M+ VIEWS',
    body: 'Hit 50,000 total subscribers across platforms and 30M+ views. The algorithm kept deciding I was worth showing.',
    accent: 'red',
  },
  {
    year: '2026',
    title: 'STANFORD ASES',
    body: 'April 17. Accepted into Stanford ASES Launchpad. Got the email, then went back to shipping.',
    accent: 'blue',
  },
  {
    year: '2026',
    title: 'FOUNDED AXIOM',
    body: 'April 18. The day after Stanford. A nonprofit chapter system, AI, CS, entrepreneurship, taught by people who built the things. Seventeen chapters in the first year.',
    accent: 'red',
  },
  {
    year: '2026',
    title: 'THIS PAGE',
    body: 'You are reading it. Which means the loop closed once. The next thing will be smaller and stranger than this. Subscribe to nothing. Just check back.',
    accent: 'signal',
  },
]

function accentColor(a) {
  switch (a) {
    case 'red':    return 'var(--primary)'
    case 'blue':   return 'var(--accent)'
    case 'signal': return 'var(--signal)'
    default:       return 'var(--ink)'
  }
}

export default function Masterpiece() {
  const root = useRef(null)
  const trackRef = useRef(null)
  const [activeIdx, setActiveIdx] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const track = trackRef.current
      const N = slides.length

      const tween = gsap.to(track, {
        // Track width is N * 100% of viewport, so xPercent here is % of own width.
        // We need to travel (N-1) viewports left => -(N-1)/N * 100 in xPercent.
        xPercent: -100 * (N - 1) / N,
        ease: 'none',
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: () => `+=${window.innerHeight * (N - 1)}`,
          pin: true,
          // scrub 1 = ~1s smoothing on input; gives the buttery, eased "squircle"
          // feel between vertical entry and horizontal motion.
          scrub: 1,
          anticipatePin: 0.5,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            setProgress(self.progress)
            const idx = Math.min(
              N - 1,
              Math.max(0, Math.round(self.progress * (N - 1)))
            )
            setActiveIdx(idx)
          },
        },
      })

      return () => tween?.scrollTrigger?.kill()
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section
      id="masterpiece"
      ref={root}
      className="section-dark relative overflow-hidden h-screen"
    >
      {/* Progress indicator */}
      <div className="absolute top-[60px] right-7 z-10 font-mono text-[11px] tracking-[0.22em] uppercase text-ink/60 flex items-center gap-3">
        <span>{String(activeIdx + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}</span>
        <span className="block w-32 h-px bg-ink/20 relative">
          <span
            className="absolute inset-y-0 left-0 bg-ink origin-left"
            style={{ width: `${progress * 100}%` }}
          />
        </span>
        <span>{Math.round(progress * 100).toString().padStart(2, '0')}%</span>
      </div>

      {/* Sliding track */}
      <div
        ref={trackRef}
        className="flex h-full"
        style={{ width: `${slides.length * 100}%` }}
      >
        {slides.map((s, i) => (
          <div
            key={i}
            className="relative h-full flex-shrink-0 gutter flex flex-col justify-center"
            style={{ width: `${100 / slides.length}%` }}
          >
            <div
              className="font-mono text-[12px] tracking-[0.3em] mb-6"
              style={{ color: accentColor(s.accent) }}
            >
              CHAPTER · {String(i + 1).padStart(2, '0')} &nbsp;&middot;&nbsp; {s.year}
            </div>
            <h2 className="font-display text-[clamp(60px,11vw,180px)] leading-[0.85]">
              {s.title}
            </h2>
            <p className="mt-8 max-w-[640px] font-mono text-[14px] leading-[1.6] text-ink/75">
              {s.body}
            </p>
            <div
              className="absolute bottom-12 left-7 right-7 h-px"
              style={{ background: accentColor(s.accent), opacity: 0.4 }}
            />
            <div
              className="absolute bottom-7 left-7 font-display text-[clamp(80px,14vw,220px)] leading-none opacity-[0.16] pointer-events-none select-none"
              style={{ color: accentColor(s.accent) }}
            >
              {s.year}
            </div>
          </div>
        ))}
      </div>

    </section>
  )
}
