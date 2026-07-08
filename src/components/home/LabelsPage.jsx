import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { gsap } from 'gsap'
import { animate, stagger } from 'animejs'
import Micrographics, { AsciiScrap } from './Micrographics'
import './home.css'
import './loud-pages.css'

// LABELS™ — y2k / vintage manufactured goods.
// A section of the loud home. Matthew as a mass-produced,
// quality-controlled, fully certified product.

const MARQUEE = '100% AUTHENTIC · NO ARTIFICIAL HYPE · GENUINE KID · BATCH 2010 · '

const NUTRITION = [
  { k: 'Energy', v: '110%' },
  { k: 'Ideas', v: '36 / day' },
  { k: 'Sleep', v: '100%' },
  { k: 'Volume', v: '100%' },
  { k: 'Faith', v: '100%' },
  { k: 'Chill', v: 'plenty' },
  { k: 'Stability', v: 'unstable' },
]

function tilt(deg) {
  return { rotate: deg }
}

export default function LabelsPage() {
  const root = useRef(null)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    // anime.js — labels get dealt onto the table when the section scrolls in
    const cards = root.current.querySelectorAll('.label-card, .holo')
    cards.forEach((c) => (c.style.opacity = '0'))
    let played = false
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || played) return
        played = true
        animate(cards, {
          opacity: [0, 1],
          scale: [0.7, 1],
          rotate: (el) => [gsap.utils.random(-14, 14), el.dataset.rot || 0],
          ease: 'outBack(1.6)',
          duration: 650,
          delay: stagger(110),
        })
        io.disconnect()
      },
      { threshold: 0.12 },
    )
    io.observe(root.current)

    const ctx = gsap.context(() => {
      // watermark ™ drifts as the section passes through the viewport
      gsap.to('.tm-watermark', {
        yPercent: 30,
        rotate: 8,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: 0.8 },
      })
    }, root)
    return () => {
      io.disconnect()
      ctx.revert()
    }
  }, [])

  return (
    <section id="labels" ref={root} className="labels-page grain relative">
      <div className="tm-watermark">™</div>
      <Micrographics count={12} />
      <AsciiScrap name="box" className="left-[4%] top-[6%] rotate-[-4deg]" />
      <AsciiScrap name="burst" className="right-[6%] top-[30%] rotate-[6deg]" />
      <AsciiScrap name="wave" className="left-[10%] bottom-[5%] rotate-[2deg]" />

      <header className="relative z-10 px-6 pt-10 md:px-12">
        <div className="loud-label flex items-center justify-between">
          <span>03 / Labels™</span>
          <span>Y2K · vintage · manufactured</span>
        </div>
        <h1 className="mt-[6vh] font-archivo text-[clamp(52px,9vw,150px)] leading-[0.88]">
          MANU
          <br />
          FACTURED<span className="align-super text-[0.35em]">™</span>
        </h1>
        <p className="note mt-3 rotate-[-1.5deg] text-[clamp(22px,2.4vw,32px)]">
          certified genuine kid, in production since 2010
        </p>
      </header>

      <div className="loud-marquee relative z-10 mt-12 py-2" aria-hidden="true">
        <div className="marquee-track font-elite text-[clamp(16px,2vw,24px)] tracking-[0.2em]">
          <span>{MARQUEE.repeat(3)}</span>
          <span>{MARQUEE.repeat(3)}</span>
        </div>
      </div>

      {/* the label sheet */}
      <div className="relative z-10 grid gap-10 px-6 py-16 md:grid-cols-3 md:gap-8 md:px-12 md:py-20">
        {/* product tag */}
        <motion.div className="label-card" data-rot="-2" whileHover={{ ...tilt(0), y: -8 }} style={tilt(-2)}>
          <div className="font-mono text-[9px] tracking-[0.3em] uppercase text-bark/60">Product tag</div>
          <div className="mt-3 font-archivo text-[26px] leading-tight">
            MATTHEW PARK<span className="align-super text-[13px]">®</span>
          </div>
          <div className="mt-2 font-elite text-[13px] leading-[1.7]">
            GENUINE HUMAN
            <br />
            MODEL NO. MP-2010
            <br />
            MADE IN KENTUCKY, USA
          </div>
          <div className="barcode mt-5" />
          <div className="mt-1 flex justify-between font-mono text-[10px] tracking-[0.25em]">
            <span>7 15000 20100 4</span>
            <span>KY-USA</span>
          </div>
        </motion.div>

        {/* nutrition facts — unstable but chill, see-through like it has nothing to hide */}
        <div className="unstable-wobble">
          <motion.div className="label-card label-card-glass" data-rot="1.5" whileHover={{ ...tilt(0), y: -8 }} style={tilt(1.5)}>
            <div className="border-b-[6px] border-[#14100B] pb-1 font-archivo text-[24px]">
              Nutrition Facts
            </div>
            <div className="mt-1 font-mono text-[10px] tracking-[0.1em]">
              serving size: one conversation (45 min)
            </div>
            {NUTRITION.map((n, i) => (
              <div key={n.k} className={`nutrition-row ${i === NUTRITION.length - 1 ? 'thick' : ''}`}>
                <span>{n.k}</span>
                <b>{n.v}</b>
              </div>
            ))}
            <div className="mt-2 font-mono text-[9px] leading-[1.5] text-bark/70">
              * daily values based on a 15-year-old founder diet. transparency guaranteed.
            </div>
          </motion.div>
        </div>

        {/* warning */}
        <motion.div className="label-card caution" data-rot="-1" whileHover={{ ...tilt(0), y: -8 }} style={tilt(-1)}>
          <div className="font-archivo text-[30px]">⚠ WARNING</div>
          <p className="mt-3 font-elite text-[14px] leading-[1.8]">
            CONTENTS EXTREMELY EXTROVERTED.
            <br />
            DO NOT APPROACH UNLESS PREPARED
            <br />
            TO TALK FOR 45+ MINUTES.
          </p>
          <p className="mt-4 font-mono text-[9px] tracking-[0.2em] uppercase text-bark/70">
            side effects: new ideas, new friends, one more startup
          </p>
        </motion.div>

        {/* care instructions */}
        <motion.div className="label-card" data-rot="2" whileHover={{ ...tilt(0), y: -8 }} style={tilt(2)}>
          <div className="font-mono text-[9px] tracking-[0.3em] uppercase text-bark/60">Care instructions</div>
          <ul className="mt-4 space-y-3 font-elite text-[13.5px] leading-[1.5]">
            <li>— wash in cold takes only</li>
            <li>— do not tumble-dry ambition</li>
            <li>— iron out doubts before wearing</li>
            <li>— keep away from low standards</li>
            <li>— do not underestimate</li>
          </ul>
        </motion.div>

        {/* QC stamp */}
        <motion.div
          className="label-card flex flex-col items-center justify-center gap-4"
          data-rot="-1.5"
          whileHover={{ ...tilt(0), y: -8 }}
          style={tilt(-1.5)}
        >
          <div className="qc-stamp">
            QUALITY
            <br />
            CONTROL
            <br />
            PASSED
            <br />
            ★ INSP. NO. 07 ★
          </div>
          <div className="font-mono text-[10px] tracking-[0.25em] uppercase text-bark/70">
            inspected · approved · shipped
          </div>
        </motion.div>

        {/* y2k holo */}
        <motion.div
          className="holo flex flex-col items-center justify-center gap-2 p-6 text-center shadow-[7px_8px_0_rgba(20,16,11,0.85)]"
          data-rot="1"
          whileHover={{ ...tilt(0), y: -8, scale: 1.02 }}
          style={tilt(1)}
        >
          <span className="holo-chrome text-[clamp(30px,3vw,44px)] leading-none">Y2K</span>
          <span className="holo-chrome text-[clamp(18px,1.8vw,26px)] leading-none">CERTIFIED</span>
          <span className="mt-2 font-mono text-[10px] tracking-[0.25em] uppercase text-[#14100B]/80">
            ✦ 2000s kid at heart ✦
          </span>
        </motion.div>
      </div>

    </section>
  )
}
