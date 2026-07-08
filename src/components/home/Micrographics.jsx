import { useMemo } from 'react'

// Micrographics — tiny spec marks, percentages, and factory labels scattered
// like a manufactured flagship-store product sheet. Randomized every load:
// different marks, different spots, different tilts. Pure decoration.

const LABELS = [
  'MP® MFG. 2010',
  'QC / PASSED',
  'LOT NO. 036',
  'UNIT 07 — KY',
  '±0.40 MM',
  'DO NOT BEND',
  'BATCH: CREATIVE',
  'SPEC V2.6',
  '100% GENUINE',
  'CAL 38.25°N',
  'REORDER: NEVER',
  'GRADE A',
  'FRAGILE — IDEAS',
  'MADE LOUDLY',
  'SER. NO. 20100',
  'INSPECTED ×2',
]

const MARKS = ['+', '⌖', '◦', '⊕', '///', '∷']

function makeMark() {
  const r = Math.random()
  const type = r < 0.3 ? 'pct' : r < 0.78 ? 'label' : 'mark'
  return {
    type,
    text:
      type === 'pct'
        ? `${(Math.random() * 100).toFixed(1)}%`
        : type === 'label'
          ? LABELS[Math.floor(Math.random() * LABELS.length)]
          : MARKS[Math.floor(Math.random() * MARKS.length)],
    top: `${(Math.random() * 90 + 3).toFixed(1)}%`,
    left: `${(Math.random() * 90 + 3).toFixed(1)}%`,
    rot: (Math.random() * 10 - 5).toFixed(1),
    dim: Math.random() < 0.4,
  }
}

// small ASCII scraps — doodles, but typed. scatter like stickers.
export const ASCII_SCRAPS = {
  star: String.raw`    .
   /|\
--( * )--
   \|/
    '`,
  burst: String.raw` \ | /
-- + --
 / | \ `,
  wave: String.raw`~~~^~~~^~~~^~~~`,
  arrow: String.raw`----.
     \
      \
       v`,
  stairs: String.raw`      _|
    _|
  _|
_|`,
  box: String.raw`[::::::::]
[:: MP ::]
[::::::::]`,
  bar: String.raw`||||||||||  84%`,
  cloud: String.raw`  .--.
 (    ).
(___(__)`,
  music: String.raw`  |\
  | \
 @|  \
  |  @|
 (|   |
   @__|`,
}

export function AsciiScrap({ name, className = '' }) {
  return (
    <pre className={`ascii-scrap ${className}`} aria-hidden="true">
      {ASCII_SCRAPS[name]}
    </pre>
  )
}

export default function Micrographics({ count = 10, light = false }) {
  const marks = useMemo(() => Array.from({ length: count }, makeMark), [count])

  return (
    <div className="micro-layer" aria-hidden="true">
      {marks.map((m, i) => (
        <span
          key={i}
          className={`micro-mark ${m.type === 'mark' ? 'micro-mark-glyph' : ''} ${light ? 'micro-mark-light' : ''} ${m.dim ? 'micro-mark-dim' : ''}`}
          style={{ top: m.top, left: m.left, transform: `rotate(${m.rot}deg)` }}
        >
          {m.text}
        </span>
      ))}
    </div>
  )
}
