# Yapılacaklar

Tasarım yenilenmesi (Faz 1–6) tamamlandı, `tasarim-yenileme` dalında duruyor.
Aşağıdakiler açık kalan işler.

## Karar bekleyenler

- [ ] **İş ortağı logoları krem tonuna indirildi.** Koyu zeminde altı farklı
      marka rengi (pembe HARIO, kırmızı La Cimbali, siyah D'ORO) paleti
      dağıtıyordu; hepsi tek tona getirildi.
      *Tam renk istenirse:* `src/pages/index.astro` içindeki `.ortak-logo img`
      kuralından `filter: brightness(0) invert(1);` satırı silinir.

- [ ] **11 ürünün kaynak fotoğrafı düşük çözünürlüklü.** Orijinaller 500×500 ve
      ürün karenin ~%28'ini kaplıyor; zemin temizliği bilgi kaybetmiyor ama bu
      ürünler büyütmede küçük kalıyor. Çoğu DaVinci şurubu.
      *Çözüm:* tedarikçiden daha büyük görsel istemek.
      En küçükleri: `davinci-gourmet-cikolata-surup` (144×457),
      `davinci-gourmet-cilek-surup` (147×464),
      `davinci-gourmet-beyaz-cikolata` (147×469),
      `davinci-gourmet-vanilya-surup` (148×470),
      `davinci-gourmet-karamel-surup` (151×475),
      `kahve_ogutme` (192×365), `vosco2` (220×452), `tamper` (237×357),
      `elma-tarcin-cayi` (315×315), `buz_makinesi` (350×496),
      `şerbetlik` (355×457).

## Sayfa metinleri — gözden geçirilecek

### ÖNCE BUNLAR: doğrulanması gereken iddialar

Yenileme sırasında yeni metin yazıldı ve bazı yerlerde sitede daha önce
olmayan **somut iş iddiaları** girdi. Bunlar uydurma değil, makul çıkarımlar —
ama doğrulanmadan yayına çıkmamalı. Yanlışsa müşteriye verilmiş söz olur.

| Nerede | İddia | Durum |
|---|---|---|
| `iletisim.astro` | "Hafta içi 09:00–18:00 arası açığız" | **Tamamen yeni.** Çalışma saatleri sitede hiç yazmıyordu. Doğru mu? |
| `ortaklik.astro` SSS | "Mersin içinde aynı gün teslimat yapabiliyoruz" | **Tamamen yeni.** Eski metinde sadece "2-3 iş günü" vardı. |
| `ortaklik.astro` SSS | "Eğitimi işletmenizde, kendi ekipmanınız üzerinde veriyoruz" | **Genişletildi.** Eskisi: "genel destek sağlıyoruz". Eğitim gerçekten yerinde mi veriliyor? |
| `index.astro` + `ortaklik.astro` | "Makine seçiminde danışmanlık, **kurulum ve düzenli bakım**" | **Genişletildi.** Eskisi sadece "ekipman danışmanlığı"ydı. Kurulum ve bakım gerçekten veriliyor mu? |
| `index.astro` | "Mersin'deki **tesisimizde** kavuruyor" | Kavurma iddiası eskiden de vardı ama "tesis" kelimesi yeni. Kendi kavurma tesisi var mı? |
| `index.astro` + `ortaklik.astro` | "100'den fazla **kafe, restoran ve otelle** çalışıyoruz" | Sayı `hakkimizda`'dan geliyordu; segment ayrımı (otel dahil) yeni. |

### Sonra: eski metinlerin tonu

Sitenin konumlandırması yenilendi — artık "nitelikli kahve tutkusu" değil,
"kafenin ihtiyacı olan her şey tek tedarikçiden". Ama bazı metinler eski
romantik tonda kaldı ve yeni ana sayfayla çelişiyor:

- **Footer açıklaması:** "Nitelikli kahve çekirdeklerini tutkuyla kavuruyor,
  işletmelere ve kahve severlere ulaştırıyoruz." Her sayfanın altında duruyor
  ve ana sayfadaki iddiayla aynı şeyi söylemiyor.
- **`hakkimizda` hero:** "Kahveye Olan Tutkumuz" — aynı eski ton.
- **Misyon / Vizyon:** kurumsal kalıp cümleler ("sektörde standart belirleyen
  marka olmak"). Kimse okumuyor, hiçbir şey söylemiyor.
- **Değerlerimiz:** Kalite, Güvenilirlik, Müşteri Odaklılık, Yenilikçilik.
  Bunlar herhangi bir şirketin değerleri; Kervan'a dair hiçbir şey anlatmıyor.
  Ya somutlaşmalı ya kalkmalı.

### Küçük tutarsızlıklar

- **Sayfa başlıkları karışık:** `index` ve `ortaklik` artık "Kervan Kahve —
  ..." biçiminde (uzun tire), diğerleri hâlâ "... - Kervan Kahve" (kısa tire).
  Tek biçime indirilmeli.
- **Tat notları dolgu olabiliyor:** `products.js` içinde Bubble Tea'nin notları
  "modern / trend / çok amaçlı" — bunlar tat notu değil. Ürün föyünde artık
  görünür oldukları için gözden geçirilmeli.
- **Meta açıklamalar** bazı sayfalarda hâlâ eski konumlandırmayı anlatıyor.
- **"Çikolatalı Kurabiye" adı doğrulanmalı.** Ürün önce "Brownie" olarak
  kayıtlıydı ama görselde çatlak yüzeyli bir çikolatalı kurabiye var; ad
  görsele göre düzeltildi. D'ORO'nun bu ürün için resmî bir adı varsa o
  kullanılmalı (`products.js` id=64, slug `doro-cake-cikolatali-kurabiye`).


## QR menü — karar bekliyor

`/menu` şu an "yenileniyor" yer tutucusu. Eski QR menü uygulamasının kaynağı
yok; sayfa, basılı QR kodlar kırılmasın diye duruyor (`noindex`, sitemap
dışında). WhatsApp ve telefon bağlantısı veriyor.

### Önce şu netleşmeli: bu kimin menüsü?

Her şey buna bağlı. Üç ihtimal var ve üçü bambaşka iş:

**A — Kervan'ın kendi dükkânı.** Cami Şerif'teki kuru kahveci tezgâhındaki QR.
Gelen müşteri ne satıldığını görsün. En basiti; katalog zaten var, fiyat
eklenip kategorilere bölünmesi yeterli.

**B — Tedarik ettiğimiz kafelerin masalarındaki menü.** Yani Kervan, kafeye
kahveyi de menüyü de veriyor. Stratejik olarak en güçlüsü:
- Sitenin yeni konumlandırması zaten "tek tedarikçi + biz destekliyoruz".
  Ana sayfada "Özel karışım / Barista eğitimi / Ekipman ve servis" var;
  "Menünüzü de biz kuralım" doğal dördüncü madde.
- Kafenin menüsü Kervan'ın sisteminde çalışıyorsa tedarikçi değiştirmek
  zorlaşır.
- Her masada küçük bir "Kervan Kahve" imzası olur — tam hedef kitlenin
  (diğer kafe sahiplerinin) gözü önünde, bedava tanıtım.

**C — Saha ekibinin kataloğu.** Kafeye giden temsilcinin tablette gösterdiği
ürün listesi. Aslında `/shop` bunu zaten yapıyor; ayrı bir menüye gerek yok.

**Sorulacak:** Şu an basılı olan QR kodlar nerede duruyor? Dükkânda mı,
kafelerde mi? Kaç tane?

### B seçilirse: altyapı gerekmiyor

Site statik Astro; çok kiracılı bir menü sistemi kurmaya gerek yok:
- Kafe başına bir veri dosyası: `src/data/menuler/<kafe-slug>.js`
- Build çıktısı: `/menu/<kafe-slug>.html`
- Güncellemeyi Kervan yapar (self-servis değil, hizmetin parçası)
- Veritabanı yok, giriş yok, aylık maliyet yok

2-3 kafeyle pilot; talep gelirse self-servise o zaman bakılır.

### Çözülmesi gereken teknik konu: fiyat

`products.js` içinde fiyat alanı **yok** ve olmamalı da — toptan fiyat
müşteriye göre pazarlıkla belirleniyor, siteye açık yazılamaz. Ama bir kafe
menüsünün fiyata ihtiyacı var ve o fiyat kafenin kendi perakende fiyatı,
Kervan'ınki değil.

Yani menü verisi ürün kataloğundan **ayrı** tutulmalı: ürün adı ve görseli
katalogdan gelir, fiyat ve menü sıralaması kafeye ait olur.

### Tasarım notları (hangi yön seçilirse seçilsin)

Kafe masasında, kötü Wi-Fi'da, tek elle, güneş altında açılan bir sayfa:

- **Hız her şeyden önemli.** Statik HTML, çerçeve yok, görseller tembel
  yüklensin. Hedef: 3G'de 2 saniyenin altında ilk görünüm.
- **Tek elle kullanılabilsin.** Kategori gezinme başparmağın ulaştığı yerde
  (üstte değil altta ya da yapışkan şerit), tek uzun kaydırma değil.
- **Yakınlaştırma gerektirmesin.** Punto en az 16px; mevcut `text-govde` (18px)
  zaten uygun.
- **Güneş altında okunsun.** Kontrast tarafı hâlihazırda iyi (hepsi AA).
- **Uygulama indirme, çerez banner'ı, giriş yok.** Sıfır sürtünme.
- Fiyatlar sağa dayalı ve `tabular-nums` ile hizalı (token zaten var).
- Sayfa açıldığında ne olduğu belli olsun: kafenin adı ve logosu üstte,
  Kervan imzası altta küçük.

### Ne olursa olsun

`/menu` adresi çalışmaya devam etmeli — basılı QR kodların kaç tane ve nerede
olduğunu bilmiyoruz. Yeni yapı `/menu/<kafe>` ise, `/menu` bir seçim sayfası
ya da mevcut yer tutucu olarak kalır.


## Yayına alma

- [ ] `tasarim-yenileme` dalını `main`'e birleştir. Netlify `main`'i yayınlıyor;
      birleştirene kadar canlıda eski sürüm duruyor.
      ```bash
      git checkout main && git merge tasarim-yenileme
      ```

## Sonraki adımlar (öneri)

- [ ] **Ürün detay sayfaları.** `products.js` içinde her üründe `slug` var ve
      README'ye göre `/urun/<slug>` adresleri bunun için ayrılmış. Kataloğun
      SEO'su ve iş ortağının ürünü paylaşabilmesi için değerli.
- [ ] **Analytics.** Kurulursa çerez banner'ı da gerekir; `cerez-politikasi`
      sayfası buna göre güncellenmeli (şu an "çerez kullanmıyoruz" diyor).
- [ ] **Tailwind v4 geçişi.** README'de bilinçli olarak v3'te tutuluyor;
      ayrı bir iş olarak ele alınmalı.

## Referans

- Tasarım sözleşmesi: `.claude/skills/kervan-tasarim-sistemi/SKILL.md`
  (sayfa veya bileşen yazmadan önce okunmalı)
- Zemin temizleme aracı: `tools/kesit.swift`
- Orijinal görseller: `src/assets/_orijinal/`
- Yenilenme öncesi kayıt: https://claude.ai/code/artifact/d9c09d40-23d8-4401-82d8-f37d225cab14
- Önce/sonra raporu: https://claude.ai/code/artifact/963c45be-4b09-4345-b5ee-fb187b609613
