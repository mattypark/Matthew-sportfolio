import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import SiteHeader from './SiteHeader'
import { product, claim } from '../data/lut'

// Stripe's Payment Link redirects here with ?session_id={CHECKOUT_SESSION_ID}.
// The download itself is gated server-side in api/lut-download.js, which
// verifies the session against Stripe before streaming the file — so landing on
// this URL without a paid session gets you a page and nothing else.

const LutThanks = () => {
  const [sessionId, setSessionId] = useState('')

  useEffect(() => {
    setSessionId(new URLSearchParams(window.location.search).get('session_id') || '')
  }, [])

  return (
    <div className="relative z-10 min-h-screen text-foreground">
      <SiteHeader />

      <main className="sm:px-8 px-6 pt-32 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-xl flex flex-col gap-6"
        >
          <p className="font-ibm text-[10px] uppercase tracking-widest text-muted-foreground">
            {product.lot} · Paid
          </p>

          <h1 className="font-instrument text-6xl sm:text-7xl tracking-tight leading-none">
            Thank you.
          </h1>

          <p className="font-ibm text-sm text-foreground/60 leading-relaxed">
            {product.name} is yours. Grab the file below — and keep a copy somewhere,
            this link only works while your receipt is fresh.
          </p>

          {sessionId ? (
            <a
              href={`/api/lut-download?session_id=${encodeURIComponent(sessionId)}`}
              className="self-start rounded-full bg-custom px-7 py-3 font-ibm text-xs uppercase tracking-widest text-white hover:opacity-80 transition-opacity"
            >
              Download the .cube
            </a>
          ) : (
            <p className="font-ibm text-xs text-destructive leading-relaxed">
              No receipt on this link. If you paid and landed here, email{' '}
              <a href={`mailto:${claim.email}`} className="underline underline-offset-4">
                {claim.email}
              </a>{' '}
              and I will send the file straight over.
            </p>
          )}

          <a href="/lut" className="font-ibm text-xs text-foreground/50 hover:text-foreground transition-colors underline underline-offset-4 mt-4">
            ← Back to the LUT
          </a>
        </motion.div>
      </main>
    </div>
  )
}

export default LutThanks
