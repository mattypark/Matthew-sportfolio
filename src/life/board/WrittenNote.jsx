import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { prefersReducedMotion } from '../hooks/motion'

const WRITE_S = 2.1

// A handwritten line that writes itself: the text is revealed left → right
// behind a marker tip that bobs along the baseline, then the tip lifts off.
export default function WrittenNote({ children, className = '', delay = 0.9 }) {
  const wrap = useRef(null)
  const ink = useRef(null)
  const pen = useRef(null)

  useEffect(() => {
    if (prefersReducedMotion()) return undefined
    const state = { p: 0 }
    const draw = () => {
      const pct = state.p * 100
      // a little over on each side so descenders and slants aren't clipped
      ink.current.style.clipPath = `inset(-30% ${Math.max(0, 100 - pct)}% -30% -4%)`
      const w = wrap.current.offsetWidth
      const bob = Math.sin(state.p * Math.PI * 26) * 5
      pen.current.style.transform = `translate(${(w * state.p).toFixed(1)}px, ${bob.toFixed(1)}px) rotate(-28deg)`
    }
    draw()
    const tl = gsap
      .timeline({ delay })
      .set(pen.current, { opacity: 1 })
      .to(state, { p: 1, duration: WRITE_S, ease: 'none', onUpdate: draw })
      // opacity only: the pen's transform belongs to draw()
      .to(pen.current, { opacity: 0, duration: 0.35, ease: 'power2.out' })
    tl.pause()
    let alive = true
    // wait for the handwriting font: measuring against a fallback face would
    // put the pen in the wrong place
    ;(document.fonts?.ready ?? Promise.resolve()).then(() => alive && tl.play())
    return () => {
      alive = false
      tl.kill()
    }
  }, [delay])

  return (
    <p ref={wrap} className={`written ${className}`}>
      <span ref={ink} className="written__ink">
        {children}
      </span>
      <span ref={pen} className="written__pen" aria-hidden />
    </p>
  )
}
