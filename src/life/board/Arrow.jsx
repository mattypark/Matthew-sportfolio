// A Friday Night Funkin'-style arrow: chunky, rounded, thick ink outline.
// Drawn pointing left, rotated for the other directions.
const ROTATE = { '←': 0, '↑': 90, '→': 180, '↓': 270 }

export default function Arrow({ dir, color, className = '' }) {
  return (
    <svg className={`fnf-arrow ${className}`} viewBox="0 0 100 100" aria-hidden>
      <g transform={`rotate(${ROTATE[dir]} 50 50)`}>
        <path
          d="M 12 50 L 50 13 L 50 34 L 87 34 L 87 66 L 50 66 L 50 87 Z"
          fill={color}
          stroke="#0b0b0b"
          strokeWidth="8"
          strokeLinejoin="round"
        />
        <path d="M 22 50 L 44 29" stroke="rgba(255,255,255,0.55)" strokeWidth="6" strokeLinecap="round" fill="none" />
      </g>
    </svg>
  )
}
