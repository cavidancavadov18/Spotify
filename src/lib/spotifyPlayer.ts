import { getValidAccessToken } from './spotifyAuth'

declare global {
  interface Window {
    onSpotifyWebPlaybackSDKReady: () => void
    Spotify: {
      Player: new (options: {
        name: string
        getOAuthToken: (cb: (token: string) => void) => void
        volume?: number
      }) => SpotifyPlayer
    }
  }
}

export type SpotifyPlayer = {
  connect: () => Promise<boolean>
  disconnect: () => void
  addListener: (event: string, cb: (state: unknown) => void) => void
  removeListener: (event: string, cb?: (state: unknown) => void) => void
  getCurrentState: () => Promise<SpotifyPlaybackState | null>
  setVolume: (volume: number) => Promise<void>
  pause: () => Promise<void>
  resume: () => Promise<void>
  seek: (positionMs: number) => Promise<void>
  previousTrack: () => Promise<void>
  nextTrack: () => Promise<void>
}

export type SpotifyPlaybackState = {
  paused: boolean
  position: number
  duration: number
  track_window: {
    current_track: {
      name: string
      uri: string
      artists: { name: string }[]
    } | null
  }
}

let sdkPromise: Promise<void> | null = null

export function loadSpotifySdk() {
  if (typeof window === 'undefined') return Promise.resolve()
  if (window.Spotify) return Promise.resolve()
  if (sdkPromise) return sdkPromise
  sdkPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector('script[data-spotify-sdk]')
    if (existing) {
      window.onSpotifyWebPlaybackSDKReady = () => resolve()
      return
    }
    window.onSpotifyWebPlaybackSDKReady = () => resolve()
    const script = document.createElement('script')
    script.src = 'https://sdk.scdn.co/spotify-player.js'
    script.async = true
    script.dataset.spotifySdk = '1'
    script.onerror = () => reject(new Error('Spotify SDK yüklənmədi'))
    document.body.appendChild(script)
  })
  return sdkPromise
}

export async function createSpotifyPlayer(opts: {
  name?: string
  volume?: number
  onReady: (deviceId: string) => void
  onNotReady?: (deviceId: string) => void
  onState?: (state: SpotifyPlaybackState | null) => void
  onError?: (message: string) => void
}) {
  await loadSpotifySdk()
  const player = new window.Spotify.Player({
    name: opts.name || 'Spotify Web Player Clone',
    getOAuthToken: (cb) => {
      void getValidAccessToken().then((token) => {
        if (token) cb(token)
        else opts.onError?.('Spotify token yoxdur — yenidən Connect et')
      })
    },
    volume: opts.volume ?? 0.7,
  })

  player.addListener('ready', (data) => {
    const { device_id } = data as { device_id: string }
    opts.onReady(device_id)
  })
  player.addListener('not_ready', (data) => {
    const { device_id } = data as { device_id: string }
    opts.onNotReady?.(device_id)
  })
  player.addListener('player_state_changed', (state) => {
    opts.onState?.(state as SpotifyPlaybackState | null)
  })
  player.addListener('initialization_error', (e) => {
    opts.onError?.((e as { message?: string }).message || 'SDK init error')
  })
  player.addListener('authentication_error', (e) => {
    opts.onError?.((e as { message?: string }).message || 'Auth error — Premium + Connect')
  })
  player.addListener('account_error', (e) => {
    opts.onError?.((e as { message?: string }).message || 'Spotify Premium lazımdır')
  })
  player.addListener('playback_error', (e) => {
    opts.onError?.((e as { message?: string }).message || 'Playback error')
  })

  const ok = await player.connect()
  if (!ok) throw new Error('Spotify player connect alınmadı')
  return player
}
