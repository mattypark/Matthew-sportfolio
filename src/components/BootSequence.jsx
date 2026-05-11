import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/* ────────────────────────────────────────────────────────────────────────── */
/*  Boot terminal — runs once per session before the site renders.            */
/*                                                                            */
/*  Idle:    shows a prompt + "click anywhere to boot" hint.                  */
/*  Running: types out cd / cd / npm run dev + npm output (~2.5s).            */
/*  Done:    fires onComplete — parent hard-swaps to home (no fade).          */
/* ────────────────────────────────────────────────────────────────────────── */

const STEPS = [
  { kind: 'cmd', prompt: '~ $',                      text: 'cd files',                                         charMs: 32, pause: 140 },
  { kind: 'cmd', prompt: '~/files $',                text: 'cd portfolio',                                     charMs: 32, pause: 140 },
  { kind: 'cmd', prompt: '~/files/portfolio $',      text: 'npm run dev',                                      charMs: 32, pause: 240 },
  { kind: 'out',                                     text: '> matthew_park@2026.0.1 dev',                      charMs: 6,  pause: 60  },
  { kind: 'out',                                     text: '> vite v5.2.11 dev server starting...',            charMs: 6,  pause: 90  },
  { kind: 'ok',                                      text: '  ➜  Local:   http://localhost:5174/',             charMs: 5,  pause: 60  },
  { kind: 'ok',                                      text: '  ➜  ready in 248 ms',                             charMs: 5,  pause: 380 },
]

export default function BootSequence({ onComplete }) {
  const [started, setStarted] = useState(false)
  const [stepIdx, setStepIdx] = useState(0)
  const [typed, setTyped] = useState('')
  const [done, setDone] = useState([])
  const [exiting, setExiting] = useState(false)

  /* auto-start on mount — small delay so the empty prompt is visible for a beat */
  useEffect(() => {
    const t = setTimeout(() => setStarted(true), 350)
    return () => clearTimeout(t)
  }, [])

  /* run script step-by-step */
  useEffect(() => {
    if (!started) return
    if (stepIdx >= STEPS.length) {
      // Hard swap (no fade) — small buffer then signal done
      const t = setTimeout(() => {
        setExiting(true)
        onComplete()
      }, 120)
      return () => clearTimeout(t)
    }
    const step = STEPS[stepIdx]
    let i = 0
    const id = setInterval(() => {
      i += 1
      setTyped(step.text.slice(0, i))
      if (i >= step.text.length) {
        clearInterval(id)
        const wait = setTimeout(() => {
          setDone((d) => [...d, { ...step }])
          setTyped('')
          setStepIdx((idx) => idx + 1)
        }, step.pause)
        // store cleanup
        return () => clearTimeout(wait)
      }
    }, step.charMs)
    return () => clearInterval(id)
  }, [started, stepIdx, onComplete])

  const renderLine = (step, content, showCursor = false) => {
    const cls =
      step.kind === 'ok'
        ? 'text-[color:var(--color-custom)]'
        : step.kind === 'out'
        ? 'text-foreground/55'
        : 'text-foreground/85'
    return (
      <div className="leading-[1.75] font-mono text-[12px] sm:text-[13px]">
        {step.kind === 'cmd' ? (
          <>
            <span className="text-foreground/40">{step.prompt}</span>
            <span className="text-foreground/85">&nbsp;{content}</span>
            {showCursor && <span className="terminal-cursor align-middle" />}
          </>
        ) : (
          <span className={cls}>
            {content}
            {showCursor && <span className="terminal-cursor align-middle" />}
          </span>
        )}
      </div>
    )
  }

  const currentStep = STEPS[stepIdx]

  return (
    <AnimatePresence>
      {!exiting && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 1 }}
          transition={{ duration: 0 }}
          className="fixed inset-0 z-[100]"
          style={{ cursor: 'default', backgroundColor: '#ffffff' }}
        >
          {/* boot text — top-left */}
          <div className="absolute top-12 sm:top-20 left-6 sm:left-16 right-6 max-w-[90vw]">
            {/* completed lines */}
            {done.map((step, i) => (
              <React.Fragment key={i}>{renderLine(step, step.text, false)}</React.Fragment>
            ))}

            {/* currently-typing line */}
            {started && currentStep && renderLine(currentStep, typed, true)}

            {/* idle prompt — before first click */}
            {!started && (
              <div className="leading-[1.75] font-mono text-[12px] sm:text-[13px]">
                <span className="text-foreground/40">~ $</span>
                <span className="text-foreground/85">&nbsp;</span>
                <span className="terminal-cursor align-middle" />
              </div>
            )}
          </div>

          {/* corner status — bottom right */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="absolute bottom-6 right-6 sm:bottom-8 sm:right-10 pointer-events-none"
          >
            <span className="font-mono text-[10px] tracking-widest uppercase text-foreground/30">
              booting · matthew_park
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
