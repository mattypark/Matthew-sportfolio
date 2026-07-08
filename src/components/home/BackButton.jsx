import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { gsap } from 'gsap'
import './home.css'

// the way back — a pill that swallows its own arrow on hover.
// leaving: the whole page slides up and fades before we route home.
// tone: 'ink' on the white pages, 'bark' on the loud side.
export default function BackButton({ tone = 'ink' }) {
  const navigate = useNavigate()
  const leaving = useRef(false)

  const leave = (e) => {
    e.preventDefault()
    if (leaving.current) return
    leaving.current = true

    const root = document.getElementById('root')
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !root) {
      navigate('/')
      return
    }

    gsap.to(root, {
      y: -40,
      opacity: 0,
      duration: 0.45,
      ease: 'power3.in',
      onComplete: () => {
        navigate('/')
        // hand the canvas back clean — clearProps removes the inline
        // transform, which would otherwise re-anchor every fixed element
        // (cursor, clocks, crosshair) to #root instead of the viewport
        gsap.set(root, { clearProps: 'all' })
      },
    })
  }

  return (
    <a
      href="/"
      onClick={leave}
      data-hover
      className={`back-btn ${tone === 'bark' ? 'back-btn-bark' : ''}`}
      aria-label="Back to home"
    >
      <span className="back-btn-arrow" aria-hidden="true">←</span>
      <span className="back-btn-label">back</span>
    </a>
  )
}
