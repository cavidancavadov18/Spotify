$ErrorActionPreference = 'Continue'
$dirA = 'C:\Users\Cavadov\Desktop\Spotify\public\artists'
$dirC = 'C:\Users\Cavadov\Desktop\Spotify\public\covers'
$ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36'

# Verified Commons filenames (Special:FilePath)
$map = [ordered]@{
  'aygun-kazimova'      = 'Aygün_Kazımova_(2025).jpg'
  'sezen-aksu'          = 'Sezen_Aksu_İTÜ_Konseri_1.JPG'
  'tarkan'              = 'Tarkan_(9).jpg'
  'alim-qasimov'        = 'Alim_Gasimov.jpg'
  'hadise'              = 'Hadise.jpg'
  'chingiz'             = 'Chingizphoto.jpg'
  'sertab-erener'       = 'Sertab_Erener.jpg'
  'baris-manco'         = 'Barış_Manço.jpg'
  'ajda-pekkan'         = 'Ajda_Pekkan_cropped.jpg'
  'ibrahim-tatlises'    = 'İbrahim_Tatlıses.jpg'
  'zeki-muren'          = 'Zeki_Müren.jpg'
  'orhan-gencebay'      = 'Orhan_Gencebay.jpg'
  'manga'               = 'MaNga_2010.jpg'
  'mfo'                 = 'Mazhar_Alanson.jpg'
  'duman'               = 'Duman_(grup).jpg'
  'ceza'                = 'Ceza.jpg'
  'sagopa-kajmer'       = 'Sagopa_Kajmer.jpg'
  'teoman'              = 'Teoman.jpg'
  'sebnem-ferah'        = 'Sebnem_Ferah_VF.jpg'
  'mor-ve-otesi'        = 'Mor_ve_Ötesi.jpg'
  'athena'              = 'Gökhan_Özoğuz.jpg'
  'mustafa-sandal'      = 'Mustafa_Sandal.jpg'
  'kenan-dogulu'        = 'Kenan_Doğulu.jpg'
  'hande-yener'         = 'Hande_Yener.jpg'
  'gulsen'              = 'Gülşen.jpg'
  'murat-boz'           = 'Murat_Boz.jpg'
  'sila'                = 'Sıla.jpg'
  'aleyna-tilki'        = 'Aleyna_Tilki.png'
  'edis'                = 'Edis.jpg'
  'mabel-matiz'         = 'Mabel_Matiz.jpg'
  'simge'               = 'Simge.jpg'
  'zeynep-bastik'       = 'Zeynep_Bastık.jpg'
  'yalin'               = 'Yalın.jpg'
  'ebru-yasar'          = 'Ebru_Yaşar.jpg'
  'bengu'               = 'Bengü.jpg'
  'miri-yusif'          = 'Miri_Yusif.jpg'
  'elnur-huseynov'      = 'Elnur_Hüseynov.jpg'
  'sabina-babayeva'     = 'Sabina_Babayeva.jpg'
  'dilara-kazimova'     = 'Dilara_Kazimova,_ESC2014_Meet_&_Greet_01_(crop).jpg'
  'samira-efendi'       = 'Samira_Efendi_(2021).jpg'
  'faiq-agayev'         = 'Faig_Aghayev.jpg'
  'brilliant-dadasova'  = 'Brilliant_Dadashova.jpg'
  'zulfiyye-xanbabayeva'= 'Zülfiyyə_Xanbabayeva.jpg'
  'flora-kerimova'      = 'Flora_Kerimova.jpg'
  'roya'                = 'Roya_Ayxan.jpg'
  'tunzale'             = 'Tunzale.jpg'
  'gulden-karabocek'    = 'Gülden_Karaböcek.jpg'
  'nesimi-memmedov'     = 'Nəsimi.jpg'
  'manana'              = 'Manana.jpg'
  'aygun-beyler'        = 'Aygün_Beyler.jpg'
  'elsad-xose'          = 'Elşad_Xose.jpg'
  'qara-17'             = 'Qara_17.jpg'
  'cleopatra'           = 'Cleopatra_AZ.jpg'
}

function Test-Jpeg([string]$path) {
  if (-not (Test-Path $path)) { return $false }
  $len = (Get-Item $path).Length
  if ($len -lt 15000) { return $false }
  $bytes = [System.IO.File]::ReadAllBytes($path)[0..2]
  # JPEG FF D8 FF or PNG 89 50 4E
  if ($bytes[0] -eq 0xFF -and $bytes[1] -eq 0xD8) { return $true }
  if ($bytes[0] -eq 0x89 -and $bytes[1] -eq 0x50) { return $true }
  if ($bytes[0] -eq 0x52 -and $bytes[1] -eq 0x49) { return $true } # RIFF/webp
  return $false
}

function Get-WikiFile([string]$lang, [string]$title) {
  $q = [uri]::EscapeDataString($title)
  $api = "https://${lang}.wikipedia.org/w/api.php?action=query&titles=$q&prop=pageimages&format=json&pithumbsize=800&pilicense=any"
  try {
    $json = curl.exe -sL -A $ua --max-time 30 $api | ConvertFrom-Json
    foreach ($p in $json.query.pages.PSObject.Properties.Value) {
      if ($p.thumbnail -and $p.thumbnail.source) { return $p.thumbnail.source }
    }
  } catch {}
  return $null
}

$ok = 0; $fail = 0; $n = 0
foreach ($slug in $map.Keys) {
  $n++
  $out = Join-Path $dirA "$slug.jpg"
  Write-Host "[$n/$($map.Count)] $slug ..." -NoNewline

  # Skip if already a real JPEG > 50KB from previous good download
  if ((Test-Jpeg $out) -and ((Get-Item $out).Length -gt 50000) -and $slug -in @('aygun-kazimova','sezen-aksu','tarkan','alim-qasimov','hadise','chingiz')) {
    Copy-Item $out (Join-Path $dirC "$slug.jpg") -Force
    Write-Host " KEEP"
    $ok++; Start-Sleep -Seconds 1; continue
  }

  $file = $map[$slug]
  $url = "https://commons.wikimedia.org/wiki/Special:FilePath/$([uri]::EscapeDataString($file.Replace('_',' ')))?width=800"
  # Special:FilePath wants underscores usually
  $url2 = "https://commons.wikimedia.org/wiki/Special:FilePath/${file}?width=800"

  $saved = $false
  foreach ($u in @($url2, $url)) {
    curl.exe -sL -A $ua --max-time 40 -o $out $u 2>$null
    if (Test-Jpeg $out) {
      Copy-Item $out (Join-Path $dirC "$slug.jpg") -Force
      Write-Host (" OK {0}KB" -f [int]((Get-Item $out).Length/1KB))
      $saved = $true; $ok++; break
    }
    Start-Sleep -Seconds 2
  }

  if (-not $saved) {
    # Try Wikipedia pageimages for a few known titles
    $titles = @{
      'roya' = @(@('az','Röya'), @('en','Roya (singer)'))
      'tarkan' = @(@('en','Tarkan (singer)'))
      'sezen-aksu' = @(@('en','Sezen Aksu'))
      'gulsen' = @(@('tr','Gülşen (şarkıcı)'), @('en','Gülşen (singer)'))
      'hande-yener' = @(@('tr','Hande Yener'))
      'aleyna-tilki' = @(@('tr','Aleyna Tilki'), @('en','Aleyna Tilki'))
      'sila' = @(@('tr','Sıla Gençoğlu'), @('en','Sıla (singer)'))
      'edis' = @(@('tr','Edis (şarkıcı)'), @('en','Edis (singer)'))
      'bengu' = @(@('tr','Bengü'))
      'ebru-yasar' = @(@('tr','Ebru Yaşar'))
      'murat-boz' = @(@('tr','Murat Boz'))
      'mustafa-sandal' = @(@('tr','Mustafa Sandal'))
      'kenan-dogulu' = @(@('tr','Kenan Doğulu'))
      'simge' = @(@('tr','Simge (şarkıcı)'))
      'zeynep-bastik' = @(@('tr','Zeynep Bastık'))
      'yalin' = @(@('tr','Yalın'))
      'mabel-matiz' = @(@('tr','Mabel Matiz'))
      'teoman' = @(@('tr','Teoman'))
      'sebnem-ferah' = @(@('tr','Şebnem Ferah'))
      'duman' = @(@('tr','Duman (müzik grubu)'))
      'manga' = @(@('en','Manga (band)'))
      'samira-efendi' = @(@('en','Samira Efendi'))
      'elnur-huseynov' = @(@('en','Elnur Hüseynov'))
      'sabina-babayeva' = @(@('en','Sabina Babayeva'))
      'dilara-kazimova' = @(@('en','Dilara Kazimova'))
      'brilliant-dadasova' = @(@('az','Brilliant Dadaşova'))
      'miri-yusif' = @(@('az','Miri Yusif'))
      'faiq-agayev' = @(@('az','Faiq Ağayev'))
    }
    if ($titles.ContainsKey($slug)) {
      foreach ($pair in $titles[$slug]) {
        $src = Get-WikiFile $pair[0] $pair[1]
        if ($src) {
          curl.exe -sL -A $ua --max-time 40 -o $out $src 2>$null
          if (Test-Jpeg $out) {
            Copy-Item $out (Join-Path $dirC "$slug.jpg") -Force
            Write-Host (" WIKI {0}KB" -f [int]((Get-Item $out).Length/1KB))
            $saved = $true; $ok++; break
          }
        }
        Start-Sleep -Seconds 3
      }
    }
  }

  if (-not $saved) {
    Write-Host ' FAIL'
    $fail++
    if (Test-Path $out) {
      $b = [System.IO.File]::ReadAllBytes($out)[0]
      if ($b -eq 0x3C) { Remove-Item $out -Force } # HTML
    }
  }
  Start-Sleep -Seconds 5
}

Write-Host "Done ok=$ok fail=$fail"
