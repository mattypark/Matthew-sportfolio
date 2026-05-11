import React, { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

/* ────────────────────────────────────────────────────────────────────────── */
/*  Page transition — terminal-style `cd /<route>` overlay (centered).        */
/*                                                                            */
/*  - Triggered on every pathname change after first mount.                   */
/*  - Renders a white overlay with subtle grid lines + light orange tint.     */
/*  - Types `cd /<route>` char-by-char in the viewport center, large.         */
/*  - Holds for ~1.4s after typing, then grid + line fade out together.       */
/*  - Total duration ≈ 2.5–3.0s.                                              */
/* ────────────────────────────────────────────────────────────────────────── */

const ROUTE_LABEL = {
  '/': 'home',
  '/timeline': 'timeline',
  '/about': 'about',
  '/values': 'values',
  '/inspiration': 'inspiration',
  '/posts': 'posts',
  '/projects': 'projects',
}

const CHAR_MS = 80
const HOLD_MS = 1400
const FADE_MS = 600

export default function PageTransition({ children }) {
  const location = useLocation()
  const firstRender = useRef(true)
  const [overlay, setOverlay] = useState(null) // { full, typed } | null

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }

    const label = ROUTE_LABEL[location.pathname] ?? location.pathname.replace(/^\//, '')
    const full = `cd /${label}`
    let i = 0
    setOverlay({ full, typed: '' })

    const id = setInterval(() => {
      i += 1
      setOverlay({ full, typed: full.slice(0, i) })
      if (i >= full.length) {
        clearInterval(id)
        setTimeout(() => setOverlay(null), HOLD_MS)
      }
    }, CHAR_MS)

    return () => clearInterval(id)
  }, [location.pathname])

  return (
    <>
      {children}
      <AnimatePresence>
        {overlay && (
          <motion.div
            key="page-transition"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: FADE_MS / 1000, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[200] flex items-center justify-center"
            style={{
              backgroundColor: '#ffffff',
              backgroundImage:
                `linear-gradient(to right, rgba(34,34,40,0.08) 1px, transparent 1px),
                 linear-gradient(to bottom, rgba(34,34,40,0.08) 1px, transparent 1px)`,
              backgroundSize: '56px 56px',
              pointerEvents: 'none',
            }}
          >
            {/* Soft orange wash so the transition picks up the site theme */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  'radial-gradient(ellipse at center, color-mix(in oklch, var(--color-custom) 12%, transparent) 0%, transparent 60%)',
              }}
            />

            {/* Centered typing line */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-10 font-mono text-[28px] sm:text-[44px] leading-none tracking-tight"
            >
              <span className="text-foreground/40">~ $</span>
              <span className="text-foreground">&nbsp;{overlay.typed}</span>
              <span
                className="inline-block align-middle ml-2"
                style={{
                  width: '0.55ch',
                  height: '0.9em',
                  background: 'var(--color-custom)',
                  animation: 'terminal-blink 1.05s step-end infinite',
                }}
              />
            </motion.div>

            {/* Corner status — stays visible during the whole transition */}
            <div className="absolute bottom-6 right-6 sm:bottom-8 sm:right-10 pointer-events-none">
              <span className="font-mono text-[10px] tracking-widest uppercase text-foreground/30">
                routing · matthew_park
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
