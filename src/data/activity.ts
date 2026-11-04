export type FriendListen = {
  id: string
  name: string
  avatar: string
  track: string
  artist: string
  context: string
  minutesAgo: number
}

export type NewsItem = {
  id: string
  title: string
  body: string
  time: string
  cover: string
  kind: 'music' | 'podcast' | 'concert' | 'update'
}

export const friendActivity: FriendListen[] = [
  {
    id: 'f1',
    name: 'Aysel M.',
    avatar: '/artists/sezen-aksu.jpg',
    track: 'Gülümse',
    artist: 'Sezen Aksu',
    context: 'Album · Gülümse',
    minutesAgo: 2,
  },
  {
    id: 'f2',
    name: 'Elvin R.',
    avatar: '/artists/miri-yusif.jpg',
    track: 'Adı Başına',
    artist: 'Miri Yusif',
    context: 'Playlist · Azərbaycan Hitləri',
    minutesAgo: 8,
  },
  {
    id: 'f3',
    name: 'Nigar K.',
    avatar: '/artists/tarkan.jpg',
    track: 'Şımarık',
    artist: 'Tarkan',
    context: 'Radio · Tarkan',
    minutesAgo: 15,
  },
  {
    id: 'f4',
    name: 'Orkhan B.',
    avatar: '/artists/duman.jpg',
    track: 'Senden Daha Güzel',
    artist: 'Duman',
    context: 'Album · Belki Alınmaz',
    minutesAgo: 32,
  },
  {
    id: 'f5',
    name: 'Leyla S.',
    avatar: '/artists/roya.jpg',
    track: 'Bivəfa',
    artist: 'Röya',
    context: 'Playlist · Liked Songs',
    minutesAgo: 48,
  },
  {
    id: 'f6',
    name: 'Kamran T.',
    avatar: '/artists/manga.jpg',
    track: 'We Could Be The Same',
    artist: 'Manga',
    context: 'Discover Weekly',
    minutesAgo: 61,
  },
]

export const whatsNew: NewsItem[] = [
  {
    id: 'n1',
    title: 'New music Friday · AZ & TR',
    body: 'Fresh drops from Tarkan Radio, Röya and Sezen Aksu mixes.',
    time: '2h',
    cover: '/covers/c1.jpg',
    kind: 'music',
  },
  {
    id: 'n2',
    title: 'Your Daily Mix updated',
    body: 'Daily Mix 1 now features more Neon Harbor and Luna Wave.',
    time: '5h',
    cover: '/covers/c2.jpg',
    kind: 'music',
  },
  {
    id: 'n3',
    title: 'Podcasts to try',
    body: 'Browse podcasts from Your Library banners — new episodes weekly.',
    time: '1d',
    cover: '/covers/c5.jpg',
    kind: 'podcast',
  },
  {
    id: 'n4',
    title: 'Concert near you',
    body: 'Artists you like are touring — check Release Radar for updates.',
    time: '2d',
    cover: '/covers/c7.jpg',
    kind: 'concert',
  },
  {
    id: 'n5',
    title: 'Web Player update',
    body: 'Lyrics, devices, friend activity and fullscreen are ready.',
    time: '3d',
    cover: '/covers/c9.jpg',
    kind: 'update',
  },
]

export type PlayerDevice = {
  id: string
  name: string
  type: 'Computer' | 'Smartphone' | 'Speaker' | 'TV'
  active: boolean
  volume: number
}

export const defaultDevices: PlayerDevice[] = [
  { id: 'this-computer', name: 'This computer', type: 'Computer', active: true, volume: 70 },
  { id: 'web-player', name: 'Web Player', type: 'Computer', active: false, volume: 70 },
  { id: 'phone', name: 'iPhone', type: 'Smartphone', active: false, volume: 55 },
  { id: 'speaker', name: 'Living room speaker', type: 'Speaker', active: false, volume: 40 },
]
