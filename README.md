# Matthew Park — Portfolio (TESTING SANDBOX)

> **This is the testing copy.** No GitHub remote. No deploys. Break things freely.
> The live one lives in `../matthewportfolio`.

---

## Who Matthew is — for any future agent / collaborator

Energetic. Makes jokes. Wants people to smile. Also wants to do *everything*.
Has changed interests a lot over the years and is okay with that — every
chapter compounds.

### Eyes set on:
**Stanford. SF. NYC. The world.** The thesis: to impact globally you have to
prove you're academically capable first — academics earns the room, then you
get to actually build. So studying hard *and* shipping hard, in parallel.

### Asian-Korean, born in Kentucky.
Mostly an outsider growing up. Spent a long time trying to fit in everywhere.
Learned the lesson: you don't have to fit in every time. The KY → SF arc is
part of the story, not something to hide.

### Currently building:
- **A nonprofit** that uses AI to help high schoolers land internships.
  The vision is global. The future-side number is *hundreds of thousands of
  dollars in impact*. Right now: build.
- **AI research** — looking for the right topic. Wants something that's
  academically intelligent *and* genuinely interesting. Still figuring it out.
- **Marketing experiments** — has shipped real campaigns, real revenue.
  AI + CS + marketing is the triangle.

### Track record (extracurriculars):
- **Speech & Debate** — qualified state, 1st in Impromptu Sales
- **Science Fair** — National Sustainable Development Award (LRSEF), 1st in ESGD
- **Varsity Tennis** — playing since age 9
- **Stanford ASES Launchpad** — accepted

### Off the keyboard:
- **Tennis** since age 9 — basketball, calisthenics on the side
- **Saxophone, piano, drums, guitar** — full musician
- **Prayer Lock (former CMO / cofounder)** — scaled it 7×, generated $14k
  in revenue from $2k MRR

### Voice / vibe rules for the site:
- Don't be corporate. Don't be a generic "17-y/o builder portfolio."
- Make jokes where they land. The KY-vs-SF thing is the running gag.
- Energetic but not loud. Smooth motion, not bouncy. Confidence, not flex.
- The site should feel like Matthew opened a terminal and started talking.

---

## Design direction (this sandbox)

The live site is light, serif, minimalist. **This sandbox flips it:** more
CS / AI / IDE-coded — but smooth and energetic, never "dev portfolio that
forgot it's a portfolio."

- **Dark theme by default** — deep near-black, not pure black
- **Mono-first body** (JetBrains Mono / IBM Plex Mono)
- **Instrument Serif** kept for emotional, oversized headers — mono + serif
  is the 2025-26 AI-startup signature (Anthropic, Linear, Cursor energy)
- **Electric-green accent** — used sparingly (cursor blink, hovers, key links)
- **Subtle dot/grid background** — coordinate-plane / model-training-plot vibes
- **Existing critically-damped smooth scroll stays**
- **No page transition wipe** — instant route swaps

## Stack

- React 18 + Vite
- React Router v6
- Tailwind CSS
- Framer Motion

## Develop

```bash
npm install
npm run dev      # → http://localhost:5174 (or whatever vite picks)
npm run build
npm run preview
```

**Reminder: this folder has no `origin` remote.** Local commits stay local.

---

## Current Design Direction (2026-07) — The Gate + Two Sides

The site is one gate with two personalities:

- **`/` The Gate** — bouncing bubble chooser. Click → split into two sides.
- **`/work` The Work Area** — minimalistic. The quiet ledger. Where brands
  and people contact Matthew.
- **`/loud` The Creative Half** — maximalistic, one continuous scroll, no
  exits between tiers: creative home → Labels™ → The Life → say hi.
  ("Creative", not "loud" — copy says creative everywhere.)

### Creative-half design languages

**1. ASCII art** — text is the texture. Poster-style cards (`.ascii-poster`)
with hand-drawn ASCII pieces (flower, globe, MP monogram, smiley) in
JetBrains Mono, cream / umber / black colorways, hard offset shadows.
Section: "Output_004 / ascii wing" in `RightPanel.jsx`.

**2. Micrographics** — tiny factory spec marks scattered across sections:
percentages (`38.4%`), labels (`QC / PASSED`, `LOT NO. 036`, `±0.40 MM`),
registration glyphs (`+`, `⌖`). Randomized on every load (content, position,
tilt) via `Micrographics.jsx`. The goal: manufactured **flagship-store
product-sheet feel** — like the page itself was quality-controlled, batch
numbered, and shipped.

**3. Manufactured-object motifs** — Labels™ tier (product tag, nutrition
facts with glass/wobble, warning card, QC stamp), passport-stamp wall with
real cities, randomized wireframe brain absorbing particle "information",
paper-plane orbit, tennis rally animation.

Palette: cream `#F7F4EC`-ish base, black `#14100B`, umber + bark browns.
Fonts: Archivo Black, Six Caps, Bodoni Moda, Special Elite, Caveat,
JetBrains Mono. Motion: GSAP (+ ScrollTrigger, MotionPath), anime.js,
Framer Motion, Lenis smooth scroll, three.js for the brain.
