import { loadJSON, saveJSON } from "../lib/storage";
const KEYS = {
  tracks: "adminTracks",
  hidden: "adminHiddenTrackIds",
  featured: "adminFeaturedTrackIds",
  users: "adminUsers",
  announcements: "adminAnnouncements",
  settings: "adminSettings"
};
const defaultSettings = {
  maintenanceMode: false,
  maintenanceMessage: "Maintenance in progress. Please try again shortly.",
  siteBanner: "",
  allowDownloads: true,
  defaultVolume: 0.7
};
const defaultUsers = [
  {
    id: "u-admin",
    username: "admin",
    displayName: "Super Admin",
    role: "superadmin",
    active: true,
    email: "admin@spotify.local",
    createdAt: "2026-01-01T00:00:00.000Z"
  }
];
function uid(prefix) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}
function getAdminTracks() {
  return loadJSON(KEYS.tracks, []);
}
function saveAdminTracks(list) {
  saveJSON(KEYS.tracks, list);
}
function upsertAdminTrack(input) {
  const list = getAdminTracks();
  if (input.id) {
    const idx = list.findIndex((t) => t.id === input.id);
    if (idx >= 0) {
      const next = {
        ...list[idx],
        ...input,
        id: input.id,
        source: "admin",
        createdAt: list[idx].createdAt
      };
      list[idx] = next;
      saveAdminTracks(list);
      return next;
    }
  }
  const created = {
    id: input.id || uid("adm"),
    title: input.title,
    artist: input.artist,
    album: input.album,
    duration: input.duration,
    cover: input.cover || "/covers/c1.jpg",
    audio: input.audio || "/audio/pb1.mp3",
    liked: input.liked,
    source: "admin",
    createdAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  list.unshift(created);
  saveAdminTracks(list);
  return created;
}
function deleteAdminTrack(id) {
  saveAdminTracks(getAdminTracks().filter((t) => t.id !== id));
}
function getHiddenTrackIds() {
  return loadJSON(KEYS.hidden, []);
}
function setHiddenTrackIds(ids) {
  saveJSON(KEYS.hidden, ids);
}
function toggleHiddenTrack(id) {
  const ids = new Set(getHiddenTrackIds());
  if (ids.has(id)) ids.delete(id);
  else ids.add(id);
  setHiddenTrackIds(Array.from(ids));
  return Array.from(ids);
}
function getFeaturedTrackIds() {
  return loadJSON(KEYS.featured, []);
}
function setFeaturedTrackIds(ids) {
  saveJSON(KEYS.featured, ids);
}
function toggleFeaturedTrack(id) {
  const ids = getFeaturedTrackIds();
  const next = ids.includes(id) ? ids.filter((x) => x !== id) : [id, ...ids].slice(0, 24);
  setFeaturedTrackIds(next);
  return next;
}
function getAdminUsers() {
  const saved = loadJSON(KEYS.users, null);
  if (!saved || !saved.length) {
    saveJSON(KEYS.users, defaultUsers);
    return defaultUsers;
  }
  if (!saved.some((u) => u.username === "admin" && u.role === "superadmin")) {
    const merged = [defaultUsers[0], ...saved.filter((u) => u.username !== "admin")];
    saveJSON(KEYS.users, merged);
    return merged;
  }
  return saved;
}
function saveAdminUsers(users) {
  saveJSON(KEYS.users, users);
}
function upsertAdminUser(input) {
  const users = getAdminUsers();
  if (input.id) {
    const idx = users.findIndex((u) => u.id === input.id);
    if (idx >= 0) {
      if (users[idx].role === "superadmin" && input.role && input.role !== "superadmin") {
        throw new Error("Cannot demote superadmin");
      }
      users[idx] = { ...users[idx], ...input, id: users[idx].id };
      saveAdminUsers(users);
      return users[idx];
    }
  }
  const created = {
    id: uid("user"),
    username: input.username.trim().toLowerCase(),
    displayName: input.displayName.trim(),
    role: input.role || "user",
    active: input.active ?? true,
    email: input.email || `${input.username}@spotify.local`,
    createdAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  users.push(created);
  saveAdminUsers(users);
  return created;
}
function deleteAdminUser(id) {
  const users = getAdminUsers();
  const target = users.find((u) => u.id === id);
  if (!target) return;
  if (target.role === "superadmin") throw new Error("Cannot delete superadmin");
  saveAdminUsers(users.filter((u) => u.id !== id));
}
function getAnnouncements() {
  return loadJSON(KEYS.announcements, []);
}
function saveAnnouncements(list) {
  saveJSON(KEYS.announcements, list);
}
function upsertAnnouncement(input) {
  const list = getAnnouncements();
  if (input.id) {
    const idx = list.findIndex((a) => a.id === input.id);
    if (idx >= 0) {
      list[idx] = { ...list[idx], ...input, id: list[idx].id };
      saveAnnouncements(list);
      return list[idx];
    }
  }
  const created = {
    id: uid("ann"),
    title: input.title,
    body: input.body,
    active: input.active ?? true,
    createdAt: (/* @__PURE__ */ new Date()).toISOString()
  };
  list.unshift(created);
  saveAnnouncements(list);
  return created;
}
function deleteAnnouncement(id) {
  saveAnnouncements(getAnnouncements().filter((a) => a.id !== id));
}
function getAdminSettings() {
  return { ...defaultSettings, ...loadJSON(KEYS.settings, {}) };
}
function saveAdminSettings(settings) {
  saveJSON(KEYS.settings, settings);
}
function clearPlayerUserData() {
  const keep = /* @__PURE__ */ new Set([
    KEYS.tracks,
    KEYS.hidden,
    KEYS.featured,
    KEYS.users,
    KEYS.announcements,
    KEYS.settings
  ]);
  const prefix = "spotify:";
  const toRemove = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key || !key.startsWith(prefix)) continue;
    const bare = key.slice(prefix.length);
    if (!keep.has(bare)) toRemove.push(key);
  }
  toRemove.forEach((k) => localStorage.removeItem(k));
}
function getAdminStats(base) {
  const custom = getAdminTracks().length;
  const hidden = getHiddenTrackIds().length;
  const users = getAdminUsers().length;
  const announcements = getAnnouncements().filter((a) => a.active).length;
  return {
    ...base,
    customTracks: custom,
    hiddenTracks: hidden,
    users,
    announcements,
    featured: getFeaturedTrackIds().length,
    settings: getAdminSettings()
  };
}
export {
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
  saveAdminTracks,
  saveAdminUsers,
  saveAnnouncements,
  setFeaturedTrackIds,
  setHiddenTrackIds,
  toggleFeaturedTrack,
  toggleHiddenTrack,
  upsertAdminTrack,
  upsertAdminUser,
  upsertAnnouncement
};
