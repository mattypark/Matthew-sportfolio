// Volume: his reference's lofi drive-video cover (2026-11-15) rebuilt as a page,
// with his photo where the car was, his facts for the copy and the case file's
// colours. Same grid, type and parts: the rule and volume number up top, the big
// worn number, the title block with a swatch strip, the world map and the round
// stamp, the swatch column beside the picture, then the fact and the spec card.
//
// A is the reference's paper cover; B (?volume=b) is the same cover at night.

import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { BallMark } from '../ui/Loader.jsx'
import WorldMap from './WorldMap.jsx'
import { Barcode, Flag, Stamp } from './parts.jsx'
import { volume as v } from './copy.js'
import { startVolumeMotion } from './motion.js'

/// The reference's two swatch runs, picked out of the photo the way the
/// reference picks its car's: the platform ceiling, the sweater's brown-black,
/// the brushed steel, the pale station sign, and a little light blue from the
/// patch on 5067's door window and the 4 / 6 sign (sampled from subway.webp).
const PHOTO_COLORS = [
  { name: 'ceiling', hex: '#0e0f17' },
  { name: 'sweater', hex: '#39312c' },
  { name: 'steel', hex: '#83694d' },
  { name: 'sign', hex: '#b8b89d' },
  { name: 'window', hex: '#8fbcc6' },
]
const STRIP = PHOTO_COLORS
const COLUMN = [...PHOTO_COLORS].reverse()

export default function VolumePage() {
  const { search } = useLocation()
  const night = new URLSearchParams(search).get('volume') === 'b'
  const root = useRef(null)
  useEffect(() => startVolumeMotion(root.current), [])
  return (
    <main className={`vol${night ? ' vol--night' : ''}`} ref={root}>
      <div className="vol__in">
        <header className="vol__rule">
          <span className="vol__kicker">{v.kicker}</span>
          <span className="vol__issue">
            {v.number}
            <i className="vol__issue-bar" aria-hidden="true">
              <b />
              <b />
            </i>
          </span>
        </header>

        <section className="vol__hero">
          <p className="vol__num" aria-label={`Volume ${v.number}`}>
            {v.number}
          </p>
          <div className="vol__title">
            <h1>{v.name}</h1>
            <p className="vol__coords">{v.coords}</p>
            <div className="vol__strip" aria-hidden="true">
              {STRIP.map((c, i) => (
                <span key={c.name} className="sw" style={{ '--i': i, '--c': c.hex }}>
                  <em>{c.hex}</em>
                </span>
              ))}
            </div>
            <p className="vol__tag">
              {v.tagline[0]}
              <br />
              {v.tagline[1]}
            </p>
          </div>
          <WorldMap pin={v.pin} className="vol-map" />
          <Stamp {...v.stamp} />
        </section>

        <section className="vol__media">
          <div className="vol__column" aria-hidden="true">
            {COLUMN.map((c, i) => (
              <span key={c.name} className="sw" style={{ '--i': i + PHOTO_COLORS.length, '--c': c.hex }} />
            ))}
            <BallMark className="vol__ball" />
          </div>
          <figure className="vol__photo">
            <img
              src={v.photo.src}
              srcSet={v.photo.srcSet}
              sizes="(max-width: 600px) 100vw, 86vw"
              width={v.photo.w}
              height={v.photo.h}
              alt={v.photo.alt}
              decoding="async"
            />
          </figure>
        </section>

        <section className="vol__foot">
          <div className="vol__fact">
            <h2>{v.factTitle}</h2>
            <p>{v.fact}</p>
          </div>
          <SpecCard />
        </section>
      </div>
    </main>
  )
}

function SpecCard() {
  const c = v.card
  return (
    <div className="vol-card">
      <div className="vol-card__left">
        <div className="vol-card__row">
          <p className="vol-card__strong">{c.built}</p>
          <p className="vol-card__soft">{c.series}</p>
        </div>
        <div className="vol-card__row vol-card__row--flag">
          <div>
            <p className="vol-card__coords">{v.coords}</p>
            <p className="vol-card__soft">{c.archive[0]}</p>
            <p className="vol-card__soft">{c.archive[1]}</p>
          </div>
          <Flag />
        </div>
      </div>
      <div className="vol-card__right">
        <p className="vol-card__sign">{c.sign}</p>
        <div className="vol-card__brand">
          <div>
            <p className="vol-card__mark">
              {c.mark[0]} <span>+</span> {c.mark[1]}
            </p>
            <p className="vol-card__line">{c.line}</p>
          </div>
          <Barcode seed={v.coords} />
        </div>
      </div>
    </div>
  )
}
