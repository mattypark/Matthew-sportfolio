import React from 'react'

// Tailwind can't resolve two colour utilities on the same element by string
// order, so the tone is picked here rather than passed in as a class.
const TONES = {
  light: 'text-foreground hover:text-foreground/50',
  dark: 'text-white hover:text-white/60',
  dim: 'text-white/30 hover:text-white',
}

// The one glyph in a row of two-letter text labels (X / IN / IG / TT / YT), so
// it sits first rather than reading as a broken sixth label. Hand-rolled SVG to
// match the house style — lucide-react is a dependency but nothing in the live
// build imports it.
const CartIcon = ({ tone = 'light' }) => (
  <a
    href="/shop"
    aria-label="Shop"
    title="Shop"
    className={`flex items-center justify-center transition-colors ${TONES[tone]}`}
  >
    <svg
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M1 1.5h2l1.6 8.2h7.6" />
      <path d="M4.2 3.6h10.3l-1.2 4.9H5.1" />
      <circle cx="6.4" cy="13.2" r="1.1" />
      <circle cx="11.9" cy="13.2" r="1.1" />
    </svg>
  </a>
)

export default CartIcon
