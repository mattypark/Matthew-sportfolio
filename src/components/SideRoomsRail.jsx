import React from 'react'
import { Link, useLocation } from 'react-router-dom'

/* Compact rooms navigation, fixed to the right-middle of the viewport. */

const SIDE_ROOMS = [
  { idx: '01', name: 'home',        href: '/' },
  { idx: '02', name: 'timeline',    href: '/timeline' },
  { idx: '03', name: 'about',       href: '/about' },
  { idx: '04', name: 'inspiration', href: '/inspiration' },
  { idx: '05', name: 'core values', href: '/values' },
]

const SideRoomsRail = () => {
  const location = useLocation()
  return (
    <nav
      aria-label="Rooms"
      className="hidden sm:flex fixed right-6 sm:right-10 top-1/2 -translate-y-1/2 z-40 flex-col gap-3 font-mono text-[12px] pointer-events-auto"
    >
      <p className="text-foreground/40 tracking-widest uppercase text-[10px] mb-1">
        ~/rooms
      </p>
      {SIDE_ROOMS.map((r) => {
        const isCurrent = location.pathname === r.href
        return (
          <Link
            key={r.href}
            to={r.href}
            aria-current={isCurrent ? 'page' : undefined}
            className="group flex items-baseline gap-2 transition-colors duration-200"
            style={{
              color: isCurrent ? 'var(--color-custom)' : 'rgba(26,27,36,0.55)',
            }}
          >
            <span className="text-foreground/30 tabular-nums text-[10px]">{r.idx}</span>
            <span className={`transition-colors duration-200 ${isCurrent ? '' : 'group-hover:text-[color:var(--color-custom)]'}`}>
              {r.name}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}

export default SideRoomsRail
