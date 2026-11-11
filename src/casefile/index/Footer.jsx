// The way out, Wimbledon whites: green speed bands sweep a white page in from
// the right, and the layout is the reference's footer, position for position.
// The white moves: drifting green and optic-yellow light, and a glow with a
// grass-dot grid that follows the ball. The title is the opening's name lockup again, rewriting itself once the
// page lands; the band is a grass court in hairline with a ball rallying
// across the middle of it.

import { forwardRef, useImperativeHandle, useMemo, useRef } from 'react'
import { GoLink } from '../ui/transition.jsx'
import { PlusMark } from '../ui/Bar.jsx'
import { SocialIcon } from '../ui/SocialIcon.jsx'
import { EMAIL, contactLabel, footer, skills, socials, title } from '../content.js'

const NAV = [
  { to: '/', label: 'Index' },
  { to: '/gallery', label: 'Gallery' },
]

const IN_AT = 0.6 // share of the sweep after which the title starts writing

// A/B (his rule 30): A has the skills in the side ledger only (desktop); B also lists them here, for phones too.
const SKILLS_IN_FOOTER = new URLSearchParams(window.location.search).get('skills') === 'b'

// Phones fit seven bars only with short names (index.css swaps them under 720px).
const SHORT = { Instagram: 'IG', TikTok: 'TT', YouTube: 'YT', X: 'X', GitHub: 'GH', LinkedIn: 'IN' }

// A doubles court from above, in the band's own 1400 x 170 units.
function Court({ moving }) {
  return (
    <svg className="ftr__court" viewBox="0 0 1400 170" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      {/* inset from the band's edges so the links and squares sit on grass */}
      <g className="ftr__lines">
        <rect x="230" y="30" width="940" height="120" />
        <line x1="230" y1="44" x2="1170" y2="44" />
        <line x1="230" y1="136" x2="1170" y2="136" />
        <line x1="470" y1="44" x2="470" y2="136" />
        <line x1="930" y1="44" x2="930" y2="136" />
        <line x1="470" y1="90" x2="930" y2="90" />
        <line className="ftr__net" x1="700" y1="22" x2="700" y2="158" />
      </g>
      {/* the rally, kept inside the court: deep cross-court, back down the line */}
      <path id="ftr-rally" className="ftr__path" d="M290 118 Q700 46 1110 70 Q700 138 290 118" />
      <g className="ftr__ball" transform={moving ? undefined : 'translate(700 90)'}>
        <circle r="9" />
        <path d="M-6.5 -5.5 C-2 -2 -2 2 -6.5 5.5 M6.5 -5.5 C2 -2 2 2 6.5 5.5" />
        {moving && (
          <animateMotion dur="3.6s" repeatCount="indefinite" rotate="auto">
            <mpath href="#ftr-rally" />
          </animateMotion>
        )}
      </g>
    </svg>
  )
}

function Letters({ text, from }) {
  return [...text].map((ch, i) => (
    <span key={i} style={{ '--k': from + i }}>
      {ch}
    </span>
  ))
}

const Footer = forwardRef(function Footer(_props, ref) {
  const root = useRef(null)
  const moving = useMemo(() => !window.matchMedia('(prefers-reduced-motion: reduce)').matches, [])

  useImperativeHandle(ref, () => ({
    // clip: the speed-band clip-path; level: how far the bands have come
    // mx, my: the pointer in px, for the glow and the dot grid
    pointer(mx, my) {
      root.current?.style.setProperty('--mx', `${mx}px`)
      root.current?.style.setProperty('--my', `${my}px`)
    },
    update(clip, level) {
      const el = root.current
      if (!el) return
      el.style.visibility = level > 0 ? 'visible' : 'hidden'
      if (level <= 0) return
      el.style.clipPath = clip
      // once the title has written itself it stays written: toggling this
      // back off near the threshold restarted every letter
      if (level > IN_AT) el.classList.add('is-in')
      el.classList.toggle('is-open', level > 0.98)
    },
  }))

  return (
    <footer className="ftr cf-ui" ref={root}>
      <span className="ftr__sky" aria-hidden="true" />
      <span className="ftr__glow" aria-hidden="true" />
      <span className="ftr__dots" aria-hidden="true" />
      <h2 className="ftr__title">
        <span className="ftr__lockup">
          <span className="ftr__sign">{title.first}</span>
          <span className="ftr__last">
            <Letters text={title.last} from={0} />
          </span>
        </span>
      </h2>

      <div className="ftr__band">
        <Court moving={moving} />
        <span className="ftr__sq ftr__sq--tl" />
        <span className="ftr__sq ftr__sq--tr" />
        <span className="ftr__sq ftr__sq--bl" />
        <nav className="ftr__nav" aria-label="Rooms">
          {NAV.map((n) => (
            <GoLink key={n.to} to={n.to} className="ftr__navi">
              {n.label}
              <PlusMark />
            </GoLink>
          ))}
        </nav>
      </div>

      <div className="ftr__bars">
        {socials.map((s) => (
          <a className="ftr__bar" key={s.label} href={s.href} target="_blank" rel="noreferrer" aria-label={s.label}>
            <span className="ftr__full">{s.label}</span>
            <span className="ftr__short" aria-hidden="true">{SHORT[s.label] ?? s.label}</span>
          </a>
        ))}
        <a className="ftr__bar" href={`mailto:${EMAIL}`}>
          {contactLabel}
        </a>
      </div>

      <div className="ftr__handles">
        {socials.map((s) => (
          <a className="ftr__handle" key={s.label} href={s.href} target="_blank" rel="noreferrer" aria-label={`${s.label}: ${s.handle}`}>
            <SocialIcon name={s.label} size={18} />
            <span className="ftr__handle-txt cf-mono">{s.handle}</span>
          </a>
        ))}
        <span className="ftr__handle" aria-hidden="true" />
      </div>

      <p className="ftr__lbl ftr__project">{footer.left[0][0]}</p>
      <p className="ftr__lbl ftr__no cf-mono">{footer.left[0][1]}</p>
      <p className="ftr__lbl ftr__slash">//</p>
      <div className="ftr__aside">
        {footer.left[1][1].split('\n').map((l) => (
          <p key={l}>{l}</p>
        ))}
      </div>
      <div className="ftr__ref">
        <p className="cf-mono">000</p>
        <p>//</p>
      </div>

      <div className="ftr__notes">
        {footer.notes.map((note, i) => (
          <div className="ftr__note" key={note}>
            <p className="ftr__n">{i + 1}</p>
            <div>
              {note.split('\n').map((l) => (
                <p key={l}>{l}</p>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="ftr__where">
        <p className="ftr__n">0</p>
        <div>
          <p>{footer.right[0]}</p>
          <p>{footer.right[1]}</p>
        </div>
      </div>

      {SKILLS_IN_FOOTER && (
        <div className="ftr__skills">
          <p className="ftr__skills-h">Code</p>
          <p>{skills.code.map(([what]) => what).join(' · ')}</p>
          <p className="ftr__skills-h">Good at</p>
          <p>{skills.good.map(([what]) => what).join(' · ')}</p>
        </div>
      )}

      <p className="ftr__lbl ftr__copy">{footer.rights}</p>
    </footer>
  )
})

export default Footer
