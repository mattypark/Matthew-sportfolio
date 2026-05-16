import { useEffect, useState } from 'react'
import { toggle, subscribeState, subscribeFFT, isPlaying } from '../lib/audioBus'

export default function AudioPrompt() {
  const [playing, setPlaying] = useState(false)
  const [level, setLevel] = useState(0)
  const [promptOpen, setPromptOpen] = useState(true)
  const [fading, setFading] = useState(false)

  useEffect(() => subscribeState((p) => {
    setPlaying(p)
    if (p) {
      // Auto-dismiss prompt when audio actually starts playing
      setFading(true)
      setTimeout(() => setPromptOpen(false), 450)
    }
  }), [])

  useEffect(() => {
    return subscribeFFT((data) => {
      let sum = 0
      const end = Math.min(data.length, 24)
      for (let i = 2; i < end; i++) sum += data[i]
      setLevel(sum / (end - 2) / 255)
    })
  }, [])

  const handleTurnOn = async () => {
    setFading(true)
    if (!isPlaying()) await toggle()
    setTimeout(() => setPromptOpen(false), 450)
  }

  const handleSkip = () => {
    setFading(true)
    setTimeout(() => setPromptOpen(false), 450)
  }

  const ring = 1 + level * 0.35

  return (
    <>
      {promptOpen && (
        <div
          className="audio-prompt"
          style={{
            opacity: fading ? 0 : 1,
            transform: fading ? 'translateY(8px) scale(0.96)' : 'translateY(0) scale(1)',
            transition: 'opacity 400ms ease, transform 400ms ease',
          }}
        >
          <div className="eq">
            <i style={{ height: 6 }} />
            <i style={{ height: 10 }} />
            <i style={{ height: 8 }} />
          </div>
          <div className="copy">
            <b>AUDIO IS HALF THE PORTFOLIO</b>
          </div>
          <div className="actions">
            <button className="on" onClick={handleTurnOn}>TURN ON</button>
            <button onClick={handleSkip}>SKIP</button>
          </div>
        </div>
      )}

      <button
        onClick={() => { toggle() }}
        aria-label={playing ? 'Pause sound' : 'Play sound'}
        className="fixed bottom-6 right-7 z-[60]"
        style={{ width: 52, height: 52 }}
      >
        <span
          className="absolute inset-0 rounded-full"
          style={{
            background: playing ? 'var(--primary)' : 'var(--ink)',
            border: '1px solid var(--ink)',
            transform: `scale(${ring})`,
            transition: 'background 0.25s ease, transform 0.08s linear',
            boxShadow: playing
              ? `0 0 ${8 + level * 28}px rgba(230,62,33,${0.25 + level * 0.5})`
              : 'none',
          }}
        />
        <span
          className="absolute inset-0 rounded-full grid place-items-center"
          style={{ color: 'var(--paper)' }}
        >
          {playing ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="5" width="4" height="14" />
              <rect x="14" y="5" width="4" height="14" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="7,5 19,12 7,19" />
            </svg>
          )}
        </span>
      </button>
    </>
  )
}
