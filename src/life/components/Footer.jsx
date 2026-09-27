import { useState } from 'react'
import { EMAIL, socials } from '../data/site'

const BUILT_AT = typeof __BUILD_TIME__ !== 'undefined' ? new Date(__BUILD_TIME__) : new Date()

export default function Footer() {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      window.location.href = `mailto:${EMAIL}`
    }
  }

  return (
    <footer id="contact" className="foot" aria-labelledby="foot-title">
      <p className="sec-index">07 / Say hi</p>
      <h2 id="foot-title" className="foot__title">
        Let&apos;s build <em className="serif-em">something</em>
        <br />
        ambitious<span className="red">.</span>
      </h2>

      <div className="foot__row">
        <button type="button" className="foot__email" onClick={copy}>
          <span>{EMAIL}</span>
          <span aria-hidden>{copied ? '✓ copied' : '→'}</span>
        </button>
        <span className="sr-only" aria-live="polite">
          {copied ? 'Email copied' : ''}
        </span>
      </div>

      <ul className="foot__socials">
        {socials.map((s) => (
          <li key={s.id}>
            <a href={s.href} target="_blank" rel="noopener noreferrer" className="mono">
              {s.label} ↗
            </a>
          </li>
        ))}
      </ul>

      <div className="colophon">
        <div>
          <p className="mono colophon__h">Stack</p>
          <p>React + Vite. GSAP, anime.js, Lenis. Hand-rolled text pressure.</p>
        </div>
        <div>
          <p className="mono colophon__h">Type</p>
          <p>Cherry Bomb One · Gveret Levin · SF Pro · Jua. A custom face is on the way.</p>
        </div>
        <div>
          <p className="mono colophon__h">Small print</p>
          <p>Every number on this page is real. The red marks are on purpose.</p>
        </div>
        <div>
          <p className="mono colophon__h">Last updated</p>
          <p>
            <time dateTime={BUILT_AT.toISOString()}>
              {BUILT_AT.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </time>
          </p>
        </div>
      </div>

      <p className="foot__ghost" aria-hidden>
        MATTHEW
      </p>
      <p className="foot__legal mono">© Doing everything since 2010 · Matthew Park</p>
    </footer>
  )
}
