import { Suspense, lazy, useCallback, useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import useLenis from '../hooks/useLenis'

import Loader from './components/Loader'
import TopBar from './components/TopBar'
import Hero from './components/Hero'
import Manifesto from './components/Manifesto'
import TapeTeaser from './components/TapeTeaser'
import Tape from './components/Tape'
import Built from './components/Built'
import GitHub from './components/GitHub'
import Values from './components/Values'
import Next from './components/Next'
import Footer from './components/Footer'
import Marquee from './components/Marquee'
import Board from './board/Board'

// The commerce pages keep working exactly as before; they are the old
// timeline build's components, reused untouched. Lazy so framer-motion and
// their deps stay out of the home page bundle.
const Shop = lazy(() => import('../oldschool/components/Shop'))
const Lut = lazy(() => import('../oldschool/components/Lut'))
const LutThanks = lazy(() => import('../oldschool/components/LutThanks'))
const Call = lazy(() => import('../oldschool/components/Call'))

// The old build's fonts, loaded only when a commerce page mounts.
const LEGACY_FONTS =
  'https://fonts.googleapis.com/css2?family=Inter:wght@100..900&family=IBM+Plex+Mono:wght@400;500;600;700&family=Instrument+Serif:ital@0;1&display=swap'

function LegacyFonts({ children }) {
  useEffect(() => {
    if (document.querySelector(`link[href="${LEGACY_FONTS}"]`)) return
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = LEGACY_FONTS
    document.head.appendChild(link)
  }, [])
  return children
}

function useLifeBody() {
  useEffect(() => {
    document.body.classList.add('life')
    return () => document.body.classList.remove('life')
  }, [])
}

function Chrome({ home, children }) {
  return (
    <div className="life-root">
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <TopBar home={home} />
      <main id="main">{children}</main>
      <Footer />
      <div className="grain" aria-hidden />
    </div>
  )
}

// the previous long-scroll home page, kept whole at /archive
function Archive() {
  const [ready, setReady] = useState(false)
  const onLoaded = useCallback(() => setReady(true), [])
  useLifeBody()

  // pinned sections measure layout; re-measure once fonts settle
  useEffect(() => {
    document.fonts?.ready.then(() => ScrollTrigger.refresh())
  }, [])

  // old URLs redirect to /#section; land there once the loader is gone
  useEffect(() => {
    if (!ready || !window.location.hash) return
    document.getElementById(window.location.hash.slice(1))?.scrollIntoView()
  }, [ready])

  return (
    <>
      <Loader onDone={onLoaded} />
      <Chrome home>
        <Hero ready={ready} />
        <Manifesto />
        <TapeTeaser />
        <Marquee text="BUILDER ✱ CREATOR ✱ SAX ✱ TENNIS ✱ DEBATE ✱ " className="divider-marquee" />
        <Built />
        <GitHub />
        <Values />
        <Next />
      </Chrome>
    </>
  )
}

function TapePage() {
  useLifeBody()
  return (
    <Chrome home={false}>
      <Tape />
    </Chrome>
  )
}

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    if (!window.location.hash) window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default function LifeApp() {
  useLenis()

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Suspense fallback={null}>
        <Routes>
          {/* one route for / and every box so Board stays mounted and the
              liquid can animate between them; static paths below win */}
          <Route path="/:section?" element={<Board />} />
          <Route path="/archive" element={<Archive />} />
          <Route path="/tape" element={<TapePage />} />
          <Route
            path="/shop"
            element={
              <LegacyFonts>
                <Shop />
              </LegacyFonts>
            }
          />
          <Route
            path="/lut"
            element={
              <LegacyFonts>
                <Lut />
              </LegacyFonts>
            }
          />
          <Route
            path="/lut/thanks"
            element={
              <LegacyFonts>
                <LutThanks />
              </LegacyFonts>
            }
          />
          <Route
            path="/call"
            element={
              <LegacyFonts>
                <Call />
              </LegacyFonts>
            }
          />
          {/* old section URLs land on their new home */}
          <Route path="/values" element={<Navigate to="/personality" replace />} />
          <Route path="/about" element={<Navigate to="/archive#why" replace />} />
          <Route path="/projects" element={<Navigate to="/timeline" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
