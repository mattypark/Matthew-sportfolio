// One-time Spotify auth helper.
//
// Usage:
//   1. Fill SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REDIRECT_URI in .env.local
//      (default redirect uri: http://127.0.0.1:8888/callback — must also be added in the Spotify dashboard)
//   2. Run: node scripts/spotify-auth.mjs
//   3. Browser will open. Approve.
//   4. Terminal prints SPOTIFY_REFRESH_TOKEN — paste it back into .env.local AND Vercel env vars.
//
// This script is read-once. Refresh tokens live indefinitely until you revoke them.

import { createServer } from 'node:http'
import { readFileSync } from 'node:fs'
import { exec } from 'node:child_process'
import { URL } from 'node:url'
import { randomBytes } from 'node:crypto'

const ENV_PATH = new URL('../.env.local', import.meta.url)
const env = Object.fromEntries(
  readFileSync(ENV_PATH, 'utf8')
    .split('\n')
    .filter((l) => l && !l.startsWith('#'))
    .map((l) => {
      const idx = l.indexOf('=')
      return [l.slice(0, idx).trim(), l.slice(idx + 1).trim()]
    })
)

const CLIENT_ID = env.SPOTIFY_CLIENT_ID
const CLIENT_SECRET = env.SPOTIFY_CLIENT_SECRET
const REDIRECT_URI = env.SPOTIFY_REDIRECT_URI || 'http://127.0.0.1:8888/callback'

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error('Missing SPOTIFY_CLIENT_ID or SPOTIFY_CLIENT_SECRET in .env.local')
  process.exit(1)
}

const PORT = Number(new URL(REDIRECT_URI).port) || 8888
const SCOPES = ['user-top-read', 'user-read-recently-played'].join(' ')
const STATE = randomBytes(8).toString('hex')

const authUrl =
  'https://accounts.spotify.com/authorize?' +
  new URLSearchParams({
    response_type: 'code',
    client_id: CLIENT_ID,
    scope: SCOPES,
    redirect_uri: REDIRECT_URI,
    state: STATE,
  }).toString()

const server = createServer(async (req, res) => {
  const u = new URL(req.url, REDIRECT_URI)
  if (u.pathname !== new URL(REDIRECT_URI).pathname) {
    res.writeHead(404).end()
    return
  }
  const code = u.searchParams.get('code')
  const state = u.searchParams.get('state')
  if (!code || state !== STATE) {
    res.writeHead(400).end('Missing code or bad state')
    server.close()
    process.exit(1)
  }

  try {
    const tokenRes = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: 'Basic ' + Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64'),
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: REDIRECT_URI,
      }),
    })
    const data = await tokenRes.json()
    if (!data.refresh_token) {
      res.writeHead(500).end('No refresh_token in response — see terminal')
      console.error('Token response:', data)
      server.close()
      process.exit(1)
    }
    res.writeHead(200, { 'Content-Type': 'text/html' }).end(
      `<html><body style="font-family:system-ui;padding:40px;background:#0a0a0a;color:#e2d0a8"><h1>Done</h1><p>Refresh token printed in your terminal. Paste it into <code>.env.local</code> and Vercel env vars.</p></body></html>`
    )

    console.log('\n=========================================')
    console.log('SUCCESS — copy the line below into .env.local AND Vercel env vars:')
    console.log('=========================================\n')
    console.log(`SPOTIFY_REFRESH_TOKEN=${data.refresh_token}\n`)
    console.log('Scopes granted:', data.scope)
    console.log('Access token expires in (s):', data.expires_in)

    server.close()
    process.exit(0)
  } catch (e) {
    console.error(e)
    res.writeHead(500).end('Error — see terminal')
    server.close()
    process.exit(1)
  }
})

server.listen(PORT, '127.0.0.1', () => {
  console.log(`Listening on ${REDIRECT_URI}`)
  console.log('Opening browser to authorize…')
  const opener = process.platform === 'darwin' ? 'open' : process.platform === 'win32' ? 'start' : 'xdg-open'
  exec(`${opener} "${authUrl}"`)
})
