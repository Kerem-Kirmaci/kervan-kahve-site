---
name: kervan-tasarim-sistemi
description: Kervan Kahve sitesinin tasarım sözleşmesi — renk, tipografi, ölçek, ikon ve ürün görseli kuralları. Bu projede herhangi bir sayfa, bileşen veya stil yazmadan önce oku. Yeni ürün eklerken, bölüm tasarlarken veya CSS'e dokunurken geçerlidir.
---

# Kervan Kahve tasarım sistemi

Bu dosya bir üslup rehberi değil, bir **sözleşme**. Sitenin daha önce dağılmasının
sebebi böyle bir sözleşmenin hiç olmamasıydı: renkler dört ayrı kaynaktan geliyordu
(marka token'ları, Tailwind amber, Tailwind soğuk gray, ham hex), aynı buton iki
farklı renkteydi, aynı ürün iki farklı kartla gösteriliyordu.

Tek kaynak: `tailwind.config.mjs`. CSS değişkenleri `src/styles/global.css`.
İkisi aynı paleti okur; **yeni renk eklenmez**.

## Renk

| Token | Hex | Nerede |
|---|---|---|
| `kavurma` | `#2E1D10` | koyu yüzeyler: hero, ortaklık çağrısı, footer |
| `kabuk` | `#6B4526` | birincil buton, ikon, kenarlık |
| `altin` | `#E0A924` | **tek aksan** — koyu zeminde |
| `altin-koyu` | `#8A5B12` | aynı aksanın açık zemin karşılığı |
| `kum` | `#F1EADD` | sayfa zemini |
| `kagit` | `#FBF8F2` | kart ve panel yüzeyi |
| `murekkep` | `#241509` | açık zeminde birincil metin |
| `is` | `#6A5644` | açık zeminde ikincil metin |
| `krem` | `#F5EFE3` | koyu zeminde birincil metin |
| `krem-ikincil` | `#CDBBA2` | koyu zeminde ikincil metin |
| `cizgi` / `cizgi-koyu` | `#DED2BE` / `#46301D` | kenarlık (açık / koyu zeminde) |
| `hata` / `onay` | `#9C3D2A` / `#3F6B41` | form durumları — aksandan ayrı |

### Kurallar

1. **Altın yolu işaretler: altın olan her şey tıklanabilir.** Buton, bağlantı,
   bulunulan sayfanın işareti, odak halkası. Başka hiçbir şey.

   Zemine göre seçilir: koyu zeminde `altin`, açık zeminde `altin-koyu`. Aynı
   yüzeyde ikisi bir arada kullanılmaz.

   Altın **olmayanlar:** gövde metni, başlık, başlıktaki tek kelime, süs
   ikonu, istatistik sayısı, kenarlık, ayraç, kart zemini. Tıklanamayan bir
   şeyi altın yapmak istiyorsan cevap hayır — punto, kalınlık veya boşlukla
   çöz.

   **Dolu altın buton (`vurgu`) bölüm başına bir tane.** Uzun bir sayfa aynı
   eylemi altta bir kez tekrarlayabilir — ana sayfadaki "Teklif alın" ve "İş
   ortağı olun" ikisi de `/ortaklik.html`'e gidiyor, o yüzden bir eylem
   sayılıyor. İkinci bir *farklı* eylem altın olmaz.

   *(Bu kural önce "sayfa başına en fazla iki altın öğe" diye yazılmıştı ama
   hiçbir sayfa ona uymuyordu; sayı saymak yerine rol tarif ediyor artık.
   Sayfayı kurala çekmeye çalışma — kural sayfadan sonra yazıldı.)*
2. **Tailwind'in kendi renk skalaları kullanılmaz.** `amber-*`, `gray-*`, `blue-*`,
   `green-*` config'den kaldırıldı; yazarsan sınıf hiç üretilmez ve sessizce
   hiçbir şey olmaz. Bu bilinçli bir tuzak.
3. **Ham hex ve rgba yazma.** Gradyan ya da gölge için gerekiyorsa
   `var(--token)` kullan.
4. **Kontrast zorunlu.** Kullandığın her metin/zemin çifti WCAG AA geçmeli
   (küçük metin 4.5:1, ≥24px veya ≥18.66px kalın 3.0:1). Ölçmeden ekleme —
   sitenin eski vurgu rengi 2.65:1'di ve vurgulanmak istenen kelimeler
   sayfanın en okunmaz kelimeleriydi.

## Tipografi

Tek aile: **Archivo** (değişken, `wdth` ve `wght` eksenleriyle). Başlıklar
`font-stretch: 112%` kullanır — bu `global.css`'te `h1..h6` için zaten tanımlı,
tekrar yazma. İkinci bir yazı tipi ailesi eklenmez.

Altı adımlı ölçek — **arada değer yok**:

| Sınıf | Boyut | Kullanım |
|---|---|---|
| `text-mini` | 13px | rozet, etiket, yasal metin |
| `text-kucuk` | 15px | ikincil metin, kart başlığı, buton |
| `text-govde` | 18px | gövde metni |
| `text-alt` | 24px | h3, kart bölüm başlığı |
| `text-orta` | clamp 28–36px | h2, bölüm başlığı |
| `text-buyuk` | clamp 36–54px | h1, sayfa başına bir kez |

`text-orta` ve `text-buyuk` zaten `clamp()` kullanıyor — onlara `md:` `lg:`
kırılım varyantı **ekleme**, çakışır.

Satır uzunluğu 68 karakteri geçmez (`global.css` `p` için zaten uyguluyor;
gerekirse `max-w-okuma`).

### Yasak tipografik hamleler

- **Başlıkta tek kelimeyi renklendirme.** Sitede beş kez ve iki farklı sarıyla
  yapılıyordu; hepsi kaldırıldı. Vurgu gerekiyorsa cümleyi yeniden yaz.
- Etiketlerde ALL CAPS.
- İçeriğin üstüne "eyebrow" etiketi eklemek.
- Buton metnine `→` karakteri gömmek — ok gerekiyorsa `<Buton ikon="ok-sag" ikonSonda>`.

## Ölçekler

- **Yarıçap:** üç değer — `rounded-none`, `rounded` (6px), `rounded-tam` (9999px).
- **Gölge:** iki değer — `shadow-kart`, `shadow-yuzen` (menü, lightbox).
  **Kart hover'da gölge büyümez**; kenarlık koyulaşır (`hover:border-kabuk`).
- **Boşluk:** Tailwind'in 4px tabanlı ölçeği.

## Bileşenler — önce bunlara bak

| Bileşen | Ne için |
|---|---|
| `Ikon.astro` | **Sitedeki tek ikon kaynağı.** |
| `Buton.astro` | `birincil` / `ikincil` / `ikincil-koyu` / `vurgu` |
| `UrunKarti.astro` | `izgara` (mağaza) ve `serit` (kaydırıcı) varyantları |
| `Header` / `Footer` / `BottomNav` | şablon |

### İkon

Sitedeki tek `<svg>` `Ikon.astro`'nun içinde. Yeni ikon gerekiyorsa **oraya
ekle**; sayfaya satır içi SVG yazma, emoji kullanma, ikon fontu yükleme.
Site daha önce dört ikon sistemini aynı anda taşıyordu.

```astro
<Ikon ad="kahve" boyut={24} sinif="text-kabuk" />
```

Bilinmeyen bir `ad` build'i durdurur — bu kasıtlı.

### Buton

Elle buton yazma. Daha önce 15 farklı elle yazılmış varyant vardı.

```astro
<Buton href="/ortaklik.html" variant="vurgu" boyut="buyuk">Teklif alın</Buton>
```

`vurgu` altın demektir — bölüm başına bir tane ve yalnızca sayfanın birincil
eylemi için (bkz. Renk kuralı 1).

## Ürün görselleri

Katalogdaki bütün ürün görselleri **zemin temizliğinden geçmiş, şeffaf WebP**.
Kartın kendi zemini görselin arkasında görünür. Yeni ürün eklerken:

```bash
swiftc -O tools/kesit.swift -o tools/kesit     # bir kez
tools/kesit girdi.jpg cikti.png                # kesit al
```

Sonra 900px'e sığdırıp %5 şeffaf pay ekleyip WebP'ye çevir ve
`src/assets/images/<kategori>/<ad>.webp` olarak kaydet. Orijinali
`src/assets/_orijinal/` altına koy (bu dizin Astro'nun glob'unun dışında —
içeride olsa her görsel iki kez işlenirdi).

`products.js` içindeki `image` alanı **.webp** olmalı; yol yanlışsa build durur.

## Yerleşim

- Metin **sola dayalı**. Ortalanmış başlık + ortalanmış altyazı + ortalanmış
  buton kalıbı her bölümde tekrarlanınca ritmi düzleştiriyordu. İstisna:
  ikonu üstte olan küçük ızgara öğeleri.
- Zemin ritmi dönüşümlü: `kavurma` → `kum` → `kagit` → `kavurma`. Arka arkaya
  iki aynı zemin gelmesin.
- Her sayfada **görünür tek bir `h1`**. Header'daki logo yazısı bir başlık
  değildir (`span`).
- Mobil ve masaüstü için **ayrı DOM ağacı yazma**. Duyarlılık CSS ile çözülür.
  `index.astro` bu yüzden 1133 satırdı; birleştirilince 420'ye indi.

## Hareket

Tek açılış anı. Her bölümde `fade-in`, her kartta `hover-lift` yok —
üretilmiş tasarım izlenimi veriyor ve hepsi kaldırıldı. Kullanıcının
eylemine cevap veren hareket (açılma, genişleme) hoş karşılanır.
`prefers-reduced-motion` `global.css`'te zaten karşılanıyor.

## Değişiklikten sonra

```bash
npm run build && npm test          # 70 kontrol
```

Görsel değişiklik yaptıysan ayrıca:
- 320 / 375 / 768 / 900 / 1440 genişliklerde yatay taşma yok
- Kontrast: eklediğin her metin/zemin çifti AA geçiyor
- Klavyeyle gezinirken her etkileşimli öğede görünür odak halkası
