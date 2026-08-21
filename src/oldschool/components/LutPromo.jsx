import React from 'react'
import { product } from '../data/lut'

// The only commercial thing on the home page, so it sits at the top of the
// timeline rather than interrupting it. Deliberately restrained: the timeline
// is dense and quiet, and a loud promo block would read as an ad someone
// bolted on. The graded still does the selling; the copy stays out of the way.

const LutPromo = () => (
  <a
    href="/lut"
    className="group flex flex-row items-center gap-5 sm:gap-6 w-full max-w-xl rounded-2xl border border-border p-3 sm:p-4 mb-6 hover:border-foreground/40 transition-colors"
  >
    <img
      src="/lut/after-01.jpg"
      alt=""
      width="96"
      height="54"
      loading="lazy"
      className="w-20 sm:w-24 shrink-0 rounded-lg object-cover aspect-video"
    />

    <div className="flex flex-col gap-1 min-w-0">
      <p className="font-ibm text-[10px] uppercase tracking-widest text-muted-foreground">
        New · {product.lot}
      </p>
      <p className="font-inter text-xs">
        My colour grade, as one <span className="font-ibm">.cube</span>
      </p>
      <p className="font-ibm text-[11px] text-foreground/50">
        ${product.price} — or free if you repost a video
      </p>
    </div>

    <span
      aria-hidden="true"
      className="ml-auto shrink-0 font-ibm text-xs text-foreground/30 group-hover:text-custom transition-colors"
    >
      →
    </span>
  </a>
)

export default LutPromo
