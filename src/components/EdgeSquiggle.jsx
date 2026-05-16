import { useEffect, useRef } from 'react'
import { subscribeFFT, subscribeState } from '../lib/audioBus'

const N = 40 // path segments

export default function EdgeSquiggle({ side = 'left' }) {
  const path1Ref = useRef(null)
  const path2Ref = useRef(null)
  const playingRef = useRef(false)
  const ampsRef = useRef(new Array(N + 1).fill(0))
  const rafRef = useRef(null)
  const tRef = useRef(0)

  const style = side === 'left' ? { left: 2 } : { right: 2 }
  const dir = side === 'left' ? 1 : -1

  useEffect(() => {
    const offFFT = subscribeFFT((data) => {
      const bins = Math.min(data.length, 96)
      const amps = ampsRef.current
      for (let i = 0; i <= N; i++) {
        const idx = Math.floor((i / N) * (bins - 1))
        const v = data[idx] / 255
        amps[i] = amps[i] * 0.55 + v * 0.45
      }
    })
    const offState = subscribeState((p) => {
      playingRef.current = p
    })

    const buildPath = (phase, gain) => {
      const amps = ampsRef.current
      const playing = playingRef.current
      const CENTER = 40
      const MAX = 36 // keeps x within viewBox [4, 76]
      let d = ''
      const stepY = 1000 / N
      for (let i = 0; i <= N; i++) {
        const y = i * stepY
        const wobble = Math.sin(i * 0.5 + tRef.current * (playing ? 2.6 : 1.2) + phase) *
          (playing ? 4 : 3.5)
        const audioAmp = playing ? amps[i] * MAX * gain : 0
        let offset = wobble + audioAmp
        if (offset > MAX) offset = MAX
        if (offset < -MAX) offset = -MAX
        const x = CENTER + dir * offset
        d += (i === 0 ? 'M ' : ' L ') + x.toFixed(2) + ' ' + y.toFixed(2)
      }
      return d
    }

    const loop = () => {
      tRef.current += 0.016
      if (path1Ref.current) path1Ref.current.setAttribute('d', buildPath(0, 1))
      if (path2Ref.current) path2Ref.current.setAttribute('d', buildPath(1.3, 0.75))
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
          ref={path1Ref}
          d="M 40 0 L 40 1000"
          fill="none"
          stroke="#ffffff"
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity="1"
        />
        <path
          ref={path2Ref}
          d="M 40 0 L 40 1000"
          fill="none"
          stroke="#ffffff"
          strokeWidth="0.8"
          strokeLinecap="round"
          opacity="0.6"
        />
      </svg>
    </div>
  )
}
