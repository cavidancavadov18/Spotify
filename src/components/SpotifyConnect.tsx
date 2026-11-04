import { useState } from 'react'
import { usePlayer } from '../context/PlayerContext'
import { getRedirectUri, getSpotifyClientId, setSpotifyClientId } from '../lib/spotifyAuth'

export function SpotifyConnectModal() {
  const {
    spotifyConnectOpen,
    setSpotifyConnectOpen,
    connectSpotify,
    disconnectSpotify,
    spotifyConnected,
    spotifyUserName,
    pushToast,
  } = usePlayer()

  const [clientId, setClientId] = useState(() => getSpotifyClientId())
  const [busy, setBusy] = useState(false)
  const redirect = typeof window !== 'undefined' ? getRedirectUri() : 'http://127.0.0.1:8000/'

  if (!spotifyConnectOpen) return null

  const onConnect = async () => {
    setBusy(true)
    try {
      setSpotifyClientId(clientId)
      await connectSpotify()
    } catch (e) {
      pushToast(e instanceof Error ? e.message : 'Connect alınmadı')
      setBusy(false)
    }
  }

  return (
    <div className="modal-backdrop" role="presentation" onClick={() => setSpotifyConnectOpen(false)}>
      <div
        className="modal narrow spotify-connect-modal"
        role="dialog"
        aria-labelledby="spotify-connect-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2 id="spotify-connect-title">Connect Spotify</h2>
          <button type="button" className="icon-btn" onClick={() => setSpotifyConnectOpen(false)}>
            ×
          </button>
        </div>
        <p className="modal-sub">
          Real mahnılar Spotify Premium hesabından axır (fayl sayta yüklənmir). Dashboard-da app
          yarat, Redirect URI əlavə et, Client ID yaz.
        </p>
        <ol className="spotify-connect-steps">
          <li>
            <a href="https://developer.spotify.com/dashboard" target="_blank" rel="noreferrer">
              Spotify Developer Dashboard
            </a>{' '}
            → Create app
          </li>
          <li>
            Redirect URI: <code className="spotify-code">{redirect}</code>
          </li>
          <li>Client ID-ni kopyala və aşağıya yapışdır</li>
          <li>Premium hesabla Connect et</li>
        </ol>

        <label className="field">
          <span>Client ID</span>
          <input
            value={clientId}
            onChange={(e) => setClientId(e.target.value.trim())}
            placeholder="xxxxxxxxxxxxxxxxxxxxxxxx"
            autoComplete="off"
            spellCheck={false}
          />
        </label>

        {spotifyConnected && (
          <p className="spotify-connected-as">
            Qoşulub: <strong>{spotifyUserName || 'Spotify'}</strong>
          </p>
        )}

        <div className="modal-actions">
          {spotifyConnected ? (
            <button type="button" className="secondary-btn" onClick={() => disconnectSpotify()}>
              Disconnect
            </button>
          ) : (
            <button
              type="button"
              className="primary-btn"
              disabled={busy || !clientId}
              onClick={() => void onConnect()}
            >
              {busy ? 'Opening…' : 'Connect Spotify'}
            </button>
          )}
          <button type="button" className="secondary-btn" onClick={() => setSpotifyConnectOpen(false)}>
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
