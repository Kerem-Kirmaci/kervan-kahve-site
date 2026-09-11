// Kervan'ın açacağı kafenin menüsü — TASLAK
//
// Kafenin adı, kalem listesi ve fiyatlar henüz belli değil. Buradaki her şey
// işletme sahibine "aşağı yukarı böyle olacak" demek için yazılmış yer
// tutucu: fiyatlar Mersin orta seviye tahmini (İstanbul bağımsız kafelerin
// altı, zincir civarı — bkz. docs/qr-menu-arastirma.md), alerjenler
// bileşenlerden mantıkla çıkarılmış ve tedarikçi teyidi bekliyor, kcal
// değerleri gösterim için birkaç kalemde yaklaşık yazıldı. `taslak: true`
// kaldırılana kadar sayfa bunu bir bantla söylüyor.
//
// Biçim (şema: sema.js, normalize: hazirla.js):
//   kategori: { id, ad, aciklama?, boylar?, tatNotu?, gorsel?, kalemler, ekler? }
//   kalem:    { ad, fiyatlar: [{ boy?, fiyat }], not?, etiketler?, bilesenler?,
//               alerjenler?, kcal?, katalog? }
//   `katalog` bir products.js slug'ı: görsel (gorsel: true olan kategoride),
//   bileşen ve tat notu (tatNotu: true olan kategoride) oradan gelir.
//   Fiyatlar tam sayı TL, KDV dahil. Birden çok fiyat varsa her birinin boyu
//   yazılır — mevzuat her boyu ayrı fiyatlar.

export const kafe = {
  ad: 'Kervan Kafe',
  slug: 'kafe',
  altBaslik: 'Mersin',
  gecerlilik: '2026-09-11',
  taslak: true,

  kategoriler: [
    {
      id: 'espresso',
      ad: 'Espresso bazlı',
      aciklama: 'Kervan espresso harmanı, çift shot.',
      boylar: ['küçük', 'büyük'],
      kalemler: [
        { ad: 'Espresso', fiyatlar: [{ boy: 'tek', fiyat: 90 }, { boy: 'duble', fiyat: 110 }], bilesenler: ['espresso'], kcal: 5 },
        { ad: 'Americano', fiyatlar: [{ boy: 'küçük', fiyat: 120 }, { boy: 'büyük', fiyat: 140 }], bilesenler: ['espresso', 'sıcak su'], kcal: 10 },
        { ad: 'Cortado', fiyatlar: [{ fiyat: 130 }], bilesenler: ['espresso', 'süt'], alerjenler: ['süt'] },
        { ad: 'Flat white', fiyatlar: [{ fiyat: 160 }], bilesenler: ['espresso', 'süt'], alerjenler: ['süt'] },
        { ad: 'Cappuccino', fiyatlar: [{ boy: 'küçük', fiyat: 150 }, { boy: 'büyük', fiyat: 170 }], bilesenler: ['espresso', 'süt'], alerjenler: ['süt'] },
        { ad: 'Latte', fiyatlar: [{ boy: 'küçük', fiyat: 150 }, { boy: 'büyük', fiyat: 170 }], bilesenler: ['espresso', 'süt'], alerjenler: ['süt'] },
        { ad: 'Mocha', fiyatlar: [{ boy: 'küçük', fiyat: 180 }, { boy: 'büyük', fiyat: 200 }], bilesenler: ['espresso', 'süt', 'çikolata sos'], alerjenler: ['süt'] },
      ],
      ekler: [
        { ad: 'Bitkisel süt (yulaf, badem)', fiyat: 30 },
        { ad: 'Ekstra shot', fiyat: 25 },
        { ad: 'Şurup: vanilya, karamel, beyaz çikolata, tuzlu karamel', fiyat: 20 },
      ],
    },

    {
      id: 'filtre',
      ad: 'Filtre ve demleme',
      aciklama: 'V60 ya da Chemex, 250 ml. Çekirdekleri Mersin\'de kendimiz kavuruyoruz.',
      tatNotu: true,
      kalemler: [
        { ad: 'Günün filtre kahvesi', fiyatlar: [{ boy: 'küçük', fiyat: 110 }, { boy: 'büyük', fiyat: 130 }], not: 'Kervan filtre harmanı, sürekli demlemede', bilesenler: ['kahve', 'su'], katalog: 'kervan-kahve-filtre-kahve' },
        { ad: 'Etiyopya', fiyatlar: [{ fiyat: 170 }], bilesenler: ['kahve', 'su'], katalog: 'kervan-kahve-etiyopya' },
        { ad: 'Kolombiya', fiyatlar: [{ fiyat: 160 }], bilesenler: ['kahve', 'su'], katalog: 'kervan-kahve-kolombiya' },
        { ad: 'Guatemala', fiyatlar: [{ fiyat: 160 }], bilesenler: ['kahve', 'su'], katalog: 'kervan-kahve-guatemala' },
        { ad: 'Kenya', fiyatlar: [{ fiyat: 180 }], bilesenler: ['kahve', 'su'], katalog: 'kervan-kahve-kenya' },
        { ad: 'Brezilya', fiyatlar: [{ fiyat: 150 }], bilesenler: ['kahve', 'su'], katalog: 'kervan-kahve-brezilya' },
      ],
    },

    {
      id: 'turk-kahvesi',
      ad: 'Türk kahvesi',
      aciklama: 'Kendi kavurduğumuz harman. Yanında cezerye ile.',
      kalemler: [
        { ad: 'Türk kahvesi', fiyatlar: [{ boy: 'tek', fiyat: 80 }, { boy: 'duble', fiyat: 110 }], bilesenler: ['Türk kahvesi', 'su'], kcal: 5, katalog: 'kervan-kahve-turk-kahvesi' },
        { ad: 'Sütlü Türk kahvesi', fiyatlar: [{ fiyat: 100 }], bilesenler: ['Türk kahvesi', 'süt'], alerjenler: ['süt'] },
        { ad: 'Damla sakızlı Türk kahvesi', fiyatlar: [{ fiyat: 100 }], bilesenler: ['Türk kahvesi', 'damla sakızı', 'su'] },
        { ad: 'Dibek kahvesi', fiyatlar: [{ fiyat: 100 }], bilesenler: ['dibek kahvesi', 'su'] },
        { ad: 'Menengiç kahvesi', fiyatlar: [{ fiyat: 120 }], not: 'Sütle pişer', etiketler: ['kafeinsiz'], bilesenler: ['menengiç', 'süt'], alerjenler: ['süt'] },
      ],
    },

    {
      id: 'soguk-kahve',
      ad: 'Soğuk kahveler',
      kalemler: [
        { ad: 'Buzlu americano', fiyatlar: [{ fiyat: 130 }], bilesenler: ['espresso', 'su', 'buz'] },
        { ad: 'Buzlu latte', fiyatlar: [{ fiyat: 170 }], bilesenler: ['espresso', 'süt', 'buz'], alerjenler: ['süt'] },
        { ad: 'Cold brew', fiyatlar: [{ fiyat: 160 }], not: '18 saat soğuk demleme', bilesenler: ['kahve', 'su', 'buz'] },
        { ad: 'Frappe', fiyatlar: [{ fiyat: 180 }], bilesenler: ['espresso', 'süt', 'şeker', 'buz'], alerjenler: ['süt'] },
        { ad: 'Affogato', fiyatlar: [{ fiyat: 200 }], not: 'Vanilyalı dondurma üzerine espresso', bilesenler: ['espresso', 'vanilyalı dondurma'], alerjenler: ['süt'] },
      ],
      ekler: [{ ad: 'Şurup: vanilya, karamel, çilek', fiyat: 20 }],
    },

    {
      id: 'cay',
      ad: 'Çay ve sıcak içecekler',
      kalemler: [
        { ad: 'Çay', fiyatlar: [{ fiyat: 40 }], bilesenler: ['siyah çay'], kcal: 2 },
        { ad: 'Bitki çayı', fiyatlar: [{ fiyat: 100 }], not: 'Ihlamur · kuşburnu · nane limon · elma tarçın · kış çayı · yeşil çay', bilesenler: ['bitki karışımı', 'su'] },
        { ad: 'Sıcak çikolata', fiyatlar: [{ fiyat: 150 }], bilesenler: ['süt', 'çikolata sos'], alerjenler: ['süt'] },
        { ad: 'Chai latte', fiyatlar: [{ fiyat: 160 }], bilesenler: ['chai', 'süt', 'baharat'], alerjenler: ['süt'] },
        { ad: 'Matcha latte', fiyatlar: [{ fiyat: 180 }], bilesenler: ['matcha', 'süt'], alerjenler: ['süt'] },
        { ad: 'Salep', fiyatlar: [{ fiyat: 140 }], etiketler: ['mevsimlik'], bilesenler: ['süt', 'salep', 'tarçın'], alerjenler: ['süt'] },
      ],
    },

    {
      id: 'soguk-icecek',
      ad: 'Soğuk içecekler',
      kalemler: [
        { ad: 'Ev yapımı limonata', fiyatlar: [{ fiyat: 110 }], bilesenler: ['limon', 'su', 'şeker', 'nane'] },
        { ad: 'Taze portakal suyu', fiyatlar: [{ fiyat: 120 }], bilesenler: ['portakal'] },
        { ad: 'Bubble tea', fiyatlar: [{ fiyat: 170 }], not: 'Meyveli, patlayan boba ile', etiketler: ['yeni'], bilesenler: ['çay', 'süt', 'meyve şurubu', 'tapyoka inci'], alerjenler: ['süt'] },
        { ad: 'Milkshake', fiyatlar: [{ fiyat: 180 }], not: 'Çilek · çikolata · vanilya', bilesenler: ['süt', 'dondurma', 'şurup'], alerjenler: ['süt'] },
        { ad: 'Soda', fiyatlar: [{ fiyat: 40 }], bilesenler: ['maden suyu'] },
        { ad: 'Ayran', fiyatlar: [{ fiyat: 45 }], bilesenler: ['yoğurt', 'su', 'tuz'], alerjenler: ['süt'] },
        { ad: 'Su', fiyatlar: [{ fiyat: 25 }], not: '0,5 L' },
      ],
    },

    {
      id: 'pastalar',
      ad: 'Pastalar',
      aciklama: 'Dilim. Vitrinde ne varsa; sorabilirsiniz.',
      gorsel: true,
      kalemler: [
        { ad: 'San Sebastian cheesecake', fiyatlar: [{ fiyat: 220 }], alerjenler: ['süt', 'yumurta'], katalog: 'doro-cake-san-sebastian-cheesecake' },
        { ad: 'Frambuazlı cheesecake', fiyatlar: [{ fiyat: 210 }], alerjenler: ['süt', 'gluten'], katalog: 'doro-cake-frambuazli-dilim-cheesecake' },
        { ad: 'Tiramisu', fiyatlar: [{ fiyat: 200 }], alerjenler: ['süt', 'gluten', 'yumurta'], katalog: 'doro-cake-tiramisu' },
        { ad: 'Karaorman pastası', fiyatlar: [{ fiyat: 200 }], alerjenler: ['gluten', 'süt', 'yumurta'], katalog: 'doro-cake-karaorman-pastasi' },
        { ad: 'Red velvet', fiyatlar: [{ fiyat: 200 }], alerjenler: ['gluten', 'süt', 'yumurta'], katalog: 'doro-cake-red-velvet-pasta' },
        { ad: 'Medovik bal pastası', fiyatlar: [{ fiyat: 210 }], alerjenler: ['gluten', 'süt', 'yumurta'], katalog: 'doro-cake-medovik-bal-pasta' },
        { ad: 'Frambuazlı brownie', fiyatlar: [{ fiyat: 180 }], alerjenler: ['gluten', 'süt', 'yumurta'], katalog: 'doro-cake-frambuazli-brownie' },
      ],
    },

    {
      id: 'kekler',
      ad: 'Kekler ve Mersin\'den',
      gorsel: true,
      kalemler: [
        { ad: 'Havuçlu kek', fiyatlar: [{ fiyat: 160 }], alerjenler: ['gluten', 'süt', 'yumurta', 'sert kabuklu yemiş'], katalog: 'doro-cake-havuclu-kek' },
        { ad: 'Limonlu haşhaşlı kek', fiyatlar: [{ fiyat: 150 }], alerjenler: ['gluten', 'süt', 'yumurta'], katalog: 'doro-cake-limonlu-hashasli-kek' },
        { ad: 'Çikolatalı kurabiye', fiyatlar: [{ fiyat: 80 }], alerjenler: ['gluten', 'süt', 'yumurta'], katalog: 'doro-cake-cikolatali-kurabiye' },
        { ad: 'Cezerye', fiyatlar: [{ fiyat: 70 }], not: 'Mersin\'in havuçlu tatlısı, fıstıklı', bilesenler: ['havuç', 'şeker', 'Antep fıstığı', 'hindistan cevizi'], alerjenler: ['sert kabuklu yemiş'] },
        { ad: 'Kerebiç', fiyatlar: [{ fiyat: 110 }], not: 'Cevizli irmik kurabiyesi, köpüğüyle', bilesenler: ['irmik', 'ceviz', 'çöven köpüğü'], alerjenler: ['gluten', 'sert kabuklu yemiş'] },
      ],
    },

    {
      id: 'atistirmalik',
      ad: 'Atıştırmalık',
      kalemler: [
        { ad: 'Tereyağlı kruvasan', fiyatlar: [{ fiyat: 110 }], bilesenler: ['un', 'tereyağı', 'yumurta'], alerjenler: ['gluten', 'süt', 'yumurta'] },
        { ad: 'Kaşarlı tost', fiyatlar: [{ fiyat: 140 }], bilesenler: ['ekmek', 'kaşar'], alerjenler: ['gluten', 'süt'] },
        { ad: 'Kaşarlı sucuklu tost', fiyatlar: [{ fiyat: 170 }], bilesenler: ['ekmek', 'kaşar', 'sucuk'], alerjenler: ['gluten', 'süt'] },
        { ad: 'Bagel ve krem peynir', fiyatlar: [{ fiyat: 150 }], bilesenler: ['bagel', 'krem peynir', 'susam'], alerjenler: ['gluten', 'süt', 'susam'] },
        { ad: 'Simit ve peynir tabağı', fiyatlar: [{ fiyat: 160 }], bilesenler: ['simit', 'beyaz peynir', 'zeytin', 'domates', 'salatalık'], alerjenler: ['gluten', 'süt', 'susam'] },
      ],
    },
  ],
};
