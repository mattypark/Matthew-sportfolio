import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import useMagnetic from '../hooks/useMagnetic'
import Globe from './Globe'

export default function Contact() {
  const root = useRef(null)
  const magRef = useMagnetic(0.35, 120)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.c-line', {
        yPercent: 105,
        duration: 1.1,
        ease: 'expo.out',
        stagger: 0.06,
        scrollTrigger: { trigger: root.current, start: 'top 75%' },
      })
      gsap.from('.c-meta > *', {
        y: 16,
        opacity: 0,
        duration: 0.7,
        stagger: 0.05,
        scrollTrigger: { trigger: root.current, start: 'top 70%' },
      })
    }, root)
    return () => ctx.revert()
  }, [])

  const handleCopy = async (e) => {
    e.preventDefault()
    try {
      await navigator.clipboard.writeText('mattyparkbusiness@gmail.com')
    } catch {
      const ta = document.createElement('textarea')
      ta.value = 'mattyparkbusiness@gmail.com'
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  return (
    <section
      id="contact"
      ref={root}
      className="section-dark relative gutter pt-[18vh] pb-[10vh]"
    >
      <div className="grid grid-cols-12 gap-6 items-end">
        {/* Massive type CTA */}
        <div className="col-span-12 md:col-span-8">
          <div className="font-mono text-[11px] tracking-[0.28em] uppercase text-ink/55 mb-6">
            EXCITED TO HEAR FROM YOU &middot; Q? / 2026
          </div>
          <div className="overflow-hidden pb-[0.1em]">
            <div className="c-line font-display text-[clamp(54px,9vw,150px)] leading-[0.9]">
              LET'S
            </div>
          </div>
          <div className="overflow-hidden pb-[0.1em]">
            <div className="c-line font-display text-[clamp(54px,9vw,150px)] leading-[0.9]">
              MAKE
            </div>
          </div>
          <div style={{ overflow: 'hidden', paddingBottom: '0.35em', marginBottom: '-0.15em' }}>
            <div
              className="c-line font-display text-[clamp(54px,9vw,150px)]"
              style={{ lineHeight: 1.25, paddingBottom: '0.25em' }}
            >
              <span style={{ color: 'var(--primary)' }}>SOMETHING</span>{' '}
              <span className="italic-fraunces normal-case font-normal" style={{ fontWeight: 300 }}>
                happen.
              </span>
            </div>
          </div>

          <a
            ref={magRef}
            href="mailto:mattyparkbusiness@gmail.com"
            onClick={handleCopy}
            data-hover
            className="magnetic mt-10 inline-flex items-center gap-3 text-ink border border-ink/40 hover:border-ink px-6 py-4 rounded-full font-mono text-[12px] tracking-[0.22em] uppercase"
          >
            <span style={{ color: 'var(--signal)' }}>●</span>
            {copied ? 'COPIED TO CLIPBOARD' : 'MATTYPARKBUSINESS@GMAIL.COM'}
            <span aria-hidden="true">{copied ? '✓' : '↗'}</span>
          </a>
        </div>

        {/* Right rail: meta block */}
        <div className="col-span-12 md:col-span-4 c-meta flex flex-col gap-8 md:pl-8 md:border-l border-ink/20 self-stretch md:pt-4">
          <div>
            <div className="section-label text-ink/55 mb-2">LOCATION</div>
            <div className="font-display text-[28px] leading-none">LOUISVILLE, KENTUCKY</div>
            <div className="font-mono text-[11px] text-ink/60 mt-1">38.25°N &middot; 85.75°W</div>
            <div className="mt-4" style={{ maxWidth: 200 }}>
              <Globe lat={38.25} lng={-85.75} />
            </div>
          </div>

          <div>
            <div className="section-label text-ink/55 mb-2">CHANNELS</div>
            <ul className="font-mono text-[13px] tracking-[0.1em] uppercase space-y-1.5">
              <li><a data-hover href="https://x.com/MattyparkW" target="_blank" rel="noopener noreferrer" className="hover:text-primary">TWITTER &nearr;</a></li>
              <li><a data-hover href="https://www.linkedin.com/in/matthew-park-487889350/" target="_blank" rel="noopener noreferrer" className="hover:text-primary">LINKEDIN &nearr;</a></li>
              <li><a data-hover href="https://substack.com/@mattyparkk" target="_blank" rel="noopener noreferrer" className="hover:text-primary">SUBSTACK &nearr;</a></li>
              <li><a data-hover href="https://www.youtube.com/@matty_park" target="_blank" rel="noopener noreferrer" className="hover:text-primary">YOUTUBE &nearr;</a></li>
              <li><a data-hover href="https://www.tiktok.com/@mattparxy" target="_blank" rel="noopener noreferrer" className="hover:text-primary">TIKTOK &nearr;</a></li>
              <li><a data-hover href="https://www.instagram.com/matty.park/" target="_blank" rel="noopener noreferrer" className="hover:text-primary">INSTAGRAM &nearr;</a></li>
            </ul>
          </div>

          <div>
            <div className="section-label text-ink/55 mb-2">REPLY TIME</div>
            <div className="font-mono text-[13px] text-ink/85">
              Usually 24HRS. If it's a Saturday, faster.
            </div>
          </div>

          <div>
            <div className="section-label text-ink/55 mb-2">INTERESTED IN</div>
            <ul className="font-mono text-[12px] text-ink/70 space-y-1 leading-snug">
              <li>// talented people chatting for 15 minutes</li>
              <li>// potential partnerships</li>
              <li>// anything that's interesting, always willing to learn from people</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
