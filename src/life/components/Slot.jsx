import { slot } from '../data/media'

// One photo or video addressed by its media.js id. With no file yet it
// renders a captioned placeholder that says exactly what belongs there.
export default function Slot({ id, className = '', eager = false, sizes }) {
  const m = slot(id)
  const ratio = m.ratio ?? (m.w && m.h ? `${m.w}/${m.h}` : '4/5')

  if (m.src && m.kind === 'video') {
    return (
      <video
        className={`slot slot--media ${className}`}
        style={{ aspectRatio: ratio }}
        src={m.src}
        poster={m.poster}
        muted
        loop
        playsInline
        autoPlay
        preload="metadata"
        aria-label={m.alt ?? m.caption}
      />
    )
  }

  if (m.src) {
    return (
      <img
        className={`slot slot--media ${className}`}
        style={{ aspectRatio: ratio }}
        src={m.src}
        alt={m.alt ?? ''}
        width={m.w}
        height={m.h}
        sizes={sizes}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        {...(eager ? { fetchpriority: 'high' } : {})}
      />
    )
  }

  return (
    <figure className={`slot slot--empty ${className}`} style={{ aspectRatio: ratio }} data-slot={id}>
      <span className="slot__kind">
        {m.kind === 'video' ? '▶ VIDEO' : '◻ PHOTO'} · {ratio.replace('/', ':')}
      </span>
      <span className="slot__plus" aria-hidden>+</span>
      <figcaption className="slot__caption">{m.caption}</figcaption>
    </figure>
  )
}
