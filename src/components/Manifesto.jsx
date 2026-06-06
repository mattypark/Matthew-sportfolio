import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// "About" notebook as a pinned scroll scene:
//   phase 1 — card pins in the middle of the viewport (sticky)
//   phase 2 — right-hand text slides in as you keep scrolling
//   phase 3 — "stuff" flies out of the notebook (tennis, code, saas, ...)
// All scrubbed off one ScrollTrigger timeline over a tall runway.

const SPIRAL_HOLES = Array.from({ length: 14 })

// Things that spill out of the notebook. x/y are px offsets from card center,
// rot in deg. Emitted from the spine, scattered around the card.
const STUFF = [
  { icon: '🎾', label: 'TENNIS',       x: -440, y: -150, rot: -10 },
  { icon: '💻', label: 'COMPUTERS',    x:  470, y: -210, rot:   8 },
  { icon: '⌨️', label: 'CODE',         x: -500, y:  110, rot:  -6 },
  { icon: '☁️', label: 'SAAS',         x:  500, y:   40, rot:  10 },
  { icon: '📈', label: 'MARKETING',    x: -360, y:  250, rot:   5 },
  { icon: '📱', label: 'SOCIAL MEDIA', x:  380, y:  250, rot:  -7 },
  { icon: '✨', label: 'AI',           x:    0, y: -320, rot:   0 },
  { icon: '🎬', label: 'CONTENT',      x:   40, y:  330, rot:   4 },
]

export default function Manifesto() {
  const root = useRef(null)
  const cardRef = useRef(null)
  const textRef = useRef(null)
  const stuffRef = useRef([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      const textItems = textRef.current.querySelectorAll('.nb-reveal')
      const letters = textRef.current.querySelectorAll('.nb-letter')
      const stuff = stuffRef.current.filter(Boolean)

      // Initial states
      gsap.set(textItems, { y: 44, opacity: 0 })
      gsap.set(letters, { yPercent: 110, opacity: 0 })
      gsap.set(stuff, { x: 0, y: 0, scale: 0, opacity: 0, rotate: 0 })

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: () => `+=${window.innerHeight * 2.2}`,
          pin: true,
          anticipatePin: 0.5,
          invalidateOnRefresh: true,
          scrub: 0.6,
        },
      })

      // small settle as the card locks
      tl.fromTo(cardRef.current, { scale: 0.96 }, { scale: 1, duration: 0.12 }, 0.02)

      // phase 2a — heading letters slide up (0.10 → 0.30)
      tl.to(letters, { yPercent: 0, opacity: 1, ease: 'power3.out', duration: 0.3, stagger: 0.05 }, 0.10)

      // phase 2b — body text slides up (0.18 → 0.42)
      tl.to(textItems, { y: 0, opacity: 1, ease: 'power3.out', duration: 0.26, stagger: 0.05 }, 0.18)

      // phase 3 — stuff flies out of the notebook (0.46 → 1.0)
      stuff.forEach((el, i) => {
        const d = STUFF[i]
        tl.to(
          el,
          {
            x: d.x,
            y: d.y,
            rotate: d.rot,
            scale: 1,
            opacity: 1,
            ease: 'back.out(1.5)',
            duration: 0.4,
          },
          0.46 + i * 0.05,
        )
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    // ScrollTrigger pins this h-screen section (same mechanism as Masterpiece)
    // while the timeline scrubs — no CSS sticky, so the pins don't fight.
    <section
      id="about"
      ref={root}
      className="relative h-screen w-full overflow-hidden flex items-center justify-center gutter"
    >
      <div className="relative w-full max-w-[1240px]">
          {/* stuff layer — centered on the card, flies outward */}
          <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
            {STUFF.map((s, i) => (
              <div
                key={s.label}
                ref={(el) => (stuffRef.current[i] = el)}
                className="absolute flex items-center gap-2 rounded-full px-4 py-2 will-change-transform"
                style={{
                  background: 'var(--ink)',
                  color: 'var(--paper)',
                  border: '1px solid rgba(226,208,168,0.3)',
                  boxShadow: '4px 6px 0 0 rgba(0,0,0,0.5)',
                }}
              >
                <span className="text-[18px] leading-none">{s.icon}</span>
                <span className="font-mono text-[11px] tracking-[0.18em]">{s.label}</span>
              </div>
            ))}
          </div>

          {/* box-in-box: paper notebook card */}
          <div
            ref={cardRef}
            className="nb-card relative z-10 rounded-[18px] overflow-hidden will-change-transform"
            style={{ background: 'var(--paper)', color: 'var(--ink)' }}
          >
            {/* inner frame rule */}
            <div
              className="pointer-events-none absolute inset-3 rounded-[12px]"
              style={{ border: '1px solid rgba(15,14,12,0.18)' }}
            />

            <div className="grid md:grid-cols-[42%_58%]">
              {/* LEFT — photo panel */}
              <div className="relative p-6 md:p-8 flex">
                <div
                  className="relative w-full overflow-hidden rounded-[8px]"
                  style={{
                    border: '1px solid rgba(15,14,12,0.55)',
                    boxShadow: '6px 6px 0 0 rgba(15,14,12,0.85)',
                  }}
                >
                  <img
                    src="/about-photo.png"
                    alt="Matthew"
                    className="w-full h-full object-cover"
                    style={{ aspectRatio: '4 / 5', filter: 'contrast(1.05) grayscale(1)' }}
                  />
                  {/* tape corner */}
                  <span
                    className="absolute -top-2 left-1/2 -translate-x-1/2 w-20 h-6 rotate-[-3deg]"
                    style={{ background: 'rgba(230,62,33,0.18)', border: '1px solid rgba(230,62,33,0.4)' }}
                  />
                </div>
              </div>

              {/* SPINE — spiral binding */}
              <div
                className="hidden md:flex absolute top-0 bottom-0 flex-col items-center justify-around py-10"
                style={{ left: 'calc(42% - 1px)', width: '24px' }}
              >
                <div
                  className="absolute top-6 bottom-6 left-1/2 -translate-x-1/2"
                  style={{ width: '1px', background: 'rgba(15,14,12,0.18)' }}
                />
                {SPIRAL_HOLES.map((_, i) => (
                  <span
                    key={i}
                    className="relative z-10 block rounded-full"
                    style={{
                      width: '11px',
                      height: '11px',
                      background: 'var(--ink)',
                      boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.6)',
                    }}
                  />
                ))}
              </div>

              {/* RIGHT — ruled text column */}
              <div
                ref={textRef}
                className="relative p-6 md:p-10 md:pl-12"
                style={{
                  backgroundImage:
                    'repeating-linear-gradient(to bottom, transparent 0, transparent 37px, rgba(15,14,12,0.10) 37px, rgba(15,14,12,0.10) 38px)',
                  backgroundPositionY: '12px',
                }}
              >
                {/* red margin rule */}
                <div
                  className="absolute top-0 bottom-0"
                  style={{ left: '28px', width: '1px', background: 'rgba(230,62,33,0.55)' }}
                />

                <div className="md:pl-6">
                  <h2 className="font-display text-[clamp(40px,6vw,82px)] leading-[0.82] flex flex-wrap">
                    {'ABOUT'.split('').map((ch, i) => (
                      <span key={`a${i}`} className="nb-letter-wrap inline-block overflow-hidden align-bottom">
                        <span className="nb-letter inline-block">{ch}</span>
                      </span>
                    ))}
                    <span className="nb-letter-wrap inline-block overflow-hidden align-bottom">
                      <span className="nb-letter inline-block">&nbsp;</span>
                    </span>
                    {'ME'.split('').map((ch, i) => (
                      <span key={`m${i}`} className="nb-letter-wrap hl-red inline-block overflow-hidden align-bottom">
                        <span className="nb-letter inline-block">{ch}</span>
                      </span>
                    ))}
                  </h2>
                  <p className="nb-reveal italic-fraunces text-[clamp(18px,2vw,26px)] mt-1 mb-6">
                    hi there, I&rsquo;m Matthew —
                  </p>

                  <p className="nb-reveal text-[clamp(14px,1.15vw,16px)] leading-[2.36] max-w-[52ch]">
                    I&rsquo;ve created content for <b>50K+ followers</b> and this year I hit{' '}
                    <b className="hl-red">30M+ views</b> at 15 years old. I follow my passion for
                    computer science, AI, entrepreneurship, and content creation —{' '}
                    <span className="italic-fraunces hl-blue">anything is possible.</span>
                  </p>

                  <p className="nb-reveal text-[clamp(14px,1.15vw,16px)] leading-[2.36] max-w-[52ch] mt-[6px]">
                    I believe in God, shipping products, and creating things that impact millions on
                    Sunday — then seeing who tries to use it Monday.
                  </p>

                  {/* connect block */}
                  <div className="nb-reveal mt-10">
                    <p className="section-label mb-3" style={{ color: 'rgba(15,14,12,0.55)' }}>
                      LET&rsquo;S CONNECT
                    </p>
                    <div className="flex flex-wrap items-center gap-x-8 gap-y-2 font-mono text-[13px]">
                      <a href="mailto:hi@matthewnpark.com" className="underline underline-offset-4 decoration-[rgba(15,14,12,0.4)]">
                        matthew.parkk0@gmail.com
                      </a>
                      <span className="hl-fade">·</span>
                      <span>@matthewnpark</span>
                      <span className="hl-fade">·</span>
                      <span style={{ color: 'rgba(15,14,12,0.55)' }}>[ 00 -1 ]</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* scroll hint */}
          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 font-mono text-[10px] tracking-[0.32em] uppercase hl-fade">
            KEEP SCROLLING
          </div>
        </div>
    </section>
  )
}
