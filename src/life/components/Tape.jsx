import { Fragment, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Slot from './Slot'
import { timeline, CHAPTERS, stamp, yearOf, todayStamp } from '../data/timeline'
import { prefersReducedMotion } from '../hooks/motion'

gsap.registerPlugin(ScrollTrigger)

const past = timeline.filter((e) => !e.plan)
const future = timeline.filter((e) => e.plan)

function Card({ e, i }) {
  const Tag = e.link ? 'a' : 'article'
  const linkProps = e.link
    ? { href: e.link, ...(e.link.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {}) }
    : {}
  return (
    <Tag className={`tape__card ${e.big ? 'tape__card--big' : ''} ${e.plan ? 'tape__card--plan' : ''}`} {...linkProps}>
      {e.big && e.slot && <Slot id={e.slot} className="tape__media" sizes="420px" />}
      <p className="tape__meta mono">
        <span className={`chip chip--${e.chapter}`}>{CHAPTERS[e.chapter]}</span>
        <span>{e.plan ? 'someday' : stamp(e.date)}</span>
        <span className="tape__no">#{String(i + 1).padStart(3, '0')}</span>
      </p>
      <h3 className="tape__title">
        {e.title}
        {e.link && <span className="tape__arrow"> ↗</span>}
      </h3>
      {e.note && <p className="tape__note">{e.note}</p>}
    </Tag>
  )
}

// The life tape: every dated moment, left to right. On desktop vertical
// scroll drives the track sideways (pinned); on small screens it's a column.
export default function Tape() {
  const root = useRef(null)
  const track = useRef(null)

  useEffect(() => {
    const mm = gsap.matchMedia()
    mm.add('(min-width: 900px) and (prefers-reduced-motion: no-preference)', () => {
      const distance = () => track.current.scrollWidth - window.innerWidth
      const tween = gsap.to(track.current, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: root.current,
          pin: true,
          scrub: 0.8,
          start: 'top top',
          end: () => `+=${distance()}`,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            gsap.set('.tape__playhead', { scaleX: self.progress })
            const year = root.current.querySelector('.tape__year-now')
            if (year) {
              const all = track.current.querySelectorAll('.tape__year')
              let current = all[0]?.dataset.year
              all.forEach((y) => {
                if (y.getBoundingClientRect().left < window.innerWidth * 0.5) current = y.dataset.year
              })
              year.textContent = current
            }
          },
        },
      })
      gsap.utils.toArray('.tape__card--big .tape__media').forEach((m) => {
        gsap.fromTo(
          m,
          { clipPath: 'inset(12% 12% 12% 12%)' },
          {
            clipPath: 'inset(0% 0% 0% 0%)',
            ease: 'none',
            scrollTrigger: { trigger: m, containerAnimation: tween, start: 'left 95%', end: 'left 45%', scrub: true },
          },
        )
      })
    })
    return () => mm.revert()
  }, [])

  let lastYear = null

  return (
    <section id="tape" ref={root} className="tape sec--paper" aria-labelledby="tape-title">
      <div className="tape__head">
        <p className="sec-index">02 / The tape</p>
        <h2 id="tape-title" className="sec-title">
          Every step, <em className="serif-em">in order.</em>
        </h2>
        <p className="tape__count mono">
          {past.length} moments · 2010 → <span className="tape__year-now">2010</span>
        </p>
      </div>

      <div ref={track} className="tape__track">
        {past.map((e, i) => {
          const y = yearOf(e)
          const newYear = y !== lastYear
          lastYear = y
          return (
            <Fragment key={`${e.date}-${e.title}`}>
              {newYear && (
                <div className="tape__year" data-year={y} aria-hidden>
                  {y}
                </div>
              )}
              <Card e={e} i={i} />
            </Fragment>
          )
        })}

        <div className="tape__now" aria-label="Today">
          <span className="dot dot--red dot--pulse" aria-hidden />
          <p className="mono">Now · {todayStamp()}</p>
          <p className="tape__now-q">???</p>
        </div>

        {future.map((e, i) => (
          <Card key={e.title} e={e} i={past.length + i} />
        ))}
        <div className="tape__end mono" aria-hidden>
          to be continued →
        </div>
      </div>

      <div className="tape__ruler" aria-hidden>
        <span className="tape__playhead" />
      </div>
    </section>
  )
}
