// Volume on the index (his ask, 2026-11-16: "make the volume part of the main
// website, replace that part with this"). It stands where "How it is built"
// stood, between block 02 and the way out: the speed bands bring the cover in
// over block 02, the cover plays its arrival, the index's scroll carries it up
// the screen, and the footer's bands take it away.
//
// Like the footer, it is driven from IndexPage's one loop through `update` and
// writes to the DOM directly; nothing goes through React state per frame.

import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import { VolumeCover } from './VolumePage.jsx'
import { startVolumeMotion } from './motion.js'

const VolumeSection = forwardRef(function VolumeSection({ onResize }, ref) {
  const root = useRef(null)
  const cover = useRef(null)
  const inner = useRef(null)
  const motion = useRef(null)
  const state = useRef({ travel: 0, shown: false, overflow: 0 })

  useEffect(() => {
    motion.current = startVolumeMotion(cover.current, {
      scroller: null,
      getScroll: () => state.current.travel,
      autoplay: false,
    })
    return () => motion.current?.()
  }, [])

  // the cover's height changes as its fonts and photo land; the index re-measures its scroll then
  useEffect(() => {
    const measure = () => {
      const next = Math.max(0, inner.current.offsetHeight - window.innerHeight + 28)
      if (next === state.current.overflow) return
      state.current.overflow = next
      onResize?.()
    }
    const ro = new ResizeObserver(measure)
    ro.observe(inner.current)
    window.addEventListener('resize', measure)
    measure()
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [onResize])

  useImperativeHandle(ref, () => ({
    /** How far the cover has to travel to show its bottom, in px (0 if it fits). */
    overflow() {
      return state.current.overflow
    },
    // clip: the speed-band clip-path; level: how far the bands have come in;
    // progress: 0..1 down the cover; covered: the footer is fully over it
    update({ clip, level, progress, covered }) {
      const el = root.current
      if (!el) return
      const shown = level > 0 && !covered
      if (shown !== state.current.shown) {
        state.current.shown = shown
        el.style.visibility = shown ? 'visible' : 'hidden'
      }
      el.style.clipPath = clip
      if (level > 0.85) motion.current?.play()
      const travel = progress * state.current.overflow
      state.current.travel = travel
      inner.current.style.transform = `translate3d(0, ${(-travel).toFixed(1)}px, 0)`
    },
  }))

  return (
    <section className="vsec" ref={root} aria-label="Volume">
      <div className="vol vol--section" ref={cover}>
        <VolumeCover innerRef={inner} />
      </div>
    </section>
  )
})

export default VolumeSection
