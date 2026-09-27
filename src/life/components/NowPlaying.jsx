import { cortis } from '../data/repeat'

// A small "on repeat" chip instead of a whole CORTIS section: animated EQ
// bars and a link to the official site. Nothing of theirs is rehosted.
export default function NowPlaying({ className = '' }) {
  return (
    <a
      className={`nowplaying ${className}`}
      href={cortis.link}
      target="_blank"
      rel="noopener noreferrer"
    >
      <span className="nowplaying__eq" aria-hidden>
        <i />
        <i />
        <i />
        <i />
      </span>
      <span className="nowplaying__label mono">On repeat</span>
      <span className="nowplaying__artist">CORTIS</span>
      <span className="nowplaying__tag">color outside the lines</span>
      <span className="sr-only"> (opens their official site)</span>
    </a>
  )
}
