import { usePlayer } from '../context/PlayerContext'

type FooterLink = {
  label: string
  href: string
  action?: 'premium' | 'lyrics' | 'search' | 'library' | 'install'
}

const columns: { title: string; links: FooterLink[] }[] = [
  {
    title: 'Company',
    links: [
      { label: 'About', href: 'https://www.spotify.com/about/' },
      { label: 'Jobs', href: 'https://www.lifeatspotify.com/' },
      { label: 'For the Record', href: 'https://newsroom.spotify.com/' },
    ],
  },
  {
    title: 'Communities',
    links: [
      { label: 'For Artists', href: 'https://artists.spotify.com/' },
      { label: 'For Creators', href: 'https://creators.spotify.com/' },
      { label: 'For Authors', href: 'https://authors.spotify.com/' },
      { label: 'Developers', href: 'https://developer.spotify.com/' },
      { label: 'Advertising', href: 'https://ads.spotify.com/' },
      { label: 'Investors', href: 'https://investors.spotify.com/' },
      { label: 'Vendors', href: 'https://spotifyforvendors.com/' },
    ],
  },
  {
    title: 'Useful links',
    links: [
      { label: 'Support', href: 'https://support.spotify.com/' },
      {
        label: 'Free Mobile App',
        href: 'https://www.spotify.com/download/windows/',
        action: 'install',
      },
      {
        label: 'Popular by Country',
        href: 'https://charts.spotify.com/',
        action: 'search',
      },
      {
        label: 'Top Song Lyrics',
        href: 'https://support.spotify.com/article/lyrics-feature/',
        action: 'lyrics',
      },
      {
        label: 'Import your music',
        href: 'https://support.spotify.com/article/local-files/',
        action: 'library',
      },
    ],
  },
  {
    title: 'Spotify Plans',
    links: [
      {
        label: 'Premium Individual',
        href: 'https://www.spotify.com/premium/',
        action: 'premium',
      },
      {
        label: 'Premium Duo',
        href: 'https://www.spotify.com/duo/',
        action: 'premium',
      },
      {
        label: 'Premium Family',
        href: 'https://www.spotify.com/family/',
        action: 'premium',
      },
      {
        label: 'Premium Student',
        href: 'https://www.spotify.com/student/',
        action: 'premium',
      },
      {
        label: 'Spotify Free',
        href: 'https://www.spotify.com/free/',
        action: 'premium',
      },
    ],
  },
]

const legalLinks: FooterLink[] = [
  { label: 'Legal', href: 'https://www.spotify.com/legal/end-user-agreement/' },
  {
    label: 'Safety & Privacy Center',
    href: 'https://www.spotify.com/safetyandprivacy/',
  },
  { label: 'Privacy Policy', href: 'https://www.spotify.com/legal/privacy-policy/' },
  { label: 'Cookies', href: 'https://www.spotify.com/legal/cookies-policy/' },
  { label: 'About Ads', href: 'https://www.spotify.com/legal/privacy-policy/#s3' },
  { label: 'Accessibility', href: 'https://www.spotify.com/accessibility/' },
]

const social = [
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/spotify/',
    icon: (
      <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor" aria-hidden>
        <path d="M8 1.44c2.14 0 2.39.01 3.23.05.78.04 1.2.16 1.48.27.37.15.64.32.92.6.28.28.45.55.6.92.11.28.23.7.27 1.48.04.84.05 1.09.05 3.23s-.01 2.39-.05 3.23c-.04.78-.16 1.2-.27 1.48a2.47 2.47 0 0 1-.6.92 2.47 2.47 0 0 1-.92.6c-.28.11-.7.23-1.48.27-.84.04-1.09.05-3.23.05s-2.39-.01-3.23-.05c-.78-.04-1.2-.16-1.48-.27a2.47 2.47 0 0 1-.92-.6 2.47 2.47 0 0 1-.6-.92c-.11-.28-.23-.7-.27-1.48A55.6 55.6 0 0 1 1.44 8c0-2.14.01-2.39.05-3.23.04-.78.16-1.2.27-1.48.15-.37.32-.64.6-.92.28-.28.55-.45.92-.6.28-.11.7-.23 1.48-.27C5.61 1.45 5.86 1.44 8 1.44zM8 0C5.83 0 5.55.01 4.7.05 3.85.09 3.27.23 2.76.43a3.9 3.9 0 0 0-1.41.92A3.9 3.9 0 0 0 .43 2.76C.23 3.27.09 3.85.05 4.7.01 5.55 0 5.83 0 8s.01 2.45.05 3.3c.04.85.18 1.43.38 1.94.21.53.49.98.92 1.41.43.43.88.71 1.41.92.51.2 1.09.34 1.94.38C5.55 15.99 5.83 16 8 16s2.45-.01 3.3-.05c.85-.04 1.43-.18 1.94-.38a3.9 3.9 0 0 0 1.41-.92 3.9 3.9 0 0 0 .92-1.41c.2-.51.34-1.09.38-1.94C15.99 10.45 16 10.17 16 8s-.01-2.45-.05-3.3c-.04-.85-.18-1.43-.38-1.94a3.9 3.9 0 0 0-.92-1.41A3.9 3.9 0 0 0 13.24.43C12.73.23 12.15.09 11.3.05 10.45.01 10.17 0 8 0z" />
        <path d="M8 3.89a4.11 4.11 0 1 0 0 8.22 4.11 4.11 0 0 0 0-8.22zM8 10.67a2.67 2.67 0 1 1 0-5.34 2.67 2.67 0 0 1 0 5.34zM13.08 3.73a.96.96 0 1 1-1.92 0 .96.96 0 0 1 1.92 0z" />
      </svg>
    ),
  },
  {
    label: 'X',
    href: 'https://x.com/spotify',
    icon: (
      <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor" aria-hidden>
        <path d="M12.6.75h2.45l-5.36 6.13L16 15.25h-4.94L7.35 9.98 2.95 15.25H.5l5.73-6.55L0 .75h5.06l3.43 4.78L12.6.75zm-.86 13.06h1.36L4.34 2.16H2.88l8.86 11.65z" />
      </svg>
    ),
  },
  {
    label: 'Facebook',
    href: 'https://www.facebook.com/Spotify',
    icon: (
      <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor" aria-hidden>
        <path d="M16 8a8 8 0 1 0-9.25 7.9v-5.59H4.72V8h2.03V6.24c0-2 1.2-3.11 3.02-3.11.88 0 1.8.16 1.8.16v1.98h-1.01c-1 0-1.31.62-1.31 1.25V8h2.23l-.36 2.31H9.26v5.59A8 8 0 0 0 16 8z" />
      </svg>
    ),
  },
]

function openExternal(href: string) {
  window.open(href, '_blank', 'noopener,noreferrer')
}

export function SiteFooter() {
  const { setPremiumOpen, setLyricsOpen, setView, setSearchQuery, pushToast } = usePlayer()

  const onLink = (link: FooterLink) => {
    if (link.action === 'premium') setPremiumOpen(true)
    if (link.action === 'lyrics') setLyricsOpen(true)
    if (link.action === 'search') {
      setSearchQuery('charts')
      setView({ type: 'search' })
    }
    if (link.action === 'library') setView({ type: 'library' })
    if (link.action === 'install') {
      const deferred = window.__pwaInstall
      if (deferred) {
        void deferred.prompt()
      } else {
        pushToast('Install: browser menu → Install app')
      }
    }
    openExternal(link.href)
  }

  const year = new Date().getFullYear()

  return (
    <footer className="site-footer" aria-label="Spotify footer">
      <div className="site-footer-top">
        <div className="site-footer-columns">
          {columns.map((col) => (
            <div key={col.title} className="site-footer-col">
              <h3>{col.title}</h3>
              <ul>
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => {
                        e.preventDefault()
                        onLink(link)
                      }}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="site-footer-social">
          {social.map((s) => (
            <a
              key={s.label}
              className="site-footer-social-btn"
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.label}
              title={s.label}
            >
              {s.icon}
            </a>
          ))}
        </div>
      </div>

      <div className="site-footer-divider" />

      <div className="site-footer-bottom">
        <nav className="site-footer-legal" aria-label="Legal">
          {legalLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => {
                e.preventDefault()
                openExternal(link.href)
              }}
            >
              {link.label}
            </a>
          ))}
        </nav>
        <p className="site-footer-copy">© {year} Spotify AB</p>
      </div>
    </footer>
  )
}
