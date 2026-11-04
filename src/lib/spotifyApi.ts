import type { Track } from '../data/music'

const uriCache = new Map<string, string>()

async function spotifyFetch(token: string, path: string, init?: RequestInit) {
  const res = await fetch(`https://api.spotify.com/v1${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    },
  })
  if (res.status === 204) return null
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || `Spotify API ${res.status}`)
  }
  const ct = res.headers.get('content-type') || ''
  if (ct.includes('application/json')) return res.json()
  return null
}

export async function getSpotifyProfile(token: string) {
  return spotifyFetch(token, '/me') as Promise<{
    id: string
    display_name: string | null
    product?: string
    images?: { url: string }[]
  }>
}

export async function resolveSpotifyUri(
  token: string,
  track: Track,
): Promise<string | null> {
  const cached = uriCache.get(track.id)
  if (cached) return cached

  const q = `track:${track.title} artist:${track.artist.split(',')[0].trim()}`
  const data = (await spotifyFetch(
    token,
    `/search?${new URLSearchParams({ q, type: 'track', limit: '5' })}`,
  )) as {
    tracks?: {
      items: { uri: string; name: string; artists: { name: string }[] }[]
    }
  }

  const items = data?.tracks?.items || []
  if (!items.length) return null

  const titleNorm = track.title.toLowerCase()
  const artistNorm = track.artist.toLowerCase()
  const best =
    items.find(
      (t) =>
        t.name.toLowerCase().includes(titleNorm.slice(0, 12)) ||
        titleNorm.includes(t.name.toLowerCase().slice(0, 12)),
    ) ||
    items.find((t) =>
      t.artists.some((a) => artistNorm.includes(a.name.toLowerCase())),
    ) ||
    items[0]

  uriCache.set(track.id, best.uri)
  return best.uri
}

export async function playSpotifyUri(
  token: string,
  deviceId: string,
  uri: string,
) {
  await spotifyFetch(token, `/me/player/play?device_id=${encodeURIComponent(deviceId)}`, {
    method: 'PUT',
    body: JSON.stringify({ uris: [uri] }),
  })
}

export async function pauseSpotify(token: string, deviceId?: string) {
  const q = deviceId ? `?device_id=${encodeURIComponent(deviceId)}` : ''
  await spotifyFetch(token, `/me/player/pause${q}`, { method: 'PUT' })
}

export async function resumeSpotify(token: string, deviceId?: string) {
  const q = deviceId ? `?device_id=${encodeURIComponent(deviceId)}` : ''
  await spotifyFetch(token, `/me/player/play${q}`, { method: 'PUT' })
}

export async function seekSpotify(token: string, positionMs: number, deviceId?: string) {
  const params = new URLSearchParams({ position_ms: String(Math.floor(positionMs)) })
  if (deviceId) params.set('device_id', deviceId)
  await spotifyFetch(token, `/me/player/seek?${params}`, { method: 'PUT' })
}

export async function setSpotifyVolume(token: string, volumePercent: number, deviceId?: string) {
  const params = new URLSearchParams({
    volume_percent: String(Math.round(Math.min(100, Math.max(0, volumePercent)))),
  })
  if (deviceId) params.set('device_id', deviceId)
  await spotifyFetch(token, `/me/player/volume?${params}`, { method: 'PUT' })
}

export async function transferPlayback(token: string, deviceId: string, play = false) {
  await spotifyFetch(token, '/me/player', {
    method: 'PUT',
    body: JSON.stringify({ device_ids: [deviceId], play }),
  })
}

export async function getSpotifyDevices(token: string) {
  const data = (await spotifyFetch(token, '/me/player/devices')) as {
    devices: {
      id: string
      name: string
      type: string
      is_active: boolean
      volume_percent: number | null
    }[]
  }
  return data?.devices || []
}
