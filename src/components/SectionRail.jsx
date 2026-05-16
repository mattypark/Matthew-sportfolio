import { useEffect, useState } from 'react'

const sections = [
  { id: 'top',           label: 'home' },
  { id: 'about',         label: 'why' },
  { id: 'work',          label: 'work' },
  { id: 'masterpiece',   label: 'timeline' },
  { id: 'counterweight', label: 'counterweight' },
  { id: 'contact',       label: 'contact' },
]

export default function SectionRail() {
  const [activeId, setActiveId] = useState('top')

  useEffect(() => {
    const els = sections
      .map((s) => document.getElementById(s.id))
      .filter(Boolean)

    if (!els.length) return

    const io = new IntersectionObserver(
      (entries) => {
        // Pick the entry whose center is closest to viewport center.
        const visible = entries.filter((e) => e.isIntersecting)
        if (!visible.length) return
        visible.sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        setActiveId(visible[0].target.id)
      },
      {
        rootMargin: '-40% 0px -40% 0px',
        threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
      }
    )

    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  const handleClick = (e, id) => {
    e.preventDefault()
    const el = document.getElementById(id)
    if (!el) return
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <aside
      aria-label="Section navigator"
      className="hidden lg:flex fixed top-5 right-7 z-50 items-center gap-5 font-mono text-[11px] tracking-[0.12em] uppercase select-none mix-blend-difference"
      style={{ color: '#E2D0A8' }}
    >
      <span className="opacity-60">~/SECTIONS</span>
      <ul className="flex items-center gap-5">
        {sections.map((s, i) => {
          const isActive = activeId === s.id
          return (
            <li key={s.id} className="flex items-center gap-1.5">
              <span className="opacity-40 tabular-nums">
                {String(i + 1).padStart(2, '0')}
              </span>
              <a
                href={`#${s.id}`}
                onClick={(e) => handleClick(e, s.id)}
                data-hover
                className="transition-colors duration-200"
                style={{
                  color: isActive ? '#E63E21' : 'inherit',
                  opacity: isActive ? 1 : 0.65,
                }}
              >
                {s.label}
              </a>
            </li>
          )
        })}
      </ul>
    </aside>
  )
}
