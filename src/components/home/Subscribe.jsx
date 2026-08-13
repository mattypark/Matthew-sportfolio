import { useState } from 'react'
import './home.css'

// THE LIST — email required, phone optional, nothing else asked for.
// Posts to /api/subscribe, which relays to the Apps Script webhook and lands a
// row in the Subscribers tab of the sheet.
//
// Note: /api only exists on Vercel. Under `vite dev` this will fail with the
// error state, which is expected — test signups against a preview deployment.

const IDLE = 'idle'
const SENDING = 'sending'
const DONE = 'done'
const ERROR = 'error'

export default function Subscribe() {
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [website, setWebsite] = useState('') // honeypot — humans never see it
  const [status, setStatus] = useState(IDLE)
  const [error, setError] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    if (status === SENDING) return

    setStatus(SENDING)
    setError('')

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, phone, website }),
      })
      const data = await res.json().catch(() => null)

      if (!res.ok || !data?.success) {
        setError(data?.error || 'something broke on my end. try again?')
        setStatus(ERROR)
        return
      }

      setStatus(DONE)
      setEmail('')
      setPhone('')
    } catch {
      setError('no connection. try again?')
      setStatus(ERROR)
    }
  }

  if (status === DONE) {
    return (
      <div className="jr-subscribe jr-subscribe-done" role="status">
        <span className="jr-sub-mark" aria-hidden="true">
          [✓]
        </span>
        <p>
          You&rsquo;re on the list. Next entry lands in your inbox — nothing else, ever.
        </p>
      </div>
    )
  }

  return (
    <form className="jr-subscribe" onSubmit={submit} noValidate>
      <div className="jr-sub-label" id="jr-sub-label">
        Get every entry
      </div>

      <div className="jr-sub-fields">
        <label className="jr-field">
          <span className="jr-field-key">email</span>
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@wherever.com"
            autoComplete="email"
            required
            data-hover
          />
        </label>

        <label className="jr-field">
          <span className="jr-field-key">
            phone <span className="jr-field-opt">optional</span>
          </span>
          <input
            type="tel"
            name="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+1 502 000 0000"
            autoComplete="tel"
            data-hover
          />
        </label>

        <button type="submit" className="jr-sub-btn" data-hover disabled={status === SENDING}>
          {status === SENDING ? 'sending…' : 'join'}
        </button>
      </div>

      {/* honeypot: off-screen, never tabbed into, never autofilled */}
      <label className="jr-honeypot" aria-hidden="true">
        website
        <input
          type="text"
          name="website"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          tabIndex={-1}
          autoComplete="off"
        />
      </label>

      <p className="jr-sub-note">
        {status === ERROR ? (
          <span className="jr-sub-error">{error}</span>
        ) : (
          'One entry whenever I learn something worth passing on. No cadence, no spam, unsubscribe by replying.'
        )}
      </p>
    </form>
  )
}
