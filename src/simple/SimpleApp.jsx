import { Suspense, lazy, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Home from './Home'
import Privacy from './Privacy'

const LegacyPage = lazy(() => import('./LegacyPages'))

// client-side moves (home ↔ privacy) start at the top, like a page load
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default function SimpleApp() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/privacy" element={<Privacy />} />
          {/* the shop is retired; /lut and /call stay live for past buyers */}
          <Route path="/lut" element={<LegacyPage page="lut" />} />
          <Route path="/lut/thanks" element={<LegacyPage page="lut-thanks" />} />
          <Route path="/call" element={<LegacyPage page="call" />} />
          {/* every old section URL (board boxes, /archive, /work…) lands home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
