import { useCallback, useEffect, useRef } from 'react'
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import useLenis from './hooks/useLenis'

import Cursor from './components/Cursor'
import Home from './pages/Home'
import About from './pages/About'
import Work from './pages/Work'
import Values from './pages/Values'
import JournalPage from './components/home/JournalPage'
import JournalEntry from './components/home/JournalEntry'

gsap.registerPlugin(ScrollTrigger)

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
    ScrollTrigger.refresh()
  }, [pathname])
  return null
}

// Page exits reuse the grammar from the old Gate: everything slides up and
// fades, and only then do we route. Pages call this via their Nav's onLeave.
function useLeave() {
  const navigate = useNavigate()
  const leaving = useRef(false)

  useEffect(() => {
    leaving.current = false
  })

  return useCallback(
    (dest) => {
      if (leaving.current) return
      leaving.current = true

      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        navigate(dest)
        return
      }

      gsap
        .timeline({ onComplete: () => navigate(dest) })
        .to('.display', { y: -50, opacity: 0, duration: 0.45, ease: 'power3.in' }, 0)
        .to(
          '.pg-reveal, .pile, .wk-row, .ab-year, .ab-sub, .vx-row',
          { y: -30, opacity: 0, duration: 0.38, ease: 'power3.in', stagger: 0.012 },
          0.04,
        )
        .to('.mx-clock', { opacity: 0, duration: 0.28 }, 0.08)
    },
    [navigate],
  )
}

function Routed() {
  const leave = useLeave()

  return (
    <Routes>
      <Route path="/" element={<Home onLeave={leave} />} />
      <Route path="/about" element={<About onLeave={leave} />} />
      <Route path="/work" element={<Work onLeave={leave} />} />
      <Route path="/values" element={<Values onLeave={leave} />} />

      {/* the journal stays live — it just isn't in the bold nav */}
      <Route path="/journal" element={<JournalPage />} />
      <Route path="/journal/:slug" element={<JournalEntry />} />

      {/* retired wings — the files stay on disk, the URLs land on Work */}
      <Route path="/projects" element={<Navigate to="/work" replace />} />
      <Route path="/loud/*" element={<Navigate to="/work" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  useLenis()

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Cursor />
      <Routed />
    </BrowserRouter>
  )
}
