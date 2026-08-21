# public/lut

Public artwork for the /lut page. Filenames are referenced from
`src/oldschool/data/lut.js` — change them there, not here.

- `before-01.jpg` / `after-01.jpg` — the same frame, ungraded log and graded.
  Same frame or the comparison is a lie. Add `-02`, `-03` pairs and list them
  in `conversions` for more.
- `shot-01.jpg` … — 9:16 poster frames for the "Shot on it" grid.

**The .cube does not go here.** Anything in `public/` is a public URL, which
would make the $5 pointless. It goes in `/private` — see `private/README.md`.

Missing images fail soft: the comparison shows "Frame not supplied yet" and the
video grid hides the broken thumbnail.
