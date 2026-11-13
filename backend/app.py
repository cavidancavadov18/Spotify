#!/usr/bin/env python3
"""Spotify Web Player — Python backend.

Serves the built frontend (dist/) and JSON API endpoints.
Run:  python -m backend.app
  or: python backend/app.py
"""

from __future__ import annotations

import argparse
import json
import mimetypes
import os
import re
from http import HTTPStatus
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parent.parent
DIST = ROOT / "dist"
DATA = Path(__file__).resolve().parent / "data"
HOST_DEFAULT = "127.0.0.1"
PORT_DEFAULT = 8000


def _load_json(name: str, fallback):
    path = DATA / name
    if not path.exists():
        return fallback
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        return fallback


def _save_json(name: str, payload) -> None:
    DATA.mkdir(parents=True, exist_ok=True)
    (DATA / name).write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")


class SpotifyHandler(SimpleHTTPRequestHandler):
    """Static SPA + /api/* Python routes."""

    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(DIST), **kwargs)

    def log_message(self, fmt: str, *args) -> None:
        print(f"[backend] {self.address_string()} — {fmt % args}")

    def end_headers(self) -> None:
        self.send_header("Cache-Control", "no-cache")
        super().end_headers()

    def _json(self, status: int, payload) -> None:
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def _read_json(self):
        length = int(self.headers.get("Content-Length", 0) or 0)
        raw = self.rfile.read(length) if length else b"{}"
        try:
            return json.loads(raw.decode("utf-8") or "{}")
        except json.JSONDecodeError:
            return {}

    def _serve_spa(self, path: str) -> None:
        """Fallback to index.html for client-side routes like /admin."""
        candidate = DIST / path.lstrip("/")
        if candidate.is_file():
            return SimpleHTTPRequestHandler.do_GET(self)

        # /admin → dist/admin/index.html (copied at build) or root index
        admin_index = DIST / "admin" / "index.html"
        index = admin_index if path.rstrip("/").endswith("admin") and admin_index.exists() else DIST / "index.html"
        if not index.exists():
            self.send_error(HTTPStatus.NOT_FOUND, "dist/ missing — run npm run build")
            return
        data = index.read_bytes()
        self.send_response(HTTPStatus.OK)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)

    # ── API ──────────────────────────────────────────────────────────
    def _handle_api(self, method: str) -> bool:
        parsed = urlparse(self.path)
        path = parsed.path.rstrip("/") or "/"

        if path == "/api/health" and method == "GET":
            self._json(200, {"ok": True, "backend": "python", "service": "spotify-web-player"})
            return True

        if path == "/api/info" and method == "GET":
            self._json(
                200,
                {
                    "name": "Spotify Web Player",
                    "backend": "Python",
                    "frontend": "React + Vite (JavaScript)",
                    "version": "1.0.0",
                },
            )
            return True

        if path == "/api/settings":
            if method == "GET":
                self._json(200, _load_json("settings.json", {
                    "siteBanner": "",
                    "maintenanceMode": False,
                    "maintenanceMessage": "We'll be right back.",
                }))
                return True
            if method in ("PUT", "POST"):
                body = self._read_json()
                current = _load_json("settings.json", {})
                current.update(body or {})
                _save_json("settings.json", current)
                self._json(200, current)
                return True

        if path == "/api/announcements":
            if method == "GET":
                self._json(200, _load_json("announcements.json", []))
                return True
            if method == "POST":
                items = _load_json("announcements.json", [])
                item = self._read_json()
                item.setdefault("id", f"a-{len(items) + 1}")
                item.setdefault("active", True)
                items.append(item)
                _save_json("announcements.json", items)
                self._json(201, item)
                return True

        if path == "/api/featured" and method == "GET":
            self._json(200, _load_json("featured.json", []))
            return True

        if re.fullmatch(r"/api/announcements/[^/]+", path) and method == "DELETE":
            ann_id = path.rsplit("/", 1)[-1]
            items = [a for a in _load_json("announcements.json", []) if str(a.get("id")) != ann_id]
            _save_json("announcements.json", items)
            self._json(200, {"deleted": ann_id})
            return True

        if path.startswith("/api/"):
            self._json(404, {"error": "not_found", "path": path})
            return True

        return False

    def do_GET(self) -> None:  # noqa: N802
        if self._handle_api("GET"):
            return
        parsed = urlparse(self.path)
        rel = parsed.path
        file_path = DIST / rel.lstrip("/")
        if rel in ("/", "") or not file_path.exists() or rel.rstrip("/").endswith("admin"):
            # Static asset miss → SPA
            if "." in Path(rel).name and not rel.rstrip("/").endswith("admin"):
                return SimpleHTTPRequestHandler.do_GET(self)
            return self._serve_spa(rel)
        return SimpleHTTPRequestHandler.do_GET(self)

    def do_POST(self) -> None:  # noqa: N802
        if not self._handle_api("POST"):
            self.send_error(HTTPStatus.METHOD_NOT_ALLOWED)

    def do_PUT(self) -> None:  # noqa: N802
        if not self._handle_api("PUT"):
            self.send_error(HTTPStatus.METHOD_NOT_ALLOWED)

    def do_DELETE(self) -> None:  # noqa: N802
        if not self._handle_api("DELETE"):
            self.send_error(HTTPStatus.METHOD_NOT_ALLOWED)


def main() -> int:
    parser = argparse.ArgumentParser(description="Spotify Web Player Python backend")
    parser.add_argument("--host", default=os.environ.get("HOST", HOST_DEFAULT))
    parser.add_argument("--port", type=int, default=int(os.environ.get("PORT", PORT_DEFAULT)))
    args = parser.parse_args()

    if not DIST.is_dir() or not (DIST / "index.html").exists():
        print("dist/ not found. Run: npm run build")
        return 1

    mimetypes.add_type("application/javascript", ".js")
    mimetypes.add_type("text/css", ".css")
    mimetypes.add_type("application/manifest+json", ".webmanifest")

    DATA.mkdir(parents=True, exist_ok=True)
    httpd = ThreadingHTTPServer((args.host, args.port), SpotifyHandler)
    print(f"Python backend ready")
    print(f"  UI   http://{args.host}:{args.port}")
    print(f"  API  http://{args.host}:{args.port}/api/health")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nStopped.")
    finally:
        httpd.server_close()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
