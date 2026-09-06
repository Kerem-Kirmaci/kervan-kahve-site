# Kervan Kahve

Kervan Kahve'nin kurumsal tanıtım ve ürün katalog sitesi. [Astro](https://astro.build) ile
yazılmış, tamamen statik HTML üretir ve Netlify'da yayınlanır.

Canlı adres: https://kervankahve.com

## Hızlı başlangıç

```bash
npm install
npm run dev        # http://localhost:4321
```

| Komut | Ne yapar |
| --- | --- |
| `npm run dev` | Geliştirme sunucusu (anlık yenileme) |
| `npm run build` | Statik siteyi `dist/` içine üretir |
| `npm run preview` | Üretilen `dist/` çıktısını önizler |
| `npm run serve:dist` | `dist/` klasörünü 8900 portundan sunar (test için) |
| `npm test` | Tarayıcıda işlevsel kontrol (aşağıya bakın) |
| `npm run check` | Astro tip/şablon denetimi |

## Klasör yapısı

```
src/
  pages/         Her dosya bir sayfa: index.astro → /index.html
  layouts/
    Base.astro   Ortak <head>, header, footer, alt menü
  components/    Header, Footer, BottomNav, Ikon, Buton, UrunKarti, Lightbox
  data/
    products.js       Ürün kataloğu (100 ürün)
    home-sliders.js   Ana sayfadaki kategori slider'larının içeriği
    product-images.js Görsel yolunu Astro görsel nesnesine çevirir
  scripts/       Sayfaya özel tarayıcı JS'i (modüller)
  styles/
    global.css   Tüm sayfalarda ortak stiller
  assets/images/ Kaynak görseller (build sırasında optimize edilir)
  assets/_orijinal/  Ürün görsellerinin zemin temizliği öncesi hâlleri.
                 Astro'nun glob'unun DIŞINDA — içeride olsa her görsel iki
                 kez işlenirdi.
public/          Olduğu gibi kopyalanan dosyalar (robots.txt, favicon, og-image)
tests/           İşlevsel test + görsel karşılaştırma araçları
tools/           kesit.swift — ürün görseli zemin temizleyici
.claude/skills/  Tasarım sözleşmesi ve frontend-design skill'i
```

## Tasarım sistemi

Renk, tipografi, ölçek, ikon ve ürün görseli kuralları
`.claude/skills/kervan-tasarim-sistemi/SKILL.md` içinde. **Sayfa veya bileşen
yazmadan önce okuyun.**

Özet:
- Tek kaynak `tailwind.config.mjs`. Tailwind'in `amber/gray/blue/green`
  skalaları bilinçli olarak kaldırıldı; yazarsanız sınıf üretilmez.
- Tek yazı tipi ailesi: Archivo (değişken).
- Tek ikon kaynağı: `src/components/Ikon.astro`. Sitedeki tek `<svg>` orada.
- Altı adımlı punto ölçeği, üç yarıçap, iki gölge.
- Altın (`altin`) tek aksan ve yalnızca tıklanabilir öğelerde: buton, bağlantı,
  aktif sayfa işareti, odak halkası. Süs ikonu veya istatistik sayısı altın olmaz.

### URL'ler neden `.html` uzantılı?

`astro.config.mjs` içinde `build.format: 'file'` ayarlı. Site yıllardır
`/shop.html` gibi adreslerle indekslendiği için bu adresler korunuyor; sayfa
eklerken de aynı biçimi kullanın.

## Ürün eklemek / düzenlemek

1. Görseli `src/assets/images/` altında uygun klasöre koyun.
2. `src/data/products.js` içine kaydı ekleyin. Zorunlu alanlar:
   `id`, `slug`, `name`, `brand`, `productName`, `description`, `category`,
   `image`, `featured`, `tastingNotes`.
   - `slug` benzersiz olmalı — ileride açılacak ürün detay sayfalarının adresi
     buradan üretilecek.
   - `image`, `src/assets/` sonrasındaki yoldur: `images/coffees/kenya.png`.
   - Yol yanlışsa build **hata verip durur**; bozuk görsel canlıya çıkmaz.
3. Ürünü ana sayfada öne çıkarmak istiyorsanız `src/data/home-sliders.js`
   içindeki ilgili kategorinin `oneCikanlar` listesine slug'ını ekleyin.

Görselleri elle küçültmeye gerek yok: Astro build sırasında WebP'ye çevirir,
kart ve büyütme (lightbox) için ayrı boyutlar üretir, `width`/`height`
özniteliklerini kendisi ekler.

### Ürün görselinin zeminini temizlemek

Katalogdaki bütün ürün görselleri şeffaf zeminli; kartın kendi zemini arkada
görünüyor. Tedarikçiden gelen görsellerin her biri kendi renkli stüdyo zemini
ile geldiği için katalog eskiden yamalı duruyordu.

```bash
swiftc -O tools/kesit.swift -o tools/kesit   # bir kez derlenir
tools/kesit girdi.jpg cikti.png              # şeffaf zeminli kesit
```

macOS Vision çerçevesini kullanır: model indirmez, cihaz üzerinde çalışır.
Sonra 900px'e sığdırıp %5 şeffaf pay ekleyip WebP'ye çevirin. Orijinali
`src/assets/_orijinal/` altına koyun.

## Test

Testler **derlenmiş çıktı** üzerinde çalışır, bu yüzden önce build alın:

```bash
npm run build
npm run serve:dist        # ayrı bir terminalde
npm test
```

70 kontrol yapılır: sayfa başlıkları, aktif menü vurgusu, mobil menü, mağaza
filtreleri ve arama, sonsuz kaydırma, lightbox, slider okları, ortaklık formu
ve KVKK onayı, iletişim sayfası (gömülü harita yok), görsel öznitelikleri,
yatay taşma ve konsol hataları.

Sistemdeki Chrome'u kullanır; ayrıca tarayıcı indirmez.

### Görsel karşılaştırma

Bir değişikliğin görünümü bozup bozmadığını ölçmek için:

```bash
tests/ekran-goruntusu-al.sh docs/before http://127.0.0.1:8899   # referans sürüm
tests/ekran-goruntusu-al.sh docs/after  http://127.0.0.1:8900   # yeni build
python3 tests/karsilastir.py
```

Her sayfayı masaüstü ve mobil boyutta tam sayfa yakalar, farklı piksel oranını
yüzde olarak raporlar ve farkı kırmızıyla işaretlenmiş görselleri `docs/diff/`
altına yazar. `docs/` klasörü git'e girmez.

## Yayınlama

`main` dalına push edildiğinde Netlify otomatik olarak `npm run build` çalıştırıp
`dist/` klasörünü yayınlar. Ayarlar `netlify.toml` içindedir.

## Notlar

- **Tailwind sürümü v3.** Site v3 sınıf davranışına göre yazıldığı için bilinçli
  olarak v3 LTS'te tutuluyor; v4'e geçiş varsayılan kenarlık rengi ve gölge
  adlandırması gibi görsel kırılmalar getirir, ayrı bir iş olarak ele alınmalı.
- **`/menu` geçici bir yer tutucudur.** Eski QR menü uygulaması kaynağı olmadan
  yalnızca build çıktısı olarak duruyordu; kaldırıldı. Basılı QR kodlar
  kırılmasın diye adres, iletişim bağlantıları içeren bir sayfa gösteriyor.
- **Analytics kurulu değil.** Eklenirse çerez banner'ı da gerekir; çerez
  politikası sayfası buna göre güncellenmeli.
- **Tailwind Typography eklentisi kurulu değil.** Yasal sayfalarda bir dönem
  `prose` sınıfları vardı ama hiçbir şey yapmıyorlardı; kaldırıldı.
- **İş ortağı logoları krem tonuna indiriliyor** (`filter: brightness(0)
  invert(1)`). Koyu zeminde altı farklı marka rengi paleti dağıtıyordu. Tam
  renk gerekiyorsa `index.astro` içindeki `.ortak-logo img` filtresi kaldırılır.
