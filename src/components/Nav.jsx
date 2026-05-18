import { useEffect, useState } from 'react'

// Resolve viewer's local IANA timezone — falls back to UTC if unavailable.
const localTz = (() => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
  } catch {
    return 'UTC'
  }
})()

// Short label for local time. Strip "America/" etc. for minimal display.
function shortZone(tz) {
  if (!tz) return 'LOCAL'
  const parts = tz.split('/')
  return parts[parts.length - 1].replace(/_/g, ' ').toUpperCase()
}

function formatTime(date, tz) {
  return new Intl.DateTimeFormat('en-US', {
    timeZone: tz,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date)
}

export default function Nav() {
  const [now, setNow] = useState(() => new Date())
  const localLabel = shortZone(localTz)
  const sameZone = localTz === 'America/New_York'

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000 * 15)
    return () => clearInterval(id)
  }, [])

  return (
    <header className="fixed top-0 left-0 right-0 z-50 mix-blend-difference">
      <div className="gutter flex items-center justify-between py-5 text-paper">
        <a href="#top" className="font-display text-[20px] leading-none tracking-tighter">
          MP
        </a>

        <div className="font-mono text-[10px] tracking-[0.22em] uppercase flex items-center gap-4 text-paper/75">
          <span className="flex items-center gap-2">
            <span className="opacity-50">EST</span>
            <span className="tabular-nums">{formatTime(now, 'America/New_York')}</span>
          </span>
          {!sameZone && (
            <>
              <span className="opacity-30">·</span>
              <span className="flex items-center gap-2">
                <span className="opacity-50">{localLabel}</span>
                <span className="tabular-nums">{formatTime(now, localTz)}</span>
              </span>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
