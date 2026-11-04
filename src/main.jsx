import React from 'react'
import ReactDOM from 'react-dom/client'
import { Analytics } from '@vercel/analytics/react'
import CasefileApp from './casefile/CasefileApp.jsx'
import { startAnalytics } from './analytics.js'
import './casefile/styles/base.css'
import './casefile/styles/ui.css'
import './casefile/styles/hud.css'
import './casefile/styles/index.css'
import './casefile/styles/rooms.css'
import './casefile/styles/gear.css'
import './casefile/styles/phone.css'

// The site is the case file in src/casefile (branch casefile-2026).
//
// Earlier builds are still in the repo, unrouted: the simple one-pager
// (src/simple, branch simple-2026, whose privacy copy and /lut /call pages
// the case file reuses), the life archive (src/life) and the timeline
// (src/oldschool). To switch back, render ./simple/SimpleApp.jsx with
// ./simple/simple.css, as simple-2026's main.jsx does.
startAnalytics()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <CasefileApp />
    <Analytics />
  </React.StrictMode>,
)
