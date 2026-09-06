/**
 * "Bizi Farklı Kılan" görselini üretir:
 *   src/assets/images/about_us/farkimiz.webp
 *
 * Bölüm ürün yelpazesi iddiası taşıyor ("kahve, şurup, püre, tatlı, bitki çayı
 * ve ekipman aynı listede"). O iddiayı kanıtlayacak şey gerçek ürünler; bu
 * yüzden görsel bir fotoğraf değil, katalogdaki ürünlerin kesitlerinden
 * kuruluyor. Yapay zekâ üretimi bir tezgâh düzeni burada sahte ambalaj
 * üretiyordu (eski dosyada "THIBISCUS ROSEHIPS" gibi uydurma etiketler vardı).
 *
 * Ürün değişirse veya katalog güncellenirse yeniden çalıştır:
 *   node tools/farkimiz-uret.mjs
 */
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { statSync } from 'node:fs';

const kok = join(dirname(fileURLToPath(import.meta.url)), '..');
const { products } = await import(new URL('../src/data/products.js', import.meta.url));

// Altı kategorinin hepsi temsil ediliyor — iddia yelpazenin genişliği.
const SECIM = [
  'davinci-gourmet-karamel-surubu',
  'kervan-kahve-espresso',
  'doro-cake-kakaolu-cikolatali-pasta',
  'gusse-cikolatali-sos',
  'fiorenzato-f64e-kahve-degirmeni',

  'fo-cilek-surubu',
  'kervan-kahve-yesil-cay',
  'doro-cake-frambuazli-pasta',
  'davinci-gourmet-vanilya-surubu',
  'vosco-vhs-602cg-dijital-bar-blender',

  'gusse-karamel-sos',
  'kervan-kahve-turk-kahvesi',
  'doro-cake-cikolatali-kurabiye',
  'kervan-kahve-elma-tarcin-cayi',
  'davinci-gourmet-cikolata-surubu',
];

const GENISLIK = 1536;
const YUKSEKLIK = 1024;
const SUTUN = 5;
const SATIR = 3;
const KENAR = 64;          // dış boşluk
const KAGIT = '#FBF8F2';   // ürün kartlarının zemini; katalogla aynı yüzey

const hucreG = (GENISLIK - KENAR * 2) / SUTUN;
const hucreY = (YUKSEKLIK - KENAR * 2) / SATIR;
// Ürünler hücrenin tamamını doldurmaz; nefes payı bırakılıyor.
const kutuG = Math.round(hucreG * 0.92);
const kutuY = Math.round(hucreY * 0.92);

/* Görsel ağırlık dengelemesi.
   Hepsini aynı kutuya sığdırmak yetmiyor: uzun ince bir şişe kutuya
   oturduğunda kapladığı ALAN, geniş bir pastanınkinin yarısı kadar oluyor ve
   ızgara dengesiz görünüyor — şişeler baskın, kurabiye ve fincan kayboluyor.
   Bu yüzden her ürün, kutuya sığma sınırını aşmadan, benzer alanı kaplayacak
   şekilde ölçekleniyor. */
const HEDEF_ALAN = kutuG * kutuY * 0.62;

const bulunan = SECIM.map((slug) => {
  const u = products.find((p) => p.slug === slug);
  if (!u) throw new Error(`ürün bulunamadı: ${slug}`);
  return u;
});

const katmanlar = [];
for (const [i, u] of bulunan.entries()) {
  const sutun = i % SUTUN;
  const satir = Math.floor(i / SUTUN);

  const kaynak = sharp(join(kok, 'src/assets', u.image)).trim();
  const ham = await kaynak.metadata();
  const oran = ham.width / ham.height;

  // Önce hedef alana göre ölçek, sonra kutuya sığdır — hangisi küçükse o.
  let g = Math.sqrt(HEDEF_ALAN * oran);
  let y = g / oran;
  const sigdir = Math.min(kutuG / g, kutuY / y, 1);
  g = Math.round(g * sigdir);
  y = Math.round(y * sigdir);

  const tampon = await sharp(join(kok, 'src/assets', u.image))
    .trim()  // kesitlerin etrafındaki şeffaf payı at, yoksa ölçek yalan söyler
    .resize(g, y, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer();

  const { width, height } = await sharp(tampon).metadata();
  katmanlar.push({
    input: tampon,
    left: Math.round(KENAR + sutun * hucreG + (hucreG - width) / 2),
    top: Math.round(KENAR + satir * hucreY + (hucreY - height) / 2),
  });
}

const hedef = join(kok, 'src/assets/images/about_us/farkimiz.webp');
await sharp({
  create: { width: GENISLIK, height: YUKSEKLIK, channels: 4, background: KAGIT },
})
  .composite(katmanlar)
  .webp({ quality: 86 })
  .toFile(hedef);

console.log(`farkimiz.webp — ${GENISLIK}x${YUKSEKLIK}, ${Math.round(statSync(hedef).size / 1024)} KB`);
console.log(`${bulunan.length} ürün: ${[...new Set(bulunan.map((u) => u.category))].join(', ')}`);
