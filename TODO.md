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
- [ ] **`/menu` yer tutucusu.** Basılı QR kodlar kırılmasın diye duruyor;
      gerçek bir QR menüye dönüştürülebilir.
- [ ] **Tailwind v4 geçişi.** README'de bilinçli olarak v3'te tutuluyor;
      ayrı bir iş olarak ele alınmalı.

## Referans

- Tasarım sözleşmesi: `.claude/skills/kervan-tasarim-sistemi/SKILL.md`
  (sayfa veya bileşen yazmadan önce okunmalı)
- Zemin temizleme aracı: `tools/kesit.swift`
- Orijinal görseller: `src/assets/_orijinal/`
- Yenilenme öncesi kayıt: https://claude.ai/code/artifact/d9c09d40-23d8-4401-82d8-f37d225cab14
- Önce/sonra raporu: https://claude.ai/code/artifact/963c45be-4b09-4345-b5ee-fb187b609613
