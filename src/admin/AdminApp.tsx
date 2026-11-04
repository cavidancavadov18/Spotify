import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { albums, artists, formatTime, playlists, tracks } from '../data/music'
import { loadJSON } from '../lib/storage'
import { getAdminSession, loginAdmin, logoutAdmin, type AdminSession } from './adminAuth'
import {
  clearPlayerUserData,
  deleteAdminTrack,
  deleteAdminUser,
  deleteAnnouncement,
  getAdminSettings,
  getAdminStats,
  getAdminTracks,
  getAdminUsers,
  getAnnouncements,
  getFeaturedTrackIds,
  getHiddenTrackIds,
  saveAdminSettings,
  toggleFeaturedTrack,
  toggleHiddenTrack,
  upsertAdminTrack,
  upsertAdminUser,
  upsertAnnouncement,
  type AdminAnnouncement,
  type AdminSettings,
  type AdminUser,
} from './adminStore'
import './Admin.css'

type Section =
  | 'dashboard'
  | 'tracks'
  | 'artists'
  | 'playlists'
  | 'users'
  | 'content'
  | 'settings'

function SpotifyMark() {
  return (
    <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor" aria-hidden>
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
    </svg>
  )
}

function useToast() {
  const [message, setMessage] = useState<string | null>(null)
  useEffect(() => {
    if (!message) return
    const t = window.setTimeout(() => setMessage(null), 2400)
    return () => window.clearTimeout(t)
  }, [message])
  return { message, toast: setMessage }
}

function LoginScreen({ onSuccess }: { onSuccess: (s: AdminSession) => void }) {
  const [username, setUsername] = useState('admin')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const session = loginAdmin(username, password)
    if (!session) {
      setError('Yanlış istifadəçi adı və ya şifrə')
      return
    }
    onSuccess(session)
  }

  return (
    <div className="admin-login">
      <form className="admin-login-card" onSubmit={submit}>
        <div className="admin-login-brand">
          <SpotifyMark />
          <div>
            <h1>Admin Panel</h1>
          </div>
        </div>
        <p className="admin-lead">Superuser girişi — idarə paneli</p>
        {error && <div className="admin-error">{error}</div>}
        <div className="admin-field">
          <label htmlFor="admin-user">Username</label>
          <input
            id="admin-user"
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="admin-field">
          <label htmlFor="admin-pass">Password</label>
          <input
            id="admin-pass"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" className="admin-btn admin-btn-primary">
          Sign in
        </button>
        <p className="admin-hint">
          Superuser: <code>admin</code> / <code>admin</code>
        </p>
      </form>
    </div>
  )
}

export function AdminApp() {
  const [session, setSession] = useState<AdminSession | null>(() => getAdminSession())
  const [section, setSection] = useState<Section>('dashboard')
  const { message, toast } = useToast()
  const [tick, setTick] = useState(0)
  const refresh = () => setTick((n) => n + 1)

  if (!session) {
    return (
      <div className="admin-root">
        <LoginScreen onSuccess={setSession} />
      </div>
    )
  }

  const nav: { id: Section; label: string }[] = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'tracks', label: 'Tracks' },
    { id: 'artists', label: 'Artists' },
    { id: 'playlists', label: 'Playlists' },
    { id: 'users', label: 'Users' },
    { id: 'content', label: 'Content' },
    { id: 'settings', label: 'Settings' },
  ]

  return (
    <div className="admin-root">
      <div className="admin-shell">
        <aside className="admin-nav">
          <div className="admin-nav-brand">
            <SpotifyMark />
            <div>
              Admin
              <small>@{session.username} · superuser</small>
            </div>
          </div>
          {nav.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`admin-nav-item ${section === item.id ? 'active' : ''}`}
              onClick={() => setSection(item.id)}
            >
              {item.label}
            </button>
          ))}
          <div className="admin-nav-footer">
            <button
              type="button"
              className="admin-btn admin-btn-ghost admin-btn-sm"
              onClick={() => {
                window.location.assign('/#home')
              }}
            >
              ← Player
            </button>
            <button
              type="button"
              className="admin-btn admin-btn-danger admin-btn-sm"
              onClick={() => {
                logoutAdmin()
                setSession(null)
              }}
            >
              Log out
            </button>
          </div>
        </aside>

        <main className="admin-main" key={tick}>
          {section === 'dashboard' && <DashboardSection toast={toast} />}
          {section === 'tracks' && <TracksSection toast={toast} onChange={refresh} />}
          {section === 'artists' && <ArtistsSection />}
          {section === 'playlists' && <PlaylistsSection />}
          {section === 'users' && <UsersSection toast={toast} onChange={refresh} />}
          {section === 'content' && <ContentSection toast={toast} onChange={refresh} />}
          {section === 'settings' && <SettingsSection toast={toast} onChange={refresh} />}
        </main>
      </div>
      {message && <div className="admin-toast">{message}</div>}
    </div>
  )
}

function DashboardSection({ toast }: { toast: (m: string) => void }) {
  const customPlaylists = loadJSON('customPlaylists', [] as { id: string }[])
  const stats = getAdminStats({
    tracks: tracks.length + getAdminTracks().length,
    artists: artists.length,
    albums: albums.length,
    playlists: playlists.length + customPlaylists.length,
  })

  return (
    <>
      <div className="admin-top">
        <div>
          <h1>Dashboard</h1>
          <p>Kataloq, istifadəçilər və sistem vəziyyəti</p>
        </div>
        <span className="admin-badge">Live · local store</span>
      </div>
      <div className="admin-stats">
        {[
          ['Tracks', stats.tracks],
          ['Custom', stats.customTracks],
          ['Hidden', stats.hiddenTracks],
          ['Artists', stats.artists],
          ['Albums', stats.albums],
          ['Playlists', stats.playlists],
          ['Users', stats.users],
          ['Featured', stats.featured],
        ].map(([label, value]) => (
          <div key={String(label)} className="admin-stat">
            <div className="label">{label}</div>
            <div className="value">{value}</div>
          </div>
        ))}
      </div>
      <div className="admin-card">
        <h2>System</h2>
        <div className="admin-switch">
          <div>
            <strong>Maintenance mode</strong>
            <span>{stats.settings.maintenanceMode ? 'Player shows maintenance banner' : 'Player is open'}</span>
          </div>
          <span className={`admin-pill ${stats.settings.maintenanceMode ? 'admin-pill-warn' : 'admin-pill-ok'}`}>
            {stats.settings.maintenanceMode ? 'ON' : 'OFF'}
          </span>
        </div>
        <div className="admin-switch">
          <div>
            <strong>Active announcements</strong>
            <span>{stats.announcements} published</span>
          </div>
          <span className="admin-pill admin-pill-ok">{stats.announcements}</span>
        </div>
        <div className="admin-form-actions">
          <button
            type="button"
            className="admin-btn admin-btn-ghost admin-btn-sm"
            onClick={() => {
              window.location.assign('/#home')
              toast('Opened player')
            }}
          >
            Open player
          </button>
        </div>
      </div>
    </>
  )
}

function TracksSection({
  toast,
  onChange,
}: {
  toast: (m: string) => void
  onChange: () => void
}) {
  const [q, setQ] = useState('')
  const [hidden, setHidden] = useState(() => new Set(getHiddenTrackIds()))
  const [featured, setFeatured] = useState(() => new Set(getFeaturedTrackIds()))
  const [adminTracks, setAdminTracks] = useState(() => getAdminTracks())
  const [form, setForm] = useState({
    title: '',
    artist: '',
    album: 'Admin Uploads',
    duration: 180,
    cover: '/covers/c1.jpg',
    audio: '/audio/pb1.mp3',
  })

  const catalog = useMemo(() => {
    const merged = [
      ...adminTracks.map((t) => ({ ...t, kind: 'admin' as const })),
      ...tracks.map((t) => ({ ...t, kind: 'catalog' as const })),
    ]
    const query = q.trim().toLowerCase()
    if (!query) return merged.slice(0, 80)
    return merged
      .filter(
        (t) =>
          t.title.toLowerCase().includes(query) ||
          t.artist.toLowerCase().includes(query) ||
          t.album.toLowerCase().includes(query) ||
          t.id.toLowerCase().includes(query),
      )
      .slice(0, 100)
  }, [adminTracks, q])

  const saveTrack = (e: FormEvent) => {
    e.preventDefault()
    if (!form.title.trim() || !form.artist.trim()) {
      toast('Title və artist vacibdir')
      return
    }
    upsertAdminTrack({
      title: form.title.trim(),
      artist: form.artist.trim(),
      album: form.album.trim() || 'Admin Uploads',
      duration: Number(form.duration) || 180,
      cover: form.cover.trim() || '/covers/c1.jpg',
      audio: form.audio.trim() || '/audio/pb1.mp3',
    })
    setAdminTracks(getAdminTracks())
    setForm((f) => ({ ...f, title: '', artist: '' }))
    toast('Track əlavə olundu')
    onChange()
  }

  return (
    <>
      <div className="admin-top">
        <div>
          <h1>Tracks</h1>
          <p>Kataloq + admin əlavələri · gizlət / featured</p>
        </div>
      </div>

      <div className="admin-card">
        <h2>Yeni track</h2>
        <form className="admin-form-grid" onSubmit={saveTrack}>
          <div className="admin-field">
            <label>Title</label>
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
          </div>
          <div className="admin-field">
            <label>Artist</label>
            <input
              value={form.artist}
              onChange={(e) => setForm({ ...form, artist: e.target.value })}
              required
            />
          </div>
          <div className="admin-field">
            <label>Album</label>
            <input
              value={form.album}
              onChange={(e) => setForm({ ...form, album: e.target.value })}
            />
          </div>
          <div className="admin-field">
            <label>Duration (sec)</label>
            <input
              type="number"
              min={1}
              value={form.duration}
              onChange={(e) => setForm({ ...form, duration: Number(e.target.value) })}
            />
          </div>
          <div className="admin-field">
            <label>Cover URL</label>
            <input
              value={form.cover}
              onChange={(e) => setForm({ ...form, cover: e.target.value })}
            />
          </div>
          <div className="admin-field">
            <label>Audio URL</label>
            <input
              value={form.audio}
              onChange={(e) => setForm({ ...form, audio: e.target.value })}
            />
          </div>
          <div className="span-2 admin-form-actions">
            <button type="submit" className="admin-btn admin-btn-primary" style={{ width: 'auto' }}>
              Add track
            </button>
          </div>
        </form>
      </div>

      <div className="admin-card">
        <div className="admin-toolbar">
          <input
            className="admin-search"
            placeholder="Search tracks…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <span className="admin-pill admin-pill-off">{catalog.length} shown</span>
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th></th>
                <th>Title</th>
                <th>Artist</th>
                <th>Duration</th>
                <th>Source</th>
                <th>Flags</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {catalog.map((t) => (
                <tr key={t.id}>
                  <td>
                    <img className="cover" src={t.cover} alt="" />
                  </td>
                  <td>{t.title}</td>
                  <td>{t.artist}</td>
                  <td>{formatTime(t.duration)}</td>
                  <td>
                    <span className={`admin-pill ${t.kind === 'admin' ? 'admin-pill-ok' : 'admin-pill-off'}`}>
                      {t.kind}
                    </span>
                  </td>
                  <td>
                    {hidden.has(t.id) && <span className="admin-pill admin-pill-danger">hidden</span>}{' '}
                    {featured.has(t.id) && <span className="admin-pill admin-pill-ok">featured</span>}
                  </td>
                  <td>
                    <div className="actions">
                      <button
                        type="button"
                        className="admin-btn admin-btn-ghost admin-btn-sm"
                        onClick={() => {
                          const next = toggleHiddenTrack(t.id)
                          setHidden(new Set(next))
                          toast(hidden.has(t.id) ? 'Unhidden' : 'Hidden')
                          onChange()
                        }}
                      >
                        {hidden.has(t.id) ? 'Unhide' : 'Hide'}
                      </button>
                      <button
                        type="button"
                        className="admin-btn admin-btn-ghost admin-btn-sm"
                        onClick={() => {
                          const next = toggleFeaturedTrack(t.id)
                          setFeatured(new Set(next))
                          toast('Featured updated')
                          onChange()
                        }}
                      >
                        Feature
                      </button>
                      {t.kind === 'admin' && (
                        <button
                          type="button"
                          className="admin-btn admin-btn-danger admin-btn-sm"
                          onClick={() => {
                            deleteAdminTrack(t.id)
                            setAdminTracks(getAdminTracks())
                            toast('Deleted')
                            onChange()
                          }}
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

function ArtistsSection() {
  const [q, setQ] = useState('')
  const list = useMemo(() => {
    const query = q.trim().toLowerCase()
    const all = artists
    if (!query) return all
    return all.filter((a) => a.name.toLowerCase().includes(query) || a.id.includes(query))
  }, [q])

  return (
    <>
      <div className="admin-top">
        <div>
          <h1>Artists</h1>
          <p>{artists.length} artist kataloqda</p>
        </div>
      </div>
      <div className="admin-card">
        <div className="admin-toolbar">
          <input
            className="admin-search"
            placeholder="Search artists…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th></th>
                <th>Name</th>
                <th>Followers</th>
                <th>ID</th>
              </tr>
            </thead>
            <tbody>
              {list.map((a) => (
                <tr key={a.id}>
                  <td>
                    <img className="cover" src={a.cover} alt="" style={{ borderRadius: '50%' }} />
                  </td>
                  <td>{a.name}</td>
                  <td>{a.followers}</td>
                  <td>{a.id}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

function PlaylistsSection() {
  const custom = loadJSON(
    'customPlaylists',
    [] as { id: string; name: string; owner: string; trackIds: string[]; cover: string }[],
  )
  const rows = [
    ...playlists.map((p) => ({ ...p, source: 'seed' as const })),
    ...custom.map((p) => ({
      id: p.id,
      name: p.name,
      owner: p.owner,
      trackIds: p.trackIds,
      cover: p.cover,
      source: 'user' as const,
    })),
  ]

  return (
    <>
      <div className="admin-top">
        <div>
          <h1>Playlists</h1>
          <p>Seed + istifadəçi playlistləri</p>
        </div>
      </div>
      <div className="admin-card">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th></th>
                <th>Name</th>
                <th>Owner</th>
                <th>Tracks</th>
                <th>Source</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => (
                <tr key={p.id}>
                  <td>
                    <img className="cover" src={p.cover} alt="" />
                  </td>
                  <td>{p.name}</td>
                  <td>{p.owner}</td>
                  <td>{p.trackIds.length}</td>
                  <td>
                    <span className={`admin-pill ${p.source === 'user' ? 'admin-pill-ok' : 'admin-pill-off'}`}>
                      {p.source}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

function UsersSection({
  toast,
  onChange,
}: {
  toast: (m: string) => void
  onChange: () => void
}) {
  const [users, setUsers] = useState(() => getAdminUsers())
  const [form, setForm] = useState({
    username: '',
    displayName: '',
    email: '',
    role: 'user' as AdminUser['role'],
  })

  const add = (e: FormEvent) => {
    e.preventDefault()
    try {
      upsertAdminUser({
        username: form.username,
        displayName: form.displayName || form.username,
        email: form.email,
        role: form.role,
      })
      setUsers(getAdminUsers())
      setForm({ username: '', displayName: '', email: '', role: 'user' })
      toast('User əlavə olundu')
      onChange()
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Error')
    }
  }

  return (
    <>
      <div className="admin-top">
        <div>
          <h1>Users</h1>
          <p>Superuser: admin · digər rollar idarə olunur</p>
        </div>
      </div>
      <div className="admin-card">
        <h2>Yeni user</h2>
        <form className="admin-form-grid" onSubmit={add}>
          <div className="admin-field">
            <label>Username</label>
            <input
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              required
            />
          </div>
          <div className="admin-field">
            <label>Display name</label>
            <input
              value={form.displayName}
              onChange={(e) => setForm({ ...form, displayName: e.target.value })}
            />
          </div>
          <div className="admin-field">
            <label>Email</label>
            <input
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div className="admin-field">
            <label>Role</label>
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value as AdminUser['role'] })}
            >
              <option value="user">user</option>
              <option value="admin">admin</option>
            </select>
          </div>
          <div className="span-2 admin-form-actions">
            <button type="submit" className="admin-btn admin-btn-primary" style={{ width: 'auto' }}>
              Add user
            </button>
          </div>
        </form>
      </div>
      <div className="admin-card">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>
                    <strong>{u.displayName}</strong>
                    <div style={{ color: 'var(--admin-muted)', fontSize: 12 }}>@{u.username}</div>
                  </td>
                  <td>{u.email}</td>
                  <td>
                    <span
                      className={`admin-pill ${u.role === 'superadmin' ? 'admin-pill-ok' : 'admin-pill-off'}`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td>
                    <span className={`admin-pill ${u.active ? 'admin-pill-ok' : 'admin-pill-danger'}`}>
                      {u.active ? 'active' : 'disabled'}
                    </span>
                  </td>
                  <td>
                    <div className="actions">
                      {u.role !== 'superadmin' && (
                        <>
                          <button
                            type="button"
                            className="admin-btn admin-btn-ghost admin-btn-sm"
                            onClick={() => {
                              upsertAdminUser({
                                id: u.id,
                                username: u.username,
                                displayName: u.displayName,
                                active: !u.active,
                              })
                              setUsers(getAdminUsers())
                              toast(u.active ? 'Disabled' : 'Enabled')
                              onChange()
                            }}
                          >
                            {u.active ? 'Disable' : 'Enable'}
                          </button>
                          <button
                            type="button"
                            className="admin-btn admin-btn-danger admin-btn-sm"
                            onClick={() => {
                              try {
                                deleteAdminUser(u.id)
                                setUsers(getAdminUsers())
                                toast('Deleted')
                                onChange()
                              } catch (err) {
                                toast(err instanceof Error ? err.message : 'Error')
                              }
                            }}
                          >
                            Delete
                          </button>
                        </>
                      )}
                      {u.role === 'superadmin' && (
                        <span className="admin-pill admin-pill-warn">protected</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

function ContentSection({
  toast,
  onChange,
}: {
  toast: (m: string) => void
  onChange: () => void
}) {
  const [items, setItems] = useState(() => getAnnouncements())
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')

  const add = (e: FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !body.trim()) return
    upsertAnnouncement({ title: title.trim(), body: body.trim(), active: true })
    setItems(getAnnouncements())
    setTitle('')
    setBody('')
    toast('Announcement published')
    onChange()
  }

  return (
    <>
      <div className="admin-top">
        <div>
          <h1>Content</h1>
          <p>What’s New elanları</p>
        </div>
      </div>
      <div className="admin-card">
        <h2>Yeni elan</h2>
        <form onSubmit={add}>
          <div className="admin-field">
            <label>Title</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div className="admin-field">
            <label>Body</label>
            <textarea value={body} onChange={(e) => setBody(e.target.value)} required />
          </div>
          <button type="submit" className="admin-btn admin-btn-primary" style={{ width: 'auto' }}>
            Publish
          </button>
        </form>
      </div>
      <div className="admin-card">
        {items.length === 0 && <div className="admin-empty">Hələ elan yoxdur</div>}
        {items.map((a: AdminAnnouncement) => (
          <div className="admin-switch" key={a.id}>
            <div>
              <strong>{a.title}</strong>
              <span>{a.body}</span>
            </div>
            <div className="actions">
              <button
                type="button"
                className="admin-btn admin-btn-ghost admin-btn-sm"
                onClick={() => {
                  upsertAnnouncement({
                    id: a.id,
                    title: a.title,
                    body: a.body,
                    active: !a.active,
                  })
                  setItems(getAnnouncements())
                  onChange()
                }}
              >
                {a.active ? 'Unpublish' : 'Publish'}
              </button>
              <button
                type="button"
                className="admin-btn admin-btn-danger admin-btn-sm"
                onClick={() => {
                  deleteAnnouncement(a.id)
                  setItems(getAnnouncements())
                  toast('Silindi')
                  onChange()
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

function SettingsSection({
  toast,
  onChange,
}: {
  toast: (m: string) => void
  onChange: () => void
}) {
  const [settings, setSettings] = useState<AdminSettings>(() => getAdminSettings())

  const save = () => {
    saveAdminSettings(settings)
    toast('Settings saved')
    onChange()
  }

  return (
    <>
      <div className="admin-top">
        <div>
          <h1>Settings</h1>
          <p>Sistem və player konfiqurasiyası</p>
        </div>
      </div>
      <div className="admin-card">
        <div className="admin-switch">
          <div>
            <strong>Maintenance mode</strong>
            <span>Player-də banner göstər</span>
          </div>
          <button
            type="button"
            className={`admin-toggle ${settings.maintenanceMode ? 'on' : ''}`}
            aria-pressed={settings.maintenanceMode}
            onClick={() => setSettings({ ...settings, maintenanceMode: !settings.maintenanceMode })}
          />
        </div>
        <div className="admin-field" style={{ marginTop: 12 }}>
          <label>Maintenance message</label>
          <textarea
            value={settings.maintenanceMessage}
            onChange={(e) => setSettings({ ...settings, maintenanceMessage: e.target.value })}
          />
        </div>
        <div className="admin-field">
          <label>Site banner</label>
          <input
            value={settings.siteBanner}
            onChange={(e) => setSettings({ ...settings, siteBanner: e.target.value })}
            placeholder="Optional top banner text"
          />
        </div>
        <div className="admin-switch">
          <div>
            <strong>Allow downloads UI</strong>
            <span>Premium / offline hints</span>
          </div>
          <button
            type="button"
            className={`admin-toggle ${settings.allowDownloads ? 'on' : ''}`}
            aria-pressed={settings.allowDownloads}
            onClick={() => setSettings({ ...settings, allowDownloads: !settings.allowDownloads })}
          />
        </div>
        <div className="admin-field">
          <label>Default volume (0–1)</label>
          <input
            type="number"
            min={0}
            max={1}
            step={0.05}
            value={settings.defaultVolume}
            onChange={(e) => setSettings({ ...settings, defaultVolume: Number(e.target.value) })}
          />
        </div>
        <div className="admin-form-actions">
          <button type="button" className="admin-btn admin-btn-primary" style={{ width: 'auto' }} onClick={save}>
            Save settings
          </button>
          <button
            type="button"
            className="admin-btn admin-btn-danger admin-btn-sm"
            onClick={() => {
              if (!confirm('Player user data silinsin? (likes, playlists, queue)')) return
              clearPlayerUserData()
              toast('Player data cleared')
              onChange()
            }}
          >
            Clear player user data
          </button>
        </div>
      </div>
      <div className="admin-card">
        <h2>Credentials</h2>
        <p style={{ margin: 0, color: 'var(--admin-muted)', fontSize: 14 }}>
          Superuser login: <code>admin</code> / <code>admin</code> · session bu brauzerdə saxlanılır.
        </p>
      </div>
    </>
  )
}
