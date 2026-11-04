import type { CSSProperties } from 'react'
import { albums, findArtistByTrackArtist, formatTime } from '../data/music'
import { usePlayer, useProgress } from '../context/PlayerContext'
import {
  DeviceIcon,
  FullscreenIcon,
  HeartIcon,
  HeartOutlineIcon,
  MicIcon,
  NextIcon,
  PauseIcon,
  PlayIcon,
  PrevIcon,
  QueueIcon,
  RepeatIcon,
  RepeatOneIcon,
  ShuffleIcon,
  VolumeIcon,
  VolumeMuteIcon,
} from './Icons'
import { TipButton } from './Tooltip'
import { SpectrumBars } from './MotionFX'

export function PlayerBar() {
  const {
    currentTrack,
    isPlaying,
    isBuffering,
    playbackError,
    volume,
    muted,
    shuffle,
    repeat,
    likedIds,
    togglePlay,
    next,
    prev,
    seek,
    setVolume,
    toggleMute,
    toggleShuffle,
    cycleRepeat,
    toggleLike,
    queueOpen,
    toggleQueue,
    lyricsOpen,
    setLyricsOpen,
    setDevicesOpen,
    setView,
    rightPanelOpen,
    toggleRightPanel,
    isFullscreen,
    toggleFullscreen,
  } = usePlayer()
  const { progress, duration } = useProgress()

  const liked = currentTrack ? likedIds.has(currentTrack.id) : false
  const pct = duration > 0 ? (progress / duration) * 100 : 0
  const volPct = muted ? 0 : volume * 100
  const artist = currentTrack ? findArtistByTrackArtist(currentTrack.artist) : null
  const album = currentTrack
    ? albums.find(
        (a) =>
          a.name === currentTrack.album &&
          (a.artist === currentTrack.artist ||
            currentTrack.artist.includes(a.artist)),
      )
    : null

  const openNowPlayingEntity = () => {
    if (album) setView({ type: 'album', id: album.id })
    else if (artist) setView({ type: 'artist', id: artist.id })
    else setView({ type: 'search' })
  }

  const repeatLabel =
    repeat === 'off' ? 'Enable repeat' : repeat === 'all' ? 'Enable repeat one' : 'Disable repeat'

  return (
    <footer className={`player-bar ${isPlaying ? 'playing' : ''}`}>
      <div className="now-playing">
        {currentTrack ? (
          <>
            <TipButton
              label={currentTrack.album}
              className={`now-cover-btn ${isPlaying ? 'spin-soft vinyl-spin' : ''}`}
              position="top"
              onClick={openNowPlayingEntity}
            >
              <span className="now-cover-ring" aria-hidden />
              <img
                src={currentTrack.cover}
                alt=""
                className="now-cover"
                onError={(e) => {
                  const fallback = artist?.cover || '/covers/c1.jpg'
                  if (e.currentTarget.src.endsWith(fallback)) e.currentTarget.src = '/covers/c1.jpg'
                  else e.currentTarget.src = fallback
                }}
              />
            </TipButton>
            <div className="now-meta">
              <TipButton
                label="Open album"
                className="now-title linkish"
                position="top"
                onClick={openNowPlayingEntity}
              >
                {isPlaying && (
                  <span className="now-eq" aria-hidden>
                    <i />
                    <i />
                    <i />
                  </span>
                )}
                {currentTrack.title}
              </TipButton>
              <TipButton
                label="Go to artist"
                className="now-artist linkish"
                position="top"
                onClick={() => {
                  if (artist) setView({ type: 'artist', id: artist.id })
                }}
              >
                {currentTrack.artist}
              </TipButton>
              {playbackError && <div className="now-error">{playbackError}</div>}
              {isBuffering && !playbackError && <div className="now-buffering">Loading…</div>}
            </div>
            <TipButton
              label={liked ? 'Remove from Liked Songs' : 'Save to Liked Songs'}
              className={`icon-btn like-btn ${liked ? 'liked' : ''}`}
              position="top"
              onClick={() => toggleLike(currentTrack.id)}
            >
              {liked ? <HeartIcon size={16} /> : <HeartOutlineIcon size={16} />}
            </TipButton>
          </>
        ) : (
          <div className="now-meta empty">
            <div className="now-title">Select a song</div>
          </div>
        )}
      </div>

      <div className="player-center">
        <div className="player-controls">
          <TipButton
            label={shuffle ? 'Disable shuffle' : 'Enable shuffle'}
            className={`ctrl-btn ${shuffle ? 'active' : ''}`}
            position="top"
            aria-pressed={shuffle}
            onClick={toggleShuffle}
          >
            <ShuffleIcon />
          </TipButton>
          <TipButton label="Previous" className="ctrl-btn" position="top" onClick={prev}>
            <PrevIcon />
          </TipButton>
          <TipButton
            label={isPlaying ? 'Pause' : 'Play'}
            className={`play-btn ${isBuffering ? 'buffering' : ''} ${isPlaying ? 'is-playing' : ''}`}
            position="top"
            onClick={togglePlay}
            disabled={!currentTrack}
          >
            {isPlaying ? <PauseIcon size={20} /> : <PlayIcon size={20} />}
          </TipButton>
          <TipButton label="Next" className="ctrl-btn" position="top" onClick={next}>
            <NextIcon />
          </TipButton>
          <TipButton
            label={repeatLabel}
            className={`ctrl-btn ${repeat !== 'off' ? 'active' : ''}`}
            position="top"
            aria-pressed={repeat !== 'off'}
            onClick={cycleRepeat}
          >
            {repeat === 'one' ? <RepeatOneIcon /> : <RepeatIcon />}
          </TipButton>
        </div>

        <div className="progress-row">
          <span className="time">{formatTime(progress)}</span>
          <input
            type="range"
            className="range progress"
            title="Seek"
            min={0}
            max={duration || currentTrack?.duration || 0}
            step={0.1}
            value={Math.min(progress, duration || progress || 0)}
            style={{ '--value': `${pct}%` } as CSSProperties}
            onChange={(e) => seek(Number(e.target.value))}
            onInput={(e) => seek(Number((e.target as HTMLInputElement).value))}
            aria-label="Seek"
            disabled={!currentTrack}
          />
          <span className="time">{formatTime(duration || currentTrack?.duration || 0)}</span>
        </div>
        <SpectrumBars active={isPlaying} />
      </div>

      <div className="player-right">
        <TipButton
          label="Now Playing view"
          className={`ctrl-btn desktop-only ${rightPanelOpen ? 'active' : ''}`}
          position="top"
          onClick={toggleRightPanel}
        >
          <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor" aria-hidden>
            <path d="M1 1.75A.75.75 0 0 1 1.75 1h4.5a.75.75 0 0 1 0 1.5h-4.5A.75.75 0 0 1 1 1.75zm0 4A.75.75 0 0 1 1.75 5h4.5a.75.75 0 0 1 0 1.5h-4.5A.75.75 0 0 1 1 5.75zm0 4A.75.75 0 0 1 1.75 9h4.5a.75.75 0 0 1 0 1.5h-4.5A.75.75 0 0 1 1 9.75zm0 4a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 0 1.5h-4.5a.75.75 0 0 1-.75-.75zM8.75 2.75a.75.75 0 0 0 0 1.5h5.5a.75.75 0 0 0 0-1.5h-5.5zM8 6.75A.75.75 0 0 1 8.75 6h5.5a.75.75 0 0 1 0 1.5h-5.5A.75.75 0 0 1 8 6.75zM8.75 10a.75.75 0 0 0 0 1.5h5.5a.75.75 0 0 0 0-1.5h-5.5zM8 14.75a.75.75 0 0 1 .75-.75h5.5a.75.75 0 0 1 0 1.5h-5.5a.75.75 0 0 1-.75-.75z" />
          </svg>
        </TipButton>
        <TipButton
          label="Lyrics"
          className={`ctrl-btn desktop-only ${lyricsOpen ? 'active' : ''}`}
          position="top"
          onClick={() => setLyricsOpen(!lyricsOpen)}
        >
          <MicIcon />
        </TipButton>
        <TipButton
          label="Queue"
          className={`ctrl-btn desktop-only ${queueOpen ? 'active' : ''}`}
          position="top"
          onClick={toggleQueue}
        >
          <QueueIcon />
        </TipButton>
        <TipButton
          label="Connect to a device"
          className="ctrl-btn desktop-only"
          position="top"
          onClick={() => setDevicesOpen(true)}
        >
          <DeviceIcon />
        </TipButton>
        <div className="volume-row">
          <TipButton
            label={muted || volume === 0 ? 'Unmute' : 'Mute'}
            className="ctrl-btn"
            position="top"
            onClick={toggleMute}
          >
            {muted || volume === 0 ? <VolumeMuteIcon /> : <VolumeIcon />}
          </TipButton>
          <input
            type="range"
            className="range volume desktop-only"
            title="Volume"
            min={0}
            max={1}
            step={0.01}
            value={muted ? 0 : volume}
            style={{ '--value': `${volPct}%` } as CSSProperties}
            onChange={(e) => setVolume(Number(e.target.value))}
            aria-label="Volume"
          />
        </div>
        <TipButton
          label={isFullscreen ? 'Exit full screen' : 'Full screen'}
          className={`ctrl-btn desktop-only ${isFullscreen ? 'active' : ''}`}
          position="top"
          onClick={toggleFullscreen}
        >
          <FullscreenIcon />
        </TipButton>
      </div>
    </footer>
  )
}
