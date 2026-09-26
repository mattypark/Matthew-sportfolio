import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { values, people } from '../data/work'
import { prefersReducedMotion } from '../hooks/motion'

// The 14 core values as a focus list: the row at the middle of the screen is
// full ink, the rest fade back, and a card beside it swaps to whoever lives
// that value (his inspiration photos from the old /inspiration page).
export default function Values() {
  const [active, setActive] = useState(0)
  const card = useRef(null)

  useEffect(() => {
    const rows = document.querySelectorAll('.value')
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(Number(e.target.dataset.i))
        })
      },
      { rootMargin: '-48% 0px -48% 0px' },
    )
    rows.forEach((r) => io.observe(r))
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (prefersReducedMotion() || !card.current) return
    gsap.fromTo(
      card.current,
      { rotate: active % 2 ? 7 : -7, scale: 0.94 },
      { rotate: active % 2 ? 3 : -3, scale: 1, duration: 0.6, ease: 'back.out(2)' },
    )
  }, [active])

  const who = people[values[active].person]

  return (
    <section id="values" className="sec sec--paper values" aria-labelledby="values-title">
      <div className="sec-head">
        <p className="sec-index">06 / Values</p>
        <h2 id="values-title" className="sec-title">
          The operating <em className="serif-em">system</em>
        </h2>
      </div>

      <div className="values__body">
        <ol className="values__list">
          {values.map((v, i) => (
            <li key={v.text} data-i={i} className={`value ${i === active ? 'is-active' : ''}`}>
              <span className="value__n mono">{String(i + 1).padStart(3, '0')} /</span>
              <span className="value__text">{v.text}</span>
            </li>
          ))}
        </ol>

        <aside className="values__aside" aria-live="polite">
          <div ref={card} className="values__card">
            {who ? (
              <>
                <img src={who.src} alt={who.name} width="480" height="600" loading="lazy" decoding="async" />
                <p className="mono">Lives it: {who.name}</p>
              </>
            ) : (
              <div className="values__card-type">
                <span className="values__card-n">{String(active + 1).padStart(2, '0')}</span>
                <p className="mono">of 14 · written down, not framed</p>
              </div>
            )}
          </div>
        </aside>
      </div>
    </section>
  )
}
