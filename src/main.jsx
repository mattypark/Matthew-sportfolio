import React from 'react'
import ReactDOM from 'react-dom/client'
import { Analytics } from '@vercel/analytics/react'
import OldSchoolApp from './oldschool/OldSchoolApp.jsx'
import './oldschool/oldschool.css'

// The site is the timeline build in src/oldschool.
//
// The Anthropic Serif build (src/pages, src/components/site) is still in the
// repo but nothing imports it, so Rollup drops it from the bundle. To switch
// back, import App.jsx here instead and remove data-oldschool from index.html
// so its custom crosshair cursor is restored.
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <OldSchoolApp />
    <Analytics />
  </React.StrictMode>,
)
