import { useState } from 'react'
import Kit from './Kit'
import Marker from '../../components/Marker'
import Typewriter from '../../components/Typewriter'
import Clock from '../../components/Clock'
import Footer from '../../components/Footer'
import { EMAIL, HOME_TZ } from '../../data/site'

const REASONS = ['an internship', 'a hackathon', 'a brand video', 'something you’re building', 'a talk at your event']

// ↑ Contact: the email as the one big button, what to write about, his time
// right now, then the old footer (socials + colophon) as a card.
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
        Building something, hiring an intern, or running a hackathon?{' '}
        <Marker kind="circle" delay={400}>
          <em className="hand">Tell me.</em>
        </Marker>
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

      <div className="contact-row">
        <Kit label="Write to me about">
          <p className="contact-about">
            <Typewriter phrases={REASONS} />
          </p>
        </Kit>
        <Kit label="My time, right now">
          <Clock {...HOME_TZ} className="contact-clock" />
        </Kit>
      </div>

      <Kit className="kit--foot">
        <Footer email={false} />
      </Kit>
    </div>
  )
}
