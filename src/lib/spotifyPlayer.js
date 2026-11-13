import { getValidAccessToken } from "./spotifyAuth";
let sdkPromise = null;
function loadSpotifySdk() {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.Spotify) return Promise.resolve();
  if (sdkPromise) return sdkPromise;
  sdkPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector("script[data-spotify-sdk]");
    if (existing) {
      window.onSpotifyWebPlaybackSDKReady = () => resolve();
      return;
    }
    window.onSpotifyWebPlaybackSDKReady = () => resolve();
    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;
    script.dataset.spotifySdk = "1";
    script.onerror = () => reject(new Error("Spotify SDK y\xFCkl\u0259nm\u0259di"));
    document.body.appendChild(script);
  });
  return sdkPromise;
}
async function createSpotifyPlayer(opts) {
  await loadSpotifySdk();
  const player = new window.Spotify.Player({
    name: opts.name || "Spotify Web Player Clone",
    getOAuthToken: (cb) => {
      void getValidAccessToken().then((token) => {
        if (token) cb(token);
        else opts.onError?.("Spotify token yoxdur \u2014 yenid\u0259n Connect et");
      });
    },
    volume: opts.volume ?? 0.7
  });
  player.addListener("ready", (data) => {
    const { device_id } = data;
    opts.onReady(device_id);
  });
  player.addListener("not_ready", (data) => {
    const { device_id } = data;
    opts.onNotReady?.(device_id);
  });
  player.addListener("player_state_changed", (state) => {
    opts.onState?.(state);
  });
  player.addListener("initialization_error", (e) => {
    opts.onError?.(e.message || "SDK init error");
  });
  player.addListener("authentication_error", (e) => {
    opts.onError?.(e.message || "Auth error \u2014 Premium + Connect");
  });
  player.addListener("account_error", (e) => {
    opts.onError?.(e.message || "Spotify Premium laz\u0131md\u0131r");
  });
  player.addListener("playback_error", (e) => {
    opts.onError?.(e.message || "Playback error");
  });
  const ok = await player.connect();
  if (!ok) throw new Error("Spotify player connect al\u0131nmad\u0131");
  return player;
}
export {
  createSpotifyPlayer,
  loadSpotifySdk
};
