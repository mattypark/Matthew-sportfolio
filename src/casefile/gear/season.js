// The tree follows the season in Louisville (northern hemisphere, by month):
// autumn reds and golds falling now, bare branches and snow in winter,
// blossom in spring, full green in summer.
//
// ?season=fall|winter|spring|summer previews one in dev.

export const SEASONS = {
  fall: {
    canopy: ['#c8541f', '#e08a2c', '#d9a43a', '#b23a1c', '#e7b84a', '#cf6f2a'],
    leaves: ['#c8471f', '#e07b24', '#e9b23a', '#a8321b', '#d96a1e', '#f0c457'],
    shape: 'leaf',
    size: 0.055,
    falling: 46,
    ground: 120,
    speed: [0.16, 0.3],
  },
  winter: {
    canopy: null, // bare branches
    // a touch of blue-grey, or white flakes vanish against the white ground
    leaves: ['#cfd9e2', '#dbe3ea', '#c3cfda'],
    shape: 'flake',
    size: 0.017,
    falling: 90,
    ground: 0,
    speed: [0.1, 0.18],
  },
  spring: {
    canopy: ['#f4c2cf', '#f7d6de', '#eeb0c2', '#f9e3e8', '#e9a5b9', '#f2c9d4'],
    leaves: ['#f19bb3', '#f5b3c6', '#ec8faa'],
    shape: 'petal',
    size: 0.036,
    falling: 34,
    ground: 50,
    speed: [0.12, 0.22],
  },
  summer: {
    canopy: ['#3f8a3c', '#4d9a45', '#357a35', '#5aa34e', '#2f6e30', '#46913f'],
    leaves: ['#3f8a3c', '#5aa34e', '#6fb35a'],
    shape: 'leaf',
    size: 0.05,
    falling: 8,
    ground: 12,
    speed: [0.18, 0.3],
  },
}

export function currentSeason(date = new Date()) {
  if (import.meta.env.DEV) {
    const s = new URLSearchParams(window.location.search).get('season')
    if (s in SEASONS) return s
  }
  const m = date.getMonth() // 0 = January
  if (m === 11 || m <= 1) return 'winter'
  if (m <= 4) return 'spring'
  if (m <= 7) return 'summer'
  return 'fall'
}
