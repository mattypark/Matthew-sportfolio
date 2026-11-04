# 3D credits — the gear scene

Every model in `public/casefile/gear/` was made for this site from scratch.
Nothing is downloaded, generated or borrowed (Shreethan's site was a reference
for the idea only), so there is nothing to credit and no licence to carry.

| Object | Made from | Notes |
|---|---|---|
| Racket | curves + boxes in `scripts/gear/build_gear.py` | 685 mm frame, 16 × 19 strings |
| Ball | sphere + a seam curve | optic yellow `#dbe94a` |
| iPhone | rounded boxes | 17 Pro size, no Apple marks |
| Sony FX30 | boxes + cylinders | real body size, no Sony marks |
| Journal | boxes | A5, court green |
| MacBook Pro | rounded boxes | 14-inch, his name on the screen |
| Lightstick | cylinders + a sphere | generic until he sends a photo of his CORTIS one |
| Bench, floor | boxes, planes | |
| Tree | cones + faceted icospheres | canopy baked white; the site tints it by season (`src/casefile/gear/season.js`) |
| Falling leaves, snow, petals | three.js shapes at runtime | `src/casefile/gear/leaves.js` |

Rebuild the scene (Blender 5.2):

```sh
/Applications/Blender.app/Contents/MacOS/Blender -b --factory-startup \
  --python scripts/gear/build_gear.py          # add -- --fast to check a layout
```

It writes `gear.glb` (Draco, WebP baked textures) and `still.webp`, and
keeps the `.blend` files in `build/gear/` (gitignored).

If a real model ever replaces one of these (Sketchfab, Poly Pizza, a generator),
its source, author, licence and link go in this table, and a CC-BY model also
needs a visible credit in the gear section.
