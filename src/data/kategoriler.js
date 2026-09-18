// Kervan Kahve — ürün kategorileri (tek kaynak)
//
// Her kategorinin kendi sayfası var: /toptan-surup.html gibi. Sayfa,
// başlık, giriş metni ve gezinme etiketleri buradan üretiliyor; kategori
// eklerken ya da adını değiştirirken yalnızca burası değişir.
//
// Neden ayrı sayfa: 100 ürün tek adreste (/shop.html) dururken Google'ın
// "toptan şurup mersin" gibi bir aramada göstereceği bir sayfası yoktu —
// sekmeler JavaScript'le filtreliyor, adres ve başlık değişmiyordu.
//
// Giriş metinleri sitede zaten doğrulanmış iddialardan (hakkımızda, ortaklık,
// ana sayfa) ve ürün verisinden türetildi; yeni bir iş iddiası içermiyor.
// Yeni bir cümle eklenecekse önce işletmeye sorulmalı (bkz. TODO.md,
// "İş iddiaları").

export const kategoriler = [
  {
    key: 'surup',
    slug: 'toptan-surup',
    ad: 'Şuruplar',
    ikon: 'surup',
    baslik: 'Toptan şurup',
    sayfaBasligi: "Mersin'de Toptan Şurup — Kervan Kahve",
    aciklama:
      "Kafelere toptan şurup: DaVinci Gourmet, FO ve Gusse'nin karamel, vanilya, çikolata, beyaz çikolata ve çilek şurupları. Mersin içinde kendi aracımızla.",
    giris: [
      "DaVinci Gourmet, FO ve Gusse'nin karamel, vanilya, çikolata, beyaz çikolata ve çilek şurupları — üç markanın beşer aroması. Latte, soğuk kahve, frappe ve limonatada; hangi markanın menünüze ve fiyatınıza uyduğunu birlikte seçiyoruz.",
      'Şurup, kahve, sos ve tatlıyla aynı siparişte, aynı faturada gelir. Mersin içinde teslimatı kargoya vermiyoruz, kendi aracımızla getiriyoruz.',
    ],
  },
  {
    key: 'pure-tatlandirici',
    slug: 'toptan-sos-ve-pure',
    ad: 'Püre ve Tatlandırıcılar',
    ikon: 'pure',
    baslik: 'Sos, püre ve tatlandırıcılar',
    sayfaBasligi: "Mersin'de Toptan Kahve Sosu, Püre ve Tatlandırıcı — Kervan Kahve",
    aciklama:
      "Kafelere toptan sos ve tatlandırıcı: Gusse karamel, tuzlu karamel, fındık, frambuaz ve çikolata sosları, Montare D'oro sprey krema, Bobaco bubble tea.",
    giris: [
      "Gusse'nin kahve ve tatlı sosları — karamel, tuzlu karamel, fındık, frambuaz, sütlü, bitter ve beyaz çikolata — yanında Montare D'oro sprey krema ve Bobaco bubble tea karışımı. Mocha ve karamel latte'den milkshake ve tatlı süslemesine kadar tezgâhın her işinde.",
      'Hangi sosun hangi içecekte işe yaradığını menünüze bakarak birlikte belirliyor, personelinize kullanımını gösteriyoruz.',
    ],
  },
  {
    key: 'tatli',
    slug: 'toptan-hazir-tatli',
    ad: 'Tatlılar',
    ikon: 'pasta',
    baslik: 'Kafelere hazır tatlı ve pasta',
    sayfaBasligi: "Mersin'de Kafelere Hazır Tatlı ve Pasta — Kervan Kahve",
    aciklama:
      "Kafelere hazır tatlı: D'ORO Cake cheesecake, dilim ve bütün pasta, brownie, sufle, kek ve kurabiye — 53 çeşit, tek siparişle. Mersin içinde kendi aracımızla.",
    giris: [
      "D'ORO Cake'in 53 çeşit hazır tatlısı: San Sebastian, limonlu ve meyveli cheesecake'ler, dilim ve bütün pastalar, brownie ve bar tatlılar, sıcak servis edilen sufleler, kek ve kurabiye. Vitrini tek markayla, tek siparişle doldurursunuz.",
      'Hangi çeşitlerin menünüze ve hacminize uyduğunu birlikte belirliyoruz; tatlı, kahve ve şurupla aynı araçta gelir.',
    ],
  },
  {
    key: 'espresso',
    slug: 'toptan-kahve',
    ad: 'Kahveler',
    ikon: 'kahve',
    baslik: 'Toptan kahve',
    sayfaBasligi: "Mersin'de Toptan Kahve — Kervan Kahve",
    aciklama:
      "Kafe ve restoranlara toptan kahve: Mersin'de kendimiz kavurduğumuz espresso ve filtre harmanları, Türk kahvesi, tek köken çekirdekler. Öğütüm ekipmanınıza göre.",
    giris: [
      'Kahveyi kendimiz kavuruyoruz: espresso ve filtre harmanları, Türk kahvesi ve Etiyopya, Kolombiya, Guatemala, Brezilya, Kenya tek kökenleri. Çekirdeği Brezilya başta olmak üzere Güney Amerika\'dan getiriyor, Mersin\'de kavuruyoruz.',
      'Öğütümü işletmenizin ekipmanına göre ayarlıyoruz. İsterseniz menünüze ve müşteri profilinize özel harmanı birlikte belirliyor, örnek kavurmayla test ediyoruz.',
    ],
  },
  {
    key: 'cay',
    slug: 'toptan-bitki-cayi',
    ad: 'Bitki Çayları',
    ikon: 'cay',
    baslik: 'Toptan bitki çayı',
    sayfaBasligi: "Mersin'de Toptan Bitki Çayı — Kervan Kahve",
    aciklama:
      "Kafe menüsü için toptan bitki çayı: yeşil çay, ıhlamur, kuşburnu, nane limon, elma tarçın ve kış çayı. Mersin içinde kendi aracımızla teslim.",
    giris: [
      'Kafe menüsü için altı bitki çayı: yeşil çay, ıhlamur, kuşburnu, nane limon, elma tarçın ve kış çayı. Kahve içmeyen müşteri için menüde bir sayfa açar; kahve, şurup ve tatlıyla aynı siparişte gelir.',
    ],
  },
  {
    key: 'aksesuar',
    slug: 'kafe-ekipmanlari',
    ad: 'Ekipmanlar',
    ikon: 'ekipman',
    baslik: 'Kafe ekipmanları',
    sayfaBasligi: "Mersin'de Kafe Ekipmanları — Kervan Kahve",
    aciklama:
      "Kafelere ekipman: espresso makinesi, kahve değirmeni, buz makinesi, bar blender, soğuk içecek dispenseri, portafiltre ve tamper. Seçim, kurulum ve bakım desteği.",
    giris: [
      'Espresso makinesi, kahve değirmeni, buz makinesi, bar blender ve soğuk içecek dispenseri; yanında portafiltre ve tamper. Makine seçiminde menünüze ve hacminize göre danışmanlık veriyor, kurulumu yapıyor, düzenli bakımını sürdürüyoruz.',
      'Ekipmanla birlikte kahvesini, şurubunu ve personel eğitimini de aynı ekipten alırsınız.',
    ],
  },
];

// Anahtarla (products.js'teki `category`) kategori bulmak için
export const kategoriHaritasi = Object.fromEntries(kategoriler.map((k) => [k.key, k]));

// Bir kategorinin sayfa adresi. Site .html uzantılı adresler kullanıyor
// (bkz. astro.config.mjs, build.format).
export const kategoriYolu = (key) => `/${kategoriHaritasi[key].slug}.html`;

// Katalog sıralaması: kategori sırası → önce öne çıkanlar → ada göre Türkçe
// alfabetik. Mağaza ve kategori sayfaları aynı sırayı kullanıyor; build
// sırasında bir kez hesaplanıp HTML'e sabitleniyor.
const kategoriSirasi = (key) => {
  const i = kategoriler.findIndex((k) => k.key === key);
  return i === -1 ? Number.MAX_SAFE_INTEGER : i;
};

export function urunleriSirala(liste) {
  return [...liste].sort((a, b) => {
    const kategoriFarki = kategoriSirasi(a.category) - kategoriSirasi(b.category);
    if (kategoriFarki !== 0) return kategoriFarki;
    const oneCikanFarki = (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    if (oneCikanFarki !== 0) return oneCikanFarki;
    return a.name.localeCompare(b.name, 'tr', { sensitivity: 'base' });
  });
}
