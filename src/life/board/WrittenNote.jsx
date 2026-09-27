import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { prefersReducedMotion } from '../hooks/motion'

// Per-stroke timing, in seconds. Real handwriting isn't a steady sweep:
// letters come at uneven speeds, words are separated by a lift of the pen,
// and punctuation gets a little think.
const LETTER = [0.045, 0.11]
const WORD_GAP = [0.14, 0.32]
const THINK = [0.34, 0.6] // after ↓ ( ) , .
const THINK_AFTER = new Set(['↓', '(', ')', ',', '.'])

const between = ([a, b]) => a + Math.random() * (b - a)

// Right edge (px, relative to the element) of every character, measured with
// a Range so it matches the real font and any line wrap.
function charEdges(el) {
  const node = el.firstChild
  if (!node || node.nodeType !== Node.TEXT_NODE) return []
  const base = el.getBoundingClientRect()
  const range = document.createRange()
  const edges = []
  for (let i = 0; i < node.length; i += 1) {
    range.setStart(node, i)
    range.setEnd(node, i + 1)
    const r = range.getBoundingClientRect()
    edges.push({ x: r.right - base.left, y: r.top - base.top, h: r.height })
  }
  return edges
}

// A handwritten line that writes itself behind a marker tip, stroke by
// stroke, with the hesitations of a real hand.
export default function WrittenNote({ children, className = '', delay = 0.9 }) {
  const wrap = useRef(null)
  const ink = useRef(null)
  const pen = useRef(null)

  useEffect(() => {
    if (prefersReducedMotion()) return undefined
    const text = String(children)
    const state = { x: 0, lift: 0 }
    ink.current.style.clipPath = 'inset(-30% 100% -30% -4%)'

    const draw = () => {
      const w = ink.current.offsetWidth || 1
      const right = Math.max(0, 100 - (state.x / w) * 100)
      ink.current.style.clipPath = `inset(-30% ${right.toFixed(2)}% -30% -4%)`
      const wobble = Math.sin(state.x / 3.1) * 3
      pen.current.style.transform = `translate(${state.x.toFixed(1)}px, ${(wobble - state.lift).toFixed(1)}px) rotate(-28deg)`
    }

    let tl
    let alive = true
    // wait for the handwriting font: measuring a fallback face would put
    // every stroke in the wrong place
    ;(document.fonts?.ready ?? Promise.resolve()).then(() => {
      if (!alive) return
      const edges = charEdges(ink.current)
      tl = gsap.timeline({ delay }).set(pen.current, { opacity: 1 })
      edges.forEach((edge, i) => {
        const ch = text[i]
        if (ch === ' ') {
          // pen lifts between words, then comes back down
          tl.to(state, { lift: 6, duration: between(WORD_GAP) / 2, ease: 'sine.out', onUpdate: draw })
          tl.to(state, { x: edge.x, lift: 0, duration: between(WORD_GAP) / 2, ease: 'sine.in', onUpdate: draw })
          return
        }
        tl.to(state, { x: edge.x, duration: between(LETTER), ease: 'power1.inOut', onUpdate: draw })
        if (THINK_AFTER.has(ch)) tl.to({}, { duration: between(THINK) })
      })
      tl.to(pen.current, { opacity: 0, duration: 0.3, ease: 'power2.out' })
    })

    return () => {
      alive = false
      tl?.kill()
    }
  }, [children, delay])

  return (
    <p ref={wrap} className={`written ${className}`}>
      <span ref={ink} className="written__ink">
        {children}
      </span>
      <span ref={pen} className="written__pen" aria-hidden />
    </p>
  )
}
