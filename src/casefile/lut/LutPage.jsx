// /lut in the case file's dress (his ask, 2026-11-15: people buy here, make it
// fit the site). The Volume cover's grammar: the rule and lot number, the worn
// number, the title block with the grade's swatches, tone curves where Volume
// has its map, the stamp, then the before/after where Volume has its photo,
// and the install notes, questions and spec card underneath.
//
// Every fact, price and link comes from src/oldschool/data/lut.js, the same
// file the old page read, so the Stripe link and the thank-you flow
// (/lut/thanks → api/lut-download.js) are untouched.

import { useEffect, useRef } from 'react'
import { BallMark } from '../ui/Loader.jsx'
import { Barcode, Stamp } from '../volume/parts.jsx'
import { startVolumeMotion } from '../volume/motion.js'
import { contact, conversions, faq, install, product } from '../../oldschool/data/lut.js'
import { BuyButton, GRADE, LutCompare, Swatches, ToneCurves } from './parts.jsx'
import { NAME } from '../content.js'

const LOT = product.lot.replace(/\D/g, '').padStart(3, '0')
const PROFILE = product.builtFor.join(' · ')
const SPEC = `${PROFILE} → ${product.colorSpace} · ${product.format} · ${product.size}`

export default function LutPage() {
  const root = useRef(null)
  useEffect(() => startVolumeMotion(root.current), [])
  const shot = conversions[0]
  return (
    <main className="vol lut" ref={root}>
      <div className="vol__in">
        <header className="vol__rule">
          <span className="vol__kicker">LUT</span>
          <span className="vol__issue">
            Lot {LOT}
            <i className="vol__issue-bar lut__issue-bar" aria-hidden="true">
              <b />
              <b />
            </i>
          </span>
        </header>

        <section className="vol__hero">
          <p className="vol__num" aria-label={product.lot}>
            {LOT}
          </p>
          <div className="vol__title">
            <h1>Cinematic LUT</h1>
            <p className="vol__coords">{SPEC}</p>
            <Swatches className="vol__strip lut__strip" labels />
            <p className="vol__tag">
              Log in. Graded out.
              <br />
              The grade I use on everything.
            </p>
            <div className="lut__price">
              <span className="lut__amount">${product.price}</span>
              <BuyButton />
            </div>
          </div>
          <ToneCurves className="vol-map lut-curves" />
          <Stamp id="lut" top="Matthew + Park" bottom="LUT edition" inner={`${PROFILE} · ${product.colorSpace}`} mark="LUT" />
        </section>

        <section className="vol__media">
          <div className="vol__column" aria-hidden="true">
            <Swatches className="lut__column" colors={[...GRADE].reverse()} offset={GRADE.length} />
            <BallMark className="vol__ball lut__ball" />
          </div>
          {shot && <LutCompare before={shot.before} after={shot.after} label={shot.label} note={shot.note} />}
        </section>

        <section className="vol__foot">
          <div className="vol__fact lut__notes">
            <h2>Install</h2>
            <dl className="lut__ledger">
              {install.map((row) => (
                <div key={row.app}>
                  <dt>{row.app}</dt>
                  <dd>{row.steps}</dd>
                </div>
              ))}
            </dl>
            <h2 className="lut__q">Questions</h2>
            <dl className="lut__ledger">
              {faq.map((row) => (
                <div key={row.q}>
                  <dt>{row.q}</dt>
                  <dd>{row.a}</dd>
                </div>
              ))}
            </dl>
            <p className="lut__contact">
              Something wrong? <a href={`mailto:${contact.email}`}>{contact.email}</a>
            </p>
          </div>

          <div className="vol-card lut-card">
            <div className="vol-card__left">
              <div className="vol-card__row">
                <p className="vol-card__strong">Built for {PROFILE}</p>
                <p className="vol-card__soft">Shoot log, expose right, apply</p>
              </div>
              <div className="vol-card__row">
                <p className="vol-card__coords">
                  {product.format} · {product.size} · {product.colorSpace}
                </p>
                <p className="vol-card__soft">{product.lot}</p>
                <p className="vol-card__soft">
                  ${product.price} {product.currency}
                </p>
              </div>
              <div className="vol-card__row">
                <BuyButton className="lut-buy--card" />
              </div>
            </div>
            <div className="vol-card__right">
              <p className="vol-card__sign">{NAME}</p>
              <div className="vol-card__brand">
                <div>
                  <p className="vol-card__mark">
                    Matthew <span>+</span> Park
                  </p>
                  <p className="vol-card__line">One .cube, one click</p>
                </div>
                <Barcode seed={`${product.lot}${product.price}`} />
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
