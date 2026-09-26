import { useCallback, useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import useLenis from '../hooks/useLenis'

import Loader from './components/Loader'
import TopBar from './components/TopBar'
import Hero from './components/Hero'
import Manifesto from './components/Manifesto'
import Tape from './components/Tape'
import Built from './components/Built'
import Numbers from './components/Numbers'
import Values from './components/Values'
import OnRepeat from './components/OnRepeat'
import Next from './components/Next'
import Footer from './components/Footer'
import Marquee from './components/Marquee'

// The commerce pages keep working exactly as before; they are the old
// timeline build's components, reused untouched.
import Shop from '../oldschool/components/Shop'
import Lut from '../oldschool/components/Lut'
import LutThanks from '../oldschool/components/LutThanks'
import Call from '../oldschool/components/Call'

function Home() {
  const [ready, setReady] = useState(false)
  const onLoaded = useCallback(() => setReady(true), [])

  useEffect(() => {
    document.body.classList.add('life')
    return () => document.body.classList.remove('life')
  }, [])

  // pinned sections measure layout; re-measure once fonts settle
  useEffect(() => {
    document.fonts?.ready.then(() => ScrollTrigger.refresh())
  }, [])

  return (
    <div className="life-root">
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Loader onDone={onLoaded} />
      <TopBar />
      <main id="main">
        <Hero ready={ready} />
        <Manifesto />
        <Tape />
        <Marquee text="BUILDER ✱ CREATOR ✱ SAX ✱ TENNIS ✱ DEBATE ✱ " className="divider-marquee" />
        <Built />
        <Numbers />
        <Values />
        <OnRepeat />
        <Next />
      </main>
      <Footer />
      <div className="grain" aria-hidden />
    </div>
  )
}

export default function LifeApp() {
  useLenis()

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/lut" element={<Lut />} />
        <Route path="/lut/thanks" element={<LutThanks />} />
        <Route path="/call" element={<Call />} />
        {/* old section URLs land on their new home-page anchors */}
        <Route path="/values" element={<Navigate to="/#values" replace />} />
        <Route path="/about" element={<Navigate to="/#why" replace />} />
        <Route path="/projects" element={<Navigate to="/#built" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
