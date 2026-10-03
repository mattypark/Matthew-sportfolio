import React from 'react'
import ReactDOM from 'react-dom/client'
import { Analytics } from '@vercel/analytics/react'
import SimpleApp from './simple/SimpleApp.jsx'
import { startAnalytics } from './analytics.js'
import './simple/simple.css'

// The site is the one-pager in src/simple (branch simple-2026).
//
// Earlier builds are still in the repo, unrouted: the life archive / board
// (src/life, branch redesign-2026) and the timeline (src/oldschool, whose
// LUT and call pages SimpleApp still serves). To switch back, render
// ./life/LifeApp.jsx with its styles, as redesign-2026's main.jsx does.
startAnalytics()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <SimpleApp />
    <Analytics />
  </React.StrictMode>,
)
