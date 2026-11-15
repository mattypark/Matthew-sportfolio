// The story an object opens: name, one line, a few notes, in the site's
// small uppercase. The journal's story is the journal itself: the latest
// entries, and any one of them opened in place (markdown, images included).
// Closes on ×, Esc, or a click outside.

import { Suspense, lazy, useEffect, useRef, useState } from 'react'
import { formatDate, getEntries } from '../../lib/journal.js'

const Entry = lazy(() => import('./JournalEntry.jsx'))
const LATEST = 6

export default function Story({ item, index, total, onClose }) {
  const panel = useRef(null)
  const [entry, setEntry] = useState(null)

  useEffect(() => {
    setEntry(null)
    panel.current?.focus()
  }, [item.id])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== 'Escape') return
      if (entry) setEntry(null)
      else onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [entry, onClose])

  const entries = item.id === 'journal' ? getEntries().slice(0, LATEST) : []

  return (
    <div className="gear-story" onClick={onClose}>
      <aside
        className="gear-story__panel"
        ref={panel}
        tabIndex={-1}
        role="dialog"
        aria-label={item.name}
        data-own-scroll
        onClick={(e) => e.stopPropagation()}
      >
        <header className="gear-story__head cf-ui">
          <p className="cf-mono">
            {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </p>
          <button type="button" className="gear-story__x" onClick={onClose} aria-label="Close">
            ×
          </button>
        </header>

        {entry ? (
          <Suspense fallback={<p className="gear-story__line cf-ui">Opening…</p>}>
            <Entry entry={entry} onBack={() => setEntry(null)} />
          </Suspense>
        ) : (
          <>
            <h3 className="gear-story__name">{item.name}</h3>
            <p className="gear-story__line cf-ui">{item.line}</p>
            {item.notes.length > 0 && (
              <ul className="gear-story__notes cf-ui">
                {item.notes.map((n) => (
                  <li key={n}>{n}</li>
                ))}
              </ul>
            )}
            {item.id === 'journal' && (
              <ol className="gear-story__entries cf-ui">
                {entries.length === 0 && <li>Nothing written yet</li>}
                {entries.map((e) => (
                  <li key={e.slug}>
                    <button type="button" onClick={() => setEntry(e)}>
                      <span className="cf-mono">{formatDate(e.date)}</span>
                      <span>{e.title}</span>
                    </button>
                  </li>
                ))}
              </ol>
            )}
          </>
        )}
      </aside>
    </div>
  )
}
