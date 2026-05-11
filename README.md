# Matthew Park — Portfolio

A personal site that doesn't read like every other 17-year-old portfolio template.

## Who this is for

Matthew Park, 15, builder + creator from Kentucky. Living in KY, very much pulled toward San Francisco. Working in tech, internet, marketing, and AI.

## Personality / context for future edits

If you're an AI agent (or human) coming back to make changes to this site, here's what should bleed through the design:

- **Tennis** — has played since Jan 2021. Court is the reset button. Mention it where it fits — never as a generic "hobby".
- **Coding** — builds startups solo and with cofounders. Ships fast. Indie maker energy.
- **SF, but Kentucky** — the running joke. Loves SF / wants to be there, but lives in Kentucky for now. Lean into the contrast — it's part of the brand. Don't hide Kentucky; *frame* it.
- **Startups** — has cofounded multiple (Prayer Lock, BounceBack, travel app, etc.). Has worked growth at Turbolearn AI, MathGPT. Comfortable being scrappy.
- **Marketing** — UGC, social, growth. Generated $20k+ in revenue scaling Prayer Lock 7x. Viral talking-head on TikTok.
- **Online** — lives on the internet. X, LinkedIn, IG, TikTok, YouTube. Treats internet presence as a craft, not a side effect.
- **AI** — building AI agents and AI-native products (Gourmet AI, solo AI app, MIT Critical Data research).

## Design rules

- Minimalist, lots of whitespace, serif display + mono small caps + sans body.
- Fonts already loaded: Instrument Serif (display), IBM Plex Mono (small caps), Inter (body).
- Light theme by default (`oklch(98% 0 0)` bg). Don't introduce a heavy color palette without asking.
- Menu pattern (hamburger → fullscreen black overlay with serif nav links + side panel) is *the* signature interaction. Preserve it across pages.
- Smooth scroll lives in `App.jsx` and uses a critically-damped spring. Don't remove it.

## Site structure

| Route | Purpose |
|-------|---------|
| `/` | **Home** — minimalist intro, Eric-Zuo-inspired. Single screen, two blocks of text, footer. The first impression. |
| `/timeline` | The reverse-chronological life log (formerly the home page). Every meaningful event Matthew wants to flex / remember. |
| `/about` | Long-form bio + photo. |
| `/values` | Core values page. |
| `/inspiration` | People / things that inspire him. |

The timeline is the heart of the site's content — it just isn't the landing page anymore. The landing page is the first impression; the timeline is the proof.

## Stack

- React 18 + Vite
- React Router v6
- Tailwind CSS
- Framer Motion

## Develop

```bash
npm install
npm run dev      # → http://localhost:5173
npm run build
npm run preview
```
