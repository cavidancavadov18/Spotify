import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import {
  getTrack,
  playlists as seedPlaylists,
  tracks,
  type Playlist,
  type Track,
} from '../data/music'
import { loadJSON, saveJSON } from '../lib/storage'
import {
  beginSpotifyLogin,
  clearStoredToken,
  consumeAuthRedirect,
  getSpotifyClientId,
  getValidAccessToken,
} from '../lib/spotifyAuth'
import {
  getSpotifyProfile,
  pauseSpotify,
  playSpotifyUri,
  resolveSpotifyUri,
  resumeSpotify,
  seekSpotify,
  setSpotifyVolume,
  transferPlayback,
} from '../lib/spotifyApi'
import {
  createSpotifyPlayer,
  type SpotifyPlayer,
  type SpotifyPlaybackState,
} from '../lib/spotifyPlayer'

export type RepeatMode = 'off' | 'all' | 'one'
export type LibraryFilter = 'all' | 'playlists' | 'artists' | 'albums'
export type View =
  | { type: 'home' }
  | { type: 'search' }
  | { type: 'library' }
  | { type: 'playlist'; id: string }
  | { type: 'album'; id: string }
  | { type: 'artist'; id: string }
  | { type: 'profile' }
  | { type: 'settings' }

export type Toast = { id: number; message: string }
export type ContextMenuState = {
  x: number
  y: number
  track: Track
} | null

type PlayerContextValue = {
  view: View
  setView: (view: View) => void
  goBack: () => void
  goForward: () => void
  canGoBack: boolean
  canGoForward: boolean
  currentTrack: Track | null
  queue: Track[]
  queueIndex: number
  isPlaying: boolean
  isBuffering: boolean
  playbackError: string | null
  volume: number
  muted: boolean
  shuffle: boolean
  repeat: RepeatMode
  likedIds: Set<string>
  recentlyPlayedIds: string[]
  searchQuery: string
  setSearchQuery: (q: string) => void
  playTrack: (track: Track, queue?: Track[]) => void
  togglePlay: () => void
  next: () => void
  prev: () => void
  seek: (time: number) => void
  setVolume: (v: number) => void
  toggleMute: () => void
  toggleShuffle: () => void
  cycleRepeat: () => void
  toggleLike: (trackId: string) => void
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  libraryCollapsed: boolean
  toggleLibraryCollapsed: () => void
  setLibraryCollapsed: (collapsed: boolean) => void
  queueOpen: boolean
  setQueueOpen: (open: boolean) => void
  toggleQueue: () => void
  rightPanelOpen: boolean
  setRightPanelOpen: (open: boolean) => void
  toggleRightPanel: () => void
  profileMenuOpen: boolean
  setProfileMenuOpen: (open: boolean) => void
  notificationsOpen: boolean
  setNotificationsOpen: (open: boolean) => void
  friendsOpen: boolean
  setFriendsOpen: (open: boolean) => void
  activeDeviceId: string
  setActiveDeviceId: (id: string) => void
  isFullscreen: boolean
  toggleFullscreen: () => void
  createPlaylistOpen: boolean
  setCreatePlaylistOpen: (open: boolean) => void
  addToPlaylistTrack: Track | null
  setAddToPlaylistTrack: (track: Track | null) => void
  contextMenu: ContextMenuState
  openContextMenu: (e: React.MouseEvent, track: Track) => void
  closeContextMenu: () => void
  lyricsOpen: boolean
  setLyricsOpen: (open: boolean) => void
  devicesOpen: boolean
  setDevicesOpen: (open: boolean) => void
  premiumOpen: boolean
  setPremiumOpen: (open: boolean) => void
  libraryFilter: LibraryFilter
  setLibraryFilter: (f: LibraryFilter) => void
  customPlaylists: Playlist[]
  allPlaylists: Playlist[]
  createPlaylist: (name: string, description?: string) => string
  renamePlaylist: (playlistId: string, name: string, description?: string) => void
  deletePlaylist: (playlistId: string) => void
  addTrackToPlaylist: (playlistId: string, trackId: string) => void
  removeTrackFromPlaylist: (playlistId: string, trackId: string) => void
  reorderPlaylistTracks: (playlistId: string, fromIndex: number, toIndex: number) => void
  addToQueue: (track: Track) => void
  playNext: (track: Track) => void
  playFromQueue: (index: number) => void
  clearUpcoming: () => void
  toasts: Toast[]
  pushToast: (message: string) => void
  dismissToast: (id: number) => void
  displayName: string
  setDisplayName: (name: string) => void
  followedArtistIds: Set<string>
  toggleFollowArtist: (artistId: string) => void
  spotifyConnected: boolean
  spotifyReady: boolean
  spotifyUserName: string | null
  spotifyConnectOpen: boolean
  setSpotifyConnectOpen: (open: boolean) => void
  connectSpotify: () => Promise<void>
  disconnectSpotify: () => void
}

const PlayerContext = createContext<PlayerContextValue | null>(null)

type ProgressContextValue = {
  progress: number
  duration: number
}

const ProgressContext = createContext<ProgressContextValue>({
  progress: 0,
  duration: 0,
})

function viewToHash(view: View): string {
  switch (view.type) {
    case 'home':
      return '#/home'
    case 'search':
      return '#/search'
    case 'library':
      return '#/library'
    case 'playlist':
      return `#/playlist/${view.id}`
    case 'album':
      return `#/album/${view.id}`
    case 'artist':
      return `#/artist/${view.id}`
    case 'profile':
      return '#/profile'
    case 'settings':
      return '#/settings'
  }
}

function hashToView(hash: string): View | null {
  const h = hash.replace(/^#\/?/, '')
  if (!h || h === 'home') return { type: 'home' }
  if (h === 'admin' || h.startsWith('admin/')) return null
  if (h === 'search') return { type: 'search' }
  if (h === 'library') return { type: 'library' }
  if (h === 'profile') return { type: 'profile' }
  if (h === 'settings') return { type: 'settings' }
  const [kind, id] = h.split('/')
  if (kind === 'playlist' && id) return { type: 'playlist', id }
  if (kind === 'album' && id) return { type: 'album', id }
  if (kind === 'artist' && id) return { type: 'artist', id }
  return null
}

function buildLikedPlaylist(likedIds: string[]): Playlist {
  return {
    id: 'liked',
    name: 'Liked Songs',
    description: 'Songs you liked',
    cover: '/covers/liked.jpg',
    owner: 'You',
    color: '#5038a0',
    trackIds: likedIds,
  }
}

export function PlayerProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const toastId = useRef(1)
  const skipHashSync = useRef(false)

  const initialView = hashToView(window.location.hash) ?? { type: 'home' as const }

  const [view, setViewState] = useState<View>(initialView)
  const [history, setHistory] = useState<View[]>([initialView])
  const [historyIndex, setHistoryIndex] = useState(0)

  const [currentTrack, setCurrentTrack] = useState<Track | null>(() => {
    const id = loadJSON<string | null>('currentTrackId', tracks[0]?.id ?? null)
    return (id && getTrack(id)) || tracks[0] || null
  })
  const [queue, setQueue] = useState<Track[]>(() => {
    const ids = loadJSON<string[]>('queueIds', tracks.map((t) => t.id))
    const list = ids.map(getTrack).filter(Boolean) as Track[]
    return list.length ? list : tracks
  })
  const [queueIndex, setQueueIndex] = useState(() =>
    loadJSON<number>('queueIndex', 0),
  )
  const [isPlaying, setIsPlaying] = useState(false)
  const [isBuffering, setIsBuffering] = useState(false)
  const [playbackError, setPlaybackError] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)
  const progressRef = useRef(0)
  const progressUiAtRef = useRef(0)
  const [duration, setDuration] = useState(0)

  const pushProgressUi = useCallback((t: number, force = false) => {
    progressRef.current = t
    const now = performance.now()
    if (!force && now - progressUiAtRef.current < 250) return
    progressUiAtRef.current = now
    setProgress(t)
  }, [])
  const [volume, setVolumeState] = useState(() => loadJSON('volume', 0.7))
  const [muted, setMuted] = useState(() => loadJSON('muted', false))
  const [shuffle, setShuffle] = useState(() => loadJSON('shuffle', false))
  const [repeat, setRepeat] = useState<RepeatMode>(() => loadJSON('repeat', 'off'))
  const [likedIds, setLikedIds] = useState<Set<string>>(() => {
    const saved = loadJSON<string[] | null>('likedIds', null)
    if (saved) return new Set(saved)
    return new Set(tracks.filter((t) => t.liked).map((t) => t.id))
  })
  const [recentlyPlayedIds, setRecentlyPlayedIds] = useState<string[]>(() =>
    loadJSON('recentlyPlayedIds', [
      'radio-aygun-kazimova',
      'radio-sezen-aksu',
      'radio-roya',
      'liked',
      'p-az',
      'p-tr',
      'radio-tarkan',
      'radio-tunzale',
    ]),
  )
  const [customPlaylists, setCustomPlaylists] = useState<Playlist[]>(() =>
    loadJSON('customPlaylists', []),
  )
  const [searchQuery, setSearchQuery] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [libraryCollapsed, setLibraryCollapsed] = useState(() =>
    // Prefer expanded so Your Library banners match Spotify empty-state layout
    loadJSON('libraryCollapsedV2', false),
  )
  const [queueOpen, setQueueOpen] = useState(false)
  const [rightPanelOpen, setRightPanelOpen] = useState(true)
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [friendsOpen, setFriendsOpen] = useState(false)
  const [activeDeviceId, setActiveDeviceId] = useState(() =>
    loadJSON('activeDeviceId', 'this-computer'),
  )
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [createPlaylistOpen, setCreatePlaylistOpen] = useState(false)
  const [addToPlaylistTrack, setAddToPlaylistTrack] = useState<Track | null>(null)
  const [contextMenu, setContextMenu] = useState<ContextMenuState>(null)
  const [lyricsOpen, setLyricsOpen] = useState(false)
  const [devicesOpen, setDevicesOpen] = useState(false)
  const [premiumOpen, setPremiumOpen] = useState(false)
  const [libraryFilter, setLibraryFilter] = useState<LibraryFilter>('all')
  const [toasts, setToasts] = useState<Toast[]>([])
  const [displayName, setDisplayNameState] = useState(() =>
    loadJSON('displayName', 'Cavadov'),
  )
  const [followedArtistIds, setFollowedArtistIds] = useState<Set<string>>(() => {
    const saved = loadJSON<string[]>('followedArtistIds', [])
    return new Set(saved)
  })
  const [spotifyConnected, setSpotifyConnected] = useState(false)
  const [spotifyReady, setSpotifyReady] = useState(false)
  const [spotifyUserName, setSpotifyUserName] = useState<string | null>(null)
  const [spotifyConnectOpen, setSpotifyConnectOpen] = useState(false)
  const [spotifyDeviceId, setSpotifyDeviceId] = useState<string | null>(null)

  const shuffleRef = useRef(shuffle)
  const repeatRef = useRef(repeat)
  const queueRef = useRef(queue)
  const queueIndexRef = useRef(queueIndex)
  const historyIndexRef = useRef(historyIndex)
  const loadedTrackIdRef = useRef<string | null>(null)
  const wantPlayRef = useRef(false)
  const volumeBeforeMuteRef = useRef(volume)
  const spotifyPlayerRef = useRef<SpotifyPlayer | null>(null)
  const spotifyDeviceIdRef = useRef<string | null>(null)
  const spotifyReadyRef = useRef(false)
  const spotifyUriForTrackRef = useRef<string | null>(null)
  const suppressLocalAudioRef = useRef(false)

  useEffect(() => {
    shuffleRef.current = shuffle
  }, [shuffle])
  useEffect(() => {
    repeatRef.current = repeat
  }, [repeat])
  useEffect(() => {
    queueRef.current = queue
  }, [queue])
  useEffect(() => {
    queueIndexRef.current = queueIndex
  }, [queueIndex])
  useEffect(() => {
    historyIndexRef.current = historyIndex
  }, [historyIndex])

  useEffect(() => saveJSON('likedIds', Array.from(likedIds)), [likedIds])
  useEffect(() => saveJSON('volume', volume), [volume])
  useEffect(() => saveJSON('muted', muted), [muted])
  useEffect(() => saveJSON('shuffle', shuffle), [shuffle])
  useEffect(() => saveJSON('repeat', repeat), [repeat])
  useEffect(() => saveJSON('customPlaylists', customPlaylists), [customPlaylists])
  useEffect(() => saveJSON('displayName', displayName), [displayName])
  useEffect(() => saveJSON('recentlyPlayedIds', recentlyPlayedIds), [recentlyPlayedIds])
  useEffect(() => saveJSON('libraryCollapsedV2', libraryCollapsed), [libraryCollapsed])
  useEffect(() => saveJSON('activeDeviceId', activeDeviceId), [activeDeviceId])
  useEffect(() => {
    document.documentElement.style.setProperty(
      '--sidebar-width',
      libraryCollapsed ? '72px' : '300px',
    )
  }, [libraryCollapsed])

  useEffect(() => {
    const onFs = () => setIsFullscreen(Boolean(document.fullscreenElement))
    document.addEventListener('fullscreenchange', onFs)
    return () => document.removeEventListener('fullscreenchange', onFs)
  }, [])

  useEffect(
    () => saveJSON('followedArtistIds', Array.from(followedArtistIds)),
    [followedArtistIds],
  )
  useEffect(() => {
    saveJSON('currentTrackId', currentTrack?.id ?? null)
    saveJSON(
      'queueIds',
      queue.map((t) => t.id),
    )
    saveJSON('queueIndex', queueIndex)
  }, [currentTrack, queue, queueIndex])

  const recordRecent = useCallback((entityId: string) => {
    setRecentlyPlayedIds((prev) => [entityId, ...prev.filter((id) => id !== entityId)].slice(0, 12))
  }, [])

  const pushToast = useCallback((message: string) => {
    const id = toastId.current++
    setToasts((prev) => [...prev, { id, message }])
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 2800)
  }, [])

  const dismissToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const toggleFullscreen = useCallback(() => {
    const el = document.querySelector('.app-shell') || document.documentElement
    if (!document.fullscreenElement) {
      void (el as HTMLElement).requestFullscreen?.().catch(() => {
        pushToast('Fullscreen not available')
      })
    } else {
      void document.exitFullscreen?.()
    }
  }, [pushToast])

  const teardownSpotifyPlayer = useCallback(() => {
    spotifyPlayerRef.current?.disconnect()
    spotifyPlayerRef.current = null
    spotifyDeviceIdRef.current = null
    spotifyReadyRef.current = false
    suppressLocalAudioRef.current = false
    setSpotifyDeviceId(null)
    setSpotifyReady(false)
  }, [])

  const initSpotifyPlayer = useCallback(async () => {
    const token = await getValidAccessToken()
    if (!token) {
      setSpotifyConnected(false)
      return
    }
    try {
      const profile = await getSpotifyProfile(token)
      setSpotifyUserName(profile.display_name || profile.id)
      setDisplayNameState((n) => (n === 'Cavadov' && profile.display_name ? profile.display_name : n))
      setSpotifyConnected(true)
      if (profile.product && profile.product !== 'premium') {
        pushToast('Spotify Premium lazımdır — Web Playback yalnız Premium-da işləyir')
      }
      teardownSpotifyPlayer()
      const player = await createSpotifyPlayer({
        volume: muted ? 0 : volume,
        onReady: (deviceId) => {
          spotifyDeviceIdRef.current = deviceId
          spotifyReadyRef.current = true
          suppressLocalAudioRef.current = true
          setSpotifyDeviceId(deviceId)
          setSpotifyReady(true)
          void transferPlayback(token, deviceId, false).catch(() => undefined)
          pushToast('Spotify player hazırdır — real mahnılar axacaq')
          // Pause any local demo audio
          audioRef.current?.pause()
        },
        onNotReady: () => {
          spotifyReadyRef.current = false
          setSpotifyReady(false)
        },
        onState: (state: SpotifyPlaybackState | null) => {
          if (!state) return
          pushProgressUi(state.position / 1000)
          setDuration(state.duration / 1000)
          if (state.paused) {
            if (!wantPlayRef.current) setIsPlaying(false)
          } else {
            setIsPlaying(true)
            setIsBuffering(false)
            setPlaybackError(null)
          }
        },
        onError: (message) => {
          pushToast(message)
        },
      })
      spotifyPlayerRef.current = player
    } catch (e) {
      setSpotifyConnected(false)
      pushToast(e instanceof Error ? e.message : 'Spotify player alınmadı')
    }
  }, [muted, volume, pushToast, teardownSpotifyPlayer, pushProgressUi])

  useEffect(() => {
    let cancelled = false
    void (async () => {
      const result = await consumeAuthRedirect()
      if (cancelled) return
      if (result === 'ok') {
        pushToast('Spotify hesabı bağlandı')
        setSpotifyConnectOpen(false)
        await initSpotifyPlayer()
      } else if (result === 'error') {
        pushToast('Spotify login alınmadı')
      } else if (getSpotifyClientId() && (await getValidAccessToken())) {
        await initSpotifyPlayer()
      }
    })()
    return () => {
      cancelled = true
      teardownSpotifyPlayer()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- boot once
  }, [])

  const connectSpotify = useCallback(async () => {
    const id = getSpotifyClientId()
    if (!id) throw new Error('Client ID yaz')
    await beginSpotifyLogin(id)
  }, [])

  const disconnectSpotify = useCallback(() => {
    teardownSpotifyPlayer()
    clearStoredToken()
    setSpotifyConnected(false)
    setSpotifyUserName(null)
    pushToast('Spotify disconnect edildi — lokal demo audio')
  }, [pushToast, teardownSpotifyPlayer])

  const allPlaylists = useMemo(() => {
    const liked = buildLikedPlaylist(Array.from(likedIds))
    const seeded = seedPlaylists
      .filter((p) => p.id !== 'liked')
      .map((p) => p)
    return [liked, ...seeded, ...customPlaylists]
  }, [likedIds, customPlaylists])

  useEffect(() => {
    const audio = new Audio()
    audio.preload = 'auto'
    audio.crossOrigin = 'anonymous'
    audioRef.current = audio

    const advance = () => {
      const q = queueRef.current
      const idx = queueIndexRef.current
      if (!q.length) {
        wantPlayRef.current = false
        setIsPlaying(false)
        return
      }
      wantPlayRef.current = true
      if (shuffleRef.current && q.length > 1) {
        let nextIdx = Math.floor(Math.random() * q.length)
        if (nextIdx === idx) nextIdx = (nextIdx + 1) % q.length
        setQueueIndex(nextIdx)
        setCurrentTrack(q[nextIdx])
        setIsPlaying(true)
        return
      }
      if (idx < q.length - 1) {
        setQueueIndex(idx + 1)
        setCurrentTrack(q[idx + 1])
        setIsPlaying(true)
        return
      }
      if (repeatRef.current === 'all') {
        setQueueIndex(0)
        setCurrentTrack(q[0])
        setIsPlaying(true)
        return
      }
      wantPlayRef.current = false
      setIsPlaying(false)
      pushProgressUi(0, true)
    }

    const onTime = () => pushProgressUi(audio.currentTime || 0)
    const onMeta = () => {
      if (Number.isFinite(audio.duration) && audio.duration > 0) {
        setDuration(audio.duration)
      }
    }
    const onWaiting = () => setIsBuffering(true)
    const tryPlay = () => {
      if (!wantPlayRef.current || !audio.src) return
      const p = audio.play()
      if (p) {
        void p.catch((err: DOMException) => {
          if (err?.name === 'AbortError') return
          wantPlayRef.current = false
          setIsPlaying(false)
          setIsBuffering(false)
          if (err?.name === 'NotAllowedError') {
            pushToast('Press play to start audio')
          } else {
            setPlaybackError('Playback failed')
            pushToast('Playback failed — try another track')
          }
        })
      }
    }
    const onCanPlay = () => {
      setIsBuffering(false)
      tryPlay()
    }
    const onPlaying = () => {
      setIsBuffering(false)
      setPlaybackError(null)
      setIsPlaying(true)
      wantPlayRef.current = true
    }
    const onPause = () => {
      if (!audio.ended && !wantPlayRef.current) setIsPlaying(false)
    }
    const onError = () => {
      setIsBuffering(false)
      wantPlayRef.current = false
      setIsPlaying(false)
      const msg = 'This track is unavailable'
      setPlaybackError(msg)
      pushToast(msg)
      window.setTimeout(() => {
        if (queueRef.current.length > 1) advance()
      }, 400)
    }
    const onEnded = () => {
      if (repeatRef.current === 'one') {
        audio.currentTime = 0
        wantPlayRef.current = true
        void audio.play().catch(() => {
          wantPlayRef.current = false
          setIsPlaying(false)
        })
        return
      }
      advance()
    }

    audio.addEventListener('timeupdate', onTime)
    audio.addEventListener('loadedmetadata', onMeta)
    audio.addEventListener('durationchange', onMeta)
    audio.addEventListener('waiting', onWaiting)
    audio.addEventListener('canplay', onCanPlay)
    audio.addEventListener('playing', onPlaying)
    audio.addEventListener('pause', onPause)
    audio.addEventListener('ended', onEnded)
    audio.addEventListener('error', onError)

    return () => {
      audio.pause()
      audio.removeEventListener('timeupdate', onTime)
      audio.removeEventListener('loadedmetadata', onMeta)
      audio.removeEventListener('durationchange', onMeta)
      audio.removeEventListener('waiting', onWaiting)
      audio.removeEventListener('canplay', onCanPlay)
      audio.removeEventListener('playing', onPlaying)
      audio.removeEventListener('pause', onPause)
      audio.removeEventListener('ended', onEnded)
      audio.removeEventListener('error', onError)
      audio.removeAttribute('src')
      audio.load()
      audioRef.current = null
    }
  }, [pushToast, pushProgressUi])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !currentTrack) return

    // When Spotify Web Playback is active, keep local demo audio silent.
    if (suppressLocalAudioRef.current && spotifyReadyRef.current) {
      audio.pause()
      return
    }

    const nextSrc = currentTrack.audio
    const absolute = new URL(nextSrc, window.location.href).href
    const alreadyLoaded =
      loadedTrackIdRef.current === currentTrack.id &&
      (audio.src === absolute || audio.src.endsWith(nextSrc))

    if (!alreadyLoaded) {
      setPlaybackError(null)
      setIsBuffering(true)
      pushProgressUi(0, true)
      setDuration(currentTrack.duration || 0)
      loadedTrackIdRef.current = currentTrack.id
      audio.src = nextSrc
      audio.load()
    }

    wantPlayRef.current = isPlaying
    if (isPlaying) {
      if (audio.readyState >= 2) {
        void audio.play().catch((err: DOMException) => {
          if (err?.name === 'AbortError') return
          wantPlayRef.current = false
          setIsPlaying(false)
          setIsBuffering(false)
          if (err?.name === 'NotAllowedError') {
            pushToast('Press play to start audio')
          } else {
            setPlaybackError('Playback failed')
            pushToast('Playback failed')
          }
        })
      }
    } else if (!audio.paused) {
      audio.pause()
    }
  }, [isPlaying, currentTrack, pushToast, spotifyReady, pushProgressUi])

  // Spotify: resolve catalog track → Spotify URI and stream via Premium account
  useEffect(() => {
    if (!spotifyReady || !spotifyDeviceId || !currentTrack) return
    const deviceId = spotifyDeviceId
    const track = currentTrack
    let cancelled = false

    void (async () => {
      const token = await getValidAccessToken()
      if (!token || cancelled) return
      try {
        if (!isPlaying) {
          await pauseSpotify(token, deviceId).catch(() => undefined)
          return
        }
        setIsBuffering(true)
        const uri = await resolveSpotifyUri(token, track)
        if (cancelled) return
        if (!uri) {
          setIsBuffering(false)
          setPlaybackError('Spotify-da tapılmadı')
          pushToast(`“${track.title}” Spotify-da tapılmadı`)
          return
        }
        const sameUri = spotifyUriForTrackRef.current === uri
        spotifyUriForTrackRef.current = uri
        if (sameUri) {
          await resumeSpotify(token, deviceId)
        } else {
          await playSpotifyUri(token, deviceId, uri)
        }
        if (!cancelled) {
          setIsBuffering(false)
          setPlaybackError(null)
          audioRef.current?.pause()
        }
      } catch (e) {
        if (cancelled) return
        setIsBuffering(false)
        const msg = e instanceof Error ? e.message : 'Spotify playback failed'
        setPlaybackError(msg)
        pushToast(msg.slice(0, 120))
      }
    })()

    return () => {
      cancelled = true
    }
  }, [spotifyReady, spotifyDeviceId, currentTrack, isPlaying, pushToast])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    const vol = muted ? 0 : Math.min(1, Math.max(0, volume))
    audio.volume = vol
    audio.muted = muted || vol === 0
    if (spotifyReadyRef.current) {
      void (async () => {
        const token = await getValidAccessToken()
        if (!token) return
        const pct = muted ? 0 : Math.round(vol * 100)
        await setSpotifyVolume(token, pct, spotifyDeviceIdRef.current || undefined).catch(
          () => undefined,
        )
        await spotifyPlayerRef.current?.setVolume(vol).catch(() => undefined)
      })()
    }
  }, [volume, muted, spotifyReady])

  useEffect(() => {
    if (!muted && volume > 0) volumeBeforeMuteRef.current = volume
  }, [volume, muted])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || (e.target as HTMLElement)?.isContentEditable) {
        return
      }
      if (e.code === 'Space') {
        e.preventDefault()
        if (!loadedTrackIdRef.current) return
        setIsPlaying((p) => {
          wantPlayRef.current = !p
          return !p
        })
      } else if (e.code === 'ArrowRight' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault()
        const q = queueRef.current
        const idx = queueIndexRef.current
        if (!q.length) return
        const nextIdx = idx < q.length - 1 ? idx + 1 : 0
        setQueueIndex(nextIdx)
        setCurrentTrack(q[nextIdx])
        setIsPlaying(true)
        wantPlayRef.current = true
      } else if (e.code === 'ArrowLeft' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault()
        const audio = audioRef.current
        if (audio && audio.currentTime > 3) {
          audio.currentTime = 0
          pushProgressUi(0, true)
          return
        }
        const q = queueRef.current
        const idx = queueIndexRef.current
        if (!q.length) return
        const prevIdx = idx > 0 ? idx - 1 : q.length - 1
        setQueueIndex(prevIdx)
        setCurrentTrack(q[prevIdx])
        setIsPlaying(true)
        wantPlayRef.current = true
      } else if (e.key === 'm' || e.key === 'M') {
        setMuted((m) => !m)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const applyView = useCallback((next: View, pushHistory: boolean) => {
    setViewState(next)
    setSidebarOpen(false)
    setProfileMenuOpen(false)
    setNotificationsOpen(false)
    setContextMenu(null)
    const hash = viewToHash(next)
    if (window.location.hash !== hash) {
      skipHashSync.current = true
      window.location.hash = hash
    }
    if (pushHistory) {
      setHistory((prev) => {
        const trimmed = prev.slice(0, historyIndexRef.current + 1)
        const last = trimmed[trimmed.length - 1]
        if (last && viewToHash(last) === viewToHash(next)) return trimmed
        const nextHist = [...trimmed, next]
        const nextIndex = nextHist.length - 1
        historyIndexRef.current = nextIndex
        setHistoryIndex(nextIndex)
        return nextHist
      })
    }
  }, [])

  const setView = useCallback(
    (next: View) => {
      if (next.type === 'playlist' || next.type === 'album' || next.type === 'artist') {
        recordRecent(next.id)
      }
      applyView(next, true)
    },
    [applyView, recordRecent],
  )

  useEffect(() => {
    const onHash = () => {
      if (skipHashSync.current) {
        skipHashSync.current = false
        return
      }
      const next = hashToView(window.location.hash)
      if (!next) return
      setViewState(next)
      setHistory((prev) => {
        const last = prev[prev.length - 1]
        if (last && viewToHash(last) === viewToHash(next)) return prev
        return [...prev, next]
      })
      setHistoryIndex((i) => i + 1)
    }
    window.addEventListener('hashchange', onHash)
    if (!window.location.hash) {
      skipHashSync.current = true
      window.location.hash = viewToHash(initialView)
    }
    return () => window.removeEventListener('hashchange', onHash)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const goBack = useCallback(() => {
    if (historyIndex <= 0) return
    const nextIndex = historyIndex - 1
    const next = history[nextIndex]
    if (!next) return
    historyIndexRef.current = nextIndex
    setHistoryIndex(nextIndex)
    setViewState(next)
    setSidebarOpen(false)
    skipHashSync.current = true
    window.location.hash = viewToHash(next)
  }, [history, historyIndex])

  const goForward = useCallback(() => {
    if (historyIndex >= history.length - 1) return
    const nextIndex = historyIndex + 1
    const next = history[nextIndex]
    if (!next) return
    historyIndexRef.current = nextIndex
    setHistoryIndex(nextIndex)
    setViewState(next)
    setSidebarOpen(false)
    skipHashSync.current = true
    window.location.hash = viewToHash(next)
  }, [history, historyIndex])

  const playTrack = useCallback((track: Track, nextQueue?: Track[]) => {
    const q = nextQueue?.length ? nextQueue : [track]
    const idx = q.findIndex((t) => t.id === track.id)
    setPlaybackError(null)
    setMuted(false)
    setVolumeState((v) => (v <= 0 ? 0.85 : v))
    setQueue(q)
    setQueueIndex(idx >= 0 ? idx : 0)
    if (loadedTrackIdRef.current === track.id && playbackError) {
      loadedTrackIdRef.current = null
    }
    spotifyUriForTrackRef.current = null
    setCurrentTrack(track)
    wantPlayRef.current = true
    setIsPlaying(true)
  }, [playbackError])

  const togglePlay = useCallback(() => {
    if (!currentTrack) {
      pushToast('Select a song first')
      return
    }
    if (playbackError) {
      loadedTrackIdRef.current = null
      setPlaybackError(null)
      wantPlayRef.current = true
      setIsPlaying(true)
      return
    }
    setIsPlaying((p) => {
      wantPlayRef.current = !p
      return !p
    })
  }, [currentTrack, playbackError, pushToast])

  const next = useCallback(() => {
    const q = queueRef.current
    const idx = queueIndexRef.current
    if (!q.length) return
    if (shuffleRef.current && q.length > 1) {
      let nextIdx = Math.floor(Math.random() * q.length)
      if (nextIdx === idx) nextIdx = (nextIdx + 1) % q.length
      setQueueIndex(nextIdx)
      setCurrentTrack(q[nextIdx])
      wantPlayRef.current = true
      setIsPlaying(true)
      return
    }
    const nextIdx = idx < q.length - 1 ? idx + 1 : 0
    setQueueIndex(nextIdx)
    setCurrentTrack(q[nextIdx])
    wantPlayRef.current = true
    setIsPlaying(true)
  }, [])

  const prev = useCallback(() => {
    const pos = progressRef.current || audioRef.current?.currentTime || 0
    if (spotifyReadyRef.current && pos > 3) {
      void (async () => {
        const token = await getValidAccessToken()
        if (!token) return
        await seekSpotify(token, 0, spotifyDeviceIdRef.current || undefined).catch(() => undefined)
        pushProgressUi(0, true)
      })()
      return
    }
    const audio = audioRef.current
    if (audio && audio.currentTime > 3) {
      audio.currentTime = 0
      pushProgressUi(0, true)
      return
    }
    const q = queueRef.current
    const idx = queueIndexRef.current
    if (!q.length) return
    const prevIdx = idx > 0 ? idx - 1 : q.length - 1
    setQueueIndex(prevIdx)
    setCurrentTrack(q[prevIdx])
    wantPlayRef.current = true
    setIsPlaying(true)
  }, [pushProgressUi])

  const seek = useCallback((time: number) => {
    const clamped = Math.max(0, time)
    pushProgressUi(clamped, true)
    if (spotifyReadyRef.current) {
      void (async () => {
        const token = await getValidAccessToken()
        if (!token) return
        await seekSpotify(
          token,
          clamped * 1000,
          spotifyDeviceIdRef.current || undefined,
        ).catch(() => undefined)
      })()
      return
    }
    const audio = audioRef.current
    if (!audio) return
    audio.currentTime = Math.min(
      clamped,
      Number.isFinite(audio.duration) ? audio.duration : clamped,
    )
  }, [pushProgressUi])

  const setVolume = useCallback((v: number) => {
    const nextVol = Math.min(1, Math.max(0, v))
    setVolumeState(nextVol)
    if (nextVol > 0) {
      volumeBeforeMuteRef.current = nextVol
      setMuted(false)
    } else {
      setMuted(true)
    }
  }, [])

  const toggleMute = useCallback(() => {
    if (muted) {
      setMuted(false)
      setVolumeState((v) => (v > 0 ? v : volumeBeforeMuteRef.current || 0.7))
    } else {
      if (volume > 0) volumeBeforeMuteRef.current = volume
      setMuted(true)
    }
  }, [muted, volume])
  const toggleShuffle = useCallback(() => {
    setShuffle((s) => {
      pushToast(s ? 'Shuffle off' : 'Shuffle on')
      return !s
    })
  }, [pushToast])
  const cycleRepeat = useCallback(() => {
    setRepeat((r) => {
      const nextMode = r === 'off' ? 'all' : r === 'all' ? 'one' : 'off'
      pushToast(
        nextMode === 'off'
          ? 'Repeat off'
          : nextMode === 'all'
            ? 'Repeat all'
            : 'Repeat one',
      )
      return nextMode
    })
  }, [pushToast])

  const toggleLike = useCallback(
    (trackId: string) => {
      setLikedIds((prev) => {
        const nextSet = new Set(prev)
        if (nextSet.has(trackId)) {
          nextSet.delete(trackId)
          pushToast('Removed from Liked Songs')
        } else {
          nextSet.add(trackId)
          pushToast('Added to Liked Songs')
        }
        return nextSet
      })
    },
    [pushToast],
  )

  const createPlaylist = useCallback(
    (name: string, description = '') => {
      const id = `custom-${Date.now()}`
      const playlist: Playlist = {
        id,
        name: name.trim() || 'My Playlist',
        description: description.trim() || 'Created by you',
        cover: '/covers/c9.jpg',
        owner: 'You',
        color: '#1e3264',
        trackIds: [],
      }
      setCustomPlaylists((prev) => [playlist, ...prev])
      pushToast(`Playlist "${playlist.name}" created`)
      setView({ type: 'playlist', id })
      return id
    },
    [pushToast, setView],
  )

  const renamePlaylist = useCallback(
    (playlistId: string, name: string, description?: string) => {
      setCustomPlaylists((prev) =>
        prev.map((p) =>
          p.id === playlistId
            ? {
                ...p,
                name: name.trim() || p.name,
                description: description !== undefined ? description.trim() : p.description,
              }
            : p,
        ),
      )
      pushToast('Playlist updated')
    },
    [pushToast],
  )

  const deletePlaylist = useCallback(
    (playlistId: string) => {
      if (!playlistId.startsWith('custom-')) {
        pushToast('This playlist can’t be deleted')
        return
      }
      setCustomPlaylists((prev) => prev.filter((p) => p.id !== playlistId))
      pushToast('Playlist deleted')
      setView({ type: 'library' })
    },
    [pushToast, setView],
  )

  const reorderPlaylistTracks = useCallback(
    (playlistId: string, fromIndex: number, toIndex: number) => {
      setCustomPlaylists((prev) =>
        prev.map((p) => {
          if (p.id !== playlistId) return p
          const nextIds = [...p.trackIds]
          if (
            fromIndex < 0 ||
            toIndex < 0 ||
            fromIndex >= nextIds.length ||
            toIndex >= nextIds.length
          ) {
            return p
          }
          const [item] = nextIds.splice(fromIndex, 1)
          nextIds.splice(toIndex, 0, item)
          return { ...p, trackIds: nextIds }
        }),
      )
    },
    [],
  )

  const addTrackToPlaylist = useCallback(
    (playlistId: string, trackId: string) => {
      if (playlistId === 'liked') {
        toggleLike(trackId)
        return
      }
      setCustomPlaylists((prev) => {
        const exists = prev.some((p) => p.id === playlistId)
        if (!exists) {
          const seed = seedPlaylists.find((p) => p.id === playlistId)
          if (!seed) {
            pushToast('You can only edit playlists you created')
            return prev
          }
          const copy: Playlist = {
            ...seed,
            id: `custom-copy-${seed.id}-${Date.now()}`,
            owner: 'You',
            trackIds: [...new Set([...seed.trackIds, trackId])],
          }
          pushToast(`Added to ${copy.name}`)
          return [copy, ...prev]
        }
        return prev.map((p) => {
          if (p.id !== playlistId) return p
          if (p.trackIds.includes(trackId)) {
            pushToast('Already in playlist')
            return p
          }
          pushToast(`Added to ${p.name}`)
          return { ...p, trackIds: [...p.trackIds, trackId] }
        })
      })
    },
    [pushToast, toggleLike],
  )

  const removeTrackFromPlaylist = useCallback(
    (playlistId: string, trackId: string) => {
      if (playlistId === 'liked') {
        setLikedIds((prev) => {
          const nextSet = new Set(prev)
          nextSet.delete(trackId)
          return nextSet
        })
        pushToast('Removed from Liked Songs')
        return
      }
      setCustomPlaylists((prev) =>
        prev.map((p) =>
          p.id === playlistId
            ? { ...p, trackIds: p.trackIds.filter((id) => id !== trackId) }
            : p,
        ),
      )
      pushToast('Removed from playlist')
    },
    [pushToast],
  )

  const addToQueue = useCallback(
    (track: Track) => {
      setQueue((prev) => [...prev, track])
      pushToast('Added to queue')
    },
    [pushToast],
  )

  const playNext = useCallback(
    (track: Track) => {
      const idx = queueIndexRef.current
      setQueue((prev) => {
        const nextQ = [...prev]
        nextQ.splice(idx + 1, 0, track)
        return nextQ
      })
      pushToast('Playing next')
    },
    [pushToast],
  )

  const playFromQueue = useCallback((index: number) => {
    const track = queueRef.current[index]
    if (!track) return
    setQueueIndex(index)
    setCurrentTrack(track)
    wantPlayRef.current = true
    setIsPlaying(true)
  }, [])

  const toggleFollowArtist = useCallback(
    (artistId: string) => {
      setFollowedArtistIds((prev) => {
        const nextSet = new Set(prev)
        if (nextSet.has(artistId)) {
          nextSet.delete(artistId)
          pushToast('Unfollowed')
        } else {
          nextSet.add(artistId)
          pushToast('Following')
        }
        return nextSet
      })
    },
    [pushToast],
  )

  const clearUpcoming = useCallback(() => {
    const idx = queueIndexRef.current
    setQueue((prev) => prev.slice(0, idx + 1))
    pushToast('Cleared queue')
  }, [pushToast])

  const openContextMenu = useCallback((e: React.MouseEvent, track: Track) => {
    e.preventDefault()
    e.stopPropagation()
    const maxX = window.innerWidth - 220
    const maxY = window.innerHeight - 260
    setContextMenu({
      x: Math.min(e.clientX, maxX),
      y: Math.min(e.clientY, maxY),
      track,
    })
  }, [])

  const closeContextMenu = useCallback(() => setContextMenu(null), [])

  const toggleLibraryCollapsed = useCallback(() => {
    setLibraryCollapsed((c) => !c)
  }, [])

  const toggleQueue = useCallback(() => {
    setQueueOpen((o) => !o)
    setLyricsOpen(false)
  }, [])

  const toggleRightPanel = useCallback(() => {
    setRightPanelOpen((o) => !o)
  }, [])

  const setDisplayName = useCallback((name: string) => {
    setDisplayNameState(name.trim() || 'User')
  }, [])

  const value = useMemo<PlayerContextValue>(
    () => ({
      view,
      setView,
      goBack,
      goForward,
      canGoBack: historyIndex > 0,
      canGoForward: historyIndex < history.length - 1,
      currentTrack,
      queue,
      queueIndex,
      isPlaying,
      isBuffering,
      playbackError,
      volume,
      muted,
      shuffle,
      repeat,
      likedIds,
      recentlyPlayedIds,
      searchQuery,
      setSearchQuery,
      playTrack,
      togglePlay,
      next,
      prev,
      seek,
      setVolume,
      toggleMute,
      toggleShuffle,
      cycleRepeat,
      toggleLike,
      sidebarOpen,
      setSidebarOpen,
      libraryCollapsed,
      toggleLibraryCollapsed,
      setLibraryCollapsed,
      queueOpen,
      setQueueOpen,
      toggleQueue,
      rightPanelOpen,
      setRightPanelOpen,
      toggleRightPanel,
      profileMenuOpen,
      setProfileMenuOpen,
      notificationsOpen,
      setNotificationsOpen,
      friendsOpen,
      setFriendsOpen,
      activeDeviceId,
      setActiveDeviceId,
      isFullscreen,
      toggleFullscreen,
      createPlaylistOpen,
      setCreatePlaylistOpen,
      addToPlaylistTrack,
      setAddToPlaylistTrack,
      contextMenu,
      openContextMenu,
      closeContextMenu,
      lyricsOpen,
      setLyricsOpen,
      devicesOpen,
      setDevicesOpen,
      premiumOpen,
      setPremiumOpen,
      libraryFilter,
      setLibraryFilter,
      customPlaylists,
      allPlaylists,
      createPlaylist,
      renamePlaylist,
      deletePlaylist,
      addTrackToPlaylist,
      removeTrackFromPlaylist,
      reorderPlaylistTracks,
      addToQueue,
      playNext,
      playFromQueue,
      clearUpcoming,
      toasts,
      pushToast,
      dismissToast,
      displayName,
      setDisplayName,
      followedArtistIds,
      toggleFollowArtist,
      spotifyConnected,
      spotifyReady,
      spotifyUserName,
      spotifyConnectOpen,
      setSpotifyConnectOpen,
      connectSpotify,
      disconnectSpotify,
    }),
    [
      view,
      setView,
      goBack,
      goForward,
      historyIndex,
      history.length,
      currentTrack,
      queue,
      queueIndex,
      isPlaying,
      isBuffering,
      playbackError,
      volume,
      muted,
      shuffle,
      repeat,
      likedIds,
      recentlyPlayedIds,
      searchQuery,
      playTrack,
      togglePlay,
      next,
      prev,
      seek,
      setVolume,
      toggleMute,
      toggleShuffle,
      cycleRepeat,
      toggleLike,
      sidebarOpen,
      libraryCollapsed,
      toggleLibraryCollapsed,
      queueOpen,
      toggleQueue,
      rightPanelOpen,
      toggleRightPanel,
      profileMenuOpen,
      notificationsOpen,
      friendsOpen,
      activeDeviceId,
      isFullscreen,
      toggleFullscreen,
      createPlaylistOpen,
      addToPlaylistTrack,
      contextMenu,
      openContextMenu,
      closeContextMenu,
      lyricsOpen,
      devicesOpen,
      premiumOpen,
      libraryFilter,
      customPlaylists,
      allPlaylists,
      createPlaylist,
      renamePlaylist,
      deletePlaylist,
      addTrackToPlaylist,
      removeTrackFromPlaylist,
      reorderPlaylistTracks,
      addToQueue,
      playNext,
      playFromQueue,
      clearUpcoming,
      toasts,
      pushToast,
      dismissToast,
      displayName,
      setDisplayName,
      followedArtistIds,
      toggleFollowArtist,
      spotifyConnected,
      spotifyReady,
      spotifyUserName,
      spotifyConnectOpen,
      connectSpotify,
      disconnectSpotify,
    ],
  )

  const progressValue = useMemo(
    () => ({ progress, duration }),
    [progress, duration],
  )

  return (
    <PlayerContext.Provider value={value}>
      <ProgressContext.Provider value={progressValue}>{children}</ProgressContext.Provider>
    </PlayerContext.Provider>
  )
}

export function usePlayer() {
  const ctx = useContext(PlayerContext)
  if (!ctx) throw new Error('usePlayer must be used within PlayerProvider')
  return ctx
}

/** Subscribe only where the seek bar / lyrics need live time — avoids full-app re-renders. */
export function useProgress() {
  return useContext(ProgressContext)
}

export function useLikedTracks() {
  const { likedIds } = usePlayer()
  return Array.from(likedIds)
    .map((id) => getTrack(id))
    .filter(Boolean) as Track[]
}

export function getPlaylistById(
  id: string,
  allPlaylists: Playlist[],
): Playlist | undefined {
  return allPlaylists.find((p) => p.id === id)
}
