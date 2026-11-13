import { loadJSON, saveJSON } from "./storage";
const CLIENT_ID_KEY = "clientId";
const TOKEN_KEY = "authToken";
const VERIFIER_KEY = "pkceVerifier";
const SPOTIFY_SCOPES = [
  "streaming",
  "user-read-email",
  "user-read-private",
  "user-read-playback-state",
  "user-modify-playback-state"
].join(" ");
function getSpotifyClientId() {
  const fromEnv = import.meta.env.VITE_SPOTIFY_CLIENT_ID?.trim();
  if (fromEnv) return fromEnv;
  return (loadJSON(CLIENT_ID_KEY, "") || "").trim();
}
function setSpotifyClientId(id) {
  saveJSON(CLIENT_ID_KEY, id.trim());
}
function getRedirectUri() {
  return `${window.location.origin}/`;
}
function randomString(length) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";
  const values = crypto.getRandomValues(new Uint8Array(length));
  return Array.from(values, (v) => chars[v % chars.length]).join("");
}
async function sha256Base64Url(plain) {
  const data = new TextEncoder().encode(plain);
  const digest = await crypto.subtle.digest("SHA-256", data);
  const bytes = new Uint8Array(digest);
  let str = "";
  bytes.forEach((b) => {
    str += String.fromCharCode(b);
  });
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
function getStoredToken() {
  return loadJSON(TOKEN_KEY, null);
}
function clearStoredToken() {
  saveJSON(TOKEN_KEY, null);
}
function saveToken(token) {
  saveJSON(TOKEN_KEY, token);
}
async function beginSpotifyLogin(clientId = getSpotifyClientId()) {
  if (!clientId) throw new Error("Spotify Client ID laz\u0131md\u0131r");
  const verifier = randomString(64);
  const challenge = await sha256Base64Url(verifier);
  saveJSON(VERIFIER_KEY, verifier);
  const params = new URLSearchParams({
    client_id: clientId,
    response_type: "code",
    redirect_uri: getRedirectUri(),
    scope: SPOTIFY_SCOPES,
    code_challenge_method: "S256",
    code_challenge: challenge,
    state: randomString(16)
  });
  window.location.assign(`https://accounts.spotify.com/authorize?${params}`);
}
async function exchangeCodeForToken(code, clientId = getSpotifyClientId()) {
  const verifier = loadJSON(VERIFIER_KEY, null);
  if (!verifier) throw new Error("PKCE verifier tap\u0131lmad\u0131 \u2014 yenid\u0259n Connect et");
  if (!clientId) throw new Error("Spotify Client ID laz\u0131md\u0131r");
  const body = new URLSearchParams({
    client_id: clientId,
    grant_type: "authorization_code",
    code,
    redirect_uri: getRedirectUri(),
    code_verifier: verifier
  });
  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Token al\u0131nmad\u0131 (${res.status}): ${text}`);
  }
  const json = await res.json();
  const token = {
    access_token: json.access_token,
    refresh_token: json.refresh_token,
    expires_at: Date.now() + json.expires_in * 1e3 - 3e4,
    token_type: json.token_type,
    scope: json.scope
  };
  saveToken(token);
  saveJSON(VERIFIER_KEY, null);
  return token;
}
async function refreshAccessToken(token, clientId) {
  if (!token.refresh_token) throw new Error("Refresh token yoxdur");
  const body = new URLSearchParams({
    client_id: clientId,
    grant_type: "refresh_token",
    refresh_token: token.refresh_token
  });
  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body
  });
  if (!res.ok) throw new Error("Token yenil\u0259nm\u0259di");
  const json = await res.json();
  const next = {
    access_token: json.access_token,
    refresh_token: json.refresh_token || token.refresh_token,
    expires_at: Date.now() + json.expires_in * 1e3 - 3e4,
    token_type: json.token_type,
    scope: json.scope || token.scope
  };
  saveToken(next);
  return next;
}
async function getValidAccessToken() {
  const clientId = getSpotifyClientId();
  let token = getStoredToken();
  if (!token?.access_token || !clientId) return null;
  if (Date.now() >= token.expires_at) {
    try {
      token = await refreshAccessToken(token, clientId);
    } catch {
      clearStoredToken();
      return null;
    }
  }
  return token.access_token;
}
async function consumeAuthRedirect() {
  const url = new URL(window.location.href);
  const code = url.searchParams.get("code");
  const err = url.searchParams.get("error");
  if (!code && !err) return "none";
  url.search = "";
  window.history.replaceState({}, "", url.pathname + url.hash);
  if (err) return "error";
  try {
    await exchangeCodeForToken(code);
    return "ok";
  } catch {
    return "error";
  }
}
export {
  SPOTIFY_SCOPES,
  beginSpotifyLogin,
  clearStoredToken,
  consumeAuthRedirect,
  exchangeCodeForToken,
  getRedirectUri,
  getSpotifyClientId,
  getStoredToken,
  getValidAccessToken,
  saveToken,
  setSpotifyClientId
};
