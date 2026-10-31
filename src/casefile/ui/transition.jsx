// Page changes: cover with the sheet, swap the route under it, uncover.
// The same motion the intro hands off to, so arriving and moving around are
// one gesture.

import { createContext, useCallback, useContext, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { cover, uncover } from '../fx/sheet.js'

const GoContext = createContext(() => {})

const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function TransitionProvider({ children }) {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const busy = useRef(false)

  const go = useCallback(
    async (to) => {
      if (busy.current || to === pathname) return
      if (reduced()) {
        navigate(to)
        return
      }
      busy.current = true
      try {
        await cover()
        navigate(to)
        // two frames: one for React to commit, one for the new page to paint
        await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)))
        await uncover()
      } finally {
        busy.current = false
      }
    },
    [navigate, pathname],
  )

  return <GoContext.Provider value={go}>{children}</GoContext.Provider>
}

export const useGo = () => useContext(GoContext)

/** An <a> that keeps its real href (new tab, copy link) but moves with the sheet. */
export function GoLink({ to, children, ...rest }) {
  const go = useGo()
  const onClick = (e) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
    e.preventDefault()
    go(to)
  }
  return (
    <a href={to} onClick={onClick} {...rest}>
      {children}
    </a>
  )
}
