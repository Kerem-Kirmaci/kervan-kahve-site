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

## Görseller — hangi fotoğraf sorun, hangisi değil

Sitedeki sahne fotoğraflarının bir kısmı yapay zekâ üretimi. Bunların hepsi
sorun değil; ölçüt "AI mi gerçek mi" değil, **görsel belirli bir iddiada
bulunuyor mu**:

- **İddia yok** (atmosfer, doku, sıcaklık) → AI veya stok sorun değil.
  Örnek: `coffees/turk-kahvesi.webp` — cezve, fincan, lokum. Kimseye ait
  değil, hiçbir şey iddia etmiyor, iş görüyor.
- **İddia var** (bu bizim ürünümüz / depomuz / ekipmanımız) → **vasat bir
  gerçek fotoğraf, güzel bir sahteden iyidir.** Telefonla çekilmiş net bir
  depo fotoğrafı, havada duran çekirdekten daha ikna edici.

Kaldırılan kategori şeridinin görselleri ikinci gruptaydı: şurup bandındaki
DaVinci ve Gusse şişeleri gerçek bayiliklerin sahte etiketli taklidiydi
("Gusse geda", "CHOCOLATE SYWOP", "VALILI"), tatlı bandı satılmayan katlı
düğün pastası gösteriyordu, ekipman bandı ev mutfağıydı ve makinenin
geometrisi imkânsızdı.

### Denetim sonucu

Ürün kataloğu dışındaki bütün görseller tek tek incelendi. Değişmesi
gerekenlerin üçü de değişti; dördü olduğu gibi kaldı.

| Görsel | Nerede | Durum |
|---|---|---|
| `about_us/hikayemiz.webp` | Hakkımızda → Hikayemiz | ✅ **Değişti** — denetimden geçmiş kavurmahane |
| `images/teslimat.webp` | Ana sayfa → Tedarikçiden fazlası | ✅ **Değişti** — kafeye varan sipariş (eski `tedarikci.jpeg` silindi) |
| `about_us/farkimiz.webp` | Hakkımızda → Bizi Farklı Kılan | ✅ **Değişti** — denetimden geçmiş tezgâh fotoğrafı |
| `about_us/hero-hakkimizda.webp` | Hakkımızda hero | Kalabilir — sadece doku, üstünde %80 perde var |
| `coffees/espresso.webp` | Ana sayfa kahve kartı | Kalabilir — jenerik espresso, iddia yok |
| `coffees/filtre-kahve.webp` | Ana sayfa kahve kartı | Kalabilir — jenerik demleme, iddia yok |
| `coffees/turk-kahvesi.webp` | Ana sayfa kahve kartı | Kalabilir — cezve/fincan, iddia yok |

Marka logoları (`partnerships/`), `logo.png` ve `og-image.jpg` gerçek; sorun yok.

## Sayfa metinleri — gözden geçirilecek

### ✅ İş iddiaları — hepsi doğrulandı

Yenileme sırasında sitede daha önce olmayan **somut iş iddiaları** girmişti.
Beşi de işletmeye sorulup doğrulandı; ikisi düzeltildi, üçü olduğu gibi
kaldı. Bundan sonra bu tür bir cümle eklenirse aynı yoldan geçmeli.

| Nerede | İddia | Durum |
|---|---|---|
| ~~`ortaklik.astro` SSS~~ | ~~"Mersin içinde aynı gün teslimat"~~ | ✅ **Çözüldü.** Böyle bir söz verilmiyormuş; süre siparişe göre değişiyor. Sabit süre taahhüdü kaldırıldı, yerine kendi aracıyla dağıtım yazıldı. |
| ~~`ortaklik.astro` SSS~~ | ~~"Eğitimi işletmenizde veriyoruz"~~ | ✅ **Doğrulandı.** |
| ~~`index.astro` + `ortaklik.astro`~~ | ~~"Kurulum ve düzenli bakım"~~ | ✅ **Doğrulandı.** |
| ~~`index.astro`~~ | ~~"Mersin'deki tesisimizde kavuruyor"~~ | ✅ **Doğrulandı.** "Tesis" ölçek ima ettiği için yumuşatıldı: "Mersin'de kendimiz kavuruyor". |
| ~~`index.astro` + `ortaklik.astro`~~ | ~~"100'den fazla kafe, restoran ve otelle"~~ | ✅ **Doğrulandı.** |

### ✅ Eski metinlerin tonu — yapıldı

Konumlandırma dağıtıma çevrildi. Asıl iş kahve değil **dağıtım ağı**: kahve
şirketin çıkış noktası, ama bugün gidenin içinde şurup, tatlandırıcı, tatlı,
çay ve ekipman da var. İsimde kahve geçmesi metinlerin yalnızca kahveyi
anlatmasını gerektirmiyor.

- ~~**Footer açıklaması**~~ → "Mersin ve çevresinde kafe, restoran ve otellere
  tedarik yapıyoruz: kahve, şurup, püre, tatlı, bitki çayı ve ekipman."
  Her sayfanın altında durduğu için sitenin genel iddiası buydu.
- ~~**`hakkimizda` hero**~~ → "Mersin'de kurulu bir dağıtım ağı".
- ~~**Misyon / Vizyon**~~ → bölüm kaldırıldı.
- ~~**Değerlerimiz**~~ → bölüm kaldırıldı. Dördü de jenerikti ve "Kalite:
  özenle **kavururuz**" satırı doğrulanmamış kavurma iddiası taşıyordu.
- Yerlerine tek bölüm: "Bizi Farklı Kılan" dağıtım üzerine yeniden yazıldı
  (tek elden tedarik / kendi aracımızla Mersin içi / menüye göre seçim /
  kullanım desteği).
- "Sürdürülebilir Tedarik — çevre dostu ambalaj ve **adil ticaret**" maddesi
  silindi. Adil ticaret sertifikaya bağlı bir terim, sertifika yok.
- `Sayılarla Kervan` sayıları veriden hesaplanıyor artık. Elle yazıldıkları
  için eskimişlerdi: "9 yıllık deneyim" iki yıl geride kalmıştı, "50+ farklı
  ürün" kataloğun yarısını saklıyordu (100 ürün var).

### ✅ Kavurma — doğrulandı

Kahveyi Kervan kendisi kavuruyor. Yani ana sayfadaki "Kendi kavurduğumuz
kahveler" bölümü ve kavurma iddiaları yerinde duruyor; `hakkimizda`'ya da
geri eklendi — ama sayfanın konusu olarak değil, dağıtım çerçevesi içinde
"salt aracı değiliz" diyen madde olarak. Hikayemiz metni artık "kahveyle
başladık ve kahveyi hâlâ kendimiz kavuruyoruz" diyor.

"Tesis" kelimesi ölçek ima ettiği için yumuşatıldı: cümle artık "Mersin'de
kendimiz kavuruyor" diyor.

### Küçük tutarsızlıklar

- **Sayfa başlıkları karışık:** `index` ve `ortaklik` artık "Kervan Kahve —
  ..." biçiminde (uzun tire), diğerleri hâlâ "... - Kervan Kahve" (kısa tire).
  Tek biçime indirilmeli.
- **Tat notları dolgu olabiliyor:** `products.js` içinde Bubble Tea'nin notları
  "modern / trend / çok amaçlı" — bunlar tat notu değil. Ürün föyünde artık
  görünür oldukları için gözden geçirilmeli.
- **Meta açıklamalar** bazı sayfalarda hâlâ eski konumlandırmayı anlatıyor.
- **13 tatlının adı fotoğraftan okunarak değiştirildi, doğrulanmalı.**
  "Premium/Deluxe" ekleri bilgi taşımıyordu; yerlerine görselde görünen ayırt
  edici özellik yazıldı. Ürünlerin tadına bakılmadı, ad görsele bakılarak
  verildi — yanlış olan varsa düzeltilmeli:
  Kakaolu / Pudra Şekerli / Çifte Fıstıklı / Fıstık Kremalı Çikolatalı Pasta,
  Çikolatalı Mus Bar, Frambuaz Jöleli Cheesecake, Frambuazlı Dilim Cheesecake,
  Yaban Mersini Soslu Cheesecake, Orman Meyveli Kremalı Pasta,
  Beyaz Çikolatalı Kare Pasta, Frambuazlı Çikolata Bar,
  Çikolata Küreli Brownie, Orman Meyveli Cheesecake.
- **"Çikolatalı Kurabiye"** önce "Brownie" olarak kayıtlıydı ama görselde
  çatlak yüzeyli bir kurabiye var. D'ORO'nun resmî bir adı varsa o kullanılmalı
  (`products.js` id=64, slug `doro-cake-cikolatali-kurabiye`).


### ✅ Tatlı adlarında marka riski — çözüldü

Dört tatlı başka şirketlerin tescilli markalarını ad olarak taşıyordu.
Dördü de `brand: DORO CAKE` kayıtlıydı, yani D'ORO'nun kendi ürünleriydi ve
adlar ödünç alınmıştı; açıklamalarda "Ferrero Rocher tarzı", "Red velvet
tarzı" gibi ifadelerle taklit olduğu zaten yazılıydı.

| Eski ad | Yeni ad |
|---|---|
| Ferrero Rocher | Fındıklı Çikolata Topu |
| Beyaz Çikolatalı Raffaello | Beyaz Çikolata Yongalı Pasta |
| Fıstıklı Albeni | Fıstık Kaplı Yuvarlak Pasta |
| Kırmızı Kadife Albeni | Kırmızı Kadife Yuvarlak Pasta |

Adlar görsellere bakılarak, ürünün gerçekten ne olduğunu tarif edecek şekilde
verildi. Slug'lar, açıklamalar ve **görsel dosya adları** da değişti — dosya
adları derlenmiş çıktıda herkese açık adres oluyordu
(`/_astro/ferrero-rocher.HASH.webp`). Derlenmiş çıktıda marka adı hiç kalmadı.

**Açık kalan tek şey görselin kendisi:** iki yuvarlak pastanın ambalajında
"Albeni" yazısı basılı ve fotoğrafta okunuyor. Ambalaj tedarikçiden öyle
geliyorsa fotoğraf yalnızca gerçeği gösteriyor; katalog adı Kervan'ın
kontrolündeydi, o düzeldi. Ambalajın kime ait olduğunu bilmiyorum — sizin
bileceğiniz iş.

## Bilinçli takaslar — istenirse geri alınabilir

Bunlar hata değil, verilmiş kararlar. Yanlış geldiyse geri almak kolay.

- **`/shop`'ta çoklu kategori seçimi kalktı.** Kenar çubuğundaki onay kutuları
  "Şuruplar + Tatlılar" gibi birleştirmeye izin veriyordu; kategori sekmeleri
  tek seçim. Altı ilgisiz kategoride birleştirmenin pratik karşılığı yok
  sayıldı, kategoriler arası arama zaten arama kutusuyla yapılıyor.
- **Mobil alt menü çubuğu kalktı**, gezinme hamburger menüye alındı. Alt çubuk
  başparmağa daha yakındı; karşılığında her mobil ekranda 80px kazanıldı ve
  aynı bağlantıları taşıyan ikinci gezinme sistemi ortadan kalktı.
- **İş ortağı logoları krem tonuna indirildi** (yukarıda ayrıca yazılı).
- **Ana sayfadaki kayan kategori şeridi kaldırıldı.** Kategoriler sayfada
  zaten iki kez vardı (hero manifestosu ve altı bölümün kendisi); şerit
  üçüncüsüydü. Sürekli hareket ettiği için tıklama hedefi kaçıyordu, zemini
  hero'yla aynı olduğu için zemin ritmini bozuyordu (`kavurma` üstüne
  `kavurma`) ve sözleşmenin Hareket kuralına aykırıydı — redesign aynı kararı
  ortaklık logoları için zaten vermiş, bunu atlamıştı. Kaldırınca zemin ritmi
  `kavurma → kum → kagit → kavurma` oldu, yani kural kendiliğinden düzeldi.
  *Geri isteniyorsa:* `git show 641aaad:src/pages/index.astro` içinde tam hâli
  var (bölüm + CSS + `kategoriler` dizisindeki `gorsel` alanı).
- **Altın artık yalnızca tıklanabilir öğelerde.** Sözleşmedeki "sayfa başına en
  fazla iki altın öğe" kuralı hiçbir sayfada tutmuyordu; rol tarif eden bir
  kurala çevrildi (bkz. SKILL.md, Renk kuralı 1) ve kural dışı kalan beş yer
  düzeltildi: ana sayfa ve ortaklık destek ikonları, iletişim adres kartının
  konum ikonu, çerez politikasındaki altın paragraf, `hakkimizda`'daki dört
  istatistik sayısı (100+ / 9 / 50+ / Mersin).
  *Sayıların altın hâli isteniyorsa:* `hakkimizda.astro` içinde
  `text-murekkep` → `text-altin-koyu`. Ama o zaman kural yine sayfayla çelişir.

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


## Başka bilgisayardan devam etmek

Çalışma `tasarim-yenileme` dalında ve GitHub'da. Canlı site etkilenmedi;
`origin/main` hâlâ redesign öncesinde duruyor.

### Kurulum

```bash
git clone https://github.com/Kerem-Kirmaci/kervan-kahve-site.git
cd kervan-kahve-site
git checkout tasarim-yenileme
npm install
npm run dev          # http://localhost:4321
```

Depo zaten varsa: `git fetch && git checkout tasarim-yenileme`

### Depoyla birlikte gelenler

- Tasarım sözleşmesi (`.claude/skills/kervan-tasarim-sistemi/`) — yeni oturumda
  kendiliğinden yüklenir, sistemin tekrar dağılmasını engeller.
- `frontend-design` skill'i.
- Bu dosya ve ayrıntılı commit mesajları — commit'ler bir iş günlüğü gibi
  yazıldı, `git log` okunabilir bir kayıt.

### Gelmeyenler ve karşılıkları

| Ne | Ne yapmalı |
|---|---|
| `node_modules` | `npm install` |
| `tools/kesit` (derlenmiş) | `swiftc -O tools/kesit.swift -o tools/kesit` (yalnızca macOS) |
| `docs/before`, `docs/after` ekran görüntüleri | Gerekirse yeniden üretilir: `tests/ekran-goruntusu-al.sh` |
| Tasarım arşivi ve yenilenme raporu (HTML) | Artifact olarak duruyor, aşağıdaki bağlantılar |
| Bu konuşmanın dökümü | Taşınmaz. Bağlam bu dosyada ve commit mesajlarında. |

### Yerelde kalan bir bilgi

`~/.claude/projects/.../memory/` altında iki not var; bunlar bu bilgisayara
özel, depoyla gitmez. Biri Güvenli İnternet engelinin teşhisi ve itiraz yolu
(kervankahve.com zaman zaman BTK filtresine takılıyor, site kaynaklı değil),
diğeri commit alışkanlığı. İlkine ihtiyaç olursa teşhis sayfası:
https://claude.ai/code/artifact/a2c72641-0e36-483c-8487-0d01a61388b9

### Canlıya çıkarken dikkat

*(Eski uyarı — "yerel main 4 commit önünde" — artık geçerli değil; o commit'ler
GitHub'a girdi. `main` ile `origin/main` aynı noktada, yayınlanmamış commit yok.
`tasarim-yenileme` `origin/main`'in 28 commit önünde.)*

## Yayına alma — işletme onayı bekliyor

Teknik olarak hazır: açık iddia kalmadı, marka riski çözüldü, testler
geçiyor. **Ama yayına işletme sahibi görüp onaylamadan alınmayacak.**

- [ ] Yeni sürümü işletme sahibine göster.
- [ ] Onay gelince `tasarim-yenileme` dalını `main`'e birleştir. Netlify
      `main`'i yayınlıyor; birleştirene kadar canlıda eski sürüm duruyor.
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
