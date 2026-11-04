// One journal entry, read inside the journal's story panel. Its own chunk,
// so the markdown renderer only loads when someone opens an entry.

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { formatDate } from '../../lib/journal.js'

export default function JournalEntry({ entry, onBack }) {
  return (
    <article className="gear-entry">
      <button type="button" className="gear-entry__back cf-ui" onClick={onBack}>
        ← All entries
      </button>
      <p className="gear-entry__date cf-ui cf-mono">
        {formatDate(entry.date)} · {entry.minutes} min
      </p>
      <h3 className="gear-entry__title">{entry.title}</h3>
      {entry.cover && <img className="gear-entry__cover" src={entry.cover} alt="" loading="lazy" />}
      <div className="gear-entry__body">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{entry.body}</ReactMarkdown>
      </div>
    </article>
  )
}
