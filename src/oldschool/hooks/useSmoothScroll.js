import { useEffect } from 'react'

/**
 * Spring-based smooth scroll — replicates the "SexyScroll" feel.
 * Uses a lerp RAF loop: current scrollY chases target with a damping factor.
 * @param {number} damping - 0.06 to 0.12 is the sweet spot (lower = smoother/slower)
 */
export function useSmoothScroll(damping = 0.08) {
  useEffect(() => {
    // Only run on non-touch devices (touch has native momentum already)
    if (window.matchMedia('(pointer: coarse)').matches) return

    let targetY = window.scrollY
    let currentY = window.scrollY
    let rafId = null
    let isScrolling = false

    const onWheel = (e) => {
      e.preventDefault()
      targetY += e.deltaY
      targetY = Math.max(0, Math.min(targetY, document.body.scrollHeight - window.innerHeight))
      if (!isScrolling) {
        isScrolling = true
        tick()
      }
    }

    const tick = () => {
      const diff = targetY - currentY
      // Stop when close enough
      if (Math.abs(diff) < 0.5) {
        currentY = targetY
        window.scrollTo(0, currentY)
        isScrolling = false
        return
      }
      currentY += diff * damping
      window.scrollTo(0, currentY)
      rafId = requestAnimationFrame(tick)
    }

    window.addEventListener('wheel', onWheel, { passive: false })

    return () => {
      window.removeEventListener('wheel', onWheel)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [damping])
}
