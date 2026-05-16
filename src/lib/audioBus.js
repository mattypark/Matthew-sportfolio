// Singleton audio player + Web Audio analyser.
// Subscribers receive Uint8Array of frequency bins on every frame while playing.

const DEFAULT_TRACK = '/audio/through-my-system.mp3'

let audio = null
let ctx = null
let analyser = null
let dataArr = null
let raf = null
let playing = false
let currentSrc = DEFAULT_TRACK

const fftSubs = new Set()
const stateSubs = new Set()

function ensureAudio() {
  if (audio) return
  audio = new Audio(currentSrc)
  audio.loop = true
  audio.preload = 'auto'
  audio.crossOrigin = 'anonymous'
  audio.addEventListener('ended', () => {
    playing = false
    stop()
    stateSubs.forEach((cb) => cb(false))
  })
}

function ensureCtx() {
  if (ctx) return
  const AC = window.AudioContext || window.webkitAudioContext
  ctx = new AC()
  const src = ctx.createMediaElementSource(audio)
  analyser = ctx.createAnalyser()
  analyser.fftSize = 256
  analyser.smoothingTimeConstant = 0.78
  dataArr = new Uint8Array(analyser.frequencyBinCount)
  src.connect(analyser)
  analyser.connect(ctx.destination)
}

function tick() {
  if (!analyser) return
  analyser.getByteFrequencyData(dataArr)
  fftSubs.forEach((cb) => cb(dataArr))
  raf = requestAnimationFrame(tick)
}

function stop() {
  if (raf) cancelAnimationFrame(raf)
  raf = null
  if (dataArr) {
    const empty = new Uint8Array(dataArr.length)
    fftSubs.forEach((cb) => cb(empty))
  }
}

// Switch the track source. If called BEFORE the audio element is created (ie before
// the user first toggles play), we just update `currentSrc` and the next `ensureAudio()`
// call will use it. If called AFTER, we update the existing element's `src` in place
// — but we deliberately skip if Web Audio context already wired the original element
// (changing src on a connected MediaElementSource is allowed and reroutes through analyser).
export function setTrack(url) {
  if (!url || url === currentSrc) return
  currentSrc = url
  if (audio) {
    const wasPlaying = playing
    audio.src = url
    audio.load()
    if (wasPlaying) {
      audio.play().catch(() => {})
    }
  }
}

export async function toggle() {
  ensureAudio()
  if (playing) {
    audio.pause()
    playing = false
    stop()
  } else {
    ensureCtx()
    if (ctx.state === 'suspended') {
      try { await ctx.resume() } catch {}
    }
    try {
      await audio.play()
      playing = true
      raf = requestAnimationFrame(tick)
    } catch (e) {
      playing = false
    }
  }
  stateSubs.forEach((cb) => cb(playing))
  return playing
}

export function subscribeFFT(cb) {
  fftSubs.add(cb)
  return () => fftSubs.delete(cb)
}

export function subscribeState(cb) {
  stateSubs.add(cb)
  cb(playing)
  return () => stateSubs.delete(cb)
}

export function isPlaying() {
  return playing
}
