#!/bin/bash
# Kervan Kahve — tam sayfa ekran görüntüsü yakalayıcı (görsel karşılaştırma için)
#
# kullanım:
#   tests/ekran-goruntusu-al.sh docs/before http://127.0.0.1:8899   # eski sürüm
#   tests/ekran-goruntusu-al.sh docs/after  http://127.0.0.1:8900   # yeni build
#   python3 tests/karsilastir.py                                     # farkı ölç
#
# Sistemdeki Chrome'u headless çalıştırır, ayrı tarayıcı indirmez.
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
OUT="$1"
BASE="$2"
mkdir -p "$OUT"

PAGES="index shop hakkimizda ortaklik iletisim gizlilik-politikasi cerez-politikasi kullanim-sartlari"

shoot() { # ad, url, genişlik, yükseklik, etiket
  local name="$1" url="$2" w="$3" h="$4" tag="$5"
  "$CHROME" --headless --disable-gpu --hide-scrollbars --no-sandbox \
    --force-device-scale-factor=1 --virtual-time-budget=9000 \
    --screenshot="$OUT/${name}-${tag}.png" --window-size="${w},${h}" \
    "$url" >/dev/null 2>&1
  if [ -f "$OUT/${name}-${tag}.png" ]; then
    sips -s format jpeg -s formatOptions 55 "$OUT/${name}-${tag}.png" \
      --out "$OUT/${name}-${tag}.jpg" >/dev/null 2>&1
    rm -f "$OUT/${name}-${tag}.png"
    echo "  ✓ ${name}-${tag}  $(du -h "$OUT/${name}-${tag}.jpg" | cut -f1)"
  else
    echo "  ✗ ${name}-${tag} BAŞARISIZ"
  fi
}

for p in $PAGES; do
  echo "$p:"
  shoot "$p" "${BASE}/${p}.html" 1440 7000 masaustu
  shoot "$p" "${BASE}/${p}.html" 390  9000 mobil
done
