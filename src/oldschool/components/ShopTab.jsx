import React from 'react'
import { product, consulting } from '../data/lut'

// Shop entry point, parked on the right edge. It stays out of the way of the
// timeline until you go looking for it: only the handle shows, and the shelf
// slides in on hover.
//
// The wrapper is a plain div, not an <a> — every item on the shelf is its own
// link, and nesting anchors is invalid. The handle carries the link to the
// shop index instead.
//
// All of this is CSS. The app is wrapped in <MotionConfig reducedMotion="always">,
// so a framer-driven slide would never move — and transform-only transitions
// stay off the main thread anyway. The idle nudge is motion-safe:, so it is
// simply absent for anyone who asked the OS for less movement.

const HANDLE = 44 // px of the tab left poking out when collapsed
const PANEL = 252 // px that slide in on hover

// The LUT has a frame to show. The call does not, so its slot is set in the
// display face rather than reaching for stock imagery.
const Item = ({ href, thumb, figure, lot, name, price }) => (
  <a
    href={href}
    className="group/item flex flex-row items-center gap-3 rounded-xl p-2 transition-colors hover:bg-foreground/5"
  >
    {thumb ? (
      <img
        src={thumb}
        alt=""
        width="80"
        height="45"
        loading="lazy"
        className="w-20 shrink-0 rounded-lg object-cover aspect-video"
      />
    ) : (
      <span className="flex w-20 shrink-0 items-center justify-center rounded-lg border border-border aspect-video">
        <span className="font-instrument text-xl leading-none text-foreground/30">{figure}</span>
      </span>
    )}

    <span className="flex min-w-0 flex-col gap-1">
      <span className="font-ibm text-[10px] uppercase tracking-widest text-muted-foreground">
        {lot}
      </span>
      <span className="font-instrument text-lg leading-none transition-colors group-hover/item:text-custom">
        {name}
      </span>
      <span className="font-ibm text-[11px] text-foreground/50 whitespace-nowrap">${price}</span>
    </span>
  </a>
)

const ShopTab = () => (
  <div className="fixed right-0 top-1/2 z-30 hidden -translate-y-1/2 sm:block">
    <div
      style={{ width: HANDLE + PANEL, transform: `translateX(${PANEL}px)` }}
      className="group/tab flex flex-row items-stretch overflow-hidden rounded-l-2xl border border-r-0 border-border bg-background/80 backdrop-blur-xl transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:!translate-x-0 focus-within:!translate-x-0"
    >
      {/* Handle — the only part visible at rest, and the way into the shop */}
      <a
        href="/shop"
        aria-label="Shop"
        style={{ width: HANDLE }}
        className="flex shrink-0 flex-col items-center justify-center gap-2 border-r border-border py-5 focus-visible:outline-none"
      >
        <span className="motion-safe:animate-nudge text-foreground/40 transition-colors group-hover/tab:text-custom">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M7.5 2 3.5 6l4 4" />
          </svg>
        </span>
        <span className="font-ibm text-[10px] uppercase tracking-widest text-muted-foreground [writing-mode:vertical-rl]">
          Shop
        </span>
      </a>

      {/* Shelf — slides in with every item that is for sale */}
      <div style={{ width: PANEL }} className="flex shrink-0 flex-col gap-1 p-2">
        <Item
          href="/lut"
          thumb="/lut/after-01.jpg"
          lot={product.lot}
          name="The LUT"
          price={product.price}
        />
        <Item
          href="/call"
          figure="45"
          lot={consulting.lot}
          name="The Call"
          price={consulting.price}
        />
      </div>
    </div>
  </div>
)

export default ShopTab
