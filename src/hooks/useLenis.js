import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function useLenis() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (window.matchMedia('(pointer: coarse)').matches) return

    const lenis = new Lenis({
      duration: 2.1,
      easing: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -12 * t)),
      smoothWheel: true,
      wheelMultiplier: 1.15,
      lerp: 0.08,
      syncTouch: true,
      touchMultiplier: 1.4,
    })

    function raf(time) {
      lenis.raf(time)
      ScrollTrigger.update()
      requestAnimationFrame(raf)
    }
    const id = requestAnimationFrame(raf)

    lenis.on('scroll', ScrollTrigger.update)

    return () => {
      cancelAnimationFrame(id)
      lenis.destroy()
    }
  }, [])
}
