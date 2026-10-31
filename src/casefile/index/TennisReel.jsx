// Two reels out on the lawn's flanks: white silhouettes of Matthew playing
// (cut from nyccarsoul.mov), each looping one move and wiping across to the
// next every few seconds, the right reel a move ahead of the left so the two
// never show the same thing. Frames are drawn to a canvas from preloaded
// images; nothing runs while the lawn is off screen.

import { useEffect, useRef } from 'react'

const FPS = 15
const HOLD_MS = 3600 // each move plays this long before the next wipes in
const WIPE_MS = 700

export const MOVES = [
  { id: 'bounce', label: 'Ball bounce', frames: 18, w: 897 },
  { id: 'serve', label: 'Serve', frames: 16, w: 914 },
  { id: 'follow', label: 'Follow through', frames: 14, w: 670 },
]
const FRAME_H = 480
const src = (move, i) => `/casefile/tennis/${move.id}/f${String(i + 1).padStart(2, '0')}.webp`

function loadMoves() {
  return MOVES.map((m) =>
    Array.from({ length: m.frames }, (_, i) => {
      const img = new Image()
      img.decoding = 'async'
      img.src = src(m, i)
      return img
    }),
  )
}

function Reel({ side, offset, images, isOn }) {
  const canvas = useRef(null)
  const label = useRef(null)
  const count = useRef(null)

  useEffect(() => {
    const c = canvas.current
    const ctx = c.getContext('2d')
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const t0 = performance.now()
    let shown = -1
    let raf = 0

    const draw = (moveIdx, frame, clipShare) => {
      const move = MOVES[moveIdx]
      const img = images[moveIdx][frame]
      if (!img.complete || !img.naturalWidth) return
      const w = (move.w / FRAME_H) * c.height
      const x = (c.width - w) / 2
      ctx.save()
      // the incoming move wipes in from the side nearest the edge
      const cw = c.width * clipShare
      ctx.beginPath()
      if (side === 'l') ctx.rect(0, 0, cw, c.height)
      else ctx.rect(c.width - cw, 0, cw, c.height)
      ctx.clip()
      ctx.clearRect(0, 0, c.width, c.height)
      ctx.drawImage(img, x, 0, w, c.height)
      ctx.restore()
    }

    const frame = (now) => {
      raf = requestAnimationFrame(frame)
      if (!isOn()) return
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const W = Math.round(c.clientWidth * dpr)
      const H = Math.round(c.clientHeight * dpr)
      if (c.width !== W || c.height !== H) {
        c.width = W
        c.height = H
      }
      const t = now - t0
      const slot = Math.floor(t / HOLD_MS)
      const cur = (slot + offset) % MOVES.length
      const prev = (slot + offset + MOVES.length - 1) % MOVES.length
      const into = t % HOLD_MS
      const fps = reduced ? 0 : FPS
      const fCur = Math.floor((t / 1000) * fps) % MOVES[cur].frames
      const fPrev = Math.floor((t / 1000) * fps) % MOVES[prev].frames

      if (into < WIPE_MS && slot > 0) {
        const k = into / WIPE_MS
        const e = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2
        ctx.clearRect(0, 0, c.width, c.height)
        draw(prev, fPrev, 1)
        draw(cur, fCur, e)
      } else {
        ctx.clearRect(0, 0, c.width, c.height)
        draw(cur, fCur, 1)
      }
      if (shown !== cur) {
        shown = cur
        label.current.textContent = MOVES[cur].label
        count.current.textContent = `${String(cur + 1).padStart(2, '0')} / ${String(MOVES.length).padStart(2, '0')}`
      }
    }
    raf = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(raf)
  }, [images, isOn, offset, side])

  return (
    <figure className={`reel reel--${side}`}>
      <span className="reel__c tl" />
      <span className="reel__c tr" />
      <span className="reel__c bl" />
      <span className="reel__c br" />
      <canvas ref={canvas} role="img" aria-label="Matthew playing tennis" />
      <figcaption className="reel__cap cf-ui">
        <span ref={label} />
        <span className="cf-mono" ref={count} data-fixed />
      </figcaption>
    </figure>
  )
}

export default function TennisReel({ isOn }) {
  const images = useRef(null)
  if (!images.current) images.current = loadMoves()
  return (
    <>
      <Reel side="l" offset={0} images={images.current} isOn={isOn} />
      <Reel side="r" offset={1} images={images.current} isOn={isOn} />
    </>
  )
}
