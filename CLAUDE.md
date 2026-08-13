# Brief — for any agent or collaborator working on this repo

Context that isn't derivable from the code. Read this before touching the site.

---

## Who Matthew is

Energetic. Makes jokes. Wants people to smile. Also wants to do *everything*.
Has changed interests a lot over the years and is okay with that — every
chapter compounds.

### Eyes set on

**Stanford. SF. NYC. The world.** The thesis: to impact globally you have to
prove you're academically capable first — academics earns the room, then you
get to actually build. So studying hard *and* shipping hard, in parallel.

### Asian-Korean, born in Kentucky

Mostly an outsider growing up. Spent a long time trying to fit in everywhere.
Learned the lesson: you don't have to fit in every time. The KY → SF arc is
part of the story, not something to hide.

### Currently building

- **Axiom** — a nonprofit using AI to help high schoolers land internships.
  550+ interns, 10+ startups. The vision is global.
- **AI research** — looking for the right topic. Wants something academically
  intelligent *and* genuinely interesting. Still figuring it out.
- **Marketing experiments** — has shipped real campaigns, real revenue.
  AI + CS + marketing is the triangle.

### Track record

- **Speech & Debate** — qualified state, 1st in Impromptu Sales
- **Science Fair** — National Sustainable Development Award (LRSEF), 1st in ESGD
- **Varsity Tennis** — playing since age 9
- **Stanford ASES Launchpad** — accepted
- **Prayer Lock** (former CMO / cofounder) — scaled it 7×, generated $14k in
  revenue from $2k MRR

### Off the keyboard

Tennis since age 9, basketball and calisthenics on the side. Saxophone, piano,
drums, guitar.

---

## Voice rules for the site

- Don't be corporate. Don't be a generic "teenage builder portfolio."
- Make jokes where they land. The KY-vs-SF thing is the running gag.
- Energetic but not loud. Smooth motion, not bouncy. Confidence, not flex.
- The site should feel like Matthew opened a terminal and started talking.

---

## Architecture — the Gate and two sides

The site is one gate with two personalities.

- **`/` — The Gate.** A quiet editorial index: text nav at the vertical middle,
  a rotating portrait dead-center, city clocks and a cursor crosshair at the
  edges. Pure white, pure black.
- **`/work` — The quiet side.** Minimal. The ledger of engagements. Where brands
  and people contact Matthew.
- **`/journal` — The writing.** Markdown entries, a card grid, an email list.
  See [JOURNAL.md](JOURNAL.md).
- **`/values` — The operating system**, written down.
- **`/loud` — The creative half.** Maximalist, one continuous scroll, no exits
  between tiers: creative home → Labels™ → The Life → say hi. (Copy says
  "creative" everywhere, never "loud".)

### Creative-half design languages

**1. ASCII art** — text is the texture. Poster-style cards (`.ascii-poster`)
with hand-drawn ASCII pieces (flower, globe, MP monogram, smiley) in JetBrains
Mono, cream / umber / black colorways, hard offset shadows. Section:
"Output_004 / ascii wing" in `RightPanel.jsx`.

**2. Micrographics** — tiny factory spec marks scattered across sections:
percentages (`38.4%`), labels (`QC / PASSED`, `LOT NO. 036`, `±0.40 MM`),
registration glyphs (`+`, `⌖`). Randomized on every load via `Micrographics.jsx`.
The goal: a manufactured **flagship-store product-sheet feel** — like the page
itself was quality-controlled, batch numbered, and shipped.

**3. Manufactured-object motifs** — the Labels™ tier (product tag, nutrition
facts with glass/wobble, warning card, QC stamp), a passport-stamp wall with
real cities, a randomized wireframe brain absorbing particle "information",
a paper-plane orbit, a tennis rally animation.

Palette: cream `#F7F4EC`-ish base, black `#14100B`, umber + bark browns.
Fonts: Archivo Black, Six Caps, Bodoni Moda, Special Elite, Caveat, JetBrains
Mono. Motion: GSAP (+ ScrollTrigger, MotionPath), anime.js, Framer Motion,
Lenis smooth scroll, three.js for the brain.

The quiet side is a different language entirely: Fraunces + JetBrains Mono,
near-white paper, black ink, hairline rules.

---

## Rules of engagement

- **This repo deploys.** `origin` → `github.com/mattypark/Matthew-sportfolio`,
  which ships to Vercel. Don't experiment here — the scratch copies live in
  sibling directories.
- **Never commit or push without Matthew asking.** Ever.
- Never touch `.env` files or print secrets.
