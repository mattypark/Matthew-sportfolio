import { useEffect, useState } from 'react'

// HEART METER — Minecraft health bar as a scroll indicator.
//
// Five pixel hearts sit beside the Louisville clock. They fill as you move
// down the page, so reaching the bottom of a page means full health rather
// than the usual thin progress line.
//
// Half-hearts are supported because a 5-heart bar that only moves in
// fifths feels coarse — Minecraft's does halves, so this does too.

const HEARTS = 5

// 9x8 pixel heart. 0 empty, 1 outline, 2 fill.
const HEART = [
  [0, 1, 1, 0, 0, 0, 1, 1, 0],
  [1, 2, 2, 1, 0, 1, 2, 2, 1],
  [1, 2, 2, 2, 1, 2, 2, 2, 1],
  [1, 2, 2, 2, 2, 2, 2, 2, 1],
  [0, 1, 2, 2, 2, 2, 2, 1, 0],
  [0, 0, 1, 2, 2, 2, 1, 0, 0],
  [0, 0, 0, 1, 2, 1, 0, 0, 0],
  [0, 0, 0, 0, 1, 0, 0, 0, 0],
]

function Heart({ level }) {
  // level: 0 empty · 1 half · 2 full
  const fill = level === 0 ? 'rgba(11,11,11,0.12)' : 'var(--red)'
  return (
    <svg width="11" height="10" viewBox="0 0 9 8" className="pixelated" aria-hidden="true">
      {HEART.map((row, y) =>
        row.map((cell, x) => {
          if (cell === 0) return null
          // on a half heart only the left side takes the red
          const empty = level === 1 && x > 4
          return (
            <rect
              key={`${x}-${y}`}
              x={x}
              y={y}
              width="1"
              height="1"
              fill={cell === 1 ? 'var(--ink)' : empty ? 'rgba(11,11,11,0.12)' : fill}
            />
          )
        }),
      )}
    </svg>
  )
}

export default function HeartMeter() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const read = () => {
      const scrollable = document.body.scrollHeight - window.innerHeight
      setProgress(scrollable > 0 ? Math.min(1, window.scrollY / scrollable) : 1)
    }
    read()
    window.addEventListener('scroll', read, { passive: true })
    window.addEventListener('resize', read)
    return () => {
      window.removeEventListener('scroll', read)
      window.removeEventListener('resize', read)
    }
  }, [])

  // total half-hearts earned, 0..10
  const halves = Math.round(progress * HEARTS * 2)

  return (
    <div className="heart-meter" aria-hidden="true">
      {Array.from({ length: HEARTS }, (_, i) => (
        <Heart key={i} level={Math.max(0, Math.min(2, halves - i * 2))} />
      ))}
    </div>
  )
}
