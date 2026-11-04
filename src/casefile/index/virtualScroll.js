// One number drives the whole index page: wheel, touch and keys all feed a
// target, and the shown position follows it with a time-based ease. Every
// phase (the copy, the tear, block 02, the footer) is read off that number,
// so nothing can drift out of step with anything else.
//
// Time-based, not a per-frame fraction: a fixed fraction per frame settles
// twice as fast at 120 Hz as at 60 Hz.

const KEY_STEP = 120
const PAGE_STEP = 0.85 // of the viewport

export function createVirtualScroll(el, { max = 0, settle = 0.11, touchSpeed = 1.6 } = {}) {
  let target = 0
  let current = 0
  let velocity = 0
  let limit = max
  let last = performance.now()
  let touchY = null
  let glide = null // { from, to, t0, ms } while an automatic move runs
  let held = false // a panel is open over the page; the page stays put
  const listeners = new Set()

  const clamp = (v) => Math.min(limit, Math.max(0, v))
  // while a glide runs, input is ignored: it is a scene change, not a scroll
  const push = (dy) => {
    if (glide || held) return
    target = clamp(target + dy)
  }
  // a panel marked data-own-scroll scrolls itself, natively
  const ownScroll = (e) => e.target instanceof Element && e.target.closest('[data-own-scroll]')

  const onWheel = (e) => {
    if (ownScroll(e)) return
    e.preventDefault()
    // line-mode wheels (Firefox) report lines, not pixels
    const dy = e.deltaMode === 1 ? e.deltaY * 32 : e.deltaY
    push(dy)
  }
  const onTouchStart = (e) => {
    touchY = e.touches[0].clientY
  }
  const onTouchMove = (e) => {
    if (touchY === null || ownScroll(e)) return
    const y = e.touches[0].clientY
    push((touchY - y) * touchSpeed)
    touchY = y
    e.preventDefault()
  }
  const onTouchEnd = () => {
    touchY = null
  }
  const onKey = (e) => {
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
    const vh = window.innerHeight
    const map = {
      ArrowDown: KEY_STEP,
      ArrowUp: -KEY_STEP,
      PageDown: vh * PAGE_STEP,
      PageUp: -vh * PAGE_STEP,
      ' ': e.shiftKey ? -vh * PAGE_STEP : vh * PAGE_STEP,
      Home: -Infinity,
      End: Infinity,
    }
    if (!(e.key in map)) return
    e.preventDefault()
    push(map[e.key])
  }

  el.addEventListener('wheel', onWheel, { passive: false })
  el.addEventListener('touchstart', onTouchStart, { passive: true })
  el.addEventListener('touchmove', onTouchMove, { passive: false })
  el.addEventListener('touchend', onTouchEnd)
  window.addEventListener('keydown', onKey)

  let raf = 0
  const frame = (now) => {
    raf = requestAnimationFrame(frame)
    const dt = Math.min(0.1, (now - last) / 1000)
    last = now
    const prev = current
    if (glide) {
      const t = Math.min(1, (now - glide.t0) / glide.ms)
      const e = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
      current = glide.from + (glide.to - glide.from) * e
      target = current
      if (t >= 1) glide = null
    } else {
      const k = 1 - Math.exp(-dt / settle)
      current += (target - current) * k
      if (Math.abs(target - current) < 0.05) current = target
    }
    // px per frame at 60 Hz, normalised so ~60 px/frame reads as full speed
    velocity = ((current - prev) / Math.max(dt, 1 / 240) / 60) / 60
    listeners.forEach((fn) => fn(current, velocity))
  }
  raf = requestAnimationFrame(frame)

  return {
    get value() {
      return current
    },
    get velocity() {
      return velocity
    },
    setMax(m) {
      limit = Math.max(0, m)
      target = clamp(target)
    },
    get gliding() {
      return glide !== null
    },
    /** Moves the target by dy, kept inside lo..hi (a pinch in the gear). */
    nudge(dy, lo = 0, hi = limit) {
      if (glide || held) return
      target = clamp(Math.min(hi, Math.max(lo, target + dy)))
    },
    /** Freezes the page under an open panel; input resumes on release. */
    hold(on) {
      held = on
      if (on) target = current
    },
    /** Plays the scroll from here to v over ms, on its own. */
    glideTo(v, ms) {
      glide = { from: current, to: clamp(v), t0: performance.now(), ms }
    },
    to(v, { immediate = false } = {}) {
      target = clamp(v)
      if (immediate) current = target
    },
    on(fn) {
      listeners.add(fn)
      return () => listeners.delete(fn)
    },
    destroy() {
      cancelAnimationFrame(raf)
      el.removeEventListener('wheel', onWheel)
      el.removeEventListener('touchstart', onTouchStart)
      el.removeEventListener('touchmove', onTouchMove)
      el.removeEventListener('touchend', onTouchEnd)
      window.removeEventListener('keydown', onKey)
      listeners.clear()
    },
  }
}
