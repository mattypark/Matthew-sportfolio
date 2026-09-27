import { createContext, useContext } from 'react'

// Panels scroll inside themselves (a fixed, overflow-y box), not the window.
// Components with ScrollTrigger animations read the scrolling element from
// here and pass it as `scroller`; outside a panel it is undefined, which
// ScrollTrigger treats as the window, so /archive behaves as before.
export const ScrollerContext = createContext(null)

export function useScroller() {
  return useContext(ScrollerContext) ?? undefined
}
