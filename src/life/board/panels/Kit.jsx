// One board-style card inside a panel: white, thick ink border, hard shadow.
// Wraps a reused archive component so every piece of a panel shares a frame.
// data-reveal: the board reveals each card in turn once the liquid fills.
export default function Kit({ label, className = '', children }) {
  return (
    <div className={`kit ${className}`} data-reveal>
      {label && <p className="kit__label mono">{label}</p>}
      {children}
    </div>
  )
}
