// /lut/thanks in the case file's dress. Stripe's Payment Link lands here with
// ?session_id=…; the download is still gated server-side by api/lut-download.js,
// which checks the session against Stripe before handing over the file. Same
// logic and words as the old page (src/oldschool/components/LutThanks.jsx):
// there is no follow-up email, so the page says so plainly.

import { useEffect, useRef, useState } from 'react'
import { GoLink } from '../ui/transition.jsx'
import { startVolumeMotion } from '../volume/motion.js'
import { contact, product } from '../../oldschool/data/lut.js'
import { Swatches } from './parts.jsx'

export default function LutThanksPage() {
  const root = useRef(null)
  const [sessionId, setSessionId] = useState('')
  useEffect(() => {
    setSessionId(new URLSearchParams(window.location.search).get('session_id') || '')
  }, [])
  useEffect(() => startVolumeMotion(root.current), [])

  return (
    <main className="vol lut lut--thanks" ref={root}>
      <div className="vol__in">
        <header className="vol__rule">
          <span className="vol__kicker">{product.lot}</span>
          <span className="vol__issue">Paid</span>
        </header>

        <section className="lut-thanks">
          <div className="vol__title">
            <h1>Thank you.</h1>
            <Swatches className="vol__strip lut__strip" />
            <p className="lut-thanks__body">
              {product.name} is yours. Download it now and put it somewhere you will find it again. This is the only
              copy you get, and there is no email following it.
            </p>

            {sessionId ? (
              <a className="lut-buy" href={`/api/lut-download?session_id=${encodeURIComponent(sessionId)}`}>
                <span>Download the .cube</span>
                <b aria-hidden="true">↓</b>
              </a>
            ) : (
              <p className="lut-thanks__warn">
                No receipt on this link. If you paid and landed here, email{' '}
                <a href={`mailto:${contact.email}`}>{contact.email}</a> and I will send the file straight over.
              </p>
            )}

            <p className="lut-thanks__note">
              Lost it, or the download failed? Email <a href={`mailto:${contact.email}`}>{contact.email}</a> with the
              receipt Stripe sent you and I will send it straight over.
            </p>

            <GoLink to="/lut" className="lut-thanks__back">
              Back to the LUT
            </GoLink>
          </div>
        </section>
      </div>
    </main>
  )
}
