#!/usr/bin/env python3
"""Kervan Kahve — önce/sonra ekran görüntüsü karşılaştırıcı.

kullanım: compare.py [sayfa-adi ...]     (boşsa docs/after içindeki hepsi)
"""
import sys, os, glob
from PIL import Image, ImageChops

BEFORE, AFTER, DIFF = 'docs/before', 'docs/after', 'docs/diff'
os.makedirs(DIFF, exist_ok=True)

# gözle görülmeyen JPEG sıkıştırma gürültüsünü saymamak için eşik
THRESHOLD = 24

names = sys.argv[1:]
if not names:
    names = sorted({os.path.basename(p).rsplit('.', 1)[0] for p in glob.glob(f'{AFTER}/*.jpg')})

print(f"{'sayfa':<38} {'farklı piksel':>14}  durum")
print('-' * 72)
worst = 0.0
for name in names:
    b_path, a_path = f'{BEFORE}/{name}.jpg', f'{AFTER}/{name}.jpg'
    if not (os.path.exists(b_path) and os.path.exists(a_path)):
        print(f'{name:<38} {"—":>14}  eksik dosya')
        continue

    b = Image.open(b_path).convert('RGB')
    a = Image.open(a_path).convert('RGB')
    if b.size != a.size:
        print(f'{name:<38} {"—":>14}  BOYUT FARKLI {b.size} vs {a.size}')
        continue

    diff = ImageChops.difference(b, a).convert('L')
    mask = diff.point(lambda v: 255 if v > THRESHOLD else 0)
    changed = sum(mask.histogram()[255:])
    total = b.size[0] * b.size[1]
    pct = changed / total * 100
    worst = max(worst, pct)

    if pct > 0.05:
        # farkı kırmızıyla işaretlenmiş görsel üret
        heat = a.copy()
        heat.paste(Image.new('RGB', a.size, (255, 0, 0)), mask=mask)
        heat.save(f'{DIFF}/{name}.jpg', quality=55)

    flag = 'AYNI' if pct < 0.05 else ('ufak fark' if pct < 1 else '>>> İNCELE')
    print(f'{name:<38} {pct:13.3f}%  {flag}')

print('-' * 72)
print(f'en yüksek fark: {worst:.3f}%')
