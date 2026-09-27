import { useEffect, useRef } from 'react'
import { prefersReducedMotion } from '../hooks/motion'

const POINTS = 22
const WIDTH = 5

// Whiteboard marker: the cursor leaves a short stroke that fades from the
// tip back, in whatever color `colorRef.current` holds (the hovered box).
export default function MarkerTrail({ colorRef, active }) {
  const canvas = useRef(null)

  useEffect(() => {
    const c = canvas.current
    if (!c || prefersReducedMotion() || window.matchMedia('(pointer: coarse)').matches) return undefined
    const ctx = c.getContext('2d')
    const pts = []
    let raf

    const size = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      c.width = window.innerWidth * dpr
      c.height = window.innerHeight * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    size()

    const onMove = (e) => {
      pts.push({ x: e.clientX, y: e.clientY })
      if (pts.length > POINTS) pts.shift()
    }

    const frame = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
      // the tail catches up to the tip when the pointer rests
      if (pts.length > 1) pts.shift()
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.strokeStyle = colorRef.current
      for (let i = 1; i < pts.length; i += 1) {
        const t = i / pts.length
        ctx.globalAlpha = t * 0.85
        ctx.lineWidth = WIDTH * (0.35 + t * 0.65)
        ctx.beginPath()
        ctx.moveTo(pts[i - 1].x, pts[i - 1].y)
        ctx.lineTo(pts[i].x, pts[i].y)
        ctx.stroke()
      }
      raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('resize', size)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('resize', size)
    }
  }, [colorRef])

  return <canvas ref={canvas} className="marker-trail" style={{ opacity: active ? 1 : 0 }} aria-hidden />
}
