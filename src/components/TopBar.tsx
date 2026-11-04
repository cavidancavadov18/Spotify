import { useEffect, useRef } from 'react'
import { usePlayer } from '../context/PlayerContext'
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CloseIcon,
  HomeIcon,
  HomeOutlineIcon,
  MenuIcon,
  SearchIcon,
  SpotifyLogo,
} from './Icons'
import { TipButton } from './Tooltip'

/** Spotify Web Player — Install App (circle + download arrow) */
function InstallAppIcon({ size = 16 }: { size?: number }) {
  return (
    <svg viewBox="0 0 16 16" width={size} height={size} fill="currentColor" aria-hidden>
      <path d="M8 1.44A6.56 6.56 0 1 0 14.56 8 6.56 6.56 0 0 0 8 1.44zm0 12.37A5.81 5.81 0 1 1 13.81 8 5.81 5.81 0 0 1 8 13.81z" />
      <path d="M8 4.1a.38.38 0 0 1 .38.38v4.34l1.41-1.41a.38.38 0 1 1 .53.54L8.27 9.99a.38.38 0 0 1-.54 0L5.68 7.95a.38.38 0 0 1 .54-.54l1.4 1.41V4.48A.38.38 0 0 1 8 4.1z" />
      <path d="M5.25 11.12h5.5a.38.38 0 0 1 0 .75h-5.5a.38.38 0 0 1 0-.75z" />
    </svg>
  )
}

/** Spotify Web Player — What's New (outline bell) */
function BellIcon({ size = 16 }: { size?: number }) {
  return (
    <svg viewBox="0 0 16 16" width={size} height={size} fill="currentColor" aria-hidden>
      <path d="M8 1.154a4.34 4.34 0 0 0-4.347 4.347v1.493c0 .544-.193 1.07-.542 1.482L2.04 9.858a.75.75 0 0 0 .58 1.219h10.76a.75.75 0 0 0 .58-1.219l-1.071-1.382a2.43 2.43 0 0 1-.542-1.482V5.501A4.34 4.34 0 0 0 8 1.154zm-2.847 4.347A2.847 2.847 0 0 1 8 2.654a2.847 2.847 0 0 1 2.847 2.847v1.493c0 .84.298 1.653.84 2.292l.457.59H3.856l.457-.59a3.93 3.93 0 0 0 .84-2.292V5.501z" />
      <path d="M6.348 12.577a1.652 1.652 0 0 0 3.304 0h-3.304z" />
    </svg>
  )
}

/** Spotify Web Player — Friend Activity (3 people) */
function FriendsIcon({ size = 16 }: { size?: number }) {
  return (
    <svg viewBox="0 0 16 16" width={size} height={size} fill="currentColor" aria-hidden>
      <path d="M5.5 3.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm7 0a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zM8 6.5a1.75 1.75 0 1 0 0-3.5 1.75 1.75 0 0 0 0 3.5zM1.75 12.028A3.25 3.25 0 0 1 5 8.778h.042a4.18 4.18 0 0 0-.292 1.5v.25H5a1.75 1.75 0 0 0-1.75 1.75v.5H1.75v-.5a1.75 1.75 0 0 1 0-.25zm12.5 0v.5H12.75v-.5A1.75 1.75 0 0 0 11 10.528h.25v-.25c0-.52-.1-1.02-.292-1.5H11a3.25 3.25 0 0 1 3.25 3.25zM5.75 13.028v-.5A2.25 2.25 0 0 1 8 10.278a2.25 2.25 0 0 1 2.25 2.25v.5h-4.5z" />
    </svg>
  )
}

function BrowseIcon({ size = 24 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden>
      <path d="M15 15.5c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z" />
      <path d="M6 4.5A2.5 2.5 0 0 1 8.5 2h7A2.5 2.5 0 0 1 18 4.5v15a.75.75 0 0 1-1.2.6L12 16.25 7.2 20.1A.75.75 0 0 1 6 19.5v-15zM8.5 3.5a1 1 0 0 0-1 1V17.8l4.05-3.24a.75.75 0 0 1 .9 0L16.5 17.8V4.5a1 1 0 0 0-1-1h-7z" />
      <path d="M4.5 7.75A.75.75 0 0 1 5.25 7H6.5v1.5H5.25a.75.75 0 0 1-.75-.75zM4.5 11.75a.75.75 0 0 1 .75-.75H6.5v1.5H5.25a.75.75 0 0 1-.75-.75zM4.5 15.75a.75.75 0 0 1 .75-.75H6.5v1.5H5.25a.75.75 0 0 1-.75-.75z" />
    </svg>
  )
}

export function TopBar() {
  const {
    view,
    setView,
    searchQuery,
    setSearchQuery,
    setSidebarOpen,
    profileMenuOpen,
    setProfileMenuOpen,
    notificationsOpen,
    setNotificationsOpen,
    friendsOpen,
    setFriendsOpen,
    setPremiumOpen,
    displayName,
    pushToast,
    goBack,
    goForward,
    canGoBack,
    canGoForward,
    spotifyConnected,
    spotifyReady,
    setSpotifyConnectOpen,
  } = usePlayer()

  const profileRef = useRef<HTMLDivElement>(null)
  const isHome = view.type === 'home'
  const isSearch = view.type === 'search'

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!profileRef.current?.contains(e.target as Node)) {
        setProfileMenuOpen(false)
        setNotificationsOpen(false)
      }
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [setProfileMenuOpen, setNotificationsOpen])

  return (
    <header className="global-topbar">
      <div className="gt-left">
        <TipButton
          label="Menu"
          className="icon-btn mobile-only"
          position="bottom"
          onClick={() => setSidebarOpen(true)}
        >
          <MenuIcon size={20} />
        </TipButton>
        <TipButton
          label="Spotify"
          className="gt-logo tip-as-link"
          onClick={() => setView({ type: 'home' })}
        >
          <SpotifyLogo size={28} />
        </TipButton>
        <div className="nav-arrows desktop-only">
          <TipButton
            label="Go back"
            className="nav-arrow"
            disabled={!canGoBack}
            onClick={goBack}
          >
            <ChevronLeftIcon size={18} />
          </TipButton>
          <TipButton
            label="Go forward"
            className="nav-arrow"
            disabled={!canGoForward}
            onClick={goForward}
          >
            <ChevronRightIcon size={18} />
          </TipButton>
        </div>
      </div>

      <div className="gt-center">
        <TipButton
          label="Home"
          className={`gt-home ${isHome ? 'active' : ''}`}
          onClick={() => setView({ type: 'home' })}
        >
          {isHome ? <HomeIcon size={24} /> : <HomeOutlineIcon size={24} />}
        </TipButton>
        <div className={`gt-search ${isSearch ? 'focused' : ''}`}>
          <SearchIcon size={20} />
          <input
            type="search"
            placeholder="What do you want to play?"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              if (view.type !== 'search') setView({ type: 'search' })
            }}
            onFocus={() => {
              if (view.type !== 'search') setView({ type: 'search' })
            }}
            aria-label="Search"
          />
          {searchQuery && (
            <TipButton
              label="Clear search"
              className="search-clear"
              position="bottom"
              onClick={() => setSearchQuery('')}
            >
              <CloseIcon size={14} />
            </TipButton>
          )}
          <span className="gt-search-divider" aria-hidden />
          <TipButton
            label="Browse"
            className={`gt-browse ${isSearch && !searchQuery ? 'active' : ''}`}
            position="bottom"
            onClick={() => {
              setSearchQuery('')
              setView({ type: 'search' })
            }}
          >
            <BrowseIcon size={24} />
          </TipButton>
        </div>
      </div>

      <div className="gt-right" ref={profileRef}>
        {(spotifyConnected || spotifyReady) && (
          <TipButton
            label={spotifyReady ? 'Spotify Live' : 'Spotify connected'}
            className={`pill-btn desktop-only ${spotifyReady ? 'spotify-live' : ''}`}
            position="bottom"
            onClick={() => setSpotifyConnectOpen(true)}
          >
            {spotifyReady ? 'Spotify Live' : 'Connected'}
          </TipButton>
        )}
        <TipButton
          label="Explore Premium"
          className="pill-btn solid explore-premium-btn desktop-only"
          position="bottom"
          onClick={() => setPremiumOpen(true)}
        >
          Explore Premium
        </TipButton>
        <TipButton
          label="Install App"
          className="gt-install-btn desktop-only"
          position="bottom"
          onClick={() => {
            const deferred = window.__pwaInstall
            if (deferred) {
              void deferred.prompt().then(() => pushToast('Install prompt opened'))
              return
            }
            window.open(
              'https://www.spotify.com/download/windows/',
              '_blank',
              'noopener,noreferrer',
            )
            pushToast('Opening Spotify download…')
          }}
        >
          <InstallAppIcon size={16} />
          <span>Install App</span>
        </TipButton>
        <TipButton
          label="What's New"
          className={`gt-icon-btn ${notificationsOpen ? 'active' : ''}`}
          aria-pressed={notificationsOpen}
          onClick={() => {
            setNotificationsOpen(!notificationsOpen)
            setFriendsOpen(false)
            setProfileMenuOpen(false)
          }}
        >
          <BellIcon size={16} />
        </TipButton>
        <TipButton
          label="Friend Activity"
          className={`gt-icon-btn desktop-only ${friendsOpen ? 'active' : ''}`}
          aria-pressed={friendsOpen}
          onClick={() => {
            setFriendsOpen(!friendsOpen)
            setNotificationsOpen(false)
            setProfileMenuOpen(false)
          }}
        >
          <FriendsIcon size={16} />
        </TipButton>
        <TipButton
          label={displayName}
          className={`profile-btn ${profileMenuOpen ? 'open' : ''}`}
          onClick={() => {
            setProfileMenuOpen(!profileMenuOpen)
            setNotificationsOpen(false)
          }}
        >
          <span className="profile-ring" aria-hidden>
            <svg className="profile-ring-svg" viewBox="0 0 40 40">
              <circle className="profile-ring-track" cx="20" cy="20" r="17" />
              <circle className="profile-ring-progress" cx="20" cy="20" r="17" />
            </svg>
            <span className="avatar">{displayName.charAt(0).toUpperCase() || 'J'}</span>
          </span>
        </TipButton>
      </div>
    </header>
  )
}
