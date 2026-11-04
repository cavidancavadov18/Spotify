import { findArtistByTrackArtist } from '../data/music'
import { usePlayer } from '../context/PlayerContext'
import { CloseIcon, HeartIcon, HeartOutlineIcon, PauseIcon, PlayIcon } from './Icons'
import { TipButton } from './Tooltip'

export function NowPlayingPanel() {
  const {
    rightPanelOpen,
    setRightPanelOpen,
    currentTrack,
    isPlaying,
    togglePlay,
    likedIds,
    toggleLike,
    setView,
    playTrack,
    queue,
    queueIndex,
  } = usePlayer()

  const artist = currentTrack ? findArtistByTrackArtist(currentTrack.artist) : null
  const upcoming = queue.slice(queueIndex + 1, queueIndex + 4)

  return (
    <aside
      className={`now-panel ${rightPanelOpen ? 'open' : 'closed'}`}
      aria-label="Now playing"
      aria-hidden={!rightPanelOpen}
    >
      <div className="now-panel-header">
        <button
          type="button"
          className="now-panel-title linkish"
          onClick={() => {
            if (artist) setView({ type: 'artist', id: artist.id })
          }}
        >
          {currentTrack ? `${currentTrack.artist} Radio` : 'Now playing'}
        </button>
        <TipButton
          label="Close"
          className="icon-btn"
          position="left"
          onClick={() => setRightPanelOpen(false)}
        >
          <CloseIcon />
        </TipButton>
      </div>

      {currentTrack ? (
        <div className="now-panel-body">
          <div className={`now-panel-art-wrap ${isPlaying ? 'playing' : ''}`}>
            <img
              src={currentTrack.cover}
              alt=""
              className="now-panel-art"
              onError={(e) => {
                e.currentTarget.src = artist?.cover || '/covers/c1.jpg'
              }}
            />
            <TipButton
              label={isPlaying ? 'Pause' : 'Play'}
              className="now-panel-play"
              position="left"
              onClick={togglePlay}
            >
              {isPlaying ? <PauseIcon size={22} /> : <PlayIcon size={22} />}
            </TipButton>
          </div>

          <div className="now-panel-meta">
            <div>
              <div className="now-panel-track">{currentTrack.title}</div>
              <button
                type="button"
                className="now-panel-artist linkish"
                onClick={() => {
                  if (artist) setView({ type: 'artist', id: artist.id })
                }}
              >
                {currentTrack.artist}
              </button>
            </div>
            <TipButton
              label={
                likedIds.has(currentTrack.id)
                  ? 'Remove from Liked Songs'
                  : 'Save to Liked Songs'
              }
              className={`icon-btn like-btn ${likedIds.has(currentTrack.id) ? 'liked' : ''}`}
              position="left"
              onClick={() => toggleLike(currentTrack.id)}
            >
              {likedIds.has(currentTrack.id) ? (
                <HeartIcon size={18} />
              ) : (
                <HeartOutlineIcon size={18} />
              )}
            </TipButton>
          </div>

          <div className="about-artist-card">
            <div className="about-label">About the artist</div>
            <button
              type="button"
              className="about-artist-btn"
              onClick={() => {
                if (artist) setView({ type: 'artist', id: artist.id })
              }}
            >
              <img
                src={artist?.cover || currentTrack.cover}
                alt=""
                className="about-artist-img"
              />
              <div className="about-artist-info">
                <div className="about-artist-name">{currentTrack.artist}</div>
                <div className="about-artist-sub">
                  {artist?.followers ? `${artist.followers} monthly listeners` : 'Artist'}
                </div>
              </div>
            </button>
            <p className="about-blurb">
              Popular artist with millions of monthly listeners. Open the artist page for
              top tracks and albums.
            </p>
          </div>

          <div className="now-panel-next">
            <div className="about-label">Next in queue</div>
            {upcoming.length === 0 && <p className="empty-hint">No upcoming tracks</p>}
            {upcoming.map((t, i) => (
              <button
                key={`${t.id}-${queueIndex + 1 + i}`}
                type="button"
                className="queue-item compact"
                onClick={() => playTrack(t, queue)}
              >
                <img src={t.cover} alt="" />
                <div>
                  <div className="qi-title">{t.title}</div>
                  <div className="qi-sub">{t.artist}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <p className="empty-hint">Play a song to see details here.</p>
      )}
    </aside>
  )
}
