import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { SelfDoodle, DrawnLink } from './Doodles'
import { NAME, EMAIL, EMAIL_SPOKEN } from './content'

// Plain-words privacy page, same layout as the home page. Every line maps to
// something the code does: src/analytics.js (PostHog), main.jsx (Vercel
// Analytics), the LUT's Stripe link + api/stripe-webhook.js (Resend), and the
// cal.com booking link on /call. Change this page when any of those change.
const UPDATED = '3 October 2026'

const sections = [
  {
    title: 'Analytics',
    body: 'PostHog and Vercel Analytics count page views, where visitors came from, clicks and time on the page. No session recordings, no ads, and nothing is sold. PostHog keeps an anonymous id in your browser’s local storage so a repeat visit counts once.',
  },
  {
    title: 'Email',
    body: 'If you email me, I get your address and what you wrote, and I use them to write back.',
  },
  {
    title: 'Buying the LUT',
    body: 'Payment runs on Stripe, so I never see your card. Stripe passes me your email address so the file can be sent to you, and Resend delivers that email.',
  },
  {
    title: 'Booking a call',
    body: 'Calls are booked on cal.com, under their privacy policy.',
  },
]

export default function Privacy() {
  useEffect(() => {
    document.title = `Privacy · ${NAME}`
    return () => {
      document.title = NAME
    }
  }, [])

  return (
    <div className="simple sa">
      <header className="sa-header sa-header--row">
        <Link to="/" className="sa-home" aria-label={`${NAME}, home`}>
          <SelfDoodle />
        </Link>
        <Link to="/" className="sa-back">
          Back
        </Link>
      </header>

      <main id="main" className="sa-main">
        <div className="sa-intro">
          <h1 className="sa-lead">Privacy</h1>
          <div className="sa-body">
            <p>This site is one page. Here is everything it collects, and why.</p>
            {sections.map((s) => (
              <p key={s.title}>
                <span className="sa-pressed">{s.title}.</span> {s.body}
              </p>
            ))}
            <p>
              Want something deleted, or have a question? Email{' '}
              <DrawnLink href={`mailto:${EMAIL}`}>{EMAIL_SPOKEN}</DrawnLink>.
            </p>
            <p className="sa-updated">Last updated {UPDATED}.</p>
          </div>
        </div>
      </main>
    </div>
  )
}
