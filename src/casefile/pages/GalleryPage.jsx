// Gallery: photographs strung along a winding path across a green field.
//
// Every picture is multiplied into the green (grayscale first, so it reads
// as a duotone, the reference's tint in the site's colour). Hover lifts one
// out of the tint; click opens it. Drag or scroll to travel, or step with
// Back / Next, which glide the camera to the neighbouring picture.

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { gallery } from '../content.js'
import { BallMark } from '../ui/Loader.jsx'

const WORLD_W = 3400
const WORLD_H = 2200
const LERP = 0.12
const WHEEL = 1.2
const REPEAT = 2 // the set is walked twice along the path
const CLICK_SLOP = 5

// The path: a long meander, sampled densely, then walked by arc length.
function buildPath() {
  const pts = []
  const n = 400
  for (let i = 0; i <= n; i++) {
    const t = i / n
    const x = 260 + t * (WORLD_W - 520)
    const y = WORLD_H / 2 + Math.sin(t * Math.PI * 3.2) * 620 + Math.sin(t * Math.PI * 9.1 + 1) * 140
    pts.push([x, y])
  }
  const lens = [0]
  for (let i = 1; i < pts.length; i++) {
    lens.push(lens[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]))
  }
  const at = (d) => {
    let i = lens.findIndex((l) => l >= d)
    if (i <= 0) i = 1
    const k = (d - lens[i - 1]) / (lens[i] - lens[i - 1] || 1)
    return [pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * k, pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * k]
  }
  return { pts, total: lens[lens.length - 1], at }
}

export default function GalleryPage() {
  const root = useRef(null)
  const world = useRef(null)
  const cam = useRef({ x: 0, y: 0, tx: 0, ty: 0 })
  const [active, setActive] = useState(0)
  const [open, setOpen] = useState(null)

  const { d, shots } = useMemo(() => {
    const path = buildPath()
    const count = gallery.length * REPEAT
    const list = []
    for (let i = 0; i < count; i++) {
      const photo = gallery[i % gallery.length]
      const [x, y] = path.at(((i + 0.5) / count) * path.total)
      // sizes vary on a fixed rhythm so the field is the same on every visit
      const size = 110 + ((i * 47) % 90)
      const w = photo.w >= photo.h ? size * 1.3 : size
      const h = (w * photo.h) / photo.w
      const jitter = ((i * 73) % 120) - 60
      list.push({ ...photo, i, x: x - w / 2, y: y - h / 2 + jitter, w, h })
    }
    const dStr = path.pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join('')
    return { d: dStr, shots: list }
  }, [])

  const centerOn = useCallback(
    (i) => {
      const s = shots[(i + shots.length) % shots.length]
      cam.current.tx = window.innerWidth / 2 - (s.x + s.w / 2)
      cam.current.ty = window.innerHeight / 2 - (s.y + s.h / 2)
    },
    [shots],
  )

  useEffect(() => {
    const el = root.current
    let drag = null
    let moved = 0
    centerOn(0)
    cam.current.x = cam.current.tx
    cam.current.y = cam.current.ty

    const clampCam = () => {
      const c = cam.current
      c.tx = Math.min(200, Math.max(window.innerWidth - WORLD_W - 200, c.tx))
      c.ty = Math.min(200, Math.max(window.innerHeight - WORLD_H - 200, c.ty))
    }
    const onWheel = (e) => {
      e.preventDefault()
      cam.current.tx -= (e.deltaX + e.deltaY) * WHEEL
      cam.current.ty -= e.deltaY * WHEEL * 0.35
      clampCam()
    }
    const onDown = (e) => {
      drag = { x: e.clientX, y: e.clientY }
      moved = 0
    }
    const onMove = (e) => {
      if (!drag) return
      const dx = e.clientX - drag.x
      const dy = e.clientY - drag.y
      moved += Math.abs(dx) + Math.abs(dy)
      cam.current.tx += dx
      cam.current.ty += dy
      clampCam()
      drag = { x: e.clientX, y: e.clientY }
    }
    const onUp = () => {
      drag = null
    }
    const onClick = (e) => {
      if (moved > CLICK_SLOP) {
        e.preventDefault()
        e.stopPropagation()
      }
    }

    el.addEventListener('wheel', onWheel, { passive: false })
    el.addEventListener('pointerdown', onDown)
    el.addEventListener('click', onClick, true)
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)

    let raf = 0
    let lastActive = -1
    const frame = () => {
      raf = requestAnimationFrame(frame)
      const c = cam.current
      c.x += (c.tx - c.x) * LERP
      c.y += (c.ty - c.y) * LERP
      world.current.style.transform = `translate3d(${c.x.toFixed(1)}px, ${c.y.toFixed(1)}px, 0)`
      // the picture nearest the middle of the screen is the one listed
      const mx = window.innerWidth / 2 - c.x
      const my = window.innerHeight / 2 - c.y
      let best = 0
      let bestD = Infinity
      shots.forEach((s, i) => {
        const dd = Math.hypot(s.x + s.w / 2 - mx, s.y + s.h / 2 - my)
        if (dd < bestD) {
          bestD = dd
          best = i
        }
      })
      if (best !== lastActive) {
        lastActive = best
        setActive(best)
      }
    }
    raf = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(raf)
      el.removeEventListener('wheel', onWheel)
      el.removeEventListener('pointerdown', onDown)
      el.removeEventListener('click', onClick, true)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
    }
  }, [centerOn, shots])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(null)
      if (open !== null) return
      if (e.key === 'ArrowRight') centerOn(active + 1)
      if (e.key === 'ArrowLeft') centerOn(active - 1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [active, centerOn, open])

  const current = shots[active]

  return (
    <main className="gal" ref={root} aria-label="Gallery">
      <h1 className="sr-only">Gallery</h1>
      <div className="gal__world" ref={world} style={{ width: WORLD_W, height: WORLD_H }}>
        <svg className="gal__path" width={WORLD_W} height={WORLD_H} aria-hidden="true">
          <path d={d} />
        </svg>
        {shots.map((s) => (
          <button
            type="button"
            key={s.i}
            className={`gal__shot${s.i === active ? ' is-active' : ''}`}
            style={{ left: s.x, top: s.y, width: s.w, height: s.h }}
            onClick={() => setOpen(s.i)}
            aria-label={`Open ${s.title}`}
          >
            <img src={s.src} alt="" width={Math.round(s.w)} height={Math.round(s.h)} loading="lazy" draggable="false" />
          </button>
        ))}
      </div>

      <aside className="gal__panel cf-ui">
        <BallMark className="gal__logo" />
        <ol className="gal__list">
          {gallery.map((g, i) => (
            <li key={g.src} className={current && current.src === g.src ? 'is-on' : ''}>
              <span className="cf-mono">{String(i + 1).padStart(2, '0')}</span> {g.title}
            </li>
          ))}
        </ol>
        <div className="gal__nav">
          <button type="button" onClick={() => centerOn(active - 1)}>
            Back
          </button>
          <button type="button" onClick={() => centerOn(active + 1)}>
            Next
          </button>
        </div>
        {current && (
          <div className="gal__meta">
            <p>{current.title}</p>
            <p>{current.where}</p>
            <p className="cf-mono">
              {String(active + 1).padStart(3, '0')} / {String(shots.length).padStart(3, '0')}
            </p>
          </div>
        )}
      </aside>

      {open !== null && (
        <div className="gal__box" role="dialog" aria-modal="true" aria-label={shots[open].title} onClick={() => setOpen(null)}>
          <img src={shots[open].src} alt={`${shots[open].title}, ${shots[open].where}`} />
          <p className="cf-ui">
            {shots[open].title} // {shots[open].where} // click or esc to close
          </p>
        </div>
      )}
    </main>
  )
}
