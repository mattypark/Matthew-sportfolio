import { useEffect, useRef } from 'react'
import { subscribeFFT, subscribeState } from '../lib/audioBus'

const N = 40 // path segments
const BIN_COUNT = 128 // analyser fftSize 256 → 128 freq bins

// Frequency band ranges (as a fraction of total bins). Tuned empirically.
//   bass:    low end ~0–8% (rumble, kick, sub-bass)
//   vocals:  mid-high ~12–55% (lead vocals + most of melody / lyrics)
const BASS_START = 0
const BASS_END = 10
const VOX_START = 16
const VOX_END = 72

function sampleRange(data, start, end, segs) {
  // Sample `segs+1` evenly spaced bins between [start,end), return Float array
  const out = new Float32Array(segs + 1)
  const span = end - start
  for (let i = 0; i <= segs; i++) {
    const t = i / segs
    const idx = Math.floor(start + t * (span - 1))
    out[i] = (data[idx] || 0) / 255
  }
  return out
}

export default function EdgeSquiggle({ side = 'left' }) {
  const voxRef = useRef(null)
  const bassRef = useRef(null)
  const playingRef = useRef(false)
  const ampsVoxRef = useRef(new Float32Array(N + 1))
  const ampsBassRef = useRef(new Float32Array(N + 1))
  const rafRef = useRef(null)
  const tRef = useRef(0)

  const style = side === 'left' ? { left: 2 } : { right: 2 }
  const dir = side === 'left' ? 1 : -1

  useEffect(() => {
    const offFFT = subscribeFFT((data) => {
      const vox = sampleRange(data, VOX_START, VOX_END, N)
      const bass = sampleRange(data, BASS_START, BASS_END, N)
      const aV = ampsVoxRef.current
      const aB = ampsBassRef.current
      // Heavy smoothing — more inertia = waves stay round, not pointy.
      // Bass gets even heavier smoothing for that slow-rolling low-end feel.
      for (let i = 0; i <= N; i++) {
        aV[i] = aV[i] * 0.82 + vox[i] * 0.18
        aB[i] = aB[i] * 0.88 + bass[i] * 0.12
      }
    })
    const offState = subscribeState((p) => {
      playingRef.current = p
    })

    const CENTER = 40
    const MAX = 36

    // Build a smooth Catmull-Rom-as-cubic-Bezier path through the offset points.
    // Resting state (no audio) uses the same gentle sin wobble as before so the
    // idle look is unchanged.
    const buildPath = (amps, phase, gain, rateMul = 1, ampMul = 1) => {
      const playing = playingRef.current
      const stepY = 1000 / N
      const pts = new Array(N + 1)
      for (let i = 0; i <= N; i++) {
        const y = i * stepY
        // Resting wobble = original behavior, untouched.
        const wobble = Math.sin(i * 0.5 + tRef.current * (playing ? 2.6 : 1.2) + phase) *
          (playing ? 4 : 3.5)
        const audioAmp = playing ? amps[i] * MAX * gain * ampMul : 0
        let offset = wobble + audioAmp
        if (offset > MAX) offset = MAX
        if (offset < -MAX) offset = -MAX
        const x = CENTER + dir * offset
        pts[i] = { x, y }
      }
      // Catmull-Rom to cubic Bezier conversion. Produces smooth curves through points
      // with C1 continuity — no sharp corners, no pointy peaks even at high amplitudes.
      let d = `M ${pts[0].x.toFixed(2)} ${pts[0].y.toFixed(2)}`
      for (let i = 0; i < N; i++) {
        const p0 = pts[i - 1] || pts[i]
        const p1 = pts[i]
        const p2 = pts[i + 1]
        const p3 = pts[i + 2] || pts[i + 1]
        const c1x = p1.x + (p2.x - p0.x) / 6
        const c1y = p1.y + (p2.y - p0.y) / 6
        const c2x = p2.x - (p3.x - p1.x) / 6
        const c2y = p2.y - (p3.y - p1.y) / 6
        d += ` C ${c1x.toFixed(2)} ${c1y.toFixed(2)}, ${c2x.toFixed(2)} ${c2y.toFixed(2)}, ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`
      }
      return d
    }

    const loop = () => {
      tRef.current += 0.016
      // Vocal line: white, full gain
      if (voxRef.current) voxRef.current.setAttribute('d', buildPath(ampsVoxRef.current, 0, 1, 1, 1))
      // Bass line: grey, slightly different phase + a touch wider amplitude for body
      if (bassRef.current) bassRef.current.setAttribute('d', buildPath(ampsBassRef.current, 1.3, 0.85, 1, 1.1))
      rafRef.current = requestAnimationFrame(loop)
    }
    rafRef.current = requestAnimationFrame(loop)

    return () => {
      offFFT()
      offState()
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [dir])

  return (
    <div className="edge-squiggle" style={style} aria-hidden="true">
      <svg viewBox="0 0 80 1000" preserveAspectRatio="none">
        {/* Bass: grey, behind */}
        <path
          ref={bassRef}
          d="M 40 0 L 40 1000"
          fill="none"
          stroke="#555555"
          strokeWidth="1.0"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.85"
        />
        {/* Vocals / highs: white, on top */}
        <path
          ref={voxRef}
          d="M 40 0 L 40 1000"
          fill="none"
          stroke="#ffffff"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="1"
        />
      </svg>
    </div>
  )
}
