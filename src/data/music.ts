import { buildAzTrCatalog } from './azTrCatalog'

export type Track = {
  id: string
  title: string
  artist: string
  album: string
  duration: number
  cover: string
  audio: string
  liked?: boolean
}

export type Playlist = {
  id: string
  name: string
  description: string
  cover: string
  owner: string
  color: string
  trackIds: string[]
}

export type Album = {
  id: string
  name: string
  artist: string
  cover: string
  year: string
  color: string
  trackIds: string[]
}

export type Artist = {
  id: string
  name: string
  cover: string
  followers: string
  color: string
}

const demoTracks: Track[] = [
  {
    id: 't1',
    title: 'Midnight Drive',
    artist: 'Neon Harbor',
    album: 'City Lights',
    duration: 186,
    cover: '/covers/c1.jpg',
    audio: '/audio/pb1.mp3',
    liked: true,
  },
  {
    id: 't2',
    title: 'Soft Static',
    artist: 'Luna Wave',
    album: 'Afterglow',
    duration: 142,
    cover: '/covers/c2.jpg',
    audio: '/audio/pb2.mp3',
    liked: true,
  },
  {
    id: 't3',
    title: 'Golden Hour',
    artist: 'Velvet Coast',
    album: 'Sunroom',
    duration: 168,
    cover: '/covers/c3.jpg',
    audio: '/audio/pb6.mp3',
  },
  {
    id: 't4',
    title: 'Echoes',
    artist: 'Northbound',
    album: 'Wide Open',
    duration: 155,
    cover: '/covers/c4.jpg',
    audio: '/audio/pb9.mp3',
    liked: true,
  },
  {
    id: 't5',
    title: 'Paper Planes',
    artist: 'Kite Club',
    album: 'Weekend',
    duration: 178,
    cover: '/covers/c5.jpg',
    audio: '/audio/pb10.mp3',
  },
  {
    id: 't6',
    title: 'Low Battery',
    artist: 'Circuit Bloom',
    album: 'Analog Hearts',
    duration: 121,
    cover: '/covers/c6.jpg',
    audio: '/audio/pb11.mp3',
  },
  {
    id: 't7',
    title: 'Blue Room',
    artist: 'Astra Finch',
    album: 'Night Shift',
    duration: 372,
    cover: '/covers/c7.jpg',
    audio: '/audio/track-1.mp3',
    liked: true,
  },
  {
    id: 't8',
    title: 'Slow Motion',
    artist: 'Harbor Lights',
    album: 'Still Water',
    duration: 428,
    cover: '/covers/c8.jpg',
    audio: '/audio/track-2.mp3',
  },
  {
    id: 't9',
    title: 'Satellite',
    artist: 'Neon Harbor',
    album: 'City Lights',
    duration: 355,
    cover: '/covers/c1.jpg',
    audio: '/audio/track-3.mp3',
  },
  {
    id: 't10',
    title: 'Fade Out',
    artist: 'Luna Wave',
    album: 'Afterglow',
    duration: 401,
    cover: '/covers/c2.jpg',
    audio: '/audio/track-4.mp3',
    liked: true,
  },
  {
    id: 't11',
    title: 'Coral Reef',
    artist: 'Velvet Coast',
    album: 'Sunroom',
    duration: 389,
    cover: '/covers/c3.jpg',
    audio: '/audio/track-5.mp3',
  },
  {
    id: 't12',
    title: 'Horizon Line',
    artist: 'Northbound',
    album: 'Wide Open',
    duration: 412,
    cover: '/covers/c4.jpg',
    audio: '/audio/track-6.mp3',
  },
  {
    id: 't13',
    title: 'Neon Rain',
    artist: 'Circuit Bloom',
    album: 'Analog Hearts',
    duration: 367,
    cover: '/covers/c6.jpg',
    audio: '/audio/track-7.mp3',
  },
  {
    id: 't14',
    title: 'Night Bus',
    artist: 'Astra Finch',
    album: 'Night Shift',
    duration: 445,
    cover: '/covers/c7.jpg',
    audio: '/audio/track-8.mp3',
    liked: true,
  },
  {
    id: 't15',
    title: 'Crystal Static',
    artist: 'Kite Club',
    album: 'Weekend',
    duration: 480,
    cover: '/covers/c5.jpg',
    audio: '/audio/track-10.mp3',
  },
  {
    id: 't16',
    title: 'Ocean Wire',
    artist: 'Harbor Lights',
    album: 'Still Water',
    duration: 510,
    cover: '/covers/c8.jpg',
    audio: '/audio/track-11.mp3',
  },
  {
    id: 't17',
    title: 'Skyline',
    artist: 'Neon Harbor',
    album: 'City Lights',
    duration: 490,
    cover: '/covers/c9.jpg',
    audio: '/audio/track-12.mp3',
  },
  {
    id: 't18',
    title: 'Velvet Noise',
    artist: 'Luna Wave',
    album: 'Afterglow',
    duration: 470,
    cover: '/covers/c10.jpg',
    audio: '/audio/track-13.mp3',
  },
  {
    id: 't19',
    title: 'Sunspill',
    artist: 'Velvet Coast',
    album: 'Sunroom',
    duration: 455,
    cover: '/covers/c11.jpg',
    audio: '/audio/track-14.mp3',
  },
  {
    id: 't20',
    title: 'Open Road',
    artist: 'Northbound',
    album: 'Wide Open',
    duration: 430,
    cover: '/covers/c13.jpg',
    audio: '/audio/track-15.mp3',
  },
  {
    id: 't21',
    title: 'Pulse Check',
    artist: 'Circuit Bloom',
    album: 'Analog Hearts',
    duration: 420,
    cover: '/covers/c15.jpg',
    audio: '/audio/track-16.mp3',
  },
  {
    id: 't22',
    title: 'Late Lights',
    artist: 'Astra Finch',
    album: 'Night Shift',
    duration: 195,
    cover: '/covers/c16.jpg',
    audio: '/audio/pb1.mp3',
    liked: true,
  },
  {
    id: 't23',
    title: 'Warm Tape',
    artist: 'Harbor Lights',
    album: 'Still Water',
    duration: 148,
    cover: '/covers/c12.jpg',
    audio: '/audio/pb2.mp3',
  },
  {
    id: 't24',
    title: 'Weekend Run',
    artist: 'Kite Club',
    album: 'Weekend',
    duration: 170,
    cover: '/covers/c14.jpg',
    audio: '/audio/pb6.mp3',
  },
  {
    id: 't25',
    title: 'Glass Orchard',
    artist: 'Mira Sol',
    album: 'Morning Glass',
    duration: 186,
    cover: '/covers/c17.jpg',
    audio: '/audio/pb1.mp3',
    liked: true,
  },
  {
    id: 't26',
    title: 'Silver Thread',
    artist: 'Mira Sol',
    album: 'Morning Glass',
    duration: 372,
    cover: '/covers/c17.jpg',
    audio: '/audio/track-1.mp3',
  },
  {
    id: 't27',
    title: 'River Mouth',
    artist: 'Jade River',
    album: 'Downstream',
    duration: 142,
    cover: '/covers/c18.jpg',
    audio: '/audio/pb2.mp3',
  },
  {
    id: 't28',
    title: 'Moss & Rain',
    artist: 'Jade River',
    album: 'Downstream',
    duration: 428,
    cover: '/covers/c18.jpg',
    audio: '/audio/track-2.mp3',
    liked: true,
  },
  {
    id: 't29',
    title: 'Night Market',
    artist: 'The Velvet Rios',
    album: 'Neon Bazaar',
    duration: 168,
    cover: '/covers/c19.jpg',
    audio: '/audio/pb6.mp3',
  },
  {
    id: 't30',
    title: 'Lantern Walk',
    artist: 'The Velvet Rios',
    album: 'Neon Bazaar',
    duration: 355,
    cover: '/covers/c19.jpg',
    audio: '/audio/track-3.mp3',
  },
  {
    id: 't31',
    title: 'Orbit Softly',
    artist: 'Nova Quinn',
    album: 'Soft Orbit',
    duration: 155,
    cover: '/covers/c20.jpg',
    audio: '/audio/pb9.mp3',
  },
  {
    id: 't32',
    title: 'Comet Radio',
    artist: 'Nova Quinn',
    album: 'Soft Orbit',
    duration: 401,
    cover: '/covers/c20.jpg',
    audio: '/audio/track-4.mp3',
    liked: true,
  },
  {
    id: 't33',
    title: 'Pine Shadow',
    artist: 'Sage Moreno',
    album: 'Woodsmoke',
    duration: 178,
    cover: '/covers/c21.jpg',
    audio: '/audio/pb10.mp3',
  },
  {
    id: 't34',
    title: 'Cabin Frequency',
    artist: 'Sage Moreno',
    album: 'Woodsmoke',
    duration: 389,
    cover: '/covers/c21.jpg',
    audio: '/audio/track-5.mp3',
  },
  {
    id: 't35',
    title: 'Black Chrome',
    artist: 'Onyx Vale',
    album: 'Iron Bloom',
    duration: 121,
    cover: '/covers/c22.jpg',
    audio: '/audio/pb11.mp3',
  },
  {
    id: 't36',
    title: 'Ash Parade',
    artist: 'Onyx Vale',
    album: 'Iron Bloom',
    duration: 412,
    cover: '/covers/c22.jpg',
    audio: '/audio/track-6.mp3',
  },
  {
    id: 't37',
    title: 'Ember Waltz',
    artist: 'Ember Lane',
    album: 'Red Hour',
    duration: 195,
    cover: '/covers/c23.jpg',
    audio: '/audio/pb1.mp3',
    liked: true,
  },
  {
    id: 't38',
    title: 'Candle Grid',
    artist: 'Ember Lane',
    album: 'Red Hour',
    duration: 367,
    cover: '/covers/c23.jpg',
    audio: '/audio/track-7.mp3',
  },
  {
    id: 't39',
    title: 'Pixel Heart',
    artist: 'Pixel Grove',
    album: 'Arcade Bloom',
    duration: 148,
    cover: '/covers/c24.jpg',
    audio: '/audio/pb2.mp3',
  },
  {
    id: 't40',
    title: 'Save Point',
    artist: 'Pixel Grove',
    album: 'Arcade Bloom',
    duration: 445,
    cover: '/covers/c24.jpg',
    audio: '/audio/track-8.mp3',
  },
]

const azTr = buildAzTrCatalog()

/** Every catalog track maps 1:1 to a local royalty-free MP3 under /audio/songs. */
export const tracks: Track[] = [...demoTracks, ...azTr.tracks].map((t, i) => ({
  ...t,
  audio: `/audio/songs/song-${String(i % 280).padStart(3, '0')}.mp3`,
}))

export const playlists: Playlist[] = [
  {
    id: 'liked',
    name: 'Liked Songs',
    description: 'Songs you liked',
    cover: '/covers/liked.jpg',
    owner: 'You',
    color: '#5038a0',
    trackIds: tracks.filter((t) => t.liked).map((t) => t.id),
  },
  {
    id: 'p1',
    name: 'Daily Mix 1',
    description: 'Neon Harbor, Luna Wave, Velvet Coast and more',
    cover: '/covers/mix1.jpg',
    owner: 'Spotify',
    color: '#1e3264',
    trackIds: ['t1', 't2', 't3', 't9', 't10', 't17', 't18'],
  },
  {
    id: 'p2',
    name: 'Chill Hits',
    description: 'Kick back to the best new and recent chill hits',
    cover: '/covers/chill.jpg',
    owner: 'Spotify',
    color: '#148a08',
    trackIds: ['t2', 't5', 't7', 't8', 't10', 't16', 't23'],
  },
  {
    id: 'p3',
    name: 'Focus Flow',
    description: 'Soft electronic for deep work',
    cover: '/covers/focus.jpg',
    owner: 'Spotify',
    color: '#ba5d07',
    trackIds: ['t4', 't6', 't7', 't12', 't13', 't21'],
  },
  {
    id: 'p4',
    name: 'Evening Drive',
    description: 'Sunset roads and open windows',
    cover: '/covers/drive.jpg',
    owner: 'Spotify',
    color: '#8d67ab',
    trackIds: ['t1', 't3', 't5', 't8', 't11', 't20', 't24'],
  },
  {
    id: 'p5',
    name: 'Discover Weekly',
    description: 'Your weekly mixtape of fresh music',
    cover: '/covers/discover.jpg',
    owner: 'Spotify',
    color: '#0d73ec',
    trackIds: ['t3', 't4', 't6', 't9', 't11', 't15', 't19', 't22'],
  },
  {
    id: 'p6',
    name: 'Release Radar',
    description: 'Catch all the latest music from artists you follow',
    cover: '/covers/radar.jpg',
    owner: 'Spotify',
    color: '#e91429',
    trackIds: ['t5', 't6', 't8', 't14', 't15', 't22', 't24'],
  },
  {
    id: 'p7',
    name: 'New Artist Radio',
    description: 'Mira Sol, Jade River, Nova Quinn and more',
    cover: '/covers/c17.jpg',
    owner: 'Spotify',
    color: '#0d73ec',
    trackIds: ['t25', 't27', 't29', 't31', 't33', 't35', 't37', 't39'],
  },
  {
    id: 'p8',
    name: 'Indie Rising',
    description: 'Fresh voices you’ll love right now',
    cover: '/covers/c23.jpg',
    owner: 'Spotify',
    color: '#8d67ab',
    trackIds: ['t26', 't28', 't30', 't32', 't34', 't36', 't38', 't40'],
  },
  {
    id: 'p-az',
    name: 'Azərbaycan Hitləri',
    description: 'Aygün Kazımova, Röya, Miri Yusif və digərləri',
    cover: '/covers/aygun-kazimova.jpg',
    owner: 'Spotify',
    color: '#0d73ec',
    trackIds: azTr.tracks
      .filter((t) =>
        ['Aygün Kazımova', 'Röya', 'Miri Yusif', 'Nəsimi Məmmədov', 'Alim Qasımov', 'Samira Efendi'].some(
          (n) => t.artist === n || t.artist.includes(n),
        ),
      )
      .map((t) => t.id)
      .slice(0, 20),
  },
  {
    id: 'p-tr',
    name: 'Türkçe Pop',
    description: 'Sezen Aksu, Tarkan, Gülşen, Edis və daha çoxu',
    cover: '/covers/sezen-aksu.jpg',
    owner: 'Spotify',
    color: '#e91429',
    trackIds: azTr.tracks
      .filter((t) =>
        ['Sezen Aksu', 'Tarkan', 'Gülşen', 'Edis', 'Aleyna Tilki', 'Hande Yener', 'Ebru Yaşar', 'Bengü'].some(
          (n) => t.artist === n || t.artist.includes(n),
        ),
      )
      .map((t) => t.id)
      .slice(0, 24),
  },
  {
    id: 'p-tr-rock',
    name: 'Türkçe Rock',
    description: 'Duman, Manga, Şebnem Ferah, Mor ve Ötesi',
    cover: '/covers/duman.jpg',
    owner: 'Spotify',
    color: '#ba5d07',
    trackIds: azTr.tracks
      .filter((t) =>
        ['Duman', 'Manga', 'Şebnem Ferah', 'Mor ve Ötesi', 'Teoman', 'Athena'].some(
          (n) => t.artist === n || t.artist.includes(n),
        ),
      )
      .map((t) => t.id)
      .slice(0, 20),
  },
  // Artist Radio playlists (Sezen Aksu Radio, Aygün Kazımova Radio, …)
  ...azTr.radioPlaylists,
]

const demoAlbums: Album[] = [
  {
    id: 'a1',
    name: 'City Lights',
    artist: 'Neon Harbor',
    cover: '/covers/c1.jpg',
    year: '2024',
    color: '#1e3264',
    trackIds: ['t1', 't9', 't17'],
  },
  {
    id: 'a2',
    name: 'Afterglow',
    artist: 'Luna Wave',
    cover: '/covers/c2.jpg',
    year: '2025',
    color: '#148a08',
    trackIds: ['t2', 't10', 't18'],
  },
  {
    id: 'a3',
    name: 'Sunroom',
    artist: 'Velvet Coast',
    cover: '/covers/c3.jpg',
    year: '2023',
    color: '#8d67ab',
    trackIds: ['t3', 't11', 't19'],
  },
  {
    id: 'a4',
    name: 'Wide Open',
    artist: 'Northbound',
    cover: '/covers/c4.jpg',
    year: '2024',
    color: '#e91429',
    trackIds: ['t4', 't12', 't20'],
  },
  {
    id: 'a5',
    name: 'Analog Hearts',
    artist: 'Circuit Bloom',
    cover: '/covers/c6.jpg',
    year: '2025',
    color: '#ba5d07',
    trackIds: ['t6', 't13', 't21'],
  },
  {
    id: 'a6',
    name: 'Night Shift',
    artist: 'Astra Finch',
    cover: '/covers/c7.jpg',
    year: '2024',
    color: '#5038a0',
    trackIds: ['t7', 't14', 't22'],
  },
  {
    id: 'a7',
    name: 'Weekend',
    artist: 'Kite Club',
    cover: '/covers/c5.jpg',
    year: '2025',
    color: '#0d73ec',
    trackIds: ['t5', 't15', 't24'],
  },
  {
    id: 'a8',
    name: 'Still Water',
    artist: 'Harbor Lights',
    cover: '/covers/c8.jpg',
    year: '2024',
    color: '#1e3264',
    trackIds: ['t8', 't16', 't23'],
  },
  {
    id: 'a9',
    name: 'Morning Glass',
    artist: 'Mira Sol',
    cover: '/covers/c17.jpg',
    year: '2025',
    color: '#0d73ec',
    trackIds: ['t25', 't26'],
  },
  {
    id: 'a10',
    name: 'Downstream',
    artist: 'Jade River',
    cover: '/covers/c18.jpg',
    year: '2024',
    color: '#148a08',
    trackIds: ['t27', 't28'],
  },
  {
    id: 'a11',
    name: 'Neon Bazaar',
    artist: 'The Velvet Rios',
    cover: '/covers/c19.jpg',
    year: '2025',
    color: '#e91429',
    trackIds: ['t29', 't30'],
  },
  {
    id: 'a12',
    name: 'Soft Orbit',
    artist: 'Nova Quinn',
    cover: '/covers/c20.jpg',
    year: '2025',
    color: '#5038a0',
    trackIds: ['t31', 't32'],
  },
  {
    id: 'a13',
    name: 'Woodsmoke',
    artist: 'Sage Moreno',
    cover: '/covers/c21.jpg',
    year: '2024',
    color: '#ba5d07',
    trackIds: ['t33', 't34'],
  },
  {
    id: 'a14',
    name: 'Iron Bloom',
    artist: 'Onyx Vale',
    cover: '/covers/c22.jpg',
    year: '2025',
    color: '#1e3264',
    trackIds: ['t35', 't36'],
  },
  {
    id: 'a15',
    name: 'Red Hour',
    artist: 'Ember Lane',
    cover: '/covers/c23.jpg',
    year: '2024',
    color: '#e8115b',
    trackIds: ['t37', 't38'],
  },
  {
    id: 'a16',
    name: 'Arcade Bloom',
    artist: 'Pixel Grove',
    cover: '/covers/c24.jpg',
    year: '2025',
    color: '#0d73ec',
    trackIds: ['t39', 't40'],
  },
]

export const albums: Album[] = [...demoAlbums, ...azTr.albums]

const demoArtists: Artist[] = [
  {
    id: 'ar1',
    name: 'Neon Harbor',
    cover: '/artists/ar1.jpg',
    followers: '2,145,302',
    color: '#1e3264',
  },
  {
    id: 'ar2',
    name: 'Luna Wave',
    cover: '/artists/ar2.jpg',
    followers: '986,441',
    color: '#148a08',
  },
  {
    id: 'ar3',
    name: 'Velvet Coast',
    cover: '/artists/ar3.jpg',
    followers: '1,522,090',
    color: '#8d67ab',
  },
  {
    id: 'ar4',
    name: 'Northbound',
    cover: '/artists/ar4.jpg',
    followers: '743,218',
    color: '#e91429',
  },
  {
    id: 'ar5',
    name: 'Circuit Bloom',
    cover: '/artists/ar5.jpg',
    followers: '412,887',
    color: '#ba5d07',
  },
  {
    id: 'ar6',
    name: 'Astra Finch',
    cover: '/artists/ar6.jpg',
    followers: '1,104,556',
    color: '#5038a0',
  },
  {
    id: 'ar7',
    name: 'Kite Club',
    cover: '/artists/ar7.jpg',
    followers: '628,440',
    color: '#0d73ec',
  },
  {
    id: 'ar8',
    name: 'Harbor Lights',
    cover: '/artists/ar8.jpg',
    followers: '891,203',
    color: '#1e3264',
  },
  {
    id: 'ar9',
    name: 'Mira Sol',
    cover: '/artists/ar9.jpg',
    followers: '534,812',
    color: '#0d73ec',
  },
  {
    id: 'ar10',
    name: 'Jade River',
    cover: '/artists/ar10.jpg',
    followers: '712,440',
    color: '#148a08',
  },
  {
    id: 'ar11',
    name: 'The Velvet Rios',
    cover: '/artists/ar11.jpg',
    followers: '1,088,221',
    color: '#e91429',
  },
  {
    id: 'ar12',
    name: 'Nova Quinn',
    cover: '/artists/ar12.jpg',
    followers: '956,033',
    color: '#5038a0',
  },
  {
    id: 'ar13',
    name: 'Sage Moreno',
    cover: '/artists/ar13.jpg',
    followers: '389,774',
    color: '#ba5d07',
  },
  {
    id: 'ar14',
    name: 'Onyx Vale',
    cover: '/artists/ar14.jpg',
    followers: '621,905',
    color: '#1e3264',
  },
  {
    id: 'ar15',
    name: 'Ember Lane',
    cover: '/artists/ar15.jpg',
    followers: '844,160',
    color: '#e8115b',
  },
  {
    id: 'ar16',
    name: 'Pixel Grove',
    cover: '/artists/ar16.jpg',
    followers: '477,291',
    color: '#0d73ec',
  },
]

export const artists: Artist[] = [...demoArtists, ...azTr.artists]

export const recentlyPlayed = ['p1', 'liked', 'p-az', 'p-tr', 'p2', 'a1']

export function normalizeSearch(text: string) {
  return text
    .toLocaleLowerCase('tr-TR')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ə/g, 'e')
    .replace(/ı/g, 'i')
    .replace(/İ/g, 'i')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .trim()
}

export function matchesQuery(haystack: string, query: string) {
  if (!query) return false
  const h = normalizeSearch(haystack)
  const q = normalizeSearch(query)
  if (h.includes(q)) return true
  const parts = q.split(/\s+/).filter(Boolean)
  return parts.length > 1 ? parts.every((p) => h.includes(p)) : false
}

function readAdminOverlay() {
  try {
    const hiddenRaw = localStorage.getItem('spotify:adminHiddenTrackIds')
    const adminRaw = localStorage.getItem('spotify:adminTracks')
    const hidden: string[] = hiddenRaw ? (JSON.parse(hiddenRaw) as string[]) : []
    const adminTracks: Track[] = adminRaw ? (JSON.parse(adminRaw) as Track[]) : []
    return { hidden: new Set(hidden), adminTracks }
  } catch {
    return { hidden: new Set<string>(), adminTracks: [] as Track[] }
  }
}

/** Catalog + admin-added tracks, minus admin-hidden ids. */
export function getVisibleTracks(): Track[] {
  const { hidden, adminTracks } = readAdminOverlay()
  return [...adminTracks, ...tracks].filter((t) => !hidden.has(t.id))
}

export function getTrack(id: string) {
  const { hidden, adminTracks } = readAdminOverlay()
  if (hidden.has(id)) return undefined
  return adminTracks.find((t) => t.id === id) || tracks.find((t) => t.id === id)
}

export function getPlaylist(id: string) {
  return playlists.find((p) => p.id === id)
}

export function getAlbum(id: string) {
  return albums.find((a) => a.id === id)
}

export function getArtist(id: string) {
  return artists.find((a) => a.id === id)
}

/** Resolve artist when track.artist may list multiple names (duets). */
export function findArtistByTrackArtist(artistField: string) {
  const exact = artists.find((a) => a.name === artistField)
  if (exact) return exact
  return artists.find((a) => artistField.includes(a.name))
}

export function getArtistTracks(artistName: string) {
  return tracks.filter(
    (t) => t.artist === artistName || t.artist.includes(artistName),
  )
}

export function getTracksByIds(ids: string[]) {
  return ids.map(getTrack).filter(Boolean) as Track[]
}

export function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00'
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}
