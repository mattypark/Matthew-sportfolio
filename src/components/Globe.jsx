import { useEffect, useRef, useMemo } from 'react'
import { createTimer, animate, createSpring } from 'animejs'
import { feature } from 'topojson-client'
import worldTopo from 'world-atlas/countries-110m.json'

// Spinning wireframe globe with real continent outlines.
// Pulsing pin at given lat/lng. Click to smoothly center on the pin.
// Magnetic hover follow via anime.js spring.

const R = 78
const CX = 100
const CY = 100
const SVG = 200
const PARALLEL_LATS = [-60, -30, 0, 30, 60]
const MERIDIAN_LONS = [-150, -120, -90, -60, -30, 0, 30, 60, 90, 120, 150]

// Rotation: yaw around Y axis (longitude), pitch around X axis (latitude).
// Input lon/lat in radians. Returns [screenX, screenY, depthZ]. Visible if z >= 0.
const rotate = (lon, lat, yaw, pitch) => {
  const cl = Math.cos(lat)
  const sl = Math.sin(lat)
  const co = Math.cos(lon)
  const so = Math.sin(lon)
  // Base unit vector — lon=0 faces viewer (+Z).
  let x = cl * so
  let y = sl
  let z = cl * co
  // Yaw (Y axis)
  const cy = Math.cos(yaw)
  const sy = Math.sin(yaw)
  const x1 = x * cy + z * sy
  const z1 = -x * sy + z * cy
  // Pitch (X axis)
  const cp = Math.cos(pitch)
  const sp = Math.sin(pitch)
  const y2 = y * cp - z1 * sp
  const z2 = y * sp + z1 * cp
  return [CX + R * x1, CY - R * y2, z2]
}

const buildArc = (samples, yaw, pitch) => {
  let d = ''
  let inFront = false
  for (let i = 0; i < samples.length; i++) {
    const [lon, lat] = samples[i]
    const [px, py, pz] = rotate(lon, lat, yaw, pitch)
    if (pz >= 0) {
      d += (inFront ? 'L' : 'M') + px.toFixed(2) + ',' + py.toFixed(2) + ' '
      inFront = true
    } else {
      inFront = false
    }
  }
  return d
}

const buildRing = (ring, yaw, pitch) => {
  // ring: array of [lonDeg, latDeg]
  let d = ''
  let inFront = false
  for (let i = 0; i < ring.length; i++) {
    const lon = (ring[i][0] * Math.PI) / 180
    const lat = (ring[i][1] * Math.PI) / 180
    const [px, py, pz] = rotate(lon, lat, yaw, pitch)
    if (pz >= 0) {
      d += (inFront ? 'L' : 'M') + px.toFixed(2) + ',' + py.toFixed(2) + ' '
      inFront = true
    } else {
      inFront = false
    }
  }
  return d
}

export default function Globe({ lat = 38.25, lng = -85.75 }) {
  const wrapRef = useRef(null)
  const innerRef = useRef(null)
  const meridiansRef = useRef([])
  const parallelsRef = useRef([])
  const continentsRef = useRef(null)
  const markerRef = useRef(null)
  const yawRef = useRef(0)
  const pitchRef = useRef(0)
  const targetYawRef = useRef(null)
  const targetPitchRef = useRef(null)
  const lastTimeRef = useRef(0)

  // Precompute meridian + parallel sample arrays (in radians)
  const meridianSamples = useMemo(() => {
    return MERIDIAN_LONS.map((lonDeg) => {
      const lon = (lonDeg * Math.PI) / 180
      const arr = []
      const N = 40
      for (let i = 0; i <= N; i++) {
        const lat = -Math.PI / 2 + (i / N) * Math.PI
        arr.push([lon, lat])
      }
      return arr
    })
  }, [])
  const parallelSamples = useMemo(() => {
    return PARALLEL_LATS.map((latDeg) => {
      const lat = (latDeg * Math.PI) / 180
      const arr = []
      const N = 64
      for (let i = 0; i <= N; i++) {
        const lon = -Math.PI + (i / N) * Math.PI * 2
        arr.push([lon, lat])
      }
      return arr
    })
  }, [])

  // Extract continent rings from topojson (countries collection)
  const continentRings = useMemo(() => {
    const fc = feature(worldTopo, worldTopo.objects.countries)
    const rings = []
    for (const f of fc.features) {
      const g = f.geometry
      if (!g) continue
      if (g.type === 'Polygon') {
        for (const r of g.coordinates) rings.push(r)
      } else if (g.type === 'MultiPolygon') {
        for (const poly of g.coordinates) for (const r of poly) rings.push(r)
      }
    }
    return rings
  }, [])

  useEffect(() => {
    const phi0 = (lat * Math.PI) / 180
    const lambda0 = (lng * Math.PI) / 180

    const lerpToTarget = (cur, target, k) => cur + (target - cur) * k

    const timer = createTimer({
      duration: 1e9,
      loop: true,
      onUpdate: (self) => {
        const now = self.currentTime
        const dt = Math.min(64, now - lastTimeRef.current)
        lastTimeRef.current = now

        if (targetYawRef.current !== null) {
          // Smooth ease toward click target
          yawRef.current = lerpToTarget(yawRef.current, targetYawRef.current, 0.08)
          pitchRef.current = lerpToTarget(pitchRef.current, targetPitchRef.current, 0.08)
          if (
            Math.abs(yawRef.current - targetYawRef.current) < 0.002 &&
            Math.abs(pitchRef.current - targetPitchRef.current) < 0.002
          ) {
            yawRef.current = targetYawRef.current
            pitchRef.current = targetPitchRef.current
            targetYawRef.current = null
            targetPitchRef.current = null
          }
        } else {
          yawRef.current += (dt / 1000) * 0.28
          // Gentle drift of pitch back to 0
          if (Math.abs(pitchRef.current) > 0.001) {
            pitchRef.current *= 0.985
          }
        }

        const yaw = yawRef.current
        const pitch = pitchRef.current

        // Meridians
        for (let i = 0; i < meridianSamples.length; i++) {
          const el = meridiansRef.current[i]
          if (el) el.setAttribute('d', buildArc(meridianSamples[i], yaw, pitch))
        }
        // Parallels
        for (let i = 0; i < parallelSamples.length; i++) {
          const el = parallelsRef.current[i]
          if (el) el.setAttribute('d', buildArc(parallelSamples[i], yaw, pitch))
        }
        // Continents (single combined path string)
        if (continentsRef.current) {
          let d = ''
          for (let i = 0; i < continentRings.length; i++) {
            d += buildRing(continentRings[i], yaw, pitch)
          }
          continentsRef.current.setAttribute('d', d)
        }
        // Marker
        const marker = markerRef.current
        if (marker) {
          const [mx, my, mz] = rotate(lambda0, phi0, yaw, pitch)
          if (mz >= 0) {
            marker.setAttribute('transform', `translate(${mx},${my})`)
            marker.setAttribute('opacity', String(Math.min(1, 0.55 + (mz / R) * 0.45)))
          } else {
            marker.setAttribute('opacity', '0')
          }
        }
      },
    })

    // Magnetic hover follow
    const spring = createSpring({ mass: 1, stiffness: 90, damping: 14 })
    let activeAnim = null
    const onMove = (e) => {
      const wrap = wrapRef.current
      if (!wrap) return
      const rect = wrap.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const dx = (e.clientX - cx) * 0.22
      const dy = (e.clientY - cy) * 0.22
      activeAnim?.pause?.()
      activeAnim = animate(innerRef.current, { x: dx, y: dy, ease: spring, duration: 700 })
    }
    const onLeave = () => {
      activeAnim?.pause?.()
      activeAnim = animate(innerRef.current, { x: 0, y: 0, ease: spring, duration: 900 })
    }
    const onClick = () => {
      // Center pin in front of viewer.
      // Want rotated (lambda0, phi0) → (0,0,+1). With yaw applied first, lon→lon+yaw on coords:
      // Set yaw so lambda0 wraps to 0, pitch so phi0 wraps to 0.
      let targetYaw = -lambda0
      let targetPitch = phi0
      // Shortest-path normalization for yaw
      while (targetYaw - yawRef.current > Math.PI) targetYaw -= 2 * Math.PI
      while (targetYaw - yawRef.current < -Math.PI) targetYaw += 2 * Math.PI
      targetYawRef.current = targetYaw
      targetPitchRef.current = targetPitch
    }

    const wrap = wrapRef.current
    wrap?.addEventListener('pointermove', onMove)
    wrap?.addEventListener('pointerleave', onLeave)
    wrap?.addEventListener('click', onClick)

    return () => {
      timer?.pause?.()
      wrap?.removeEventListener('pointermove', onMove)
      wrap?.removeEventListener('pointerleave', onLeave)
      wrap?.removeEventListener('click', onClick)
    }
  }, [lat, lng, continentRings, meridianSamples, parallelSamples])

  return (
    <div
      ref={wrapRef}
      className="relative select-none"
      style={{ width: '100%', maxWidth: 220, aspectRatio: '1 / 1', cursor: 'pointer' }}
      aria-label="Click to center on Louisville"
      role="button"
    >
      <div ref={innerRef} style={{ width: '100%', height: '100%', willChange: 'transform' }}>
        <svg viewBox={`0 0 ${SVG} ${SVG}`} width="100%" height="100%">
          <defs>
            <radialGradient id="globe-shade" cx="38%" cy="32%" r="0.85">
              <stop offset="0%" stopColor="rgba(15,14,12,0)" />
              <stop offset="65%" stopColor="rgba(15,14,12,0.05)" />
              <stop offset="100%" stopColor="rgba(15,14,12,0.16)" />
            </radialGradient>
            <clipPath id="globe-clip">
              <circle cx={CX} cy={CY} r={R} />
            </clipPath>
          </defs>
          <circle
            cx={CX}
            cy={CY}
            r={R}
            fill="url(#globe-shade)"
            stroke="rgba(15,14,12,0.5)"
            strokeWidth="0.9"
          />
          <g clipPath="url(#globe-clip)">
            {parallelSamples.map((_, i) => (
              <path
                key={`p${i}`}
                ref={(el) => (parallelsRef.current[i] = el)}
                fill="none"
                stroke="rgba(15,14,12,0.22)"
                strokeWidth="0.5"
              />
            ))}
            {meridianSamples.map((_, i) => (
              <path
                key={`m${i}`}
                ref={(el) => (meridiansRef.current[i] = el)}
                fill="none"
                stroke="rgba(15,14,12,0.22)"
                strokeWidth="0.5"
              />
            ))}
            <path
              ref={continentsRef}
              fill="rgba(15,14,12,0.78)"
              fillRule="evenodd"
              stroke="rgba(15,14,12,0.9)"
              strokeWidth="0.45"
              strokeLinejoin="round"
            />
          </g>
          <g ref={markerRef} opacity="0">
            <circle r="7" fill="var(--primary)" opacity="0.18">
              <animate attributeName="r" values="3;10;3" dur="2.4s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.55;0;0.55" dur="2.4s" repeatCount="indefinite" />
            </circle>
            <circle r="2.6" fill="var(--primary)" stroke="var(--paper)" strokeWidth="0.6" />
          </g>
        </svg>
      </div>
    </div>
  )
}
