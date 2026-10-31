// The case-file site (branch casefile-2026): Index and Gallery behind one bar.
// Work and Error are built but unrouted (pages/WorkPage.jsx, pages/ErrorPage.jsx).
// Layout and motion follow unbelievablycrap.com; every word, picture and
// colour is Matthew's (copy in content.js, palette in tokens.js).
//
// Persistent layers sit outside the routes so a page change never blinks
// them: the intro's timing, the speed-band sheet, the bar, the ball cursor.

import { Suspense, lazy, useEffect, useRef } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { mountSheet } from './fx/sheet.js'
import { clipSrc } from './fx/figure.js'
import { TransitionProvider } from './ui/transition.jsx'
import Bar from './ui/Bar.jsx'
import Loader from './ui/Loader.jsx'
import BallCursor from './ui/BallCursor.jsx'
import IndexPage from './index/IndexPage.jsx'

const GalleryPage = lazy(() => import('./pages/GalleryPage.jsx'))
const PrivacyPage = lazy(() => import('./pages/PrivacyPage.jsx'))
const LegacyPage = lazy(() => import('../simple/LegacyPages.jsx'))

const PRELOAD = [clipSrc(0)]
const SHEET_BANDS = 11

function Sheet() {
  const ref = useRef(null)
  useEffect(() => mountSheet(ref.current), [])
  return (
    <div className="cf-sheet" ref={ref} aria-hidden="true">
      {Array.from({ length: SHEET_BANDS }, (_, i) => (
        <span key={i} />
      ))}
    </div>
  )
}

export default function CasefileApp() {
  return (
    <BrowserRouter>
      <TransitionProvider>
        <Loader preload={PRELOAD} />
        <div className="cf-app">
          <Suspense fallback={null}>
            <Routes>
              <Route path="/" element={<IndexPage />} />
              <Route path="/gallery" element={<GalleryPage />} />
              {/* the shop is retired; /lut and /call stay live for past buyers */}
              <Route path="/lut" element={<LegacyPage page="lut" />} />
              <Route path="/lut/thanks" element={<LegacyPage page="lut-thanks" />} />
              <Route path="/call" element={<LegacyPage page="call" />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              {/* every other path, /work and /404 included, lands on the index */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
          <Bar />
        </div>
        <Sheet />
        <BallCursor />
      </TransitionProvider>
    </BrowserRouter>
  )
}
