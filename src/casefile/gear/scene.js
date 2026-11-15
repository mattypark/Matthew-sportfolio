// The gear scene's three.js core.
//
// The lighting is baked into each object's texture in Blender
// (scripts/gear/build_gear.py), so every material here is unlit: the GPU
// draws a texture and nothing else, which is how a lit-looking scene runs
// alongside the clip, the cursor and the text animations.
//
// The view (bench.js) owns the camera; leaves.js owns the tree's season;
// this file owns loading, hover, picking, the lift and the render loop.

import {
  Color,
  Fog,
  MathUtils,
  MeshBasicMaterial,
  PerspectiveCamera,
  Raycaster,
  SRGBColorSpace,
  Scene,
  Vector2,
  WebGLRenderer,
} from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { createLeaves } from './leaves.js'

// three's own default decoder URL breaks under Vite's dev pre-bundling, so the
// decoder is served from public/ (copied from three/examples/jsm/libs/draco/gltf)
const DRACO_PATH = '/casefile/draco/'
const HOT = 1.22 // a hovered object's texture is brightened by this much
const LIFT = 0.022 // metres a hovered object rises
const LIFT_EASE = 0.12 // seconds
const LEAN_EASE = 0.35 // seconds
const DRAG_YAW = 0.006 // radians per px dragged across
const DRAG_PITCH = 0.004 // radians per px dragged up or down (mouse and pen)
const DRAG_EASE = 0.18 // seconds: the turn trails the hand a little
const CLICK_SLOP = 5 // px a press may move and still count as a click

/**
 * Loads the glb and starts a scene on canvas. Throws when WebGL is missing,
 * so the caller can show the still instead.
 *
 * gear: content.js's list, each { id, nodes } naming the glb objects it owns.
 */
export async function createGear(canvas, { url, view, gear, reduced, onHover, onLost }) {
  const renderer = new WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' })
  renderer.outputColorSpace = SRGBColorSpace

  const draco = new DRACOLoader().setDecoderPath(DRACO_PATH)
  const loader = new GLTFLoader().setDRACOLoader(draco)
  let gltf
  try {
    gltf = await loader.loadAsync(url)
  } finally {
    draco.dispose()
  }

  // gltf.scene is a Group: background and fog only work on a real Scene
  const scene = new Scene()
  scene.add(gltf.scene)
  scene.background = new Color(view.bg)
  scene.fog = new Fog(view.bg, view.fog[0], view.fog[1])

  const owner = new Map() // glb object name -> story id
  gear.forEach((g) => g.nodes.forEach((n) => owner.set(n, g.id)))

  const items = new Map() // story id -> { objects, meshes, lift, target }
  const pickable = []
  scene.traverse((o) => {
    if (!o.isMesh) return
    const map = o.material.map
    if (map) map.colorSpace = SRGBColorSpace
    o.material.dispose()
    o.material = new MeshBasicMaterial({ map, fog: true })
  })
  // the item's own node is the one named in content.js; its meshes may sit below it
  for (const [name, id] of owner) {
    const node = scene.getObjectByName(name)
    if (!node) continue
    const item = items.get(id) || { id, objects: [], meshes: [], lift: 0, target: 0 }
    node.userData.baseY = node.position.y
    node.userData.baseRotY = node.rotation.y
    item.objects.push(node)
    node.traverse((m) => {
      if (!m.isMesh) return
      m.userData.gearId = id
      item.meshes.push(m)
      pickable.push(m)
    })
    items.set(id, item)
  }

  const camera = new PerspectiveCamera(40, 1, 0.02, 60)
  const ctx = {
    scene,
    camera,
    items,
    reduced,
    local: 0, // the push in after the arrival, 0..1
    enter: 1, // the arrival's zoom, 0 (far out) .. 1 (home)
    lean: { x: 0, y: 0 }, // eased pointer, -1..1
    user: { yaw: 0, pitch: 0 }, // where he has dragged the view, eased
    aspect: 1,
  }
  view.setup?.(ctx)
  const leaves = createLeaves(scene, { reduced })

  // ---- size --------------------------------------------------------------
  const size = () => {
    const w = canvas.clientWidth || window.innerWidth
    const h = canvas.clientHeight || window.innerHeight
    const phone = w < 720
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, phone ? 1.5 : 2))
    renderer.setSize(w, h, false)
    ctx.aspect = w / h
    camera.aspect = ctx.aspect
    // hold the designed width in view; tall screens see more above and below
    const hfov = MathUtils.degToRad(view.hfov * (ctx.aspect < 1 ? view.portraitZoom ?? 1 : 1))
    camera.fov = MathUtils.radToDeg(2 * Math.atan(Math.tan(hfov / 2) / ctx.aspect))
    camera.updateProjectionMatrix()
    dirty = true
  }

  // ---- hover and pick ----------------------------------------------------
  const ray = new Raycaster()
  const ndc = new Vector2()
  const aim = { x: 0, y: 0 }
  let hot = null
  let dirty = true

  const hit = (clientX, clientY) => {
    const r = canvas.getBoundingClientRect()
    ndc.set(((clientX - r.left) / r.width) * 2 - 1, -((clientY - r.top) / r.height) * 2 + 1)
    ray.setFromCamera(ndc, camera)
    return ray.intersectObjects(pickable, false)[0]?.object.userData.gearId ?? null
  }

  const setHot = (id) => {
    if (id === hot) return
    if (hot) items.get(hot).target = 0
    hot = id
    if (hot) items.get(hot).target = 1
    if (hot) canvas.dataset.hot = '1'
    else delete canvas.dataset.hot
    onHover?.(hot)
    dirty = true
  }

  // ---- drag to look around --------------------------------------------------
  // touch turns the view sideways only: an up or down swipe still scrolls
  const want = { yaw: 0, pitch: 0 }
  let press = null // { id, x, y, moved }
  let dragged = false

  const onDown = (e) => {
    if (e.button !== 0) return
    press = { id: e.pointerId, x: e.clientX, y: e.clientY, moved: 0 }
    dragged = false
    if (e.pointerType !== 'touch') canvas.setPointerCapture(e.pointerId)
  }
  const onUp = (e) => {
    if (!press || e.pointerId !== press.id) return
    dragged = press.moved > CLICK_SLOP
    press = null
    canvas.classList.remove('is-dragging')
  }

  const onMove = (e) => {
    if (press && e.pointerId === press.id) {
      const dx = e.clientX - press.x
      const dy = e.clientY - press.y
      press.x = e.clientX
      press.y = e.clientY
      press.moved += Math.abs(dx) + Math.abs(dy)
      if (press.moved > CLICK_SLOP) {
        canvas.classList.add('is-dragging')
        setHot(null)
        want.yaw -= dx * DRAG_YAW
        if (e.pointerType !== 'touch') want.pitch = Math.max(-0.5, Math.min(0.6, want.pitch - dy * DRAG_PITCH))
        dirty = true
        return
      }
    }
    if (e.pointerType === 'touch') return
    setHot(hit(e.clientX, e.clientY))
  }
  const onOut = () => setHot(null)
  const onLostCtx = (e) => {
    e.preventDefault()
    stop()
    onLost?.()
  }
  canvas.addEventListener('pointerdown', onDown)
  canvas.addEventListener('pointerup', onUp)
  canvas.addEventListener('pointercancel', onUp)
  canvas.addEventListener('pointermove', onMove)
  canvas.addEventListener('pointerleave', onOut)
  canvas.addEventListener('webglcontextlost', onLostCtx)
  window.addEventListener('resize', size)

  // ---- loop ----------------------------------------------------------------
  let raf = 0
  let running = false
  let last = 0
  let time = 0

  const tick = (now) => {
    if (!running) return
    raf = requestAnimationFrame(tick)
    const dt = Math.min(0.05, (now - last) / 1000)
    last = now
    if (reduced && !dirty) return
    time += reduced ? 0 : dt

    const kl = reduced ? 1 : 1 - Math.exp(-dt / LEAN_EASE)
    ctx.lean.x += (aim.x - ctx.lean.x) * kl
    ctx.lean.y += (aim.y - ctx.lean.y) * kl

    const kd = reduced ? 1 : 1 - Math.exp(-dt / DRAG_EASE)
    ctx.user.yaw += (want.yaw - ctx.user.yaw) * kd
    ctx.user.pitch += (want.pitch - ctx.user.pitch) * kd

    const kf = reduced ? 1 : 1 - Math.exp(-dt / LIFT_EASE)
    for (const item of items.values()) {
      item.lift += (item.target - item.lift) * kf
      const tint = 1 + (HOT - 1) * item.lift
      for (const m of item.meshes) m.material.color.setScalar(tint)
      for (const o of item.objects) o.position.y = o.userData.baseY + LIFT * (reduced ? 0 : item.lift)
    }
    view.frame(ctx, time, dt)
    leaves.update(time, dt)
    renderer.render(scene, camera)
    dirty = false
  }

  function start() {
    if (running) return
    running = true
    last = performance.now()
    dirty = true
    raf = requestAnimationFrame(tick)
  }
  function stop() {
    running = false
    cancelAnimationFrame(raf)
  }

  size()

  return {
    /** Runs the loop only while the scene is on screen. */
    setVisible(on) {
      if (on) start()
      else stop()
    },
    setLocal(v) {
      if (v === ctx.local) return
      ctx.local = v
      dirty = true
    },
    setEnter(v) {
      if (v === ctx.enter) return
      ctx.enter = v
      dirty = true
    },
    /** Pointer in -1..1 across the viewport, for the camera's lean. */
    pointer(x, y) {
      aim.x = x
      aim.y = y
      if (!reduced) dirty = true
    },
    /** The story id under a viewport point, or null; a drag never picks. */
    pick(clientX, clientY) {
      if (dragged) return null
      return hit(clientX, clientY)
    },
    /** Highlights an object from outside the canvas (the legend, the keyboard). */
    highlight(id) {
      setHot(id)
    },
    dispose() {
      stop()
      canvas.removeEventListener('pointerdown', onDown)
      canvas.removeEventListener('pointerup', onUp)
      canvas.removeEventListener('pointercancel', onUp)
      canvas.removeEventListener('pointermove', onMove)
      canvas.removeEventListener('pointerleave', onOut)
      canvas.removeEventListener('webglcontextlost', onLostCtx)
      window.removeEventListener('resize', size)
      leaves.dispose()
      scene.traverse((o) => {
        if (!o.isMesh) return
        o.geometry.dispose()
        o.material.map?.dispose()
        o.material.dispose()
      })
      renderer.dispose()
    },
  }
}
