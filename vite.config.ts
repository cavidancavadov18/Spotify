import { copyFileSync, mkdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'

const rootDir = fileURLToPath(new URL('.', import.meta.url))

/** So python http.server can serve /admin without # */
function adminHtmlFallback(): Plugin {
  return {
    name: 'admin-html-fallback',
    closeBundle() {
      const dist = resolve(rootDir, 'dist')
      const adminDir = resolve(dist, 'admin')
      mkdirSync(adminDir, { recursive: true })
      copyFileSync(resolve(dist, 'index.html'), resolve(adminDir, 'index.html'))
    },
  }
}

// Spotify OAuth requires a loopback host (127.0.0.1), not "localhost".
export default defineConfig({
  plugins: [react(), adminHtmlFallback()],
  server: {
    host: '127.0.0.1',
    port: 5173,
  },
  preview: {
    host: '127.0.0.1',
    port: 4173,
  },
})
