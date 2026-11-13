# Spotify Web Player

Spotify-style web player with a **Python backend** and a React (JavaScript) frontend.

## Stack

- **Backend:** Python 3 (`backend/app.py`) — static SPA + `/api/*` JSON routes
- **Frontend:** React + Vite (JavaScript / JSX)
- **Admin:** `/admin`

## Setup

```bash
npm install
npm run build
python serve.py
```

Open http://127.0.0.1:8000

API health check: http://127.0.0.1:8000/api/health

### Dev (frontend only)

```bash
npm run dev
```

### Env

Copy `.env.example` → `.env` and set `VITE_SPOTIFY_CLIENT_ID` if you use Spotify Connect.
