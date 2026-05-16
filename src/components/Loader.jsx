import { useEffect, useState } from 'react'

export default function Loader({ onDone }) {
  const [pct, setPct] = useState(0)
  const [kb, setKb] = useState(0)
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    let frame
    const start = performance.now()
    const total = 2600
    const totalKb = 412
    const tick = (t) => {
      const elapsed = t - start
      const p = Math.min(1, elapsed / total)
      const eased = 1 - Math.pow(1 - p, 3)
      setPct(Math.round(eased * 100))
      setKb(Math.round(eased * totalKb))
      if (p < 1) {
        frame = requestAnimationFrame(tick)
      } else {
        setTimeout(() => {
          setHidden(true)
          onDone?.()
        }, 260)
      }
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [onDone])

  if (hidden) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-ink transition-opacity duration-500"
      style={{ opacity: pct >= 100 ? 0 : 1 }}
    >
      <div className="font-display text-[18vw] leading-none text-paper select-none">
        {String(pct).padStart(3, '0')}
      </div>
      <div className="mt-6 flex items-center gap-4 font-mono text-[11px] tracking-[0.22em] uppercase text-paper/60">
        <span>MP &middot; 2026</span>
        <span className="block w-[180px] h-px bg-paper/20 overflow-hidden relative">
          <span
            className="absolute inset-y-0 left-0 bg-paper origin-left"
            style={{ width: `${pct}%` }}
          />
        </span>
        <span>{kb} KB</span>
      </div>
      <div className="mt-3 font-mono text-[10px] tracking-[0.22em] uppercase text-paper/40">
        LEARNING &middot; SHIPPING &middot; CREATING
      </div>
    </div>
  )
}
