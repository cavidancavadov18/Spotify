const friendActivity = [
  {
    id: "f1",
    name: "Aysel M.",
    avatar: "/artists/sezen-aksu.jpg",
    track: "G\xFCl\xFCmse",
    artist: "Sezen Aksu",
    context: "Album \xB7 G\xFCl\xFCmse",
    minutesAgo: 2
  },
  {
    id: "f2",
    name: "Elvin R.",
    avatar: "/artists/miri-yusif.jpg",
    track: "Ad\u0131 Ba\u015F\u0131na",
    artist: "Miri Yusif",
    context: "Playlist \xB7 Az\u0259rbaycan Hitl\u0259ri",
    minutesAgo: 8
  },
  {
    id: "f3",
    name: "Nigar K.",
    avatar: "/artists/tarkan.jpg",
    track: "\u015E\u0131mar\u0131k",
    artist: "Tarkan",
    context: "Radio \xB7 Tarkan",
    minutesAgo: 15
  },
  {
    id: "f4",
    name: "Orkhan B.",
    avatar: "/artists/duman.jpg",
    track: "Senden Daha G\xFCzel",
    artist: "Duman",
    context: "Album \xB7 Belki Al\u0131nmaz",
    minutesAgo: 32
  },
  {
    id: "f5",
    name: "Leyla S.",
    avatar: "/artists/roya.jpg",
    track: "Biv\u0259fa",
    artist: "R\xF6ya",
    context: "Playlist \xB7 Liked Songs",
    minutesAgo: 48
  },
  {
    id: "f6",
    name: "Kamran T.",
    avatar: "/artists/manga.jpg",
    track: "We Could Be The Same",
    artist: "Manga",
    context: "Discover Weekly",
    minutesAgo: 61
  }
];
const whatsNew = [
  {
    id: "n1",
    title: "New music Friday \xB7 AZ & TR",
    body: "Fresh drops from Tarkan Radio, R\xF6ya and Sezen Aksu mixes.",
    time: "2h",
    cover: "/covers/c1.jpg",
    kind: "music"
  },
  {
    id: "n2",
    title: "Your Daily Mix updated",
    body: "Daily Mix 1 now features more Neon Harbor and Luna Wave.",
    time: "5h",
    cover: "/covers/c2.jpg",
    kind: "music"
  },
  {
    id: "n3",
    title: "Podcasts to try",
    body: "Browse podcasts from Your Library banners \u2014 new episodes weekly.",
    time: "1d",
    cover: "/covers/c5.jpg",
    kind: "podcast"
  },
  {
    id: "n4",
    title: "Concert near you",
    body: "Artists you like are touring \u2014 check Release Radar for updates.",
    time: "2d",
    cover: "/covers/c7.jpg",
    kind: "concert"
  },
  {
    id: "n5",
    title: "Web Player update",
    body: "Lyrics, devices, friend activity and fullscreen are ready.",
    time: "3d",
    cover: "/covers/c9.jpg",
    kind: "update"
  }
];
const defaultDevices = [
  { id: "this-computer", name: "This computer", type: "Computer", active: true, volume: 70 },
  { id: "web-player", name: "Web Player", type: "Computer", active: false, volume: 70 },
  { id: "phone", name: "iPhone", type: "Smartphone", active: false, volume: 55 },
  { id: "speaker", name: "Living room speaker", type: "Speaker", active: false, volume: 40 }
];
export {
  defaultDevices,
  friendActivity,
  whatsNew
};
