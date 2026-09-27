import { useState } from 'react'
import { EMAIL, socials, shop } from '../../data/site'

// ↑ Contact: the email as the one big button, then everywhere else.
export default function ContactPanel() {
  const [copied, setCopied] = useState(false)
  const [user, domain] = EMAIL.split('@')

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      window.location.href = `mailto:${EMAIL}`
    }
  }

  return (
    <div className="panel-contact">
      <p className="panel__lede" data-reveal>
        Building something, hiring an intern, or running a hackathon? <em className="hand">Tell me.</em>
      </p>

      <button type="button" className="big-email" onClick={copy} data-reveal>
        <span className="big-email__addr">
          {user}
          <wbr />@{domain}
        </span>
        <span className="big-email__act mono">{copied ? 'copied ✓' : 'click to copy'}</span>
      </button>
      <span className="sr-only" aria-live="polite">
        {copied ? 'Email copied' : ''}
      </span>

      <ul className="socials" data-reveal>
        {socials.map((s) => (
          <li key={s.id}>
            <a href={s.href} target="_blank" rel="noopener noreferrer">
              {s.label} <span aria-hidden>↗</span>
            </a>
          </li>
        ))}
      </ul>

      <div className="panel__doors" data-reveal>
        {shop.map((s) => (
          <a key={s.lot} href={s.href} className="door">
            {s.name} · {s.price} <span aria-hidden>→</span>
          </a>
        ))}
      </div>
    </div>
  )
}
