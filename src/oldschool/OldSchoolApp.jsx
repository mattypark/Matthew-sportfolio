import React from 'react'
import { MotionConfig } from 'framer-motion'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Portfolio from './components/Portfolio'
import Posts from './components/Posts'
import Projects from './components/Projects'
import CoreValues from './components/CoreValues'
import About from './components/About'
import Inspiration from './components/Inspiration'
import './App.css'

// No intro animation, no page-transition wipe, no scroll hijacking:
// the site paints its final state on first frame and routes swap instantly.
function AppContent() {
  return (
    <MotionConfig reducedMotion="always">
      <Routes>
        <Route path="/" element={<Portfolio />} />
        <Route path="/posts" element={<Posts />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/values" element={<CoreValues />} />
        <Route path="/about" element={<About />} />
        <Route path="/inspiration" element={<Inspiration />} />
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

