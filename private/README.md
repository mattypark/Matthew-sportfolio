# private/

The LUT people pay for. `api/lut-download.js` serves it only after verifying a
paid Stripe session — it is never a static URL.

**This repo is public, so the .cube is gitignored and must not be committed.**
Committing it would hand the product out for free on GitHub.

Two ways to stock it:

1. **Production (what Vercel uses)** — upload the .cube somewhere with an
   unlisted direct-download link (Drive, Dropbox, Vercel Blob) and set
   `LUT_FILE_URL` in the Vercel project. Nothing lands in the repo.
2. **Local (`vercel dev`)** — drop `matthew-lut.cube` in this folder. Gitignored,
   so it stays on your machine.

Never move it to `public/` — anything there is a public URL.
