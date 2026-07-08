import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'
import { ArrowCurve } from './Doodles'

gsap.registerPlugin(MotionPathPlugin)

import Micrographics, { AsciiScrap } from './Micrographics'
import './home.css'
import './loud-pages.css'

// endless rally — ball arcs over the net, rackets swing on contact
function TennisRally() {
  const root = useRef(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = gsap.context(() => {
      const FLIGHT = 1.05
      const tl = gsap.timeline({ repeat: -1 })

      // left → right
      tl.to('.rally-ball', {
        motionPath: { path: '#rally-arc-lr', align: '#rally-arc-lr', alignOrigin: [0.5, 0.5] },
        duration: FLIGHT,
        ease: 'power1.inOut',
      }, 0)
      tl.to('.rally-racket-r', { rotation: -55, duration: 0.1, ease: 'power2.in' }, FLIGHT - 0.1)
      tl.to('.rally-racket-r', { rotation: 0, duration: 0.35, ease: 'back.out(2.5)' }, FLIGHT)
      // squash on impact
      tl.to('.rally-ball', { scaleX: 0.65, duration: 0.05, yoyo: true, repeat: 1 }, FLIGHT - 0.05)

      // right → left
      tl.to('.rally-ball', {
        motionPath: { path: '#rally-arc-rl', align: '#rally-arc-rl', alignOrigin: [0.5, 0.5] },
        duration: FLIGHT,
        ease: 'power1.inOut',
      }, FLIGHT)
      tl.to('.rally-racket-l', { rotation: 55, duration: 0.1, ease: 'power2.in' }, 2 * FLIGHT - 0.1)
      tl.to('.rally-racket-l', { rotation: 0, duration: 0.35, ease: 'back.out(2.5)' }, 2 * FLIGHT)
      tl.to('.rally-ball', { scaleX: 0.65, duration: 0.05, yoyo: true, repeat: 1 }, 2 * FLIGHT - 0.05)

      gsap.set('.rally-racket-l', { transformOrigin: '50% 92%' })
      gsap.set('.rally-racket-r', { transformOrigin: '50% 92%' })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={root} className="mt-8 w-full max-w-[700px]" aria-hidden="true">
      <svg viewBox="0 0 600 150" className="w-full overflow-visible">
        {/* flight paths (invisible rails) */}
        <path id="rally-arc-lr" d="M60 92 Q 300 -14 540 92" fill="none" stroke="none" />
        <path id="rally-arc-rl" d="M540 92 Q 300 -14 60 92" fill="none" stroke="none" />

        {/* court line + net */}
        <line x1="14" y1="118" x2="586" y2="118" stroke="#14100B" strokeWidth="2" />
        <line x1="300" y1="70" x2="300" y2="118" stroke="#14100B" strokeWidth="2" strokeDasharray="4 4" />
        <line x1="290" y1="70" x2="310" y2="70" stroke="#14100B" strokeWidth="2.5" />

        {/* left racket */}
        <g className="rally-racket-l">
          <ellipse cx="52" cy="72" rx="16" ry="22" fill="none" stroke="#14100B" strokeWidth="3" />
          <line x1="46" y1="58" x2="58" y2="86" stroke="#14100B" strokeWidth="0.8" />
          <line x1="58" y1="58" x2="46" y2="86" stroke="#14100B" strokeWidth="0.8" />
          <line x1="40" y1="64" x2="64" y2="80" stroke="#14100B" strokeWidth="0.8" />
          <line x1="52" y1="94" x2="52" y2="118" stroke="#14100B" strokeWidth="4" strokeLinecap="round" />
        </g>

        {/* right racket */}
        <g className="rally-racket-r">
          <ellipse cx="548" cy="72" rx="16" ry="22" fill="none" stroke="#14100B" strokeWidth="3" />
          <line x1="542" y1="58" x2="554" y2="86" stroke="#14100B" strokeWidth="0.8" />
          <line x1="554" y1="58" x2="542" y2="86" stroke="#14100B" strokeWidth="0.8" />
          <line x1="536" y1="64" x2="560" y2="80" stroke="#14100B" strokeWidth="0.8" />
          <line x1="548" y1="94" x2="548" y2="118" stroke="#14100B" strokeWidth="4" strokeLinecap="round" />
        </g>

        {/* the ball — optic yellow, seam curve */}
        <g className="rally-ball">
          <circle r="8" fill="#C9CE3B" stroke="#14100B" strokeWidth="1.5" />
          <path d="M-5.5 -4 Q 0 0 -5.5 4" fill="none" stroke="#14100B" strokeWidth="1" />
          <path d="M5.5 -4 Q 0 0 5.5 4" fill="none" stroke="#14100B" strokeWidth="1" />
        </g>
      </svg>
    </div>
  )
}

// THE LIFE — tennis, the one chapter that stayed.
export default function LifePage() {
  return (
    <section id="life" className="life-page grain relative">
      <section className="life-chapter">
        <Micrographics count={8} />
        <AsciiScrap name="burst" className="right-[10%] top-[16%] rotate-[-5deg]" />
        <AsciiScrap name="bar" className="right-[6%] bottom-[10%] rotate-[2deg]" />
        <div className="loud-label">The life / ch. 01</div>
        <h2 className="life-head mt-4 font-sixcaps text-[clamp(70px,9vw,160px)] leading-[0.9] text-[#14100B]">
          TENNIS <span className="text-umber">TAPE</span>
        </h2>
        <p className="note mt-2 rotate-[-2deg] text-[clamp(20px,2vw,28px)]">
          forehands before founders meetings
        </p>
        <TennisRally />
        <div className="mt-10 grid max-w-[950px] gap-6 md:grid-cols-2">
          <div className="slot" style={{ aspectRatio: '16 / 9' }}>clip_01.mp4<br />match point goes here</div>
          <div className="slot" style={{ aspectRatio: '16 / 9' }}>clip_02.mp4<br />the rally nobody believes</div>
        </div>
        <div className="mt-8 flex items-center gap-6">
          <ArrowCurve className="w-20" />
          <span className="font-elite text-[13px] text-bark">serve percentage: personal information.</span>
        </div>
        <p className="mt-10 font-mono text-[10px] tracking-[0.24em] uppercase text-bark/60">
          © 2026 Matthew Park — the life, in progress
        </p>
      </section>
    </section>
  )
}
