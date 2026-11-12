// How it's built: the index's last room before the way out. A list of what he makes on the left,
// a ruler beside it, and the picture field on the right (field.js). The index's scroll steps
// through the list; hovering a word previews it until the scroll moves on.
//
// Like the footer, it is driven from IndexPage's one loop through `update`, and writes to the
// DOM directly. The WebGL field is only made once the visitor is near (prepare), and only draws
// while the section is on screen.

import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import { tech } from '../content.js'
import pictures from './pictures.json'

// a word with no pictures yet stays off the list
const ITEMS = tech.items.filter((item) => pictures.some((p) => p.kind === item.kind))

const TICKS = 44
// His pick (2026-11-12, "both a and b"): both versions ship, behind premotio-style pills the visitor
// switches. A (Fields for every word, no lens) is where it starts; ?tech=b opens on B.
const START_B = new URLSearchParams(window.location.search).get('tech') === 'b'
const LAYOUTS = [['fields', 'Fields'], ['formations', 'Formations'], ['trails', 'Trails']]
const LENSES = [['off', 'Off'], ['flare', 'Flare'], ['prism', 'Prism'], ['bend', 'Bend']]
// Fields: premotio's field for every word. Formations: each word its own. Trails: the cards chase the cursor.
const formationFor = (layout, item) => (layout === 'formations' ? item.formation : layout === 'trails' ? 'trail' : 'field')
// premotio's word reveal: each letter rises into place when the room arrives
const letters = (word, row) =>
  [...word].map((ch, i) => (
    <span className="tech__ch" key={i} style={{ '--i': i, '--row': row }}>
      {ch}
    </span>
  ))

const TechSection = forwardRef(function TechSection(_props, ref) {
  const root = useRef(null)
  const canvas = useRef(null)
  const list = useRef(null)
  const ticks = useRef(null)
  const stack = useRef(null)
  const field = useRef(null)
  const state = useRef({ index: -1, scrolled: 0, hover: -1, shown: false, size: [0, 0], layout: START_B ? 'formations' : 'fields', lens: START_B ? 'bend' : 'off', amount: 0.6 })
  const pills = useRef(null)
  const amountOut = useRef(null)

  const show = (i) => {
    const s = state.current
    if (i === s.index) return
    s.index = i
    const item = ITEMS[i]
    ;[...list.current.children].forEach((li, k) => li.classList.toggle('is-on', k === i))
    stack.current.textContent = item.stack
    // the ruler's ticks lengthen toward the word that is on
    const at = ((i + 0.5) / ITEMS.length) * TICKS
    ;[...ticks.current.children].forEach((t, k) => {
      const near = Math.max(0, 1 - Math.abs(k - at) / 5)
      t.style.transform = `scaleX(${(0.35 + near * 0.65).toFixed(3)})`
      t.style.opacity = String(0.25 + near * 0.75)
    })
    field.current?.setKind(item.kind)
    field.current?.setFormation(formationFor(s.layout, item))
  }

  const fit = () => {
    const el = canvas.current
    const w = el.clientWidth
    const h = el.clientHeight
    const s = state.current
    if (!field.current || (w === s.size[0] && h === s.size[1])) return
    s.size = [w, h]
    field.current.resize(w, h)
  }

  useImperativeHandle(ref, () => ({
    /** Make the field (and start its pictures loading) once the visitor is near. */
    async prepare() {
      if (field.current || state.current.preparing) return
      state.current.preparing = true
      const { createField } = await import('./field.js')
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      field.current = createField(canvas.current, pictures, { reduced, lens: state.current.lens })
      field.current.setAmount(state.current.amount)
      state.current.size = [0, 0]
      fit()
      const i = Math.max(0, state.current.index)
      state.current.index = -1
      show(i)
      if (state.current.shown) field.current.visible(true)
    },
    pointer(nx, ny) {
      field.current?.pointer(nx, ny)
    },
    // clip: the speed-band clip-path; level: how far the bands have come; progress: 0..1 down
    // the list; covered: the footer is fully over it
    update({ clip, level, progress, covered }) {
      const el = root.current
      if (!el) return
      const shown = level > 0 && !covered
      // the letters rise once the bands have nearly finished, and drop back when the room leaves
      if (level > 0.85) el.classList.add('is-in')
      else if (level < 0.05) el.classList.remove('is-in')
      el.style.visibility = shown ? 'visible' : 'hidden'
      el.style.clipPath = clip
      const s = state.current
      if (s.shown !== shown) {
        s.shown = shown
        field.current?.visible(shown)
        if (shown) fit()
      }
      if (!shown) return
      const n = ITEMS.length
      const scrolled = Math.min(n - 1, Math.floor(progress * n))
      if (scrolled !== s.scrolled) {
        s.scrolled = scrolled
        s.hover = -1
      }
      show(s.hover >= 0 ? s.hover : scrolled)
    },
  }))

  useEffect(() => {
    show(0)
    const onResize = () => fit()
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
      field.current?.dispose()
      field.current = null
    }
    // show and fit only touch refs
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // the pills (premotio's controls): the layout, the lens and how much of it
  const choose = (what, value) => {
    const s = state.current
    s[what] = value
    pills.current?.querySelectorAll(`[data-pill="${what}"]`).forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.on === value)))
    if (what === 'lens') field.current?.setLens(value)
    else field.current?.setFormation(formationFor(value, ITEMS[Math.max(0, s.index)]))
  }
  const slide = (e) => {
    const v = Number(e.target.value) / 100
    state.current.amount = v
    e.target.style.setProperty('--fill', `${Math.round(v * 100)}%`)
    amountOut.current.textContent = `${Math.round(v * 100)}%`
    field.current?.setAmount(v)
  }

  const preview = (i) => {
    state.current.hover = i
    show(i)
  }

  return (
    <section className="tech cf-ui" ref={root} aria-label={tech.label}>
      <canvas className="tech__canvas" ref={canvas} aria-hidden="true" />
      <p className="tech__label cf-mono">// {tech.label}</p>
      <div className="tech__ticks" ref={ticks} aria-hidden="true">
        {Array.from({ length: TICKS }, (_, k) => (
          <span key={k} />
        ))}
      </div>
      <ol className="tech__list" ref={list}>
        {ITEMS.map((item, i) => (
          <li className="tech__item" key={item.kind} onPointerEnter={() => preview(i)} onFocus={() => preview(i)} tabIndex={0}>
            <span className="tech__arrow" aria-hidden="true">→</span>
            <span className="tech__name" aria-label={item.name}>{letters(item.name, i)}</span>
          </li>
        ))}
      </ol>
      <p className="tech__stack cf-mono" ref={stack} aria-live="polite" />
      <div className="tech__pills" ref={pills}>
        <div className="tech__pill" role="group" aria-label="Layout">
          {LAYOUTS.map(([value, label]) => (
            <button type="button" key={value} data-pill="layout" data-on={value} aria-pressed={state.current.layout === value} onClick={() => choose('layout', value)}>
              {label}
            </button>
          ))}
        </div>
        <div className="tech__pill" role="group" aria-label="Lens">
          {LENSES.map(([value, label]) => (
            <button type="button" key={value} data-pill="lens" data-on={value} aria-pressed={state.current.lens === value} onClick={() => choose('lens', value)}>
              {label}
            </button>
          ))}
        </div>
        <label className="tech__pill tech__amount">
          <span>Amount</span>
          <input type="range" min="0" max="100" defaultValue={60} style={{ '--fill': '60%' }} onInput={slide} aria-label="Lens amount" />
          <output ref={amountOut}>60%</output>
        </label>
      </div>
    </section>
  )
})

export default TechSection
