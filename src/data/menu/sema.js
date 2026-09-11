// Kervan Kahve — kafe menüsü şeması ve doğrulaması
//
// Menü verisi ürün kataloğundan (products.js) ayrı yaşar: ad, görsel, bileşen
// ve tat notu katalogdan gelebilir (`katalog` alanı bir ürün slug'ı), fiyat
// ve sıra menüye aittir. Toptan fiyat katalogda yoktur ve olmaz; buradaki
// fiyat kafenin perakende fiyatıdır.
//
// Bu dosya sözlükleri ve build'i durduran doğrulamayı taşır — Ikon.astro'nun
// bilinmeyen ad için yaptığı gibi, hatalı menü verisi yayına çıkamaz.
// `import.meta.glob` kullanmaz; `node -e` ile de çalışır.

import { products } from '../products.js';

/**
 * @typedef {Object} Fiyat
 * @property {string} [boy]   Boy adı; birden çok fiyat varsa zorunlu
 * @property {number} fiyat   Tam sayı TL, KDV dahil
 *
 * @typedef {Object} Kalem
 * @property {string} ad
 * @property {Fiyat[]} fiyatlar
 * @property {string} [not]           Tek satırlık açıklama ya da tat notu
 * @property {string[]} [etiketler]   ETIKETLER sözlüğünden
 * @property {string[]} [bilesenler]
 * @property {string[]} [alerjenler]  ALERJENLER sözlüğünden
 * @property {number} [kcal]
 * @property {string} [katalog]       products.js slug'ı
 *
 * @typedef {Object} Ek
 * @property {string} ad
 * @property {number} fiyat
 *
 * @typedef {Object} Kategori
 * @property {string} id              ASCII slug; bölüm id'si ve çip bağlantısı
 * @property {string} ad
 * @property {string} [aciklama]
 * @property {string[]} [boylar]      Sütun başlığı (küçük / büyük)
 * @property {boolean} [tatNotu]      Katalogdaki tastingNotes not olarak basılır
 * @property {boolean} [gorsel]       Katalog görseli basılır (tatlılar)
 * @property {Kalem[]} kalemler
 * @property {Ek[]} [ekler]
 *
 * @typedef {Object} Kafe
 * @property {string} ad
 * @property {string} slug
 * @property {string} altBaslik
 * @property {string} gecerlilik      YYYY-AA-GG
 * @property {boolean} taslak
 * @property {Kategori[]} kategoriler
 */

// Türk Gıda Kodeksi Gıda Etiketleme ve Tüketicileri Bilgilendirme
// Yönetmeliği'ndeki 14 alerjen. Toplu tüketim yerlerinde 1.1.2020'den beri
// sipariş öncesi bildirilmesi zorunlu; menü bunun için kabul edilen kanal.
export const ALERJENLER = [
  'gluten',
  'kabuklular',
  'yumurta',
  'balık',
  'yer fıstığı',
  'soya',
  'süt',
  'sert kabuklu yemiş',
  'kereviz',
  'hardal',
  'susam',
  'sülfit',
  'acı bakla',
  'yumuşakçalar',
];

// Kalem rozetleri. Yeni etiket gerekiyorsa buraya eklenir; sayfaya yazılmaz.
export const ETIKETLER = ['vegan', 'mevsimlik', 'yeni', 'kafeinsiz'];

// Tasarım ilkesi: kategori başına en fazla yedi kalem. Aşılırsa build
// durmaz, uyarı basılır — bu veri bütünlüğü değil, seçim yükü kararıdır.
export const KALEM_TAVANI = 7;

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const ISO_TARIH = /^\d{4}-\d{2}-\d{2}$/;

const katalogSluglari = new Set(products.map((p) => p.slug));

function fiyatGecerli(n, sifirOlabilir = false) {
  return Number.isInteger(n) && (sifirOlabilir ? n >= 0 : n > 0);
}

/**
 * Menü nesnesini doğrular. Bütün hataları toplar ve tek bir Error fırlatır
 * ki eksikler tek seferde görülsün. Uyarılar (tavan aşımı) build'i durdurmaz.
 * @param {Kafe} kafe
 */
export function dogrula(kafe) {
  const hatalar = [];
  const uyarilar = [];
  const hata = (m) => hatalar.push(m);

  if (!kafe || typeof kafe !== 'object') {
    throw new Error('Menü verisi bir nesne değil.');
  }
  if (!kafe.ad?.trim()) hata('kafe.ad boş');
  if (!SLUG.test(kafe.slug ?? '')) hata(`kafe.slug ASCII slug değil: "${kafe.slug}"`);
  if (!ISO_TARIH.test(kafe.gecerlilik ?? '') || Number.isNaN(Date.parse(kafe.gecerlilik))) {
    hata(`kafe.gecerlilik YYYY-AA-GG biçiminde değil: "${kafe.gecerlilik}"`);
  }
  if (!Array.isArray(kafe.kategoriler) || kafe.kategoriler.length === 0) {
    hata('kafe.kategoriler boş');
  }

  const idler = new Set();
  for (const k of kafe.kategoriler ?? []) {
    const yer = `kategori "${k.id ?? k.ad ?? '?'}"`;

    if (!SLUG.test(k.id ?? '')) hata(`${yer}: id ASCII slug değil`);
    if (idler.has(k.id)) hata(`${yer}: id tekrar ediyor`);
    idler.add(k.id);
    if (!k.ad?.trim()) hata(`${yer}: ad boş`);
    if (k.boylar !== undefined && !(Array.isArray(k.boylar) && k.boylar.every((b) => typeof b === 'string' && b))) {
      hata(`${yer}: boylar dizi değil`);
    }
    if (!Array.isArray(k.kalemler) || k.kalemler.length === 0) {
      hata(`${yer}: kalemler boş`);
      continue;
    }
    if (k.kalemler.length > KALEM_TAVANI) {
      uyarilar.push(`${yer}: ${k.kalemler.length} kalem — tavan ${KALEM_TAVANI}`);
    }

    for (const m of k.kalemler) {
      const ky = `${yer} › "${m.ad ?? '?'}"`;
      if (!m.ad?.trim()) hata(`${ky}: ad boş`);

      if (!Array.isArray(m.fiyatlar) || m.fiyatlar.length === 0) {
        hata(`${ky}: fiyat yok — satılan her ürün fiyatıyla listelenmek zorunda`);
      } else {
        for (const f of m.fiyatlar) {
          if (!fiyatGecerli(f?.fiyat)) hata(`${ky}: fiyat pozitif tam sayı değil (${f?.fiyat})`);
          if (m.fiyatlar.length > 1 && !f?.boy?.trim()) {
            hata(`${ky}: birden çok fiyat var ama boy adı eksik — her boy ayrı fiyatlanır`);
          }
        }
      }

      for (const a of m.alerjenler ?? []) {
        if (!ALERJENLER.includes(a)) hata(`${ky}: bilinmeyen alerjen "${a}"`);
      }
      for (const e of m.etiketler ?? []) {
        if (!ETIKETLER.includes(e)) hata(`${ky}: bilinmeyen etiket "${e}"`);
      }
      if (m.bilesenler !== undefined && !(Array.isArray(m.bilesenler) && m.bilesenler.every((b) => typeof b === 'string'))) {
        hata(`${ky}: bilesenler dizi değil`);
      }
      if (m.kcal != null && !(Number.isFinite(m.kcal) && m.kcal >= 0)) {
        hata(`${ky}: kcal sayı değil`);
      }
      if (m.katalog && !katalogSluglari.has(m.katalog)) {
        hata(`${ky}: katalog slug'ı products.js'te yok: "${m.katalog}"`);
      }
    }

    for (const e of k.ekler ?? []) {
      if (!e.ad?.trim()) hata(`${yer}: ek ad boş`);
      if (!fiyatGecerli(e.fiyat, true)) hata(`${yer} › ek "${e.ad}": fiyat tam sayı değil`);
    }
  }

  for (const u of uyarilar) console.warn(`Menü uyarısı — ${u}`);

  if (hatalar.length) {
    throw new Error(`Menü verisi hatalı (${hatalar.length}):\n- ${hatalar.join('\n- ')}`);
  }
  return true;
}
