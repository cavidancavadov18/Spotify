import { loadJSON, saveJSON } from './storage'

const CLIENT_ID_KEY = 'clientId'
const TOKEN_KEY = 'authToken'
const VERIFIER_KEY = 'pkceVerifier'

export const SPOTIFY_SCOPES = [
  'streaming',
  'user-read-email',
  'user-read-private',
  'user-read-playback-state',
  'user-modify-playback-state',
].join(' ')

export type SpotifyToken = {
  access_token: string
  refresh_token?: string
  expires_at: number
  token_type: string
  scope?: string
}

export function getSpotifyClientId() {
  const fromEnv = (import.meta.env.VITE_SPOTIFY_CLIENT_ID as string | undefined)?.trim()
  if (fromEnv) return fromEnv
  return (loadJSON<string>(CLIENT_ID_KEY, '') || '').trim()
}

export function setSpotifyClientId(id: string) {
  saveJSON(CLIENT_ID_KEY, id.trim())
}

export function getRedirectUri() {
  // Must match Spotify Dashboard Redirect URI exactly (no hash).
  return `${window.location.origin}/`
}

function randomString(length: number) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~'
  const values = crypto.getRandomValues(new Uint8Array(length))
  return Array.from(values, (v) => chars[v % chars.length]).join('')
}

async function sha256Base64Url(plain: string) {
  const data = new TextEncoder().encode(plain)
  const digest = await crypto.subtle.digest('SHA-256', data)
  const bytes = new Uint8Array(digest)
  let str = ''
  bytes.forEach((b) => {
    str += String.fromCharCode(b)
  })
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

export function getStoredToken(): SpotifyToken | null {
  return loadJSON<SpotifyToken | null>(TOKEN_KEY, null)
}

export function clearStoredToken() {
  saveJSON(TOKEN_KEY, null)
}

export function saveToken(token: SpotifyToken) {
  saveJSON(TOKEN_KEY, token)
}

export async function beginSpotifyLogin(clientId = getSpotifyClientId()) {
  if (!clientId) throw new Error('Spotify Client ID lazımdır')
  const verifier = randomString(64)
  const challenge = await sha256Base64Url(verifier)
  saveJSON(VERIFIER_KEY, verifier)

  const params = new URLSearchParams({
    client_id: clientId,
    response_type: 'code',
    redirect_uri: getRedirectUri(),
    scope: SPOTIFY_SCOPES,
    code_challenge_method: 'S256',
    code_challenge: challenge,
    state: randomString(16),
  })
  window.location.assign(`https://accounts.spotify.com/authorize?${params}`)
}

export async function exchangeCodeForToken(code: string, clientId = getSpotifyClientId()) {
  const verifier = loadJSON<string | null>(VERIFIER_KEY, null)
  if (!verifier) throw new Error('PKCE verifier tapılmadı — yenidən Connect et')
  if (!clientId) throw new Error('Spotify Client ID lazımdır')

  const body = new URLSearchParams({
    client_id: clientId,
    grant_type: 'authorization_code',
    code,
    redirect_uri: getRedirectUri(),
    code_verifier: verifier,
  })

  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Token alınmadı (${res.status}): ${text}`)
  }
  const json = (await res.json()) as {
    access_token: string
    refresh_token?: string
    expires_in: number
    token_type: string
    scope?: string
  }
  const token: SpotifyToken = {
    access_token: json.access_token,
    refresh_token: json.refresh_token,
    expires_at: Date.now() + json.expires_in * 1000 - 30_000,
    token_type: json.token_type,
    scope: json.scope,
  }
  saveToken(token)
  saveJSON(VERIFIER_KEY, null)
  return token
}

async function refreshAccessToken(token: SpotifyToken, clientId: string) {
  if (!token.refresh_token) throw new Error('Refresh token yoxdur')
  const body = new URLSearchParams({
    client_id: clientId,
    grant_type: 'refresh_token',
    refresh_token: token.refresh_token,
  })
  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  })
  if (!res.ok) throw new Error('Token yenilənmədi')
  const json = (await res.json()) as {
    access_token: string
    refresh_token?: string
    expires_in: number
    token_type: string
    scope?: string
  }
  const next: SpotifyToken = {
    access_token: json.access_token,
    refresh_token: json.refresh_token || token.refresh_token,
    expires_at: Date.now() + json.expires_in * 1000 - 30_000,
    token_type: json.token_type,
    scope: json.scope || token.scope,
  }
  saveToken(next)
  return next
}

export async function getValidAccessToken(): Promise<string | null> {
  const clientId = getSpotifyClientId()
  let token = getStoredToken()
  if (!token?.access_token || !clientId) return null
  if (Date.now() >= token.expires_at) {
    try {
      token = await refreshAccessToken(token, clientId)
    } catch {
      clearStoredToken()
      return null
    }
  }
  return token.access_token
}

/** Handle ?code= from Spotify redirect; strips query without full reload. */
export async function consumeAuthRedirect(): Promise<'ok' | 'none' | 'error'> {
  const url = new URL(window.location.href)
  const code = url.searchParams.get('code')
  const err = url.searchParams.get('error')
  if (!code && !err) return 'none'
  url.search = ''
  window.history.replaceState({}, '', url.pathname + url.hash)
  if (err) return 'error'
  try {
    await exchangeCodeForToken(code!)
    return 'ok'
  } catch {
    return 'error'
  }
}
