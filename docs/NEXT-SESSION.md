# Next session — paste this prompt

```text
Continue Matthew's portfolio redesign in ~/Downloads/current-projects/matthewportfolio
on branch `redesign-2026`. Read docs/REDESIGN.md and this file first. Commit after every
change as Matthew Park <matthew.parkk0@gmail.com>. NEVER git push, never deploy.

WHERE IT STANDS (Matthew: "this is literally perfect", then a few tweaks, all done)
- `/` is a whiteboard (src/life/board/Board.jsx + src/life/styles/board.css):
  "Matthew Park" centered (Cherry Bomb One), a handwritten note that writes itself
  with human pauses ("pick one ↓ (or use your arrow keys)", WrittenNote.jsx), four
  small centered boxes with Friday Night Funkin' arrows and a fresh random tilt per
  visit (Timeline ±1°, others ±2°), dashed marker line, three clocks at the bottom
  (EST New York, PST San Francisco, KST Seoul).
- Hover/focus a box → the whole board floods with that box's color (circle from the
  box), the focused box turns YELLOW (--focus-yellow) and shows a live preview
  (Preview.jsx); the other boxes fade, shrink and lean away.
- Click / arrow key → GSAP liquid fill bottom→top in the box color (liquid.js), then
  the panel content reveals piece by piece (board/panels/*). Esc/back drains to the
  board. Box → box pours the new color straight over the old one (liquid.refill) —
  it must NOT go back to the board in between.
- Boxes: ← Timeline #cc57a3 (/timeline) · ↓ Right now #00c3ff (/now) ·
  ↑ Contact #12d82a (/contact) · → Personality #f9393f (/personality).
  One route `/:section?` keeps Board mounted so animations run between URLs.
- Other routes: /tape (every moment, filterable), /archive (the older long page).
  /shop redirects home; /lut and /call still exist ONLY for past LUT buyers, nothing links to them.

HARD PREFERENCES (from Matthew, don't regress)
- NOT on the board: his photos, a subtitle, a Korean name, "the long version" link,
  the CORTIS chip, the shop. No "currently building", no M/P monogram, no scroll hints.
- No stat walls / "receipts", no recognition lists, no long sideways scrolls.
- Never claim he did growth at MathGPT or Turbolearn AI.
- Fonts are tokens in src/life/styles/tokens.css: Cherry Bomb One (display), Gveret Levin
  (handwriting), SF Pro system stack (body), ui-monospace, Jua (Hangul, now unused on the
  board). He is making a CUSTOM FONT — swap --f-display when he sends it.
- Email: matthew.parkk0@gmail.com.
- Featured work (Right now): Terac (intern, $9M startup that sells data), WAP (intern,
  global hackathon series), content (30K). Copy in src/life/data/now.js is placeholder.
- Past projects live in Timeline or on GitHub, never front and center.

WHAT MATTHEW WANTS NEXT
1. A mood board is coming — use it to push the board and panels more "premium".
2. MORE INFO inside each of the four boxes (Timeline, Right now, Contact, Personality).
   Personality is still a placeholder; ask him what goes there.
3. Real copy: one line each for Terac, WAP, the "30K" (which platform?), Turbolearn AI,
   MathGPT (src/life/data/now.js, src/life/data/work.js `everything`).
4. A GitHub example of a liquid/slider transition he'll send — fold it into liquid.js.
5. Photos/videos for the media slots listed in docs/REDESIGN.md (public/media/, media.js).

OPEN BEFORE LAUNCH (report each)
- Privacy policy, custom 404 (unknown routes redirect home now). Terms only if a shop returns.
- public/fonts/AnthropicSerif-* ship with every deploy but are unused — license issue;
  deleting files needs Matthew's OK.
- Refresh the GitHub snapshot before any deploy: `node scripts/github-snapshot.mjs`.

HOW TO VERIFY
- Dev: `npx vite --port 5188`. Playwright from ../chessuno/node_modules (no install).
  In dev, `window.__lenis` exists for deterministic scrolling. Test hover, click, arrow keys,
  Esc, box→box switching, deep links (/now etc.), back/forward, 1440/768/375, reduced motion.
- Close any headless Chrome you start. Reference library for components + prompts:
  ~/Downloads/current-projects/portfolio-refs (COMPONENTS.md, prompts/).
```
