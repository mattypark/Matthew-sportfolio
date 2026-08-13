import { useEffect, useRef, useState } from 'react'
import HeartMeter from './HeartMeter'

// SITE CHROME — the parts that survive every redesign.
//
// The crosshair and the dual clocks are lifted unchanged from the old
// WorkSite. Matthew asked for the cursor specifically; the coordinate
// readout is the tell that a developer built this page, so it stays
// byte-for-byte as it was.

// crosshair that trails the pointer and prints X/Y — the otherkind tell.
// updates the DOM node directly so we never re-render on mousemove.
export function Crosshair() {
  const wrap = useRef(null)
  const readout = useRef(null)

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!fine || reduce) return

    const el = wrap.current
    const label = readout.current
    if (!el || !label) return

    const onMove = (e) => {
      el.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`
      el.style.opacity = '1'
      label.textContent = `X:${String(Math.round(e.clientX)).padStart(4, '0')}  Y:${String(
        Math.round(e.clientY),
      ).padStart(4, '0')}`
    }
    const onLeave = () => {
      if (el) el.style.opacity = '0'
    }

    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerleave', onLeave)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  return (
    <div ref={wrap} className="mx-crosshair" aria-hidden="true">
      <span className="mx-crosshair-mark" />
      <span ref={readout} className="mx-crosshair-readout">
        X:0000  Y:0000
      </span>
    </div>
  )
}

export function useClock(timeZone) {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 15000)
    return () => clearInterval(id)
  }, [])
  return new Intl.DateTimeFormat('en-US', {
    timeZone,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(now)
}

// The two cities, bottom corners, on every page — plus the health bar.
export function Clocks({ hearts = true }) {
  const local = useClock('America/New_York')
  const away = useClock('Asia/Seoul')

  return (
    <>
      <span className="mx-clock mx-clock-left tabular-nums">
        Louisville {local}
        {hearts ? <HeartMeter /> : null}
      </span>
      <span className="mx-clock mx-clock-right tabular-nums">Seoul {away}</span>
    </>
  )
}
