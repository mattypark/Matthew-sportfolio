// The tree's season: tints the canopy (baked plain white in Blender, so the
// colour here multiplies its light and shade), scatters fallen leaves on the
// ground, and lets more drift down from the canopy, swaying and turning.
//
// Two instanced meshes, so a hundred leaves cost two draw calls. Under
// reduced motion nothing falls; the fallen ones stay.

import {
  Box3,
  CircleGeometry,
  Color,
  DoubleSide,
  InstancedMesh,
  MathUtils,
  MeshBasicMaterial,
  Object3D,
  Shape,
  ShapeGeometry,
  Vector3,
} from 'three'
import { SEASONS, currentSeason } from './season.js'

const CANOPY = /^canopy_\d+$/
const GROUND_Y = 0.003
const SWAY = 0.12 // metres either side as a leaf falls
const GROUND_SPREAD = 1.25 // fallen leaves reach this far past the canopy's edge

function geometryFor(shape, size) {
  if (shape === 'flake') return new CircleGeometry(size / 2, 6)
  // a leaf or a petal: two curves meeting at the tip and the stem
  const s = new Shape()
  const w = shape === 'petal' ? 0.62 : 0.5
  s.moveTo(0, -0.5)
  s.quadraticCurveTo(w, -0.15, 0, 0.5)
  s.quadraticCurveTo(-w, -0.15, 0, -0.5)
  const g = new ShapeGeometry(s, 5)
  g.scale(size, size, size)
  return g
}

const rand = (a, b) => a + Math.random() * (b - a)
const pick = (list) => list[Math.floor(Math.random() * list.length)]

export function createLeaves(scene, { reduced }) {
  const season = SEASONS[currentSeason()]

  const canopies = []
  scene.traverse((o) => {
    if (CANOPY.test(o.name)) canopies.push(o)
  })
  if (canopies.length === 0) return { update() {}, dispose() {} }

  canopies.forEach((c, i) => {
    c.visible = Boolean(season.canopy)
    if (!season.canopy) return
    c.traverse((m) => {
      if (m.isMesh) m.material.color.set(season.canopy[i % season.canopy.length])
    })
  })

  // where leaves come from and land, measured off the canopy itself
  const box = new Box3()
  canopies.forEach((c) => box.expandByObject(c))
  const centre = box.getCenter(new Vector3())
  const reach = (Math.max(box.max.x - box.min.x, box.max.z - box.min.z) / 2) * GROUND_SPREAD
  const top = box.max.y
  const low = MathUtils.lerp(box.min.y, box.max.y, 0.3)

  const geometry = geometryFor(season.shape, season.size)
  const material = new MeshBasicMaterial({ side: DoubleSide, fog: true })
  const dummy = new Object3D()
  const tint = new Color()
  const meshes = []

  // ---- on the ground -------------------------------------------------------
  if (season.ground > 0) {
    const ground = new InstancedMesh(geometry, material, season.ground)
    for (let i = 0; i < season.ground; i++) {
      const r = reach * Math.sqrt(Math.random())
      const a = Math.random() * Math.PI * 2
      dummy.position.set(centre.x + Math.cos(a) * r, GROUND_Y + i * 0.00002, centre.z + Math.sin(a) * r)
      dummy.rotation.set(-Math.PI / 2 + rand(-0.15, 0.15), 0, Math.random() * Math.PI * 2)
      dummy.scale.setScalar(rand(0.8, 1.2))
      dummy.updateMatrix()
      ground.setMatrixAt(i, dummy.matrix)
      ground.setColorAt(i, tint.set(pick(season.leaves)))
    }
    scene.add(ground)
    meshes.push(ground)
  }

  // ---- falling -----------------------------------------------------------
  const count = reduced ? 0 : season.falling
  const falling = count ? new InstancedMesh(geometry, material, count) : null
  const drops = []
  const spawn = (d, anywhere) => {
    const r = reach * 0.75 * Math.sqrt(Math.random())
    const a = Math.random() * Math.PI * 2
    d.x = centre.x + Math.cos(a) * r
    d.z = centre.z + Math.sin(a) * r
    // the first leaves start part way down, so the air is never empty
    d.y = anywhere ? rand(GROUND_Y, top) : rand(low, top)
    d.speed = rand(...season.speed)
    d.phase = Math.random() * Math.PI * 2
    d.sway = rand(0.6, 1.4)
    d.spin = new Vector3(rand(-1, 1), rand(-1, 1), rand(-1, 1)).normalize()
    d.turn = rand(1.2, 3.2)
  }
  if (falling) {
    for (let i = 0; i < count; i++) {
      const d = {}
      spawn(d, true)
      drops.push(d)
      falling.setColorAt(i, tint.set(pick(season.leaves)))
    }
    falling.frustumCulled = false // they move; the bounds would go stale
    scene.add(falling)
    meshes.push(falling)
  }

  return {
    update(time, dt) {
      if (!falling) return
      for (let i = 0; i < drops.length; i++) {
        const d = drops[i]
        d.y -= d.speed * dt
        if (d.y < GROUND_Y) spawn(d, false)
        const s = Math.sin(time * d.sway + d.phase)
        dummy.position.set(d.x + s * SWAY, d.y, d.z + Math.cos(time * d.sway * 0.7 + d.phase) * SWAY * 0.6)
        dummy.quaternion.setFromAxisAngle(d.spin, time * d.turn + d.phase)
        dummy.scale.setScalar(1)
        dummy.updateMatrix()
        falling.setMatrixAt(i, dummy.matrix)
      }
      falling.instanceMatrix.needsUpdate = true
    },
    dispose() {
      meshes.forEach((m) => {
        scene.remove(m)
        m.dispose()
      })
      geometry.dispose()
      material.dispose()
    },
  }
}
