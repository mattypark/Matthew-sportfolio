// The bar along the bottom of every page: the rooms on the left, the
// Louisville clock and the email button on the right.

import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { GoLink } from './transition.jsx'
import { EMAIL, TIME_ZONE, contactLabel } from '../content.js'

// Work and Error are unrouted for now (pages/WorkPage.jsx, pages/ErrorPage.jsx)
const ROOMS = [
  { to: '/', label: 'Index' },
  { to: '/gallery', label: 'Gallery' },
]

const COPIED_MS = 1400

export function PlusMark({ className = 'cf-plus' }) {
  return (
    <svg className={className} viewBox="0 0 6 6.667" aria-hidden="true">
      <rect x="2.5" y="0" width="1" height="6.667" fill="currentColor" />
      <rect x="0" y="2.833" width="6" height="1" fill="currentColor" />
    </svg>
  )
}

function readClock(now) {
  const time = new Intl.DateTimeFormat('en-GB', {
    timeZone: TIME_ZONE,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(now)
  const zone =
    new Intl.DateTimeFormat('en-US', { timeZone: TIME_ZONE, timeZoneName: 'shortOffset' })
      .formatToParts(now)
      .find((p) => p.type === 'timeZoneName')?.value ?? 'ET'
  const hour = Number(time.slice(0, 2))
  return { time, zone, night: hour < 6 || hour >= 18 }
}

function Clock() {
  const [clock, setClock] = useState(() => readClock(new Date()))
  useEffect(() => {
    const id = setInterval(() => setClock(readClock(new Date())), 1000)
    return () => clearInterval(id)
  }, [])
  return (
    <div className="cf-bar__clock" aria-label={`Louisville time ${clock.time}`}>
      {clock.night ? (
        <svg className="cf-bar__icon" viewBox="0 0 9 9" aria-hidden="true">
          <path d="M6.2 7.6A4 4 0 0 1 3.4.4a4 4 0 1 0 5.2 5.2 4 4 0 0 1-2.4 2z" fill="currentColor" />
        </svg>
      ) : (
        <svg className="cf-bar__icon" viewBox="0 0 9 9" aria-hidden="true">
          <circle cx="4.5" cy="4.5" r="2.2" fill="currentColor" />
        </svg>
      )}
      <span>{clock.zone}</span>
      <span className="cf-bar__mark" />
      <span className="cf-bar__time">{clock.time}</span>
    </div>
  )
}

function MailButton() {
  const [copied, setCopied] = useState(false)
  useEffect(() => {
    if (!copied) return undefined
    const id = setTimeout(() => setCopied(false), COPIED_MS)
    return () => clearTimeout(id)
  }, [copied])

  const onClick = async (e) => {
    // copying is the joke ("don't email me" hands you the address);
    // without clipboard access the link falls through to mailto
    if (!navigator.clipboard) return
    e.preventDefault()
    try {
      await navigator.clipboard.writeText(EMAIL)
      setCopied(true)
    } catch (err) {
      console.error('[bar] clipboard write failed, opening mail instead', err)
      window.location.href = `mailto:${EMAIL}`
    }
  }

  return (
    <a
      className={`cf-bar__mail${copied ? ' is-copied' : ''}`}
      href={`mailto:${EMAIL}`}
      onClick={onClick}
      aria-live="polite"
    >
      {copied ? 'Copied. Fine.' : contactLabel}
      <PlusMark />
    </a>
  )
}

export default function Bar() {
  const { pathname } = useLocation()
  return (
    <nav className="cf-bar" aria-label="Rooms">
      <div className="cf-bar__left">
        {ROOMS.map((r) => (
          <GoLink
            key={r.to}
            to={r.to}
            className={`cf-bar__btn${pathname === r.to ? ' is-current' : ''}`}
            aria-current={pathname === r.to ? 'page' : undefined}
          >
            {r.label}
            <PlusMark />
          </GoLink>
        ))}
      </div>
      <Clock />
      <MailButton />
    </nav>
  )
}
