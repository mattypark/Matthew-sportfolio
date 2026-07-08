import { Component, lazy, Suspense, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'
import { Squiggle, Star, Sun, ArrowCurve, Spiral, CircleScribble } from './Doodles'
import Micrographics, { AsciiScrap } from './Micrographics'

gsap.registerPlugin(MotionPathPlugin)

// three.js and the world-atlas globe are heavy — split them out of the main chunk
const ThreeBlock = lazy(() => import('./ThreeBlock'))
const Globe = lazy(() => import('../Globe'))

// WebGL can fail (headless, low-end GPUs, blocked contexts) — a crash here must
// not blank the whole creative side. Degrade to a quiet placeholder instead.
class WebGLBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { failed: false }
  }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  render() {
    if (this.state.failed) return this.props.fallback ?? null
    return this.props.children
  }
}

// THE CREATIVE HALF — cream, black + brown, every font that behaves badly.
// Organized chaos: each block is composed, the pileup is intentional.

function RotatingBadge() {
  return (
    <div className="spin-slow h-[120px] w-[120px] md:h-[150px] md:w-[150px]" aria-hidden="true">
      <svg viewBox="0 0 150 150" className="h-full w-full">
        <defs>
          <path id="badge-arc" d="M75 75 m-58 0 a58 58 0 1 1 116 0 a58 58 0 1 1 -116 0" />
        </defs>
        <text className="font-mono" fontSize="12.5" letterSpacing="3.5" fill="#14100B">
          <textPath href="#badge-arc">
            MATTHEW PARK · 30M+ VIEWS · KENTUCKY · EST 2010 ·
          </textPath>
        </text>
        <circle cx="75" cy="75" r="6" fill="var(--umber)" />
      </svg>
    </div>
  )
}

function BlockLoud() {
  return (
    <div className="relative min-h-[100svh] overflow-hidden px-6 pb-20 pt-8 md:px-12">
      <Micrographics count={12} />
      <AsciiScrap name="star" className="left-[3%] top-[38%] rotate-[-8deg]" />
      <AsciiScrap name="wave" className="bottom-[6%] right-[8%] rotate-[3deg]" />
      <div className="loud-label flex items-center justify-between">
        <span>Right brain / 002</span>
        <span>Maximal</span>
      </div>

      <div className="relative mt-[7vh] grid gap-14 md:grid-cols-[1.15fr_0.85fr] md:gap-8">
        {/* left — the loud type stack + polaroid */}
        <div>
          <p className="max-reveal font-bodoni italic text-[clamp(22px,2.6vw,38px)] text-bark">
            the
          </p>
          <h2 className="max-reveal font-archivo txt-outline text-[clamp(46px,6.6vw,112px)] leading-[0.86]">
            CREATIVE
          </h2>
          <h2 className="max-reveal -mt-[0.06em] font-archivo text-[clamp(72px,10vw,170px)] leading-[0.86] text-umber">
            HALF
          </h2>
          <p className="max-reveal mt-2 font-bodoni italic text-[clamp(24px,3vw,44px)] text-[#14100B]">
            &amp; everything <span className="text-umber">unfiltered</span>
          </p>
          <Squiggle className="mt-1 w-40 md:w-56" />

          <div className="relative mt-[6vh] flex flex-wrap items-end gap-10">
            {/* mobile keeps the polaroid in flow — desktop gets the center sticker */}
            <figure className="max-reveal polaroid w-[190px] rotate-[5deg] md:hidden" data-speed="-8">
              <span className="tape -top-3 left-1/2 -translate-x-1/2 rotate-[-4deg]" />
              <img src="/megold.png" alt="Matthew" loading="lazy" width="480" height="600" style={{ aspectRatio: '4 / 5' }} />
              <figcaption className="note pt-2 text-center text-[20px]">me, allegedly</figcaption>
            </figure>

            <div className="max-reveal" data-speed="6">
              <RotatingBadge />
            </div>

            <p className="max-reveal max-w-[24ch] font-elite text-[13px] leading-[1.8] text-bark">
              the left side is the resume. this side is why the resume exists.
            </p>
          </div>
        </div>

        {/* the sticker — slapped dead-center over both columns */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 z-20 hidden -translate-x-1/2 -translate-y-1/2 md:block">
          <figure className="max-reveal polaroid w-[210px] rotate-[-6deg]" data-speed="-8" style={{ pointerEvents: 'auto' }}>
            <span className="tape -top-3 left-1/2 -translate-x-1/2 rotate-[-4deg]" />
            <img src="/megold.png" alt="Matthew" loading="lazy" width="480" height="600" style={{ aspectRatio: '4 / 5' }} />
            <figcaption className="note pt-2 text-center text-[20px]">me, allegedly</figcaption>
          </figure>
        </div>

        {/* right — literally me: kid, traveler, builder */}
        <div className="relative flex flex-col items-center gap-6 md:pt-10">
          <Sun className="absolute -top-2 right-[4%] w-14 md:w-20" data-speed="-14" />

          <span className="max-reveal loud-label self-start md:self-center">Literally me</span>

          <div className="max-reveal flex flex-wrap items-center justify-center gap-4">
            <span className="inline-block -rotate-3 border-2 border-[#14100B] px-4 py-1 font-archivo text-[clamp(18px,1.8vw,26px)]">
              KID™
            </span>
            <span className="inline-block rotate-2 border-2 border-dashed border-umber px-4 py-1 font-elite text-[clamp(15px,1.5vw,21px)] text-umber">
              TRAVELER
            </span>
            <span className="inline-block -rotate-1 bg-latte px-4 py-1 font-sixcaps text-[clamp(22px,2.2vw,32px)] text-[#14100B]">
              BUILDER
            </span>
          </div>

          <div className="max-reveal w-[min(260px,70%)]" data-speed="4">
            <WebGLBoundary fallback={<div className="aspect-square w-full rounded-full border border-[#14100B]/30" />}>
              <Suspense fallback={<div className="aspect-square w-full rounded-full border border-[#14100B]/30" />}>
                <Globe lat={38.25} lng={-85.75} />
              </Suspense>
            </WebGLBoundary>
          </div>

          <p className="note rotate-[-2deg] text-[clamp(20px,2vw,28px)] leading-[1.1] text-center">
            the world is the playground &rarr;
          </p>

          <div className="max-reveal w-full max-w-[300px] border-t border-b border-[#14100B]/25 py-3 font-mono text-[10px] tracking-[0.2em] uppercase text-bark/75">
            <div className="flex justify-between"><span>Passport</span><span>pages left: many</span></div>
            <div className="mt-1.5 flex justify-between"><span>Home base</span><span>38.25°N · 85.75°W</span></div>
            <div className="mt-1.5 flex justify-between"><span>Next stamp</span><span>loading…</span></div>
          </div>

          {/* paper plane doing laps — the next trip, already circling */}
          <div className="max-reveal relative mt-2 w-full max-w-[320px]" aria-hidden="true">
            <svg viewBox="0 0 320 130" className="w-full overflow-visible">
              <path
                id="plane-orbit-path"
                className="plane-orbit-trail"
                d="M160 65 m-140 0 a140 52 0 1 1 280 0 a140 52 0 1 1 -280 0"
                fill="none"
                stroke="var(--umber)"
                strokeWidth="1.5"
                strokeDasharray="6 8"
                opacity="0.7"
              />
              <g className="plane-orbit-plane">
                <path d="M0 -7 L16 0 L0 7 L4 0 Z" fill="#14100B" />
              </g>
            </svg>
            <span className="note absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rotate-[-3deg] whitespace-nowrap text-[clamp(17px,1.7vw,23px)]">
              next flight: boarding soon
            </span>
          </div>

          <Star className="absolute bottom-[2%] left-[2%] w-10 md:w-14" />
        </div>
      </div>
    </div>
  )
}

const OBSESSIONS = [
  { word: 'TENNIS', cls: 'font-sixcaps text-[clamp(80px,10vw,170px)] text-[#14100B]', rot: '-rotate-2', align: 'self-start' },
  { word: 'artificial intelligence', cls: 'font-bodoni italic text-[clamp(34px,4.2vw,64px)] text-umber', rot: 'rotate-1', align: 'self-end -mt-[0.5em]' },
  { word: 'SHIPPING', cls: 'font-archivo txt-outline-umber text-[clamp(56px,7.5vw,120px)]', rot: 'rotate-[1.5deg]', align: 'self-start -mt-[0.35em]' },
  { word: 'content', cls: 'font-caveat text-[clamp(54px,7vw,110px)] text-latte', rot: '-rotate-3', align: 'self-center -mt-[0.45em]' },
  { word: 'COMPUTERS.', cls: 'font-elite text-[clamp(30px,4vw,58px)] text-bark', rot: 'rotate-2', align: 'self-end -mt-[0.3em]' },
  { word: 'startups', cls: 'italic-fraunces text-[clamp(40px,5.5vw,84px)] text-[#14100B]', rot: '-rotate-1', align: 'self-start -mt-[0.35em]' },
  { word: 'FAITH', cls: 'font-display text-[clamp(70px,9vw,150px)] text-umber', rot: 'rotate-1', align: 'self-center -mt-[0.3em]' },
]

function BlockObsessions() {
  return (
    <div className="relative overflow-hidden px-6 py-20 md:px-12">
      <Micrographics count={10} />
      <AsciiScrap name="stairs" className="right-[4%] top-[10%] rotate-[4deg]" />
      <AsciiScrap name="burst" className="left-[10%] bottom-[22%] rotate-[-6deg]" />
      <div className="loud-label mb-10 flex items-center justify-between">
        <span>Obsessions</span>
        <span>In no order</span>
      </div>

      <ArrowCurve className="absolute left-[4%] top-[16%] w-20 md:w-28" flip />
      <Spiral className="absolute bottom-[8%] right-[6%] w-16 md:w-24" data-speed="-10" />

      <div className="relative z-10 flex flex-col">
        {OBSESSIONS.map((o) => (
          <div key={o.word} className={`max-reveal ${o.align}`}>
            <span className={`inline-block leading-[0.95] ${o.cls} ${o.rot}`}>{o.word}</span>
          </div>
        ))}
      </div>

      <p className="note mt-8 rotate-[-2deg] text-[clamp(20px,2vw,28px)]">
        pick one? never heard of her.
      </p>
    </div>
  )
}

function BlockObject() {
  // new brain every visit — the seed readout proves it
  const seed = Math.random().toString(16).slice(2, 8).toUpperCase()
  return (
    <div className="relative border-y border-[#14100B]/20 px-6 py-16 md:px-12">
      <Micrographics count={8} />
      <AsciiScrap name="box" className="right-[5%] top-[8%] rotate-[2deg]" />
      <AsciiScrap name="bar" className="left-[4%] bottom-[8%] rotate-[-2deg]" />
      <div className="loud-label mb-6 flex items-center justify-between">
        <span>Object_001 / rotating thoughts</span>
        <span>brain.obj — randomized</span>
      </div>

      <div className="relative">
        <div className="ruled h-[380px] border border-[#14100B] md:h-[460px]">
          <WebGLBoundary
            fallback={
              <div className="flex h-full items-center justify-center font-mono text-[11px] tracking-[0.22em] uppercase text-bark/50">
                object offline — no webgl
              </div>
            }
          >
            <Suspense fallback={<div className="flex h-full items-center justify-center font-mono text-[11px] tracking-[0.22em] uppercase text-bark/50">loading object…</div>}>
              <ThreeBlock />
            </Suspense>
          </WebGLBoundary>
        </div>
      </div>

      <div className="mt-10 flex flex-wrap gap-x-10 gap-y-2 font-mono text-[10px] tracking-[0.22em] uppercase text-bark/70">
        <span>38.25°N · 85.75°W</span>
        <span>SEED: {seed}</span>
        <span>STATE: ABSORBING INFORMATION</span>
        <span>SPINNING SINCE 2010</span>
      </div>
    </div>
  )
}

// ---------- ASCII WING — text is the texture ----------

const ASCII_FLOWER = String.raw`
        .:*:.
      .:'   ':.
     ::  .*.  ::
     ':.  :  .:'
   .__ ':.:' __.
      '-.|.-'
         |
     \   |   /
      \  |  /
       \.|./
         |
       __|__
      '.___.'`

const ASCII_GLOBE = String.raw`
       _____
    ,-:.  \;:-.
  .'-;_,;  ':-;_.
 /;   '/    ,  _'.
| ''. (     /  ' \|
|:.   \'-.  \_  / |
|     (   ',  .\ ;|
 \     | .'    '-'/
  '.   ;/       .'
    ''-._____.-'`

const ASCII_MP = String.raw`
MM   MM  PPPPPP
MMM MMM  PP  PP
MMMMMMM  PPPPPP
MM M MM  PP
MM   MM  PP
MM   MM  PP`

const ASCII_SMILE = String.raw`
   .-''''-.
  /  o  o  \
 |    ..    |
  \  \__/  /
   '-....-'`

function BlockAscii() {
  const stream = '.MP.CRTV//'
  return (
    <div className="relative overflow-hidden border-t border-[#14100B]/20 px-6 py-20 md:px-12">
      <Micrographics count={14} />

      <div className="loud-label mb-12 flex items-center justify-between">
        <span>Output_004 / ascii wing</span>
        <span>text is the texture</span>
      </div>

      <div className="relative z-10 flex flex-wrap items-start justify-center gap-8 md:gap-10">
        <div className="max-reveal ascii-poster rotate-[-3deg]" data-speed="-4">
          <div className="ascii-poster-head"><span>Spec. 001</span><span>flower.txt</span></div>
          <pre className="ascii-pre text-umber">{ASCII_FLOWER}</pre>
          <div className="ascii-poster-foot"><span>rendered in 7-bit</span><span>MP®</span></div>
        </div>

        <div className="max-reveal ascii-poster ascii-poster-umber mt-12 rotate-[2deg]" data-speed="5">
          <div className="ascii-poster-head"><span>Spec. 002</span><span>world.txt</span></div>
          <pre className="ascii-pre">{ASCII_GLOBE}</pre>
          <div className="ascii-poster-foot"><span>the playground</span><span>38.25°N</span></div>
        </div>

        <div className="max-reveal ascii-poster ascii-poster-black rotate-[-1.5deg]" data-speed="-6">
          <div className="ascii-poster-head"><span>Spec. 003</span><span>monogram.txt</span></div>
          <pre className="ascii-pre">{ASCII_MP}</pre>
          <div className="ascii-poster-foot"><span>manufactured</span><span>est. 2010</span></div>
        </div>

        <div className="max-reveal ascii-poster mt-16 rotate-[4deg]" data-speed="3">
          <div className="ascii-poster-head"><span>Spec. 004</span><span>mood.txt</span></div>
          <pre className="ascii-pre">{ASCII_SMILE}</pre>
          <pre className="ascii-pre mt-2 text-umber">{`${stream}\n${stream.slice(3)}\n${stream.slice(6)}`}</pre>
          <div className="ascii-poster-foot"><span>state: smiling</span><span>always</span></div>
        </div>
      </div>

      <p className="note relative z-10 mt-10 rotate-[-1.5deg] text-[clamp(20px,2vw,28px)]">
        when the images leave, the keyboard stays.
      </p>
    </div>
  )
}

const STATS = [
  { num: '30M+', label: 'views this year', cls: 'font-archivo text-[clamp(52px,6.5vw,104px)] text-[#14100B]' },
  { num: '75K+', label: 'followers', cls: 'font-sixcaps text-[clamp(64px,8vw,130px)] text-umber' },
  { num: '500+', label: 'axiom interns', cls: 'font-bodoni italic text-[clamp(56px,7vw,110px)] text-bark' },
  { num: '15', label: 'years old', cls: 'font-elite text-[clamp(44px,5.5vw,88px)] text-[#14100B]' },
]

function BlockNumbers() {
  return (
    <div className="relative overflow-hidden px-6 py-20 md:px-12">
      <div className="halftone absolute right-0 top-0 h-48 w-48 opacity-70 md:h-72 md:w-72" aria-hidden="true" />
      <Micrographics count={10} />
      <AsciiScrap name="arrow" className="left-[42%] top-[10%] rotate-[10deg]" />
      <AsciiScrap name="cloud" className="right-[6%] bottom-[14%] rotate-[-4deg]" />

      <div className="loud-label mb-12">Receipts / the numbers side</div>

      <div className="relative grid gap-12 md:grid-cols-[1fr_1.2fr]">
        <div className="relative">
          <figure className="max-reveal torn w-[240px] rotate-[-4deg] md:w-[300px]" data-speed="-6">
            <img
              src="/matthewflowers.webp"
              alt="Matthew with flowers"
              loading="lazy"
              width="600"
              height="750"
              className="duotone block w-full"
              style={{ aspectRatio: '4 / 5', objectFit: 'cover' }}
            />
          </figure>
          <figure className="max-reveal polaroid absolute left-[38%] top-[30%] w-[170px] rotate-[7deg] md:w-[210px]" data-speed="8">
            <span className="tape -top-3 left-1/2 -translate-x-1/2 rotate-[3deg]" />
            <img src="/about-photo.png" alt="Matthew portrait" loading="lazy" width="480" height="600" style={{ aspectRatio: '4 / 5' }} />
            <figcaption className="note pt-1 text-center text-[19px]">still me</figcaption>
          </figure>
          <Star className="absolute -left-2 bottom-[4%] w-10 md:w-14" color="var(--umber)" />
        </div>

        <div className="flex flex-col gap-2">
          {STATS.map((s) => (
            <div key={s.label} className="max-reveal flex items-baseline gap-5 border-b border-[#14100B]/15 pb-2">
              <span className={`leading-[0.9] ${s.cls}`}>{s.num}</span>
              <span className="note text-[clamp(20px,2vw,28px)]">{s.label}</span>
            </div>
          ))}
          <p className="mt-4 font-mono text-[11px] leading-[1.8] text-bark/70">
            // numbers are the boring part. the fun part is that nobody asked
            for permission.
          </p>
        </div>
      </div>
    </div>
  )
}

export function BlockCTA() {
  return (
    <div className="relative overflow-hidden px-6 pb-16 pt-24 text-center md:px-12">
      <Micrographics count={9} />
      <AsciiScrap name="music" className="left-[8%] top-[22%] rotate-[-7deg]" />
      <AsciiScrap name="star" className="right-[7%] top-[40%] rotate-[9deg]" />
      <div className="relative inline-block">
        <h2 className="ransom max-reveal text-[clamp(56px,9vw,150px)] leading-[1]" aria-label="SAY HI">
          {'SAY HI'.split('').map((ch, i) =>
            ch === ' ' ? <span key={i}>&nbsp;</span> : <span key={i}>{ch}</span>,
          )}
        </h2>
        <CircleScribble className="pointer-events-none absolute -inset-x-10 -inset-y-6 h-auto w-[calc(100%+80px)]" />
      </div>

      <div className="mt-10">
        <a
          href="mailto:matthew.parkk0@gmail.com"
          data-hover
          className="font-mono text-[clamp(14px,1.6vw,20px)] tracking-[0.08em] text-[#14100B] underline decoration-umber decoration-2 underline-offset-8 hover:text-umber"
        >
          matthew.parkk0@gmail.com
        </a>
        <p className="note mt-4 text-[clamp(20px,2vw,26px)]">
          (replies in 24h. faster on saturdays.)
        </p>
      </div>

      <div className="mt-20 flex flex-wrap items-center justify-between gap-3 border-t border-[#14100B]/20 pt-5 font-mono text-[10px] tracking-[0.24em] uppercase text-bark/60">
        <span>© 2026 Matthew Park</span>
        <span>The creative half</span>
        <Link to="/" data-hover className="hover:text-umber">Back to the gate ↑</Link>
      </div>
    </div>
  )
}

export default function RightPanel() {
  const root = useRef(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = gsap.context(() => {
      // staggered pop-in for everything marked .max-reveal —
      // comes up from below and BOUNCES into place (the maximal entrance)
      gsap.set('.max-reveal', { y: 72, opacity: 0 })
      ScrollTrigger.batch('.max-reveal', {
        start: 'top 88%',
        once: true,
        onEnter: (els) =>
          gsap.to(els, {
            y: 0,
            opacity: 1,
            duration: 0.85,
            ease: 'back.out(1.6)',
            stagger: 0.07,
          }),
      })

      // paper plane laps the dashed orbit; trail marches with it
      gsap.to('.plane-orbit-plane', {
        motionPath: {
          path: '#plane-orbit-path',
          align: '#plane-orbit-path',
          alignOrigin: [0.5, 0.5],
          autoRotate: true,
        },
        duration: 11,
        repeat: -1,
        ease: 'none',
      })
      gsap.to('.plane-orbit-trail', {
        strokeDashoffset: -140,
        duration: 11,
        repeat: -1,
        ease: 'none',
      })

      // parallax drift for anything with data-speed
      gsap.utils.toArray('[data-speed]').forEach((el) => {
        gsap.to(el, {
          yPercent: parseFloat(el.dataset.speed),
          ease: 'none',
          scrollTrigger: {
            trigger: el.parentElement,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.6,
          },
        })
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} className="home-right grain" aria-label="The creative half">
      <BlockLoud />
      <BlockObsessions />
      <BlockObject />
      <BlockAscii />
      <BlockNumbers />
    </section>
  )
}
