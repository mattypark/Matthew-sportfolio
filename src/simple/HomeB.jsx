import { SelfDoodle, DrawnLink } from './Doodles'
import { NAME, EMAIL, EMAIL_SPOKEN, building, about, before, socials } from './content'

// B: Noah Shinn's page, written by hand. Plain document order (name, photo,
// Contact, Building, About, Before), default-ish HTML rhythm, every word in
// Poor Story, and the stick figure standing next to the real photo.
export default function HomeB() {
  const year = new Date().getFullYear()

  return (
    <div className="simple sb">
      <main id="main" className="sb-doc">
        <h1 className="sb-name">{NAME}</h1>

        <div className="sb-portrait">
          <img
            className="sb-photo"
            src="/headshot-400.jpg"
            alt="Matthew Park, black and white headshot"
            width="400"
            height="400"
            fetchpriority="high"
          />
          <SelfDoodle className="sb-doodle" />
        </div>

        <section className="sb-section" aria-labelledby="sb-contact">
          <h2 id="sb-contact">Contact</h2>
          <p>
            Born in Kentucky, eyes on San Francisco
            <br />
            Email: <DrawnLink href={`mailto:${EMAIL}`}>{EMAIL_SPOKEN}</DrawnLink>
          </p>
          <ul className="sb-inline">
            {socials.map((s) => (
              <li key={s.label}>
                <DrawnLink href={s.href}>{s.label}</DrawnLink>
              </li>
            ))}
          </ul>
        </section>

        <section className="sb-section" aria-labelledby="sb-building">
          <h2 id="sb-building">Building</h2>
          <ul className="sb-list">
            {building.map((b) => (
              <li key={b.id}>
                <strong className="sb-title">{b.name}</strong>
                <span className="sb-meta">
                  {b.kind}, since {b.since}
                </span>
                <span className="sb-blurb">{b.blurb}</span>
                <span className="sb-links">
                  {b.links.map((l) => (
                    <DrawnLink key={l.href} href={l.href}>
                      {l.label}
                    </DrawnLink>
                  ))}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="sb-section" aria-labelledby="sb-about">
          <h2 id="sb-about">About</h2>
          <p>{about}</p>
        </section>

        <section className="sb-section" aria-labelledby="sb-before">
          <h2 id="sb-before">Before</h2>
          <ul className="sb-list sb-list--plain">
            {before.map((b) => (
              <li key={b.name}>
                <strong className="sb-title">{b.name}</strong>: {b.line}
              </li>
            ))}
          </ul>
        </section>

        <footer className="sb-foot">
          <p>
            © {year} {NAME}
          </p>
        </footer>
      </main>
    </div>
  )
}
