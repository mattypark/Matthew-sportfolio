import React from 'react'
import { motion } from 'framer-motion'
import SiteHeader from './SiteHeader'
import Compare from './Compare'
import { product, conversions, install, faq, outstanding } from '../data/lut'

// Standing entrance used across the site. Framer is globally reduced-motion, so
// this resolves to the final state on first paint — it's here for parity with
// the other pages, not for the animation.
const rise = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] },
})

const Rule = () => <hr className="border-0 border-t border-border my-20" />

const SectionLabel = ({ index, children }) => (
  <p className="font-ibm text-[10px] uppercase tracking-widest text-muted-foreground mb-6">
    <span className="text-foreground/30">{index}</span>
    <span className="mx-3 text-foreground/20">/</span>
    {children}
  </p>
)

const Placeholder = ({ children }) => (
  <p className="font-ibm text-[11px] uppercase tracking-widest text-destructive">{children}</p>
)

const Lut = () => {
  const buyable = Boolean(product.stripeUrl)
  const todo = outstanding()

  return (
    <div className="relative z-10 min-h-screen text-foreground">
      <SiteHeader />

      <main className="sm:px-8 px-6 pt-32 pb-32">
        {/* ---- Spec header ------------------------------------------------ */}
        <motion.div {...rise()} className="flex flex-col gap-6">
          <div className="flex flex-row flex-wrap items-baseline gap-x-6 gap-y-2 font-ibm text-[10px] uppercase tracking-widest text-muted-foreground">
            <span>{product.lot}</span>
            <span>{product.format}</span>
            <span>{product.size}</span>
            <span>{product.colorSpace}</span>
          </div>

          <h1 className="font-instrument text-7xl sm:text-8xl tracking-tight leading-none">
            {product.name}
          </h1>

          <p className="font-ibm text-sm text-foreground/60 max-w-lg leading-relaxed">
            {product.tagline}
          </p>

          <div className="flex flex-row flex-wrap items-center gap-5 pt-4">
            <span className="font-instrument text-4xl leading-none">${product.price}</span>

            {buyable ? (
              <a
                href={product.stripeUrl}
                className="rounded-full bg-custom px-7 py-3 font-ibm text-xs uppercase tracking-widest text-white hover:opacity-80 transition-opacity"
              >
                Buy the LUT
              </a>
            ) : (
              <span className="rounded-full border border-dashed border-destructive px-7 py-3 font-ibm text-[11px] uppercase tracking-widest text-destructive">
                Stripe link not set yet
              </span>
            )}

          </div>

          {todo.length > 0 && (
            <div className="mt-6 border border-dashed border-destructive rounded-2xl p-5 max-w-xl">
              <Placeholder>Still needed before this can take money</Placeholder>
              <ul className="font-ibm text-xs leading-relaxed text-foreground/70 mt-3 flex flex-col gap-1">
                {todo.map((item) => (
                  <li key={item}>— {item}</li>
                ))}
              </ul>
              <p className="font-ibm text-[11px] leading-relaxed text-foreground/50 mt-3">
                Edit <code>src/oldschool/data/lut.js</code>. This block disappears by itself.
              </p>
            </div>
          )}
        </motion.div>

        <Rule />

        {/* ---- The conversion --------------------------------------------- */}
        <motion.section {...rise(0.05)}>
          <SectionLabel index="01">The conversion</SectionLabel>
          <h2 className="font-instrument text-4xl sm:text-5xl tracking-tight mb-4">
            Log in. Graded out.
          </h2>
          <p className="font-ibm text-sm text-foreground/60 max-w-lg leading-relaxed mb-10">
            Same frame, same exposure. Drag the line — left is what the camera gave me,
            right is one click of this LUT and nothing else.
          </p>

          <div className="flex flex-col gap-14 max-w-4xl">
            {conversions.map((c) => (
              <Compare
                key={c.id}
                before={c.before}
                after={c.after}
                label={c.label}
                note={c.note}
                alt={c.label}
              />
            ))}
          </div>
        </motion.section>

        <Rule />

        {/* ---- Spec sheet -------------------------------------------------- */}
        <motion.section {...rise(0.05)}>
          <SectionLabel index="02">Spec</SectionLabel>

          <dl className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-8 max-w-3xl mb-16">
            {[
              ['Format', product.format],
              ['Grid', product.size],
              ['Output', product.colorSpace],
              ['Price', `$${product.price} ${product.currency}`],
            ].map(([term, value]) => (
              <div key={term} className="flex flex-col gap-2">
                <dt className="font-ibm text-[10px] uppercase tracking-widest text-muted-foreground">{term}</dt>
                <dd className="font-ibm text-sm">{value}</dd>
              </div>
            ))}
          </dl>

          <div className="mb-16 max-w-3xl">
            <p className="font-ibm text-[10px] uppercase tracking-widest text-muted-foreground mb-3">Built for</p>
            <ul className="flex flex-row flex-wrap gap-2">
              {product.builtFor.map((profile) => (
                <li
                  key={profile}
                  className={`rounded-full px-4 py-2 font-ibm text-xs ${
                    profile.startsWith('PLACEHOLDER')
                      ? 'border border-dashed border-destructive text-destructive'
                      : 'border border-border'
                  }`}
                >
                  {profile}
                </li>
              ))}
            </ul>
          </div>

          <p className="font-ibm text-[10px] uppercase tracking-widest text-muted-foreground mb-6">Install</p>
          <div className="flex flex-col max-w-3xl">
            {install.map((entry) => (
              <div
                key={entry.app}
                className="flex flex-col sm:flex-row gap-2 sm:gap-10 border-t border-border py-5"
              >
                <p className="font-ibm text-xs sm:w-40 shrink-0">{entry.app}</p>
                <p className="font-ibm text-sm text-foreground/60 leading-relaxed">{entry.steps}</p>
              </div>
            ))}
          </div>
        </motion.section>

        <Rule />

        {/* ---- FAQ ---------------------------------------------------------- */}
        <motion.section {...rise(0.05)}>
          <SectionLabel index="03">Questions</SectionLabel>
          <div className="flex flex-col max-w-3xl">
            {faq.map((item) => (
              <div key={item.q} className="flex flex-col sm:flex-row gap-2 sm:gap-10 border-t border-border py-6">
                <p className="font-ibm text-xs sm:w-56 shrink-0">{item.q}</p>
                <p className="font-ibm text-sm text-foreground/60 leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </motion.section>

        <footer className="mt-24 flex flex-row items-center justify-between font-ibm text-[11px] text-muted-foreground">
          <span>© 2025 Matthew Park</span>
          <a href="/shop" className="hover:text-foreground transition-colors">← Shop</a>
        </footer>
      </main>
    </div>
  )
}

export default Lut
