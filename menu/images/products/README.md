# Ürün Görselleri — Optimizasyon Kılavuzu

## Dosya formatı
- **WebP** kullanın (.webp). Tarayıcı desteği %97+.
- Alternatif olarak AVIF de kabul edilebilir (daha iyi sıkıştırma, daha az destek).

## Boyut hedefleri
| Kullanım | Çözünürlük | Hedef boyut |
|----------|-----------|-------------|
| Ürün kartı | 320×320 px | ≤ 40 KB |
| İmza ürün | 640×640 px | ≤ 80 KB |

## Dönüştürme araçları
### Squoosh (tarayıcı tabanlı, önerilir)
https://squoosh.app — Sürükle/bırak, WebP çıktısı, görsel kalitesi kontrolü

### ImageMagick (terminal)
```bash
magick input.jpg -resize 320x320^ -gravity center -extent 320x320 \
  -strip -quality 82 output.webp
```

### ffmpeg (toplu dönüştürme)
```bash
for f in *.jpg; do
  ffmpeg -i "$f" -vf scale=320:320:force_original_aspect_ratio=decrease \
    -quality 82 "${f%.jpg}.webp"
done
```

## Dosya adlandırma
`menu.json`'daki `image` alanıyla birebir eşleşmeli:
- `/menu/images/products/espresso.webp`
- `/menu/images/products/cold-brew.webp`
- `/menu/images/products/kervan-blend.webp`
- … vb.

## Görsel yoksa
`menu.json`'da `"image": null` bırakın — bileşen otomatik emoji placeholder gösterir.
