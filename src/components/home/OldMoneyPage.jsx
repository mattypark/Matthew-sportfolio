import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './home.css'
import './loud-pages.css'

// OLD MONEY — the quiet-luxury wing. A section of the loud home.
// Espresso brown, gold rules, Bodoni small caps. Everything slow and certain.

const HOUSE_RULES = [
  { n: 'I', rule: 'Tennis before noon.' },
  { n: 'II', rule: 'Faith before everything.' },
  { n: 'III', rule: 'Ship quietly. Let the results speak.' },
  { n: 'IV', rule: 'Never explain the grind to people who nap through it.' },
  { n: 'V', rule: 'Family first, always.' },
  { n: 'VI', rule: 'New money energy, old money manners.' },
]

export default function OldMoneyPage() {
  const root = useRef(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = gsap.context(() => {
      // hero letters drift together like a monogram being set —
      // fires when the wing scrolls into view, not on page load
      const heroTl = gsap.timeline({
        scrollTrigger: { trigger: root.current, start: 'top 65%', once: true },
      })
      heroTl
        .fromTo(
          '.om-fade',
          { opacity: 0, y: 26 },
          { opacity: 1, y: 0, duration: 1.1, ease: 'expo.out', stagger: 0.1 },
        )
        .fromTo(
          '.om-letter',
          { opacity: 0, x: (i) => (i % 2 ? 60 : -60), rotateY: 30 },
          { opacity: 1, x: 0, rotateY: 0, duration: 1.4, ease: 'expo.out', stagger: 0.06 },
          '-=0.8',
        )

      // scroll reveals — slow, no bounce, old money doesn't rush
      ScrollTrigger.batch('.om-reveal', {
        start: 'top 86%',
        once: true,
        onEnter: (els) =>
          gsap.fromTo(
            els,
            { opacity: 0, y: 34 },
            { opacity: 1, y: 0, duration: 1.2, ease: 'power2.out', stagger: 0.12 },
          ),
      })

      // crest slowly rotates as the section passes through the viewport
      gsap.to('.om-crest-inner', {
        rotate: 360,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: 1.2 },
      })
    }, root)
    return () => ctx.revert()
  }, [])

  const headline = 'OLD MONEY,'
  const headline2 = 'NEW IDEAS.'

  return (
    <section id="oldmoney" ref={root} className="oldmoney-page">
      <header className="flex min-h-[100svh] flex-col items-center justify-center px-6 py-20 text-center md:px-12">
        <div className="om-fade om-smallcaps text-[clamp(11px,1.1vw,14px)]">
          the quiet-luxury wing
        </div>

        <div className="om-crest om-fade mt-10">
          <div className="om-crest-inner grid place-items-center">
            <span className="font-bodoni text-[clamp(48px,6vw,72px)] leading-none" style={{ color: 'var(--om-gold)' }}>
              MP
            </span>
          </div>
        </div>
        <div className="om-fade om-smallcaps mt-4 text-[clamp(10px,1vw,12px)]">est. mmx</div>

        <h1 className="mt-12 font-bodoni text-[clamp(44px,8vw,130px)] leading-[1.02]" style={{ perspective: '600px' }}>
          {headline.split('').map((ch, i) => (
            <span key={`a${i}`} className="om-letter inline-block">{ch === ' ' ? ' ' : ch}</span>
          ))}
          <br />
          <em className="italic" style={{ color: 'var(--om-gold)' }}>
            {headline2.split('').map((ch, i) => (
              <span key={`b${i}`} className="om-letter inline-block">{ch === ' ' ? ' ' : ch}</span>
            ))}
          </em>
        </h1>

        <p className="om-fade italic-fraunces mt-8 max-w-[46ch] text-[clamp(16px,1.6vw,22px)] leading-[1.7] opacity-80">
          fifteen years old with the taste of a man who has already made it —
          minus the trust fund, plus the work ethic.
        </p>

        <div className="om-rule om-fade mt-14 w-full max-w-[420px] font-bodoni text-[18px]">❖</div>
      </header>

      <section className="mx-auto grid max-w-[1100px] gap-16 px-6 pb-28 md:grid-cols-[0.8fr_1.2fr] md:px-12">
        <figure className="om-reveal om-oval self-start">
          <img src="/about-photo.png" alt="Matthew, portrait" loading="lazy" width="480" height="600" />
          <figcaption className="om-smallcaps mt-4 text-center text-[11px]">
            the young master of the house
          </figcaption>
        </figure>

        <div>
          <h2 className="om-reveal om-smallcaps text-[clamp(13px,1.3vw,16px)]">house rules</h2>
          <ol className="mt-8">
            {HOUSE_RULES.map((r) => (
              <li
                key={r.n}
                className="om-reveal flex items-baseline gap-6 border-b py-5"
                style={{ borderColor: 'rgba(201,169,106,0.25)' }}
              >
                <span className="om-roman text-[clamp(18px,1.8vw,24px)]">{r.n}.</span>
                <span className="font-bodoni text-[clamp(19px,2vw,28px)] leading-snug">{r.rule}</span>
              </li>
            ))}
          </ol>

          <p className="om-reveal italic-fraunces mt-10 text-[clamp(15px,1.5vw,20px)] leading-[1.8] opacity-75">
            &ldquo;the goal was never to look rich. the goal was to build something
            worth inheriting.&rdquo;
          </p>
          <div className="om-reveal mt-6 font-bodoni text-[clamp(22px,2.2vw,30px)]" style={{ color: 'var(--om-gold)' }}>
            — M. Park
          </div>
        </div>
      </section>

      <footer
        className="flex flex-wrap items-center justify-between gap-3 border-t px-6 py-5 md:px-12"
        style={{ borderColor: 'rgba(201,169,106,0.25)' }}
      >
        <span className="om-smallcaps text-[10px]">© mmxxvi · the park estate</span>
        <span className="om-smallcaps text-[10px]">wealth measured in ideas</span>
      </footer>
    </section>
  )
}
