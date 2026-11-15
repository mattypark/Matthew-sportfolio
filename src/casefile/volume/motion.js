// Volume's motion (his ask, 2026-11-15: "the name gets glitched in, the map drawn,
// the image comes, the colours fill in one by one, and as I move my cursor or
// scroll it does even more"). Arrival runs once, in order; after that the page
// answers the pointer (the photo leans, the map follows, a hovered line glitches)
// and the scroll (the photo drifts, the stamp turns, lower parts arrive as they
// come into view). Only transform, opacity, clip-path and text are written, and
// under reduced motion nothing here runs: the CSS shows the finished page.

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/#+*°'
const pick = () => GLYPHS[Math.floor(Math.random() * GLYPHS.length)]

/// Letters scramble and lock left to right; `hold` keeps it noisy before locking.
export function glitchText(el, { ms = 700, hold = 0 } = {}) {
  if (!el || el.dataset.glitching) return
  const text = el.dataset.text ?? el.textContent
  el.dataset.text = text
  el.dataset.glitching = '1'
  el.classList.add('is-glitching')
  const t0 = performance.now()
  const step = (now) => {
    const t = Math.min(1, Math.max(0, (now - t0 - hold) / ms))
    const fixed = Math.floor(t * text.length)
    let out = text.slice(0, fixed)
    for (let i = fixed; i < text.length; i++) out += /\s/.test(text[i]) ? text[i] : pick()
    el.textContent = out
    if (t < 1) requestAnimationFrame(step)
    else {
      el.textContent = text
      el.classList.remove('is-glitching')
      delete el.dataset.glitching
    }
  }
  requestAnimationFrame(step)
}

const lerp = (a, b, k) => a + (b - a) * k

export function startVolumeMotion(root) {
  if (!root || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {}
  root.classList.add('is-moving')
  const q = (s) => root.querySelector(s)
  const timers = []
  const later = (ms, fn) => timers.push(setTimeout(fn, ms))

  // ---- arrival, in order --------------------------------------------------
  const name = q('.vol__title h1')
  const num = q('.vol__num')
  const coords = q('.vol__coords')
  ;[name, num, coords].forEach((el) => el && (el.dataset.text = el.textContent))
  later(120, () => glitchText(num, { ms: 900, hold: 250 }))
  later(380, () => glitchText(name, { ms: 760, hold: 120 }))
  later(700, () => glitchText(coords, { ms: 900 }))
  // the start state has to be painted once before .is-in, or nothing transitions
  void root.offsetWidth
  let inRaf = requestAnimationFrame(() => {
    inRaf = requestAnimationFrame(() => root.classList.add('is-in'))
  })

  // the lower parts arrive when they scroll into view
  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (!e.isIntersecting) return
        e.target.classList.add('is-in')
        if (e.target.matches('.vol__fact')) glitchText(e.target.querySelector('h2'), { ms: 600 })
        io.unobserve(e.target)
      }),
    { root, threshold: 0.25 },
  )
  root.querySelectorAll('.vol__fact, .vol-card').forEach((el) => io.observe(el))

  // a hovered heading glitches again
  const hoverables = [name, num, q('.vol__fact h2'), q('.vol-card__mark')].filter(Boolean)
  const onHover = (e) => glitchText(e.currentTarget, { ms: 420 })
  hoverables.forEach((el) => el.addEventListener('pointerenter', onHover))

  // ---- pointer and scroll, eased each frame -------------------------------
  const photo = q('.vol__photo img')
  const map = q('.vol-map')
  const stamp = q('.vol-stamp')
  const target = { x: 0, y: 0 }
  const now = { x: 0, y: 0, s: 0 }
  let scroll = 0
  const onMove = (e) => {
    target.x = e.clientX / window.innerWidth - 0.5
    target.y = e.clientY / window.innerHeight - 0.5
  }
  const onLeave = () => {
    target.x = 0
    target.y = 0
  }
  const onScroll = () => {
    scroll = root.scrollTop
  }
  window.addEventListener('pointermove', onMove)
  document.addEventListener('pointerleave', onLeave)
  root.addEventListener('scroll', onScroll, { passive: true })

  let raf = 0
  const frame = () => {
    now.x = lerp(now.x, target.x, 0.08)
    now.y = lerp(now.y, target.y, 0.08)
    now.s = lerp(now.s, scroll, 0.14)
    if (photo) {
      // the photo is 8% bigger than its frame, so it can lean and drift without showing an edge
      const px = -now.x * 26
      const py = -now.y * 16 + Math.min(now.s * 0.06, 30)
      photo.style.transform = `translate3d(${px.toFixed(2)}px, ${py.toFixed(2)}px, 0) scale(1.08)`
    }
    if (map) map.style.transform = `translate3d(${(now.x * 14).toFixed(2)}px, ${(now.y * 8).toFixed(2)}px, 0)`
    if (stamp) stamp.style.setProperty('--spin', `${(now.s * 0.12 + now.x * 10).toFixed(2)}deg`)
    raf = requestAnimationFrame(frame)
  }
  raf = requestAnimationFrame(frame)

  return () => {
    cancelAnimationFrame(raf)
    cancelAnimationFrame(inRaf)
    timers.forEach(clearTimeout)
    io.disconnect()
    hoverables.forEach((el) => el.removeEventListener('pointerenter', onHover))
    window.removeEventListener('pointermove', onMove)
    document.removeEventListener('pointerleave', onLeave)
    root.removeEventListener('scroll', onScroll)
    ;[name, num, coords].forEach((el) => el?.dataset.text && (el.textContent = el.dataset.text))
    root.classList.remove('is-moving', 'is-in')
  }
}
