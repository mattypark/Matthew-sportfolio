import React from 'react'
import { MotionConfig } from 'framer-motion'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Portfolio from './components/Portfolio'
import Posts from './components/Posts'
import Projects from './components/Projects'
import CoreValues from './components/CoreValues'
import About from './components/About'
import Inspiration from './components/Inspiration'
import Lut from './components/Lut'
import Shop from './components/Shop'
import Call from './components/Call'
import LutThanks from './components/LutThanks'
import MorphField from './components/MorphField'
import './App.css'

// No intro animation, no page-transition wipe, no scroll hijacking:
// the site paints its final state on first frame and routes swap instantly.
function AppContent() {
  return (
    <MotionConfig reducedMotion="always">
      {/* Wireframe backdrop: fixed, centred, behind every page. Page roots are
          positioned and come later in the DOM, so they paint above it. */}
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <MorphField className="absolute left-1/2 top-1/2 aspect-square w-[min(52vh,74vw,540px)] -translate-x-1/2 -translate-y-1/2 [mask-image:radial-gradient(circle,#000_72%,transparent_96%)]" />
      </div>
      <Routes>
        <Route path="/" element={<Portfolio />} />
        <Route path="/posts" element={<Posts />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/values" element={<CoreValues />} />
        <Route path="/about" element={<About />} />
        <Route path="/inspiration" element={<Inspiration />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/call" element={<Call />} />
        <Route path="/lut" element={<Lut />} />
        <Route path="/lut/thanks" element={<LutThanks />} />
      </Routes>
    </MotionConfig>
  )
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App

