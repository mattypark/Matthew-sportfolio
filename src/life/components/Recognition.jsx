import { useState } from 'react'
import Slot from './Slot'
import { recognition, PREVIEW_ROWS } from '../data/recognition'

function Group({ g, n }) {
  const [open, setOpen] = useState(false)
  const shown = open ? g.items : g.items.slice(0, PREVIEW_ROWS)
  const hidden = g.items.length - PREVIEW_ROWS
  const listId = `rec-${n}`

  return (
    <article className="rec">
      <header className="rec__head">
        <span className="rec__n mono">{String(n).padStart(2, '0')}</span>
        <h3 className="rec__group">{g.group}</h3>
        <span className="rec__count mono">{g.items.length}</span>
      </header>
      <ul id={listId} className="rec__list">
        {shown.map((it) => (
          <li key={it.title} className="rec__row">
            <div className="rec__text">
              <p className="rec__title">{it.title}</p>
              <p className="rec__by mono">
                {it.by} · {it.date}
              </p>
            </div>
            {it.slot && <Slot id={it.slot} className="rec__thumb" sizes="72px" />}
          </li>
        ))}
      </ul>
      {hidden > 0 && (
        <button
          type="button"
          className="rec__more mono"
          aria-expanded={open}
          aria-controls={listId}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? 'Show less −' : `See ${hidden} more +`}
        </button>
      )}
    </article>
  )
}

export default function Recognition() {
  const total = recognition.reduce((sum, g) => sum + g.items.length, 0)

  return (
    <section id="recognition" className="sec sec--paper recognition" aria-labelledby="rec-title">
      <div className="sec-head">
        <p className="sec-index">05 / Recognition</p>
        <h2 id="rec-title" className="sec-title">
          {total} times someone <em className="serif-em">said yes</em>
        </h2>
      </div>
      <div className="rec__grid">
        {recognition.map((g, i) => (
          <Group key={g.group} g={g} n={i + 1} />
        ))}
      </div>
    </section>
  )
}
