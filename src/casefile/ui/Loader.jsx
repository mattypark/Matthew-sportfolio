// The intro, with no screen of its own. The page's instrument panel blurs in
// where it will stay and does the loading: its 000 read-out counts to 100
// and its slash bar fills. At 100 the bar resets and everything else on the
// page (the figure, the outline name, the numbers, the name card) comes up
// around text that never moved. Nothing fades out, so nothing doubles.
//
// The count is real decode progress held between a floor and a ceiling: a
// warm cache cannot flash 0 to 100, and a slow line cannot strand anyone at
// 62. It always finishes between MIN_MS and MAX_MS after navigation.
//
// Progress goes out as window events ('cf:load' with the share, 'cf:loaded'
// once) for whichever page is listening; html.is-loading holds every other
// entrance until then.

import { useEffect } from 'react'

const MIN_MS = 900
const MAX_MS = 1300

const clamp = (v, a, b) => Math.max(a, Math.min(b, v))

export function BallMark({ className }) {
  return (
    <svg className={className} viewBox="0 0 30 30" aria-hidden="true">
      <circle cx="15" cy="15" r="11" fill="none" stroke="currentColor" strokeWidth="2.4" />
      <path d="M5.2 9.6c5.2 1.9 7.6 6.4 5.6 15.2M24.8 20.4c-5.2-1.9-7.6-6.4-5.6-15.2" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  )
}

export default function Loader({ preload }) {
  useEffect(() => {
    const html = document.documentElement
    if (!html.classList.contains('is-loading')) return undefined

    let done = 0
    const total = preload.length + 1
    preload.forEach((src) => {
      const img = new Image()
      const tick = () => {
        done++
      }
      img.onload = tick
      img.onerror = tick // a 404 must not hang the intro
      img.src = src
    })
    document.fonts?.ready.then(() => done++).catch(() => done++)

    let raf = 0
    const frame = (now) => {
      const p = Math.min(clamp(now / MIN_MS, 0, 1), Math.max(clamp(done / total, 0, 1), clamp(now / MAX_MS, 0, 1)))
      window.dispatchEvent(new CustomEvent('cf:load', { detail: p }))
      if (p >= 1) {
        html.classList.remove('is-loading')
        window.dispatchEvent(new CustomEvent('cf:loaded'))
        return
      }
      raf = requestAnimationFrame(frame)
    }
    raf = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(raf)
  }, [preload])

  return null
}
