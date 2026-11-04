import type { Album, Artist, Playlist, Track } from './music'

/** Unique per-song royalty-free files under /audio/songs (copied from licensed stems). */
function songAudio(index: number) {
  const n = ((index % 280) + 280) % 280
  return `/audio/songs/song-${String(n).padStart(3, '0')}.mp3`
}

const COLORS = [
  '#1e3264',
  '#148a08',
  '#8d67ab',
  '#e91429',
  '#ba5d07',
  '#5038a0',
  '#0d73ec',
  '#e8115b',
  '#dc148c',
  '#006450',
  '#b49bc8',
  '#e13300',
]

type SongSeed = {
  title: string
  album: string
  /** Display artists when different from primary (e.g. duet) */
  artists?: string
  duration?: number
}

type ArtistSeed = {
  name: string
  slug: string
  country: 'az' | 'tr'
  followers: string
  songs: SongSeed[]
  radioWith?: string
}

/** Metadata matched 1:1 to real artist discography names (demo audio only). */
const SEEDS: ArtistSeed[] = [
  {
    name: 'Aygün Kazımova',
    slug: 'aygun-kazimova',
    country: 'az',
    followers: '1,240,500',
    radioWith: 'Nəsimi Məmmədov, Röya, Zülfiyyə Xanbabayeva and more',
    songs: [
      {
        title: 'Məsafələr',
        album: 'Məsafələr',
        artists: 'Aygün Kazımova, Nəsimi Məmmədov',
        duration: 209,
      },
      { title: 'Qara Gözlüm', album: 'Seçilmişlər', duration: 231 },
      { title: 'Yenə Tək', album: 'Seçilmişlər', duration: 218 },
      { title: 'Coffee from Colombia', album: 'Coffee from Colombia', duration: 195 },
      { title: 'Petronum', album: 'Petronum', duration: 202 },
    ],
  },
  {
    name: 'Röya',
    slug: 'roya',
    country: 'az',
    followers: '980,220',
    radioWith: 'Aygün Kazımova, Manana, Cleopatra and more',
    songs: [
      { title: 'Sənə Ehtiyacım Var', album: 'Sənə Ehtiyacım Var', duration: 224 },
      { title: 'Bivəfa', album: 'Bivəfa', duration: 241 },
      { title: 'Bivəfa 2', album: 'Bivəfa 2', duration: 236 },
      { title: 'Dəyməz', album: 'Best of Röya', duration: 198 },
      { title: 'Unutmaq Olmur', album: 'Best of Röya', duration: 215 },
    ],
  },
  {
    name: 'Brilliant Dadaşova',
    slug: 'brilliant-dadasova',
    country: 'az',
    followers: '420,110',
    songs: [
      { title: 'Bayatı-Şiraz', album: 'Klassikalar', duration: 312 },
      { title: 'Sarı Gəlin', album: 'Klassikalar', duration: 278 },
      { title: 'Gəl Ey Səhər', album: 'Klassikalar', duration: 245 },
      { title: 'Qızıl Gül', album: 'Klassikalar', duration: 221 },
    ],
  },
  {
    name: 'Zülfiyyə Xanbabayeva',
    slug: 'zulfiyye-xanbabayeva',
    country: 'az',
    followers: '510,880',
    songs: [
      { title: 'Bakı Gecələri', album: 'Xatirələr', duration: 255 },
      { title: 'Sənə Qurban', album: 'Xatirələr', duration: 238 },
      { title: 'Gözəl Bakım', album: 'Xatirələr', duration: 226 },
      { title: 'Vətən', album: 'Xatirələr', duration: 249 },
    ],
  },
  {
    name: 'Flora Kərimova',
    slug: 'flora-kerimova',
    country: 'az',
    followers: '305,400',
    songs: [
      { title: 'Bəxtiyar', album: 'Nəğmələr', duration: 267 },
      { title: 'Gülüstan', album: 'Nəğmələr', duration: 241 },
      { title: 'Sevgilim', album: 'Nəğmələr', duration: 228 },
      { title: 'Bahar', album: 'Nəğmələr', duration: 214 },
    ],
  },
  {
    name: 'Nəsimi Məmmədov',
    slug: 'nesimi-memmedov',
    country: 'az',
    followers: '640,050',
    radioWith: 'Aygün Kazımova, Faiq Ağayev and more',
    songs: [
      {
        title: 'Məsafələr',
        album: 'Məsafələr',
        artists: 'Aygün Kazımova, Nəsimi Məmmədov',
        duration: 209,
      },
      { title: 'Yalnız Sən', album: 'Duetlər', duration: 233 },
      { title: 'Gecə', album: 'Duetlər', duration: 218 },
      { title: 'Ayrılıq', album: 'Duetlər', duration: 247 },
    ],
  },
  {
    name: 'Miri Yusif',
    slug: 'miri-yusif',
    country: 'az',
    followers: '1,105,300',
    songs: [
      { title: 'Adı Başına', album: 'Hip-Hop AZ', duration: 198 },
      { title: 'Popuri', album: 'Hip-Hop AZ', duration: 212 },
      { title: 'Yollar', album: 'Hip-Hop AZ', duration: 205 },
      { title: 'Bakı', album: 'Hip-Hop AZ', duration: 221 },
    ],
  },
  {
    name: 'Elnur Hüseynov',
    slug: 'elnur-huseynov',
    country: 'az',
    followers: '390,700',
    songs: [
      { title: 'Day After Day', album: 'Eurovision Moments', duration: 183 },
      { title: 'Clear', album: 'Eurovision Moments', duration: 176 },
      { title: 'Alive', album: 'Eurovision Moments', duration: 191 },
      { title: 'Heart', album: 'Eurovision Moments', duration: 188 },
    ],
  },
  {
    name: 'Alim Qasımov',
    slug: 'alim-qasimov',
    country: 'az',
    followers: '720,900',
    songs: [
      { title: 'Bayatı-Kürd', album: 'Muğam', duration: 420 },
      { title: 'Şur', album: 'Muğam', duration: 385 },
      { title: 'Segah', album: 'Muğam', duration: 401 },
      { title: 'Çahargah', album: 'Muğam', duration: 367 },
    ],
  },
  {
    name: 'Qara 17',
    slug: 'qara-17',
    country: 'az',
    followers: '455,200',
    songs: [
      { title: '17', album: 'Küçə', duration: 201 },
      { title: 'Gece', album: 'Küçə', duration: 194 },
      { title: 'Şəhər', album: 'Küçə', duration: 208 },
      { title: 'Yol', album: 'Küçə', duration: 215 },
    ],
  },
  {
    name: 'Cleopatra',
    slug: 'cleopatra',
    country: 'az',
    followers: '280,600',
    songs: [
      { title: 'Sevgi', album: 'Pop Hits', duration: 198 },
      { title: 'Gəl Yanıma', album: 'Pop Hits', duration: 205 },
      { title: 'Yalan', album: 'Pop Hits', duration: 191 },
      { title: 'Xəyal', album: 'Pop Hits', duration: 212 },
    ],
  },
  {
    name: 'Manana',
    slug: 'manana',
    country: 'az',
    followers: '265,100',
    songs: [
      { title: 'Səni Sevirəm', album: 'Sevgi Nəğmələri', duration: 223 },
      { title: 'Gözəl Gün', album: 'Sevgi Nəğmələri', duration: 209 },
      { title: 'Xatirə', album: 'Sevgi Nəğmələri', duration: 231 },
      { title: 'Uzaq', album: 'Sevgi Nəğmələri', duration: 217 },
    ],
  },
  {
    name: 'Aygün Beyler',
    slug: 'aygun-beyler',
    country: 'az',
    followers: '198,450',
    songs: [
      { title: 'Dalğa', album: 'Yeni Dalğa', duration: 204 },
      { title: 'Səhər', album: 'Yeni Dalğa', duration: 196 },
      { title: 'Külək', album: 'Yeni Dalğa', duration: 211 },
      { title: 'İşıq', album: 'Yeni Dalğa', duration: 188 },
    ],
  },
  {
    name: 'Tunzalə Ağayeva',
    slug: 'tunzale',
    country: 'az',
    followers: '350,800',
    radioWith: 'Röya, Manana, Aygün Kazımova and more',
    songs: [
      { title: 'Gözləyirəm', album: 'Tünzalə', duration: 228 },
      { title: 'Sənsiz Günlər', album: 'Tünzalə', duration: 241 },
      { title: 'Yuxu', album: 'Tünzalə', duration: 215 },
      { title: 'Geri Dön', album: 'Tünzalə', duration: 233 },
    ],
  },
  {
    name: 'Elşad Xose',
    slug: 'elsad-xose',
    country: 'az',
    followers: '410,220',
    songs: [
      { title: 'Rəqs Et', album: 'Rəqs', duration: 192 },
      { title: 'Şənlik', album: 'Rəqs', duration: 186 },
      { title: 'Gecə Klubu', album: 'Rəqs', duration: 201 },
      { title: 'Tempo', album: 'Rəqs', duration: 178 },
    ],
  },
  {
    name: 'Sabina Babayeva',
    slug: 'sabina-babayeva',
    country: 'az',
    followers: '275,900',
    songs: [
      { title: 'When The Music Dies', album: 'When The Music Dies', duration: 183 },
      { title: 'Love', album: 'When The Music Dies', duration: 176 },
      { title: 'Stars', album: 'When The Music Dies', duration: 191 },
      { title: 'Home', album: 'When The Music Dies', duration: 188 },
    ],
  },
  {
    name: 'Dilara Kazimova',
    slug: 'dilara-kazimova',
    country: 'az',
    followers: '190,300',
    songs: [
      { title: 'Start A Fire', album: 'Start A Fire', duration: 179 },
      { title: 'Flame', album: 'Start A Fire', duration: 185 },
      { title: 'Night', album: 'Start A Fire', duration: 192 },
      { title: 'Hope', album: 'Start A Fire', duration: 174 },
    ],
  },
  {
    name: 'Chingiz',
    slug: 'chingiz',
    country: 'az',
    followers: '520,700',
    songs: [
      { title: 'Truth', album: 'Truth', duration: 181 },
      { title: 'Dream', album: 'Truth', duration: 195 },
      { title: 'Light', album: 'Truth', duration: 188 },
      { title: 'Run', album: 'Truth', duration: 172 },
    ],
  },
  {
    name: 'Samira Efendi',
    slug: 'samira-efendi',
    country: 'az',
    followers: '610,400',
    songs: [
      { title: 'Cleopatra', album: 'Cleopatra', duration: 178 },
      { title: 'Queen', album: 'Cleopatra', duration: 186 },
      { title: 'Dance', album: 'Cleopatra', duration: 192 },
      { title: 'Gold', album: 'Cleopatra', duration: 201 },
    ],
  },
  {
    name: 'Faiq Ağayev',
    slug: 'faiq-agayev',
    country: 'az',
    followers: '330,150',
    songs: [
      { title: 'Gəl', album: 'Seçmə', duration: 224 },
      { title: 'Sevgi', album: 'Seçmə', duration: 218 },
      { title: 'Yollar', album: 'Seçmə', duration: 231 },
      { title: 'Xatirələr', album: 'Seçmə', duration: 245 },
    ],
  },
  {
    name: 'Sezen Aksu',
    slug: 'sezen-aksu',
    country: 'tr',
    followers: '4,850,000',
    radioWith: 'Gülden Karaböcek, Kamuran Akkor, Bengü and more',
    songs: [
      { title: 'Aşktan Ne Haber', album: 'Yaz Bitmeden', duration: 237 },
      { title: 'Gülümse', album: 'Gülümse', duration: 268 },
      { title: 'Firuze', album: 'Firuze', duration: 251 },
      { title: 'Hadi Bakalım', album: 'Gülümse', duration: 224 },
      { title: 'Şarkı Söylemek Lazım', album: 'Seçilmişler', duration: 243 },
      { title: 'Git', album: 'Seçilmişler', duration: 256 },
    ],
  },
  {
    name: 'Ebru Yaşar',
    slug: 'ebru-yasar',
    country: 'tr',
    followers: '2,100,000',
    radioWith: 'Sezen Aksu, Bengü, Gülşen and more',
    songs: [
      { title: 'Ben Ne Yangınlar Gördüm', album: 'Haddinden Fazla', duration: 271 },
      { title: 'Haddinden Fazla', album: 'Haddinden Fazla', duration: 248 },
      { title: 'Yeminim Var', album: 'Yeminim Var', duration: 235 },
      { title: 'Sensiz Olmaz', album: 'Seçilmişler', duration: 229 },
    ],
  },
  {
    name: 'Bengü',
    slug: 'bengu',
    country: 'tr',
    followers: '1,850,000',
    songs: [
      { title: 'Saygımdan', album: 'İkinci Hal', duration: 271 },
      { title: 'İkinci Hal', album: 'İkinci Hal', duration: 244 },
      { title: 'Kuzum', album: 'Kuzum', duration: 218 },
      { title: 'Feveran', album: 'Feveran', duration: 226 },
    ],
  },
  {
    name: 'Gülden Karaböcek',
    slug: 'gulden-karabocek',
    country: 'tr',
    followers: '890,000',
    songs: [
      { title: 'Söyleyin', album: 'Klasikler', duration: 285 },
      { title: 'Dilek Taşı', album: 'Klasikler', duration: 262 },
      { title: 'Samanyolu', album: 'Klasikler', duration: 248 },
      { title: 'Ayrılık', album: 'Klasikler', duration: 271 },
    ],
  },
  {
    name: 'Tarkan',
    slug: 'tarkan',
    country: 'tr',
    followers: '5,210,000',
    radioWith: 'Mustafa Sandal, Kenan Doğulu, Hadise and more',
    songs: [
      { title: 'Şımarık', album: 'Ölürüm Sana', duration: 236 },
      { title: 'Kuzu Kuzu', album: 'Karma', duration: 228 },
      { title: 'Dudu', album: 'Dudu', duration: 241 },
      { title: 'Ölürüm Sana', album: 'Ölürüm Sana', duration: 255 },
      { title: 'Bounce', album: 'Metamorfoz', duration: 219 },
    ],
  },
  {
    name: 'Sertab Erener',
    slug: 'sertab-erener',
    country: 'tr',
    followers: '1,420,000',
    songs: [
      { title: 'Everyway That I Can', album: 'Everyway That I Can', duration: 178 },
      { title: 'Ask', album: 'Ask', duration: 245 },
      { title: 'Zor Kadin', album: 'Zor Kadin', duration: 231 },
      { title: 'Bu Gece', album: 'Seçilmişler', duration: 218 },
    ],
  },
  {
    name: 'Ajda Pekkan',
    slug: 'ajda-pekkan',
    country: 'tr',
    followers: '1,100,000',
    songs: [
      { title: 'Pet’r Oil', album: 'Süperstar', duration: 245 },
      { title: 'Bambaşka', album: 'Süperstar', duration: 228 },
      { title: 'Oyalama Beni', album: 'Süperstar', duration: 236 },
      { title: 'Kimler Geldi Kimler Geçti', album: 'Süperstar', duration: 251 },
    ],
  },
  {
    name: 'Barış Manço',
    slug: 'baris-manco',
    country: 'tr',
    followers: '2,300,000',
    songs: [
      { title: 'Gülpembe', album: '24 Ayar Manço', duration: 312 },
      { title: 'Alla Beni Pulla Beni', album: 'Sözüm Meclisten Dışarı', duration: 278 },
      { title: 'Dağlar Dağlar', album: 'Klasikler', duration: 265 },
      { title: 'Aynalı Kemer', album: 'Klasikler', duration: 241 },
    ],
  },
  {
    name: 'MFÖ',
    slug: 'mfo',
    country: 'tr',
    followers: '980,000',
    songs: [
      { title: 'Ele Güne Karşı', album: 'Ele Güne Karşı', duration: 298 },
      { title: 'Peki Peki Anladık', album: 'Peki Peki Anladık', duration: 256 },
      { title: 'Buselik', album: 'Seçilmişler', duration: 231 },
      { title: 'Sarı Laleler', album: 'Seçilmişler', duration: 245 },
    ],
  },
  {
    name: 'Duman',
    slug: 'duman',
    country: 'tr',
    followers: '2,450,000',
    songs: [
      { title: 'Seni Kendime Sakladım', album: 'Belki Alınmaz', duration: 268 },
      { title: 'Her Şeyi Yak', album: 'Belki Alınmaz', duration: 251 },
      { title: 'Belki Alınmaz', album: 'Belki Alınmaz', duration: 244 },
      { title: 'Ah', album: 'Darmaduman', duration: 229 },
    ],
  },
  {
    name: 'Manga',
    slug: 'manga',
    country: 'tr',
    followers: '1,650,000',
    songs: [
      { title: 'We Could Be The Same', album: 'We Could Be The Same', duration: 191 },
      { title: 'Dursun Zaman', album: 'Şehr-i Hüzün', duration: 248 },
      { title: 'Cevapsız Sorular', album: 'Şehr-i Hüzün', duration: 236 },
      { title: 'Fly To Stay Alive', album: 'e-akustik', duration: 224 },
    ],
  },
  {
    name: 'Hadise',
    slug: 'hadise',
    country: 'tr',
    followers: '2,800,000',
    songs: [
      { title: 'Düm Tek Tek', album: 'Fast Life', duration: 178 },
      { title: 'Sıfır Tolerans', album: 'Sıfır Tolerans', duration: 205 },
      { title: 'Aşk Kaç Beden Giyer', album: 'Aşk Kaç Beden Giyer', duration: 218 },
      { title: 'My Body', album: 'Fast Life', duration: 192 },
    ],
  },
  {
    name: 'Hande Yener',
    slug: 'hande-yener',
    country: 'tr',
    followers: '2,600,000',
    songs: [
      { title: 'Kibir', album: 'Kibir', duration: 224 },
      { title: 'Aşkın Ateşi', album: 'Aşk Kadın Ruhundan Anlamıyor', duration: 241 },
      { title: 'Yalanın Batsın', album: 'Seçilmişler', duration: 218 },
      { title: 'Romeo', album: 'Romeo', duration: 231 },
    ],
  },
  {
    name: 'Mustafa Sandal',
    slug: 'mustafa-sandal',
    country: 'tr',
    followers: '1,900,000',
    songs: [
      { title: 'Aya Benzer', album: 'Aya Benzer', duration: 248 },
      { title: 'Araba', album: 'Araba', duration: 236 },
      { title: 'İsyankar', album: 'İsyankar', duration: 228 },
      { title: 'Detay', album: 'Detay', duration: 215 },
    ],
  },
  {
    name: 'Kenan Doğulu',
    slug: 'kenan-dogulu',
    country: 'tr',
    followers: '1,750,000',
    songs: [
      { title: 'Çakkıdı', album: 'Festival', duration: 218 },
      { title: 'Aşkım Aşkım', album: 'Ex Aşkım', duration: 231 },
      { title: 'Doktor', album: 'Festival', duration: 205 },
      { title: 'Shake It Up Şekerim', album: 'Ex Aşkım', duration: 224 },
    ],
  },
  {
    name: 'İbrahim Tatlıses',
    slug: 'ibrahim-tatlises',
    country: 'tr',
    followers: '3,200,000',
    songs: [
      { title: 'Mavi Mavi', album: 'Mavi Mavi', duration: 298 },
      { title: 'Leylim Ley', album: 'Klasikler', duration: 312 },
      { title: 'Selam Olsun', album: 'Klasikler', duration: 285 },
      { title: 'Mutlu Ol Yeter', album: 'Klasikler', duration: 271 },
    ],
  },
  {
    name: 'Orhan Gencebay',
    slug: 'orhan-gencebay',
    country: 'tr',
    followers: '1,400,000',
    songs: [
      { title: 'Batsın Bu Dünya', album: 'Klasikler', duration: 356 },
      { title: 'Bir Teselli Ver', album: 'Klasikler', duration: 328 },
      { title: 'Haberin Var mı?', album: 'Klasikler', duration: 301 },
      { title: 'Yarabbim', album: 'Klasikler', duration: 315 },
    ],
  },
  {
    name: 'Zeki Müren',
    slug: 'zeki-muren',
    country: 'tr',
    followers: '1,200,000',
    songs: [
      { title: 'Ah Bu Şarkıların Gözü Kör Olsun', album: 'Klasikler', duration: 345 },
      { title: 'Şimdi Uzaklardasın', album: 'Klasikler', duration: 298 },
      { title: 'Manolyam', album: 'Klasikler', duration: 276 },
      { title: 'Bir Demet Yasemen', album: 'Klasikler', duration: 291 },
    ],
  },
  {
    name: 'Gülşen',
    slug: 'gulsen',
    country: 'tr',
    followers: '2,900,000',
    songs: [
      { title: 'Bir İhtimal Daha Var', album: 'Bangır Bangır', duration: 218 },
      { title: 'Bangır Bangır', album: 'Bangır Bangır', duration: 205 },
      { title: 'Yatcaz Kalkcaz Ordayım', album: 'Önsöz', duration: 224 },
      { title: 'Dan Dan', album: 'Önsöz', duration: 198 },
    ],
  },
  {
    name: 'Aleyna Tilki',
    slug: 'aleyna-tilki',
    country: 'tr',
    followers: '3,100,000',
    songs: [
      { title: 'Cevapsız Çınlama', album: 'Cevapsız Çınlama', duration: 201 },
      { title: 'Sen Olsan Bari', album: 'Sen Olsan Bari', duration: 188 },
      { title: 'Yalnız Çiçek', album: 'Yalnız Çiçek', duration: 195 },
      { title: 'Dipsiz Kuyum', album: 'Dipsiz Kuyum', duration: 212 },
    ],
  },
  {
    name: 'Edis',
    slug: 'edis',
    country: 'tr',
    followers: '2,200,000',
    songs: [
      { title: 'Buz Kırağı', album: 'Buz Kırağı', duration: 198 },
      { title: 'Benim Ol', album: 'Benim Ol', duration: 205 },
      { title: 'Romeo', album: 'Romeo', duration: 191 },
      { title: 'Çok Çok', album: 'Çok Çok', duration: 184 },
    ],
  },
  {
    name: 'Mabel Matiz',
    slug: 'mabel-matiz',
    country: 'tr',
    followers: '1,550,000',
    songs: [
      { title: 'Öyle Kolaysa', album: 'Öyle Kolaysa', duration: 231 },
      { title: 'Fırtınam', album: 'Fırtınam', duration: 218 },
      { title: 'Ahu', album: 'Ahu', duration: 245 },
      { title: 'Gel', album: 'Maya', duration: 226 },
    ],
  },
  {
    name: 'Sagopa Kajmer',
    slug: 'sagopa-kajmer',
    country: 'tr',
    followers: '2,050,000',
    songs: [
      { title: 'Bir Pesimistin Gözyaşları', album: 'Bir Pesimistin Gözyaşları', duration: 268 },
      { title: 'Disstortion EP', album: 'Disstortion', duration: 241 },
      { title: 'Galvaniz', album: 'Galvaniz', duration: 255 },
      { title: 'İkimiz', album: 'İkimiz', duration: 231 },
    ],
  },
  {
    name: 'Ceza',
    slug: 'ceza',
    country: 'tr',
    followers: '2,400,000',
    songs: [
      { title: 'Holocaust', album: 'Rapstar', duration: 248 },
      { title: 'Suspus', album: 'Suspus', duration: 236 },
      { title: 'Nereden Nereye', album: 'Yerli Plaka', duration: 221 },
      { title: 'Medcezir', album: 'Medcezir', duration: 255 },
    ],
  },
  {
    name: 'Şebnem Ferah',
    slug: 'sebnem-ferah',
    country: 'tr',
    followers: '1,800,000',
    songs: [
      { title: 'Vazgeçtim Dünyadan', album: 'Vazgeçtim Dünyadan', duration: 278 },
      { title: 'Bu Aşk Fazla Sana', album: 'Can Kırıkları', duration: 251 },
      { title: 'Sil Baştan', album: 'Sil Baştan', duration: 244 },
      { title: 'Yağmurlar', album: 'Kadın', duration: 268 },
    ],
  },
  {
    name: 'Teoman',
    slug: 'teoman',
    country: 'tr',
    followers: '1,650,000',
    songs: [
      { title: 'Paramparça', album: 'Paramparça', duration: 256 },
      { title: 'İstanbul’da Sonbahar', album: 'İstanbul’da Sonbahar', duration: 241 },
      { title: 'Senden Önce Senden Sonra', album: 'Seçilmişler', duration: 228 },
      { title: 'Rüzgar Gülü', album: 'Rüzgar Gülü', duration: 235 },
    ],
  },
  {
    name: 'Athena',
    slug: 'athena',
    country: 'tr',
    followers: '1,100,000',
    songs: [
      { title: 'Holocaust', album: 'Holocaust', duration: 218 },
      { title: 'One Last Breath', album: 'One Last Breath', duration: 205 },
      { title: 'Tam Zamanı Şimdi', album: 'Tam Zamanı Şimdi', duration: 224 },
      { title: 'Yaşamak Var Ya', album: 'Seçilmişler', duration: 231 },
    ],
  },
  {
    name: 'Mor ve Ötesi',
    slug: 'mor-ve-otesi',
    country: 'tr',
    followers: '1,350,000',
    songs: [
      { title: 'Cambaz', album: 'Dünya Yalan Söylüyor', duration: 248 },
      { title: 'Bir Derdim Var', album: 'Dünya Yalan Söylüyor', duration: 236 },
      { title: 'Deli', album: 'Dünya Yalan Söylüyor', duration: 221 },
      { title: 'Uyan', album: 'Seçilmişler', duration: 255 },
    ],
  },
  {
    name: 'Yalın',
    slug: 'yalin',
    country: 'tr',
    followers: '1,480,000',
    songs: [
      { title: 'Ki Sen', album: 'Ki Sen', duration: 231 },
      { title: 'Zalim', album: 'Zalim', duration: 218 },
      { title: 'Küçüğüm', album: 'Küçüğüm', duration: 224 },
      { title: 'Değmez', album: 'Seçilmişler', duration: 205 },
    ],
  },
  {
    name: 'Sıla',
    slug: 'sila',
    country: 'tr',
    followers: '2,700,000',
    songs: [
      { title: 'Yabancı', album: 'Yabancı', duration: 241 },
      { title: 'Acısa da Öldürmez', album: 'Acısa da Öldürmez', duration: 228 },
      { title: 'Boş Şeyler', album: 'Mürekkep', duration: 215 },
      { title: 'Vaziyetler', album: 'Vaziyetler', duration: 236 },
    ],
  },
  {
    name: 'Simge',
    slug: 'simge',
    country: 'tr',
    followers: '1,920,000',
    songs: [
      { title: 'Yankı', album: 'Yankı', duration: 218 },
      { title: 'Miş Miş', album: 'Miş Miş', duration: 198 },
      { title: 'Üzülmedin mi?', album: 'Ben Bazen', duration: 224 },
      { title: 'Kamera', album: 'Kamera', duration: 205 },
    ],
  },
  {
    name: 'Zeynep Bastık',
    slug: 'zeynep-bastik',
    country: 'tr',
    followers: '2,150,000',
    songs: [
      { title: 'Mod', album: 'Mod', duration: 201 },
      { title: 'Bırakman Doğru Mu?', album: 'Bırakman Doğru Mu?', duration: 212 },
      { title: 'Çukur', album: 'Çukur', duration: 195 },
      { title: 'Dargın', album: 'Dargın', duration: 218 },
    ],
  },
  {
    name: 'Murat Boz',
    slug: 'murat-boz',
    country: 'tr',
    followers: '2,050,000',
    songs: [
      { title: 'Janti', album: 'Janti', duration: 224 },
      { title: 'Özledim', album: 'Özledim', duration: 231 },
      { title: 'Geri Dönüş Olsa', album: 'Geri Dönüş Olsa', duration: 218 },
      { title: 'Adını Bilen Yazsın', album: 'Aşklarım Büyük Benden', duration: 205 },
    ],
  },
]

function hashFollowers(_name: string, base: string) {
  return base
}

export function buildAzTrCatalog(): {
  artists: Artist[]
  albums: Album[]
  tracks: Track[]
  radioPlaylists: Playlist[]
} {
  const artists: Artist[] = []
  const albums: Album[] = []
  const tracks: Track[] = []
  const radioPlaylists: Playlist[] = []
  const albumMap = new Map<string, Album>()
  let songIndex = 0

  SEEDS.forEach((seed, i) => {
    const color = COLORS[i % COLORS.length]
    const artistId = `aztr-ar-${seed.slug}`
    const portrait = `/artists/${seed.slug}.jpg`
    const cover = `/covers/${seed.slug}.jpg`

    artists.push({
      id: artistId,
      name: seed.name,
      cover: portrait,
      followers: hashFollowers(seed.name, seed.followers),
      color,
    })

    const trackIds: string[] = []
    seed.songs.forEach((song, sIdx) => {
      const trackId = `aztr-t-${seed.slug}-${sIdx + 1}`
      trackIds.push(trackId)
      const albumKey = `${seed.slug}::${song.album}`
      let album = albumMap.get(albumKey)
      if (!album) {
        const albumId = `aztr-a-${seed.slug}-${albumMap.size + 1}`
        album = {
          id: albumId,
          name: song.album,
          artist: seed.name,
          cover,
          year: String(2016 + ((i + sIdx) % 9)),
          color,
          trackIds: [],
        }
        albumMap.set(albumKey, album)
        albums.push(album)
      }
      album.trackIds.push(trackId)

      const audioPath = songAudio(songIndex)
      songIndex += 1

      tracks.push({
        id: trackId,
        title: song.title,
        artist: song.artists ?? seed.name,
        album: song.album,
        duration: song.duration ?? 180 + ((i * 13 + sIdx * 17) % 160),
        cover,
        audio: audioPath,
        liked: sIdx === 0 && i % 6 === 0,
      })
    })

    const radioId = `radio-${seed.slug}`
    const related = SEEDS.filter(
      (o) => o.country === seed.country && o.slug !== seed.slug,
    ).slice(0, 4)
    const radioTrackIds = [
      ...trackIds,
      ...related.flatMap((r) =>
        r.songs.slice(0, 2).map((_, sIdx) => `aztr-t-${r.slug}-${sIdx + 1}`),
      ),
    ]
    radioPlaylists.push({
      id: radioId,
      name: `${seed.name} Radio`,
      description: seed.radioWith
        ? `With ${seed.radioWith}`
        : `Made for you · ${seed.name} and similar artists`,
      cover: portrait,
      owner: 'Spotify',
      color,
      trackIds: radioTrackIds,
    })
  })

  return { artists, albums, tracks, radioPlaylists }
}

export const azTrMeta = {
  count: SEEDS.length,
  countries: ['Azərbaycan', 'Türkiyə'] as const,
  seeds: SEEDS.map((s) => ({ name: s.name, slug: s.slug })),
}
