# Portfolio — Coding Session Notes

A log of the changes shipped in this session. Source of truth: `matthewportfolio copy 2/` was the staging sandbox, then everything was mirrored into `matthewportfolio/` for the real commit.

---

## Stack

- React 18 + Vite
- React Router v6 (`BrowserRouter`, `Routes`, `Link`, `useLocation`)
- Tailwind v3 with custom CSS variables
- Framer Motion for entrance + scroll animations
- Fonts: Bricolage Grotesque (hero name), Instrument Serif (page titles), IBM Plex Mono / JetBrains Mono (everything else)

---

## High-level structure

```
src/
  App.jsx                        — router + custom smooth-scroll hook
  index.css                      — tokens, sprite keyframes, font imports
  components/
    Portfolio.jsx                — home page (hero, rooms, now, socials/contact)
    Timeline.jsx                 — chronological steps
    About.jsx                    — long-form bio + photo
    Inspiration.jsx              — people I look up to
    CoreValues.jsx               — 14 values, two-column list
    Socials.jsx                  — handles + thumbnails
    SiteChrome.jsx               — top-right EST clock (no wordmark, no breadcrumb)
    RoomsNav.jsx                 — bottom code-block-style rooms list (Home, CV)
    SideRoomsRail.jsx            — fixed right-middle vertical rail (everywhere else)
    BootSequence.jsx             — terminal-style boot animation
    PageTransition.jsx           — route transition wrapper
public/
  favicon-mp.svg                 — "MP" in red, Bricolage Grotesque
  matthewflowers.png             — about-page photo
  mesprite-strip.png             — 7-frame horizontal sprite (189×373 each)
  mesprite-sheet.png             — source 5×2 grid sheet
```

---

## What changed this session

### Design tokens (`src/index.css`)
- `--color-custom: #d6321f` — primary cinematic red (was orange).
- `--color-accent-2: #ff6a2c` — orange kept as secondary.
- Added `@keyframes mesprite-walk` for the sprite cycle (`0% → 100%` with `steps(7, jump-none)` math).
- Added Bricolage Grotesque @import alongside Inter / IBM Plex Mono / Instrument Serif.

### Home — `Portfolio.jsx`
- Cleaned layout: status line → hero → rooms → `// now` → `// socials/contact` → footer.
- Hero name "Matthew Park" uses Bricolage Grotesque, red accent.
- Animated CSS sprite to the right of the name (`/mesprite-strip.png`, `steps(7, jump-none)`, `marginLeft: 5px`).
- `// now` and `// socials/contact` columns share the same `mt-6 sm:mt-7` spacing for visual rhythm.
- Socials/contact block: email + X + Instagram + TikTok + YouTube + LinkedIn.

### Shared chrome
- `SiteChrome.jsx` stripped to just the EST `LiveClock` (no top-left wordmark, no breadcrumb).
- `RoomsNav.jsx` — 5 items, code-block aesthetic. Used on Home + Core Values.
- `SideRoomsRail.jsx` — fixed `right-6 sm:right-10 top-1/2 -translate-y-1/2`. Used on Timeline, About, Inspiration.
- Final rooms order: **Home · Timeline · About · Inspiration · Core Values**.

### Per-page touches
- **Timeline**: top padding tightened (`pt-6 sm:pt-8`), bottom RoomsNav removed in favor of the side rail.
- **About**: `items-center` so the bio block aligns vertically with the photo. Right padding `sm:pr-44` to clear the side rail.
- **Inspiration / CoreValues**: per-item `whileInView` slide-from-left animations.
- **CoreValues**: 14 values in a 2-column ordered list (7/7 split).

### Smooth scroll (`App.jsx`)
- Hand-rolled `SmoothScroll` component: critically-damped spring on `wheel` + `keydown` (Arrow/Page/Home/End/Space).
- Disabled on touch devices and when `prefers-reduced-motion: reduce` is set.
- Runs on every route (including Home).

### Sprite work (`public/mesprite-strip.png`)
- Built a 7-frame horizontal strip from the original 5×2 sheet via Python/PIL — per-cell bbox detection, normalized to 189×373, bottom-aligned (feet on a common baseline).
- Animated with `background-size: 700% 100%` and `@keyframes mesprite-walk { 0% → 100% }` using `steps(7, jump-none)` so each step lands exactly on a frame center (0, 16.67%, 33.33%, 50%, 66.67%, 83.33%, 100%).
- Cleanups applied this session:
  - Frame 7 had a single stray pixel at (col 186, row 62) creating a "split-apart" ghost — removed via 8-connected component filter (keep the largest blob per cell).
  - Frame 7 character body was off-center (center ≈ col 84 vs others at ≈ col 94) — shifted right by 10px to align centers. No more lateral jitter on the last frame.
- Sprite span uses `imageRendering: pixelated` and `marginLeft: 5px` so it sits cleanly past "Park".

### Favicon
- `public/favicon-mp.svg` — "MP" in Bricolage Grotesque, both letters `#d6321f`, with a Google Fonts `@import` inside the SVG and `system-ui` fallback. `index.html` updated to point at it (filename rename forces a cache-bust over the previous `favicon.svg`).

---

## Conventions worth keeping

- **Spacing rhythm on Home**: every section uses `mt-6 sm:mt-7`. Don't break the cadence.
- **Entrance pattern**: `initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.22,1,0.36,1] }}`. Stagger via `delay`.
- **In-view pattern (lists)**: `initial={{ opacity:0, x:-20 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true, margin:'-50px' }}`.
- **Two side-nav modes**: bottom `RoomsNav` on dense list pages (Home, Core Values); fixed `SideRoomsRail` on long-scroll pages (Timeline, About, Inspiration). Don't render both on the same page.
- **Accent color**: only `--color-custom` (`#d6321f`) for active/hover/highlight. `--color-accent-2` is reserved.

---

## Known caveats

- Favicon font: browsers don't always honor `@import` inside an SVG used as a `<link rel="icon">`. Where Bricolage Grotesque isn't fetched, it falls back to `system-ui` — still legible MP, just a slightly different shape.
- The Bricolage import inside the SVG only matters when the favicon is actually rendered as SVG (Chrome, Firefox, Safari modern). Older surfaces may rasterize at low resolution.
- Smooth-scroll hook is wheel-only on desktop. Touch devices fall through to native momentum scrolling (intentional — don't try to "fix" iOS scroll).

---

## Open / nice-to-have

- README.md (root) still has placeholder meta tags ("placeholder name", "[your location]") — worth updating before sharing.
- Old screenshot favicon file is still in `public/` — safe to delete once the new favicon is verified live.
