// Hand-drawn pieces: Matthew as a stick figure, the brush stroke under the
// CTA, and the wobbly underline on links. These are the only animations on
// the page, and each one plays once (or on hover). Reduced motion shows them
// finished. Styles live in simple.css under "doodles".

// Stroke order is drawing order. Coordinates wobble on purpose so it reads as
// one pass of a pen, not a vector icon.
const HEAD = 'M30.5 9.8C37.6 9.4 42.6 15.2 42.1 22.4C41.7 29.4 36.2 34.3 29.6 34C22.7 33.7 18 28.4 18.3 21.9C18.6 15 23.6 10.2 31.2 10.6'
const FRINGE = 'M19.6 19.4C22.6 15.6 26.4 13.4 30.8 13.6C34.8 13.8 38.6 16 41.6 19.8M25.4 14.8C24.8 17 23.6 18.6 22 19.8M31 13.8C30.8 16.2 30 18 28.8 19.4'
const FACE = 'M25.6 23.4L25.7 24.8M34 23.2L34.1 24.6M25.4 28.4C27.8 30.4 31.6 30.5 34.2 28.2'
const BODY = 'M30 34.4C30.7 50.5 29.9 66.5 30.5 84'
const WAVE_ARM = 'M30.2 45.5C36.4 41.2 41.6 34.4 45.6 25.2'
const PHONE_ARM = 'M30.2 47C25.3 54.5 21.6 61.2 18.6 68.6'
const PHONE = 'M12.6 66.4L20.2 67.6L18.9 80.6L11.3 79.4Z'
const LEG_L = 'M30.5 84C26.4 100.5 22.2 117 17.2 138.4L10.8 139.6'
const LEG_R = 'M30.5 84C34.2 100.2 38.4 117 44.2 138.2L50.6 137.4'

function Stroke({ d, i }) {
  return <path className="doodle-stroke" d={d} pathLength="1" style={{ '--i': i }} />
}

export function SelfDoodle({ className = '' }) {
  return (
    <svg
      className={`doodle-self ${className}`}
      viewBox="0 0 60 150"
      width="60"
      height="150"
      aria-hidden="true"
      focusable="false"
    >
      <Stroke d={HEAD} i={0} />
      <Stroke d={FRINGE} i={1} />
      <Stroke d={FACE} i={2} />
      <Stroke d={BODY} i={3} />
      <g className="doodle-wave">
        <Stroke d={WAVE_ARM} i={4} />
      </g>
      <Stroke d={PHONE_ARM} i={5} />
      <Stroke d={PHONE} i={6} />
      <Stroke d={LEG_L} i={7} />
      <Stroke d={LEG_R} i={8} />
    </svg>
  )
}

// A marker swipe: thick in the middle, tapered at the ends, with a few dry
// streaks of paper showing through, like a marker running dry.
export function Brush({ className = '' }) {
  return (
    <span className={`brush ${className}`} aria-hidden="true">
      <svg className="brush-svg" viewBox="0 0 420 56" width="420" height="56" preserveAspectRatio="none" focusable="false">
        <path
          className="brush-ink"
          d="M10 26C60 18 140 12 230 10C300 8.5 360 8 406 9C415 9.5 419 16 416 24C413 30 406 32 398 32.5C330 35 250 39 170 43C110 46 60 48 18 49.5C7 50 2 42 4 34C5 30 7 27.5 10 26Z"
        />
        <path className="brush-dry" d="M30 37C120 30 250 23 392 19" />
        <path className="brush-dry brush-dry--thin" d="M64 43C160 37 280 31 380 28" />
        <path className="brush-dry brush-dry--thin" d="M340 13C365 12 390 12 410 13.5" />
        <path className="brush-dry brush-dry--thin" d="M20 45C40 44 60 43 90 41.5" />
      </svg>
    </span>
  )
}

const isExternal = (href) => /^https?:\/\//.test(href)

export function DrawnLink({ href, children, className = '' }) {
  const external = isExternal(href)
  return (
    <a
      href={href}
      className={`drawn-link ${className}`}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {children}
      <svg
        className="drawn-link-line"
        viewBox="0 0 100 8"
        preserveAspectRatio="none"
        aria-hidden="true"
        focusable="false"
      >
        <path d="M1 5.2C14 3.4 27 6.4 41 4.6C55 2.8 68 5.8 82 4.2C88 3.6 94 4 99 4.8" vectorEffect="non-scaling-stroke" />
      </svg>
    </a>
  )
}
