import { Link } from 'react-router-dom'
import { SelfDoodle, Brush, DrawnLink } from './Doodles'
import { NAME, EMAIL_SPOKEN, lead, building, cta, socials } from './content'

// Instinct's layout: the doodle top left, one lead paragraph, a paragraph per
// thing he's building, the brushed CTA, and the legal-links row pinned to the
// bottom of the first screen.
export default function Home() {
  const year = new Date().getFullYear()

  return (
    <div className="simple sa">
      <header className="sa-header">
        <a href="/" className="sa-home" aria-label={`${NAME}, home`}>
          <SelfDoodle />
        </a>
      </header>

      <main id="main" className="sa-main">
        <div className="sa-wrapper">
          <div className="sa-intro">
            <h1 className="sa-lead">{lead}</h1>
            <div className="sa-body">
              {building.map((b) => (
                <p key={b.id}>
                  <DrawnLink href={b.href}>{b.name}</DrawnLink> {b.line} {b.more}
                </p>
              ))}
            </div>
          </div>

          <a href={cta.href} className="sa-cta">
            <span className="sa-cta-label">{cta.label}</span>
            <Brush className="sa-cta-brush" />
          </a>
        </div>

        <footer className="sa-legal">
          <p className="sa-legal-copy">
            Copyright © {year} {NAME}
            <Link to="/privacy" className="sa-legal-privacy">
              Privacy
            </Link>
          </p>
          <nav aria-label="Elsewhere" className="sa-legal-nav">
            <ul className="sa-legal-list">
              {socials.map((s) => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
            <p className="sa-legal-email">{EMAIL_SPOKEN}</p>
          </nav>
        </footer>
      </main>
    </div>
  )
}
