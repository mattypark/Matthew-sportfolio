// Work: an endless field of cards you drag through.
//
// Infinity is a modulo: a pool of DOM cells just big enough to cover the
// screen plus one ring, and each frame every slot takes the lattice cell it
// now sits over. A card leaving one edge is the card arriving at the other.
//
// The feel is the reference's numbers: wheel x3, drag x1.35, lerp 0.2, a
// tenth of horizontal motion bleeding into vertical. Under speed the cards
// shrink a little, and settle back when the field stops.

import { useEffect, useRef } from 'react'
import { work } from '../content.js'
import { PlusMark } from '../ui/Bar.jsx'

const PITCH_X = 488
const PITCH_Y = 344
const CARD_W = 308
const CARD_H = 192
const WHEEL = 3
const DRAG = 1.35
const LERP = 0.2
const X_TO_Y = 0.1
const MAX_DELTA = 80
const CLICK_SLOP = 5

const mod = (a, n) => ((a % n) + n) % n
// a cell's project: a stride that keeps neighbours different
const projectAt = (c, r) => work[mod(c * 3 + r * 5, work.length)]

export default function WorkPage() {
  const root = useRef(null)
  const world = useRef(null)
  const cursor = useRef(null)

  useEffect(() => {
    const el = root.current
    const field = world.current
    let vw = window.innerWidth
    let vh = window.innerHeight
    const pos = { x: 0, y: 0 }
    const target = { x: 0, y: 0 }
    let pool = []
    let drag = null
    let moved = 0

    const build = () => {
      vw = window.innerWidth
      vh = window.innerHeight
      const cols = Math.ceil(vw / PITCH_X) + 2
      const rows = Math.ceil(vh / PITCH_Y) + 2
      field.replaceChildren()
      pool = []
      for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
          const cell = document.createElement('div')
          cell.className = 'wcell'
          cell.innerHTML = `
            <span class="wcell__tick tl"></span><span class="wcell__tick tr"></span>
            <span class="wcell__tick bl"></span><span class="wcell__tick br"></span>
            <p class="wcell__idx cf-ui cf-mono"></p>
            <a class="wcard" target="_blank" rel="noreferrer">
              <span class="wcard__scan"></span>
              <span class="wcard__kind cf-ui"></span>
              <span class="wcard__name"></span>
              <span class="wcard__year cf-ui cf-mono"></span>
            </a>`
          field.appendChild(cell)
          pool.push({ el: cell, i, j, key: '' })
        }
      }
    }

    const paint = (speed) => {
      const c0 = Math.floor(-pos.x / PITCH_X) - 1
      const r0 = Math.floor(-pos.y / PITCH_Y) - 1
      const scale = 1 - Math.min(0.1, speed * 0.004)
      for (const slot of pool) {
        const c = c0 + slot.i
        const r = r0 + slot.j
        const x = c * PITCH_X + pos.x
        const y = r * PITCH_Y + pos.y
        slot.el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`
        slot.el.style.setProperty('--s', scale.toFixed(4))
        const key = `${c},${r}`
        if (slot.key === key) continue
        slot.key = key
        const p = projectAt(c, r)
        const card = slot.el.querySelector('.wcard')
        card.querySelector('.wcard__name').textContent = p.name
        card.querySelector('.wcard__kind').textContent = p.kind
        card.querySelector('.wcard__year').textContent = p.year
        card.dataset.id = p.id
        if (p.href) card.href = p.href
        else card.removeAttribute('href')
        slot.el.querySelector('.wcell__idx').textContent =
          `${String(mod(c, 100)).padStart(3, '0')}.${String(mod(r, 100)).padStart(3, '0')}`
      }
    }

    const onWheel = (e) => {
      e.preventDefault()
      const clampD = (d) => Math.max(-MAX_DELTA, Math.min(MAX_DELTA, d))
      target.x -= clampD(e.deltaX) * WHEEL
      target.y -= clampD(e.deltaY) * WHEEL + clampD(e.deltaX) * WHEEL * X_TO_Y
    }
    const onDown = (e) => {
      drag = { x: e.clientX, y: e.clientY }
      moved = 0
      el.classList.add('is-dragging')
    }
    const onMove = (e) => {
      cursor.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`
      const overCard = e.target.closest?.('.wcard[href]')
      cursor.current.classList.toggle('is-on', Boolean(overCard) && !drag)
      if (!drag) return
      const dx = e.clientX - drag.x
      const dy = e.clientY - drag.y
      moved += Math.abs(dx) + Math.abs(dy)
      target.x += dx * DRAG
      target.y += dy * DRAG + dx * DRAG * X_TO_Y
      drag = { x: e.clientX, y: e.clientY }
    }
    const onUp = () => {
      drag = null
      el.classList.remove('is-dragging')
    }
    // a drag that ends on a card is not a click on it
    const onClick = (e) => {
      if (moved > CLICK_SLOP) e.preventDefault()
    }
    const onKey = (e) => {
      const step = { ArrowLeft: [PITCH_X, 0], ArrowRight: [-PITCH_X, 0], ArrowUp: [0, PITCH_Y], ArrowDown: [0, -PITCH_Y] }[e.key]
      if (!step) return
      e.preventDefault()
      target.x += step[0]
      target.y += step[1]
    }

    build()
    // start with a card in the middle of the screen
    target.x = pos.x = vw / 2 - PITCH_X / 2
    target.y = pos.y = vh / 2 - PITCH_Y / 2

    el.addEventListener('wheel', onWheel, { passive: false })
    el.addEventListener('pointerdown', onDown)
    el.addEventListener('click', onClick, true)
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    window.addEventListener('keydown', onKey)
    window.addEventListener('resize', build)

    let raf = 0
    const frame = () => {
      raf = requestAnimationFrame(frame)
      const px = pos.x
      const py = pos.y
      pos.x += (target.x - pos.x) * LERP
      pos.y += (target.y - pos.y) * LERP
      const speed = Math.hypot(pos.x - px, pos.y - py)
      paint(speed)
    }
    raf = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(raf)
      el.removeEventListener('wheel', onWheel)
      el.removeEventListener('pointerdown', onDown)
      el.removeEventListener('click', onClick, true)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('resize', build)
    }
  }, [])

  return (
    <main className="wgrid" ref={root} aria-label="Work">
      <h1 className="sr-only">Work</h1>
      <ul className="sr-only">
        {work.map((p) => (
          <li key={p.id}>
            {p.href ? <a href={p.href}>{p.name}</a> : p.name}, {p.kind}, {p.year}
          </li>
        ))}
      </ul>
      <div className="wgrid__world" ref={world} aria-hidden="true" style={{ '--cw': `${CARD_W}px`, '--ch': `${CARD_H}px`, '--px': `${PITCH_X}px`, '--py': `${PITCH_Y}px` }} />
      <div className="wgrid__cursor cf-ui" ref={cursor} aria-hidden="true">
        Open
        <PlusMark />
      </div>
      <p className="wgrid__hint cf-ui">Drag, scroll, or use the arrows</p>
    </main>
  )
}
