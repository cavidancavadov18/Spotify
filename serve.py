#!/usr/bin/env python3
"""Serve the built Spotify demo (dist/) with Python's HTTP server."""

from __future__ import annotations

import argparse
import functools
import http.server
import os
import socketserver
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
DIST = ROOT / "dist"


def main() -> int:
    parser = argparse.ArgumentParser(description="Serve Spotify demo from dist/")
    parser.add_argument("--host", default="127.0.0.1")
    parser.add_argument("--port", type=int, default=8000)
    args = parser.parse_args()

    if not DIST.is_dir() or not (DIST / "index.html").exists():
        print("dist/ not found. Run: npm run build", file=sys.stderr)
        return 1

    os.chdir(DIST)
    handler = functools.partial(http.server.SimpleHTTPRequestHandler)
    with socketserver.TCPServer((args.host, args.port), handler) as httpd:
        print(f"Serving {DIST}")
        print(f"Open http://{args.host}:{args.port}")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nStopped.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
