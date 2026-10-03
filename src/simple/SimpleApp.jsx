import { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import HomeA from './HomeA'
import HomeB from './HomeB'

const LegacyPage = lazy(() => import('./LegacyPages'))

// A/B while Matthew picks: ?v=b shows B, anything else shows A. Delete the
// loser and this switch once he chooses.
function Home() {
  const variant = new URLSearchParams(window.location.search).get('v')
  return variant === 'b' ? <HomeB /> : <HomeA />
}

export default function SimpleApp() {
  return (
    <BrowserRouter>
      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<Home />} />
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
