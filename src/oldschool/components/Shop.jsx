import React from 'react'
import { motion } from 'framer-motion'
import SiteHeader from './SiteHeader'
import { product, consulting } from '../data/lut'

// The shop index. Two things are for sale, so this is a plain two-up grid
// rather than anything clever — a shop reads as a shop or it reads as a
// portfolio page with prices on it.
//
// Each card is one <a> so the whole tile is the hit area, not just the title.

const rise = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] },
})

// The LUT has a frame to show. The call does not, so its tile is set in the
// display face instead of reaching for stock imagery.
const Thumb = ({ src, figure, caption }) =>
  src ? (
    <img
      src={src}
      alt=""
      width="640"
      height="360"
      loading="lazy"
      className="w-full aspect-[4/3] object-cover rounded-xl"
    />
  ) : (
    <span className="flex w-full aspect-[4/3] flex-col items-center justify-center gap-2 rounded-xl border border-border">
      <span className="font-instrument text-6xl leading-none text-foreground/25">{figure}</span>
      <span className="font-ibm text-[10px] uppercase tracking-widest text-muted-foreground">
        {caption}
      </span>
    </span>
  )

const Card = ({ href, external, lot, meta, name, price, blurb, thumb, figure, caption }) => (
  <a
    href={href}
    {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    className="group flex flex-col gap-5 rounded-2xl border border-border p-5 transition-colors hover:border-foreground/30"
  >
    <Thumb src={thumb} figure={figure} caption={caption} />

    <span className="flex flex-row flex-wrap items-baseline gap-x-5 gap-y-1 font-ibm text-[10px] uppercase tracking-widest text-muted-foreground">
      <span>{lot}</span>
      {meta && <span>{meta}</span>}
    </span>

    <span className="flex flex-row items-baseline justify-between gap-4">
      <span className="font-instrument text-4xl leading-none transition-colors group-hover:text-custom">
        {name}
      </span>
      <span className="font-instrument text-2xl leading-none shrink-0">${price}</span>
    </span>

    <span className="font-ibm text-sm text-foreground/60 leading-relaxed">{blurb}</span>
  </a>
)

const Shop = () => (
  <div className="relative z-10 min-h-screen text-foreground">
    <SiteHeader />

    <main className="sm:px-8 px-6 pt-32 pb-32">
      <motion.div {...rise()} className="flex flex-col gap-6 mb-20">
        <p className="font-ibm text-[10px] uppercase tracking-widest text-muted-foreground">
          Everything for sale
        </p>
        <h1 className="font-instrument text-7xl sm:text-8xl tracking-tight leading-none">Shop</h1>
      </motion.div>

      <motion.div {...rise(0.05)} className="grid gap-8 sm:grid-cols-2 max-w-5xl">
        <Card
          href="/lut"
          lot={product.lot}
          meta={product.format}
          name="The LUT"
          price={product.price}
          blurb={product.tagline}
          thumb="/lut/after-01.jpg"
        />

        <Card
          href="/call"
          lot={consulting.lot}
          meta={consulting.duration}
          name="Personal Consulting Call"
          price={consulting.price}
          blurb={consulting.tagline}
          figure="45"
          caption="Minutes, one to one"
        />
      </motion.div>

      <footer className="mt-24 flex flex-row items-center justify-between font-ibm text-[11px] text-muted-foreground">
        <span>© 2025 Matthew Park</span>
        <a href="/" className="hover:text-foreground transition-colors">← Back</a>
      </footer>
    </main>
  </div>
)

export default Shop
