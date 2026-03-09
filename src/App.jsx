import React, { useEffect, useRef } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import Portfolio from './components/Portfolio'
import Posts from './components/Posts'
import Projects from './components/Projects'
import CoreValues from './components/CoreValues'
import About from './components/About'
import Socials from './components/Socials'
import PageTransition from './components/PageTransition'
import './App.css'

function SmoothScroll() {
  const location = useLocation()
  const state = useRef({
    raf: null,
    targetY: 0,
    currentY: 0,
    velocity: 0,
    container: null,
  })

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    // Disable smooth scroll on touch devices — let native iOS/Android scrolling work
    const isTouch = window.matchMedia('(pointer: coarse)').matches
    if (isTouch) return

    const s = state.current

    // Cancel any previous loop
    if (s.raf) cancelAnimationFrame(s.raf)

    // Find scroll container: inner element or window
    const el = document.querySelector('[data-smooth-scroll]')
    s.container = el || null

    const getScrollY = () => el ? el.scrollTop : window.scrollY
    const setScrollY = (y) => {
      if (el) {
        el.scrollTop = y
      } else {
        window.scrollTo(0, y)
      }
    }
    const getMaxScroll = () => {
      if (el) return el.scrollHeight - el.clientHeight
      return document.documentElement.scrollHeight - window.innerHeight
    }

    // Sync on route change
    s.currentY = getScrollY()
    s.targetY = s.currentY
    s.velocity = 0

    let lastTime = null

    function smoothDamp(current, target, vel, smoothTime, maxSpeed, dt) {
      smoothTime = Math.max(0.0001, smoothTime)
      const omega = 2 / smoothTime
      const x = omega * dt
      const exp = 1 / (1 + x + 0.48 * x * x + 0.235 * x * x * x)
      let change = current - target
      const maxChange = maxSpeed * smoothTime
      change = Math.max(-maxChange, Math.min(maxChange, change))
      const temp = (vel + omega * change) * dt
      vel = (vel - omega * temp) * exp
      let output = target + (change + temp) * exp
      // Prevent overshooting
      if (target - current > 0 === output > target) {
        output = target
        vel = 0
      }
      return [output, vel]
    }

    function loop(timestamp) {
      if (lastTime === null) lastTime = timestamp
      const dt = Math.min((timestamp - lastTime) / 1000, 0.05)
      lastTime = timestamp

      const max = getMaxScroll()
      s.targetY = Math.max(0, Math.min(s.targetY, max))

      const [newY, newVel] = smoothDamp(s.currentY, s.targetY, s.velocity, 0.6, 4500, dt)
      s.velocity = newVel
      s.currentY = newY
      setScrollY(newY)

      s.raf = requestAnimationFrame(loop)
    }

    s.raf = requestAnimationFrame(loop)

    function onWheel(e) {
      e.preventDefault()
      let dy = e.deltaY
      if (e.deltaMode === 1) dy *= 24  // line mode
      if (e.deltaMode === 2) dy *= window.innerHeight  // page mode
      s.targetY += dy
      s.targetY = Math.max(0, Math.min(s.targetY, getMaxScroll()))
    }

    function onKeyDown(e) {
      const lineH = 48
      const pageH = window.innerHeight * 0.9
      let dy = 0
      if (e.key === 'ArrowDown') dy = lineH
      else if (e.key === 'ArrowUp') dy = -lineH
      else if (e.key === 'PageDown' || e.key === ' ') dy = pageH
      else if (e.key === 'PageUp') dy = -pageH
      else if (e.key === 'Home') { s.targetY = 0; return }
      else if (e.key === 'End') { s.targetY = getMaxScroll(); return }
      else return
      if (dy !== 0) {
        e.preventDefault()
        s.targetY += dy
        s.targetY = Math.max(0, Math.min(s.targetY, getMaxScroll()))
      }
    }

    const target = el || window
    target.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('keydown', onKeyDown)

    return () => {
      if (s.raf) cancelAnimationFrame(s.raf)
      target.removeEventListener('wheel', onWheel)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [location.pathname])

  return null
}

function AppContent() {
  return (
    <>
      <SmoothScroll />
      <PageTransition>
        <Routes>
          <Route path="/" element={<Portfolio />} />
          <Route path="/posts" element={<Posts />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/values" element={<CoreValues />} />
          <Route path="/about" element={<About />} />
          <Route path="/socials" element={<Socials />} />
        </Routes>
      </PageTransition>
    </>
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

