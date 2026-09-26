import { useEffect, useRef, useState } from 'react'
import { animate } from 'animejs'

const REDUCED = '(prefers-reduced-motion: reduce)'

export function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia(REDUCED).matches
}

export function useReducedMotion() {
  const [reduced, setReduced] = useState(prefersReducedMotion)

  useEffect(() => {
    const mq = window.matchMedia(REDUCED)
    const onChange = () => setReduced(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  return reduced
}

// Fires once when the element first scrolls into view.
export function useInView(options = { threshold: 0.35 }) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return undefined
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true)
        io.disconnect()
      }
    }, options)
    io.observe(el)
    return () => io.disconnect()
    // options is a literal at every call site; observing once is the point
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return [ref, inView]
}

// Counts a number up with anime.js once `start` flips true. Returns the
// current integer so the caller controls formatting.
export function useCountUp(target, start, { duration = 1600 } = {}) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!start) return undefined
    if (prefersReducedMotion()) {
      setValue(target)
      return undefined
    }
    const state = { v: 0 }
    const anim = animate(state, {
      v: target,
      duration,
      ease: 'outExpo',
      onUpdate: () => setValue(Math.round(state.v)),
    })
    return () => anim.pause()
  }, [target, start, duration])

  return value
}

// Wall-clock time that re-renders on the minute (or second) boundary.
export function useNow(resolution = 'minute') {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const step = resolution === 'second' ? 1000 : 60_000
    let timer
    const tick = () => {
      const d = new Date()
      setNow(d)
      timer = setTimeout(tick, step - (d.getTime() % step))
    }
    timer = setTimeout(tick, step - (Date.now() % step))
    return () => clearTimeout(timer)
  }, [resolution])

  return now
}
