import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault()
  window.__pwaInstall = e as BeforeInstallPromptEvent
})

window.addEventListener('appinstalled', () => {
  window.__pwaInstall = undefined
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
