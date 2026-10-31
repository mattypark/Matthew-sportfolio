// Speed bands: the F1-titles wipe. The screen is cut into horizontal bands
// that sweep across one after another, each a little behind the last, so the
// edge reads as a staircase of streaks rather than a line.
//
// One table of offsets drives every use (page changes, the block 01 to 02
// hand-over, the footer), so the staircase always has the same shape.

// per-band lag, 0..1; hand-tuned so neighbours never move together
const OFFSETS = [0.42, 0.08, 0.66, 0.24, 0.9, 0.0, 0.55, 0.3, 0.78, 0.14, 0.6]

const smooth = (t) => t * t * (3 - 2 * t)
const clamp01 = (v) => Math.min(1, Math.max(0, v))

/** Each band's leading edge (0..1 across the screen) at progress p. */
export function bandEdges(p, count = OFFSETS.length, stagger = 0.45) {
  return Array.from({ length: count }, (_, i) => smooth(clamp01(p * (1 + stagger) - OFFSETS[i] * stagger)))
}

/**
 * clip-path for the region the bands have covered.
 * dir 'ltr': bands enter from the left; 'rtl': from the right.
 */
export function bandClip(p, { dir = 'ltr', count = OFFSETS.length, stagger = 0.45 } = {}) {
  if (p <= 0) return 'polygon(0 0, 0 0, 0 0)'
  if (p >= 1) return 'none'
  const edges = bandEdges(p, count, stagger)
  const h = 100 / count
  const x = (e) => (dir === 'ltr' ? e * 100 : 100 - e * 100).toFixed(2)
  const side = dir === 'ltr' ? '0' : '100'
  const pts = [`${side}% 0%`]
  edges.forEach((e, i) => {
    pts.push(`${x(e)}% ${(i * h).toFixed(2)}%`, `${x(e)}% ${((i + 1) * h).toFixed(2)}%`)
  })
  pts.push(`${side}% 100%`)
  return `polygon(${pts.join(',')})`
}

export const BAND_OFFSETS = OFFSETS
