// The bench: one courtside bench with everything on it, a tree beside it,
// like a workbench seen from the stands. The camera arrives from far out
// (the zoom of the arrival), drifts slowly around, leans toward the pointer,
// turns wherever it is dragged, and the scroll (or a pinch) pushes it in.
//
// Positions are Blender's (x, y, z) turned into three's (x, z, -y); the
// numbers match build_gear.py's layout_a.

import { MathUtils, Spherical, Vector3 } from 'three'

const TARGET = [-0.34, 0.74, 0]
const EYE = [1.3, 2.3, 3.95]
const ORBIT_DEG = 18 // idle swing either side of the designed view
const ORBIT_S = 40 // seconds for one full swing
const LEAN_YAW = 4 // degrees toward the pointer
const LEAN_PITCH = 3
const DOLLY = 0.62 // share of the distance the scroll closes
const ZOOM_FROM = 1.8 // extra distance, in multiples, the arrival starts from

let target
let offset
let sph

export default {
  bg: '#e9e9e5',
  fog: [6, 14],
  hfov: 48.5, // the 40 mm lens the bake was rendered through
  portraitZoom: 0.6, // a phone crops the scene's edges rather than shrink it

  setup() {
    target = new Vector3(...TARGET)
    offset = new Vector3(...EYE).sub(target)
    sph = new Spherical()
  },

  frame({ camera, local, enter, lean, user, reduced }, time) {
    const deg = MathUtils.degToRad
    sph.setFromVector3(offset)
    const swing = reduced ? 0 : Math.sin((time / ORBIT_S) * Math.PI * 2) * ORBIT_DEG
    sph.theta += deg(swing + (reduced ? 0 : lean.x * LEAN_YAW)) + user.yaw
    sph.phi = Math.min(Math.PI / 2.15, Math.max(0.22, sph.phi + deg(reduced ? 0 : lean.y * LEAN_PITCH) + user.pitch))
    sph.radius *= (1 - DOLLY * local) * (1 + ZOOM_FROM * (1 - enter))
    camera.position.setFromSpherical(sph).add(target)
    camera.lookAt(target)
  },
}
