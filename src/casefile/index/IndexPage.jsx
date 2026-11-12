// The index: one virtual scroll, four phases, all read off the same number.
//
//   1  the driver card, then the case file
//        the clip plays under the scroll, the name wipes out, and the copy
//        rises from below the fold and parts around him as his head turns
//   2  the hand-over         when the gauge hits 100 the green speed bands
//                            play block 02 in on their own
//   3  block 02              his back on the lawn, the words rising
//   4  how it's built        bands sweep the tech room in; the scroll steps down its list
//   5  the way out           black bands sweep the footer in from the right
//
// The loop writes straight to the DOM through refs. Nothing here goes
// through React state per frame.

import { useEffect, useRef } from 'react'
import { createVirtualScroll } from './virtualScroll.js'
import { CLIP_FRAMES, drawFigure, extentsAt, figureRect, loadClip, nearestFrame } from '../fx/figure.js'
import { bandClip } from '../fx/bands.js'
import { decodeIn, startTextLife } from '../fx/textLife.js'
import Hud from './Hud.jsx'
import Title from './Title.jsx'
import Block2 from './Block2.jsx'
import Footer from './Footer.jsx'
import TechSection from '../tech/TechSection.jsx'
import { caseFile } from '../content.js'

const LINE_PITCH = 9.5 // 5px line box + 4.5px gap, the reference's rhythm
const PHONE_PITCH = 14 // one centred column needs air between its lines
const END_PAD = 160 // run-out after the last line leaves the top
const TITLE_OUT = 0.5 // viewport heights of scroll that carry the name off
const HANDOVER_LEN = 1.1 // viewport heights
const B2_LEN = 1.1
const TECH_IN = 0.7 // viewport heights for the bands to bring the tech room in
const TECH_LEN = 3.4 // its whole stay, the sweep included: about 0.4 of a screen per word
const FOOTER_LEN = 1.0
const HUD_FADE_BY = 0.5
const PHONE = 720 // px: below this the copy is one centred column (index.css)
const HANDOVER_MS = 1300 // the band sweep plays on its own once the gauge is full

const clamp01 = (v) => Math.min(1, Math.max(0, v))

export default function IndexPage() {
  const stage = useRef(null)
  const column = useRef(null)
  const figureCanvas = useRef(null)
  const hud = useRef(null)
  const title = useRef(null)
  const b2 = useRef(null)
  const ftr = useRef(null)
  const tech = useRef(null)

  useEffect(() => {
    const el = stage.current
    const lines = [...column.current.children]
    lines.forEach((l) => {
      l._side = l.dataset.side
    })
    let clip = null
    let vw = window.innerWidth
    let vh = window.innerHeight
    let phases = null
    let lastFrame = -1
    let lastLift = -1
    let lastV = 0

    const scroll = createVirtualScroll(el)

    let pitch = LINE_PITCH
    const measure = () => {
      vw = window.innerWidth
      vh = window.innerHeight
      pitch = vw < PHONE ? PHONE_PITCH : LINE_PITCH
      lines.forEach((l, i) => {
        l.style.top = `${i * pitch}px`
      })
      const s1 = vh + lines.length * pitch + END_PAD
      const s2 = s1 + vh * HANDOVER_LEN
      const s3 = s2 + vh * B2_LEN
      const st = s3 + vh * TECH_LEN
      const s4 = st + vh * FOOTER_LEN
      phases = { s1, s2, s3, st, s4 }
      scroll.setMax(s4)
      lastFrame = -1 // force a redraw at the new size
    }
    measure()
    if (window.location.hash === '#how-it-is-built') {
      scroll.to(phases.s3 + vh * TECH_IN, { immediate: true })
      tech.current?.prepare()
    }

    const onResize = () => measure()
    const onMove = (e) => {
      hud.current?.pointer(e.clientX / vw, e.clientY / vh)
      ftr.current?.pointer(e.clientX, e.clientY)
      tech.current?.pointer(e.clientX / vw, e.clientY / vh)
    }
    window.addEventListener('resize', onResize)
    window.addEventListener('pointermove', onMove)

    const stopLoading = loadClip((c) => {
      clip = c
    })

    // the intro runs through the HUD's own gauge; the scroll owns it after
    let loading = document.documentElement.classList.contains('is-loading')
    const onLoad = (e) => hud.current?.loading(e.detail)
    const onLoaded = () => {
      loading = false
      hud.current?.reset()
    }
    window.addEventListener('cf:load', onLoad)
    window.addEventListener('cf:loaded', onLoaded)
    const stopTextLife = startTextLife(el)
    if (loading) decodeIn(el)

    // ---- per frame -------------------------------------------------------
    const off = scroll.on((v) => {
      const { s1, s2, s3, st, s4 } = phases
      // the gauge filling is the cue: crossing its end in either direction
      // plays the whole hand-over, so the bands never hang half way
      if (!scroll.gliding) {
        if (lastV <= s1 && v > s1 && v < s2) scroll.glideTo(s2, HANDOVER_MS)
        else if (lastV >= s2 && v < s2 && v > s1) scroll.glideTo(s1, HANDOVER_MS)
      }
      lastV = v
      const travel = Math.min(v, s1)
      const hand = clamp01((v - s1) / (s2 - s1))
      const techIn = clamp01((v - s3) / (vh * TECH_IN))
      const techAt = clamp01((v - s3 - vh * TECH_IN) / (st - s3 - vh * TECH_IN))
      const foot = clamp01((v - st) / (s4 - st))
      // the field's pictures start loading once block 02 is up
      if (v > s2) tech.current?.prepare()

      title.current?.update({ out: v / (vh * TITLE_OUT), drift: v })
      if (!loading) hud.current?.progress(travel / s1)
      hud.current?.fade(1 - clamp01(hand / HUD_FADE_BY))
      b2.current?.update({ clip: bandClip(hand), travel: Math.max(0, v - s2), foot: techIn, vh })
      tech.current?.update({ clip: bandClip(techIn), level: techIn, progress: techAt, covered: foot >= 1 })
      ftr.current?.update(bandClip(foot, { dir: 'rtl' }), foot)

      // the clip runs from the top of the page until the lawn has fully
      // covered him, so it never stands frozen while the bands sweep in
      const lift = hand * vh * 0.12
      let frame = 0
      if (clip) {
        frame = nearestFrame(clip, clamp01(v / s2) * (CLIP_FRAMES - 1))
        if (frame !== lastFrame || lift !== lastLift) {
          drawFigure(figureCanvas.current, clip, frame, lift)
          lastFrame = frame
          lastLift = lift
        }
      }

      // the copy rises from below the fold, each visible line pushed clear
      // of the silhouette at its own height in the frame on screen now
      const col = column.current
      col.style.transform = `translate3d(0, ${(vh - travel).toFixed(1)}px, 0)`
      col.style.opacity = String(1 - clamp01(hand * 2.5))
      const rows = clip?.profiles[frame]
      const rect = clip ? figureRect(vw, vh, clip.aspect) : null
      if (rect) rect.y -= lift
      const cx = vw / 2
      const base = vh - travel
      for (let i = 0; i < lines.length; i++) {
        const y = base + i * pitch
        const line = lines[i]
        const onScreen = y > -20 && y < vh + 20
        if (line._on !== onScreen) {
          line.style.visibility = onScreen ? 'visible' : 'hidden'
          line._on = onScreen
        }
        if (!onScreen) continue
        const ext = rows && rect ? extentsAt(rows, rect, y + 2.5, 6) : null
        // lines sit 22px either side of centre (index.css), so pushing a line's
        // inner edge to the silhouette keeps the same 22px clear of him
        let shift = 0
        if (ext && vw >= PHONE) {
          shift = line._side === 'l' ? Math.max(0, cx - ext[0]) : Math.max(0, ext[1] - cx)
        }
        if (line._shift !== shift) {
          line._shift = shift
          line.firstChild.style.transform = `translate3d(${line._side === 'l' ? -shift : shift}px, 0, 0)`
        }
      }
    })

    return () => {
      off()
      stopLoading()
      stopTextLife()
      scroll.destroy()
      window.removeEventListener('resize', onResize)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('cf:load', onLoad)
      window.removeEventListener('cf:loaded', onLoaded)
    }
  }, [])

  return (
    <main className="cf-index" ref={stage}>
      <div className="cf-index__studio" aria-hidden="true" />
      <Title ref={title} />
      <canvas className="cf-index__figure" ref={figureCanvas} role="img" aria-label="Matthew Park, turning his head" />
      <div className="about__stage">
        <h1 className="sr-only">Matthew Park</h1>
        <div className="about__column cf-ui" ref={column}>
          {caseFile.map((t, i) => (
            <div className="about__line" data-side={i % 2 ? 'r' : 'l'} key={t} style={{ top: i * LINE_PITCH }}>
              <p>{t}</p>
            </div>
          ))}
        </div>
      </div>
      <Hud ref={hud} />
      <Block2 ref={b2} />
      <TechSection ref={tech} />
      <Footer ref={ftr} />
    </main>
  )
}
