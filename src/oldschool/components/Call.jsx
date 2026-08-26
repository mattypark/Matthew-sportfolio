import React from 'react'
import { motion } from 'framer-motion'
import SiteHeader from './SiteHeader'
import { consulting, contact } from '../data/lut'

// Product page for the call. Booking lives on cal.com and is linked from here
// and the shop index only — deliberately not from LinkedIn, so anyone who
// wants time has to come to the site to find it.

const rise = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] },
})

const Call = () => (
  <div className="relative z-10 min-h-screen text-foreground">
    <SiteHeader />

    <main className="sm:px-8 px-6 pt-32 pb-32">
      <motion.div {...rise()} className="flex flex-col gap-6">
        <div className="flex flex-row flex-wrap items-baseline gap-x-6 gap-y-2 font-ibm text-[10px] uppercase tracking-widest text-muted-foreground">
          <span>{consulting.lot}</span>
          <span>{consulting.duration}</span>
          <span>One to one</span>
        </div>

        <h1 className="font-instrument text-7xl sm:text-8xl tracking-tight leading-none">
          Personal Consulting Call
        </h1>

        <p className="font-ibm text-sm text-foreground/60 max-w-lg leading-relaxed">
          {consulting.tagline}
        </p>

        <div className="flex flex-row flex-wrap items-center gap-5 pt-4">
          <span className="font-instrument text-4xl leading-none">${consulting.price}</span>

          <a
            href={consulting.bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-custom px-7 py-3 font-ibm text-xs uppercase tracking-widest text-white hover:opacity-80 transition-opacity"
          >
            Book a call
          </a>
        </div>
      </motion.div>

      <hr className="border-0 border-t border-border my-20" />

      <motion.section {...rise(0.05)}>
        <p className="font-ibm text-[10px] uppercase tracking-widest text-muted-foreground mb-6">
          <span className="text-foreground/30">01</span>
          <span className="mx-3 text-foreground/20">/</span>
          Spec
        </p>

        <dl className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-8 max-w-3xl">
          {[
            ['Length', consulting.duration],
            ['Format', 'Video call'],
            ['Booking', 'cal.com'],
            ['Price', `$${consulting.price} ${consulting.currency}`],
          ].map(([term, value]) => (
            <div key={term} className="flex flex-col gap-2">
              <dt className="font-ibm text-[10px] uppercase tracking-widest text-muted-foreground">{term}</dt>
              <dd className="font-ibm text-sm">{value}</dd>
            </div>
          ))}
        </dl>
      </motion.section>

      <footer className="mt-24 flex flex-row items-center justify-between font-ibm text-[11px] text-muted-foreground">
        <a href={`mailto:${contact.email}`} className="hover:text-foreground transition-colors">
          {contact.email}
        </a>
        <a href="/shop" className="hover:text-foreground transition-colors">← Shop</a>
      </footer>
    </main>
  </div>
)

export default Call
