import {
  albums,
  findArtistByTrackArtist,
  formatTime,
  getArtistTracks,
  type Album,
  type Artist,
  type Playlist,
  type Track,
} from '../data/music'
import { usePlayer } from '../context/PlayerContext'
import { HeartIcon, HeartOutlineIcon, MoreIcon, PauseIcon, PlayIcon } from './Icons'
import { TipButton } from './Tooltip'

type CardPlayProps = {
  tracks: Track[]
  start?: Track
}

function Equalizer() {
  return (
    <span className="eq" aria-hidden>
      <i />
      <i />
      <i />
    </span>
  )
}

function PlayOverlay({ tracks, start }: CardPlayProps) {
  const { playTrack, currentTrack, isPlaying, togglePlay } = usePlayer()
  const first = start ?? tracks[0]
  if (!first) return null
  const isCurrentInList = Boolean(currentTrack && tracks.some((t) => t.id === currentTrack.id))
  const playingHere = Boolean(isCurrentInList && isPlaying)

  return (
    <TipButton
      label={playingHere ? 'Pause' : 'Play'}
      className={`card-play ${playingHere ? 'visible' : ''}`}
      position="left"
      onClick={(e) => {
        e.stopPropagation()
        if (isCurrentInList) togglePlay()
        else playTrack(first, tracks)
      }}
    >
      {playingHere ? <PauseIcon size={22} /> : <PlayIcon size={22} />}
    </TipButton>
  )
}

export function PlaylistCard({
  playlist,
  tracks: list,
}: {
  playlist: Playlist
  tracks: Track[]
}) {
  const { setView } = usePlayer()
  return (
    <button
      type="button"
      className="media-card"
      onClick={() => setView({ type: 'playlist', id: playlist.id })}
    >
      <div className="media-art-wrap">
        <img src={playlist.cover} alt="" className="media-art" />
        <PlayOverlay tracks={list} />
      </div>
      <div className="media-title">{playlist.name}</div>
      <div className="media-sub">{playlist.description}</div>
    </button>
  )
}

export function AlbumCard({ album, tracks: list }: { album: Album; tracks: Track[] }) {
  const { setView } = usePlayer()
  return (
    <button
      type="button"
      className="media-card"
      onClick={() => setView({ type: 'album', id: album.id })}
    >
      <div className="media-art-wrap">
        <img src={album.cover} alt="" className="media-art" />
        <PlayOverlay tracks={list} />
      </div>
      <div className="media-title">{album.name}</div>
      <div className="media-sub">{album.artist}</div>
    </button>
  )
}

export function ArtistCard({ artist }: { artist: Artist }) {
  const { setView } = usePlayer()
  const list = getArtistTracks(artist.name)
  return (
    <button
      type="button"
      className="media-card artist-card"
      onClick={() => setView({ type: 'artist', id: artist.id })}
    >
      <div className="media-art-wrap round">
        <img src={artist.cover} alt="" className="media-art round" />
        <PlayOverlay tracks={list} />
      </div>
      <div className="media-title">{artist.name}</div>
      <div className="media-sub">Artist</div>
    </button>
  )
}

export function TrackRow({
  track,
  index,
  queue,
  showAlbum = true,
  playlistId,
  onMove,
}: {
  track: Track
  index: number
  queue: Track[]
  showAlbum?: boolean
  playlistId?: string
  onMove?: (from: number, to: number) => void
}) {
  const {
    playTrack,
    currentTrack,
    isPlaying,
    togglePlay,
    likedIds,
    toggleLike,
    openContextMenu,
    setAddToPlaylistTrack,
    removeTrackFromPlaylist,
    setView,
  } = usePlayer()
  const active = currentTrack?.id === track.id
  const playing = active && isPlaying
  const canRemove =
    Boolean(playlistId) &&
    (playlistId === 'liked' || Boolean(playlistId?.startsWith('custom-')))
  const canReorder = Boolean(playlistId?.startsWith('custom-') && onMove)
  const artist = findArtistByTrackArtist(track.artist)
  const album = albums.find(
    (a) =>
      a.name === track.album &&
      (a.artist === track.artist || track.artist.includes(a.artist)),
  )

  return (
    <div
      className={`track-row ${active ? 'active' : ''} ${playing ? 'is-playing' : ''}`}
      onClick={() => {
        if (active) togglePlay()
        else playTrack(track, queue)
      }}
      onContextMenu={(e) => openContextMenu(e, track)}
      onDoubleClick={() => playTrack(track, queue)}
    >
      <div className="track-index">
        {playing ? (
          <Equalizer />
        ) : (
          <span className="num">{index}</span>
        )}
        <button
          type="button"
          className="track-play"
          aria-label={playing ? 'Pause' : 'Play'}
          onClick={(e) => {
            e.stopPropagation()
            if (active) togglePlay()
            else playTrack(track, queue)
          }}
        >
          {playing ? <PauseIcon size={14} /> : <PlayIcon size={14} />}
        </button>
      </div>
      <div className="track-info">
        <img
          src={track.cover}
          alt=""
          onError={(e) => {
            e.currentTarget.src = '/covers/c1.jpg'
          }}
        />
        <div>
          <div className={`track-name ${active ? 'playing' : ''}`}>{track.title}</div>
          <button
            type="button"
            className="track-artist linkish"
            onClick={(e) => {
              e.stopPropagation()
              if (artist) setView({ type: 'artist', id: artist.id })
            }}
          >
            {track.artist}
          </button>
        </div>
      </div>
      {showAlbum && (
        <button
          type="button"
          className="track-album linkish"
          onClick={(e) => {
            e.stopPropagation()
            if (album) setView({ type: 'album', id: album.id })
          }}
        >
          {track.album}
        </button>
      )}
      <TipButton
        label={likedIds.has(track.id) ? 'Remove from Liked Songs' : 'Save to Liked Songs'}
        className={`icon-btn like-btn ${likedIds.has(track.id) ? 'liked' : ''}`}
        position="top"
        onClick={(e) => {
          e.stopPropagation()
          toggleLike(track.id)
        }}
      >
        {likedIds.has(track.id) ? <HeartIcon size={16} /> : <HeartOutlineIcon size={16} />}
      </TipButton>
      <div className="track-duration">{formatTime(track.duration)}</div>
      <div className="track-actions">
        {canReorder && onMove && (
          <>
            <button
              type="button"
              className="text-link"
              disabled={index <= 1}
              onClick={(e) => {
                e.stopPropagation()
                onMove(index - 1, index - 2)
              }}
            >
              ↑
            </button>
            <button
              type="button"
              className="text-link"
              disabled={index >= queue.length}
              onClick={(e) => {
                e.stopPropagation()
                onMove(index - 1, index)
              }}
            >
              ↓
            </button>
          </>
        )}
        {canRemove && playlistId && (
          <button
            type="button"
            className="text-link"
            onClick={(e) => {
              e.stopPropagation()
              removeTrackFromPlaylist(playlistId, track.id)
            }}
          >
            Remove
          </button>
        )}
        <TipButton
          label="More options"
          className="icon-btn more-btn"
          position="top"
          onClick={(e) => {
            e.stopPropagation()
            openContextMenu(e, track)
          }}
        >
          <MoreIcon size={18} />
        </TipButton>
        <button
          type="button"
          className="sr-only"
          onClick={(e) => {
            e.stopPropagation()
            setAddToPlaylistTrack(track)
          }}
        >
          Add to playlist
        </button>
      </div>
    </div>
  )
}

export function SkeletonGrid({ count = 8 }: { count?: number }) {
  return (
    <div className="card-grid">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="skeleton-card">
          <div className="skeleton skeleton-art" />
          <div className="skeleton skeleton-line" />
          <div className="skeleton skeleton-line short" />
        </div>
      ))}
    </div>
  )
}

export function SkeletonTracks({ count = 6 }: { count?: number }) {
  return (
    <div className="track-list">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="skeleton-track">
          <div className="skeleton skeleton-num" />
          <div className="skeleton skeleton-thumb" />
          <div className="skeleton-track-meta">
            <div className="skeleton skeleton-line" />
            <div className="skeleton skeleton-line short" />
          </div>
        </div>
      ))}
    </div>
  )
}
