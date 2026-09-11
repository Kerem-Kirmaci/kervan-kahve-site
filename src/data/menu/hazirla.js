// Menü verisini sayfanın basacağı biçime getirir.
//
// kafe.js okunur kalsın diye kalemlerde isteğe bağlı alanlar yazılmaz;
// burada normalize edilir: katalog kaydı bulunur, bileşen ve tat notu
// katalogdan devralınır, boyların kategori sütunlarıyla uyumu hesaplanır.
// Görsel çevirisi (ImageMetadata) burada YAPILMAZ — product-images.js
// import.meta.glob kullanır ve yalnızca Vite altında çalışır; bu dosya
// `node -e` ile de çalışsın diye ondan bağımsız.

import { products } from '../products.js';
import { dogrula } from './sema.js';

/** @typedef {import('./sema.js').Kafe} Kafe */
/** @typedef {import('./sema.js').Kategori} Kategori */
/** @typedef {import('./sema.js').Kalem} Kalem */
/** @typedef {(typeof products)[number]} Urun */

/**
 * @typedef {Kalem & {
 *   urun: Urun | null,
 *   bilesenler: string[],
 *   alerjenler: string[],
 *   etiketler: string[],
 *   kcal: number | null,
 *   not: string | null,
 *   boyUyumlu: boolean,
 *   detayVar: boolean,
 * }} HazirKalem
 *
 * @typedef {Omit<Kategori, 'kalemler' | 'ekler'> & {
 *   kalemler: HazirKalem[],
 *   ekler: import('./sema.js').Ek[],
 * }} HazirKategori
 *
 * @typedef {Omit<Kafe, 'kategoriler'> & { kategoriler: HazirKategori[] }} HazirMenu
 */

/** @type {Map<string, Urun>} */
const urunler = new Map(products.map((p) => [p.slug, p]));

/** 170 → "170", 1250 → "1.250". Para simgesi şablonda basılır. @param {number} n */
export const fiyatYazisi = (n) => n.toLocaleString('tr-TR');

/** "2026-09-11" → "11 Eylül 2026" @param {string} iso */
export const tarihYazisi = (iso) =>
  new Intl.DateTimeFormat('tr-TR', { dateStyle: 'long', timeZone: 'UTC' }).format(new Date(iso));

/**
 * @param {Kafe} kafe
 * @returns {HazirMenu}
 */
export function hazirla(kafe) {
  dogrula(kafe);

  return {
    ...kafe,
    kategoriler: kafe.kategoriler.map((k) => ({
      ...k,
      ekler: k.ekler ?? [],
      kalemler: k.kalemler.map((m) => {
        const urun = (m.katalog && urunler.get(m.katalog)) || null;
        const bilesenler = m.bilesenler?.length ? m.bilesenler : (urun?.ingredients ?? []);
        const alerjenler = m.alerjenler ?? [];
        const kcal = m.kcal ?? null;
        const not =
          m.not ?? (k.tatNotu && urun?.tastingNotes?.length ? urun.tastingNotes.join(' · ') : null);

        // Fiyat boyları kategorinin sütun başlığıyla sırayla örtüşüyorsa
        // boy adı satırda tekrar yazılmaz; örtüşmüyorsa (espresso: tek/duble)
        // her fiyatın yanına küçük yazılır. Tek fiyat her zaman uyumlu.
        const boyUyumlu =
          m.fiyatlar.length === 1 ||
          (Array.isArray(k.boylar) &&
            m.fiyatlar.length === k.boylar.length &&
            m.fiyatlar.every((f, i) => f.boy === k.boylar[i]));

        return {
          ...m,
          urun,
          bilesenler,
          alerjenler,
          etiketler: m.etiketler ?? [],
          kcal,
          not,
          boyUyumlu,
          detayVar: bilesenler.length > 0 || alerjenler.length > 0 || kcal != null,
        };
      }),
    })),
  };
}
