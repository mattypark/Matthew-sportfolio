import { useEffect, useRef } from 'react'
import * as THREE from 'three'

// Wireframe knot + intake particles — "rotating thoughts" on the loud half.
// Randomized on every load: knot shape, ink shade, spin, drift.
// Particles stream inward from the edges — information being absorbed.
// Umber on cream, DPR capped, fully disposed on unmount.

const KNOT_SHAPES = [
  [2, 3],
  [2, 5],
  [3, 4],
  [3, 7],
  [4, 3],
  [5, 2],
]
const INKS = [0x6b4a2f, 0x3e2c1c, 0x8a5a33, 0x4a3722]

const PARTICLE_COUNT = 520
const ABSORB_RADIUS = 0.75

const rand = (min, max) => min + Math.random() * (max - min)
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)]

export default function ThreeBlock() {
  const wrapRef = useRef(null)
  const canvasRef = useRef(null)

  useEffect(() => {
    const wrapper = wrapRef.current
    const canvas = canvasRef.current
    if (!wrapper || !canvas) return

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 50)
    camera.position.z = 4.4

    // --- the thought: a different knot every visit ---
    const [p, q] = pick(KNOT_SHAPES)
    const ink = pick(INKS)
    const geometry = new THREE.TorusKnotGeometry(rand(1.0, 1.25), rand(0.26, 0.4), 220, 26, p, q)
    const material = new THREE.MeshBasicMaterial({
      color: ink,
      wireframe: true,
      transparent: true,
      opacity: 0.9,
    })
    const knot = new THREE.Mesh(geometry, material)
    knot.rotation.set(rand(0, Math.PI), rand(0, Math.PI), 0)
    scene.add(knot)

    // randomized spin per load — sometimes lazy, sometimes caffeinated
    const spinX = rand(0.0018, 0.005) * (Math.random() < 0.5 ? -1 : 1)
    const spinY = rand(0.003, 0.008) * (Math.random() < 0.5 ? -1 : 1)
    const pulseSpeed = rand(0.4, 1.1)

    // --- intake particles: spawn far out, drift into the knot ---
    const positions = new Float32Array(PARTICLE_COUNT * 3)
    const speeds = new Float32Array(PARTICLE_COUNT)
    const respawn = (i, nearby = false) => {
      const r = nearby ? rand(1.2, 6.5) : rand(3.4, 6.5)
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = r * Math.cos(phi) * 0.55 // squash z so they stay in frame
      speeds[i] = rand(0.004, 0.016)
    }
    for (let i = 0; i < PARTICLE_COUNT; i += 1) respawn(i, true)

    const particleGeometry = new THREE.BufferGeometry()
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    const particleMaterial = new THREE.PointsMaterial({
      color: ink,
      size: 0.035,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.65,
    })
    const particles = new THREE.Points(particleGeometry, particleMaterial)
    scene.add(particles)

    const resize = () => {
      const w = wrapper.clientWidth
      const h = wrapper.clientHeight
      if (!w || !h) return
      renderer.setSize(w, h, false)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(wrapper)

    // Slight tilt toward the cursor for life without being needy.
    let targetX = 0
    let targetY = 0
    const onPointer = (e) => {
      const rect = wrapper.getBoundingClientRect()
      targetX = ((e.clientY - rect.top) / rect.height - 0.5) * 0.6
      targetY = ((e.clientX - rect.left) / rect.width - 0.5) * 0.6
    }
    wrapper.addEventListener('pointermove', onPointer)

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let raf
    let t = 0
    const loop = () => {
      t += 0.016

      knot.rotation.x += spinX + (targetX - (knot.rotation.x % (Math.PI * 2))) * 0.0004
      knot.rotation.y += spinY
      knot.rotation.z += (targetY - knot.rotation.z) * 0.03

      // the thought breathes while it absorbs
      const s = 1 + Math.sin(t * pulseSpeed) * 0.035
      knot.scale.set(s, s, s)

      // pull every particle inward; swallow + respawn at the rim
      for (let i = 0; i < PARTICLE_COUNT; i += 1) {
        const x = positions[i * 3]
        const y = positions[i * 3 + 1]
        const z = positions[i * 3 + 2]
        const shrink = 1 - speeds[i]
        positions[i * 3] = x * shrink
        positions[i * 3 + 1] = y * shrink
        positions[i * 3 + 2] = z * shrink
        if (x * x + y * y + z * z < ABSORB_RADIUS * ABSORB_RADIUS) respawn(i)
      }
      particleGeometry.attributes.position.needsUpdate = true
      particles.rotation.y += 0.0008

      renderer.render(scene, camera)
      raf = requestAnimationFrame(loop)
    }
    if (reduced) {
      knot.rotation.set(0.6, 0.4, 0)
      renderer.render(scene, camera)
    } else {
      loop()
    }

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      wrapper.removeEventListener('pointermove', onPointer)
      geometry.dispose()
      material.dispose()
      particleGeometry.dispose()
      particleMaterial.dispose()
      renderer.dispose()
    }
  }, [])

  return (
    <div ref={wrapRef} className="relative w-full h-full">
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  )
}
