import { useState } from 'react'
import { everything } from '../data/work'

// Huge uppercase list of everything done. Hover paints the row red; click
// (or Enter/Space) opens a one-line description under it.
export default function Everything() {
  const [open, setOpen] = useState(null)

  return (
    <div className="everything" aria-labelledby="everything-title">
      <p id="everything-title" className="sec-index">
        Everything, flattened — tap one
      </p>
      <ul className="everything__list">
        {everything.map((item, i) => {
          const isOpen = open === i
          const panel = `everything-${i}`
          return (
            <li key={item.name} className={`everything__row ${isOpen ? 'is-open' : ''}`}>
              <button
                type="button"
                className="everything__btn"
                aria-expanded={isOpen}
                aria-controls={panel}
                onClick={() => setOpen(isOpen ? null : i)}
              >
                <span className="everything__n mono">{String(i + 1).padStart(2, '0')}</span>
                <span className="everything__name">{item.name}</span>
                <span className="everything__plus" aria-hidden>
                  {isOpen ? '−' : '+'}
                </span>
              </button>
              <div id={panel} className="everything__panel" role="region" aria-label={item.name}>
                <p className="everything__line">{item.line ?? 'Description coming soon.'}</p>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
