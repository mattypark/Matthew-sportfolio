import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Crosshair, useClock } from './WorkSite'
import BackButton from './BackButton'
import './home.css'

// PROJECTS — the visual index.
// Rhythm per project: title + one-line description → a half-screen hero
// frame → a row of square detail shots. Categories break the page with
// oversized type. Every frame is a placeholder until real screenshots land.

const SECTIONS = [
  {
    title: 'Software',
    items: [
      { name: 'SlapShift', desc: 'a macOS app that keeps your day on rails', squares: 3 },
      { name: 'Creator Dashboard', desc: 'single-user content OS — write, schedule, post', squares: 3 },
      { name: 'Bery', desc: 'personal CRM — describe a person, get a profile', squares: 3 },
      { name: 'Baseline', desc: 'tennis-first AI workout coach', squares: 3 },
      { name: 'Fits', desc: 'AI stylist with a paper-and-ink wardrobe', squares: 3 },
      { name: 'BayouGuard', desc: 'flood risk, mapped for Houston', squares: 3 },
    ],
  },
  {
    title: 'Hardware & Interaction',
    items: [
      { name: 'Hand Vocoder', desc: 'hand gestures become harmonized sound', squares: 3 },
      { name: 'Smash Arena', desc: 'a browser fighter with real multiplayer', squares: 3 },
      { name: 'TYPE Mode', desc: 'typing without a keyboard — pose-driven input', squares: 3 },
    ],
  },
  {
    title: 'Agents & Second Brain',
    items: [
      { name: 'Second Brain', desc: 'knowledge-graph agents over everything I read', squares: 3 },
      { name: 'Intake Agent', desc: 'describe someone once, the profile writes itself', squares: 3 },
      { name: 'Dram', desc: 'an agent that finds your next cologne', squares: 3 },
    ],
  },
  {
    title: 'Content & Community',
    items: [
      { name: 'Social', desc: '30M+ views, shot on a phone', squares: 3 },
      { name: 'Axiom Pathways', desc: 'a nonprofit teaching 500+ interns to build', squares: 3 },
      { name: 'Media Kit', desc: 'the creator one-pager, done properly', squares: 3 },
    ],
  },
]

const slug = (s) => s.toLowerCase().replace(/\s+/g, '_')

function Project({ name, desc, squares }) {
  return (
    <article className="pj-project">
      <h3 className="pj-tile pj-title">
        {name}
        <span className="pj-title-desc">: {desc}</span>
      </h3>

      {/* the half-screen hero */}
      <div className="pj-tile pj-hero" data-hover>
        <span className="pj-ph">
          {slug(name)}_hero.png
          <br />
          drop the big one here
        </span>
      </div>

      {/* square detail shots */}
      <div className="pj-squares">
        {Array.from({ length: squares }, (_, i) => (
          <div key={i} className="pj-tile pj-square" data-hover>
            <span className="pj-ph">
              {slug(name)}_{String(i + 1).padStart(2, '0')}.png
            </span>
          </div>
        ))}
      </div>
    </article>
  )
}

export default function ProjectsPage() {
  const root = useRef(null)
  const local = useClock('America/New_York')
  const away = useClock('Asia/Seoul')

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.pj-head',
        { y: 22, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.05, ease: 'power3.out', stagger: 0.12, delay: 0.15 },
      )
      gsap.set('.pj-tile', { y: 34, opacity: 0 })
      ScrollTrigger.batch('.pj-tile', {
        start: 'top 92%',
        once: true,
        onEnter: (els) =>
          gsap.to(els, { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out', stagger: 0.07 }),
      })
      // the big category words drift in from the side
      gsap.utils.toArray('.pj-cat').forEach((el) => {
        gsap.fromTo(
          el,
          { x: 40, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 1.1,
            ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 88%', once: true },
          },
        )
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={root} className="home-left relative min-h-[100svh] px-6 pb-24 md:px-[5vw]">
      <BackButton />

      <header className="pt-[16vh] pb-[4vh]">
        <h1 className="pj-head font-serif font-black text-[clamp(38px,6vw,96px)] leading-[0.95] tracking-[-0.01em]">
          Projects
        </h1>
        <p className="pj-head mt-5 max-w-[52ch] font-mono text-[13px] leading-[1.85] text-slate">
          Everything shipped so far — hardware, software, agents, content.
          Screenshots landing soon; the frames are already waiting.
        </p>
      </header>

      {SECTIONS.map((s) => (
        <section key={s.title} className="pj-section">
          <h2 className="pj-cat">{s.title}</h2>
          {s.items.map((p) => (
            <Project key={p.name} {...p} />
          ))}
        </section>
      ))}

      <span className="ok-clock ok-clock-left tabular-nums">Louisville {local}</span>
      <span className="ok-clock ok-clock-right tabular-nums">Seoul {away}</span>

      <Crosshair />
    </div>
  )
}
