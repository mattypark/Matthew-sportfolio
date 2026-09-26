import { useNow } from '../hooks/motion'

export default function Clock({ label, zone, className = '' }) {
  const now = useNow('minute')
  const time = new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: zone,
  }).format(now)
  const [h, m] = time.split(':')

  return (
    <span className={`clock mono ${className}`}>
      <span className="clock__label">{label}</span>{' '}
      <time dateTime={now.toISOString()}>
        {h}
        <span className="clock__colon">:</span>
        {m}
      </time>
    </span>
  )
}
