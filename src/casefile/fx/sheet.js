// The sheet: green speed bands over everything, used for the intro and for
// every page change, so arriving and moving around are the same motion.
//
// cover() sweeps the bands in from the left until the screen is green;
// uncover() carries them on out to the right, revealing the new page.
// Each band trails a thin streak, the F1 titles' speed line.

import { bandEdges } from './bands.js'

const EASE = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

let root = null
let bands = []

function paint(p, phase) {
  if (!root) return
  const edges = bandEdges(p, bands.length)
  bands.forEach((b, i) => {
    // in: from -100% to 0; out: from 0 to +100%
    const x = phase === 'in' ? (edges[i] - 1) * 100 : edges[i] * 100
    b.style.transform = `translate3d(${x.toFixed(2)}%, 0, 0)`
  })
  root.style.visibility = (phase === 'in' && p <= 0) || (phase === 'out' && p >= 1) ? 'hidden' : 'visible'
}

export function mountSheet(el) {
  root = el
  bands = [...el.children]
  paint(0, 'in')
  return () => {
    root = null
    bands = []
  }
}

function run(ms, phase) {
  if (!root) return Promise.resolve()
  return new Promise((resolve) => {
    const t0 = performance.now()
    const step = (now) => {
      const t = Math.min(1, (now - t0) / ms)
      paint(EASE(t), phase)
      if (t < 1) requestAnimationFrame(step)
      else resolve()
    }
    requestAnimationFrame(step)
  })
}

/** Bands sweep in from the left. Resolves when the screen is covered. */
export const cover = ({ ms = 820 } = {}) => run(ms, 'in')

/** Bands carry on out to the right. */
export const uncover = ({ ms = 760 } = {}) => run(ms, 'out')
