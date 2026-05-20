import { useEffect, useRef } from 'react'
import { animate } from 'animejs'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Three scenes that crossfade as user scrolls. Each scene's internal motion runs
// on its own anime.js loop (independent of scroll). Scroll position drives
// crossfade + a grayscale ↔ color cycle, so each scene punches into color near
// its midpoint and fades back to grayscale at its handoff edges.
//
// Scenes: tennis (ball + floating racket + wall) → basketball (bounce) → laptop (typing code)
//
// Section: ~320vh runway. Inner sticky h-screen viewport pins visually while
// ScrollTrigger scrubs the master timeline.

export default function ScrollScenes() {
  const root = useRef(null)
  const stickyRef = useRef(null)

  const sceneTennisRef = useRef(null)
  const sceneBballRef  = useRef(null)
  const sceneCodeRef   = useRef(null)

  const ballRef    = useRef(null) // tennis ball
  const racketRef  = useRef(null) // floating racket
  const basketRef  = useRef(null) // basketball
  const ballShadow = useRef(null) // basketball shadow under it
  const codeLines  = useRef([])   // refs to typed code lines

  useEffect(() => {
    const animations = []

    // --- Tennis: ball ping-pongs between near-edge and wall. Racket bobs. ---
    if (ballRef.current) {
      animations.push(
        animate(ballRef.current, {
          translateX: [
            { to: 280, duration: 700, ease: 'outQuad' },   // toward wall
            { to: 0,   duration: 700, ease: 'outQuad' },   // back toward racket
          ],
          translateY: [
            { to: -36, duration: 350, ease: 'outQuad' },
            { to: 0,   duration: 350, ease: 'inQuad' },
            { to: -36, duration: 350, ease: 'outQuad' },
            { to: 0,   duration: 350, ease: 'inQuad' },
          ],
          rotate: [{ to: 360, duration: 1400, ease: 'linear' }],
          loop: true,
        })
      )
    }
    if (racketRef.current) {
      animations.push(
        animate(racketRef.current, {
          translateY: [{ to: -12 }, { to: 12 }],
          rotate:     [{ to: -4 },  { to: 4 }],
          duration: 2200,
          ease: 'inOutSine',
          loop: true,
          alternate: true,
        })
      )
    }

    // --- Basketball: drop + squash/stretch loop. Shadow scales w/ height. ---
    if (basketRef.current) {
      animations.push(
        animate(basketRef.current, {
          translateY: [
            { to: 0,    duration: 0 },
            { to: 160,  duration: 460, ease: 'inQuad' },     // fall
            { to: 160,  duration: 60,  ease: 'linear' },     // squash hold
            { to: -240, duration: 520, ease: 'outQuad' },    // bounce up
            { to: 0,    duration: 0 },
          ],
          scaleX: [
            { to: 1,    duration: 460 },
            { to: 1.25, duration: 60,  ease: 'outQuad' },
            { to: 1,    duration: 160, ease: 'outElastic(1, 0.7)' },
          ],
          scaleY: [
            { to: 1,    duration: 460 },
            { to: 0.72, duration: 60,  ease: 'outQuad' },
            { to: 1,    duration: 160, ease: 'outElastic(1, 0.7)' },
          ],
          duration: 1040,
          loop: true,
        })
      )
    }
    if (ballShadow.current) {
      animations.push(
        animate(ballShadow.current, {
          scaleX: [{ to: 1 }, { to: 0.55 }, { to: 1 }],
          opacity: [{ to: 0.45 }, { to: 0.18 }, { to: 0.45 }],
          duration: 1040,
          ease: 'inOutQuad',
          loop: true,
        })
      )
    }

    // --- Code lines: type-in width sweep, staggered, loop forever. ---
    codeLines.current.forEach((el, i) => {
      if (!el) return
      animations.push(
        animate(el, {
          width: [{ to: '0%', duration: 0 }, { to: '100%', duration: 700, ease: 'inOutQuad' }],
          opacity: [{ to: 0, duration: 0 }, { to: 1, duration: 80 }],
          delay: i * 220,
          duration: 700,
          loop: true,
          loopDelay: 1200,
        })
      )
    })

    // --- Master scroll timeline: crossfade scenes + grayscale cycle. ---
    const ctx = gsap.context(() => {
      // Start states
      gsap.set([sceneBballRef.current, sceneCodeRef.current], { opacity: 0 })
      gsap.set(sceneTennisRef.current, { opacity: 1, filter: 'grayscale(1)' })
      gsap.set(sceneBballRef.current,  { filter: 'grayscale(1)' })
      gsap.set(sceneCodeRef.current,   { filter: 'grayscale(1)' })

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.5,
        },
      })

      // Scene 1 (tennis) lives 0.00–0.36
      tl.to(sceneTennisRef.current, { filter: 'grayscale(0)', duration: 0.12 }, 0.04)
        .to(sceneTennisRef.current, { filter: 'grayscale(1)', duration: 0.10 }, 0.26)
        .to(sceneTennisRef.current, { opacity: 0, duration: 0.06 }, 0.32)

      // Scene 2 (basketball) lives 0.32–0.68
      tl.to(sceneBballRef.current, { opacity: 1, duration: 0.06 }, 0.30)
        .to(sceneBballRef.current, { filter: 'grayscale(0)', duration: 0.12 }, 0.40)
        .to(sceneBballRef.current, { filter: 'grayscale(1)', duration: 0.10 }, 0.58)
        .to(sceneBballRef.current, { opacity: 0, duration: 0.06 }, 0.66)

      // Scene 3 (code) lives 0.64–1.00
      tl.to(sceneCodeRef.current, { opacity: 1, duration: 0.06 }, 0.64)
        .to(sceneCodeRef.current, { filter: 'grayscale(0)', duration: 0.14 }, 0.72)
        .to(sceneCodeRef.current, { filter: 'grayscale(1)', duration: 0.10 }, 0.90)
    }, root)

    return () => {
      animations.forEach((a) => a && a.pause && a.pause())
      ctx.revert()
    }
  }, [])

  return (
    <section ref={root} className="relative bg-paper" style={{ height: '320vh' }}>
      <div
        ref={stickyRef}
        className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center"
      >
        {/* ---- SCENE 1: Tennis ---- */}
        <div ref={sceneTennisRef} className="absolute inset-0 flex items-center justify-center">
          <svg viewBox="0 0 800 600" className="w-[78%] max-w-[1000px] h-auto" preserveAspectRatio="xMidYMid meet">
            {/* Wall (right side) */}
            <rect x="600" y="60" width="48" height="480" fill="#7a6d52" />
            <rect x="600" y="60" width="48" height="480" fill="url(#wallTex)" opacity="0.25" />
            <defs>
              <pattern id="wallTex" width="14" height="14" patternUnits="userSpaceOnUse">
                <rect width="14" height="14" fill="transparent" />
                <line x1="0" y1="0" x2="14" y2="0" stroke="#0F0E0C" strokeWidth="0.5" />
              </pattern>
            </defs>

            {/* Floor line */}
            <line x1="60" y1="520" x2="740" y2="520" stroke="#0F0E0C" strokeOpacity="0.3" strokeWidth="1.2" />

            {/* Racket (floating, anime.js bobs it) */}
            <g ref={racketRef} transform="translate(160 300)">
              {/* handle */}
              <rect x="-6" y="40" width="12" height="120" rx="3" fill="#3a2d1f" />
              {/* head ring */}
              <ellipse cx="0" cy="0" rx="68" ry="86" fill="none" stroke="#0F0E0C" strokeWidth="6" />
              <ellipse cx="0" cy="0" rx="62" ry="80" fill="#E63E21" opacity="0.12" />
              {/* strings */}
              <g stroke="#0F0E0C" strokeOpacity="0.55" strokeWidth="0.9">
                {[-50, -34, -18, -2, 14, 30, 46].map((y) => (
                  <line key={`h${y}`} x1="-56" y1={y} x2="56" y2={y} />
                ))}
                {[-44, -28, -12, 4, 20, 36].map((x) => (
                  <line key={`v${x}`} x1={x} y1="-72" x2={x} y2="72" />
                ))}
              </g>
              {/* throat */}
              <path d="M -12 78 L 0 96 L 12 78 Z" fill="#3a2d1f" />
            </g>

            {/* Tennis ball */}
            <g ref={ballRef} transform="translate(280 360)">
              <circle r="26" fill="#D4ED3A" />
              <path d="M -26 0 C -16 -22, 16 -22, 26 0" fill="none" stroke="#FFFFFF" strokeWidth="1.6" />
              <path d="M -26 0 C -16 22, 16 22, 26 0" fill="none" stroke="#FFFFFF" strokeWidth="1.6" />
            </g>
          </svg>

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 font-mono text-[11px] tracking-[0.28em] uppercase text-ink/55">
            01 · tennis · build · loop
          </div>
        </div>

        {/* ---- SCENE 2: Basketball ---- */}
        <div ref={sceneBballRef} className="absolute inset-0 flex items-center justify-center">
          <svg viewBox="0 0 800 600" className="w-[78%] max-w-[1000px] h-auto" preserveAspectRatio="xMidYMid meet">
            <line x1="120" y1="500" x2="680" y2="500" stroke="#0F0E0C" strokeWidth="1.4" />

            {/* Shadow */}
            <ellipse ref={ballShadow} cx="400" cy="510" rx="52" ry="8" fill="#0F0E0C" opacity="0.45" style={{ transformBox: 'fill-box', transformOrigin: 'center' }} />

            {/* Basketball */}
            <g ref={basketRef} transform="translate(400 320)" style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
              <circle r="62" fill="#E07A3A" />
              <path d="M -62 0 C -40 -20, 40 -20, 62 0" fill="none" stroke="#0F0E0C" strokeWidth="2.2" />
              <path d="M -62 0 C -40 20, 40 20, 62 0" fill="none" stroke="#0F0E0C" strokeWidth="2.2" />
              <line x1="0" y1="-62" x2="0" y2="62" stroke="#0F0E0C" strokeWidth="2.2" />
              <path d="M -50 -36 C -30 -12, -30 12, -50 36" fill="none" stroke="#0F0E0C" strokeWidth="2.2" />
              <path d="M  50 -36 C  30 -12,  30 12,  50 36" fill="none" stroke="#0F0E0C" strokeWidth="2.2" />
            </g>
          </svg>

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 font-mono text-[11px] tracking-[0.28em] uppercase text-ink/55">
            02 · basketball · keep going
          </div>
        </div>

        {/* ---- SCENE 3: Laptop + code ---- */}
        <div ref={sceneCodeRef} className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-[72%] max-w-[900px]">
            {/* Laptop body */}
            <div
              className="relative mx-auto"
              style={{ width: '100%', perspective: '900px' }}
            >
              <div
                style={{
                  transform: 'rotateX(8deg)',
                  transformStyle: 'preserve-3d',
                  background: '#1a1814',
                  border: '1px solid #0F0E0C',
                  borderRadius: '14px',
                  padding: '14px',
                  boxShadow: '0 30px 60px -20px rgba(0,0,0,0.35)',
                }}
              >
                {/* Screen */}
                <div
                  style={{
                    background: '#0C0B09',
                    borderRadius: '6px',
                    padding: '22px 26px',
                    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                    fontSize: '15px',
                    minHeight: '320px',
                    color: '#E2D0A8',
                  }}
                >
                  {/* Window chrome */}
                  <div className="flex items-center gap-1.5 mb-4 opacity-60">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#E63E21]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#F2C94C]" />
                    <span className="w-2.5 h-2.5 rounded-full bg-[#8EE000]" />
                    <span className="ml-3 text-[10px] tracking-[0.2em] uppercase">~/loop.js</span>
                  </div>

                  {/* Typed lines */}
                  {[
                    { code: 'function ship(idea) {', color: '#8EE000' },
                    { code: '  while (true) {', color: '#E2D0A8' },
                    { code: '    build(idea); post(); listen();', color: '#E2D0A8' },
                    { code: '    if (broken) iterate();', color: '#E63E21' },
                    { code: '  }', color: '#E2D0A8' },
                    { code: '}', color: '#8EE000' },
                  ].map((row, i) => (
                    <div key={i} className="overflow-hidden whitespace-nowrap" style={{ marginBottom: '6px' }}>
                      <div
                        ref={(el) => (codeLines.current[i] = el)}
                        style={{
                          width: '0%',
                          overflow: 'hidden',
                          whiteSpace: 'nowrap',
                          color: row.color,
                          display: 'inline-block',
                        }}
                      >
                        {row.code}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Laptop base */}
              <div
                className="mx-auto"
                style={{
                  marginTop: '-2px',
                  height: '14px',
                  background: 'linear-gradient(180deg, #2a261f 0%, #1a1814 100%)',
                  width: '108%',
                  marginLeft: '-4%',
                  borderRadius: '0 0 14px 14px',
                  boxShadow: '0 20px 40px -16px rgba(0,0,0,0.3)',
                }}
              />
            </div>
          </div>

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 font-mono text-[11px] tracking-[0.28em] uppercase text-ink/55">
            03 · code · the loop
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 font-mono text-[10px] tracking-[0.32em] uppercase text-ink/40">
          KEEP SCROLLING
        </div>
      </div>
    </section>
  )
}
