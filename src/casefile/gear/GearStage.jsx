// The gear: the last screen of the index, after the footer. One courtside
// bench with what he carries on it (tennis, iPhone, FX30, journal, MacBook,
// lightstick) under a tree whose leaves follow the season; every object
// opens its story.
//
// The arrival: the footer fades away to paper, then the scene slides down
// from the top while the camera zooms in (phase.js has the beats).
//
// Light on purpose: three.js, the model and the story panel all load in their
// own chunks, the first time the footer is most of the way in. Until the
// scene is ready, and whenever WebGL is missing or lost, the still rendered
// from the same camera stands in, and the legend still opens every story, so
// nothing here needs WebGL to be read.
//
// Written to from IndexPage's frame loop through the ref, like the footer.

import { Suspense, forwardRef, lazy, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'
import { gear, gearScene } from '../content.js'
import { arrival } from './phase.js'

const Story = lazy(() => import('./Story.jsx'))

const pad = (n) => String(n + 1).padStart(2, '0')

const GearStage = forwardRef(function GearStage({ onStory, onPinch }, ref) {
  const reduced = useMemo(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches, [])
  const veil = useRef(null)
  const root = useRef(null)
  const canvas = useRef(null)
  const engine = useRef(null)
  const started = useRef(false)
  const visible = useRef(false)
  const failedRef = useRef(false)
  const [ready, setReady] = useState(false)
  const [failed, setFailed] = useState(false)
  const [hot, setHot] = useState(null)
  const [open, setOpen] = useState(null)

  const fail = useCallback((err) => {
    if (err) console.error('[gear] the 3D scene failed; showing the still', err)
    failedRef.current = true
    engine.current?.setVisible(false)
    setFailed(true)
  }, [])

  const load = useCallback(() => {
    if (started.current) return
    started.current = true
    Promise.all([import('./scene.js'), import('./bench.js')])
      .then(([{ createGear }, { default: view }]) =>
        createGear(canvas.current, {
          url: '/casefile/gear/gear.glb',
          view,
          gear,
          reduced,
          onHover: setHot,
          onLost: () => fail(),
        }),
      )
      .then((g) => {
        engine.current = g
        g.setVisible(visible.current)
        setReady(true)
      })
      .catch(fail)
  }, [reduced, fail])

  useEffect(() => () => engine.current?.dispose(), [])

  // a trackpad pinch arrives as a wheel event with ctrlKey; here it zooms the
  // scene instead of the page. Native and not passive, so it can stop the
  // browser zooming, and it stops before the index's own wheel handler.
  useEffect(() => {
    const el = canvas.current
    const onWheel = (e) => {
      if (!e.ctrlKey) return
      e.preventDefault()
      e.stopPropagation()
      onPinch?.(e.deltaY)
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [onPinch])

  const show = (on) => {
    if (visible.current === on) return
    visible.current = on
    if (!failedRef.current) engine.current?.setVisible(on)
  }

  useImperativeHandle(ref, () => ({
    prefetch: load,
    // p: how far the arrival has come (0..1); local: the push in after it
    update(p, local) {
      const el = root.current
      const v = veil.current
      if (!el || !v) return
      const { fade, slide, zoom } = arrival(p)
      v.style.visibility = fade > 0 ? 'visible' : 'hidden'
      v.style.opacity = String(fade)
      const on = slide > 0
      el.style.visibility = on ? 'visible' : 'hidden'
      show(on)
      if (!on) return
      load()
      // reduced motion: no slide and no zoom, the scene fades in in place
      if (reduced) el.style.opacity = String(slide)
      else el.style.transform = `translate3d(0, ${((slide - 1) * 100).toFixed(2)}%, 0)`
      el.classList.toggle('is-open', p > 0.98)
      engine.current?.setEnter(reduced ? 1 : zoom)
      engine.current?.setLocal(local)
    },
    /** True once the veil hides everything under it. */
    covers(p) {
      return arrival(p).fade >= 1
    },
    pointer(x, y) {
      engine.current?.pointer((x / window.innerWidth) * 2 - 1, (y / window.innerHeight) * 2 - 1)
    },
  }))

  const openStory = (id) => {
    setOpen(id)
    onStory?.(true)
  }
  const closeStory = useCallback(() => {
    setOpen(null)
    onStory?.(false)
  }, [onStory])

  const onClick = (e) => {
    const id = engine.current?.pick(e.clientX, e.clientY)
    if (id) openStory(id)
  }

  const item = open ? gear.find((g) => g.id === open) : null
  const live = ready && !failed

  return (
    <>
      <div className="gear-veil" ref={veil} aria-hidden="true" />
      <section className={`gear${live ? ' is-ready' : ''}`} ref={root} aria-label={gearScene.label}>
        <img
          className="gear__still"
          src="/casefile/gear/still.webp"
          width="1600"
          height="1000"
          alt=""
          loading="lazy"
          decoding="async"
        />
        <canvas className="gear__canvas" ref={canvas} onClick={onClick} aria-hidden="true" />

        <p className="gear__label cf-ui">{gearScene.label}</p>

        <nav className="gear__legend cf-ui" aria-label={gearScene.label}>
          {gear.map((g, i) => (
            <button
              type="button"
              key={g.id}
              className={`gear__key${hot === g.id ? ' is-hot' : ''}`}
              onClick={() => openStory(g.id)}
              onPointerEnter={() => engine.current?.highlight(g.id)}
              onPointerLeave={() => engine.current?.highlight(null)}
              onFocus={() => engine.current?.highlight(g.id)}
              onBlur={() => engine.current?.highlight(null)}
            >
              <span className="cf-mono">{pad(i)}</span>
              {g.name}
            </button>
          ))}
        </nav>

        {item && (
          <Suspense fallback={null}>
            <Story item={item} index={gear.indexOf(item)} total={gear.length} onClose={closeStory} />
          </Suspense>
        )}
      </section>
    </>
  )
})

export default GearStage
