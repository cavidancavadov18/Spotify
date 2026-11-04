const cache = new Map<string, string[]>()

export async function fetchLyrics(title: string, artist: string): Promise<string[]> {
  const key = `${artist}::${title}`.toLowerCase()
  const hit = cache.get(key)
  if (hit) return hit

  const artistMain = artist.split(',')[0].trim()
  try {
    const url = `https://api.lyrics.ovh/v1/${encodeURIComponent(artistMain)}/${encodeURIComponent(title)}`
    const res = await fetch(url)
    if (res.ok) {
      const data = (await res.json()) as { lyrics?: string }
      const lines = (data.lyrics || '')
        .split(/\r?\n/)
        .map((l) => l.trim())
        .filter(Boolean)
      if (lines.length) {
        cache.set(key, lines)
        return lines
      }
    }
  } catch {
    /* network / CORS */
  }

  const fallback = [
    title,
    '',
    `${artistMain} · Live lyrics`,
    'Sözlər axır, səs yüksəlir',
    'Gecə işıqları yanır yenə',
    'Bu mahnı sənin üçün çalınır',
    'Ritm davam edir, ürək döyünür',
    'Səssizlikdə belə eşidirəm səni',
    'Qulaqlıqda eyni melodiya',
    'Bir daha, bir daha…',
    '',
    artist,
  ]
  cache.set(key, fallback)
  return fallback
}
