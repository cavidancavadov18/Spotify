const uriCache = /* @__PURE__ */ new Map();
async function spotifyFetch(token, path, init) {
  const res = await fetch(`https://api.spotify.com/v1${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...init?.headers || {}
    }
  });
  if (res.status === 204) return null;
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Spotify API ${res.status}`);
  }
  const ct = res.headers.get("content-type") || "";
  if (ct.includes("application/json")) return res.json();
  return null;
}
async function getSpotifyProfile(token) {
  return spotifyFetch(token, "/me");
}
async function resolveSpotifyUri(token, track) {
  const cached = uriCache.get(track.id);
  if (cached) return cached;
  const q = `track:${track.title} artist:${track.artist.split(",")[0].trim()}`;
  const data = await spotifyFetch(
    token,
    `/search?${new URLSearchParams({ q, type: "track", limit: "5" })}`
  );
  const items = data?.tracks?.items || [];
  if (!items.length) return null;
  const titleNorm = track.title.toLowerCase();
  const artistNorm = track.artist.toLowerCase();
  const best = items.find(
    (t) => t.name.toLowerCase().includes(titleNorm.slice(0, 12)) || titleNorm.includes(t.name.toLowerCase().slice(0, 12))
  ) || items.find(
    (t) => t.artists.some((a) => artistNorm.includes(a.name.toLowerCase()))
  ) || items[0];
  uriCache.set(track.id, best.uri);
  return best.uri;
}
async function playSpotifyUri(token, deviceId, uri) {
  await spotifyFetch(token, `/me/player/play?device_id=${encodeURIComponent(deviceId)}`, {
    method: "PUT",
    body: JSON.stringify({ uris: [uri] })
  });
}
async function pauseSpotify(token, deviceId) {
  const q = deviceId ? `?device_id=${encodeURIComponent(deviceId)}` : "";
  await spotifyFetch(token, `/me/player/pause${q}`, { method: "PUT" });
}
async function resumeSpotify(token, deviceId) {
  const q = deviceId ? `?device_id=${encodeURIComponent(deviceId)}` : "";
  await spotifyFetch(token, `/me/player/play${q}`, { method: "PUT" });
}
async function seekSpotify(token, positionMs, deviceId) {
  const params = new URLSearchParams({ position_ms: String(Math.floor(positionMs)) });
  if (deviceId) params.set("device_id", deviceId);
  await spotifyFetch(token, `/me/player/seek?${params}`, { method: "PUT" });
}
async function setSpotifyVolume(token, volumePercent, deviceId) {
  const params = new URLSearchParams({
    volume_percent: String(Math.round(Math.min(100, Math.max(0, volumePercent))))
  });
  if (deviceId) params.set("device_id", deviceId);
  await spotifyFetch(token, `/me/player/volume?${params}`, { method: "PUT" });
}
async function transferPlayback(token, deviceId, play = false) {
  await spotifyFetch(token, "/me/player", {
    method: "PUT",
    body: JSON.stringify({ device_ids: [deviceId], play })
  });
}
async function getSpotifyDevices(token) {
  const data = await spotifyFetch(token, "/me/player/devices");
  return data?.devices || [];
}
export {
  getSpotifyDevices,
  getSpotifyProfile,
  pauseSpotify,
  playSpotifyUri,
  resolveSpotifyUri,
  resumeSpotify,
  seekSpotify,
  setSpotifyVolume,
  transferPlayback
};
