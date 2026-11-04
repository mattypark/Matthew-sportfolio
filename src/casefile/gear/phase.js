// How much of the index's scroll the gear takes, and the shape of its
// arrival. Kept free of three.js so the index can size its phases without
// pulling the 3D chunk in.
//
// The arrival plays on its own once the footer is fully in (IndexPage glides
// through it, like the gauge's hand-over), in three overlapping beats:
//
//   0    .. FADE_END    the footer fades away to paper
//   SLIDE_AT .. 1      the scene slides down from the top
//   SLIDE_AT .. 1      and the camera zooms in from far out

export const GEAR_IN = 1.0 // viewport heights: the arrival
export const GEAR_RUN = 1.6 // viewport heights after it: scrolling on pushes the camera in
export const GEAR_MS = 1900 // how long the arrival plays
export const FADE_END = 0.42
export const SLIDE_AT = 0.3

const clamp01 = (v) => Math.min(1, Math.max(0, v))
export const easeOut = (t) => 1 - Math.pow(1 - t, 3)

/** The arrival's beats at progress p (0..1). */
export function arrival(p) {
  return {
    fade: clamp01(p / FADE_END),
    slide: easeOut(clamp01((p - SLIDE_AT) / (1 - SLIDE_AT) / 0.8)),
    zoom: easeOut(clamp01((p - SLIDE_AT) / (1 - SLIDE_AT))),
  }
}
