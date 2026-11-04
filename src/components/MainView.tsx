import { useEffect, useMemo, useState, type CSSProperties, type ReactNode } from 'react'
import {
  albums,
  artists,
  formatTime,
  getAlbum,
  getArtist,
  getArtistTracks,
  getTracksByIds,
  getVisibleTracks,
  matchesQuery,
  recentlyPlayed as seedRecent,
  type Playlist,
} from '../data/music'
import { usePlayer } from '../context/PlayerContext'
import { AlbumCard, ArtistCard, PlaylistCard, SkeletonGrid, SkeletonTracks, TrackRow } from './Cards'
import { ClockIcon, PauseIcon, PlayIcon } from './Icons'
import { SiteFooter } from './SiteFooter'
import { TipButton } from './Tooltip'

function SectionHeader({ title, onSeeAll }: { title: string; onSeeAll?: () => void }) {
  return (
    <div className="section-header">
      <h2>{title}</h2>
      {onSeeAll && (
        <button type="button" className="see-all" onClick={onSeeAll}>
          Show all
        </button>
      )}
    </div>
  )
}

function EmptyBlock({ title, hint }: { title: string; hint: string }) {
  return (
    <div className="empty-block">
      <h3>{title}</h3>
      <p>{hint}</p>
    </div>
  )
}

type HomeFilter = 'all' | 'music' | 'podcasts' | 'audiobooks'

type QuickItem =
  | { kind: 'playlist'; item: Playlist }
  | { kind: 'album'; item: NonNullable<ReturnType<typeof getAlbum>> }
  | {
      kind: 'artist'
      item: { id: string; name: string; cover: string; trackIds: string[]; color: string }
    }

function timeGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 18) return 'Good afternoon'
  return 'Good evening'
}

function resolveLibraryId(
  id: string,
  allPlaylists: ReturnType<typeof usePlayer>['allPlaylists'],
): QuickItem | null {
  const pl = allPlaylists.find((p) => p.id === id)
  if (pl) return { kind: 'playlist', item: pl }
  const al = getAlbum(id)
  if (al) return { kind: 'album', item: al }
  const ar = getArtist(id)
  if (ar) {
    const list = getArtistTracks(ar.name)
    return {
      kind: 'artist',
      item: {
        id: ar.id,
        name: ar.name,
        cover: ar.cover,
        trackIds: list.map((t) => t.id),
        color: ar.color,
      },
    }
  }
  return null
}

function HomeView() {
  const {
    setView,
    playTrack,
    recentlyPlayedIds,
    allPlaylists,
    displayName,
    currentTrack,
    isPlaying,
    togglePlay,
    setRightPanelOpen,
  } = usePlayer()
  const [homeFilter, setHomeFilter] = useState<HomeFilter>('all')

  useEffect(() => {
    setRightPanelOpen(true)
  }, [setRightPanelOpen])

  const preferredQuick = useMemo(
    () =>
      [
        'p1',
        'liked',
        'p2',
        'a1',
        'p4',
        'a3',
        'p-az',
        'p-tr',
        ...recentlyPlayedIds,
        ...seedRecent,
      ].filter((id, i, arr) => arr.indexOf(id) === i),
    [recentlyPlayedIds],
  )

  const quickCards = useMemo(() => {
    const out: QuickItem[] = []
    for (const id of preferredQuick) {
      const hit = resolveLibraryId(id, allPlaylists)
      if (hit) out.push(hit)
      if (out.length >= 6) break
    }
    return out
  }, [preferredQuick, allPlaylists])

  const madeFor = useMemo(
    () =>
      allPlaylists
        .filter((p) => p.id !== 'liked' && !p.id.startsWith('radio-'))
        .slice(0, 8),
    [allPlaylists],
  )

  const jumpBack = useMemo(() => {
    const fromRecent = recentlyPlayedIds
      .map((id) => resolveLibraryId(id, allPlaylists))
      .filter(Boolean) as QuickItem[]
    const albumFill = albums.slice(0, 8).map((a) => ({ kind: 'album' as const, item: a }))
    const artistFill = artists.slice(0, 6).map((a) => ({
      kind: 'artist' as const,
      item: {
        id: a.id,
        name: a.name,
        cover: a.cover,
        trackIds: getArtistTracks(a.name).map((t) => t.id),
        color: a.color,
      },
    }))
    const merged = [...fromRecent, ...albumFill, ...artistFill]
    const seen = new Set<string>()
    return merged.filter((x) => {
      const key = `${x.kind}-${x.item.id}`
      if (seen.has(key)) return false
      seen.add(key)
      return true
    }).slice(0, 8)
  }, [recentlyPlayedIds, allPlaylists])

  const featuredRadios = useMemo(() => {
    const ids = [
      'radio-aygun-kazimova',
      'radio-sezen-aksu',
      'radio-roya',
      'radio-tarkan',
      'radio-tunzale',
      'radio-gulsen',
      'radio-alim-qasimov',
      'radio-duman',
    ]
    return ids.map((id) => allPlaylists.find((p) => p.id === id)).filter(Boolean) as typeof allPlaylists
  }, [allPlaylists])

  const shows = useMemo(
    () =>
      allPlaylists
        .filter((p) => p.id.startsWith('radio-') || p.id.startsWith('p'))
        .slice(0, 10)
        .map((p, i) => ({
          ...p,
          name: homeFilter === 'audiobooks' ? `${p.name} · Story` : `${p.name} Podcast`,
          description:
            homeFilter === 'audiobooks'
              ? 'Audiobook-style listening · episodes from your catalog'
              : `Episode ${i + 1} · Updated weekly`,
        })),
    [allPlaylists, homeFilter],
  )

  const openQuick = (kind: QuickItem['kind'], id: string) => {
    if (kind === 'playlist') setView({ type: 'playlist', id })
    else if (kind === 'album') setView({ type: 'album', id })
    else setView({ type: 'artist', id })
  }

  const filters: { id: HomeFilter; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'music', label: 'Music' },
    { id: 'podcasts', label: 'Podcasts' },
    { id: 'audiobooks', label: 'Audiobooks' },
  ]

  const accentPalette = ['#1ed760', '#e13300', '#509bf5', '#f59b23', '#af2896', '#148a08']

  return (
    <div className="home-view view-enter home-screen">
      <div className="home-top-fade" aria-hidden />
      <div className="home-color-fx" aria-hidden>
        <div className="home-fx-stage">
          <span className="home-orb o1" />
          <span className="home-orb o2" />
          <span className="home-orb o3" />
          <span className="home-orb o4" />
          <span className="home-ribbon" />
        </div>
      </div>

      <div className="home-filters home-stagger" style={{ ['--i' as string]: 0 }}>
        {filters.map((f, fi) => (
          <TipButton
            key={f.id}
            label={f.label}
            position="bottom"
            className={`chip home-chip ${homeFilter === f.id ? 'active' : ''}`}
            style={{ ['--chip-accent' as string]: accentPalette[fi % accentPalette.length] }}
            onClick={() => setHomeFilter(f.id)}
          >
            {f.label}
          </TipButton>
        ))}
      </div>

      <h1 className="greeting home-stagger" style={{ ['--i' as string]: 1 }}>
        {timeGreeting()}
      </h1>

      {(homeFilter === 'all' || homeFilter === 'music') && (
        <>
          <div className="recent-grid home-recent home-stagger" style={{ ['--i' as string]: 2 }}>
            {quickCards.map(({ kind, item }, idx) => {
              const list = getTracksByIds(item.trackIds)
              const playingHere = Boolean(
                currentTrack && list.some((t) => t.id === currentTrack.id) && isPlaying,
              )
              const accent =
                ('color' in item && item.color) || accentPalette[idx % accentPalette.length]
              return (
                <button
                  key={`${kind}-${item.id}`}
                  type="button"
                  className={`recent-card home-quick-card ${playingHere ? 'is-playing' : ''}`}
                  style={
                    {
                      ['--qi' as string]: idx,
                      ['--card-accent' as string]: accent,
                    } as CSSProperties
                  }
                  onClick={() => openQuick(kind, item.id)}
                >
                  <span className="quick-glow" aria-hidden />
                  <img src={item.cover} alt="" className={kind === 'artist' ? 'round' : ''} />
                  <span>{item.name}</span>
                  <span
                    className={`recent-play ${playingHere ? 'forced' : ''}`}
                    role="button"
                    tabIndex={0}
                    aria-label={playingHere ? 'Pause' : 'Play'}
                    onClick={(e) => {
                      e.stopPropagation()
                      if (!list[0]) return
                      if (playingHere) togglePlay()
                      else playTrack(list[0], list)
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        e.stopPropagation()
                        if (!list[0]) return
                        if (playingHere) togglePlay()
                        else playTrack(list[0], list)
                      }
                    }}
                  >
                    {playingHere ? <PauseIcon size={20} /> : <PlayIcon size={20} />}
                  </span>
                </button>
              )
            })}
          </div>

          <section className="content-section home-stagger" style={{ ['--i' as string]: 3 }}>
            <SectionHeader
              title={`Made for ${displayName.split(' ')[0] || 'you'}`}
              onSeeAll={() => setView({ type: 'library' })}
            />
            <div className="card-grid home-card-row">
              {madeFor.map((p) => (
                <PlaylistCard key={p.id} playlist={p} tracks={getTracksByIds(p.trackIds)} />
              ))}
            </div>
          </section>

          <section className="content-section home-stagger" style={{ ['--i' as string]: 4 }}>
            <SectionHeader title="Jump back in" onSeeAll={() => setView({ type: 'library' })} />
            <div className="card-grid home-card-row">
              {jumpBack.map((entry) => {
                if (entry.kind === 'album') {
                  return (
                    <AlbumCard
                      key={`jb-${entry.item.id}`}
                      album={entry.item}
                      tracks={getTracksByIds(entry.item.trackIds)}
                    />
                  )
                }
                if (entry.kind === 'artist') {
                  const ar = artists.find((a) => a.id === entry.item.id)
                  if (!ar) return null
                  return <ArtistCard key={`jb-ar-${ar.id}`} artist={ar} />
                }
                return (
                  <PlaylistCard
                    key={`jb-pl-${entry.item.id}`}
                    playlist={entry.item}
                    tracks={getTracksByIds(entry.item.trackIds)}
                  />
                )
              })}
            </div>
          </section>

          <section className="content-section home-stagger" style={{ ['--i' as string]: 5 }}>
            <SectionHeader title="Radio for you" onSeeAll={() => setView({ type: 'search' })} />
            <div className="card-grid home-card-row radio-grid">
              {featuredRadios.map((r) => (
                <PlaylistCard key={r.id} playlist={r} tracks={getTracksByIds(r.trackIds)} />
              ))}
            </div>
          </section>

          <section className="content-section home-stagger" style={{ ['--i' as string]: 6 }}>
            <SectionHeader title="Popular albums" onSeeAll={() => setView({ type: 'library' })} />
            <div className="card-grid home-card-row">
              {albums.slice(0, 10).map((a) => (
                <AlbumCard key={a.id} album={a} tracks={getTracksByIds(a.trackIds)} />
              ))}
            </div>
          </section>

          <section className="content-section home-stagger" style={{ ['--i' as string]: 7 }}>
            <SectionHeader title="Popular artists" onSeeAll={() => setView({ type: 'library' })} />
            <div className="card-grid home-card-row">
              {artists.slice(0, 12).map((a) => (
                <ArtistCard key={a.id} artist={a} />
              ))}
            </div>
          </section>

          <section className="content-section home-stagger" style={{ ['--i' as string]: 8 }}>
            <SectionHeader title="Azərbaycan & Türkçe" onSeeAll={() => setView({ type: 'search' })} />
            <div className="card-grid home-card-row">
              {artists
                .filter((a) => a.id.startsWith('aztr-'))
                .slice(0, 12)
                .map((a) => (
                  <ArtistCard key={a.id} artist={a} />
                ))}
            </div>
          </section>
        </>
      )}

      {(homeFilter === 'podcasts' || homeFilter === 'audiobooks') && (
        <>
          <section className="content-section home-stagger" style={{ ['--i' as string]: 2 }}>
            <SectionHeader
              title={homeFilter === 'podcasts' ? 'Your shows' : 'Your audiobooks'}
              onSeeAll={() => setView({ type: 'library' })}
            />
            <div className="card-grid home-card-row">
              {shows.map((p) => (
                <PlaylistCard key={`${homeFilter}-${p.id}`} playlist={p} tracks={getTracksByIds(p.trackIds)} />
              ))}
            </div>
          </section>
          <section className="content-section home-stagger" style={{ ['--i' as string]: 3 }}>
            <SectionHeader title="Recommended episodes" />
            <div className="home-episode-list">
              {shows.slice(0, 6).map((p, i) => {
                const list = getTracksByIds(p.trackIds)
                const t = list[0]
                if (!t) return null
                return (
                  <button
                    key={`ep-${p.id}`}
                    type="button"
                    className="home-episode-row"
                    onClick={() => playTrack(t, list)}
                  >
                    <img src={p.cover} alt="" />
                    <div>
                      <div className="home-episode-title">{t.title}</div>
                      <div className="home-episode-sub">
                        {p.name} · Ep. {i + 1}
                      </div>
                    </div>
                    <span className="home-episode-play">
                      <PlayIcon size={18} />
                    </span>
                  </button>
                )
              })}
            </div>
          </section>
        </>
      )}
    </div>
  )
}

type SearchTab = 'all' | 'songs' | 'artists' | 'albums' | 'playlists'

function SearchView() {
  const { searchQuery, setSearchQuery, playTrack, allPlaylists } = usePlayer()
  const [tab, setTab] = useState<SearchTab>('all')
  const q = searchQuery.trim()

  useEffect(() => {
    setTab('all')
  }, [q])

  const matchedTracks = useMemo(
    () =>
      q
        ? getVisibleTracks().filter(
            (t) =>
              matchesQuery(t.title, q) ||
              matchesQuery(t.artist, q) ||
              matchesQuery(t.album, q),
          )
        : [],
    [q],
  )
  const matchedPlaylists = useMemo(
    () =>
      q
        ? allPlaylists.filter(
            (p) => matchesQuery(p.name, q) || matchesQuery(p.description, q),
          )
        : [],
    [q, allPlaylists],
  )
  const matchedAlbums = useMemo(
    () =>
      q ? albums.filter((a) => matchesQuery(a.name, q) || matchesQuery(a.artist, q)) : [],
    [q],
  )
  const matchedArtists = useMemo(
    () => (q ? artists.filter((a) => matchesQuery(a.name, q)) : []),
    [q],
  )

  const categories = [
    { name: 'Azərbaycan', color: '#0d73ec', query: 'aygün' },
    { name: 'Türkçe Pop', color: '#e91429', query: 'tarkan' },
    { name: 'Sezen Aksu', color: '#8d67ab', query: 'sezen' },
    { name: 'Röya', color: '#dc148c', query: 'röya' },
    { name: 'Made For You', color: '#1e3264', query: 'daily' },
    { name: 'Türkçe Rock', color: '#ba5d07', query: 'duman' },
    { name: 'Muğam', color: '#006450', query: 'alim' },
    { name: 'Hip-Hop', color: '#e8115b', query: 'ceza' },
    { name: 'Indie', color: '#5038a0', query: 'mabel' },
    { name: 'Chill', color: '#148a08', query: 'chill' },
    { name: 'Radio', color: '#0d73ec', query: 'radio' },
    { name: 'Focus', color: '#5038a0', query: 'focus' },
  ]

  if (!q) {
    return (
      <div className="search-view view-enter">
        <h1 className="page-title">Browse all</h1>
        <div className="browse-grid">
          {categories.map((c) => (
            <button
              key={c.name}
              type="button"
              className="browse-card"
              style={{ backgroundColor: c.color }}
              onClick={() => {
                if (c.query) setSearchQuery(c.query)
              }}
            >
              <span>{c.name}</span>
            </button>
          ))}
        </div>
      </div>
    )
  }

  const none =
    !matchedTracks.length &&
    !matchedPlaylists.length &&
    !matchedAlbums.length &&
    !matchedArtists.length

  const showArtists = tab === 'all' || tab === 'artists'
  const showSongs = tab === 'all' || tab === 'songs'
  const showPlaylists = tab === 'all' || tab === 'playlists'
  const showAlbums = tab === 'all' || tab === 'albums'

  return (
    <div className="search-view view-enter">
      <h1 className="page-title">Search results</h1>
      <div className="library-chips page-chips">
        {(
          [
            ['all', 'All'],
            ['songs', 'Songs'],
            ['artists', 'Artists'],
            ['albums', 'Albums'],
            ['playlists', 'Playlists'],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            className={`chip ${tab === id ? 'active' : ''}`}
            onClick={() => setTab(id)}
          >
            {label}
          </button>
        ))}
      </div>
      <p className="result-meta">
        {matchedTracks.length} songs · {matchedArtists.length} artists · {matchedAlbums.length}{' '}
        albums · {matchedPlaylists.length} playlists
      </p>
      {none && <p className="empty-state">No results found for &ldquo;{searchQuery}&rdquo;</p>}

      {showArtists && matchedArtists.length > 0 && (
        <section className="content-section">
          <SectionHeader title="Artists" />
          <div className="card-grid">
            {matchedArtists.slice(0, tab === 'artists' ? 48 : 12).map((a) => (
              <ArtistCard key={a.id} artist={a} />
            ))}
          </div>
        </section>
      )}

      {showSongs && matchedTracks.length > 0 && (
        <section className="content-section">
          <SectionHeader title="Songs" />
          <div className="track-list compact">
            {matchedTracks.slice(0, tab === 'songs' ? 80 : 40).map((t, i) => (
              <TrackRow
                key={t.id}
                track={t}
                index={i + 1}
                queue={matchedTracks.slice(0, tab === 'songs' ? 80 : 40)}
                showAlbum
              />
            ))}
          </div>
        </section>
      )}

      {showPlaylists && matchedPlaylists.length > 0 && (
        <section className="content-section">
          <SectionHeader title="Playlists" />
          <div className="card-grid">
            {matchedPlaylists.map((p) => (
              <PlaylistCard key={p.id} playlist={p} tracks={getTracksByIds(p.trackIds)} />
            ))}
          </div>
        </section>
      )}

      {showAlbums && matchedAlbums.length > 0 && (
        <section className="content-section">
          <SectionHeader title="Albums" />
          <div className="card-grid">
            {matchedAlbums.map((a) => (
              <AlbumCard key={a.id} album={a} tracks={getTracksByIds(a.trackIds)} />
            ))}
          </div>
        </section>
      )}

      {matchedTracks[0] && (
        <button
          type="button"
          className="ghost-link"
          onClick={() => playTrack(matchedTracks[0], matchedTracks)}
        >
          Play best match
        </button>
      )}
    </div>
  )
}

function LibraryView() {
  const { allPlaylists, libraryFilter, setLibraryFilter, setCreatePlaylistOpen, customPlaylists } =
    usePlayer()

  return (
    <div className="library-view view-enter">
      <div className="page-title-row">
        <h1 className="page-title">Your Library</h1>
        <button type="button" className="secondary-btn" onClick={() => setCreatePlaylistOpen(true)}>
          Create playlist
        </button>
      </div>

      <div className="library-chips page-chips">
        {(['all', 'playlists', 'artists', 'albums'] as const).map((f) => (
          <button
            key={f}
            type="button"
            className={`chip ${libraryFilter === f ? 'active' : ''}`}
            onClick={() => setLibraryFilter(f)}
          >
            {f === 'all' ? 'All' : f[0].toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {(libraryFilter === 'all' || libraryFilter === 'playlists') && (
        <section className="content-section">
          <SectionHeader title="Playlists" />
          {allPlaylists.length === 0 ? (
            <EmptyBlock title="No playlists yet" hint="Create a playlist to get started." />
          ) : (
            <div className="card-grid">
              {allPlaylists.map((p) => (
                <PlaylistCard key={p.id} playlist={p} tracks={getTracksByIds(p.trackIds)} />
              ))}
            </div>
          )}
          {customPlaylists.length === 0 && (
            <p className="result-meta">Create a playlist to start building your library.</p>
          )}
        </section>
      )}

      {(libraryFilter === 'all' || libraryFilter === 'albums') && (
        <section className="content-section">
          <SectionHeader title="Albums" />
          <div className="card-grid">
            {albums.map((a) => (
              <AlbumCard key={a.id} album={a} tracks={getTracksByIds(a.trackIds)} />
            ))}
          </div>
        </section>
      )}

      {(libraryFilter === 'all' || libraryFilter === 'artists') && (
        <section className="content-section">
          <SectionHeader title="Artists" />
          <div className="card-grid">
            {artists.map((a) => (
              <ArtistCard key={a.id} artist={a} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

function CollectionHero({
  cover,
  typeLabel,
  title,
  subtitle,
  color,
  trackList,
  actions,
}: {
  cover: string
  typeLabel: string
  title: string
  subtitle: string
  color: string
  trackList: ReturnType<typeof getTracksByIds>
  actions?: ReactNode
}) {
  const { playTrack, currentTrack, isPlaying, togglePlay } = usePlayer()
  const isThisPlaying =
    isPlaying && currentTrack && trackList.some((t) => t.id === currentTrack.id)

  return (
    <div className="collection-hero" style={{ ['--hero-color' as string]: color }}>
      <div className="hero-bg" />
      <div className="hero-content">
        <img
          src={cover}
          alt=""
          className={`hero-cover ${typeLabel === 'Artist' ? 'round' : ''}`}
          onError={(e) => {
            e.currentTarget.src = '/covers/c1.jpg'
          }}
        />
        <div className="hero-text">
          <div className="hero-type">{typeLabel}</div>
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>
      </div>
      <div className="hero-actions">
        <button
          type="button"
          className={`big-play ${isThisPlaying ? 'playing' : ''}`}
          aria-label={isThisPlaying ? 'Pause' : 'Play'}
          onClick={() => {
            if (isThisPlaying) togglePlay()
            else if (trackList[0]) playTrack(trackList[0], trackList)
          }}
          disabled={!trackList.length}
        >
          {isThisPlaying ? <PauseIcon size={28} /> : <PlayIcon size={28} />}
        </button>
        {actions}
      </div>
    </div>
  )
}

function RadioHero({
  playlist,
  trackList,
  relatedCovers,
}: {
  playlist: (typeof import('../data/music').playlists)[number]
  trackList: ReturnType<typeof getTracksByIds>
  relatedCovers: string[]
}) {
  const { playTrack, currentTrack, isPlaying, togglePlay, displayName } = usePlayer()
  const isThisPlaying =
    isPlaying && currentTrack && trackList.some((t) => t.id === currentTrack.id)
  const total = trackList.reduce((sum, t) => sum + t.duration, 0)
  const covers = [playlist.cover, ...relatedCovers].slice(0, 3)

  return (
    <div className="collection-hero radio-hero" style={{ ['--hero-color' as string]: playlist.color }}>
      <div className="hero-bg" />
      <div className="hero-content radio-hero-content">
        <div className="radio-portrait-stack" aria-hidden>
          {covers.map((src, i) => (
            <img key={src + i} src={src} alt="" className={`radio-portrait p${i}`} />
          ))}
        </div>
        <div className="hero-text">
          <div className="hero-type">Public Playlist</div>
          <h1>{playlist.name}</h1>
          <p className="radio-desc">{playlist.description}</p>
          <p>
            Made for {displayName} · {trackList.length} songs, about {formatTime(total)}
          </p>
        </div>
      </div>
      <div className="hero-actions">
        <button
          type="button"
          className={`big-play ${isThisPlaying ? 'playing' : ''}`}
          aria-label={isThisPlaying ? 'Pause' : 'Play'}
          onClick={() => {
            if (isThisPlaying) togglePlay()
            else if (trackList[0]) playTrack(trackList[0], trackList)
          }}
          disabled={!trackList.length}
        >
          {isThisPlaying ? <PauseIcon size={28} /> : <PlayIcon size={28} />}
        </button>
      </div>
    </div>
  )
}

function PlaylistView({ id }: { id: string }) {
  const {
    allPlaylists,
    renamePlaylist,
    deletePlaylist,
    playTrack,
    reorderPlaylistTracks,
  } = usePlayer()
  const playlist = allPlaylists.find((p) => p.id === id)
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState('')
  const [desc, setDesc] = useState('')

  if (!playlist) return <p className="empty-state">Playlist not found</p>
  const list = getTracksByIds(playlist.trackIds)
  const total = list.reduce((sum, t) => sum + t.duration, 0)
  const canEdit = playlist.id === 'liked' || playlist.id.startsWith('custom-')
  const canRename = playlist.id.startsWith('custom-')
  const isRadio = playlist.id.startsWith('radio-')
  const relatedCovers = artists
    .filter((a) => a.cover !== playlist.cover)
    .slice(0, 2)
    .map((a) => a.cover)

  return (
    <div className="view-enter">
      {isRadio ? (
        <RadioHero playlist={playlist} trackList={list} relatedCovers={relatedCovers} />
      ) : (
      <CollectionHero
        cover={playlist.cover}
        typeLabel="Playlist"
        title={playlist.name}
        subtitle={`${playlist.owner} · ${list.length} songs · ${formatTime(total)}`}
        color={playlist.color}
        trackList={list}
        actions={
          canRename ? (
            <div className="hero-extra-actions">
              <button
                type="button"
                className="secondary-btn"
                onClick={() => {
                  setName(playlist.name)
                  setDesc(playlist.description)
                  setEditing(true)
                }}
              >
                Edit
              </button>
              <button
                type="button"
                className="danger-btn"
                onClick={() => {
                  if (window.confirm(`Delete "${playlist.name}"?`)) deletePlaylist(playlist.id)
                }}
              >
                Delete
              </button>
            </div>
          ) : null
        }
      />
      )}

      {editing && (
        <div className="inline-edit">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
          <input
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="Description"
          />
          <button
            type="button"
            className="primary-btn"
            onClick={() => {
              renamePlaylist(playlist.id, name, desc)
              setEditing(false)
            }}
          >
            Save
          </button>
          <button type="button" className="secondary-btn" onClick={() => setEditing(false)}>
            Cancel
          </button>
        </div>
      )}

      {list.length === 0 ? (
        <EmptyBlock
          title="This playlist is empty"
          hint="Right-click a song and choose Add to playlist."
        />
      ) : (
        <div className="track-list">
          <div className="track-header">
            <div>#</div>
            <div>Title</div>
            <div>Album</div>
            <div />
            <div>
              <ClockIcon />
            </div>
            <div />
          </div>
          {list.map((t, i) => (
            <TrackRow
              key={`${playlist.id}-${t.id}-${i}`}
              track={t}
              index={i + 1}
              queue={list}
              playlistId={canEdit ? playlist.id : undefined}
              onMove={
                canRename
                  ? (from, to) => reorderPlaylistTracks(playlist.id, from, to)
                  : undefined
              }
            />
          ))}
        </div>
      )}

      {list[0] && (
        <button type="button" className="ghost-link" onClick={() => playTrack(list[0], list)}>
          Play all
        </button>
      )}
    </div>
  )
}

function AlbumView({ id }: { id: string }) {
  const { setView } = usePlayer()
  const album = getAlbum(id)
  if (!album) return <p className="empty-state">Album not found</p>
  const list = getTracksByIds(album.trackIds)
  const artist = artists.find((a) => a.name === album.artist)

  return (
    <div className="view-enter">
      <CollectionHero
        cover={album.cover}
        typeLabel="Album"
        title={album.name}
        subtitle={`${album.artist} · ${album.year} · ${list.length} songs`}
        color={album.color}
        trackList={list}
        actions={
          artist ? (
            <button
              type="button"
              className="secondary-btn"
              onClick={() => setView({ type: 'artist', id: artist.id })}
            >
              Go to artist
            </button>
          ) : null
        }
      />
      <div className="track-list">
        <div className="track-header">
          <div>#</div>
          <div>Title</div>
          <div>Album</div>
          <div />
          <div>
            <ClockIcon />
          </div>
          <div />
        </div>
        {list.map((t, i) => (
          <TrackRow key={t.id} track={t} index={i + 1} queue={list} />
        ))}
      </div>
    </div>
  )
}

function ArtistView({ id }: { id: string }) {
  const { followedArtistIds, toggleFollowArtist } = usePlayer()
  const artist = getArtist(id)
  if (!artist) return <p className="empty-state">Artist not found</p>
  const list = getArtistTracks(artist.name)
  const artistAlbums = albums.filter((a) => a.artist === artist.name)
  const following = followedArtistIds.has(artist.id)

  return (
    <div className="view-enter">
      <CollectionHero
        cover={artist.cover}
        typeLabel="Artist"
        title={artist.name}
        subtitle={`${artist.followers} monthly listeners`}
        color={artist.color}
        trackList={list}
        actions={
          <button
            type="button"
            className={`secondary-btn follow-btn ${following ? 'following' : ''}`}
            onClick={() => toggleFollowArtist(artist.id)}
          >
            {following ? 'Following' : 'Follow'}
          </button>
        }
      />
      <section className="content-section">
        <SectionHeader title="Popular" />
        {list.length === 0 ? (
          <EmptyBlock title="No tracks" hint="Nothing here yet — check back soon." />
        ) : (
          <div className="track-list compact">
            {list.map((t, i) => (
              <TrackRow key={t.id} track={t} index={i + 1} queue={list} showAlbum={false} />
            ))}
          </div>
        )}
      </section>
      {artistAlbums.length > 0 && (
        <section className="content-section">
          <SectionHeader title="Albums" />
          <div className="card-grid">
            {artistAlbums.map((a) => (
              <AlbumCard key={a.id} album={a} tracks={getTracksByIds(a.trackIds)} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

function ProfileView() {
  const {
    displayName,
    setDisplayName,
    likedIds,
    customPlaylists,
    setView,
    followedArtistIds,
    pushToast,
  } = usePlayer()
  const [name, setName] = useState(displayName)

  useEffect(() => {
    setName(displayName)
  }, [displayName])

  const followed = artists.filter((a) => followedArtistIds.has(a.id))

  return (
    <div className="profile-view view-enter">
      <div className="profile-hero">
        <div className="profile-avatar-lg">{displayName.charAt(0).toUpperCase()}</div>
        <div>
          <div className="hero-type">Profile</div>
          <h1>{displayName}</h1>
          <p>
            {likedIds.size} liked songs · {customPlaylists.length} playlists · {followed.length}{' '}
            following
          </p>
        </div>
      </div>
      <section className="content-section">
        <SectionHeader title="Account" />
        <label className="field">
          <span>Display name</span>
          <input value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <button
          type="button"
          className="primary-btn"
          onClick={() => {
            setDisplayName(name)
            pushToast('Profile saved')
          }}
        >
          Save profile
        </button>
      </section>
      {followed.length > 0 && (
        <section className="content-section">
          <SectionHeader title="Following" />
          <div className="card-grid">
            {followed.map((a) => (
              <ArtistCard key={a.id} artist={a} />
            ))}
          </div>
        </section>
      )}
      <section className="content-section">
        <SectionHeader title="Shortcuts" />
        <div className="shortcut-row">
          <button
            type="button"
            className="secondary-btn"
            onClick={() => setView({ type: 'playlist', id: 'liked' })}
          >
            Liked Songs
          </button>
          <button type="button" className="secondary-btn" onClick={() => setView({ type: 'library' })}>
            Your Library
          </button>
          <button type="button" className="secondary-btn" onClick={() => setView({ type: 'settings' })}>
            Settings
          </button>
        </div>
      </section>
    </div>
  )
}

function SettingsView() {
  const {
    volume,
    setVolume,
    muted,
    toggleMute,
    shuffle,
    toggleShuffle,
    repeat,
    cycleRepeat,
    displayName,
  } = usePlayer()

  return (
    <div className="settings-view view-enter">
      <h1 className="page-title">Settings</h1>
      <section className="content-section settings-card">
        <h2>Playback</h2>
        <label className="settings-row">
          <span>Volume ({Math.round((muted ? 0 : volume) * 100)}%)</span>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={muted ? 0 : volume}
            onChange={(e) => setVolume(Number(e.target.value))}
          />
        </label>
        <button type="button" className="secondary-btn" onClick={toggleMute}>
          {muted ? 'Unmute' : 'Mute'}
        </button>
        <button type="button" className="secondary-btn" onClick={toggleShuffle}>
          Shuffle: {shuffle ? 'On' : 'Off'}
        </button>
        <button type="button" className="secondary-btn" onClick={cycleRepeat}>
          Repeat: {repeat}
        </button>
        <p className="result-meta">
          Shortcuts: Space play/pause · Ctrl+← / Ctrl+→ previous/next · M mute
        </p>
      </section>
      <section className="content-section settings-card">
        <h2>Account</h2>
        <p className="result-meta">
          Signed in as <strong>{displayName}</strong>
        </p>
        <p className="result-meta">
          Your likes, playlists, follows, and playback settings stay saved on this device.
        </p>
        <button
          type="button"
          className="primary-btn"
          onClick={() => {
            window.location.assign('/admin')
          }}
        >
          Open Admin Panel
        </button>
      </section>
    </div>
  )
}

export function MainView() {
  const { view } = usePlayer()
  const [ready, setReady] = useState(true)

  useEffect(() => {
    setReady(false)
    const id = window.setTimeout(() => setReady(true), 140)
    return () => window.clearTimeout(id)
  }, [view])

  let content
  switch (view.type) {
    case 'home':
      content = <HomeView />
      break
    case 'search':
      content = <SearchView />
      break
    case 'library':
      content = <LibraryView />
      break
    case 'playlist':
      content = <PlaylistView id={view.id} />
      break
    case 'album':
      content = <AlbumView id={view.id} />
      break
    case 'artist':
      content = <ArtistView id={view.id} />
      break
    case 'profile':
      content = <ProfileView />
      break
    case 'settings':
      content = <SettingsView />
      break
    default:
      content = <HomeView />
  }

  return (
    <main className="main-view">
      <div className="main-scroll" key={JSON.stringify(view)}>
        {!ready ? (
          <div className="view-enter">
            <div className="skeleton skeleton-title" />
            <SkeletonGrid count={6} />
            <SkeletonTracks count={5} />
          </div>
        ) : (
          <>
            {content}
            <SiteFooter />
          </>
        )}
      </div>
    </main>
  )
}
