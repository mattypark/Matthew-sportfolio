// BLOCK DIVIDER — the grass strip between sections.
//
// Two rows: a checkered ink/cream "surface" over a solid red "dirt" row.
// It's a Minecraft cross-section without ever leaving the palette —
// no green, no texture image, just squares.
//
// The checker is painted with a repeating gradient rather than a row of
// elements: a fixed number of 8px blocks would give the divider a hard
// min-width and blow out the grid it sits in on narrow screens.

export default function BlockDivider({ label, className = '' }) {
  return (
    <div className={`bd ${className}`} role="separator" aria-label={label || 'section break'}>
      {label ? <span className="bd-label">{label}</span> : null}
      <div className="bd-surface" aria-hidden="true" />
      <div className="bd-dirt" aria-hidden="true" />
    </div>
  )
}
