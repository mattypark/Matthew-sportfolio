# Redesign 2026 — the life archive (branch `redesign-2026`)

The site is now `src/life/` (entry: `src/main.jsx` → `LifeApp`). The reference library it came from is
`~/Downloads/current-projects/portfolio-refs` (screenshots, notes, 93 component prompts). Component ids below
match `portfolio-refs/COMPONENTS.md`.

Nothing is pushed or deployed. Every step is committed on `redesign-2026`.

## Round 3 — the whiteboard (current home)

`/` is now a whiteboard with four Friday Night Funkin'-arrow boxes (`src/life/board/`). Opening a box floods the
screen with its color bottom → top (GSAP liquid, `board/liquid.js`), then the content reveals piece by piece; closing
drains it back. Arrow keys open the matching box, Esc closes. Each box has its own URL, so back/forward and deep links work.

| Box | Key | Color | URL | Panel |
|---|---|---|---|---|
| Timeline | ← | purple `#cc57a3` | `/timeline` | big moments, past projects, doors to `/tape`, GitHub, `/archive` |
| Right now | ↓ | cyan `#00c3ff` | `/now` | Terac, WAP, content (`data/now.js` — placeholder copy, edit it) |
| Contact | ↑ | green `#12d82a` | `/contact` | email (click to copy), socials, shop |
| Personality | → | red `#f9393f` | `/personality` | placeholder: CORTIS chip, off-the-clock chips, first 6 values |

Round 3b (Matthew's notes): the board is just the name, 박성호, the note and four smaller centered boxes, each with a random
±1°/±2° tilt per visit. Hovering or focusing a box lifts it and shows a live preview; the other three fade, shrink
and lean away. Removed: photos, subtitle, "the long version", the CORTIS chip on the board, and the shop (the `/shop`
URL redirects home; `/lut` and `/call` still work for past buyers but nothing links to them).

The previous long-scroll page lives on at `/archive`, and `/tape` stays. Old `/values` → `/personality`,
`/projects` → `/timeline`. Waiting on Matthew: the GitHub example he mentioned (to fold into the transitions), real
copy for Terac / WAP / the 30K figure, and what Personality should hold.

## /archive — the round-2 long page (top → bottom)

| # | Section | File |
|---|---|---|
| — | Loader 000 → 100, once per session | `components/Loader.jsx` |
| — | Top bar (no monogram) + circle-reveal index menu; works from /tape too | `components/TopBar.jsx` |
| hero | MATTHEW PARK 박성호, squish-on-hover name, red sun, photos, clocks, typewriter, CORTIS "on repeat" chip | `components/Hero.jsx`, `TextPressure.jsx`, `NowPlaying.jsx` |
| 01 | Why — manifesto, words ink in on scroll | `components/Manifesto.jsx` |
| 02 | Tape teaser — latest 4 moments + link to /tape | `components/TapeTeaser.jsx` |
| — | Velocity marquee divider | `components/Marquee.jsx` |
| 03 | Built — mini-UI project cards, content phone + cycling DMs, click-to-open "everything" list | `components/Built.jsx`, `MiniCard.jsx`, `ContentStrip.jsx`, `Everything.jsx` |
| 04 | GitHub — contribution graph, pinned repos, latest pushes (build-time snapshot) | `components/GitHub.jsx`, `data/github.json` |
| 05 | Values — the 14, focus list + inspiration card | `components/Values.jsx` |
| 06 | Next — self-drawing route KY → Stanford → SF → NYC | `components/Next.jsx` |
| 07 | Say hi — email pill, shop lots, colophon | `components/Footer.jsx` |
| /tape | Every moment as a card grid, filter by year or chapter | `components/Tape.jsx` |

Removed in round 2: the "currently building" status, the M/P mark, the scroll hint, the pinned horizontal tape on the
home page, Numbers ("receipts"), Recognition, and the full CORTIS section. Nothing claims growth work at MathGPT or
Turbolearn AI anymore.

**Fonts** (all in `styles/tokens.css`, swap one line for the custom face): Cherry Bomb One (display), Gveret Levin
(handwritten accents), SF Pro via the system stack (body; can't be self-hosted), SF Mono via `ui-monospace`, Jua for 박성호.

**GitHub data:** run `node scripts/github-snapshot.mjs` before a deploy to refresh `src/life/data/github.json`. Only
public, owned, non-fork repos are written.

## Where to edit content

| What | File |
|---|---|
| Timeline moments (add a row = new card on the tape) | `src/life/data/timeline.js` |
| Status strip, clocks, socials, email, shop lots, nav | `src/life/data/site.js` |
| Projects, the "everything" list (+ descriptions), values, inspiration people | `src/life/data/work.js` |
| GitHub snapshot | `node scripts/github-snapshot.mjs` → `src/life/data/github.json` |
| CORTIS chip link | `src/life/data/repeat.js` |
| Every photo / video | `src/life/data/media.js` |

## Media slots still waiting for files

Drop files in `public/media/`, then set `src` (and `poster` for video) on the id in `media.js`. Videos: muted MP4
loops, H.264, ≤ 3 MB, with a poster JPG. Photos: WebP ≤ 1200px wide.

| id | kind | ratio | what |
|---|---|---|---|
| `born` | photo | 4/5 | Baby photo · Kentucky, 2010 |
| `fortnite` | photo | 16/9 | First Fortnite win screenshot |
| `first-youtube` | video | 16/9 | Clip from the first YouTube video |
| `tennis-start` | video | 4/5 | Tennis — first year on court |
| `sax-start` | photo | 4/5 | First alto sax |
| `all-state` | photo | 4/5 | KMEA All-State, 2nd chair |
| `switzerland` | photo | 16/9 | Switzerland, summer 2025 |
| `first-viral` | video | 9/16 | The first viral TikTok |
| `prayer-lock` | photo | 4/5 | Prayer Lock dashboard: $2K → $14K |
| `yt-doc` | video | 16/9 | YouTube documentary — trailer cut |
| `lrsef` | photo | 4/5 | LRSEF award photo |
| `stanford-ases` | photo | 4/5 | Stanford ASES acceptance |
| `axiom` | photo | 16/9 | Axiom intern cohort |
| `jyp` | video | 9/16 | JYP audition clip |
| `yc-ss` | photo | 4/5 | YC Startup School badge / photo |
| `google-grant` | photo | 16/9 | $10,000 Google grant letter |
| `reel-1` … `reel-6` | video | 9/16 | Top reels / TikToks / UGC / behind the scenes |
| `singing` | video | 9/16 | Singing / dance practice |
| `sax-solo` | video | 4/5 | Sax solo |

## Open questions for Matthew

1. **Turbolearn AI and MathGPT descriptions**: the list says "Description coming soon" until you send one line each
   (`everything` in `src/life/data/work.js`).
2. **Custom font**: when it's ready, drop the files in `public/fonts/` and point `--f-display` at it.
3. **Clocks**: "Matthew Time" is Louisville + Seoul. Houston instead?
4. **Numbers** in the manifesto ($2K → $14K, 550+) are from your copy. Confirm before launch.

## Verified

- `npm run build` passes. The home bundle is 134 KB gz JS (shop routes split off) and 16 KB gz CSS.
- Screenshots at 1440 / 768 / 375, plus a reduced-motion full page. No console errors (the only 404 locally is Vercel's
  analytics script, which exists only on Vercel).
- Menu: opens, Esc closes, focus returns. `/values` → `/#values` lands on the section.
- Lighthouse (mobile, preview build): Accessibility 96 → the flagged name mismatches are fixed; Best Practices 96;
  SEO 100. LCP 240 ms unthrottled on localhost, CLS 0.014.

## Launch checklist (the 20) — current state

| # | Item | State |
|---|---|---|
| 1 | Privacy policy | **missing**: needed if analytics / email capture stay |
| 2 | Terms | **missing**: the shop sells things, so it needs terms + refund policy |
| 3 | Secrets off the frontend | ok: Stripe/Resend only in `api/`, env on Vercel |
| 4 | HTTPS | ok (Vercel) |
| 5 | Cookie consent | n/a: Vercel Analytics is cookieless |
| 6 | Meta titles + descriptions | done |
| 7 | OG / Twitter image | done: `public/og.jpg` |
| 8 | Favicon | ok: `favicon-mp.svg` (worth a red/black refresh) |
| 9 | Sitemap + robots | done |
| 10 | Alt text | done for real photos; placeholders are captioned figures |
| 11 | Compress images | done for the life build (4.9 MB PNG → 86 KB WebP) |
| 12 | Page speed | good locally; re-check on Vercel preview |
| 13 | Contrast | tokens chosen for AA; red small text uses `--red-deep` |
| 14 | Mobile | checked at 375 / 768 / 1440 |
| 15 | Custom 404 | **missing**: unknown routes redirect home |
| 16 | Broken links | internal ok; `commitly`-style dead refs are only in the refs folder |
| 17 | Form validation | n/a on home (no form); shop forms unchanged |
| 18 | Spam protection | n/a on home |
| 19 | Analytics | ok: Vercel Analytics |
| 20 | One clear CTA | the email pill + DM SEND |

**License flag:** `public/fonts/AnthropicSerif-*` ship with every deploy even though no page uses them. They're
Anthropic's licensed fonts, so remove them from `public/` before the next deploy (not done: deleting files needs your OK).
