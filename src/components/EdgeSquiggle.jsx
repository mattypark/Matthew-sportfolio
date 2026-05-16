import { useEffect, useRef } from 'react'
import { subscribeFFT, subscribeState } from '../lib/audioBus'

const N = 40 // path segments

const BASS_START = 0
const BASS_END = 10
const VOX_START = 16
const VOX_END = 72

function sampleRange(data, start, end, segs) {
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
  // intensity blends idle ↔ active state continuously, so play/pause never snap.
  const intensityRef = useRef(0)

  const style = side === 'left' ? { left: 2 } : { right: 2 }
  const dir = side === 'left' ? 1 : -1

  useEffect(() => {
    const offFFT = subscribeFFT((data) => {
      const vox = sampleRange(data, VOX_START, VOX_END, N)
      const bass = sampleRange(data, BASS_START, BASS_END, N)
      const aV = ampsVoxRef.current
      const aB = ampsBassRef.current
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

    const buildPath = (amps, phase, gain, rate, wobAmp, inten) => {
      const stepY = 1000 / N
      const pts = new Array(N + 1)
      for (let i = 0; i <= N; i++) {
        const y = i * stepY
        // Resting wobble math preserved. Rate + amplitude blend smoothly via `inten`.
        const wobble = Math.sin(i * 0.5 + tRef.current * rate + phase) * wobAmp
        const audioAmp = amps[i] * MAX * gain * inten
        let offset = wobble + audioAmp
        if (offset > MAX) offset = MAX
        if (offset < -MAX) offset = -MAX
        const x = CENTER + dir * offset
        pts[i] = { x, y }
      }
      // Catmull-Rom → cubic Bezier for smooth curves
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

      // Intensity easing — short attack (faster fade-in), longer release (slower fade-out)
      const target = playingRef.current ? 1 : 0
      const k = target > intensityRef.current ? 0.07 : 0.025
      intensityRef.current += (target - intensityRef.current) * k
      const inten = intensityRef.current

      // While paused, also gently decay any leftover amp values so the wave returns
      // to the pure resting wobble instead of holding the last frame's shape.
      if (!playingRef.current) {
        const aV = ampsVoxRef.current
        const aB = ampsBassRef.current
        for (let i = 0; i <= N; i++) {
          aV[i] *= 0.94
          aB[i] *= 0.94
        }
      }

      // Blend rate + wobble amplitude between idle (1.2, 3.5) and active (2.6, 4)
      const rate = 1.2 + (2.6 - 1.2) * inten
      const wobAmp = 3.5 + (4 - 3.5) * inten

      if (voxRef.current)
        voxRef.current.setAttribute('d', buildPath(ampsVoxRef.current, 0, 1, rate, wobAmp, inten))
      if (bassRef.current)
        bassRef.current.setAttribute('d', buildPath(ampsBassRef.current, 1.3, 0.85 * 1.1, rate, wobAmp, inten))
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
