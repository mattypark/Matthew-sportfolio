import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

export default function Hero({ booted = false }) {
  const root = useRef(null)
  const played = useRef(false)

  useEffect(() => {
    // Hide initial state so things don't flash before loader finishes
    if (root.current && !played.current) {
      gsap.set(root.current.querySelectorAll('.h-line'), { yPercent: 105 })
      gsap.set(root.current.querySelectorAll('.h-bio > *'), { y: 16, opacity: 0 })
      gsap.set(root.current.querySelectorAll('.h-scroll'), { opacity: 0 })
    }
  }, [])

  useEffect(() => {
    if (!booted || played.current) return
    played.current = true
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })
      tl.to('.h-line', { yPercent: 0, duration: 1.2, stagger: 0.08 })
        .to('.h-bio > *', { y: 0, opacity: 1, duration: 0.8, stagger: 0.07 }, '-=0.55')
        .to('.h-scroll', { opacity: 1, duration: 0.6 }, '-=0.3')
    }, root)
    return () => ctx.revert()
  }, [booted])

  return (
    <section id="top" ref={root} className="relative min-h-[100svh] gutter pt-28 pb-12">
      {/* Massive display name */}
      <div className="mt-12">
        <div className="overflow-hidden mb-3">
          <div className="h-line font-mono text-[11px] tracking-[0.28em] uppercase text-paper/55 flex items-center gap-3">
            <span className="w-8 h-px bg-paper/35" />
            AGE <span style={{ color: 'var(--primary)' }}>·</span> 15
          </div>
        </div>
        <div className="overflow-hidden"><div className="h-line font-display text-[clamp(56px,17vw,360px)]">MATTHEW</div></div>
        <div className="overflow-hidden -mt-[0.08em]"><div className="h-line font-display text-[clamp(56px,17vw,360px)]">PARK</div></div>
      </div>

      {/* Bottom row: bio + scroll */}
      <div className="mt-16 flex flex-wrap items-end justify-between gap-10">
        <div className="h-bio max-w-[460px] font-mono text-[13px] leading-[1.55] text-paper/80">
          <p>Founder and CEO of Axiom Pathways, a nonprofit having top VC's/Founders teaching AI, CS, entrepreneurship, and startups to interns/highschoolers who care more than they're qualified.</p>
          <p className="mt-3">I'm constantly learning, I'm so young, I'm not afraid to switch from one thing to another, and I'm very, VERY Extroverted. <span className="italic-fraunces text-primary">like very.</span></p>
          <p className="mt-3 hl-fade">// also: brand systems, ops automations, the occasional landing page that converts.</p>
        </div>
        <div className="h-scroll font-mono text-[10px] tracking-[0.22em] uppercase text-paper/40 flex items-center gap-3">
          <span className="w-12 h-px bg-paper/30" />
          SCROLL &middot; (TRUST)
        </div>
      </div>

    </section>
  )
}
