import { gsap } from 'gsap'

// Liquid fill: two SVG paths (a darker back wave and the main front wave)
// rise from the bottom of the screen to cover it. The top edge is a sine
// wave whose amplitude swells mid-fill and flattens at the ends, so the
// liquid sloshes in and settles. Drain runs the same timeline backwards.

const POINTS = 12 // segments along the wave edge
const FILL_S = 1.05
const DRAIN_S = 0.8

function wavePath(w, h, level, amp, phase) {
  // level: 0 = empty (edge at bottom), 1 = full (edge above the top)
  const edge = h - level * (h + amp * 2) + amp
  let d = `M 0 ${h} L 0 ${edge.toFixed(1)}`
  for (let i = 1; i <= POINTS; i += 1) {
    const x = (w / POINTS) * i
    const y = edge + Math.sin((i / POINTS) * Math.PI * 2 + phase) * amp
    const cx = x - w / POINTS / 2
    const cy = edge + Math.sin(((i - 0.5) / POINTS) * Math.PI * 2 + phase) * amp * 1.35
    d += ` Q ${cx.toFixed(1)} ${cy.toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)}`
  }
  return `${d} L ${w} ${h} Z`
}

// svg: the overlay <svg>; back/front: its two <path>s.
export function createLiquid(svg, back, front) {
  const state = { level: 0, phase: 0 }

  const draw = () => {
    const { innerWidth: w, innerHeight: h } = window
    svg.setAttribute('viewBox', `0 0 ${w} ${h}`)
    const swell = Math.sin(Math.PI * Math.min(1, Math.max(0, state.level)))
    const amp = 18 + 46 * swell
    front.setAttribute('d', wavePath(w, h, state.level, amp, state.phase))
    // the back wave leads slightly and is offset in phase: depth
    back.setAttribute('d', wavePath(w, h, Math.min(1.04, state.level * 1.06), amp * 0.9, state.phase + 1.6))
  }

  const fill = ({ color, dark, onComplete }) => {
    gsap.killTweensOf(state)
    front.setAttribute('fill', color)
    back.setAttribute('fill', dark)
    svg.style.visibility = 'visible'
    return gsap
      .timeline({ onUpdate: draw, onComplete })
      .to(state, { level: 1.02, duration: FILL_S, ease: 'power2.inOut' }, 0)
      .to(state, { phase: `+=${Math.PI * 2.4}`, duration: FILL_S, ease: 'none' }, 0)
  }

  // Box → box: the new color rises over the old one, which stays put as the
  // backdrop until the new fill covers it. No trip back to the board.
  const refill = ({ from, color, dark, onComplete }) => {
    gsap.killTweensOf(state)
    svg.style.background = from
    state.level = 0
    draw()
    return fill({
      color,
      dark,
      onComplete: () => {
        svg.style.background = ''
        onComplete?.()
      },
    })
  }

  const drain = ({ onComplete }) => {
    gsap.killTweensOf(state)
    return gsap
      .timeline({
        onUpdate: draw,
        onComplete: () => {
          svg.style.visibility = 'hidden'
          onComplete?.()
        },
      })
      .to(state, { level: 0, duration: DRAIN_S, ease: 'power3.in' }, 0)
      .to(state, { phase: `-=${Math.PI * 1.8}`, duration: DRAIN_S, ease: 'none' }, 0)
  }

  // instant, for reduced motion and direct loads of a section URL
  const set = ({ color, dark, full }) => {
    gsap.killTweensOf(state)
    front.setAttribute('fill', color)
    back.setAttribute('fill', dark)
    state.level = full ? 1.02 : 0
    svg.style.visibility = full ? 'visible' : 'hidden'
    draw()
  }

  const onResize = () => draw()
  window.addEventListener('resize', onResize)

  return { fill, refill, drain, set, destroy: () => window.removeEventListener('resize', onResize) }
}
