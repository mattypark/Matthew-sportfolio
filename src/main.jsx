import React from 'react'
import ReactDOM from 'react-dom/client'
import { Analytics } from '@vercel/analytics/react'
import LifeApp from './life/LifeApp.jsx'
import './life/styles/base.css'
import './life/styles/chrome.css'
import './life/styles/hero.css'
import './life/styles/tape.css'
import './life/styles/sections.css'
import './life/styles/content.css'
import './life/styles/github.css'
import './life/styles/board.css'
import './life/styles/panels.css'
import './life/styles/panel-kit.css'

// The site is the life-archive build in src/life (branch redesign-2026).
//
// The previous timeline build (src/oldschool) is still in the repo: its shop,
// LUT and call pages are reused by LifeApp. To switch the whole site back,
// import ./oldschool/OldSchoolApp.jsx + ./oldschool/oldschool.css here.
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <LifeApp />
    <Analytics />
  </React.StrictMode>,
)
