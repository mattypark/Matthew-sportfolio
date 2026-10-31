// The figure: Matthew against black (mewebstiebackgroudnremoval.mov), cut
// out of every frame and scrubbed by the scroll. 87 WebP frames rather than a
// <video>: setting currentTime per frame stutters, and Safari will not play
// a transparent WebM at all.
//
// Each frame's alpha is read once into a per-row profile, which is what the
// case-file copy wraps around, so the words follow him as his head turns.

export const CLIP_FRAMES = 87
export const clipSrc = (i) => `/casefile/clip/f${String(i + 1).padStart(3, '0')}.webp`
export const FIGURE_SRC = clipSrc(30)

const PROFILE_ROWS = 200
const BAR_H = 28
const LIFT = 0.12 // of the viewport: he stands this far above the bar
const FADE = 0.2 // of the frame: the chest cut dissolves over its bottom fifth
const PHONE = 720 // px: the layout's phone breakpoint, as in index.css
const PHONE_LIFT = 0.2 // phones are tall: he stands higher so the name fits under him

// Where he stands, in viewport px: a bust, framed from the chest up the way
// the titles frame a driver, lifted off the bar so the face sits high.
export function figureRect(vw, vh, aspect) {
  // on a phone the width runs out first: let him overhang the edges a little
  const w = Math.min(Math.min(vh * 0.7, 820) * aspect, vw * 1.25)
  const h = w / aspect
  const lift = vw < PHONE ? vh * PHONE_LIFT : vh * LIFT
  return { x: (vw - w) / 2, y: vh - BAR_H - h - lift, w, h }
}

// For each of PROFILE_ROWS rows: the leftmost and rightmost opaque x as a
// share of the frame width, or null where the row is empty.
function readProfile(img) {
  const w = 128
  const h = PROFILE_ROWS
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  const ctx = c.getContext('2d', { willReadFrequently: true })
  ctx.drawImage(img, 0, 0, w, h)
  const data = ctx.getImageData(0, 0, w, h).data
  const rows = []
  for (let y = 0; y < h; y++) {
    let lo = -1
    let hi = -1
    for (let x = 0; x < w; x++) {
      if (data[(y * w + x) * 4 + 3] > 40) {
        if (lo < 0) lo = x
        hi = x
      }
    }
    rows.push(lo < 0 ? null : [lo / w, (hi + 1) / w])
  }
  return rows
}

/**
 * Loads every frame, the first one first. onReady fires once frame 0 is in,
 * so the figure is on screen before the rest of the clip has arrived.
 */
export function loadClip(onReady) {
  const frames = new Array(CLIP_FRAMES).fill(null)
  const profiles = new Array(CLIP_FRAMES).fill(null)
  const clip = { frames, profiles, aspect: 1 }
  let cancelled = false

  const load = (i) =>
    new Promise((resolve) => {
      const img = new Image()
      img.decoding = 'async'
      img.onload = () => {
        if (cancelled) return resolve()
        frames[i] = img
        profiles[i] = readProfile(img)
        resolve()
      }
      img.onerror = () => {
        console.error(`[figure] frame ${i} failed to load: ${clipSrc(i)}`)
        resolve()
      }
      img.src = clipSrc(i)
    })

  load(0).then(async () => {
    if (cancelled || !frames[0]) return
    clip.aspect = frames[0].naturalWidth / frames[0].naturalHeight
    onReady(clip)
    // the rest in small batches, so they do not all fight the first paint
    for (let i = 1; i < CLIP_FRAMES; i += 6) {
      if (cancelled) return
      await Promise.all(Array.from({ length: Math.min(6, CLIP_FRAMES - i) }, (_, k) => load(i + k)))
    }
  })

  return () => {
    cancelled = true
  }
}

/** The loaded frame nearest to index i (frames may still be arriving). */
export function nearestFrame(clip, i) {
  const want = Math.round(Math.min(CLIP_FRAMES - 1, Math.max(0, i)))
  for (let d = 0; d < CLIP_FRAMES; d++) {
    if (clip.frames[want - d]) return want - d
    if (clip.frames[want + d]) return want + d
  }
  return 0
}

/**
 * Silhouette extents at screen row y (px) in a given frame, widened by `pad`
 * px either side so a line of type clears the whole of its own height.
 */
export function extentsAt(rows, rect, y, pad = 8) {
  const top = Math.floor(((y - pad - rect.y) / rect.h) * PROFILE_ROWS)
  const bot = Math.ceil(((y + pad - rect.y) / rect.h) * PROFILE_ROWS)
  let lo = Infinity
  let hi = -Infinity
  for (let r = Math.max(0, top); r <= Math.min(PROFILE_ROWS - 1, bot); r++) {
    const row = rows[r]
    if (!row) continue
    lo = Math.min(lo, row[0])
    hi = Math.max(hi, row[1])
  }
  if (lo === Infinity) return null
  return [rect.x + lo * rect.w, rect.x + hi * rect.w]
}

/** Draws one frame into a full-viewport canvas. */
export function drawFigure(canvas, clip, index, lift = 0) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  const vw = window.innerWidth
  const vh = window.innerHeight
  const w = Math.round(vw * dpr)
  const h = Math.round(vh * dpr)
  if (canvas.width !== w || canvas.height !== h) {
    canvas.width = w
    canvas.height = h
  }
  const ctx = canvas.getContext('2d')
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  ctx.clearRect(0, 0, vw, vh)
  const img = clip.frames[index]
  if (!img) return
  const r = figureRect(vw, vh, clip.aspect)
  ctx.imageSmoothingQuality = 'high'
  ctx.drawImage(img, r.x, r.y - lift, r.w, r.h)
  // the frame ends mid-chest; fade that edge out instead of cutting it
  const bottom = r.y - lift + r.h
  const fade = ctx.createLinearGradient(0, bottom - r.h * FADE, 0, bottom)
  fade.addColorStop(0, 'rgba(0, 0, 0, 0)')
  fade.addColorStop(1, 'rgba(0, 0, 0, 1)')
  ctx.globalCompositeOperation = 'destination-out'
  ctx.fillStyle = fade
  ctx.fillRect(r.x, bottom - r.h * FADE, r.w, r.h * FADE)
  ctx.globalCompositeOperation = 'source-over'
}
