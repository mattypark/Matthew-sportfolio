import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import useLenis from './hooks/useLenis'

import Cursor from './components/Cursor'
import Gate from './components/home/Gate'
import WorkSite from './components/home/WorkSite'
import LoudSite from './components/home/LoudSite'
import ProjectsPage from './components/home/ProjectsPage'
import ValuesPage from './components/home/ValuesPage'

gsap.registerPlugin(ScrollTrigger)

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
    ScrollTrigger.refresh()
  }, [pathname])
  return null
}

export default function App() {
  useLenis()

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Cursor />
      <Routes>
        <Route path="/" element={<Gate />} />
        <Route path="/work" element={<WorkSite />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/values" element={<ValuesPage />} />
        <Route path="/loud" element={<LoudSite />} />
        {/* old wing URLs now live as tiers of the one loud scroll */}
        <Route path="/loud/labels" element={<Navigate to="/loud#labels" replace />} />
        <Route path="/loud/oldmoney" element={<Navigate to="/loud" replace />} />
        <Route path="/loud/life" element={<Navigate to="/loud#life" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
