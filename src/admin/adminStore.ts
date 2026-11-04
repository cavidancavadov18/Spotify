import type { Track } from '../data/music'
import { loadJSON, saveJSON } from '../lib/storage'

export type AdminUser = {
  id: string
  username: string
  displayName: string
  role: 'superadmin' | 'admin' | 'user'
  active: boolean
  email: string
  createdAt: string
}

export type AdminAnnouncement = {
  id: string
  title: string
  body: string
  active: boolean
  createdAt: string
}

export type AdminSettings = {
  maintenanceMode: boolean
  maintenanceMessage: string
  siteBanner: string
  allowDownloads: boolean
  defaultVolume: number
}

export type AdminTrack = Track & {
  createdAt: string
  source: 'admin'
}

const KEYS = {
  tracks: 'adminTracks',
  hidden: 'adminHiddenTrackIds',
  featured: 'adminFeaturedTrackIds',
  users: 'adminUsers',
  announcements: 'adminAnnouncements',
  settings: 'adminSettings',
} as const

const defaultSettings: AdminSettings = {
  maintenanceMode: false,
  maintenanceMessage: 'Maintenance in progress. Please try again shortly.',
  siteBanner: '',
  allowDownloads: true,
  defaultVolume: 0.7,
}

const defaultUsers: AdminUser[] = [
  {
    id: 'u-admin',
    username: 'admin',
    displayName: 'Super Admin',
    role: 'superadmin',
    active: true,
    email: 'admin@spotify.local',
    createdAt: '2026-01-01T00:00:00.000Z',
  },
]

function uid(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`
}

export function getAdminTracks(): AdminTrack[] {
  return loadJSON<AdminTrack[]>(KEYS.tracks, [])
}

export function saveAdminTracks(list: AdminTrack[]) {
  saveJSON(KEYS.tracks, list)
}

export function upsertAdminTrack(
  input: Omit<AdminTrack, 'id' | 'createdAt' | 'source'> & { id?: string },
): AdminTrack {
  const list = getAdminTracks()
  if (input.id) {
    const idx = list.findIndex((t) => t.id === input.id)
    if (idx >= 0) {
      const next: AdminTrack = {
        ...list[idx],
        ...input,
        id: input.id,
        source: 'admin',
        createdAt: list[idx].createdAt,
      }
      list[idx] = next
      saveAdminTracks(list)
      return next
    }
  }
  const created: AdminTrack = {
    id: input.id || uid('adm'),
    title: input.title,
    artist: input.artist,
    album: input.album,
    duration: input.duration,
    cover: input.cover || '/covers/c1.jpg',
    audio: input.audio || '/audio/pb1.mp3',
    liked: input.liked,
    source: 'admin',
    createdAt: new Date().toISOString(),
  }
  list.unshift(created)
  saveAdminTracks(list)
  return created
}

export function deleteAdminTrack(id: string) {
  saveAdminTracks(getAdminTracks().filter((t) => t.id !== id))
}

export function getHiddenTrackIds(): string[] {
  return loadJSON<string[]>(KEYS.hidden, [])
}

export function setHiddenTrackIds(ids: string[]) {
  saveJSON(KEYS.hidden, ids)
}

export function toggleHiddenTrack(id: string) {
  const ids = new Set(getHiddenTrackIds())
  if (ids.has(id)) ids.delete(id)
  else ids.add(id)
  setHiddenTrackIds(Array.from(ids))
  return Array.from(ids)
}

export function getFeaturedTrackIds(): string[] {
  return loadJSON<string[]>(KEYS.featured, [])
}

export function setFeaturedTrackIds(ids: string[]) {
  saveJSON(KEYS.featured, ids)
}

export function toggleFeaturedTrack(id: string) {
  const ids = getFeaturedTrackIds()
  const next = ids.includes(id) ? ids.filter((x) => x !== id) : [id, ...ids].slice(0, 24)
  setFeaturedTrackIds(next)
  return next
}

export function getAdminUsers(): AdminUser[] {
  const saved = loadJSON<AdminUser[] | null>(KEYS.users, null)
  if (!saved || !saved.length) {
    saveJSON(KEYS.users, defaultUsers)
    return defaultUsers
  }
  if (!saved.some((u) => u.username === 'admin' && u.role === 'superadmin')) {
    const merged = [defaultUsers[0], ...saved.filter((u) => u.username !== 'admin')]
    saveJSON(KEYS.users, merged)
    return merged
  }
  return saved
}

export function saveAdminUsers(users: AdminUser[]) {
  saveJSON(KEYS.users, users)
}

export function upsertAdminUser(
  input: Partial<AdminUser> & { username: string; displayName: string },
): AdminUser {
  const users = getAdminUsers()
  if (input.id) {
    const idx = users.findIndex((u) => u.id === input.id)
    if (idx >= 0) {
      if (users[idx].role === 'superadmin' && input.role && input.role !== 'superadmin') {
        throw new Error('Cannot demote superadmin')
      }
      users[idx] = { ...users[idx], ...input, id: users[idx].id }
      saveAdminUsers(users)
      return users[idx]
    }
  }
  const created: AdminUser = {
    id: uid('user'),
    username: input.username.trim().toLowerCase(),
    displayName: input.displayName.trim(),
    role: input.role || 'user',
    active: input.active ?? true,
    email: input.email || `${input.username}@spotify.local`,
    createdAt: new Date().toISOString(),
  }
  users.push(created)
  saveAdminUsers(users)
  return created
}

export function deleteAdminUser(id: string) {
  const users = getAdminUsers()
  const target = users.find((u) => u.id === id)
  if (!target) return
  if (target.role === 'superadmin') throw new Error('Cannot delete superadmin')
  saveAdminUsers(users.filter((u) => u.id !== id))
}

export function getAnnouncements(): AdminAnnouncement[] {
  return loadJSON<AdminAnnouncement[]>(KEYS.announcements, [])
}

export function saveAnnouncements(list: AdminAnnouncement[]) {
  saveJSON(KEYS.announcements, list)
}

export function upsertAnnouncement(
  input: Partial<AdminAnnouncement> & { title: string; body: string },
): AdminAnnouncement {
  const list = getAnnouncements()
  if (input.id) {
    const idx = list.findIndex((a) => a.id === input.id)
    if (idx >= 0) {
      list[idx] = { ...list[idx], ...input, id: list[idx].id }
      saveAnnouncements(list)
      return list[idx]
    }
  }
  const created: AdminAnnouncement = {
    id: uid('ann'),
    title: input.title,
    body: input.body,
    active: input.active ?? true,
    createdAt: new Date().toISOString(),
  }
  list.unshift(created)
  saveAnnouncements(list)
  return created
}

export function deleteAnnouncement(id: string) {
  saveAnnouncements(getAnnouncements().filter((a) => a.id !== id))
}

export function getAdminSettings(): AdminSettings {
  return { ...defaultSettings, ...loadJSON<Partial<AdminSettings>>(KEYS.settings, {}) }
}

export function saveAdminSettings(settings: AdminSettings) {
  saveJSON(KEYS.settings, settings)
}

export function clearPlayerUserData() {
  const keep = new Set([
    KEYS.tracks,
    KEYS.hidden,
    KEYS.featured,
    KEYS.users,
    KEYS.announcements,
    KEYS.settings,
  ])
  const prefix = 'spotify:'
  const toRemove: string[] = []
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (!key || !key.startsWith(prefix)) continue
    const bare = key.slice(prefix.length)
    if (!keep.has(bare as (typeof KEYS)[keyof typeof KEYS])) toRemove.push(key)
  }
  toRemove.forEach((k) => localStorage.removeItem(k))
}

export function getAdminStats(base: {
  tracks: number
  artists: number
  albums: number
  playlists: number
}) {
  const custom = getAdminTracks().length
  const hidden = getHiddenTrackIds().length
  const users = getAdminUsers().length
  const announcements = getAnnouncements().filter((a) => a.active).length
  return {
    ...base,
    customTracks: custom,
    hiddenTracks: hidden,
    users,
    announcements,
    featured: getFeaturedTrackIds().length,
    settings: getAdminSettings(),
  }
}
