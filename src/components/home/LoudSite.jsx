import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import RightPanel, { BlockCTA } from './RightPanel'
import BackButton from './BackButton'

// WHO I AM — the full maximal site, one continuous scroll.
// Tiers, top to bottom: creative home → say hi.
// The back button is the only door out.

export default function LoudSite() {
  const { hash } = useLocation()

  useEffect(() => {
    // wait one frame past mount so pinned sections have claimed their space
    const id = setTimeout(() => {
      ScrollTrigger.refresh()
      const el = hash ? document.querySelector(hash) : null
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }, 120)
    return () => clearTimeout(id)
  }, [hash])

  return (
    <>
      <BackButton tone="bark" />
      <RightPanel />
      <div className="home-right grain">
        <BlockCTA />
      </div>
    </>
  )
}
