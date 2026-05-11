import React from 'react'
import { motion } from 'framer-motion'
import SiteChrome from './SiteChrome'
import RoomsNav from './RoomsNav'

/* -------------------------------------------------------------------------- */
/*  Home — clean, code-flavored, warm.                                        */
/*  Big outer spacing, compact inner content. No scroll trickery.             */
/* -------------------------------------------------------------------------- */

const ease = [0.22, 1, 0.36, 1]

const Portfolio = () => {
  return (
    <div className="relative min-h-screen text-foreground">
      <SiteChrome />

      <main className="mx-auto w-full max-w-[920px] px-6 sm:px-10 pt-32 sm:pt-44 pb-28">
        {/* Top status line — comment style */}
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease }}
          className="font-mono text-[11px] sm:text-[12px] text-foreground/45 tracking-wide"
        >
          // matthew park · 2026 · kentucky, usa
        </motion.p>

        {/* Hero */}
        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.08, ease }}
          className="mt-10 sm:mt-14"
        >
          <h1
            className="leading-[1.02] tracking-tight text-[44px] sm:text-[68px] text-foreground flex flex-wrap items-center gap-x-3 sm:gap-x-5"
            style={{ fontFamily: '"Bricolage Grotesque", system-ui, sans-serif', fontWeight: 500, letterSpacing: '-0.02em' }}
          >
            <span>
              Hi! I&rsquo;m{' '}
              <span style={{ color: 'var(--color-custom)' }}>Matthew Park</span>
            </span>
            <span
              role="img"
              aria-label="Matthew sprite"
              className="inline-block align-baseline select-none"
              style={{
                width: 'calc(1.5em * 189 / 373)',
                height: '1.5em',
                marginLeft: '5px',
                backgroundImage: 'url(/mesprite-strip.png)',
                backgroundSize: '700% 100%',
                backgroundRepeat: 'no-repeat',
                imageRendering: 'pixelated',
                animation: 'mesprite-walk 0.9s steps(7, jump-none) infinite',
              }}
            />
          </h1>
          <p className="mt-6 sm:mt-7 font-mono text-[14px] sm:text-[15px] leading-[1.75] text-foreground/80 max-w-[58ch]">
            a 15 y/o Korean American from Kentucky who is passionate about
            AI, CS, and Content Creation :)
          </p>
        </motion.section>

        {/* Rooms — code-block aesthetic */}
        <div className="mt-6 sm:mt-7 -mx-6 sm:-mx-10">
          <RoomsNav />
        </div>

        {/* Now block */}
        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.34, ease }}
          className="mt-6 sm:mt-7 grid grid-cols-1 sm:grid-cols-[160px_1fr] gap-6 sm:gap-10"
        >
          <p className="font-mono text-[11px] sm:text-[12px] text-foreground/45 tracking-widest uppercase pt-1">
            // now
          </p>
          <div className="font-mono text-[13px] sm:text-[14px] leading-[1.8] text-foreground/80 max-w-[56ch] flex flex-col gap-3">
            <p>
              building a nonprofit that helps high schoolers learn entrepreneurship, AI, CS, and startups.
            </p>
            <p>
              working with 10x and Arete Prepatory &mdash; shipping small things weekly.
            </p>
            <p>
              writing more, reading more, training tennis, playing sax, guitar, creating more.
            </p>
          </div>
        </motion.section>

        {/* Contact */}
        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.44, ease }}
          className="mt-6 sm:mt-7 grid grid-cols-1 sm:grid-cols-[160px_1fr] gap-6 sm:gap-10"
        >
          <p className="font-mono text-[11px] sm:text-[12px] text-foreground/45 tracking-widest uppercase pt-1">
            // socials/contact
          </p>
          <div className="font-mono text-[13px] sm:text-[14px] leading-[1.85] text-foreground/80 flex flex-col gap-1">
            <a
              href="mailto:mattyparkbusiness@gmail.com"
              className="w-fit underline underline-offset-[4px] decoration-foreground/25 hover:decoration-[color:var(--color-custom)] hover:text-[color:var(--color-custom)] transition-colors"
            >
              mattyparkbusiness@gmail.com
            </a>
            <a
              href="https://x.com/MattyparkW"
              target="_blank"
              rel="noopener noreferrer"
              className="w-fit underline underline-offset-[4px] decoration-foreground/25 hover:decoration-[color:var(--color-custom)] hover:text-[color:var(--color-custom)] transition-colors"
            >
              x.com/MattyparkW
            </a>
            <a
              href="https://www.instagram.com/matty.park/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-fit underline underline-offset-[4px] decoration-foreground/25 hover:decoration-[color:var(--color-custom)] hover:text-[color:var(--color-custom)] transition-colors"
            >
              instagram.com/matty.park
            </a>
            <a
              href="https://www.tiktok.com/@mattparxy"
              target="_blank"
              rel="noopener noreferrer"
              className="w-fit underline underline-offset-[4px] decoration-foreground/25 hover:decoration-[color:var(--color-custom)] hover:text-[color:var(--color-custom)] transition-colors"
            >
              tiktok.com/@mattparxy
            </a>
            <a
              href="https://www.youtube.com/@matty_park"
              target="_blank"
              rel="noopener noreferrer"
              className="w-fit underline underline-offset-[4px] decoration-foreground/25 hover:decoration-[color:var(--color-custom)] hover:text-[color:var(--color-custom)] transition-colors"
            >
              youtube.com/@matty_park
            </a>
            <a
              href="https://www.linkedin.com/in/matthew-park-487889350/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-fit underline underline-offset-[4px] decoration-foreground/25 hover:decoration-[color:var(--color-custom)] hover:text-[color:var(--color-custom)] transition-colors"
            >
              linkedin.com/in/matthew-park
            </a>
          </div>
        </motion.section>
      </main>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="mx-auto w-full max-w-[920px] px-6 sm:px-10 pb-8 sm:pb-10 flex items-end justify-between font-mono text-[11px] text-foreground/45"
      >
        <span>©2026 Matthew Park</span>
        <span>made with care, in kentucky</span>
      </motion.footer>
    </div>
  )
}

export default Portfolio
