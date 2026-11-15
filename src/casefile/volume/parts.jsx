// Small printed parts shared by the case-file rooms built on the Volume cover
// (Volume, the LUT): the rubber stamp, the flag, the barcode.

import { useMemo } from 'react'

/// The round rubber stamp: two arcs of caps, an inner ring, a diamond mark.
/// `id` keeps the arc paths unique when two stamps share a page.
export function Stamp({ top, bottom, inner, mark, id = 'vol' }) {
  return (
    <svg className="vol-stamp" viewBox="0 0 200 200" aria-hidden="true">
      <defs>
        <path id={`${id}-arc-top`} d="M30 100a70 70 0 0 1 140 0" />
        <path id={`${id}-arc-bottom`} d="M22 100a78 78 0 0 0 156 0" />
        <path id={`${id}-arc-inner`} d="M52 100a48 48 0 0 1 96 0" />
      </defs>
      <circle cx="100" cy="100" r="96" className="vol-stamp__ring" />
      <circle cx="100" cy="100" r="58" className="vol-stamp__ring vol-stamp__ring--thin" />
      <text className="vol-stamp__big">
        <textPath href={`#${id}-arc-top`} startOffset="50%" textAnchor="middle">
          · {top.toUpperCase()} ·
        </textPath>
      </text>
      <text className="vol-stamp__mid">
        <textPath href={`#${id}-arc-bottom`} startOffset="50%" textAnchor="middle">
          {bottom.toUpperCase()}
        </textPath>
      </text>
      <text className="vol-stamp__small">
        <textPath href={`#${id}-arc-inner`} startOffset="50%" textAnchor="middle">
          {inner.toUpperCase()}
        </textPath>
      </text>
      <path d="M68 104 L100 84 L132 104 L100 124 Z" className="vol-stamp__diamond" />
      <text x="100" y="110" textAnchor="middle" className="vol-stamp__mark">
        {mark}
      </text>
      <path d="M78 136h16M106 136h16" className="vol-stamp__dash" />
      <circle cx="100" cy="136" r="2" className="vol-stamp__dot" />
    </svg>
  )
}

/// The US flag, small: 13 stripes, the canton, no stars at this size (dots).
export function Flag() {
  return (
    <svg className="vol-flag" viewBox="0 0 38 20" aria-label="United States">
      {Array.from({ length: 13 }, (_, i) => (
        <rect key={i} x="0" y={(i * 20) / 13} width="38" height={20 / 13} fill={i % 2 ? '#f7f7f4' : '#b22234'} />
      ))}
      <rect x="0" y="0" width="15.2" height={(20 * 7) / 13} fill="#3c3b6e" />
      {Array.from({ length: 12 }, (_, i) => (
        <circle key={i} cx={2 + (i % 4) * 3.7} cy={1.9 + Math.floor(i / 4) * 3.4} r="0.55" fill="#f7f7f4" />
      ))}
    </svg>
  )
}

/// Decorative bars, fixed by a seed so they're the same on every visit.
export function Barcode({ seed }) {
  const bars = useMemo(() => {
    let h = 2166136261
    for (const ch of seed) h = Math.imul(h ^ ch.charCodeAt(0), 16777619)
    const out = []
    let xPos = 0
    while (xPos < 160) {
      h = Math.imul(h ^ (h >>> 13), 1274126177)
      const w = 1 + ((h >>> 3) % 3)
      const gap = 1 + ((h >>> 7) % 3)
      out.push([xPos, w])
      xPos += w + gap
    }
    return out
  }, [seed])
  return (
    <svg className="vol-barcode" viewBox="0 0 160 18" preserveAspectRatio="none" aria-hidden="true">
      {bars.map(([bx, w]) => (
        <rect key={bx} x={bx} y="0" width={w} height="18" />
      ))}
    </svg>
  )
}
