$ErrorActionPreference = 'Continue'
$dirA = 'C:\Users\Cavadov\Desktop\Spotify\public\artists'
$dirC = 'C:\Users\Cavadov\Desktop\Spotify\public\covers'
$ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/121.0.0.0 Safari/537.36'

function Test-Img([string]$p) {
  if (-not (Test-Path $p)) { return $false }
  if ((Get-Item $p).Length -lt 12000) { return $false }
  $b = [IO.File]::ReadAllBytes($p)[0..2]
  return ($b[0] -eq 0xFF -and $b[1] -eq 0xD8) -or ($b[0] -eq 0x89 -and $b[1] -eq 0x50)
}

function Save-From([string]$url, [string]$slug) {
  $out = Join-Path $dirA "$slug.jpg"
  curl.exe -sL -A $ua --max-time 50 -o $out $url 2>$null
  if (Test-Img $out) {
    Copy-Item $out (Join-Path $dirC "$slug.jpg") -Force
    return $true
  }
  return $false
}

function Wsrv([string]$commonsPath) {
  $enc = [uri]::EscapeDataString($commonsPath)
  return "https://wsrv.nl/?url=$enc&w=800&h=800&fit=cover&output=jpg&q=85"
}

# Direct commons relative paths that exist
$direct = [ordered]@{
  'aygun-kazimova' = 'upload.wikimedia.org/wikipedia/commons/4/46/Ayg%C3%BCn_Kaz%C4%B1mova_%282025%29.jpg'
  'sezen-aksu'     = 'upload.wikimedia.org/wikipedia/commons/d/da/Sezen_Aksu_%C4%B0T%C3%9C_Konseri_1.JPG'
  'tarkan'         = 'upload.wikimedia.org/wikipedia/commons/6/62/Tarkan_%289%29.jpg'
  'alim-qasimov'   = 'upload.wikimedia.org/wikipedia/commons/a/ac/Alim_Gasimov.jpg'
  'hadise'         = 'upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Hadise.jpg/800px-Hadise.jpg'
  'chingiz'        = 'upload.wikimedia.org/wikipedia/commons/8/85/Chingizphoto.jpg'
  'aleyna-tilki'   = 'upload.wikimedia.org/wikipedia/commons/d/dd/Aleyna_Tilki_%282021%29.png'
  'dilara-kazimova'= 'upload.wikimedia.org/wikipedia/commons/c/c1/Dilara_Kazimova%2C_ESC2014_Meet_%26_Greet_01_%28crop%29.jpg'
  'brilliant-dadasova' = 'upload.wikimedia.org/wikipedia/commons/b/bd/Brilliant_Dadashova.jpg'
  'faiq-agayev'    = 'upload.wikimedia.org/wikipedia/commons/6/6f/Faig_Aghayev.jpg'
  'sabina-babayeva'= 'upload.wikimedia.org/wikipedia/commons/7/7c/Sabina_Babayeva.jpg'
  'edis'           = 'upload.wikimedia.org/wikipedia/commons/b/b1/Edis_-_15._Radyo_Bo%C4%9Fazi%C3%A7i_M%C3%BCzik_%C3%96d%C3%BClleri.png'
  'mabel-matiz'    = 'upload.wikimedia.org/wikipedia/commons/c/c2/Mabel_Matiz.jpg'
  'orhan-gencebay' = 'upload.wikimedia.org/wikipedia/commons/9/9a/Orhan_Gencebay.jpg'
  'sebnem-ferah'   = 'upload.wikimedia.org/wikipedia/commons/7/70/Sebnem_Ferah_VF.jpg'
}

# Wikipedia titles for remaining
$wiki = [ordered]@{
  'roya' = @('az','Röya')
  'sertab-erener' = @('tr','Sertab Erener')
  'baris-manco' = @('tr','Barış Manço')
  'ajda-pekkan' = @('tr','Ajda Pekkan')
  'ibrahim-tatlises' = @('tr','İbrahim Tatlıses')
  'zeki-muren' = @('tr','Zeki Müren')
  'manga' = @('en','Manga (band)')
  'mfo' = @('tr','MFÖ')
  'duman' = @('tr','Duman (müzik grubu)')
  'ceza' = @('tr','Ceza')
  'sagopa-kajmer' = @('tr','Sagopa Kajmer')
  'teoman' = @('tr','Teoman')
  'mor-ve-otesi' = @('tr','Mor ve Ötesi')
  'athena' = @('tr','Athena (grup)')
  'mustafa-sandal' = @('tr','Mustafa Sandal')
  'kenan-dogulu' = @('tr','Kenan Doğulu')
  'hande-yener' = @('tr','Hande Yener')
  'gulsen' = @('tr','Gülşen (şarkıcı)')
  'murat-boz' = @('tr','Murat Boz')
  'sila' = @('tr','Sıla Gençoğlu')
  'simge' = @('tr','Simge (şarkıcı)')
  'zeynep-bastik' = @('tr','Zeynep Bastık')
  'yalin' = @('tr','Yalın')
  'ebru-yasar' = @('tr','Ebru Yaşar')
  'bengu' = @('tr','Bengü')
  'miri-yusif' = @('az','Miri Yusif')
  'elnur-huseynov' = @('en','Elnur Hüseynov')
  'samira-efendi' = @('en','Samira Efendi')
  'zulfiyye-xanbabayeva' = @('az','Zülfiyyə Xanbabayeva')
  'flora-kerimova' = @('az','Flora Kərimova')
  'tunzale' = @('az','Tünzalə Ağayeva')
  'gulden-karabocek' = @('tr','Gülden Karaböcek')
  'nesimi-memmedov' = @('az','Nəsimi (müğənni)')
  'manana' = @('az','Manana')
  'aygun-beyler' = @('az','Aygün Beyler')
  'elsad-xose' = @('az','Elşad Xose')
  'qara-17' = @('az','Qara 17')
  'cleopatra' = @('az','Cleopatra')
}

Write-Host '=== Direct via wsrv ==='
foreach ($slug in $direct.Keys) {
  Write-Host -NoNewline "$slug ... "
  if (Save-From (Wsrv $direct[$slug]) $slug) { Write-Host 'OK' } else { Write-Host 'FAIL' }
  Start-Sleep -Milliseconds 800
}

Write-Host '=== Wiki thumbs via wsrv ==='
foreach ($slug in $wiki.Keys) {
  Write-Host -NoNewline "$slug ... "
  $lang = $wiki[$slug][0]; $title = $wiki[$slug][1]
  $api = "https://${lang}.wikipedia.org/w/api.php?action=query&titles=$([uri]::EscapeDataString($title))&prop=pageimages&format=json&pithumbsize=800&pilicense=any"
  $jsonTxt = curl.exe -sL -A $ua --max-time 25 $api
  $src = $null
  try {
    $json = $jsonTxt | ConvertFrom-Json
    foreach ($p in $json.query.pages.PSObject.Properties.Value) {
      if ($p.thumbnail) { $src = $p.thumbnail.source }
    }
  } catch {}
  $ok = $false
  if ($src) {
    # strip query, proxy via wsrv
    $clean = ($src -split '\?')[0] -replace '^https://',''
    $ok = Save-From (Wsrv $clean) $slug
    if (-not $ok) { $ok = Save-From $src $slug }
  }
  if ($ok) { Write-Host 'OK' } else { Write-Host 'FAIL' }
  Start-Sleep -Seconds 2
}

$good = (Get-ChildItem $dirA -Filter *.jpg | Where-Object {
  $b=[IO.File]::ReadAllBytes($_.FullName)[0]; $b -eq 0xFF -or $b -eq 0x89
}).Count
Write-Host "Valid image files: $good"
