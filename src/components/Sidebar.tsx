import { albums, artists } from '../data/music'
import { usePlayer } from '../context/PlayerContext'
import { CloseIcon, LibraryIcon, PlusIcon } from './Icons'
import { TipButton } from './Tooltip'

export function Sidebar() {
  const {
    view,
    setView,
    sidebarOpen,
    setSidebarOpen,
    setCreatePlaylistOpen,
    libraryFilter,
    setLibraryFilter,
    allPlaylists,
    libraryCollapsed,
    toggleLibraryCollapsed,
    setLibraryCollapsed,
    setSearchQuery,
  } = usePlayer()

  const playlistItems = allPlaylists.map((p) => ({
    id: p.id,
    name: p.name,
    cover: p.cover,
    subtitle: `Playlist · ${p.owner}`,
    kind: 'playlist' as const,
  }))

  const albumItems = albums.map((a) => ({
    id: a.id,
    name: a.name,
    cover: a.cover,
    subtitle: `Album · ${a.artist}`,
    kind: 'album' as const,
  }))

  const artistItems = artists.map((a) => ({
    id: a.id,
    name: a.name,
    cover: a.cover,
    subtitle: 'Artist',
    kind: 'artist' as const,
    round: true,
  }))

  const libraryItems =
    libraryFilter === 'playlists'
      ? playlistItems
      : libraryFilter === 'albums'
        ? albumItems
        : libraryFilter === 'artists'
          ? artistItems
          : [...playlistItems.slice(0, 40), ...albumItems.slice(0, 20), ...artistItems.slice(0, 20)]

  const openItem = (item: (typeof libraryItems)[number]) => {
    if (item.kind === 'playlist') setView({ type: 'playlist', id: item.id })
    if (item.kind === 'album') setView({ type: 'album', id: item.id })
    if (item.kind === 'artist') setView({ type: 'artist', id: item.id })
    setSidebarOpen(false)
  }

  const browsePodcasts = () => {
    setLibraryCollapsed(false)
    setSearchQuery('podcast')
    setView({ type: 'search' })
    setSidebarOpen(false)
  }

  return (
    <>
      {sidebarOpen && (
        <button
          type="button"
          className="sidebar-backdrop"
          aria-label="Close menu"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <aside
        className={`sidebar ${sidebarOpen ? 'open' : ''} ${libraryCollapsed ? 'collapsed' : ''}`}
      >
        <div className="sidebar-panel library-panel full-height">
          {/* Header — exact Spotify layout */}
          <div className={`library-header ${libraryCollapsed ? 'is-collapsed' : ''}`}>
            <TipButton
              label={libraryCollapsed ? 'Expand Your Library' : 'Collapse Your Library'}
              className={`library-title ${view.type === 'library' ? 'active' : ''}`}
              position="right"
              onClick={() => toggleLibraryCollapsed()}
            >
              <LibraryIcon size={24} />
              {!libraryCollapsed && <span>Your Library</span>}
            </TipButton>

            {!libraryCollapsed ? (
              <div className="library-header-actions">
                <button
                  type="button"
                  className="library-create-pill"
                  onClick={() => setCreatePlaylistOpen(true)}
                >
                  <PlusIcon size={16} />
                  <span>Create</span>
                </button>
                <TipButton
                  label="Close"
                  className="icon-btn mobile-only"
                  onClick={() => setSidebarOpen(false)}
                >
                  <CloseIcon size={18} />
                </TipButton>
              </div>
            ) : (
              <TipButton
                label="Create playlist"
                className="icon-btn library-collapsed-plus"
                position="right"
                onClick={() => {
                  setLibraryCollapsed(false)
                  setCreatePlaylistOpen(true)
                }}
              >
                <PlusIcon />
              </TipButton>
            )}
          </div>

          {/* Expanded: banners first (screenshot), then chips + list */}
          {!libraryCollapsed && (
            <div className="library-scroll">
              <div className="library-banners">
                <div className="library-banner">
                  <h3 className="library-banner-title">Create your first playlist</h3>
                  <p className="library-banner-sub">It&apos;s easy, we&apos;ll help you</p>
                  <button
                    type="button"
                    className="library-banner-btn"
                    onClick={() => setCreatePlaylistOpen(true)}
                  >
                    Create playlist
                  </button>
                </div>

                <div className="library-banner">
                  <h3 className="library-banner-title">Let&apos;s find some podcasts to follow</h3>
                  <p className="library-banner-sub">We&apos;ll keep you updated on new episodes</p>
                  <button type="button" className="library-banner-btn" onClick={browsePodcasts}>
                    Browse podcasts
                  </button>
                </div>
              </div>

              <div className="library-chips">
                <button
                  type="button"
                  className={`chip ${libraryFilter === 'all' ? 'active' : ''}`}
                  onClick={() => setLibraryFilter('all')}
                >
                  All
                </button>
                <button
                  type="button"
                  className={`chip ${libraryFilter === 'playlists' ? 'active' : ''}`}
                  onClick={() => setLibraryFilter('playlists')}
                >
                  Playlists
                </button>
                <button type="button" className="chip" onClick={browsePodcasts}>
                  Podcasts
                </button>
                <button
                  type="button"
                  className={`chip ${libraryFilter === 'albums' ? 'active' : ''}`}
                  onClick={() => setLibraryFilter('albums')}
                >
                  Albums
                </button>
                <button
                  type="button"
                  className={`chip ${libraryFilter === 'artists' ? 'active' : ''}`}
                  onClick={() => setLibraryFilter('artists')}
                >
                  Artists
                </button>
              </div>

              <div className="library-list">
                {libraryItems.map((item) => {
                  const active =
                    (item.kind === 'playlist' &&
                      view.type === 'playlist' &&
                      view.id === item.id) ||
                    (item.kind === 'album' && view.type === 'album' && view.id === item.id) ||
                    (item.kind === 'artist' && view.type === 'artist' && view.id === item.id)

                  return (
                    <button
                      key={`${item.kind}-${item.id}`}
                      type="button"
                      className={`library-item ${active ? 'active' : ''}`}
                      onClick={() => openItem(item)}
                    >
                      <img
                        src={item.cover}
                        alt=""
                        className={`library-cover ${'round' in item && item.round ? 'round' : ''}`}
                        onError={(e) => {
                          e.currentTarget.src = '/covers/c1.jpg'
                        }}
                      />
                      <div className="library-meta">
                        <div className="library-name">{item.name}</div>
                        <div className="library-sub">{item.subtitle}</div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Collapsed: cover thumbs only */}
          {libraryCollapsed && (
            <div className="library-list is-collapsed">
              {libraryItems.map((item) => {
                const active =
                  (item.kind === 'playlist' &&
                    view.type === 'playlist' &&
                    view.id === item.id) ||
                  (item.kind === 'album' && view.type === 'album' && view.id === item.id) ||
                  (item.kind === 'artist' && view.type === 'artist' && view.id === item.id)

                return (
                  <TipButton
                    key={`${item.kind}-${item.id}`}
                    label={`${item.name} · ${item.subtitle}`}
                    className={`library-item collapsed-thumb ${active ? 'active' : ''}`}
                    position="right"
                    onClick={() => openItem(item)}
                  >
                    <img
                      src={item.cover}
                      alt=""
                      className={`library-cover ${'round' in item && item.round ? 'round' : ''}`}
                      onError={(e) => {
                        e.currentTarget.src = '/covers/c1.jpg'
                      }}
                    />
                  </TipButton>
                )
              })}
            </div>
          )}
        </div>
      </aside>
    </>
  )
}
