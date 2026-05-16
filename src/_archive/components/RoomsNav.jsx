import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'

/* Shared rooms navigation — rendered at the bottom of every page. */

const ROOMS = [
  { idx: '01', name: 'Home',        href: '/',            note: 'back to the start' },
  { idx: '02', name: 'Timeline',    href: '/timeline',    note: 'every step, in order' },
  { idx: '03', name: 'About',       href: '/about',       note: 'who i am, in long form' },
  { idx: '04', name: 'Inspiration', href: '/inspiration', note: 'the people i study' },
  { idx: '05', name: 'Core Values', href: '/values',      note: '14 things i live by' },
]

const ease = [0.22, 1, 0.36, 1]

const RoomsNav = () => {
  const location = useLocation()

  return (
    <section className="mx-auto w-full max-w-[920px] px-6 sm:px-10 pt-2 pb-12">
      <p className="font-mono text-[11px] sm:text-[12px] text-foreground/45 tracking-widest uppercase mb-6">
        ~/rooms
      </p>

      <ul className="divide-y divide-border/70 border-y border-border/70">
        {ROOMS.map((r, i) => {
          const isCurrent = location.pathname === r.href
          return (
            <motion.li
              key={r.href}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: i * 0.05, ease }}
            >
              <Link
                to={r.href}
                aria-current={isCurrent ? 'page' : undefined}
                className={`group grid grid-cols-[44px_1fr_auto] items-center gap-4 sm:gap-6 py-5 sm:py-6 font-mono text-[13px] sm:text-[14px] transition-colors duration-300 -mx-2 sm:-mx-4 px-2 sm:px-4 rounded-[6px] ${
                  isCurrent
                    ? 'bg-[color:color-mix(in_oklch,var(--color-custom)_10%,transparent)]'
                    : 'hover:bg-[color:color-mix(in_oklch,var(--color-custom)_6%,transparent)]'
                }`}
              >
                <span className="text-foreground/35 tabular-nums">{r.idx}</span>
                <span className="flex items-baseline gap-3 sm:gap-4 min-w-0">
                  <span
                    className={`font-mono text-[14px] sm:text-[15px] leading-[1] transition-colors duration-300 ${
                      isCurrent
                        ? 'text-[color:var(--color-custom)]'
                        : 'text-foreground group-hover:text-[color:var(--color-custom)]'
                    }`}
                  >
                    {r.name.toLowerCase()}
                  </span>
                  <span className="hidden sm:inline truncate text-foreground/45">
                    &mdash; {r.note}
                  </span>
                </span>
                <span
                  className={`font-mono transition-colors duration-300 ${
                    isCurrent
                      ? 'text-[color:var(--color-custom)]'
                      : 'text-foreground/35 group-hover:text-[color:var(--color-custom)]'
                  }`}
                >
                  {r.href} &nbsp;{isCurrent ? '•' : '→'}
                </span>
              </Link>
            </motion.li>
          )
        })}
      </ul>
    </section>
  )
}

export default RoomsNav
