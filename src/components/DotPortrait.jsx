import { useEffect, useRef, useState } from 'react'

// Halftone-dot portrait. Samples matthewflowers.png into a grid, draws each cell
// as a dot whose radius scales with darkness. Dots = paper (gold) on ink (black).
// Animates ONCE when section enters viewport — staggered fade/scale, not scrubbed.

const GRID = 200        // dots horizontally; vertical derived from image aspect
const MAX_R = 0.48      // max dot radius as fraction of cell size (prevents blob overlap)
const MIN_R = 0.06      // min radius fraction
const SKIP_DARKNESS = 0.30 // pixels brighter than this skipped → bg/shirt drop out
const DOT_COLOR = '#E2D0A8' // paper / gold
const BG_COLOR = '#0A0A0A'   // ink / black
const SRC = '/megold.png'

export default function DotPortrait() {
  const sectionRef = useRef(null)
  const canvasRef = useRef(null)
  const [dots, setDots] = useState(null)  // { cells:[{x,y,r}], w, h }
  const [revealed, setRevealed] = useState(false)
  const rafRef = useRef(null)
  const startRef = useRef(0)
  const cellOrderRef = useRef([])

  // Sample image once on mount
  useEffect(() => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.src = SRC
    img.onload = () => {
      const aspect = img.height / img.width
      const cols = GRID
      const rows = Math.round(cols * aspect)
      const off = document.createElement('canvas')
      off.width = cols
      off.height = rows
      const octx = off.getContext('2d')
      octx.drawImage(img, 0, 0, cols, rows)
      const data = octx.getImageData(0, 0, cols, rows).data

      const cells = []
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const i = (y * cols + x) * 4
          const r = data[i], g = data[i + 1], b = data[i + 2]
          const lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255 // 0=black, 1=white
          const darkness = 1 - lum
          if (darkness < SKIP_DARKNESS) continue // drop bright pixels (wall + shirt)
          // Remap darkness over [SKIP_DARKNESS, 1] → [0, 1] so we use full dot range
          const norm = (darkness - SKIP_DARKNESS) / (1 - SKIP_DARKNESS)
          const rad = MIN_R + Math.pow(norm, 0.85) * (MAX_R - MIN_R)
          cells.push({ x, y, r: rad })
        }
      }
      setDots({ cells, w: cols, h: rows })
    }
  }, [])

  // Intersection trigger
  useEffect(() => {
    if (!sectionRef.current) return
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setRevealed(true)
            io.disconnect()
            break
          }
        }
      },
      { threshold: 0.25 },
    )
    io.observe(sectionRef.current)
    return () => io.disconnect()
  }, [])

  // Compute deterministic random reveal order (set when dots load)
  useEffect(() => {
    if (!dots) return
    const order = dots.cells.map((_, i) => i)
    // Fisher-Yates with seeded-ish pattern (stable per mount)
    for (let i = order.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[order[i], order[j]] = [order[j], order[i]]
    }
    cellOrderRef.current = order
  }, [dots])

  // Draw loop — runs while revealing
  useEffect(() => {
    if (!revealed || !dots || !canvasRef.current) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    const DURATION = 1600 // ms full reveal
    startRef.current = performance.now()

    const tick = (now) => {
      const t = Math.min(1, (now - startRef.current) / DURATION)
      // easeOutCubic
      const eased = 1 - Math.pow(1 - t, 3)

      const rect = canvas.getBoundingClientRect()
      ctx.clearRect(0, 0, rect.width, rect.height)
      ctx.fillStyle = BG_COLOR
      ctx.fillRect(0, 0, rect.width, rect.height)

      // Fit grid into canvas with letterboxing
      const cellW = rect.width / dots.w
      const cellH = rect.height / dots.h
      const cell = Math.min(cellW, cellH)
      const gridPxW = cell * dots.w
      const gridPxH = cell * dots.h
      const offX = (rect.width - gridPxW) / 2
      const offY = (rect.height - gridPxH) / 2

      const visibleCount = Math.floor(eased * dots.cells.length)
      const order = cellOrderRef.current

      ctx.fillStyle = DOT_COLOR
      for (let k = 0; k < visibleCount; k++) {
        const idx = order[k]
        const c = dots.cells[idx]
        const cx = offX + (c.x + 0.5) * cell
        const cy = offY + (c.y + 0.5) * cell
        // c.r stored as fraction of cell size
        const r = c.r * cell
        ctx.beginPath()
        ctx.arc(cx, cy, r, 0, Math.PI * 2)
        ctx.fill()
      }

      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick)
      }
    }
    rafRef.current = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('resize', resize)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [revealed, dots])

  return (
    <section
      ref={sectionRef}
      id="portrait"
      className="relative w-full"
      style={{ background: BG_COLOR }}
    >
      <div className="gutter py-[14vh]">
        <div className="max-w-[1280px] mx-auto">
          <div
            className="relative w-full"
            style={{ aspectRatio: '1 / 1', maxHeight: '78vh' }}
          >
            <canvas
              ref={canvasRef}
              className="absolute inset-0 w-full h-full"
              style={{ display: 'block' }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
