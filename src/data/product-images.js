// Ürün görsellerini Astro'nun optimize edebileceği nesnelere çevirir.
//
// products.js içinde görseller "images/coffees/etiyopya.png" gibi düz metin
// yollarla tutuluyor. Astro'nun <Image> bileşeni ise içe aktarılmış bir görsel
// nesnesi bekler. import.meta.glob ile tüm görselleri build sırasında toplayıp
// metin yolundan nesneye eşliyoruz.

const modules = import.meta.glob('../assets/images/**/*.{png,jpg,jpeg,webp}', {
  eager: true,
});

/** { 'images/coffees/etiyopya.png': ImageMetadata } biçiminde harita */
const byPath = Object.fromEntries(
  Object.entries(modules).map(([key, mod]) => [key.replace('../assets/', ''), mod.default])
);

/**
 * Ürün görselini döndürür.
 * Yol bulunamazsa build'i sessizce geçmek yerine hata fırlatır — böylece
 * bozuk bir görsel yolu canlıya çıkmadan önce yakalanır.
 */
export function productImage(path) {
  const img = byPath[path];
  if (!img) {
    throw new Error(
      `Ürün görseli bulunamadı: "${path}". src/assets/${path} mevcut mu kontrol edin.`
    );
  }
  return img;
}

export { byPath };

// Ürün dışındaki site görselleri için okunabilir takma ad
// (kategori afişleri, iş ortağı logoları vb.)
export const assetImage = productImage;
