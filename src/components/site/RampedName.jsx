// RAMPED NAME — the wordmark reads like it's being typed into existence.
//
// Every letter is its own span, and three things ramp across the whole
// name at once: weight climbs 300 → 800, the slant straightens out of a
// hard italic into upright, and the type grows. So the M is a thin,
// steeply-italic whisper and the last letters are heavy and vertical.
//
// The ramp runs across BOTH lines continuously (M is index 0, K is last),
// which is why PARK lands as the heavy end of the sentence.

const LINES = ['MATTHEW', 'PARK']

// only weights we actually ship a file for — see tokens.css
const WEIGHTS = [300, 400, 500, 600, 700, 800]

// how far into the name the italic survives; past this every letter is upright
const ITALIC_UNTIL = 0.34

// type scale across the ramp, in em relative to the h1 font-size
const SIZE_FROM = 0.74
const SIZE_TO = 1.16

// extra skew stacked on top of the italic face, so the opening letters read
// as *very* italic rather than just italic
const SKEW_MAX = 7

function letterStyle(t) {
  const weight = WEIGHTS[Math.min(WEIGHTS.length - 1, Math.round(t * (WEIGHTS.length - 1)))]
  const italic = t < ITALIC_UNTIL
  // 1 at the first letter, 0 by the time the italic runs out
  const lean = italic ? 1 - t / ITALIC_UNTIL : 0

  return {
    fontWeight: weight,
    fontStyle: italic ? 'italic' : 'normal',
    fontSize: `${(SIZE_FROM + (SIZE_TO - SIZE_FROM) * t).toFixed(3)}em`,
    transform: lean > 0 ? `skewX(${(-SKEW_MAX * lean).toFixed(2)}deg)` : undefined,
  }
}

export default function RampedName() {
  // total letters across every line, so the ramp is continuous between them
  const total = LINES.reduce((n, l) => n + l.length, 0)
  let cursor = 0

  return (
    <h1 className="display hm-name" aria-label={LINES.join(' ')}>
      {LINES.map((line, li) => {
        const glyphs = line.split('').map((ch) => {
          const t = cursor / (total - 1)
          cursor += 1
          return (
            <span key={`${ch}-${cursor}`} className="hm-glyph" style={letterStyle(t)}>
              {ch}
            </span>
          )
        })

        return (
          <span key={line} className={`hm-line ${li === LINES.length - 1 ? 'is-last' : ''}`}>
            <span className="hm-line-in" aria-hidden="true">
              {glyphs}
            </span>
          </span>
        )
      })}
    </h1>
  )
}
