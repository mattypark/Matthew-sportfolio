import React, { useEffect, useRef } from 'react'

/*
  MorphField — the wireframe backdrop.

  One THREE.LineSegments whose position attribute is lerped between two
  pre-baked shapes. Every shape is resampled to the SAME segment count, so a
  change of shape is a true vertex morph: every line travels to its new place.
  A cross-fade between two objects would read as an instant swap instead.

  Three is imported inside the effect (and behind requestIdleCallback) so the
  ~178 kb library never lands in the initial bundle.
*/

const SEGMENTS = 360
const MORPH_MS = 1400
// Each shape holds for exactly one full revolution, then morphs — the cadence
// is the spin itself, not a timer.
const SPIN_SPEED = 0.0005 // rad/ms -> a turn every ~12.6s
const TURN = Math.PI * 2

// Resample an arbitrary edge list to exactly SEGMENTS segments.
//
// Dense input (a torus knot has well over 360 edges) samples evenly across the
// whole list — `segments[i % count]` would silently draw only the first 360.
// Sparse input (a racket has 65) splits every edge; the remainder is handed out
// one piece at a time from the front, so no edge is ever left part-drawn. An
// even `pieces` for all edges leaves the tail of the list short and the shape
// reads as dashed.
function resample(segments) {
  const out = new Float32Array(SEGMENTS * 6)
  const count = segments.length

  if (count >= SEGMENTS) {
    for (let i = 0; i < SEGMENTS; i += 1) {
      const edge = segments[Math.floor((i * count) / SEGMENTS)]
      const o = i * 6
      for (let k = 0; k < 6; k += 1) out[o + k] = edge[k]
    }
    return out
  }

  const base = Math.floor(SEGMENTS / count)
  const extra = SEGMENTS % count
  let o = 0
  for (let e = 0; e < count; e += 1) {
    const pieces = base + (e < extra ? 1 : 0)
    const [ax, ay, az, bx, by, bz] = segments[e]
    for (let p = 0; p < pieces; p += 1) {
      const t0 = p / pieces
      const t1 = (p + 1) / pieces
      out[o] = ax + (bx - ax) * t0
      out[o + 1] = ay + (by - ay) * t0
      out[o + 2] = az + (bz - az) * t0
      out[o + 3] = ax + (bx - ax) * t1
      out[o + 4] = ay + (by - ay) * t1
      out[o + 5] = az + (bz - az) * t1
      o += 6
    }
  }
  return out
}

// EdgesGeometry hands back consecutive xyz pairs — every 6 floats is one
// segment. We only want the numbers, so both geometries are disposed here.
function edgeSegments(THREE, geo, threshold = 18) {
  const edges = new THREE.EdgesGeometry(geo, threshold)
  const p = edges.attributes.position.array
  const segments = []
  for (let i = 0; i < p.length; i += 6) {
    segments.push([p[i], p[i + 1], p[i + 2], p[i + 3], p[i + 4], p[i + 5]])
  }
  geo.dispose()
  edges.dispose()
  return segments
}

// A flat polyline at z = 0 -> segments.
function polylineSegments(points, closed = false) {
  const segments = []
  const last = closed ? points.length : points.length - 1
  for (let i = 0; i < last; i += 1) {
    const [ax, ay] = points[i]
    const [bx, by] = points[(i + 1) % points.length]
    segments.push([ax, ay, 0, bx, by, 0])
  }
  return segments
}

// Centre a hand-drawn shape on its own bounding box and scale it to a target
// radius. At z = 0 the camera sees ±2.48, so nothing may run wider than that.
function fit(segments, radius) {
  let minX = Infinity
  let maxX = -Infinity
  let minY = Infinity
  let maxY = -Infinity
  for (const [ax, ay, , bx, by] of segments) {
    minX = Math.min(minX, ax, bx)
    maxX = Math.max(maxX, ax, bx)
    minY = Math.min(minY, ay, by)
    maxY = Math.max(maxY, ay, by)
  }
  const cx = (minX + maxX) / 2
  const cy = (minY + maxY) / 2
  const scale = radius / Math.max(maxX - cx, maxY - cy)
  return segments.map(([ax, ay, az, bx, by, bz]) => [
    (ax - cx) * scale,
    (ay - cy) * scale,
    az,
    (bx - cx) * scale,
    (by - cy) * scale,
    bz,
  ])
}

// A four-pointed spark, used by both marks.
function sparkPoints(cx, cy, outer, inner) {
  return [
    [cx, cy + outer],
    [cx + inner, cy + inner],
    [cx + outer, cy],
    [cx + inner, cy - inner],
    [cx, cy - outer],
    [cx - inner, cy - inner],
    [cx - outer, cy],
    [cx - inner, cy + inner],
  ]
}

// The mark: an MP monogram — M drawn as one zigzag stroke, P as a stem with a
// closed bowl, plus a four-pointed spark. Hand-built so it stays line art.
function markSegments() {
  const m = polylineSegments([
    [-2.05, -1.05],
    [-2.05, 1.05],
    [-1.2, -0.2],
    [-0.35, 1.05],
    [-0.35, -1.05],
  ])

  const stem = polylineSegments([
    [0.35, -1.05],
    [0.35, 1.05],
  ])

  const bowl = polylineSegments(
    [
      [0.35, 1.05],
      [1.1, 1.05],
      [1.45, 0.75],
      [1.45, 0.35],
      [1.1, 0.05],
      [0.35, 0.05],
    ],
  )

  const spark = polylineSegments(sparkPoints(1.95, 0.7, 0.55, 0.17), true)

  return fit([...m, ...stem, ...bowl, ...spark], 1.9)
}

// Offset a centreline by half-width h, mitring every interior corner. The
// Axiom arrow is a wedge of constant thickness — offsetting in y alone thins
// any stroke that is not at 45 degrees, and the steep final rise came out a
// sliver. Positive h is the left side, negative the right.
function offsetPolyline(points, h) {
  const dirs = []
  for (let i = 0; i < points.length - 1; i += 1) {
    const dx = points[i + 1][0] - points[i][0]
    const dy = points[i + 1][1] - points[i][1]
    const len = Math.hypot(dx, dy) || 1
    dirs.push([dx / len, dy / len])
  }
  const normal = ([dx, dy]) => [-dy, dx]

  return points.map((p, i) => {
    const na = normal(dirs[i - 1] || dirs[0])
    const nb = normal(dirs[i] || dirs[dirs.length - 1])
    let mx = na[0] + nb[0]
    let my = na[1] + nb[1]
    const mlen = Math.hypot(mx, my) || 1
    mx /= mlen
    my /= mlen
    // Clamp the mitre so a near-reversal corner cannot spike off to infinity.
    const cos = Math.max(mx * na[0] + my * na[1], 0.25)
    return [p[0] + (mx * h) / cos, p[1] + (my * h) / cos]
  })
}

// Axiom Pathways: the disc with the chart-arrow cutting up through it and a
// spark off its tip. The arrow is drawn as its OUTLINE (a closed band), not a
// centreline — the real mark is a thick wedge, and a single stroke reads as a
// pencil line instead.
function axiomSegments() {
  const CX = -0.35
  const CY = -0.15
  const R = 1.45

  const disc = []
  const DISC_POINTS = 56
  for (let i = 0; i < DISC_POINTS; i += 1) {
    const a = (i / DISC_POINTS) * TURN
    disc.push([CX + R * Math.cos(a), CY + R * Math.sin(a)])
  }

  // The spine of the arrow: tail, peak, notch, then a shoulder just short of
  // the tip so the wedge keeps its thickness and only the last stub tapers to
  // a point — the way the real mark ends.
  const HALF = 0.3
  const tail = [-1.55, -0.57]
  const peak = [-0.62, 0.42]
  const notch = [-0.12, -0.12]
  const tip = [1.02, 1.32]

  const rise = [tip[0] - notch[0], tip[1] - notch[1]]
  const riseLen = Math.hypot(rise[0], rise[1])
  const shoulder = [tip[0] - (rise[0] / riseLen) * 0.5, tip[1] - (rise[1] / riseLen) * 0.5]

  const spine = [tail, peak, notch, shoulder]
  const arrow = polylineSegments(
    [...offsetPolyline(spine, HALF), tip, ...offsetPolyline(spine, -HALF).reverse()],
    true,
  )

  return fit(
    [
      ...polylineSegments(disc, true),
      ...arrow,
      ...polylineSegments(sparkPoints(1.38, 1.9, 0.48, 0.12), true),
    ],
    1.9,
  )
}

// Tennis racket: elliptical head, strung, on a throat and grip.
function racketSegments() {
  const RX = 0.78
  const RY = 1.0
  const CY = 0.85

  const onHead = (deg) => {
    const a = (deg * Math.PI) / 180
    return [RX * Math.cos(a), CY + RY * Math.sin(a)]
  }

  const head = []
  const HEAD_POINTS = 48
  for (let i = 0; i < HEAD_POINTS; i += 1) {
    head.push(onHead((i / HEAD_POINTS) * 360))
  }

  // Strings are chords of the head ellipse, so they stop exactly at the frame.
  const strings = []
  for (const k of [-0.62, -0.21, 0.21, 0.62]) {
    const x = k * RX
    const h = RY * Math.sqrt(Math.max(0, 1 - (x / RX) ** 2))
    strings.push(...polylineSegments([[x, CY - h], [x, CY + h]]))
  }
  for (const k of [-0.62, -0.31, 0, 0.31, 0.62]) {
    const y = k * RY
    const w = RX * Math.sqrt(Math.max(0, 1 - (y / RY) ** 2))
    strings.push(...polylineSegments([[-w, CY + y], [w, CY + y]]))
  }

  // The throat must START on the ellipse, not near it — a hand-picked y left a
  // visible gap between frame and shaft.
  const GRIP_TOP = -0.5
  const leftJoin = onHead(235)
  const rightJoin = onHead(-55)
  const throat = [
    ...polylineSegments([leftJoin, [-0.22, GRIP_TOP]]),
    ...polylineSegments([rightJoin, [0.22, GRIP_TOP]]),
  ]

  const grip = polylineSegments(
    [
      [-0.22, GRIP_TOP],
      [0.22, GRIP_TOP],
      [0.19, -1.9],
      [-0.19, -1.9],
    ],
    true,
  )

  // Two wraps on the handle
  const wraps = [
    ...polylineSegments([[-0.215, -0.95], [0.215, -0.95]]),
    ...polylineSegments([[-0.2, -1.42], [0.2, -1.42]]),
  ]

  return fit([...polylineSegments(head, true), ...strings, ...throat, ...grip, ...wraps], 1.9)
}

// Laptop: a slab base with a lid hinged back into z. Built in 3D so it still
// reads as an object when the spin turns it edge-on.
function computerSegments() {
  const seg = (a, b) => [a[0], a[1], a[2], b[0], b[1], b[2]]
  const loop = (pts) => pts.map((p, i) => seg(p, pts[(i + 1) % pts.length]))

  const BX = 1.5
  const TOP = -0.55
  const BOT = -0.78
  const FRONT = 0.95
  const HINGE = -0.85

  const top = [[-BX, TOP, HINGE], [BX, TOP, HINGE], [BX, TOP, FRONT], [-BX, TOP, FRONT]]
  const bottom = top.map(([x, , z]) => [x, BOT, z])
  const risers = top.map((p, i) => seg(p, bottom[i]))

  // Lid: hinged at the back edge, tilted up and further back.
  const lid = [
    [-1.42, TOP, HINGE],
    [1.42, TOP, HINGE],
    [1.42, 1.3, -1.5],
    [-1.42, 1.3, -1.5],
  ]
  const bezel = [
    [-1.24, TOP + 0.16, HINGE - 0.05],
    [1.24, TOP + 0.16, HINGE - 0.05],
    [1.24, 1.13, -1.45],
    [-1.24, 1.13, -1.45],
  ]

  const trackpad = [
    [-0.46, TOP, 0.3],
    [0.46, TOP, 0.3],
    [0.46, TOP, 0.82],
    [-0.46, TOP, 0.82],
  ]

  const keys = []
  for (const z of [-0.55, -0.28, -0.01]) {
    keys.push(seg([-1.15, TOP, z], [1.15, TOP, z]))
  }

  const raw = [
    ...loop(top),
    ...loop(bottom),
    ...risers,
    ...loop(lid),
    ...loop(bezel),
    ...loop(trackpad),
    ...keys,
  ]

  // Centre on y only — fit() is 2D and would flatten the depth we just built.
  // The 0.85 keeps the lid's back corners inside the frustum as it spins.
  const CY = (1.3 + BOT) / 2
  const S = 0.85
  return raw.map(([ax, ay, az, bx, by, bz]) => [
    ax * S,
    (ay - CY) * S,
    az * S,
    bx * S,
    (by - CY) * S,
    bz * S,
  ])
}

function buildShapes(THREE, accents) {
  // barrel — a cylinder bulged at the waist
  const barrel = new THREE.CylinderGeometry(1.3, 1.3, 2.5, 16, 3)
  const bp = barrel.attributes.position
  for (let i = 0; i < bp.count; i += 1) {
    const y = bp.getY(i)
    const k = 1 + 0.16 * (1 - (y / 1.25) ** 2)
    bp.setX(i, bp.getX(i) * k)
    bp.setZ(i, bp.getZ(i) * k)
  }
  bp.needsUpdate = true

  // nested cubes — three shells, edges concatenated
  const nested = []
  for (const size of [2.4, 1.7, 1.0]) {
    nested.push(...edgeSegments(THREE, new THREE.BoxGeometry(size, size, size)))
  }

  // Order is the story: the two marks, the two objects, then the solids. The
  // loop restarts at MP.
  return [
    { positions: resample(markSegments()), accent: accents.mark },
    { positions: resample(axiomSegments()), accent: accents.axiom },
    { positions: resample(racketSegments()) },
    { positions: resample(computerSegments()) },
    { positions: resample(edgeSegments(THREE, barrel)) },
    { positions: resample(edgeSegments(THREE, new THREE.IcosahedronGeometry(1.7, 1))) },
    { positions: resample(edgeSegments(THREE, new THREE.TorusKnotGeometry(1.1, 0.34, 48, 8))) },
    { positions: resample(edgeSegments(THREE, new THREE.OctahedronGeometry(1.9, 0))) },
    { positions: resample(nested) },
    { positions: resample(edgeSegments(THREE, new THREE.DodecahedronGeometry(1.75, 0))) },
  ]
}

const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2)

export default function MorphField({
  className = '',
  color = '#0b0b0b',
  // The MP mark burns amber; Axiom Pathways carries its own dark green.
  markColor = '#a8480d',
  axiomColor = '#14512f',
  opacity = 0.52,
}) {
  const hostRef = useRef(null)

  useEffect(() => {
    const host = hostRef.current
    if (!host) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let cancelled = false
    let teardown = null

    const start = async () => {
      const THREE = await import('three')
      if (cancelled || !hostRef.current) return

      let renderer
      try {
        renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
      } catch {
        return // no WebGL, no backdrop, no error
      }

      const size = host.clientWidth || 1
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      renderer.setSize(size, size, false)
      renderer.setClearAlpha(0)
      renderer.domElement.style.width = '100%'
      renderer.domElement.style.height = '100%'
      renderer.domElement.style.display = 'block'
      host.appendChild(renderer.domElement)

      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100)
      camera.position.z = 7.2

      const SHAPES = buildShapes(THREE, { mark: markColor, axiom: axiomColor })

      const geometry = new THREE.BufferGeometry()
      const positions = new Float32Array(SHAPES[0].positions)
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

      // One colour per shape, resolved once — a shape without an accent just
      // reuses the ink colour, so the morph lerp is the same code either way.
      const baseColor = new THREE.Color(color)
      const shapeColors = SHAPES.map((shape) =>
        shape.accent ? new THREE.Color(shape.accent) : baseColor.clone(),
      )
      const material = new THREE.LineBasicMaterial({
        color: shapeColors[0].clone(),
        transparent: true,
        opacity,
      })

      // The mesh lives in a group and the GROUP rotates — that is what keeps
      // the spin unbroken through a morph.
      const group = new THREE.Group()
      group.add(new THREE.LineSegments(geometry, material))
      scene.add(group)

      let from = 0
      let to = 1
      let phase = 'hold'
      let elapsed = 0
      let spun = 0

      let frame = 0
      let last = performance.now()
      let running = false

      const render = (now) => {
        frame = requestAnimationFrame(render)
        const dt = Math.min(now - last, 64) // a backgrounded tab must not lurch
        last = now

        // Spin first: the hold gate is measured in rotation, not milliseconds.
        const spin = dt * SPIN_SPEED
        group.rotation.y += spin
        group.rotation.x = Math.sin(now * 0.00006) * 0.26

        if (phase === 'hold') {
          spun += spin
          if (spun >= TURN) {
            phase = 'morph'
            elapsed = 0
            spun = 0
          }
        } else {
          elapsed += dt
          const t = Math.min(elapsed / MORPH_MS, 1)
          const eased = easeInOutCubic(t)
          const a = SHAPES[from].positions
          const b = SHAPES[to].positions
          for (let i = 0; i < positions.length; i += 1) {
            positions[i] = a[i] + (b[i] - a[i]) * eased
          }
          geometry.attributes.position.needsUpdate = true

          material.color.copy(shapeColors[from]).lerp(shapeColors[to], eased)

          if (t >= 1) {
            from = to
            to = (to + 1) % SHAPES.length
            phase = 'hold'
            elapsed = 0
          }
        }

        renderer.render(scene, camera)
      }

      const play = () => {
        if (running) return
        running = true
        last = performance.now() // reset the clock, else dt spikes on re-entry
        frame = requestAnimationFrame(render)
      }
      const pause = () => {
        if (!running) return
        running = false
        cancelAnimationFrame(frame)
      }

      const onResize = () => {
        const next = host.clientWidth || 1
        renderer.setSize(next, next, false)
      }
      window.addEventListener('resize', onResize)

      const observer = new IntersectionObserver(
        ([entry]) => (entry.isIntersecting ? play() : pause()),
        { threshold: 0 },
      )
      observer.observe(host)

      teardown = () => {
        observer.disconnect()
        window.removeEventListener('resize', onResize)
        cancelAnimationFrame(frame)
        renderer.domElement.remove()
        renderer.dispose()
        geometry.dispose()
        material.dispose()
      }
    }

    // Three is ~178 kb gzipped: fetch it only once the page is idle.
    const idle =
      typeof window.requestIdleCallback === 'function'
        ? window.requestIdleCallback(start, { timeout: 400 })
        : window.setTimeout(start, 400)

    return () => {
      cancelled = true
      if (typeof window.cancelIdleCallback === 'function' && typeof idle === 'number') {
        window.cancelIdleCallback(idle)
      }
      clearTimeout(idle)
      if (teardown) teardown()
    }
  }, [color, markColor, axiomColor, opacity])

  return <div ref={hostRef} className={className} />
}
