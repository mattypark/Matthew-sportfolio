# Redesign 2026 — the life archive (branch `redesign-2026`)

The site is now `src/life/` (entry: `src/main.jsx` → `LifeApp`). The reference library it came from is
`~/Downloads/current-projects/portfolio-refs` (screenshots, notes, 93 component prompts). Component ids below
match `portfolio-refs/COMPONENTS.md`.

Nothing is pushed or deployed. Every step is committed on `redesign-2026`.

## What's on the page (top → bottom)

| # | Section | File | Built from (ref ids) |
|---|---|---|---|
| — | Loader 000 → 100, once per session | `components/Loader.jsx` | `loader-counter-0-100` |
| — | Top bar + circle-reveal index menu | `components/TopBar.jsx` | `nav-menu-morph`, `nav-status-strip` |
| hero | Text-pressure name, red sun, photo constellation, clocks, typewriter roles | `components/Hero.jsx`, `TextPressure.jsx` | `type-text-pressure`, `detail-red-circle-device`, `media-photo-constellation`, `type-typewriter-loop`, `detail-live-clock-dual`, `type-bilingual-wordmark` |
| 01 | Why — manifesto, red numbers, words ink in on scroll | `components/Manifesto.jsx` | `type-manifesto-red-numbers`, `type-scroll-word-reveal`, `detail-marker-annotations` |
| 02 | The tape — every dated moment, pinned horizontal on desktop | `components/Tape.jsx` | `scroll-horizontal-tape` |
| — | Velocity marquee divider | `components/Marquee.jsx` | `type-velocity-marquee` |
| 03 | Built — live mini-UI cards, content strip + fake DM, hover-band list | `components/Built.jsx`, `MiniCard.jsx`, `ContentStrip.jsx` | `media-live-mini-ui-cards`, `scroll-filmstrip-phone-dm`, `media-hover-band-list` |
| 04 | Numbers — counters, 2026 heatmap, "as seen at" marquee | `components/Numbers.jsx` | `data-stat-counters`, `proof-shipping-heatmap`, `proof-as-seen-on-marquee` |
| 05 | Recognition — 15 awards in groups with see-more | `components/Recognition.jsx` | `proof-recognition-groups` |
| 06 | Values — the 14, focus list + tilting inspiration card | `components/Values.jsx` | `scroll-focus-list` |
| 07 | On repeat — CORTIS, JYP, singing, sax; stage lights | `components/OnRepeat.jsx` | `moment-audio-reactive-stage` (visual only, no audio yet) |
| 08 | Next — self-drawing route KY → Stanford → SF → NYC | `components/Next.jsx` | `scroll-self-drawing-route` |
| 09 | Say hi — email copy pill, shop lots, colophon, ghost wordmark | `components/Footer.jsx` | `contact-email-pill-qr`, `footer-colophon-toggles`, `footer-ghost-wordmark` |

Shop, `/lut`, `/lut/thanks` and `/call` are the old oldschool components, lazy-loaded and untouched. Stripe/Resend
`api/` is untouched. Old URLs `/values`, `/about`, `/projects` land on their home-page sections.

## Where to edit content

| What | File |
|---|---|
| Timeline moments (add a row = new card on the tape) | `src/life/data/timeline.js` |
| Status strip, clocks, socials, email, shop lots, nav | `src/life/data/site.js` |
| Projects, stats, the "everything" list, values, inspiration people | `src/life/data/work.js` |
| Awards | `src/life/data/recognition.js` |
| CORTIS video | `src/life/data/repeat.js` (`youtubeId`) |
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

1. **Clocks:** "Matthew Time" is set to Louisville (America/New_York) + Seoul. Houston instead?
2. **CORTIS:** which official video goes in the embed (paste the YouTube id)?
3. **Numbers:** 30M views and the 20K / 550+ / 10+ figures are from your own copy. Confirm before launch; they're the
   first thing a reviewer will check.
4. **JYP audition** is public on the old timeline too. Keep it this prominent?
5. **Axiom link** points to axiompathways.org. Right domain?
6. **Hero at rest:** the reduced-motion version (the static wide wordmark, see `public/og.jpg`) may read stronger than
   the moving pressure effect. Keep the effect, or only run it on hover?

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
