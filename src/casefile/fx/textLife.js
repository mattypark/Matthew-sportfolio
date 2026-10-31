// Keeps the small type alive. Every TICK_MS a couple of lines are picked at
// random and given one of a handful of short moves: the letters scramble and
// resolve, the line flickers, tilts, nudges sideways, fades out and back,
// breathes its tracking open, or blurs for a moment. Nothing lasts more than
// a second and every line ends exactly where it started, so the layout never
// drifts; the page just never sits still.
//
// Only leaf <p> lines (and marquee items) are touched. Anything whose text or
// transform is written by code is opted out with data-fixed, and the
// case-file copy is left alone because its transform is the silhouette wrap.

const TICK_MS = 140
const PER_TICK = 2
const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/#+*'
const SELECTOR = '.hud p, .hud__tickitem, .b2 p, .ftr p'

const pick = (list) => list[Math.floor(Math.random() * list.length)]

function scramble(el, ms = 380 + Math.random() * 240) {
  if (el.dataset.scrambling) return
  const text = el.dataset.orig ?? el.textContent
  el.dataset.orig = text
  el.dataset.scrambling = '1'
  const t0 = performance.now()
  const step = (now) => {
    const t = Math.min(1, (now - t0) / ms)
    const fixed = Math.floor(t * text.length)
    let out = text.slice(0, fixed)
    for (let i = fixed; i < text.length; i++) {
      out += /\s/.test(text[i]) ? text[i] : pick(GLYPHS)
    }
    el.textContent = out
    if (t < 1) {
      requestAnimationFrame(step)
    } else {
      el.textContent = text
      delete el.dataset.scrambling
    }
  }
  requestAnimationFrame(step)
}

const MOVES = [
  (el) => scramble(el),
  (el) => scramble(el),
  (el) => el.animate({ opacity: [1, 0.15, 1, 0.5, 1] }, { duration: 420, easing: 'steps(4, end)' }),
  (el) =>
    el.animate(
      { transform: ['rotate(0deg)', `rotate(${(Math.random() < 0.5 ? -1 : 1) * (4 + Math.random() * 5)}deg)`, 'rotate(0deg)'] },
      { duration: 700, easing: 'cubic-bezier(.22,.61,.36,1)' },
    ),
  (el) =>
    el.animate(
      { transform: ['translateX(0)', `translateX(${(Math.random() < 0.5 ? -1 : 1) * (5 + Math.random() * 8)}px)`, 'translateX(0)'] },
      { duration: 520, easing: 'cubic-bezier(.625,.05,0,1)' },
    ),
  (el) => el.animate({ opacity: [1, 0, 1] }, { duration: 900, easing: 'ease-in-out' }),
  (el) => el.animate({ letterSpacing: ['-0.4px', '2.4px', '-0.4px'] }, { duration: 800, easing: 'ease-in-out' }),
  (el) => el.animate({ filter: ['blur(0)', 'blur(2.5px)', 'blur(0)'] }, { duration: 600, easing: 'ease-in-out' }),
]

/**
 * The arrival: every line decodes from noise into its words, a few
 * milliseconds after the one before, so the panel reads as booting up.
 */
export function decodeIn(root, { stagger = 18, ms = 520 } = {}) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const lines = [...root.querySelectorAll('.hud p, .hud__tickitem')].filter(
    (el) => !el.closest('[data-fixed]') && !el.querySelector('p, div') && el.textContent.trim(),
  )
  lines.forEach((el, i) => {
    const text = el.dataset.orig ?? el.textContent
    el.dataset.orig = text
    el.textContent = text.replace(/\S/g, () => pick(GLYPHS))
    setTimeout(() => scramble(el, ms), i * stagger)
  })
}

export function startTextLife(root) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {}

  const lines = () =>
    [...root.querySelectorAll(SELECTOR)].filter(
      (el) => !el.closest('[data-fixed]') && !el.querySelector('p, div') && el.textContent.trim(),
    )
  let pool = lines()

  const id = setInterval(() => {
    if (document.hidden) return
    for (let i = 0; i < PER_TICK; i++) {
      const el = pick(pool)
      if (!el || !el.isConnected) {
        pool = lines()
        return
      }
      // a line only moves if its room is on screen
      if (getComputedStyle(el).visibility === 'hidden') continue
      pick(MOVES)(el)
    }
  }, TICK_MS)

  return () => clearInterval(id)
}
