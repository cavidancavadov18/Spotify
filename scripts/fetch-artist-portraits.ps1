# Downloads high-res artist portraits (Wikimedia / Wikipedia) into public/artists and public/covers
$ErrorActionPreference = 'Stop'
$root = Split-Path $PSScriptRoot -Parent
$artistsDir = Join-Path $root 'public\artists'
$coversDir = Join-Path $root 'public\covers'
New-Item -ItemType Directory -Force -Path $artistsDir | Out-Null
New-Item -ItemType Directory -Force -Path $coversDir | Out-Null

$UA = 'SpotifyCloneDemo/1.0 (educational; local demo)'

function Get-WikiThumb([string]$title, [string]$lang = 'en') {
  $enc = [uri]::EscapeDataString($title)
  $url = "https://${lang}.wikipedia.org/api/rest_v1/page/summary/$enc"
  try {
    $r = Invoke-RestMethod -Uri $url -Headers @{ 'User-Agent' = $UA } -TimeoutSec 25
    if ($r.originalimage -and $r.originalimage.source) { return $r.originalimage.source }
    if ($r.thumbnail -and $r.thumbnail.source) { return $r.thumbnail.source }
  } catch {}
  return $null
}

function Save-Image([string]$url, [string]$path) {
  if (-not $url) { return $false }
  try {
    Invoke-WebRequest -Uri $url -OutFile $path -Headers @{ 'User-Agent' = $UA } -TimeoutSec 60
    $len = (Get-Item $path).Length
    if ($len -lt 2000) { Remove-Item $path -Force; return $false }
    return $true
  } catch {
    return $false
  }
}

# slug => wiki lookups (lang, title) + optional direct commons URL
$map = @(
  @{ slug = 'aygun-kazimova'; wiki = @(@{ l = 'az'; t = 'Aygün_Kazımova' }, @{ l = 'en'; t = 'Aygün_Kazımova' }); direct = 'https://upload.wikimedia.org/wikipedia/commons/4/46/Ayg%C3%BCn_Kaz%C4%B1mova_%282025%29.jpg' }
  @{ slug = 'roya'; wiki = @(@{ l = 'az'; t = 'Röya' }, @{ l = 'en'; t = 'Roya_(singer)' }) }
  @{ slug = 'brilliant-dadasova'; wiki = @(@{ l = 'az'; t = 'Brilliant_Dadaşova' }, @{ l = 'en'; t = 'Brilliant_Dadashova' }) }
  @{ slug = 'zulfiyye-xanbabayeva'; wiki = @(@{ l = 'az'; t = 'Zülfiyyə_Xanbabayeva' }) }
  @{ slug = 'flora-kerimova'; wiki = @(@{ l = 'az'; t = 'Flora_Kərimova' }) }
  @{ slug = 'nesimi-memmedov'; wiki = @(@{ l = 'az'; t = 'Nəsimi_(müğənni)' }, @{ l = 'az'; t = 'Nəsimi_Məmmədov' }) }
  @{ slug = 'miri-yusif'; wiki = @(@{ l = 'az'; t = 'Miri_Yusif' }, @{ l = 'en'; t = 'Miri_Yusif' }) }
  @{ slug = 'elnur-huseynov'; wiki = @(@{ l = 'az'; t = 'Elnur_Hüseynov' }, @{ l = 'en'; t = 'Elnur_Hüseynov' }) }
  @{ slug = 'alim-qasimov'; wiki = @(@{ l = 'en'; t = 'Alim_Qasimov' }, @{ l = 'az'; t = 'Alim_Qasımov' }) }
  @{ slug = 'qara-17'; wiki = @(@{ l = 'az'; t = 'Qara_17' }) }
  @{ slug = 'cleopatra'; wiki = @(@{ l = 'az'; t = 'Cleopatra_(müğənni)' }, @{ l = 'az'; t = 'Kleopatra_(müğənni)' }) }
  @{ slug = 'manana'; wiki = @(@{ l = 'az'; t = 'Manana_Cafarova' }, @{ l = 'az'; t = 'Manana' }) }
  @{ slug = 'aygun-beyler'; wiki = @(@{ l = 'az'; t = 'Aygün_Beyler' }) }
  @{ slug = 'tunzale'; wiki = @(@{ l = 'az'; t = 'Tünzalə_Ağayeva' }, @{ l = 'az'; t = 'Tunzalə_Ağayeva' }) }
  @{ slug = 'elsad-xose'; wiki = @(@{ l = 'az'; t = 'Elşad_Xose' }) }
  @{ slug = 'sabina-babayeva'; wiki = @(@{ l = 'en'; t = 'Sabina_Babayeva' }, @{ l = 'az'; t = 'Səbinə_Babayeva' }) }
  @{ slug = 'dilara-kazimova'; wiki = @(@{ l = 'en'; t = 'Dilara_Kazimova' }) }
  @{ slug = 'chingiz'; wiki = @(@{ l = 'en'; t = 'Chingiz_Mustafayev_(singer)' }, @{ l = 'az'; t = 'Çingiz_Mustafayev_(müğənni)' }) }
  @{ slug = 'samira-efendi'; wiki = @(@{ l = 'en'; t = 'Samira_Efendi' }, @{ l = 'az'; t = 'Səmirə_Əfəndi' }) }
  @{ slug = 'faiq-agayev'; wiki = @(@{ l = 'az'; t = 'Faiq_Ağayev' }, @{ l = 'en'; t = 'Faig_Aghayev' }) }
  @{ slug = 'sezen-aksu'; wiki = @(@{ l = 'en'; t = 'Sezen_Aksu' }, @{ l = 'tr'; t = 'Sezen_Aksu' }); direct = 'https://upload.wikimedia.org/wikipedia/commons/d/da/Sezen_Aksu_%C4%B0T%C3%9C_Konseri_1.JPG' }
  @{ slug = 'tarkan'; wiki = @(@{ l = 'en'; t = 'Tarkan_(singer)' }, @{ l = 'tr'; t = 'Tarkan_(şarkıcı)' }); direct = 'https://upload.wikimedia.org/wikipedia/commons/8/8b/Tarkan_Istanbul_2010.jpg' }
  @{ slug = 'sertab-erener'; wiki = @(@{ l = 'en'; t = 'Sertab_Erener' }, @{ l = 'tr'; t = 'Sertab_Erener' }) }
  @{ slug = 'ajda-pekkan'; wiki = @(@{ l = 'en'; t = 'Ajda_Pekkan' }, @{ l = 'tr'; t = 'Ajda_Pekkan' }) }
  @{ slug = 'baris-manco'; wiki = @(@{ l = 'en'; t = 'Barış_Manço' }, @{ l = 'tr'; t = 'Barış_Manço' }) }
  @{ slug = 'mfo'; wiki = @(@{ l = 'en'; t = 'MFÖ' }, @{ l = 'tr'; t = 'MFÖ' }) }
  @{ slug = 'duman'; wiki = @(@{ l = 'en'; t = 'Duman_(band)' }, @{ l = 'tr'; t = 'Duman_(müzik_grubu)' }) }
  @{ slug = 'manga'; wiki = @(@{ l = 'en'; t = 'Manga_(band)' }, @{ l = 'tr'; t = 'maNga' }) }
  @{ slug = 'hadise'; wiki = @(@{ l = 'en'; t = 'Hadise' }, @{ l = 'tr'; t = 'Hadise' }) }
  @{ slug = 'hande-yener'; wiki = @(@{ l = 'en'; t = 'Hande_Yener' }, @{ l = 'tr'; t = 'Hande_Yener' }) }
  @{ slug = 'mustafa-sandal'; wiki = @(@{ l = 'en'; t = 'Mustafa_Sandal' }, @{ l = 'tr'; t = 'Mustafa_Sandal' }) }
  @{ slug = 'kenan-dogulu'; wiki = @(@{ l = 'en'; t = 'Kenan_Doğulu' }, @{ l = 'tr'; t = 'Kenan_Doğulu' }) }
  @{ slug = 'ibrahim-tatlises'; wiki = @(@{ l = 'en'; t = 'İbrahim_Tatlıses' }, @{ l = 'tr'; t = 'İbrahim_Tatlıses' }) }
  @{ slug = 'orhan-gencebay'; wiki = @(@{ l = 'en'; t = 'Orhan_Gencebay' }, @{ l = 'tr'; t = 'Orhan_Gencebay' }) }
  @{ slug = 'zeki-muren'; wiki = @(@{ l = 'en'; t = 'Zeki_Müren' }, @{ l = 'tr'; t = 'Zeki_Müren' }) }
  @{ slug = 'gulsen'; wiki = @(@{ l = 'en'; t = 'Gülşen_(singer)' }, @{ l = 'tr'; t = 'Gülşen_(şarkıcı)' }) }
  @{ slug = 'aleyna-tilki'; wiki = @(@{ l = 'en'; t = 'Aleyna_Tilki' }, @{ l = 'tr'; t = 'Aleyna_Tilki' }) }
  @{ slug = 'edis'; wiki = @(@{ l = 'en'; t = 'Edis_(singer)' }, @{ l = 'tr'; t = 'Edis_(şarkıcı)' }) }
  @{ slug = 'mabel-matiz'; wiki = @(@{ l = 'en'; t = 'Mabel_Matiz' }, @{ l = 'tr'; t = 'Mabel_Matiz' }) }
  @{ slug = 'sagopa-kajmer'; wiki = @(@{ l = 'en'; t = 'Sagopa_Kajmer' }, @{ l = 'tr'; t = 'Sagopa_Kajmer' }) }
  @{ slug = 'ceza'; wiki = @(@{ l = 'en'; t = 'Ceza_(rapper)' }, @{ l = 'tr'; t = 'Ceza' }) }
  @{ slug = 'sebnem-ferah'; wiki = @(@{ l = 'en'; t = 'Şebnem_Ferah' }, @{ l = 'tr'; t = 'Şebnem_Ferah' }) }
  @{ slug = 'teoman'; wiki = @(@{ l = 'en'; t = 'Teoman_(singer)' }, @{ l = 'tr'; t = 'Teoman' }) }
  @{ slug = 'athena'; wiki = @(@{ l = 'en'; t = 'Athena_(band)' }, @{ l = 'tr'; t = 'Athena_(grup)' }) }
  @{ slug = 'mor-ve-otesi'; wiki = @(@{ l = 'en'; t = 'Mor_ve_Ötesi' }, @{ l = 'tr'; t = 'Mor_ve_Ötesi' }) }
  @{ slug = 'yalin'; wiki = @(@{ l = 'en'; t = 'Yalın' }, @{ l = 'tr'; t = 'Yalın' }) }
  @{ slug = 'sila'; wiki = @(@{ l = 'en'; t = 'Sıla_(singer)' }, @{ l = 'tr'; t = 'Sıla_Gençoğlu' }) }
  @{ slug = 'simge'; wiki = @(@{ l = 'en'; t = 'Simge_(singer)' }, @{ l = 'tr'; t = 'Simge_(şarkıcı)' }) }
  @{ slug = 'zeynep-bastik'; wiki = @(@{ l = 'en'; t = 'Zeynep_Bastık' }, @{ l = 'tr'; t = 'Zeynep_Bastık' }) }
  @{ slug = 'murat-boz'; wiki = @(@{ l = 'en'; t = 'Murat_Boz' }, @{ l = 'tr'; t = 'Murat_Boz' }) }
  @{ slug = 'ebru-yasar'; wiki = @(@{ l = 'en'; t = 'Ebru_Yaşar' }, @{ l = 'tr'; t = 'Ebru_Yaşar' }) }
  @{ slug = 'bengu'; wiki = @(@{ l = 'en'; t = 'Bengü' }, @{ l = 'tr'; t = 'Bengü' }) }
  @{ slug = 'gulden-karabocek'; wiki = @(@{ l = 'tr'; t = 'Gülden_Karaböcek' }, @{ l = 'en'; t = 'Gülden_Karaböcek' }) }
)

# High-quality Unsplash portrait fallbacks (unique per index) when wiki fails
$fallbacks = @(
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&h=800&fit=crop',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=800&fit=crop',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&h=800&fit=crop',
  'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&h=800&fit=crop',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&h=800&fit=crop',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&h=800&fit=crop',
  'https://images.unsplash.com/photo-1531746020798-a389fba3b081?w=800&h=800&fit=crop',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&h=800&fit=crop',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&h=800&fit=crop',
  'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=800&h=800&fit=crop'
)

$ok = 0; $fail = 0; $i = 0
foreach ($item in $map) {
  $i++
  $destA = Join-Path $artistsDir "$($item.slug).jpg"
  $destC = Join-Path $coversDir "$($item.slug).jpg"
  Write-Host "[$i/$($map.Count)] $($item.slug) ..." -NoNewline
  $url = $null
  if ($item.direct) { $url = $item.direct }
  if (-not $url) {
    foreach ($w in $item.wiki) {
      $url = Get-WikiThumb $w.t $w.l
      if ($url) { break }
    }
  }
  $saved = $false
  if ($url) { $saved = Save-Image $url $destA }
  if (-not $saved) {
    $fb = $fallbacks[($i - 1) % $fallbacks.Count]
    $saved = Save-Image $fb $destA
  }
  if ($saved) {
    Copy-Item $destA $destC -Force
    Write-Host " OK"
    $ok++
  } else {
    Write-Host " FAIL"
    $fail++
  }
  Start-Sleep -Milliseconds 350
}

Write-Host "Done. ok=$ok fail=$fail"
