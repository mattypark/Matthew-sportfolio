import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { Crosshair, Clocks } from '../components/site/Chrome'
import Nav from '../components/site/Nav'
import PhotoPile from '../components/site/PhotoPile'
import PixelBall from '../components/site/PixelBall'
import BlockDivider from '../components/site/BlockDivider'
import '../styles/site.css'

// ABOUT — the Eileen Yang structure, Matthew's facts.
// A photo pile on the rail, WHO I AM as short bullets, then MY STORY as
// dated entries marked with a pixel tennis ball instead of her ☆.
// Bullets over paragraphs throughout — that was the explicit ask.

const PHOTOS = [
  '/rotator-5569.jpg',
  '/rotator-5566.jpg',
  '/rotator-5571.jpg',
  '/rotator-5568.jpg',
  '/rotator-5572.jpg',
]

// [lead, tail] — the tail carries its own leading space or punctuation,
// so the bold and the regular never collide.
const WHO = [
  ['Fifteen', ', and building like the clock is loud.'],
  ['Korean-American, born in Kentucky', ' — an outsider long enough to stop trying to fit in.'],
  ['Founder of Axiom', ' — a nonprofit putting high schoolers inside real startups.'],
  ['30M+ views', ' made on a phone, mostly at night.'],
  ['Tennis since nine', ' — varsity, and still the best hour of the day.'],
  ['Saxophone, piano, drums, guitar', ' — badly, enthusiastically, in that order.'],
  ['God first', '. Everything after that is a rounding error.'],
  ['Aimed at Stanford, SF, NYC', ' — academics earns the room, building fills it.'],
]

const STORY = [
  {
    when: '2026',
    head: 'Running Axiom, and shipping every week',
    points: [
      'Axiom Pathways — 550+ interns placed across 10+ startups. AI does the matching; the mission is global.',
      'Accepted to Stanford ASES Launchpad.',
      'BayouGuard — Houston flood-risk app for the Congressional App Challenge.',
      'Built at the Microsoft × Coinbase × Tavily event.',
      'Started the journal. In a year it should be a book.',
    ],
  },
  {
    when: '2026',
    head: 'The agents year',
    points: [
      'Bery — a personal CRM that writes the profile for you.',
      'SlapShift, Hand Vocoder, Fits, Baseline — shipped, small, real.',
      'Instagram past 13K. The marketing triangle: AI + CS + content.',
    ],
  },
  {
    when: '2025',
    head: 'PrayerLock, and learning what revenue means',
    points: [
      'CMO and cofounder. Scaled it 7× — $2k MRR into $14k.',
      'Ran a web design agency on the side.',
      'Found out a product nobody pays for is a hobby.',
    ],
  },
  {
    when: '2024',
    head: 'Competing, and finding the voice',
    points: [
      'Speech & Debate — qualified state, first in Impromptu Sales.',
      'Science fair — National Sustainable Development Award (LRSEF), first in ESGD.',
      'Learned that talking well is a build tool, not a personality.',
    ],
  },
  {
    when: '2020',
    head: 'Minecraft, and the first thing I made on purpose',
    points: [
      'Redstone before functions. It counted.',
      'Started to see everything as blocks you could take apart.',
    ],
  },
  {
    when: '2015',
    head: 'A racket, at nine',
    points: [
      'Tennis. Still the discipline underneath everything else.',
      'Louisville, Kentucky — the beginning of the running joke.',
    ],
  },
]

export default function About({ onLeave }) {
  const root = useRef(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.pg-reveal',
        { y: 22, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.95, ease: 'power3.out', stagger: 0.05, delay: 0.12 },
      )
      // story entries arrive as you reach them, not all at once
      gsap.utils.toArray('.ab-year, .ab-sub').forEach((el) => {
        gsap.fromTo(
          el,
          { y: 16, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 88%' },
          },
        )
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={root} className="pg">
      <Nav onLeave={onLeave} />

      <header className="ab-head">
        <h1 className="display ab-title pg-reveal">ABOUT</h1>
      </header>

      <div className="ab-grid">
        <aside className="ab-rail pg-reveal">
          <span className="eyebrow">My story</span>
          <PhotoPile photos={PHOTOS} size={230} />
        </aside>

        <div>
          <span className="eyebrow pg-reveal" style={{ display: 'block', marginBottom: 18 }}>
            Who I am
          </span>

          <ul className="ab-who">
            {WHO.map(([bold, rest]) => (
              <li key={bold} className="pg-reveal">
                <PixelBall size={16} />
                <span>
                  <b>{bold}</b>
                  {rest}
                </span>
              </li>
            ))}
          </ul>

          <BlockDivider label="see a bit of the story below" />

          <div className="ab-story">
            {STORY.map((entry) => (
              <section key={`${entry.when}-${entry.head}`}>
                <h2 className="ab-year">
                  <PixelBall size={17} />
                  <span>
                    <span className="ab-when">{entry.when}</span>
                    {entry.head}
                  </span>
                </h2>
                <ul className="ab-sub">
                  {entry.points.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              </section>
            ))}
          </div>

          <div className="foot-rail">
            <span className="eyebrow">Louisville,&nbsp;[KY] — aimed elsewhere</span>
            <span className="eyebrow">
              <a href="mailto:matthew.parkk0@gmail.com" data-hover>
                matthew.parkk0@gmail.com
              </a>
            </span>
          </div>
        </div>
      </div>

      <Clocks />
      <Crosshair />
    </div>
  )
}
