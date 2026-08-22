import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import SiteHeader from './SiteHeader'
import { product, contact } from '../data/lut'

// Stripe's Payment Link redirects here with ?session_id={CHECKOUT_SESSION_ID}.
// The download is gated server-side in api/lut-download.js, which verifies the
// session against Stripe before streaming the file — so landing on this URL
// without a paid session gets you a page and nothing else.
//
// This is the only delivery path, so the page has to say so plainly: there is
// no follow-up email, and a buyer who closes the tab without downloading has
// to write in. Better to be blunt here than to have them find out later.

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
            {product.name} is yours. Download it now and put it somewhere you will
            find it again — this is the only copy you get, and there is no email
            following it.
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
              <a href={`mailto:${contact.email}`} className="underline underline-offset-4">
                {contact.email}
              </a>{' '}
              and I will send the file straight over.
            </p>
          )}

          <p className="font-ibm text-[11px] leading-relaxed text-muted-foreground border-t border-border pt-5 mt-2">
            Lost it, or the download failed? Email{' '}
            <a href={`mailto:${contact.email}`} className="underline underline-offset-4 hover:text-foreground transition-colors">
              {contact.email}
            </a>{' '}
            with the receipt Stripe sent you and I will send it straight over.
          </p>

          <a href="/lut" className="font-ibm text-xs text-foreground/50 hover:text-foreground transition-colors underline underline-offset-4 mt-2">
            ← Back to the LUT
          </a>
        </motion.div>
      </main>
    </div>
  )
}

export default LutThanks
