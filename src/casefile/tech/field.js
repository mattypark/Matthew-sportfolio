// The tech section's picture field: his project shots and code cards as flat cards in 3D, the
// way premotio's "Fields" preset hangs them. The kind he is on gathers into a sharp collage in
// front; everything else scatters deep behind it, small and soft.
//
// The softness is the mip chain, not a blur pass: each card samples its texture with a bias that
// grows with its distance from the focus plane, so a far card reads a smaller mip level and goes
// soft for free. One draw per card, no post-processing, no extra render targets.
//
// Formations (the B side of the A/B): the same cards can also stand as a ring, a grid, a roll, a
// carousel or a trail. Every formation is a function from (card, slot) to a pose; switching one
// only moves the targets and the cards ease over.

import {
  Color,
  LinearSRGBColorSpace,
  LinearMipmapLinearFilter,
  Mesh,
  OrthographicCamera,
  PerspectiveCamera,
  PlaneGeometry,
  SRGBColorSpace,
  Scene,
  ShaderMaterial,
  TextureLoader,
  Vector3,
  WebGLRenderTarget,
  WebGLRenderer,
} from 'three'

const VERT = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

const FRAG = /* glsl */ `
precision highp float;
uniform sampler2D map;
uniform float bias;     // mip bias: 0 is sharp, ~5 is a soft smear
uniform float alpha;    // far cards fade into the page
uniform vec3 paper;     // the page colour they fade toward
varying vec2 vUv;
void main() {
  vec3 c = texture2D(map, vUv, bias).rgb;
  gl_FragColor = vec4(mix(paper, c, alpha), 1.0);
}
`

// The lens (premotio's "Distort anything" control): the field is drawn to a texture, then through
// one of three lenses. Flare drags light outward in streaks, Prism splits the colours apart, Bend
// curves the frame like a fisheye with a red/blue rim. `amount` is the visitor's slider; it kicks
// up for a moment when the word changes, so the switch reads as the lens flexing.
const LENS_VERT = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`

const LENS_FRAG = /* glsl */ `
precision highp float;
uniform sampler2D scene;
uniform float amount;
uniform float mode;   // 1 flare, 2 prism, 3 bend
uniform float aspect;
uniform vec3 paper;
varying vec2 vUv;
vec3 at(vec2 uv) {
  if (uv.x < 0.0 || uv.y < 0.0 || uv.x > 1.0 || uv.y > 1.0) return paper;
  return texture2D(scene, uv).rgb;
}
vec2 bend(vec2 uv, float k) {
  vec2 p = uv * 2.0 - 1.0;
  p.x *= aspect;
  p *= 1.0 - k * dot(p, p) * 0.09;
  p.x /= aspect;
  return p * 0.5 + 0.5;
}
void main() {
  vec3 c;
  if (mode < 1.5) {
    // flare: streaks pulled out from the middle, the dark ends of the picture smearing furthest
    vec2 dir = vUv - vec2(0.62, 0.5);
    vec3 acc = vec3(0.0);
    float total = 0.0;
    for (int i = 0; i < 14; i++) {
      float t = float(i) / 13.0;
      float w = 1.0 - t * 0.85;
      acc += at(vUv - dir * t * 0.16 * amount) * w;
      total += w;
    }
    vec3 base = at(vUv);
    c = mix(base, min(base, acc / total), 0.85);
  } else if (mode < 2.5) {
    // prism: red, green and blue each pushed a different way, more toward the edges
    vec2 p = vUv - 0.5;
    float r = length(p) * 0.022 * amount;
    c = vec3(
      at(vUv + vec2(r, 0.25 * r)).r,
      at(vUv + vec2(-0.5 * r, r)).g,
      at(vUv + vec2(-0.5 * r, -r)).b
    );
  } else {
    float k = amount * 1.6;
    float split = 0.035 * k;
    c = vec3(at(bend(vUv, k * (1.0 + split))).r, at(bend(vUv, k)).g, at(bend(vUv, k * (1.0 - split))).b);
  }
  gl_FragColor = vec4(c, 1.0);
}
`
const LENS_MODES = { flare: 1, prism: 2, bend: 3 }
const LENS_KICK = 0.9

const PAPER = new Color('#efefed')
// The shaders write their colour out as-is, so the page colour they mix toward (and the lens pass's
// clear) must be the page's own sRGB numbers, not three's linear copy of them.
const PAPER_RAW = new Color().setRGB(0xef / 255, 0xef / 255, 0xed / 255, LinearSRGBColorSpace)
const FOCUS_Z = 0 // the collage's plane
const BLUR_PER_UNIT = 0.32 // mip bias per unit away from focus
const MAX_BIAS = 5.2
const EASE = 3.2 // how fast cards chase their targets (per second)
const STAGGER = 0.022 // seconds between neighbours setting off
const DEEP = { x: [-0.6, 10.5], y: [-6.4, 6.4], z: [-34, -5] } // right of the words, like premotio

// a fixed sequence so the field looks the same on every visit
function rng(seed) {
  let s = seed >>> 0
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 4294967296
  }
}

const lerp = (a, b, t) => a + (b - a) * t

/** Where each card should be: { x, y, z, rot, size } in world units. */
const FORMATIONS = {
  // the collage up front, the rest deep and scattered
  field(card, slot, n, ctx) {
    if (card.on) {
      const r = card.rand
      const k = slot / Math.max(1, n)
      const a = k * Math.PI * 2 * 1.618
      const rad = 0.3 + Math.sqrt(k) * 2.1
      return {
        x: ctx.cx + Math.cos(a) * rad * 0.82 + (r[0] - 0.5) * 0.4,
        y: Math.sin(a) * rad + (r[1] - 0.5) * 0.4,
        z: FOCUS_Z + (r[2] - 0.5) * 1.6,
        rot: 0,
        size: 1.05 + r[3] * 0.5,
      }
    }
    const r = card.rand
    return {
      x: lerp(DEEP.x[0] + (ctx.deepX ?? 0), DEEP.x[1], r[0]),
      y: lerp(DEEP.y[0], DEEP.y[1], r[1]),
      z: lerp(DEEP.z[0], DEEP.z[1], r[2]),
      rot: 0,
      size: 0.7 + r[3] * 0.5,
    }
  },
  ring(card, slot, n, ctx) {
    if (!card.on) return FORMATIONS.field(card, slot, n, ctx)
    const a = (slot / n) * Math.PI * 2 + ctx.t * 0.12
    return { x: ctx.cx + Math.sin(a) * 2.9, y: (card.rand[1] - 0.5) * 0.5, z: Math.cos(a) * 2.9 - 1.5, rot: a, size: 1.1 }
  },
  grid(card, slot, n, ctx) {
    if (!card.on) return FORMATIONS.field(card, slot, n, ctx)
    const cols = Math.ceil(Math.sqrt(n * 1.3))
    const rows = Math.ceil(n / cols)
    const gx = slot % cols
    const gy = Math.floor(slot / cols)
    return { x: ctx.cx + (gx - (cols - 1) / 2) * 1.55, y: ((rows - 1) / 2 - gy) * 1.75, z: 0, rot: 0, size: 1.15 }
  },
  roll(card, slot, n, ctx) {
    if (!card.on) return FORMATIONS.field(card, slot, n, ctx)
    const a = (slot / n) * Math.PI * 2 - ctx.t * 0.18
    return { x: ctx.cx + (card.rand[0] - 0.5) * 0.6, y: Math.sin(a) * 2.8, z: Math.cos(a) * 2.8 - 1.8, rot: 0, tilt: -a, size: 1.1 }
  },
  carousel(card, slot, n, ctx) {
    if (!card.on) return FORMATIONS.field(card, slot, n, ctx)
    const span = n * 1.75
    let x = ((slot * 1.75 - ctx.t * 0.55) % span + span) % span - span / 2
    return { x: ctx.cx + x, y: 0, z: -Math.abs(x) * 0.35, rot: 0, size: 1.25 }
  },
  trail(card, slot, n, ctx) {
    if (!card.on) return FORMATIONS.field(card, slot, n, ctx)
    const p = ctx.path[Math.min(ctx.path.length - 1, slot * 4)] ?? { x: ctx.cx, y: 0 }
    return { x: p.x, y: p.y, z: -slot * 0.32, rot: 0, size: 1.15 - slot * 0.03 }
  },
}

export const FORMATION_NAMES = Object.keys(FORMATIONS)

/**
 * pictures: [{ src, w, h, kind }]. Returns the controls; nothing draws until `visible(true)`.
 */
export function createField(canvas, pictures, { reduced = false, lens = false } = {}) {
  const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: 'high-performance' })
  renderer.setClearColor(PAPER, 1)
  renderer.outputColorSpace = SRGBColorSpace
  const scene = new Scene()
  const camera = new PerspectiveCamera(32, 1, 0.1, 80)
  camera.position.set(0, 0, 11)

  // the lens: the scene renders into `target`, then one quad draws it bent
  const target = new WebGLRenderTarget(1, 1, { samples: 4 })
  let lensMode = typeof lens === 'string' ? lens : lens ? 'bend' : 'off'
  let lensAmount = 0.6
  const lensScene = new Scene()
  const lensCamera = new OrthographicCamera(-1, 1, 1, -1, 0, 1)
  const lensMaterial = new ShaderMaterial({
    vertexShader: LENS_VERT,
    fragmentShader: LENS_FRAG,
    uniforms: { scene: { value: target.texture }, amount: { value: lensAmount }, mode: { value: LENS_MODES[lensMode] ?? 3 }, aspect: { value: 1 }, paper: { value: PAPER_RAW } },
    depthTest: false,
    depthWrite: false,
  })
  lensScene.add(new Mesh(new PlaneGeometry(2, 2), lensMaterial))
  let kick = 0

  const loader = new TextureLoader()
  const geometry = new PlaneGeometry(1, 1)
  const maxAniso = Math.min(4, renderer.capabilities.getMaxAnisotropy())
  const random = rng(7)

  const textures = new Map()
  const echoes = pictures.map((pic) => ({ ...pic, kind: null, echo: true }))
  const cards = [...pictures, ...echoes].map((pic, i) => {
    const material = new ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: FRAG,
      uniforms: { map: { value: null }, bias: { value: 0 }, alpha: { value: 0 }, paper: { value: PAPER_RAW } },
    })
    const mesh = new Mesh(geometry, material)
    mesh.visible = false
    scene.add(mesh)
    const aspect = pic.w / pic.h
    const card = {
      pic,
      mesh,
      aspect,
      on: false,
      rand: [random(), random(), random(), random(), random()],
      pos: new Vector3(),
      rot: 0,
      tilt: 0,
      size: 1,
      delay: 0,
      ready: false,
      fresh: true,
      index: i,
    }
    // one texture per picture, shared by its echo
    if (!textures.has(pic.src)) {
      textures.set(pic.src, new Promise((resolve) => loader.load(pic.src, (tex) => {
        tex.colorSpace = SRGBColorSpace
        tex.generateMipmaps = true
        tex.minFilter = LinearMipmapLinearFilter
        tex.anisotropy = maxAniso
        resolve(tex)
      })))
    }
    textures.get(pic.src).then((tex) => {
      material.uniforms.map.value = tex
      card.ready = true
      mesh.visible = true
    })
    return card
  })

  let kind = null
  let formation = 'field'
  let width = 1
  let height = 1
  let raf = 0
  let running = false
  let last = 0
  let t = 0
  let changedAt = 0
  const look = { x: 0, y: 0, tx: 0, ty: 0 }
  const ctx = { cx: 2.2, cy: 0, scale: 1, t: 0, path: [] }
  const aim = { x: 0, y: 0, at: -10, nx: 0.7, ny: 0.5 }

  function targetOf(card, slot, n) {
    const pose = FORMATIONS[formation](card, slot, n, ctx)
    if (card.on) pose.y += ctx.cy
    pose.size *= ctx.scale
    // the deep cards drift toward the camera and wrap, so the field never stands still
    if (!card.on && !reduced) {
      const span = DEEP.z[1] - DEEP.z[0]
      const z = ((pose.z - DEEP.z[0] + t * 0.45 * (0.6 + card.rand[4])) % span + span) % span + DEEP.z[0]
      pose.z = z
      pose.y += Math.sin(t * 0.3 + card.rand[0] * 6) * 0.15
    } else if (card.on && formation === 'field' && !reduced) {
      pose.y += Math.sin(t * 0.6 + card.rand[1] * 6) * 0.06
      pose.x += Math.cos(t * 0.5 + card.rand[2] * 6) * 0.04
    }
    return pose
  }

  function place(dt) {
    const on = cards.filter((c) => c.on)
    const off = cards.filter((c) => !c.on)
    const slots = new Map()
    on.forEach((c, i) => slots.set(c, [i, on.length]))
    off.forEach((c, i) => slots.set(c, [i, off.length]))
    for (const card of cards) {
      const [slot, n] = slots.get(card)
      const goal = targetOf(card, slot, n)
      const since = t - changedAt - card.delay
      const k = reduced ? 1 : since > 0 ? 1 - Math.exp(-EASE * dt) : 0
      // first frame: every card starts where it belongs. After that, a wrapped deep card jumps
      // straight to the back instead of flying through the collage
      if (card.fresh) {
        card.pos.set(goal.x, goal.y, goal.z)
        card.size = goal.size
        card.fresh = false
      } else if (!card.on && Math.abs(goal.z - card.pos.z) > 12) card.pos.z = goal.z
      card.pos.x = lerp(card.pos.x, goal.x, k)
      card.pos.y = lerp(card.pos.y, goal.y, k)
      card.pos.z = lerp(card.pos.z, goal.z, k)
      card.rot = lerp(card.rot, goal.rot ?? 0, k)
      card.tilt = lerp(card.tilt, goal.tilt ?? 0, k)
      card.size = lerp(card.size, goal.size, k)

      const m = card.mesh
      m.position.copy(card.pos)
      m.rotation.set(card.tilt, card.rot, 0)
      const h = card.size / Math.sqrt(Math.max(0.35, card.aspect))
      m.scale.set(h * card.aspect, h, 1)
      const away = Math.abs(card.pos.z - FOCUS_Z)
      const u = m.material.uniforms
      u.bias.value = Math.min(MAX_BIAS, away * BLUR_PER_UNIT)
      u.alpha.value = Math.max(0.5, 1 - Math.max(0, -card.pos.z - 6) / 40)
      m.renderOrder = Math.round(card.pos.z * 100)
    }
  }

  function frame(now) {
    raf = requestAnimationFrame(frame)
    const dt = Math.min(0.05, last ? (now - last) / 1000 : 0.016)
    last = now
    t += dt
    ctx.t = t
    // the trail's path: where the pointer points on the collage's plane, or a slow loop when it's still
    {
      const halfH = Math.tan((camera.fov * Math.PI) / 360) * camera.position.z
      const halfW = halfH * camera.aspect
      const idle = t - aim.at > 2.5
      const nx = idle ? 0.66 + Math.sin(t * 0.7) * 0.18 : aim.nx
      const ny = idle ? 0.5 + Math.sin(t * 1.1) * 0.22 : aim.ny
      ctx.path.unshift({ x: (nx - 0.5) * 2 * halfW, y: (0.5 - ny) * 2 * halfH })
      if (ctx.path.length > 200) ctx.path.length = 200
    }
    look.x = lerp(look.x, look.tx, 1 - Math.exp(-4 * dt))
    look.y = lerp(look.y, look.ty, 1 - Math.exp(-4 * dt))
    camera.position.x = look.x * 0.7
    camera.position.y = look.y * 0.5
    camera.lookAt(ctx.cx * 0.35, ctx.cy * 0.35, -2)
    place(dt)
    if (lensMode === 'off') {
      renderer.render(scene, camera)
      return
    }
    kick *= Math.exp(-2.2 * dt)
    lensMaterial.uniforms.amount.value = reduced ? lensAmount : lensAmount * (1 + kick)
    renderer.setRenderTarget(target)
    renderer.setClearColor(PAPER_RAW, 1)
    renderer.render(scene, camera)
    renderer.setClearColor(PAPER, 1)
    renderer.setRenderTarget(null)
    renderer.render(lensScene, lensCamera)
  }

  function resize(w, h) {
    width = Math.max(1, w)
    height = Math.max(1, h)
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1))
    renderer.setSize(width, height, false)
    const dpr = renderer.getPixelRatio()
    target.setSize(Math.round(width * dpr), Math.round(height * dpr))
    lensMaterial.uniforms.aspect.value = width / height
    camera.aspect = width / height
    // narrow screens: the collage moves to the middle
    ctx.cx = width / height < 1 ? 0 : 2.2
    ctx.cy = width / height < 1 ? -2.3 : 0
    ctx.scale = width / height < 1 ? 0.78 : 1
    ctx.deepX = width / height < 1 ? -4 : 0
    camera.updateProjectionMatrix()
  }

  return {
    /** Which kind gathers up front ('iphone', 'code', …). */
    setKind(next) {
      if (next === kind) return
      kind = next
      changedAt = t
      kick = LENS_KICK
      let i = 0
      for (const card of cards) {
        card.on = card.pic.kind === next
        card.delay = card.on ? (i++) * STAGGER : card.rand[4] * 0.25
      }
    },
    setFormation(next) {
      if (!FORMATIONS[next] || next === formation) return
      formation = next
      changedAt = t
    },
    /** 'off', 'flare', 'prism' or 'bend' (the section's pill). */
    setLens(mode) {
      lensMode = LENS_MODES[mode] ? mode : 'off'
      lensMaterial.uniforms.mode.value = LENS_MODES[lensMode] ?? 3
      kick = lensMode === 'off' ? 0 : LENS_KICK
    },
    /** The slider, 0..1. */
    setAmount(v) {
      lensAmount = Math.min(1, Math.max(0, v)) * 1.2
    },
    pointer(nx, ny) {
      look.tx = (nx - 0.5) * 2
      look.ty = (0.5 - ny) * 2
      aim.nx = nx
      aim.ny = ny
      aim.at = t
    },
    resize,
    /** Draw only while the section is on screen. */
    visible(on) {
      if (on === running) return
      running = on
      if (on) {
        last = 0
        raf = requestAnimationFrame(frame)
      } else {
        cancelAnimationFrame(raf)
      }
    },
    dispose() {
      cancelAnimationFrame(raf)
      for (const c of cards) c.mesh.material.dispose()
      for (const tex of textures.values()) tex.then((t) => t.dispose())
      geometry.dispose()
      target.dispose()
      lensMaterial.dispose()
      renderer.dispose()
    },
  }
}
