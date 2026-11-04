#!/usr/bin/env python3
"""Download real artist portraits from Wikipedia / Wikimedia Commons."""
from __future__ import annotations

import json
import ssl
import time
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
ARTISTS = ROOT / "public" / "artists"
COVERS = ROOT / "public" / "covers"
ARTISTS.mkdir(parents=True, exist_ok=True)
COVERS.mkdir(parents=True, exist_ok=True)

UA = "SpotifyWebPlayerClone/1.0 (educational local app; contact: local)"
CTX = ssl.create_default_context()

# Hardcoded high-quality Commons originals when wiki thumb is tiny/wrong
DIRECT: dict[str, str] = {
    "aygun-kazimova": "https://upload.wikimedia.org/wikipedia/commons/4/46/Ayg%C3%BCn_Kaz%C4%B1mova_%282025%29.jpg",
    "sezen-aksu": "https://upload.wikimedia.org/wikipedia/commons/d/da/Sezen_Aksu_%C4%B0T%C3%9C_Konseri_1.JPG",
    "tarkan": "https://upload.wikimedia.org/wikipedia/commons/6/62/Tarkan_%289%29.jpg",
    "alim-qasimov": "https://upload.wikimedia.org/wikipedia/commons/8/8e/Alim_Qasimov.jpg",
    "baris-manco": "https://upload.wikimedia.org/wikipedia/commons/4/4c/Baris_Manco.jpg",
    "sertab-erener": "https://upload.wikimedia.org/wikipedia/commons/5/5a/Sertab_Erener.jpg",
    "ajda-pekkan": "https://upload.wikimedia.org/wikipedia/commons/2/2e/Ajda_Pekkan_2012.jpg",
    "ibrahim-tatlises": "https://upload.wikimedia.org/wikipedia/commons/3/3a/%C4%B0brahim_Tatl%C4%B1ses.jpg",
    "orhan-gencebay": "https://upload.wikimedia.org/wikipedia/commons/9/9a/Orhan_Gencebay.jpg",
    "zeki-muren": "https://upload.wikimedia.org/wikipedia/commons/0/0e/Zeki_M%C3%BCren.jpg",
    "hadise": "https://upload.wikimedia.org/wikipedia/commons/4/4a/Hadise_2011.jpg",
    "manga": "https://upload.wikimedia.org/wikipedia/commons/8/87/MaNga_2010.jpg",
    "duman": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/Duman_band.jpg/800px-Duman_band.jpg",
    "mfo": "https://upload.wikimedia.org/wikipedia/commons/8/85/Mazhar_Fuat_%C3%96zkan.jpg",
    "chingiz": "https://upload.wikimedia.org/wikipedia/commons/8/8a/Chingiz_Mustafayev_%28Eurovision_2019%29.jpg",
    "samira-efendi": "https://upload.wikimedia.org/wikipedia/commons/1/1e/Samira_Efendi_%282021%29.jpg",
    "sabina-babayeva": "https://upload.wikimedia.org/wikipedia/commons/7/7c/Sabina_Babayeva.jpg",
    "elnur-huseynov": "https://upload.wikimedia.org/wikipedia/commons/0/0e/Elnur_H%C3%BCseynov.jpg",
    "dilara-kazimova": "https://upload.wikimedia.org/wikipedia/commons/5/55/Dilara_Kazimova.jpg",
    "ceza": "https://upload.wikimedia.org/wikipedia/commons/5/5c/Ceza.jpg",
    "sagopa-kajmer": "https://upload.wikimedia.org/wikipedia/commons/2/2f/Sagopa_Kajmer.jpg",
    "teoman": "https://upload.wikimedia.org/wikipedia/commons/3/3e/Teoman.jpg",
    "sebnem-ferah": "https://upload.wikimedia.org/wikipedia/commons/6/6a/%C5%9Eebnem_Ferah.jpg",
    "mor-ve-otesi": "https://upload.wikimedia.org/wikipedia/commons/d/d5/Mor_ve_%C3%96tesi.jpg",
    "athena": "https://upload.wikimedia.org/wikipedia/commons/a/a8/Athena_band.jpg",
    "mustafa-sandal": "https://upload.wikimedia.org/wikipedia/commons/7/7a/Mustafa_Sandal.jpg",
    "kenan-dogulu": "https://upload.wikimedia.org/wikipedia/commons/9/91/Kenan_Do%C4%9Fulu.jpg",
    "hande-yener": "https://upload.wikimedia.org/wikipedia/commons/4/48/Hande_Yener.jpg",
    "gulsen": "https://upload.wikimedia.org/wikipedia/commons/8/84/G%C3%BCl%C5%9Fen.jpg",
    "murat-boz": "https://upload.wikimedia.org/wikipedia/commons/1/1d/Murat_Boz.jpg",
    "sila": "https://upload.wikimedia.org/wikipedia/commons/5/5e/S%C4%B1la_Gen%C3%A7o%C4%9Flu.jpg",
    "aleyna-tilki": "https://upload.wikimedia.org/wikipedia/commons/3/3d/Aleyna_Tilki.jpg",
    "edis": "https://upload.wikimedia.org/wikipedia/commons/9/9e/Edis.jpg",
    "mabel-matiz": "https://upload.wikimedia.org/wikipedia/commons/c/c2/Mabel_Matiz.jpg",
    "simge": "https://upload.wikimedia.org/wikipedia/commons/2/2a/Simge_Sa%C4%9F%C4%B1n.jpg",
    "zeynep-bastik": "https://upload.wikimedia.org/wikipedia/commons/f/f1/Zeynep_Bast%C4%B1k.jpg",
    "yalin": "https://upload.wikimedia.org/wikipedia/commons/e/e8/Yal%C4%B1n.jpg",
    "ebru-yasar": "https://upload.wikimedia.org/wikipedia/commons/d/d4/Ebru_Ya%C5%9Far.jpg",
    "bengu": "https://upload.wikimedia.org/wikipedia/commons/b/b8/Beng%C3%BC.jpg",
    "miri-yusif": "https://upload.wikimedia.org/wikipedia/commons/4/45/Miri_Yusif.jpg",
    "faiq-agayev": "https://upload.wikimedia.org/wikipedia/commons/6/6f/Faig_Aghayev.jpg",
}

# slug -> [(lang, title), ...]
WIKI: dict[str, list[tuple[str, str]]] = {
    "aygun-kazimova": [("az", "Aygün_Kazımova"), ("en", "Aygün_Kazımova"), ("ru", "Кязимова,_Айгюн")],
    "roya": [("az", "Röya"), ("en", "Roya_(singer)"), ("tr", "Röya_Ayxan")],
    "brilliant-dadasova": [("az", "Brilliant_Dadaşova"), ("en", "Brilliant_Dadashova")],
    "zulfiyye-xanbabayeva": [("az", "Zülfiyyə_Xanbabayeva")],
    "flora-kerimova": [("az", "Flora_Kərimova")],
    "nesimi-memmedov": [("az", "Nəsimi_(müğənni)"), ("az", "Nəsimi_Məmmədov")],
    "miri-yusif": [("az", "Miri_Yusif"), ("en", "Miri_Yusif")],
    "elnur-huseynov": [("az", "Elnur_Hüseynov"), ("en", "Elnur_Hüseynov")],
    "alim-qasimov": [("en", "Alim_Qasimov"), ("az", "Alim_Qasımov")],
    "qara-17": [("az", "Qara_17")],
    "cleopatra": [("az", "Cleopatra_(Azərbaycan_müğənnisi)")],
    "manana": [("az", "Manana_Cafarova"), ("az", "Manana")],
    "aygun-beyler": [("az", "Aygün_Beyler")],
    "tunzale": [("az", "Tünzalə_Ağayeva"), ("az", "Tunzalə_Ağayeva")],
    "elsad-xose": [("az", "Elşad_Xose")],
    "sabina-babayeva": [("en", "Sabina_Babayeva"), ("az", "Səbinə_Babayeva")],
    "dilara-kazimova": [("en", "Dilara_Kazimova")],
    "chingiz": [("en", "Chingiz_Mustafayev_(singer)"), ("az", "Çingiz_Mustafayev_(müğənni)")],
    "samira-efendi": [("en", "Samira_Efendi"), ("az", "Səmirə_Əfəndiyeva")],
    "faiq-agayev": [("az", "Faiq_Ağayev"), ("en", "Faig_Aghayev")],
    "sezen-aksu": [("tr", "Sezen_Aksu"), ("en", "Sezen_Aksu")],
    "tarkan": [("tr", "Tarkan_(şarkıcı)"), ("en", "Tarkan_(singer)")],
    "sertab-erener": [("tr", "Sertab_Erener"), ("en", "Sertab_Erener")],
    "ajda-pekkan": [("tr", "Ajda_Pekkan"), ("en", "Ajda_Pekkan")],
    "baris-manco": [("tr", "Barış_Manço"), ("en", "Barış_Manço")],
    "mfo": [("tr", "MFÖ"), ("en", "MFÖ")],
    "duman": [("tr", "Duman_(müzik_grubu)"), ("en", "Duman_(band)")],
    "manga": [("tr", "maNga"), ("en", "Manga_(band)")],
    "hadise": [("tr", "Hadise"), ("en", "Hadise")],
    "hande-yener": [("tr", "Hande_Yener"), ("en", "Hande_Yener")],
    "mustafa-sandal": [("tr", "Mustafa_Sandal"), ("en", "Mustafa_Sandal")],
    "kenan-dogulu": [("tr", "Kenan_Doğulu"), ("en", "Kenan_Doğulu")],
    "ibrahim-tatlises": [("tr", "İbrahim_Tatlıses"), ("en", "İbrahim_Tatlıses")],
    "orhan-gencebay": [("tr", "Orhan_Gencebay"), ("en", "Orhan_Gencebay")],
    "zeki-muren": [("tr", "Zeki_Müren"), ("en", "Zeki_Müren")],
    "gulsen": [("tr", "Gülşen_(şarkıcı)"), ("en", "Gülşen_(singer)")],
    "aleyna-tilki": [("tr", "Aleyna_Tilki"), ("en", "Aleyna_Tilki")],
    "edis": [("tr", "Edis_(şarkıcı)"), ("en", "Edis_(singer)")],
    "mabel-matiz": [("tr", "Mabel_Matiz"), ("en", "Mabel_Matiz")],
    "sagopa-kajmer": [("tr", "Sagopa_Kajmer"), ("en", "Sagopa_Kajmer")],
    "ceza": [("tr", "Ceza"), ("en", "Ceza_(rapper)")],
    "sebnem-ferah": [("tr", "Şebnem_Ferah"), ("en", "Şebnem_Ferah")],
    "teoman": [("tr", "Teoman"), ("en", "Teoman_(singer)")],
    "athena": [("tr", "Athena_(grup)"), ("en", "Athena_(band)")],
    "mor-ve-otesi": [("tr", "Mor_ve_Ötesi"), ("en", "Mor_ve_Ötesi")],
    "yalin": [("tr", "Yalın"), ("en", "Yalın")],
    "sila": [("tr", "Sıla_Gençoğlu"), ("en", "Sıla_(singer)")],
    "simge": [("tr", "Simge_(şarkıcı)"), ("en", "Simge_(singer)")],
    "zeynep-bastik": [("tr", "Zeynep_Bastık"), ("en", "Zeynep_Bastık")],
    "murat-boz": [("tr", "Murat_Boz"), ("en", "Murat_Boz")],
    "ebru-yasar": [("tr", "Ebru_Yaşar"), ("en", "Ebru_Yaşar")],
    "bengu": [("tr", "Bengü"), ("en", "Bengü")],
    "gulden-karabocek": [("tr", "Gülden_Karaböcek")],
}


def get(url: str, timeout: int = 40) -> bytes | None:
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": "*/*"})
    try:
        with urllib.request.urlopen(req, context=CTX, timeout=timeout) as r:
            return r.read()
    except Exception as e:
        print(f"  fail {e.__class__.__name__}: {url[:90]}")
        return None


def wiki_image(lang: str, title: str) -> str | None:
    # Prefer pageimages API with large thumb
    api = (
        f"https://{lang}.wikipedia.org/w/api.php?"
        + urllib.parse.urlencode(
            {
                "action": "query",
                "titles": title.replace("_", " "),
                "prop": "pageimages",
                "format": "json",
                "pithumbsize": "1000",
                "pilicense": "any",
            }
        )
    )
    raw = get(api)
    if raw:
        data = json.loads(raw.decode("utf-8", errors="ignore"))
        pages = data.get("query", {}).get("pages", {})
        for page in pages.values():
            thumb = page.get("thumbnail", {}).get("source")
            if thumb:
                # bump size if thumb URL
                return thumb.replace("/330px-", "/800px-").replace("/250px-", "/800px-")
            oi = page.get("original", {}).get("source")
            if oi:
                return oi

    # REST summary fallback
    enc = urllib.parse.quote(title.replace(" ", "_"), safe="")
    raw = get(f"https://{lang}.wikipedia.org/api/rest_v1/page/summary/{enc}")
    if not raw:
        return None
    data = json.loads(raw.decode("utf-8", errors="ignore"))
    if data.get("originalimage", {}).get("source"):
        return data["originalimage"]["source"]
    if data.get("thumbnail", {}).get("source"):
        return data["thumbnail"]["source"]
    return None


def commons_search(query: str) -> str | None:
    api = (
        "https://commons.wikimedia.org/w/api.php?"
        + urllib.parse.urlencode(
            {
                "action": "query",
                "generator": "search",
                "gsrsearch": query,
                "gsrnamespace": 6,
                "gsrlimit": 8,
                "prop": "imageinfo",
                "iiprop": "url|size|mime",
                "format": "json",
            }
        )
    )
    raw = get(api)
    if not raw:
        return None
    data = json.loads(raw.decode("utf-8", errors="ignore"))
    pages = list(data.get("query", {}).get("pages", {}).values())
    # Prefer larger jpeg/png photos, skip signatures/busts/logos
    scored: list[tuple[int, str]] = []
    for p in pages:
        title = p.get("title", "").lower()
        if any(x in title for x in ("signature", "logo", "bust", "svg", "icon")):
            continue
        info = (p.get("imageinfo") or [{}])[0]
        mime = info.get("mime", "")
        if mime not in ("image/jpeg", "image/png", "image/webp"):
            continue
        url = info.get("url")
        size = int(info.get("size") or 0)
        if url and size > 15000:
            scored.append((size, url.split("?")[0]))
    scored.sort(reverse=True)
    return scored[0][1] if scored else None


def save_bytes(data: bytes, slug: str) -> bool:
    if len(data) < 8000:
        return False
    # reject tiny / identical unsplash-ish junk under 20kb unless rare
    path_a = ARTISTS / f"{slug}.jpg"
    path_c = COVERS / f"{slug}.jpg"
    path_a.write_bytes(data)
    path_c.write_bytes(data)
    return True


def download_url(url: str) -> bytes | None:
    clean = url.split("?")[0]
    data = get(clean)
    if data:
        return data
    return get(url)


def main() -> None:
    ok = fail = 0
    slugs = sorted(set(WIKI) | set(DIRECT))
    for i, slug in enumerate(slugs, 1):
        print(f"[{i}/{len(slugs)}] {slug}", end=" ", flush=True)
        urls: list[str] = []
        if slug in DIRECT:
            urls.append(DIRECT[slug])
        for lang, title in WIKI.get(slug, []):
            u = wiki_image(lang, title)
            if u:
                urls.append(u)
            time.sleep(0.15)
        # commons search with readable name
        name = slug.replace("-", " ")
        cu = commons_search(name)
        if cu:
            urls.append(cu)

        saved = False
        for url in urls:
            data = download_url(url)
            if data and save_bytes(data, slug):
                print(f"OK ({len(data)//1024}KB)")
                saved = True
                ok += 1
                break
            time.sleep(0.1)
        if not saved:
            print("FAIL")
            fail += 1
        time.sleep(0.2)
    print(f"Done ok={ok} fail={fail}")


if __name__ == "__main__":
    main()
