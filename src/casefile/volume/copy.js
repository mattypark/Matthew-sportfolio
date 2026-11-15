// Every word on the Volume page. The layout is a lofi drive-video cover (his reference,
// 2026-11-15: "same font, text look, everything except for the copy and the colors"); the
// facts are the ones already on the site (CLAUDE.md, ../content.js), nothing new.

import { AGE, NAME, PLACE } from '../content.js'

/// 38.2527, -85.7585 (PLACE) as degrees, minutes, seconds.
function dms(value, pos, neg) {
  const abs = Math.abs(value)
  const d = Math.floor(abs)
  const m = Math.floor((abs - d) * 60)
  const s = ((abs - d - m / 60) * 3600).toFixed(2)
  return `${d}°${m}'${s}" ${value >= 0 ? pos : neg}`
}

const LAT = parseFloat(PLACE.lat)
const LON = -parseFloat(PLACE.lon)

export const volume = {
  kicker: 'Case file',
  number: String(AGE).padStart(3, '0'),
  name: NAME,
  coords: `${dms(LAT, 'N', 'S')} ${dms(LON, 'E', 'W')}`,
  pin: { lat: LAT, lon: LON },
  tagline: ['Build. Ship. Repeat.', 'Designed for long nights.'],
  stamp: { top: 'Matthew + Park', bottom: 'Case file edition', inner: 'Est. Kentucky · built daily', mark: 'M+P' },
  factTitle: 'Case fact',
  fact:
    'Matthew Park was born in Kentucky and spent most of growing up on the outside, trying to fit in everywhere. ' +
    'Eventually he learned you don’t have to. So he builds instead. As cofounder and CMO of Prayer Lock he scaled it 7x ' +
    'and helped it bring in $14k. He started Axiom Pathways, a nonprofit that gets young people internships at ' +
    'startups: 800+ interns, 10+ startups, and the goal is millions. Then came Nudgy, an iPhone assistant that listens ' +
    'to your day so you only say it once. He has played tennis since he was nine. 75,000 people follow along. His eyes ' +
    'are on Stanford, SF and New York, then the world.',
  card: {
    built: 'Built in Kentucky',
    series: 'Case file series',
    archive: ['Personal archive', 'Volume collection'],
    sign: NAME,
    mark: ['Matthew', 'Park'],
    line: 'Kentucky to the world',
  },
  photo: {
    src: '/casefile/volume/subway.webp',
    srcSet: '/casefile/volume/subway-1200.webp 1200w, /casefile/volume/subway.webp 2400w',
    w: 2400,
    h: 1350,
    alt: 'Matthew Park from behind on a New York subway platform as two trains pass',
  },
}
