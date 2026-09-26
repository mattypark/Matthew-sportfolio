import { useEffect, useState } from 'react'
import { prefersReducedMotion } from '../hooks/motion'

const TYPE_MS = 55
const DELETE_MS = 26
const HOLD_MS = 1500

// Types a phrase, holds, backspaces, types the next. Screen readers get the
// whole list once; the animated copy is aria-hidden.
export default function Typewriter({ phrases, className = '' }) {
  const [text, setText] = useState(() => (prefersReducedMotion() ? phrases.join(' / ') : ''))

  useEffect(() => {
    if (prefersReducedMotion()) return undefined
    let i = 0
    let n = 0
    let deleting = false
    let timer

    const tick = () => {
      const word = phrases[i]
      if (!deleting) {
        n += 1
        setText(word.slice(0, n))
        if (n === word.length) {
          deleting = true
          timer = setTimeout(tick, HOLD_MS)
          return
        }
        timer = setTimeout(tick, TYPE_MS)
      } else {
        n -= 1
        setText(word.slice(0, n))
        if (n === 0) {
          deleting = false
          i = (i + 1) % phrases.length
        }
        timer = setTimeout(tick, DELETE_MS)
      }
    }
    timer = setTimeout(tick, 600)
    return () => clearTimeout(timer)
  }, [phrases])

  return (
    <span className={`typewriter ${className}`}>
      <span className="sr-only">{phrases.join(', ')}</span>
      <span aria-hidden>
        {text}
        <span className="typewriter__cursor">▍</span>
      </span>
    </span>
  )
}
