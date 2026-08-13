// PIXEL BALL — the marker glyph.
// Eileen's site repeats a ☆ down her story. This is the same idea in
// Matthew's language: a tennis ball (since age 9), drawn as 16x16 pixel
// art so it belongs to the Minecraft layer instead of being an emoji.
//
// Black and white only — the ball never takes the red. Red is reserved
// for things you can break.

// 16x16 grid. 0 = empty, 1 = solid ink body, 3 = the white seam.
//
// A solid ball with knocked-out seams, rather than an outline with dark
// seams: at 16px an outlined ball collapses into a pair of parentheses,
// while this stays unmistakably a tennis ball.
const GRID = [
  [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
  [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
  [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
  [0, 1, 1, 1, 3, 1, 1, 1, 1, 1, 1, 3, 1, 1, 1, 0],
  [0, 1, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1, 1, 0],
  [1, 1, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1, 1, 1],
  [1, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1, 1],
  [1, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1, 1],
  [1, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1, 1],
  [1, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1, 1],
  [1, 1, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1, 1, 1],
  [0, 1, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 3, 1, 1, 0],
  [0, 1, 1, 1, 3, 1, 1, 1, 1, 1, 1, 3, 1, 1, 1, 0],
  [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
  [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
  [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
]

const FILL = { 1: '#0B0B0B', 3: '#FFFFFF' }

export default function PixelBall({ size = 16, className = '', style }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      className={`pixelated ${className}`}
      style={style}
      aria-hidden="true"
      focusable="false"
    >
      {GRID.map((row, y) =>
        row.map((cell, x) =>
          cell === 0 ? null : (
            <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill={FILL[cell]} />
          ),
        ),
      )}
    </svg>
  )
}
