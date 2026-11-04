import { useEffect, useState } from 'react'
import { albums, findArtistByTrackArtist } from '../data/music'
import { defaultDevices, whatsNew, type PlayerDevice } from '../data/activity'
import { getAnnouncements } from '../admin/adminStore'
import { fetchLyrics } from '../lib/lyrics'
import { getValidAccessToken } from '../lib/spotifyAuth'
import { getSpotifyDevices, transferPlayback } from '../lib/spotifyApi'
import { usePlayer, useProgress } from '../context/PlayerContext'
import { CloseIcon, PauseIcon, PlayIcon } from './Icons'
import { SpotifyConnectModal } from './SpotifyConnect'

export function Overlays() {
  const {
    queueOpen,
    setQueueOpen,
    queue,
    queueIndex,
    currentTrack,
    isPlaying,
    playFromQueue,
    clearUpcoming,
    togglePlay,
    createPlaylistOpen,
    setCreatePlaylistOpen,
    createPlaylist,
    addToPlaylistTrack,
    setAddToPlaylistTrack,
    allPlaylists,
    addTrackToPlaylist,
    customPlaylists,
    contextMenu,
    closeContextMenu,
    playTrack,
    addToQueue,
    playNext,
    toggleLike,
    likedIds,
    setView,
    lyricsOpen,
    setLyricsOpen,
    devicesOpen,
    setDevicesOpen,
    premiumOpen,
    setPremiumOpen,
    toasts,
    dismissToast,
    profileMenuOpen,
    setProfileMenuOpen,
    notificationsOpen,
    setNotificationsOpen,
    displayName,
    activeDeviceId,
    setActiveDeviceId,
    pushToast,
    spotifyReady,
    disconnectSpotify,
  } = usePlayer()
  const { progress, duration } = useProgress()

  const [playlistName, setPlaylistName] = useState('')
  const [lyricsLines, setLyricsLines] = useState<string[]>([])
  const [lyricsLoading, setLyricsLoading] = useState(false)
  const [devices, setDevices] = useState<PlayerDevice[]>(defaultDevices)
  const [playlistDesc, setPlaylistDesc] = useState('')

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeContextMenu()
        setCreatePlaylistOpen(false)
        setAddToPlaylistTrack(null)
        setLyricsOpen(false)
        setDevicesOpen(false)
        setPremiumOpen(false)
        setProfileMenuOpen(false)
        setNotificationsOpen(false)
      }
    }
    const onClick = () => closeContextMenu()
    window.addEventListener('keydown', onKey)
    window.addEventListener('click', onClick)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('click', onClick)
    }
  }, [
    closeContextMenu,
    setCreatePlaylistOpen,
    setAddToPlaylistTrack,
    setLyricsOpen,
    setDevicesOpen,
    setPremiumOpen,
    setProfileMenuOpen,
    setNotificationsOpen,
  ])

  useEffect(() => {
    if (!lyricsOpen || !currentTrack) {
      setLyricsLines([])
      setLyricsLoading(false)
      return
    }
    let cancelled = false
    setLyricsLoading(true)
    void fetchLyrics(currentTrack.title, currentTrack.artist).then((lines) => {
      if (!cancelled) {
        setLyricsLines(lines)
        setLyricsLoading(false)
      }
    })
    return () => {
      cancelled = true
    }
  }, [lyricsOpen, currentTrack])

  useEffect(() => {
    if (!devicesOpen) return
    let cancelled = false
    void (async () => {
      const token = await getValidAccessToken()
      if (!token || cancelled) {
        setDevices(
          defaultDevices.map((d) => ({
            ...d,
            active: d.id === activeDeviceId,
          })),
        )
        return
      }
      try {
        const remote = await getSpotifyDevices(token)
        if (cancelled) return
        const mapped: PlayerDevice[] = remote
          .filter((d) => d.id)
          .map((d) => ({
            id: d.id!,
            name: d.name,
            type: (['Computer', 'Smartphone', 'Speaker', 'TV'].includes(d.type)
              ? d.type
              : 'Computer') as PlayerDevice['type'],
            active: d.is_active,
            volume: d.volume_percent ?? 70,
          }))
        const locals = defaultDevices.map((d) => ({
          ...d,
          active: false,
        }))
        const merged = [...locals, ...mapped].map((d) => ({
          ...d,
          active: d.id === activeDeviceId || d.active,
        }))
        setDevices(merged.length ? merged : defaultDevices)
      } catch {
        if (!cancelled) {
          setDevices(
            defaultDevices.map((d) => ({
              ...d,
              active: d.id === activeDeviceId,
            })),
          )
        }
      }
    })()
    return () => {
      cancelled = true
    }
  }, [devicesOpen, activeDeviceId])

  const upcoming = queue.slice(queueIndex + 1)
  const editablePlaylists = [
    ...customPlaylists,
    ...allPlaylists.filter((p) => p.id === 'liked'),
  ]

  return (
    <>
      {queueOpen && (
        <aside className="side-panel queue-panel-ui panel-enter" aria-label="Queue">
          <div className="side-panel-header">
            <h2>Queue</h2>
            <button
              type="button"
              className="icon-btn"
              aria-label="Close queue"
              onClick={() => setQueueOpen(false)}
            >
              <CloseIcon />
            </button>
          </div>
          <div className="side-panel-body">
            {currentTrack && (
              <div className="queue-section">
                <div className="queue-label">Now playing</div>
                <button
                  type="button"
                  className="queue-item active"
                  onClick={() => togglePlay()}
                >
                  <img src={currentTrack.cover} alt="" />
                  <div>
                    <div className="qi-title playing">{currentTrack.title}</div>
                    <div className="qi-sub">{currentTrack.artist}</div>
                  </div>
                  {isPlaying ? <PauseIcon size={14} /> : <PlayIcon size={14} />}
                </button>
              </div>
            )}
            <div className="queue-section">
              <div className="queue-label-row">
                <div className="queue-label">Next up</div>
                {upcoming.length > 0 && (
                  <button type="button" className="text-link" onClick={clearUpcoming}>
                    Clear
                  </button>
                )}
              </div>
              {upcoming.length === 0 && (
                <p className="empty-hint">Queue is empty. Right-click a song to add.</p>
              )}
              {upcoming.map((track, i) => {
                const absoluteIndex = queueIndex + 1 + i
                return (
                  <button
                    key={`${track.id}-${absoluteIndex}`}
                    type="button"
                    className="queue-item"
                    onClick={() => playFromQueue(absoluteIndex)}
                  >
                    <img src={track.cover} alt="" />
                    <div>
                      <div className="qi-title">{track.title}</div>
                      <div className="qi-sub">{track.artist}</div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </aside>
      )}

      {lyricsOpen && (
        <div className="modal-backdrop backdrop-enter" onClick={() => setLyricsOpen(false)}>
          <div className="modal sheet modal-enter" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Lyrics</h2>
              <button type="button" className="icon-btn" onClick={() => setLyricsOpen(false)}>
                <CloseIcon />
              </button>
            </div>
            {currentTrack && (
              <p className="modal-sub">
                {currentTrack.title} · {currentTrack.artist}
              </p>
            )}
            <div className="lyrics-body">
              {!currentTrack && <p className="lyrics-line">Play a song to see lyrics</p>}
              {currentTrack && lyricsLoading && <p className="lyrics-line muted">Loading lyrics…</p>}
              {currentTrack &&
                !lyricsLoading &&
                lyricsLines.map((line, i) => {
                  const total = Math.max(duration || currentTrack.duration || 1, 1)
                  const active = Math.min(
                    lyricsLines.length - 1,
                    Math.floor((progress / total) * Math.max(lyricsLines.length - 1, 1)),
                  )
                  return (
                    <p
                      key={`${i}-${line.slice(0, 12)}`}
                      className={`lyrics-line ${i === active ? 'active' : ''} ${!line ? 'muted' : ''}`}
                    >
                      {line || '·'}
                    </p>
                  )
                })}
            </div>
          </div>
        </div>
      )}

      {devicesOpen && (
        <div className="modal-backdrop backdrop-enter" onClick={() => setDevicesOpen(false)}>
          <div className="modal narrow modal-enter" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Connect to a device</h2>
              <button type="button" className="icon-btn" onClick={() => setDevicesOpen(false)}>
                <CloseIcon />
              </button>
            </div>
            <p className="modal-sub">
              {spotifyReady
                ? 'Spotify devices + this browser'
                : 'Choose where sound plays on this player'}
            </p>
            {devices.map((d) => {
              const active = d.id === activeDeviceId || d.active
              return (
                <button
                  key={d.id}
                  type="button"
                  className={`device-row ${active ? 'active' : ''}`}
                  onClick={() => {
                    void (async () => {
                      setActiveDeviceId(d.id)
                      setDevices((prev) =>
                        prev.map((x) => ({ ...x, active: x.id === d.id })),
                      )
                      const token = await getValidAccessToken()
                      if (token && spotifyReady && !d.id.startsWith('this') && !d.id.startsWith('web')) {
                        try {
                          await transferPlayback(token, d.id, isPlaying)
                        } catch {
                          /* local ok */
                        }
                      }
                      pushToast(`Listening on ${d.name}`)
                      setDevicesOpen(false)
                    })()
                  }}
                >
                  <span>
                    {d.name}
                    <small className="device-type"> · {d.type}</small>
                  </span>
                  <span className="device-tag">{active ? 'Current' : 'Available'}</span>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {premiumOpen && (
        <div className="modal-backdrop backdrop-enter" onClick={() => setPremiumOpen(false)}>
          <div className="modal modal-enter premium-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Explore Premium</h2>
              <button type="button" className="icon-btn" onClick={() => setPremiumOpen(false)}>
                <CloseIcon />
              </button>
            </div>
            <p className="modal-sub">Ad-free music, offline downloads, and high quality audio.</p>
            <div className="premium-plans">
              {[
                {
                  name: 'Individual',
                  price: '₼4.99',
                  per: '/month',
                  points: ['1 account', 'Ad-free music', 'Download 10,000 songs'],
                },
                {
                  name: 'Duo',
                  price: '₼6.99',
                  per: '/month',
                  points: ['2 Premium accounts', 'Duo Mix playlist', 'Ad-free listening'],
                },
                {
                  name: 'Family',
                  price: '₼8.99',
                  per: '/month',
                  points: ['Up to 6 accounts', 'Block explicit music', 'Family Mix'],
                },
              ].map((plan) => (
                <div key={plan.name} className="premium-plan-card">
                  <h3>{plan.name}</h3>
                  <div className="premium-price">
                    {plan.price}
                    <span>{plan.per}</span>
                  </div>
                  <ul className="feature-list">
                    {plan.points.map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>
                  <button
                    type="button"
                    className="primary-btn"
                    onClick={() => {
                      setPremiumOpen(false)
                      pushToast(`${plan.name} — open spotify.com/premium to subscribe`)
                      window.open('https://www.spotify.com/premium/', '_blank', 'noreferrer')
                    }}
                  >
                    Get {plan.name}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {createPlaylistOpen && (
        <div className="modal-backdrop backdrop-enter" onClick={() => setCreatePlaylistOpen(false)}>
          <div className="modal narrow modal-enter" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Create playlist</h2>
              <button
                type="button"
                className="icon-btn"
                onClick={() => setCreatePlaylistOpen(false)}
              >
                <CloseIcon />
              </button>
            </div>
            <label className="field">
              <span>Name</span>
              <input
                value={playlistName}
                onChange={(e) => setPlaylistName(e.target.value)}
                placeholder="My Playlist #1"
                autoFocus
              />
            </label>
            <label className="field">
              <span>Description</span>
              <textarea
                value={playlistDesc}
                onChange={(e) => setPlaylistDesc(e.target.value)}
                placeholder="Add an optional description"
                rows={3}
              />
            </label>
            <button
              type="button"
              className="primary-btn"
              onClick={() => {
                createPlaylist(playlistName, playlistDesc)
                setPlaylistName('')
                setPlaylistDesc('')
                setCreatePlaylistOpen(false)
              }}
            >
              Create
            </button>
          </div>
        </div>
      )}

      {addToPlaylistTrack && (
        <div className="modal-backdrop backdrop-enter" onClick={() => setAddToPlaylistTrack(null)}>
          <div className="modal narrow modal-enter" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add to playlist</h2>
              <button
                type="button"
                className="icon-btn"
                onClick={() => setAddToPlaylistTrack(null)}
              >
                <CloseIcon />
              </button>
            </div>
            <p className="modal-sub">
              {addToPlaylistTrack.title} · {addToPlaylistTrack.artist}
            </p>
            <div className="pick-list">
              {editablePlaylists.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  className="pick-item"
                  onClick={() => {
                    addTrackToPlaylist(p.id, addToPlaylistTrack.id)
                    setAddToPlaylistTrack(null)
                  }}
                >
                  <img src={p.cover} alt="" />
                  <span>{p.name}</span>
                </button>
              ))}
              {editablePlaylists.length === 1 && (
                <p className="empty-hint">Create a playlist to organize your songs.</p>
              )}
            </div>
            <button
              type="button"
              className="secondary-btn"
              onClick={() => {
                setAddToPlaylistTrack(null)
                setCreatePlaylistOpen(true)
              }}
            >
              New playlist
            </button>
          </div>
        </div>
      )}

      {contextMenu && (
        <div
          className="context-menu menu-enter"
          style={{ left: contextMenu.x, top: contextMenu.y }}
          onClick={(e) => e.stopPropagation()}
          onContextMenu={(e) => e.preventDefault()}
        >
          <button
            type="button"
            onClick={() => {
              playTrack(contextMenu.track, [contextMenu.track, ...queue])
              closeContextMenu()
            }}
          >
            Play now
          </button>
          <button
            type="button"
            onClick={() => {
              playNext(contextMenu.track)
              closeContextMenu()
            }}
          >
            Play next
          </button>
          <button
            type="button"
            onClick={() => {
              addToQueue(contextMenu.track)
              closeContextMenu()
            }}
          >
            Add to queue
          </button>
          <button
            type="button"
            onClick={() => {
              toggleLike(contextMenu.track.id)
              closeContextMenu()
            }}
          >
            {likedIds.has(contextMenu.track.id)
              ? 'Remove from Liked Songs'
              : 'Save to Liked Songs'}
          </button>
          <button
            type="button"
            onClick={() => {
              setAddToPlaylistTrack(contextMenu.track)
              closeContextMenu()
            }}
          >
            Add to playlist
          </button>
          <button
            type="button"
            onClick={() => {
              const artist = findArtistByTrackArtist(contextMenu.track.artist)
              if (artist) setView({ type: 'artist', id: artist.id })
              closeContextMenu()
            }}
          >
            Go to artist
          </button>
          <button
            type="button"
            onClick={() => {
              const album = albums.find(
                (a) =>
                  a.name === contextMenu.track.album &&
                  (a.artist === contextMenu.track.artist ||
                    contextMenu.track.artist.includes(a.artist)),
              )
              if (album) setView({ type: 'album', id: album.id })
              closeContextMenu()
            }}
          >
            Go to album
          </button>
          <button
            type="button"
            onClick={() => {
              setView({ type: 'search' })
              closeContextMenu()
            }}
          >
            Go to search
          </button>
        </div>
      )}

      {profileMenuOpen && (
        <div className="dropdown profile-dropdown menu-enter" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={() => {
              setProfileMenuOpen(false)
              setView({ type: 'profile' })
            }}
          >
            Profile
          </button>
          <button
            type="button"
            onClick={() => {
              setProfileMenuOpen(false)
              setView({ type: 'settings' })
            }}
          >
            Settings
          </button>
          <button
            type="button"
            onClick={() => {
              setProfileMenuOpen(false)
              setPremiumOpen(true)
            }}
          >
            Explore Premium
          </button>
          <button
            type="button"
            onClick={() => {
              setProfileMenuOpen(false)
              window.location.assign('/admin')
            }}
          >
            Admin Panel
          </button>
          <div className="dropdown-divider" />
          <button
            type="button"
            onClick={() => {
              setProfileMenuOpen(false)
              disconnectSpotify()
              setView({ type: 'home' })
            }}
          >
            Log out
          </button>
        </div>
      )}

      {notificationsOpen && (
        <div
          className="dropdown notifications-dropdown menu-enter"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="dropdown-title">What&apos;s New</div>
          <div className="notif-item">
            <strong>Welcome, {displayName}</strong>
            <span>Your Liked Songs and playlists are synced on this device.</span>
          </div>
          {getAnnouncements()
            .filter((a) => a.active)
            .map((a) => (
              <div key={a.id} className="notif-item">
                <strong>{a.title}</strong>
                <span>{a.body}</span>
              </div>
            ))}
          {whatsNew.map((n) => (
            <button
              key={n.id}
              type="button"
              className="notif-item notif-btn"
              onClick={() => {
                setNotificationsOpen(false)
                if (n.kind === 'music' || n.kind === 'podcast') {
                  setView({ type: 'search' })
                }
              }}
            >
              <img src={n.cover} alt="" className="notif-cover" />
              <div className="notif-text">
                <strong>{n.title}</strong>
                <span>{n.body}</span>
                <em className="notif-time">{n.time}</em>
              </div>
            </button>
          ))}
        </div>
      )}

      <SpotifyConnectModal />

      <div className="toast-stack">
        {toasts.map((t) => (
          <button
            key={t.id}
            type="button"
            className="toast"
            onClick={() => dismissToast(t.id)}
          >
            {t.message}
          </button>
        ))}
      </div>
    </>
  )
}

