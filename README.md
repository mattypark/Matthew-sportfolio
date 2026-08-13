# Matthew Park — Portfolio

The personal site. One gate, two personalities: a quiet editorial side and a loud
creative one — plus a journal that writes itself into an email list.

**Live:** deployed on Vercel from `main`.

---

## The site

| Route | What it is |
|---|---|
| `/` | The gate. Editorial index — text nav, rotating portrait, city clocks, cursor crosshair. |
| `/work` | The quiet side. The ledger of engagements. |
| `/journal` | The writing. Markdown entries → card grid → email list. |
| `/journal/:slug` | One entry. A reading page. |
| `/values` | The operating system, written down. |
| `/loud` | The creative half. One continuous maximalist scroll. |

## The journal

Write a markdown file and push — it's live on the site. Then, when you want it emailed,
one command drafts it in [Kit](https://kit.com) and you press Send.

```
entry.md ──push───────────► Vercel rebuild ──► live at /journal/slug

npm run draft -- <slug> ──► Kit draft ──► press Send
```

Entries are plain markdown in `src/content/journal/` — no CMS, no database. That's
deliberate: a year of these should concatenate into a manuscript, and plaintext is the
only format that will still open in ten years.

Full setup and posting guide: **[JOURNAL.md](JOURNAL.md)**

## Stack

- **React 18** + **Vite** + **React Router 6**
- **Tailwind** for utilities, hand-written CSS for the design system
- **GSAP** (+ ScrollTrigger, MotionPath), **anime.js**, **Framer Motion** for motion
- **Lenis** for smooth scroll
- **three.js** for the 3D pieces
- **Vercel serverless functions** (`api/`) for the contact form and journal signups

Typography: **Fraunces** + **JetBrains Mono** on the quiet side; Archivo Black, Six Caps,
Bodoni Moda, Special Elite and Caveat on the creative side.

## Develop

```bash
npm install
npm run dev        # vite dev server
npm run build      # production build
npm run preview    # serve the build locally
```

Note: `api/*` are Vercel functions and do **not** run under `vite dev`. Test the contact
form and journal signup against a Vercel preview deployment.

## Structure

```
src/
├── components/home/     # the gate, both sides, the journal
├── content/journal/     # entries — plain markdown, one file per post
├── lib/                 # frontmatter parser (shared with the send script)
└── hooks/
api/                     # Vercel serverless functions
scripts/                 # markdown → Kit email pipeline
google-apps-script/      # the Sheets webhook the contact form writes to
```

Agent/collaborator context lives in [CLAUDE.md](CLAUDE.md).
