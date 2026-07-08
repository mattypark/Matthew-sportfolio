import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import './loud-pages.css'

// Fixed top-right menu. Never moves, never scrolls away.
// Opens a numbered map — the loud wings are tiers of one long page,
// so 03–05 jump down the scroll instead of leaving it.

const PAGES = [
  { n: '00', to: '/', name: 'The Gate', desc: 'choose a side again' },
  { n: '01', to: '/work', name: 'Work Area', desc: 'the quiet ledger' },
  { n: '02', to: '/loud', name: 'Creative Home', desc: 'who i am, unfiltered' },
  { n: '03', to: '/loud#labels', name: 'Labels™', desc: 'y2k · manufactured goods' },
  { n: '04', to: '/loud#life', name: 'The Life', desc: 'fits · tennis · travel' },
]

export default function Menu({ dark = false }) {
  const [open, setOpen] = useState(false)
  const { pathname, hash } = useLocation()

  return (
    <div className={`site-menu ${dark ? 'site-menu-dark' : ''}`}>
      <button
        type="button"
        data-hover
        className="site-menu-btn"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <span className="site-menu-dot" />
        {open ? 'CLOSE' : 'MENU'}
      </button>

      <AnimatePresence>
        {open && (
          <motion.nav
            key="panel"
            className="site-menu-panel"
            aria-label="Site pages"
            initial={{ opacity: 0, y: -12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.97 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            {PAGES.map((p, i) => {
              const active = pathname + hash === p.to
              return (
                <motion.div
                  key={p.to}
                  initial={{ opacity: 0, x: 14 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + i * 0.05, duration: 0.3, ease: 'easeOut' }}
                >
                  <Link
                    to={p.to}
                    data-hover
                    className={`site-menu-item ${active ? 'is-active' : ''}`}
                    onClick={() => setOpen(false)}
                  >
                    <span className="site-menu-num">{p.n}</span>
                    <span className="site-menu-name">{p.name}</span>
                    <span className="site-menu-desc">{p.desc}</span>
                  </Link>
                </motion.div>
              )
            })}
          </motion.nav>
        )}
      </AnimatePresence>
    </div>
  )
}
