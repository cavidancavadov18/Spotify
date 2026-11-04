import { useEffect, useState } from 'react'
import { PlayerProvider } from './context/PlayerContext'
import { Sidebar } from './components/Sidebar'
import { TopBar } from './components/TopBar'
import { MainView } from './components/MainView'
import { PlayerBar } from './components/PlayerBar'
import { NowPlayingPanel } from './components/NowPlayingPanel'
import { FriendActivity } from './components/FriendActivity'
import { Overlays } from './components/Overlays'
import { AmbientAura } from './components/AmbientAura'
import { LikeBurstLayer } from './components/MotionFX'
import { AdminApp } from './admin/AdminApp'
import { getAdminSettings, getAnnouncements, getFeaturedTrackIds } from './admin/adminStore'
import { getTrack } from './data/music'
import './App.css'

function isAdminPath(pathname = window.location.pathname) {
  const p = pathname.replace(/\/+$/, '') || '/'
  return p === '/admin'
}

/** Old #admin bookmarks → clean /admin */
function migrateAdminHash() {
  const h = window.location.hash.replace(/^#\/?/, '').toLowerCase()
  if (h === 'admin' || h.startsWith('admin/')) {
    window.history.replaceState(null, '', '/admin')
  }
}

function SiteBanners() {
  const settings = getAdminSettings()
  const featured = getFeaturedTrackIds()
    .map((id) => getTrack(id))
    .filter(Boolean)
    .slice(0, 3)
  const news = getAnnouncements().filter((a) => a.active).slice(0, 1)

  if (!settings.maintenanceMode && !settings.siteBanner && !news.length && !featured.length) {
    return null
  }

  return (
    <div className="site-banners" aria-live="polite">
      {settings.maintenanceMode && (
        <div className="site-banner site-banner-warn">{settings.maintenanceMessage}</div>
      )}
      {settings.siteBanner && <div className="site-banner">{settings.siteBanner}</div>}
      {news[0] && (
        <div className="site-banner site-banner-news">
          <strong>{news[0].title}</strong> — {news[0].body}
        </div>
      )}
      {featured.length > 0 && (
        <div className="site-banner site-banner-news">
          <strong>Featured:</strong>{' '}
          {featured.map((t) => `${t!.title} · ${t!.artist}`).join(' · ')}
        </div>
      )}
    </div>
  )
}

function PlayerApp() {
  return (
    <PlayerProvider>
      <div className="app-shell">
        <AmbientAura />
        <TopBar />
        <div className="app-body">
          <Sidebar />
          <div className="main-column">
            <SiteBanners />
            <MainView />
          </div>
          <NowPlayingPanel />
          <FriendActivity />
        </div>
        <PlayerBar />
        <Overlays />
        <LikeBurstLayer />
      </div>
    </PlayerProvider>
  )
}

function App() {
  const [admin, setAdmin] = useState(() => {
    migrateAdminHash()
    return isAdminPath()
  })

  useEffect(() => {
    const sync = () => {
      migrateAdminHash()
      setAdmin(isAdminPath())
    }
    window.addEventListener('popstate', sync)
    window.addEventListener('hashchange', sync)
    return () => {
      window.removeEventListener('popstate', sync)
      window.removeEventListener('hashchange', sync)
    }
  }, [])

  if (admin) return <AdminApp />
  return <PlayerApp />
}

export default App
