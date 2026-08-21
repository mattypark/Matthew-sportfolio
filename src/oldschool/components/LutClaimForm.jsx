import React, { useRef, useState } from 'react'
import { claim } from '../data/lut'

// Phone screenshots run 2–5MB and Vercel caps a request body at 4.5MB, so the
// file is redrawn through a canvas before it ever leaves the browser. 1600px
// long edge at q0.8 lands around 300KB and is still easily readable.
const MAX_EDGE = 1600
const JPEG_QUALITY = 0.8
const MAX_INPUT_BYTES = 15 * 1024 * 1024

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function downscale(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()

    img.onload = () => {
      URL.revokeObjectURL(url)
      const scale = Math.min(1, MAX_EDGE / Math.max(img.width, img.height))
      const canvas = document.createElement('canvas')
      canvas.width = Math.round(img.width * scale)
      canvas.height = Math.round(img.height * scale)
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        reject(new Error('canvas unavailable'))
        return
      }
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      resolve(canvas.toDataURL('image/jpeg', JPEG_QUALITY))
    }

    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('That file did not open as an image.'))
    }

    img.src = url
  })
}

const FIELD =
  'w-full bg-transparent border-b border-border py-2 font-ibm text-sm text-foreground placeholder:text-muted-foreground focus:border-foreground focus:outline-none transition-colors'

const LutClaimForm = () => {
  const [email, setEmail] = useState('')
  const [platform, setPlatform] = useState(claim.platforms[0])
  const [postUrl, setPostUrl] = useState('')
  const [screenshot, setScreenshot] = useState(null)
  const [fileName, setFileName] = useState('')
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')
  const honeypotRef = useRef(null)

  const handleFile = async (event) => {
    const file = event.target.files?.[0]
    setError('')
    if (!file) {
      setScreenshot(null)
      setFileName('')
      return
    }
    if (file.size > MAX_INPUT_BYTES) {
      setError('That screenshot is enormous. Anything under 15MB works.')
      return
    }

    try {
      setScreenshot(await downscale(file))
      setFileName(file.name)
    } catch (err) {
      setError(err.message || 'Could not read that screenshot.')
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    if (!EMAIL_RE.test(email)) {
      setError('That email does not look right.')
      return
    }
    if (!screenshot) {
      setError('Add a screenshot of the repost so I can check it.')
      return
    }

    setStatus('sending')

    try {
      const response = await fetch('/api/lut-claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          platform,
          postUrl,
          screenshot,
          website: honeypotRef.current?.value || '',
        }),
      })

      if (!response.ok) throw new Error('relay failed')
      setStatus('sent')
    } catch {
      setStatus('idle')
      setError(`That did not go through. Email the screenshot to ${claim.email} and I will send it over.`)
    }
  }

  if (status === 'sent') {
    return (
      <div className="border border-border rounded-2xl p-8 max-w-xl">
        <p className="font-instrument text-3xl tracking-tight mb-3">Got it.</p>
        <p className="font-ibm text-sm leading-relaxed text-foreground/70">
          I check these by hand, usually the same day. When it clears, the .cube lands
          in your inbox at <span className="text-foreground">{email}</span>.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 max-w-xl">
      {/* Honeypot — same trick as api/subscribe.js */}
      <input
        ref={honeypotRef}
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute h-0 w-0 opacity-0 -z-10"
      />

      <label className="flex flex-col gap-2">
        <span className="font-ibm text-[10px] uppercase tracking-widest text-muted-foreground">Your email</span>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className={FIELD}
        />
      </label>

      <label className="flex flex-col gap-2">
        <span className="font-ibm text-[10px] uppercase tracking-widest text-muted-foreground">Where you posted it</span>
        <select value={platform} onChange={(e) => setPlatform(e.target.value)} className={FIELD}>
          {claim.platforms.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-2">
        <span className="font-ibm text-[10px] uppercase tracking-widest text-muted-foreground">
          Link to the post <span className="normal-case tracking-normal">(optional)</span>
        </span>
        <input
          type="url"
          value={postUrl}
          onChange={(e) => setPostUrl(e.target.value)}
          placeholder="https://"
          className={FIELD}
        />
      </label>

      <label className="flex flex-col gap-2">
        <span className="font-ibm text-[10px] uppercase tracking-widest text-muted-foreground">Screenshot of the repost</span>
        <input
          type="file"
          accept="image/*"
          onChange={handleFile}
          className="font-ibm text-xs text-muted-foreground file:mr-4 file:rounded-full file:border file:border-border file:bg-transparent file:px-4 file:py-2 file:font-ibm file:text-xs file:text-foreground hover:file:border-foreground file:transition-colors file:cursor-pointer"
        />
        {fileName && (
          <span className="font-ibm text-[11px] text-muted-foreground">Attached: {fileName}</span>
        )}
      </label>

      {error && <p className="font-ibm text-xs text-destructive leading-relaxed">{error}</p>}

      <button
        type="submit"
        disabled={status === 'sending'}
        className="self-start rounded-full border border-foreground px-6 py-3 font-ibm text-xs uppercase tracking-widest hover:bg-foreground hover:text-background disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-foreground transition-colors"
      >
        {status === 'sending' ? 'Sending…' : 'Send it over'}
      </button>
    </form>
  )
}

export default LutClaimForm
