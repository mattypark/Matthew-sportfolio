import { useEffect } from 'react'
import Lut from '../oldschool/components/Lut'
import LutThanks from '../oldschool/components/LutThanks'
import Call from '../oldschool/components/Call'
import './legacy.css'

// /lut, /lut/thanks and /call stay live for past buyers. They load as one
// lazy chunk with their own fonts and Tailwind, untouched.
const LEGACY_FONTS =
  'https://fonts.googleapis.com/css2?family=Inter:wght@100..900&family=IBM+Plex+Mono:wght@400;500;600;700&family=Instrument+Serif:ital@0;1&display=swap'

const PAGES = { lut: Lut, 'lut-thanks': LutThanks, call: Call }

export default function LegacyPage({ page }) {
  useEffect(() => {
    if (document.querySelector(`link[href="${LEGACY_FONTS}"]`)) return
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = LEGACY_FONTS
    document.head.appendChild(link)
  }, [])

  const Page = PAGES[page]
  return (
    <div className="legacy">
      <Page />
    </div>
  )
}
