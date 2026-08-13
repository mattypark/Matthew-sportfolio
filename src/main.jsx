import React from 'react'
import ReactDOM from 'react-dom/client'
import { Analytics } from '@vercel/analytics/react'
import App from './App.jsx'
import './index.css'

const root = ReactDOM.createRoot(document.getElementById('root'))

// LOCALHOST ONLY — the restored old-school build.
//
// import.meta.env.DEV is a compile-time constant, so Rollup deletes this
// whole branch from the production bundle: none of src/oldschool ships.
// The deployed site keeps rendering <App /> exactly as it does today.
if (import.meta.env.DEV) {
  // set first, before anything paints — index.html keys the native-cursor
  // rule off this attribute, so a late write would flash a hidden cursor
  document.documentElement.dataset.oldschool = 'true'

  const [{ default: OldSchoolApp }] = await Promise.all([
    import('./oldschool/OldSchoolApp.jsx'),
    import('./oldschool/oldschool.css'),
  ])

  // the old-school theme wants its own type; loaded here so index.html
  // (which is shipped) stays untouched
  const fonts = document.createElement('link')
  fonts.rel = 'stylesheet'
  fonts.href =
    'https://fonts.googleapis.com/css2?family=Inter:wght@100..900&family=IBM+Plex+Mono:wght@400;500;600;700&family=Instrument+Serif:ital@0;1&display=swap'
  document.head.appendChild(fonts)

  root.render(
    <React.StrictMode>
      <OldSchoolApp />
    </React.StrictMode>,
  )
} else {
  root.render(
    <React.StrictMode>
      <App />
      <Analytics />
    </React.StrictMode>,
  )
}
