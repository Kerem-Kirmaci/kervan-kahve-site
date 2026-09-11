# Yapılacaklar

Tasarım yenilenmesi (Faz 1–6) tamamlandı ve **11 Eylül 2026'da yayına
alındı** — işletme sahibi onayladı, `tasarim-yenileme` `main`'e birleşti
(bkz. "Yayına alma"). Sıradaki iş QR menü.

## 1. ÖNCELİK: QR menü — kafenin menüsü

**Taslak yapıldı (11 Eylül 2026), `kafe-menu` dalında.** İşletme sahibi
toptan işinin yanına bir kafe açıyor; menü o kafeye ait. Sayfa `/kafe`
(`src/pages/kafe.astro`), içerik `src/data/menu/kafe.js`, araştırma ve
tasarım gerekçeleri `docs/qr-menu-arastirma.md`.

Verilen kararlar:

- Takeaway dükkânı kalıyor; `/menu` onun basılı QR'larına ait, dokunulmadı.
- Yalnızca menü; masadan sipariş yok.
- Kafenin adı, açılış tarihi ve gerçek kalem listesi yok. Sayfadaki her şey
  yer tutucu ve sayfa bunu bir bantla söylüyor (`taslak: true`).
- Gösterim: `main`'e taslak PR → Netlify Deploy Preview adresi + `npm run qr`
  ile QR. PR birleştirilmeyecek.

### Sıradaki adımlar

- [ ] Taslağı işletme sahibine göster (önizleme adresi + QR; telefonla
      tarayıp gerçekten denesin).
- [ ] Ondan gelecekler: kafenin **adı**, gerçek **kalem listesi ve fiyatlar**,
      Türk kahvesi çeşitleri, yiyecek olup olmayacağı, QR'ların masada mı
      tezgâhta mı duracağı. Hepsi `kafe.js`'e girer; kod değişmez.
- [ ] Ad kesinleşince: `kafe.js` `ad`/`slug`, sayfa başlığı ve OG görseli;
      adres `/kafe` kalacak mı yoksa `/menu/<ad>` mı (ikincisi `netlify.toml`
      `/menu/*` yönlendirmesini değiştirir); `noindex` ve sitemap kararı.
- [ ] Tedarikçiden (DORO, Gusse, Bobaco) **bileşen ve alerjen** bilgisi —
      alerjen bildirimi 2020'den beri zorunlu, bileşen listesi 31.12.2026'ya
      kadar, kalori 31.12.2027'ye kadar zorunlu oluyor. Alanlar hazır, veri
      yer tutucu.
- [ ] Açılışa yakın: `taslak: false`, gerçek `gecerlilik` tarihi, masa QR
      baskısı (`npm run qr -- https://kervankahve.com/kafe docs/qr/masa.svg`;
      mat, en az 3×3 cm, yanında "Menü" yazısı).
- [ ] Basılı menü: `@media print` çıktısı istenince verilecek liste için
      yeter; tasarlanmış bir kâğıt menü ayrı iş.

### Eski notlardan hâlâ geçerli olanlar

- Menü verisi ürün kataloğundan **ayrı**; ad, görsel, bileşen ve tat notu
  katalogdan (`katalog` slug'ı), fiyat ve sıra menüden.
- B senaryosu ("menünüzü de biz kuralım") ölmedi: kendi kafe ilk vitrin.
  Sayfanın altındaki cümle bunu söylüyor. İkinci kafe gelirse ikinci veri
  dosyası + ikinci sayfa; çok kiracılı altyapı gerekmiyor.

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

### ✅ Küçük tutarsızlıklar — yapıldı

- ~~**Sayfa başlıkları karışık.**~~ Üç ayrı biçim vardı (uzun tire, kısa
  tire, marka önde). Tek biçime indi: ana sayfa marka önde (site kimliği),
  diğer sekizi `Sayfa — Kervan Kahve`.
- ~~**Tat notları dolgu olabiliyor.**~~ Katalog tarandı. Bobaco Bubble Tea'nin
  notları ("modern / trend / çok amaçlı") görselden okunan gerçek niteliklere
  çevrildi: meyveli, tatlı, patlayan boba. Bir pastadaki "premium" da
  "çikolatalı" oldu.
- ~~**Meta açıklamalar eski konumlandırmayı anlatıyor.**~~ Tek kalan
  `shop.astro`'ydu ("Premium kahve çekirdekleri..."), dağıtım diline çevrildi
  ve ürün sayısı veriden geliyor artık — bir daha eskimeyecek.

**Kalan judgment call — sende:** 11 üründe hâlâ tat bildirmeyen not var ama
bunlar tartışmalı olduğu için dokunmadım:

- **"klasik"** (5 ürün: üç vanilya şurubu, çikolatalı sos, karaorman,
  mermer kek, mozaik). Tat notu değil ama bir profili tarif ediyor —
  "klasik vanilya" gerçek bir ayrım. Kalabilir.
- **"profesyonel"** (4 ekipman: buz makinesi, espresso makinesi, değirmen,
  blender). Bu üründe alan tat notu değil teknik özellik taşıyor ("2 grup",
  "3 Lt", "on demand"). Aralarında "profesyonel" dolgu duruyor ama yerine
  gerçek bir özellik yazmak için ürünü bilmek gerek — uydurmadım.

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

## Başka bilgisayardan devam etmek

Yenilenmiş site `main` dalında ve canlıda; `tasarim-yenileme` dalı işini
bitirdi. QR menü işi `kafe-menu` dalında sürüyor ve GitHub'da; `main`'in
üstüne rebase edilmiş, yani `main`'deki her şeyi içeriyor.

### Kurulum

```bash
git clone https://github.com/Kerem-Kirmaci/kervan-kahve-site.git
cd kervan-kahve-site
git checkout kafe-menu
npm install          # qrcode devDependency'si bu dalda eklendi
npm run dev          # http://localhost:4321/kafe
```

Depo zaten varsa: `git fetch && git checkout kafe-menu && git pull && npm install`

Menü işinde dokunulacak dosyalar: `src/data/menu/kafe.js` (içerik),
`src/pages/kafe.astro` (sayfa ve stil), `src/scripts/kafe-menu.js` (şerit
işaretleme), `tests/smoke.mjs` [8b] (kontroller). Araştırma ve gerekçeler
`docs/qr-menu-arastirma.md`.

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

## ✅ Yayına alma — yapıldı (11 Eylül 2026)

İşletme sahibi yeni sürümü görüp onayladı. `tasarim-yenileme` `main`'e
birleştirilip push edildi; Netlify `main`'i yayınlıyor. Yayın öncesi son
kontrol, onaylı commit'in (`8c7336d`) temiz bir worktree kopyasında yapıldı:
build 9 sayfa, 71/71 tarayıcı testi geçti.

- [x] Yeni sürümü işletme sahibine göster.
- [x] `tasarim-yenileme` → `main` birleştirmesi ve push.

Düzeltme: buradaki eski "yerel `main` 4 commit önündeydi, GitHub'a girdi" notu
yanlıştı — o dört commit (logo şeridi ayarları, `0a2db36`…`1e5e73b`) GitHub'a
hiç gitmemişti; zaten `tasarim-yenileme`'nin içindeydiler ve bu
birleştirmeyle çıktılar.

## Sonraki adımlar (öneri)

- [ ] **Ürün detay sayfaları.** `products.js` içinde her üründe `slug` var ve
      README'ye göre `/urun/<slug>` adresleri bunun için ayrılmış. Kataloğun
      SEO'su ve iş ortağının ürünü paylaşabilmesi için değerli.
- [ ] **Analytics.** Kurulursa çerez banner'ı da gerekir; `cerez-politikasi`
      sayfası buna göre güncellenmeli (şu an "çerez kullanmıyoruz" diyor).
- [ ] **Tailwind v4 geçişi.** README'de bilinçli olarak v3'te tutuluyor;
      ayrı bir iş olarak ele alınmalı.
- [ ] **`astro check` temizliği.** Beş tip hatası veriyor; build'i
      etkilemiyor (Netlify yalnızca `npm run build` çalıştırıyor):
      `Buton.astro` varyant/boyut indekslemesi, `index.astro`
      `kategoriSayilari` indekslemesi, `ortaklik.astro` `type={a.tur}`.

## Referans

- Tasarım sözleşmesi: `.claude/skills/kervan-tasarim-sistemi/SKILL.md`
  (sayfa veya bileşen yazmadan önce okunmalı)
- Zemin temizleme aracı: `tools/kesit.swift`
- Orijinal görseller: `src/assets/_orijinal/`
- Yenilenme öncesi kayıt: https://claude.ai/code/artifact/d9c09d40-23d8-4401-82d8-f37d225cab14
- Önce/sonra raporu: https://claude.ai/code/artifact/963c45be-4b09-4345-b5ee-fb187b609613
