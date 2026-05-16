import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const projects = [
  { idx: '01', title: 'AXIOM',                meta: ['NONPROFIT', '17 LIVE'],     fill: 'paper' },
  { idx: '02', title: 'WEB DESIGN AGENCY',    meta: ['AGENCY', 'ACTIVE'],         fill: 'red' },
  { idx: '03', title: 'SOCIAL MEDIA',         meta: ['CONTENT', '30M+ VIEWS'],    fill: 'paper' },
  { idx: '04', title: 'SOFTWARE ENGINEERING', meta: ['BUILD', 'ONGOING'],         fill: 'paper' },
]

function fillToStyle(fill) {
  switch (fill) {
    case 'red':    return { background: 'var(--primary)', color: 'var(--paper)', borderColor: 'var(--primary)' }
    case 'blue':   return { background: 'var(--accent)',  color: 'var(--paper)', borderColor: 'var(--accent)' }
    case 'signal': return { background: 'var(--signal)',  color: 'var(--ink)',   borderColor: 'var(--signal)' }
    default:       return {}
  }
}

export default function Works() {
  const root = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.tile', {
        y: 60,
        opacity: 0,
        duration: 0.9,
        ease: 'expo.out',
        stagger: { each: 0.06, grid: 'auto', from: 'start' },
        scrollTrigger: { trigger: root.current, start: 'top 70%' },
      })
      gsap.from('.works-head > *', {
        y: 20,
        opacity: 0,
        duration: 0.7,
        stagger: 0.05,
        scrollTrigger: { trigger: root.current, start: 'top 80%' },
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section id="work" ref={root} className="relative gutter py-[14vh]">
      <div className="works-head flex flex-wrap items-end justify-between gap-6 mb-12">
        <div className="section-label">
          <span className="mono-dot" />SELECTED · 2022 — 2026
        </div>
        <div className="section-label">
          <span>04 SHIPPED</span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-paper/10">
        {projects.map((p) =>
          p.empty ? (
            <div
              key={p.idx}
              className="tile pointer-events-none"
              aria-hidden="true"
              style={{ opacity: 0.35 }}
            />
          ) : (
            <a
              key={p.idx}
              href="#"
              data-hover
              className="tile"
              style={fillToStyle(p.fill)}
            >
              <span className="tile-idx">{p.idx}</span>
              <span className="tile-title">{p.title}</span>
              <span className="tile-meta">
                <span>{p.meta[0]}</span>
                <span>{p.meta[1]}</span>
              </span>
            </a>
          )
        )}
      </div>

      <div className="mt-10 flex flex-wrap items-center justify-between gap-4 font-mono text-[11px] tracking-[0.22em] uppercase text-paper/60">
        <span>// still in highschool, learning is just as important as shipping.</span>
      </div>
    </section>
  )
}
