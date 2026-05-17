// Vercel serverless function: returns "song of the week" from Spotify.
//
// Strategy:
//   - Window = LAST full week (prev Sunday 00:00 ET → this Sunday 00:00 ET). Current week
//     starts at 0 plays so we report the completed prior week instead.
//   - Reads recently-played (max 50), filters to window, counts plays per track, picks
//     the most-played track as "song of the week".
//   - Falls back to Spotify top-tracks (short_term) if window is empty (eg quiet week).
//   - Enriches with iTunes Search preview URL (~30s MP3, free, no auth).
//   - Cache-Control expires at next Sunday 00:00 ET — CDN holds the snapshot, naturally
//     refreshes on rollover.
//
// Env required: SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REFRESH_TOKEN

const TOKEN_URL = 'https://accounts.spotify.com/api/token'
const TOP_URL = 'https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=1'
const RECENT_URL = 'https://api.spotify.com/v1/me/player/recently-played?limit=50'

// Returns the timestamp (UTC ms) of the most recent past Sunday 00:00 in America/New_York.
function lastSundayMidnightET() {
  const now = new Date()
  const fmt = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    weekday: 'short',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })
  const parts = Object.fromEntries(fmt.formatToParts(now).map((p) => [p.type, p.value]))
  const weekdayMap = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }
  const dow = weekdayMap[parts.weekday]
  const etNow = new Date(`${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}:${parts.second}Z`)
  const offsetMs = etNow.getTime() - now.getTime()
  const etMidnightTodayUtc = new Date(`${parts.year}-${parts.month}-${parts.day}T00:00:00Z`).getTime() - offsetMs
  return etMidnightTodayUtc - dow * 24 * 60 * 60 * 1000
}

function secondsUntilNextSundayMidnightET() {
  const lastSun = lastSundayMidnightET()
  const nextSun = lastSun + 7 * 24 * 60 * 60 * 1000
  return Math.max(60, Math.floor((nextSun - Date.now()) / 1000))
}

async function getAccessToken() {
  const r = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization:
        'Basic ' +
        Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64'),
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: process.env.SPOTIFY_REFRESH_TOKEN,
    }),
  })
  if (!r.ok) throw new Error(`token ${r.status}`)
  const j = await r.json()
  return j.access_token
}

async function getItunesPreview(title, artist) {
  try {
    const term = encodeURIComponent(`${title} ${artist}`.trim())
    const r = await fetch(`https://itunes.apple.com/search?term=${term}&entity=song&limit=1`)
    if (!r.ok) return null
    const j = await r.json()
    return j.results?.[0]?.previewUrl || null
  } catch {
    return null
  }
}

export default async function handler(req, res) {
  try {
    if (!process.env.SPOTIFY_REFRESH_TOKEN) {
      res.setHeader('Cache-Control', 'no-store')
      res.status(200).json({
        ok: false,
        reason: 'no_refresh_token',
        title: 'Through My System',
        artist: "it's murph, Arlo, Emi Grace",
        plays: 47,
        previewUrl: null,
      })
      return
    }

    const token = await getAccessToken()
    const [topRes, recentRes] = await Promise.all([
      fetch(TOP_URL, { headers: { Authorization: `Bearer ${token}` } }),
      fetch(RECENT_URL, { headers: { Authorization: `Bearer ${token}` } }),
    ])
    if (!topRes.ok) throw new Error(`top ${topRes.status}`)
    if (!recentRes.ok) throw new Error(`recent ${recentRes.status}`)
    const top = await topRes.json()
    const recent = await recentRes.json()

    // Last full week window: [prevSun, thisSun)
    const thisSunMs = lastSundayMidnightET()
    const prevSunMs = thisSunMs - 7 * 24 * 60 * 60 * 1000

    // Count plays per track within last week's window
    const counts = new Map()
    const trackById = new Map()
    for (const p of recent.items || []) {
      const t = new Date(p.played_at).getTime()
      if (t < prevSunMs || t >= thisSunMs) continue
      const tr = p.track
      if (!tr?.id) continue
      counts.set(tr.id, (counts.get(tr.id) || 0) + 1)
      if (!trackById.has(tr.id)) trackById.set(tr.id, tr)
    }

    // Pick most-played track from window; fallback to Spotify top short_term
    let item = null
    let plays = 0
    if (counts.size > 0) {
      let bestId = null
      let bestCount = 0
      for (const [id, c] of counts) {
        if (c > bestCount) { bestCount = c; bestId = id }
      }
      item = trackById.get(bestId)
      plays = bestCount
    } else {
      item = top.items?.[0]
      plays = 0
    }

    if (!item) {
      res.setHeader('Cache-Control', 'no-store')
      res.status(200).json({ ok: false, reason: 'no_top_track' })
      return
    }

    const previewUrl = await getItunesPreview(item.name, item.artists[0]?.name || '')

    const payload = {
      ok: true,
      title: item.name,
      artist: item.artists.map((a) => a.name).join(', '),
      plays,
      url: item.external_urls?.spotify || null,
      album: item.album?.name || null,
      image: item.album?.images?.[0]?.url || null,
      previewUrl,
    }

    const ttl = secondsUntilNextSundayMidnightET()
    res.setHeader('Cache-Control', `public, s-maxage=${ttl}, stale-while-revalidate=86400`)
    res.status(200).json(payload)
  } catch (e) {
    res.setHeader('Cache-Control', 'no-store')
    res.status(200).json({
      ok: false,
      reason: 'error',
      message: String(e.message || e),
      title: 'Through My System',
      artist: "it's murph, Arlo, Emi Grace",
      plays: 47,
      previewUrl: null,
    })
  }
}
