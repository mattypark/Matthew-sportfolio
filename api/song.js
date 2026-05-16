// Vercel serverless function: returns current "song of the week" from Spotify.
//
// Strategy:
//   - Fetches top track (time_range=short_term ≈ last 4 weeks) limit 1
//   - Counts plays this week (from last Sunday 00:00 America/New_York onward) via recently-played
//   - Enriches with iTunes Search preview URL (~30s MP3, free, no auth)
//   - Cache-Control set to expire at the next Sunday 00:00 America/New_York, so the CDN
//     serves stale data till then and naturally refreshes on Sunday rollover.
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

    const item = top.items?.[0]
    if (!item) {
      res.setHeader('Cache-Control', 'no-store')
      res.status(200).json({ ok: false, reason: 'no_top_track' })
      return
    }

    const weekStartMs = lastSundayMidnightET()
    const plays = (recent.items || []).filter((p) => {
      if (p.track?.id !== item.id) return false
      return new Date(p.played_at).getTime() >= weekStartMs
    }).length

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
