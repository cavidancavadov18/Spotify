const cache = /* @__PURE__ */ new Map();
async function fetchLyrics(title, artist) {
  const key = `${artist}::${title}`.toLowerCase();
  const hit = cache.get(key);
  if (hit) return hit;
  const artistMain = artist.split(",")[0].trim();
  try {
    const url = `https://api.lyrics.ovh/v1/${encodeURIComponent(artistMain)}/${encodeURIComponent(title)}`;
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      const lines = (data.lyrics || "").split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
      if (lines.length) {
        cache.set(key, lines);
        return lines;
      }
    }
  } catch {
  }
  const fallback = [
    title,
    "",
    `${artistMain} \xB7 Live lyrics`,
    "S\xF6zl\u0259r ax\u0131r, s\u0259s y\xFCks\u0259lir",
    "Gec\u0259 i\u015F\u0131qlar\u0131 yan\u0131r yen\u0259",
    "Bu mahn\u0131 s\u0259nin \xFC\xE7\xFCn \xE7al\u0131n\u0131r",
    "Ritm davam edir, \xFCr\u0259k d\xF6y\xFCn\xFCr",
    "S\u0259ssizlikd\u0259 bel\u0259 e\u015Fidir\u0259m s\u0259ni",
    "Qulaql\u0131qda eyni melodiya",
    "Bir daha, bir daha\u2026",
    "",
    artist
  ];
  cache.set(key, fallback);
  return fallback;
}
export {
  fetchLyrics
};
