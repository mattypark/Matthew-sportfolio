import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

export default function Cursor() {
  const ring = useRef(null)
  const dot = useRef(null)

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return

    const xTo = gsap.quickTo(ring.current, 'x', { duration: 0.4, ease: 'power3.out' })
    const yTo = gsap.quickTo(ring.current, 'y', { duration: 0.4, ease: 'power3.out' })
    const xDot = gsap.quickTo(dot.current, 'x', { duration: 0.08, ease: 'power3.out' })
    const yDot = gsap.quickTo(dot.current, 'y', { duration: 0.08, ease: 'power3.out' })

    const onMove = (e) => {
      xTo(e.clientX)
      yTo(e.clientY)
      xDot(e.clientX)
      yDot(e.clientY)
    }

    const onOver = (e) => {
      if (e.target.closest('a, button, [data-hover]')) {
        ring.current?.classList.add('cursor-hover')
      } else {
        ring.current?.classList.remove('cursor-hover')
      }
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseover', onOver)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseover', onOver)
    }
  }, [])

  return (
    <>
      <div ref={ring} className="cursor-ring" />
      <div ref={dot} className="cursor-dot" />
    </>
  )
}
