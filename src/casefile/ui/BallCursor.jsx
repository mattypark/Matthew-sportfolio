// The cursor is a tennis ball. It always spins (topspin, never at rest),
// spins faster the faster it travels, and trails one light-green line along
// the path it just took, thick at the ball and thinning to nothing, like the
// streak a ball leaves in a slow-motion replay. It squashes on a click and
// swells over anything clickable. Mouse and trackpad only: on touch there is
// no pointer to follow, and the system cursor stays under reduced motion.

import { useEffect, useRef } from 'react'

const FOLLOW = 0.28 // share of the gap closed per frame
const IDLE_SPIN = 140 // degrees a second with the pointer still
const TRAVEL_SPIN = 2.2 // extra degrees per px travelled
const TRAIL_MS = 260 // how much of the path the line remembers
const TRAIL_W = 5 // px at the ball end
const TRAIL_RGB = '155, 227, 180' // light grass green
const CLICKABLE = 'a, button, [role="button"], .wcard[href], .gal__shot, [data-hot]'

export default function BallCursor() {
  const ball = useRef(null)
  const wind = useRef(null)

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!fine || reduced) return undefined

    const html = document.documentElement
    html.classList.add('has-ball')
    const el = ball.current
    const canvas = wind.current
    const ctx = canvas.getContext('2d')
    const target = { x: -100, y: -100 }
    const pos = { x: -100, y: -100 }
    const trail = [] // { x, y, t }
    let angle = 0
    let last = performance.now()
    let raf = 0

    const size = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(window.innerWidth * dpr)
      canvas.height = Math.round(window.innerHeight * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    size()

    const onMove = (e) => {
      target.x = e.clientX
      target.y = e.clientY
      el.classList.add('is-on')
      el.classList.toggle('is-over', Boolean(e.target.closest?.(CLICKABLE)))
    }
    const onDown = () => el.classList.add('is-down')
    const onUp = () => el.classList.remove('is-down')
    const onLeave = () => el.classList.remove('is-on')

    const frame = (now) => {
      raf = requestAnimationFrame(frame)
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      const dx = (target.x - pos.x) * FOLLOW
      const dy = (target.y - pos.y) * FOLLOW
      pos.x += dx
      pos.y += dy
      angle += IDLE_SPIN * dt + (dx + dy * 0.3) * TRAVEL_SPIN
      el.style.transform = `translate3d(${pos.x.toFixed(1)}px, ${pos.y.toFixed(1)}px, 0)`
      el.firstChild.style.transform = `rotate(${angle.toFixed(1)}deg)`

      trail.push({ x: pos.x, y: pos.y, t: now })
      while (trail.length && now - trail[0].t > TRAIL_MS) trail.shift()

      // one line, drawn segment by segment so it can taper and fade toward
      // its tail; when the ball rests the line drains into it
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      for (let i = 1; i < trail.length; i++) {
        const k = i / (trail.length - 1)
        ctx.strokeStyle = `rgba(${TRAIL_RGB}, ${(0.85 * k).toFixed(3)})`
        ctx.lineWidth = TRAIL_W * k
        ctx.beginPath()
        ctx.moveTo(trail[i - 1].x, trail[i - 1].y)
        ctx.lineTo(trail[i].x, trail[i].y)
        ctx.stroke()
      }
    }
    raf = requestAnimationFrame(frame)

    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerdown', onDown)
    window.addEventListener('pointerup', onUp)
    window.addEventListener('resize', size)
    document.addEventListener('pointerleave', onLeave)

    return () => {
      cancelAnimationFrame(raf)
      html.classList.remove('has-ball')
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('resize', size)
      document.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  return (
    <>
      <canvas className="cf-wind" ref={wind} aria-hidden="true" />
      <div className="cf-ball" ref={ball} aria-hidden="true">
        <svg viewBox="0 0 30 30">
          <circle cx="15" cy="15" r="13" className="cf-ball__felt" />
          <path
            className="cf-ball__seam"
            d="M4.6 8.4c5.6 2.1 8.2 7 6 16.6M25.4 21.6c-5.6-2.1-8.2-7-6-16.6"
          />
        </svg>
      </div>
    </>
  )
}
