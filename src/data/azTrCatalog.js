function songAudio(index) {
  const n = (index % 280 + 280) % 280;
  return `/audio/songs/song-${String(n).padStart(3, "0")}.mp3`;
}
const COLORS = [
  "#1e3264",
  "#148a08",
  "#8d67ab",
  "#e91429",
  "#ba5d07",
  "#5038a0",
  "#0d73ec",
  "#e8115b",
  "#dc148c",
  "#006450",
  "#b49bc8",
  "#e13300"
];
const SEEDS = [
  {
    name: "Ayg\xFCn Kaz\u0131mova",
    slug: "aygun-kazimova",
    country: "az",
    followers: "1,240,500",
    radioWith: "N\u0259simi M\u0259mm\u0259dov, R\xF6ya, Z\xFClfiyy\u0259 Xanbabayeva and more",
    songs: [
      {
        title: "M\u0259saf\u0259l\u0259r",
        album: "M\u0259saf\u0259l\u0259r",
        artists: "Ayg\xFCn Kaz\u0131mova, N\u0259simi M\u0259mm\u0259dov",
        duration: 209
      },
      { title: "Qara G\xF6zl\xFCm", album: "Se\xE7ilmi\u015Fl\u0259r", duration: 231 },
      { title: "Yen\u0259 T\u0259k", album: "Se\xE7ilmi\u015Fl\u0259r", duration: 218 },
      { title: "Coffee from Colombia", album: "Coffee from Colombia", duration: 195 },
      { title: "Petronum", album: "Petronum", duration: 202 }
    ]
  },
  {
    name: "R\xF6ya",
    slug: "roya",
    country: "az",
    followers: "980,220",
    radioWith: "Ayg\xFCn Kaz\u0131mova, Manana, Cleopatra and more",
    songs: [
      { title: "S\u0259n\u0259 Ehtiyac\u0131m Var", album: "S\u0259n\u0259 Ehtiyac\u0131m Var", duration: 224 },
      { title: "Biv\u0259fa", album: "Biv\u0259fa", duration: 241 },
      { title: "Biv\u0259fa 2", album: "Biv\u0259fa 2", duration: 236 },
      { title: "D\u0259ym\u0259z", album: "Best of R\xF6ya", duration: 198 },
      { title: "Unutmaq Olmur", album: "Best of R\xF6ya", duration: 215 }
    ]
  },
  {
    name: "Brilliant Dada\u015Fova",
    slug: "brilliant-dadasova",
    country: "az",
    followers: "420,110",
    songs: [
      { title: "Bayat\u0131-\u015Eiraz", album: "Klassikalar", duration: 312 },
      { title: "Sar\u0131 G\u0259lin", album: "Klassikalar", duration: 278 },
      { title: "G\u0259l Ey S\u0259h\u0259r", album: "Klassikalar", duration: 245 },
      { title: "Q\u0131z\u0131l G\xFCl", album: "Klassikalar", duration: 221 }
    ]
  },
  {
    name: "Z\xFClfiyy\u0259 Xanbabayeva",
    slug: "zulfiyye-xanbabayeva",
    country: "az",
    followers: "510,880",
    songs: [
      { title: "Bak\u0131 Gec\u0259l\u0259ri", album: "Xatir\u0259l\u0259r", duration: 255 },
      { title: "S\u0259n\u0259 Qurban", album: "Xatir\u0259l\u0259r", duration: 238 },
      { title: "G\xF6z\u0259l Bak\u0131m", album: "Xatir\u0259l\u0259r", duration: 226 },
      { title: "V\u0259t\u0259n", album: "Xatir\u0259l\u0259r", duration: 249 }
    ]
  },
  {
    name: "Flora K\u0259rimova",
    slug: "flora-kerimova",
    country: "az",
    followers: "305,400",
    songs: [
      { title: "B\u0259xtiyar", album: "N\u0259\u011Fm\u0259l\u0259r", duration: 267 },
      { title: "G\xFCl\xFCstan", album: "N\u0259\u011Fm\u0259l\u0259r", duration: 241 },
      { title: "Sevgilim", album: "N\u0259\u011Fm\u0259l\u0259r", duration: 228 },
      { title: "Bahar", album: "N\u0259\u011Fm\u0259l\u0259r", duration: 214 }
    ]
  },
  {
    name: "N\u0259simi M\u0259mm\u0259dov",
    slug: "nesimi-memmedov",
    country: "az",
    followers: "640,050",
    radioWith: "Ayg\xFCn Kaz\u0131mova, Faiq A\u011Fayev and more",
    songs: [
      {
        title: "M\u0259saf\u0259l\u0259r",
        album: "M\u0259saf\u0259l\u0259r",
        artists: "Ayg\xFCn Kaz\u0131mova, N\u0259simi M\u0259mm\u0259dov",
        duration: 209
      },
      { title: "Yaln\u0131z S\u0259n", album: "Duetl\u0259r", duration: 233 },
      { title: "Gec\u0259", album: "Duetl\u0259r", duration: 218 },
      { title: "Ayr\u0131l\u0131q", album: "Duetl\u0259r", duration: 247 }
    ]
  },
  {
    name: "Miri Yusif",
    slug: "miri-yusif",
    country: "az",
    followers: "1,105,300",
    songs: [
      { title: "Ad\u0131 Ba\u015F\u0131na", album: "Hip-Hop AZ", duration: 198 },
      { title: "Popuri", album: "Hip-Hop AZ", duration: 212 },
      { title: "Yollar", album: "Hip-Hop AZ", duration: 205 },
      { title: "Bak\u0131", album: "Hip-Hop AZ", duration: 221 }
    ]
  },
  {
    name: "Elnur H\xFCseynov",
    slug: "elnur-huseynov",
    country: "az",
    followers: "390,700",
    songs: [
      { title: "Day After Day", album: "Eurovision Moments", duration: 183 },
      { title: "Clear", album: "Eurovision Moments", duration: 176 },
      { title: "Alive", album: "Eurovision Moments", duration: 191 },
      { title: "Heart", album: "Eurovision Moments", duration: 188 }
    ]
  },
  {
    name: "Alim Qas\u0131mov",
    slug: "alim-qasimov",
    country: "az",
    followers: "720,900",
    songs: [
      { title: "Bayat\u0131-K\xFCrd", album: "Mu\u011Fam", duration: 420 },
      { title: "\u015Eur", album: "Mu\u011Fam", duration: 385 },
      { title: "Segah", album: "Mu\u011Fam", duration: 401 },
      { title: "\xC7ahargah", album: "Mu\u011Fam", duration: 367 }
    ]
  },
  {
    name: "Qara 17",
    slug: "qara-17",
    country: "az",
    followers: "455,200",
    songs: [
      { title: "17", album: "K\xFC\xE7\u0259", duration: 201 },
      { title: "Gece", album: "K\xFC\xE7\u0259", duration: 194 },
      { title: "\u015E\u0259h\u0259r", album: "K\xFC\xE7\u0259", duration: 208 },
      { title: "Yol", album: "K\xFC\xE7\u0259", duration: 215 }
    ]
  },
  {
    name: "Cleopatra",
    slug: "cleopatra",
    country: "az",
    followers: "280,600",
    songs: [
      { title: "Sevgi", album: "Pop Hits", duration: 198 },
      { title: "G\u0259l Yan\u0131ma", album: "Pop Hits", duration: 205 },
      { title: "Yalan", album: "Pop Hits", duration: 191 },
      { title: "X\u0259yal", album: "Pop Hits", duration: 212 }
    ]
  },
  {
    name: "Manana",
    slug: "manana",
    country: "az",
    followers: "265,100",
    songs: [
      { title: "S\u0259ni Sevir\u0259m", album: "Sevgi N\u0259\u011Fm\u0259l\u0259ri", duration: 223 },
      { title: "G\xF6z\u0259l G\xFCn", album: "Sevgi N\u0259\u011Fm\u0259l\u0259ri", duration: 209 },
      { title: "Xatir\u0259", album: "Sevgi N\u0259\u011Fm\u0259l\u0259ri", duration: 231 },
      { title: "Uzaq", album: "Sevgi N\u0259\u011Fm\u0259l\u0259ri", duration: 217 }
    ]
  },
  {
    name: "Ayg\xFCn Beyler",
    slug: "aygun-beyler",
    country: "az",
    followers: "198,450",
    songs: [
      { title: "Dal\u011Fa", album: "Yeni Dal\u011Fa", duration: 204 },
      { title: "S\u0259h\u0259r", album: "Yeni Dal\u011Fa", duration: 196 },
      { title: "K\xFCl\u0259k", album: "Yeni Dal\u011Fa", duration: 211 },
      { title: "\u0130\u015F\u0131q", album: "Yeni Dal\u011Fa", duration: 188 }
    ]
  },
  {
    name: "Tunzal\u0259 A\u011Fayeva",
    slug: "tunzale",
    country: "az",
    followers: "350,800",
    radioWith: "R\xF6ya, Manana, Ayg\xFCn Kaz\u0131mova and more",
    songs: [
      { title: "G\xF6zl\u0259yir\u0259m", album: "T\xFCnzal\u0259", duration: 228 },
      { title: "S\u0259nsiz G\xFCnl\u0259r", album: "T\xFCnzal\u0259", duration: 241 },
      { title: "Yuxu", album: "T\xFCnzal\u0259", duration: 215 },
      { title: "Geri D\xF6n", album: "T\xFCnzal\u0259", duration: 233 }
    ]
  },
  {
    name: "El\u015Fad Xose",
    slug: "elsad-xose",
    country: "az",
    followers: "410,220",
    songs: [
      { title: "R\u0259qs Et", album: "R\u0259qs", duration: 192 },
      { title: "\u015E\u0259nlik", album: "R\u0259qs", duration: 186 },
      { title: "Gec\u0259 Klubu", album: "R\u0259qs", duration: 201 },
      { title: "Tempo", album: "R\u0259qs", duration: 178 }
    ]
  },
  {
    name: "Sabina Babayeva",
    slug: "sabina-babayeva",
    country: "az",
    followers: "275,900",
    songs: [
      { title: "When The Music Dies", album: "When The Music Dies", duration: 183 },
      { title: "Love", album: "When The Music Dies", duration: 176 },
      { title: "Stars", album: "When The Music Dies", duration: 191 },
      { title: "Home", album: "When The Music Dies", duration: 188 }
    ]
  },
  {
    name: "Dilara Kazimova",
    slug: "dilara-kazimova",
    country: "az",
    followers: "190,300",
    songs: [
      { title: "Start A Fire", album: "Start A Fire", duration: 179 },
      { title: "Flame", album: "Start A Fire", duration: 185 },
      { title: "Night", album: "Start A Fire", duration: 192 },
      { title: "Hope", album: "Start A Fire", duration: 174 }
    ]
  },
  {
    name: "Chingiz",
    slug: "chingiz",
    country: "az",
    followers: "520,700",
    songs: [
      { title: "Truth", album: "Truth", duration: 181 },
      { title: "Dream", album: "Truth", duration: 195 },
      { title: "Light", album: "Truth", duration: 188 },
      { title: "Run", album: "Truth", duration: 172 }
    ]
  },
  {
    name: "Samira Efendi",
    slug: "samira-efendi",
    country: "az",
    followers: "610,400",
    songs: [
      { title: "Cleopatra", album: "Cleopatra", duration: 178 },
      { title: "Queen", album: "Cleopatra", duration: 186 },
      { title: "Dance", album: "Cleopatra", duration: 192 },
      { title: "Gold", album: "Cleopatra", duration: 201 }
    ]
  },
  {
    name: "Faiq A\u011Fayev",
    slug: "faiq-agayev",
    country: "az",
    followers: "330,150",
    songs: [
      { title: "G\u0259l", album: "Se\xE7m\u0259", duration: 224 },
      { title: "Sevgi", album: "Se\xE7m\u0259", duration: 218 },
      { title: "Yollar", album: "Se\xE7m\u0259", duration: 231 },
      { title: "Xatir\u0259l\u0259r", album: "Se\xE7m\u0259", duration: 245 }
    ]
  },
  {
    name: "Sezen Aksu",
    slug: "sezen-aksu",
    country: "tr",
    followers: "4,850,000",
    radioWith: "G\xFClden Karab\xF6cek, Kamuran Akkor, Beng\xFC and more",
    songs: [
      { title: "A\u015Fktan Ne Haber", album: "Yaz Bitmeden", duration: 237 },
      { title: "G\xFCl\xFCmse", album: "G\xFCl\xFCmse", duration: 268 },
      { title: "Firuze", album: "Firuze", duration: 251 },
      { title: "Hadi Bakal\u0131m", album: "G\xFCl\xFCmse", duration: 224 },
      { title: "\u015Eark\u0131 S\xF6ylemek Laz\u0131m", album: "Se\xE7ilmi\u015Fler", duration: 243 },
      { title: "Git", album: "Se\xE7ilmi\u015Fler", duration: 256 }
    ]
  },
  {
    name: "Ebru Ya\u015Far",
    slug: "ebru-yasar",
    country: "tr",
    followers: "2,100,000",
    radioWith: "Sezen Aksu, Beng\xFC, G\xFCl\u015Fen and more",
    songs: [
      { title: "Ben Ne Yang\u0131nlar G\xF6rd\xFCm", album: "Haddinden Fazla", duration: 271 },
      { title: "Haddinden Fazla", album: "Haddinden Fazla", duration: 248 },
      { title: "Yeminim Var", album: "Yeminim Var", duration: 235 },
      { title: "Sensiz Olmaz", album: "Se\xE7ilmi\u015Fler", duration: 229 }
    ]
  },
  {
    name: "Beng\xFC",
    slug: "bengu",
    country: "tr",
    followers: "1,850,000",
    songs: [
      { title: "Sayg\u0131mdan", album: "\u0130kinci Hal", duration: 271 },
      { title: "\u0130kinci Hal", album: "\u0130kinci Hal", duration: 244 },
      { title: "Kuzum", album: "Kuzum", duration: 218 },
      { title: "Feveran", album: "Feveran", duration: 226 }
    ]
  },
  {
    name: "G\xFClden Karab\xF6cek",
    slug: "gulden-karabocek",
    country: "tr",
    followers: "890,000",
    songs: [
      { title: "S\xF6yleyin", album: "Klasikler", duration: 285 },
      { title: "Dilek Ta\u015F\u0131", album: "Klasikler", duration: 262 },
      { title: "Samanyolu", album: "Klasikler", duration: 248 },
      { title: "Ayr\u0131l\u0131k", album: "Klasikler", duration: 271 }
    ]
  },
  {
    name: "Tarkan",
    slug: "tarkan",
    country: "tr",
    followers: "5,210,000",
    radioWith: "Mustafa Sandal, Kenan Do\u011Fulu, Hadise and more",
    songs: [
      { title: "\u015E\u0131mar\u0131k", album: "\xD6l\xFCr\xFCm Sana", duration: 236 },
      { title: "Kuzu Kuzu", album: "Karma", duration: 228 },
      { title: "Dudu", album: "Dudu", duration: 241 },
      { title: "\xD6l\xFCr\xFCm Sana", album: "\xD6l\xFCr\xFCm Sana", duration: 255 },
      { title: "Bounce", album: "Metamorfoz", duration: 219 }
    ]
  },
  {
    name: "Sertab Erener",
    slug: "sertab-erener",
    country: "tr",
    followers: "1,420,000",
    songs: [
      { title: "Everyway That I Can", album: "Everyway That I Can", duration: 178 },
      { title: "Ask", album: "Ask", duration: 245 },
      { title: "Zor Kadin", album: "Zor Kadin", duration: 231 },
      { title: "Bu Gece", album: "Se\xE7ilmi\u015Fler", duration: 218 }
    ]
  },
  {
    name: "Ajda Pekkan",
    slug: "ajda-pekkan",
    country: "tr",
    followers: "1,100,000",
    songs: [
      { title: "Pet\u2019r Oil", album: "S\xFCperstar", duration: 245 },
      { title: "Bamba\u015Fka", album: "S\xFCperstar", duration: 228 },
      { title: "Oyalama Beni", album: "S\xFCperstar", duration: 236 },
      { title: "Kimler Geldi Kimler Ge\xE7ti", album: "S\xFCperstar", duration: 251 }
    ]
  },
  {
    name: "Bar\u0131\u015F Man\xE7o",
    slug: "baris-manco",
    country: "tr",
    followers: "2,300,000",
    songs: [
      { title: "G\xFClpembe", album: "24 Ayar Man\xE7o", duration: 312 },
      { title: "Alla Beni Pulla Beni", album: "S\xF6z\xFCm Meclisten D\u0131\u015Far\u0131", duration: 278 },
      { title: "Da\u011Flar Da\u011Flar", album: "Klasikler", duration: 265 },
      { title: "Aynal\u0131 Kemer", album: "Klasikler", duration: 241 }
    ]
  },
  {
    name: "MF\xD6",
    slug: "mfo",
    country: "tr",
    followers: "980,000",
    songs: [
      { title: "Ele G\xFCne Kar\u015F\u0131", album: "Ele G\xFCne Kar\u015F\u0131", duration: 298 },
      { title: "Peki Peki Anlad\u0131k", album: "Peki Peki Anlad\u0131k", duration: 256 },
      { title: "Buselik", album: "Se\xE7ilmi\u015Fler", duration: 231 },
      { title: "Sar\u0131 Laleler", album: "Se\xE7ilmi\u015Fler", duration: 245 }
    ]
  },
  {
    name: "Duman",
    slug: "duman",
    country: "tr",
    followers: "2,450,000",
    songs: [
      { title: "Seni Kendime Saklad\u0131m", album: "Belki Al\u0131nmaz", duration: 268 },
      { title: "Her \u015Eeyi Yak", album: "Belki Al\u0131nmaz", duration: 251 },
      { title: "Belki Al\u0131nmaz", album: "Belki Al\u0131nmaz", duration: 244 },
      { title: "Ah", album: "Darmaduman", duration: 229 }
    ]
  },
  {
    name: "Manga",
    slug: "manga",
    country: "tr",
    followers: "1,650,000",
    songs: [
      { title: "We Could Be The Same", album: "We Could Be The Same", duration: 191 },
      { title: "Dursun Zaman", album: "\u015Eehr-i H\xFCz\xFCn", duration: 248 },
      { title: "Cevaps\u0131z Sorular", album: "\u015Eehr-i H\xFCz\xFCn", duration: 236 },
      { title: "Fly To Stay Alive", album: "e-akustik", duration: 224 }
    ]
  },
  {
    name: "Hadise",
    slug: "hadise",
    country: "tr",
    followers: "2,800,000",
    songs: [
      { title: "D\xFCm Tek Tek", album: "Fast Life", duration: 178 },
      { title: "S\u0131f\u0131r Tolerans", album: "S\u0131f\u0131r Tolerans", duration: 205 },
      { title: "A\u015Fk Ka\xE7 Beden Giyer", album: "A\u015Fk Ka\xE7 Beden Giyer", duration: 218 },
      { title: "My Body", album: "Fast Life", duration: 192 }
    ]
  },
  {
    name: "Hande Yener",
    slug: "hande-yener",
    country: "tr",
    followers: "2,600,000",
    songs: [
      { title: "Kibir", album: "Kibir", duration: 224 },
      { title: "A\u015Fk\u0131n Ate\u015Fi", album: "A\u015Fk Kad\u0131n Ruhundan Anlam\u0131yor", duration: 241 },
      { title: "Yalan\u0131n Bats\u0131n", album: "Se\xE7ilmi\u015Fler", duration: 218 },
      { title: "Romeo", album: "Romeo", duration: 231 }
    ]
  },
  {
    name: "Mustafa Sandal",
    slug: "mustafa-sandal",
    country: "tr",
    followers: "1,900,000",
    songs: [
      { title: "Aya Benzer", album: "Aya Benzer", duration: 248 },
      { title: "Araba", album: "Araba", duration: 236 },
      { title: "\u0130syankar", album: "\u0130syankar", duration: 228 },
      { title: "Detay", album: "Detay", duration: 215 }
    ]
  },
  {
    name: "Kenan Do\u011Fulu",
    slug: "kenan-dogulu",
    country: "tr",
    followers: "1,750,000",
    songs: [
      { title: "\xC7akk\u0131d\u0131", album: "Festival", duration: 218 },
      { title: "A\u015Fk\u0131m A\u015Fk\u0131m", album: "Ex A\u015Fk\u0131m", duration: 231 },
      { title: "Doktor", album: "Festival", duration: 205 },
      { title: "Shake It Up \u015Eekerim", album: "Ex A\u015Fk\u0131m", duration: 224 }
    ]
  },
  {
    name: "\u0130brahim Tatl\u0131ses",
    slug: "ibrahim-tatlises",
    country: "tr",
    followers: "3,200,000",
    songs: [
      { title: "Mavi Mavi", album: "Mavi Mavi", duration: 298 },
      { title: "Leylim Ley", album: "Klasikler", duration: 312 },
      { title: "Selam Olsun", album: "Klasikler", duration: 285 },
      { title: "Mutlu Ol Yeter", album: "Klasikler", duration: 271 }
    ]
  },
  {
    name: "Orhan Gencebay",
    slug: "orhan-gencebay",
    country: "tr",
    followers: "1,400,000",
    songs: [
      { title: "Bats\u0131n Bu D\xFCnya", album: "Klasikler", duration: 356 },
      { title: "Bir Teselli Ver", album: "Klasikler", duration: 328 },
      { title: "Haberin Var m\u0131?", album: "Klasikler", duration: 301 },
      { title: "Yarabbim", album: "Klasikler", duration: 315 }
    ]
  },
  {
    name: "Zeki M\xFCren",
    slug: "zeki-muren",
    country: "tr",
    followers: "1,200,000",
    songs: [
      { title: "Ah Bu \u015Eark\u0131lar\u0131n G\xF6z\xFC K\xF6r Olsun", album: "Klasikler", duration: 345 },
      { title: "\u015Eimdi Uzaklardas\u0131n", album: "Klasikler", duration: 298 },
      { title: "Manolyam", album: "Klasikler", duration: 276 },
      { title: "Bir Demet Yasemen", album: "Klasikler", duration: 291 }
    ]
  },
  {
    name: "G\xFCl\u015Fen",
    slug: "gulsen",
    country: "tr",
    followers: "2,900,000",
    songs: [
      { title: "Bir \u0130htimal Daha Var", album: "Bang\u0131r Bang\u0131r", duration: 218 },
      { title: "Bang\u0131r Bang\u0131r", album: "Bang\u0131r Bang\u0131r", duration: 205 },
      { title: "Yatcaz Kalkcaz Orday\u0131m", album: "\xD6ns\xF6z", duration: 224 },
      { title: "Dan Dan", album: "\xD6ns\xF6z", duration: 198 }
    ]
  },
  {
    name: "Aleyna Tilki",
    slug: "aleyna-tilki",
    country: "tr",
    followers: "3,100,000",
    songs: [
      { title: "Cevaps\u0131z \xC7\u0131nlama", album: "Cevaps\u0131z \xC7\u0131nlama", duration: 201 },
      { title: "Sen Olsan Bari", album: "Sen Olsan Bari", duration: 188 },
      { title: "Yaln\u0131z \xC7i\xE7ek", album: "Yaln\u0131z \xC7i\xE7ek", duration: 195 },
      { title: "Dipsiz Kuyum", album: "Dipsiz Kuyum", duration: 212 }
    ]
  },
  {
    name: "Edis",
    slug: "edis",
    country: "tr",
    followers: "2,200,000",
    songs: [
      { title: "Buz K\u0131ra\u011F\u0131", album: "Buz K\u0131ra\u011F\u0131", duration: 198 },
      { title: "Benim Ol", album: "Benim Ol", duration: 205 },
      { title: "Romeo", album: "Romeo", duration: 191 },
      { title: "\xC7ok \xC7ok", album: "\xC7ok \xC7ok", duration: 184 }
    ]
  },
  {
    name: "Mabel Matiz",
    slug: "mabel-matiz",
    country: "tr",
    followers: "1,550,000",
    songs: [
      { title: "\xD6yle Kolaysa", album: "\xD6yle Kolaysa", duration: 231 },
      { title: "F\u0131rt\u0131nam", album: "F\u0131rt\u0131nam", duration: 218 },
      { title: "Ahu", album: "Ahu", duration: 245 },
      { title: "Gel", album: "Maya", duration: 226 }
    ]
  },
  {
    name: "Sagopa Kajmer",
    slug: "sagopa-kajmer",
    country: "tr",
    followers: "2,050,000",
    songs: [
      { title: "Bir Pesimistin G\xF6zya\u015Flar\u0131", album: "Bir Pesimistin G\xF6zya\u015Flar\u0131", duration: 268 },
      { title: "Disstortion EP", album: "Disstortion", duration: 241 },
      { title: "Galvaniz", album: "Galvaniz", duration: 255 },
      { title: "\u0130kimiz", album: "\u0130kimiz", duration: 231 }
    ]
  },
  {
    name: "Ceza",
    slug: "ceza",
    country: "tr",
    followers: "2,400,000",
    songs: [
      { title: "Holocaust", album: "Rapstar", duration: 248 },
      { title: "Suspus", album: "Suspus", duration: 236 },
      { title: "Nereden Nereye", album: "Yerli Plaka", duration: 221 },
      { title: "Medcezir", album: "Medcezir", duration: 255 }
    ]
  },
  {
    name: "\u015Eebnem Ferah",
    slug: "sebnem-ferah",
    country: "tr",
    followers: "1,800,000",
    songs: [
      { title: "Vazge\xE7tim D\xFCnyadan", album: "Vazge\xE7tim D\xFCnyadan", duration: 278 },
      { title: "Bu A\u015Fk Fazla Sana", album: "Can K\u0131r\u0131klar\u0131", duration: 251 },
      { title: "Sil Ba\u015Ftan", album: "Sil Ba\u015Ftan", duration: 244 },
      { title: "Ya\u011Fmurlar", album: "Kad\u0131n", duration: 268 }
    ]
  },
  {
    name: "Teoman",
    slug: "teoman",
    country: "tr",
    followers: "1,650,000",
    songs: [
      { title: "Parampar\xE7a", album: "Parampar\xE7a", duration: 256 },
      { title: "\u0130stanbul\u2019da Sonbahar", album: "\u0130stanbul\u2019da Sonbahar", duration: 241 },
      { title: "Senden \xD6nce Senden Sonra", album: "Se\xE7ilmi\u015Fler", duration: 228 },
      { title: "R\xFCzgar G\xFCl\xFC", album: "R\xFCzgar G\xFCl\xFC", duration: 235 }
    ]
  },
  {
    name: "Athena",
    slug: "athena",
    country: "tr",
    followers: "1,100,000",
    songs: [
      { title: "Holocaust", album: "Holocaust", duration: 218 },
      { title: "One Last Breath", album: "One Last Breath", duration: 205 },
      { title: "Tam Zaman\u0131 \u015Eimdi", album: "Tam Zaman\u0131 \u015Eimdi", duration: 224 },
      { title: "Ya\u015Famak Var Ya", album: "Se\xE7ilmi\u015Fler", duration: 231 }
    ]
  },
  {
    name: "Mor ve \xD6tesi",
    slug: "mor-ve-otesi",
    country: "tr",
    followers: "1,350,000",
    songs: [
      { title: "Cambaz", album: "D\xFCnya Yalan S\xF6yl\xFCyor", duration: 248 },
      { title: "Bir Derdim Var", album: "D\xFCnya Yalan S\xF6yl\xFCyor", duration: 236 },
      { title: "Deli", album: "D\xFCnya Yalan S\xF6yl\xFCyor", duration: 221 },
      { title: "Uyan", album: "Se\xE7ilmi\u015Fler", duration: 255 }
    ]
  },
  {
    name: "Yal\u0131n",
    slug: "yalin",
    country: "tr",
    followers: "1,480,000",
    songs: [
      { title: "Ki Sen", album: "Ki Sen", duration: 231 },
      { title: "Zalim", album: "Zalim", duration: 218 },
      { title: "K\xFC\xE7\xFC\u011F\xFCm", album: "K\xFC\xE7\xFC\u011F\xFCm", duration: 224 },
      { title: "De\u011Fmez", album: "Se\xE7ilmi\u015Fler", duration: 205 }
    ]
  },
  {
    name: "S\u0131la",
    slug: "sila",
    country: "tr",
    followers: "2,700,000",
    songs: [
      { title: "Yabanc\u0131", album: "Yabanc\u0131", duration: 241 },
      { title: "Ac\u0131sa da \xD6ld\xFCrmez", album: "Ac\u0131sa da \xD6ld\xFCrmez", duration: 228 },
      { title: "Bo\u015F \u015Eeyler", album: "M\xFCrekkep", duration: 215 },
      { title: "Vaziyetler", album: "Vaziyetler", duration: 236 }
    ]
  },
  {
    name: "Simge",
    slug: "simge",
    country: "tr",
    followers: "1,920,000",
    songs: [
      { title: "Yank\u0131", album: "Yank\u0131", duration: 218 },
      { title: "Mi\u015F Mi\u015F", album: "Mi\u015F Mi\u015F", duration: 198 },
      { title: "\xDCz\xFClmedin mi?", album: "Ben Bazen", duration: 224 },
      { title: "Kamera", album: "Kamera", duration: 205 }
    ]
  },
  {
    name: "Zeynep Bast\u0131k",
    slug: "zeynep-bastik",
    country: "tr",
    followers: "2,150,000",
    songs: [
      { title: "Mod", album: "Mod", duration: 201 },
      { title: "B\u0131rakman Do\u011Fru Mu?", album: "B\u0131rakman Do\u011Fru Mu?", duration: 212 },
      { title: "\xC7ukur", album: "\xC7ukur", duration: 195 },
      { title: "Darg\u0131n", album: "Darg\u0131n", duration: 218 }
    ]
  },
  {
    name: "Murat Boz",
    slug: "murat-boz",
    country: "tr",
    followers: "2,050,000",
    songs: [
      { title: "Janti", album: "Janti", duration: 224 },
      { title: "\xD6zledim", album: "\xD6zledim", duration: 231 },
      { title: "Geri D\xF6n\xFC\u015F Olsa", album: "Geri D\xF6n\xFC\u015F Olsa", duration: 218 },
      { title: "Ad\u0131n\u0131 Bilen Yazs\u0131n", album: "A\u015Fklar\u0131m B\xFCy\xFCk Benden", duration: 205 }
    ]
  }
];
function hashFollowers(_name, base) {
  return base;
}
function buildAzTrCatalog() {
  const artists = [];
  const albums = [];
  const tracks = [];
  const radioPlaylists = [];
  const albumMap = /* @__PURE__ */ new Map();
  let songIndex = 0;
  SEEDS.forEach((seed, i) => {
    const color = COLORS[i % COLORS.length];
    const artistId = `aztr-ar-${seed.slug}`;
    const portrait = `/artists/${seed.slug}.jpg`;
    const cover = `/covers/${seed.slug}.jpg`;
    artists.push({
      id: artistId,
      name: seed.name,
      cover: portrait,
      followers: hashFollowers(seed.name, seed.followers),
      color
    });
    const trackIds = [];
    seed.songs.forEach((song, sIdx) => {
      const trackId = `aztr-t-${seed.slug}-${sIdx + 1}`;
      trackIds.push(trackId);
      const albumKey = `${seed.slug}::${song.album}`;
      let album = albumMap.get(albumKey);
      if (!album) {
        const albumId = `aztr-a-${seed.slug}-${albumMap.size + 1}`;
        album = {
          id: albumId,
          name: song.album,
          artist: seed.name,
          cover,
          year: String(2016 + (i + sIdx) % 9),
          color,
          trackIds: []
        };
        albumMap.set(albumKey, album);
        albums.push(album);
      }
      album.trackIds.push(trackId);
      const audioPath = songAudio(songIndex);
      songIndex += 1;
      tracks.push({
        id: trackId,
        title: song.title,
        artist: song.artists ?? seed.name,
        album: song.album,
        duration: song.duration ?? 180 + (i * 13 + sIdx * 17) % 160,
        cover,
        audio: audioPath,
        liked: sIdx === 0 && i % 6 === 0
      });
    });
    const radioId = `radio-${seed.slug}`;
    const related = SEEDS.filter(
      (o) => o.country === seed.country && o.slug !== seed.slug
    ).slice(0, 4);
    const radioTrackIds = [
      ...trackIds,
      ...related.flatMap(
        (r) => r.songs.slice(0, 2).map((_, sIdx) => `aztr-t-${r.slug}-${sIdx + 1}`)
      )
    ];
    radioPlaylists.push({
      id: radioId,
      name: `${seed.name} Radio`,
      description: seed.radioWith ? `With ${seed.radioWith}` : `Made for you \xB7 ${seed.name} and similar artists`,
      cover: portrait,
      owner: "Spotify",
      color,
      trackIds: radioTrackIds
    });
  });
  return { artists, albums, tracks, radioPlaylists };
}
const azTrMeta = {
  count: SEEDS.length,
  countries: ["Az\u0259rbaycan", "T\xFCrkiy\u0259"],
  seeds: SEEDS.map((s) => ({ name: s.name, slug: s.slug }))
};
export {
  azTrMeta,
  buildAzTrCatalog
};
