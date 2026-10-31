// Privacy, in the case-file style. The words are the simple site's
// (src/simple/Privacy.jsx), which maps every line to something the code does.

import { sections, UPDATED } from '../../simple/Privacy.jsx'
import { GoLink } from '../ui/transition.jsx'
import { EMAIL } from '../content.js'

export default function PrivacyPage() {
  return (
    <main className="priv">
      <div className="priv__in">
        <p className="cf-ui priv__tag">Case file // privacy // updated {UPDATED}</p>
        <h1 className="priv__title">Privacy</h1>
        {sections.map((s) => (
          <section key={s.title}>
            <h2 className="cf-ui">{s.title}</h2>
            <p>{s.body}</p>
          </section>
        ))}
        <section>
          <h2 className="cf-ui">Questions</h2>
          <p>
            <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
          </p>
        </section>
        <GoLink to="/" className="cf-ui priv__back">
          Back to index
        </GoLink>
      </div>
    </main>
  )
}
