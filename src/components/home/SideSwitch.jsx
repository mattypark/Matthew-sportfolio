import { Link } from 'react-router-dom'

// Fixed corner pill for hopping between the two hemispheres.

export default function SideSwitch({ to, label, dark = false }) {
  return (
    <Link
      to={to}
      data-hover
      className={`fixed bottom-5 right-5 z-[70] rounded-full border px-5 py-3 font-mono text-[10px] tracking-[0.22em] uppercase transition-colors duration-300 ${
        dark
          ? 'border-bone/30 bg-void/80 text-bone hover:bg-bone hover:text-void'
          : 'border-[#14100B]/40 bg-cream/80 text-[#14100B] hover:bg-[#14100B] hover:text-cream'
      } backdrop-blur-sm`}
    >
      {label}
    </Link>
  )
}
