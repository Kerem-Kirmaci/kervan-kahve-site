/**
 * Beyaz stüdyo zeminini şeffaflığa çevirir.
 *
 *   node tools/beyaz-kes.mjs girdi.jpg cikti.webp [--genislik 900]
 *
 * tools/kesit.swift yalnızca macOS'ta çalışıyor (Vision çerçevesi). Bu araç
 * onun yerini tutmaz — kesit rastgele zeminden nesne çıkarır, bu yalnızca
 * DÜZ BEYAZ stüdyo zemini için. Ama AI üretimi veya stüdyo ürün çekimlerinin
 * neredeyse tamamı öyle geliyor ve bu her yerde çalışıyor.
 *
 * Neden eşikleme değil de taşma-doldurma:
 * "Beyaza yakın her piksel şeffaf olsun" demek kolay ama ürünün İÇİNDEKİ
 * beyazı da siler — Kervan logosundaki beyaz KERVAN/KAHVE yazıları böyle
 * delinmişti. Bu yüzden yalnızca KENARA BAĞLI beyaz bölge siliniyor; ürünün
 * içinde kalan beyaz, dışarıya bağlı olmadığı için korunuyor.
 */
import sharp from 'sharp';
import { statSync } from 'node:fs';

const [girdi, cikti] = process.argv.slice(2);
const gi = process.argv.indexOf('--genislik');
const hedefGenislik = gi > -1 ? Number(process.argv[gi + 1]) : 900;
if (!girdi || !cikti) {
  console.error('kullanım: node tools/beyaz-kes.mjs girdi.jpg cikti.webp [--genislik 900]');
  process.exit(1);
}

const ESIK = 242;   // bunun üstündeki her kanal "zemin beyazı" sayılır
const PAY = 12;     // kesimden sonra bırakılan şeffaf kenar payı (px)

// Alfasız oku: aşağıda alfayı kendimiz üretip joinChannel ile ekliyoruz.
// ensureAlpha() ile okursak dört kanal gelir ve joinChannel beşinci kanalı
// eklemeye çalışır — çıktı sessizce bozulur.
const { data, info } = await sharp(girdi).removeAlpha().raw().toBuffer({ resolveWithObject: true });
const { width: W, height: H, channels: C } = info;

const beyazMi = (i) => data[i] >= ESIK && data[i + 1] >= ESIK && data[i + 2] >= ESIK;

// --- kenardan taşma-doldurma (yığınla, özyineleme yok: 2500x1700'de yığın taşar)
const zemin = new Uint8Array(W * H);
const yigin = [];
for (let x = 0; x < W; x++) { yigin.push(x, x + (H - 1) * W); }
for (let y = 0; y < H; y++) { yigin.push(y * W, W - 1 + y * W); }

while (yigin.length) {
  const p = yigin.pop();
  if (zemin[p]) continue;
  if (!beyazMi(p * C)) continue;
  zemin[p] = 1;
  const x = p % W, y = (p / W) | 0;
  if (x > 0) yigin.push(p - 1);
  if (x < W - 1) yigin.push(p + 1);
  if (y > 0) yigin.push(p - W);
  if (y < H - 1) yigin.push(p + W);
}

// --- alfa maskesi + ürünün sınırları
let x0 = W, x1 = 0, y0 = H, y1 = 0;
const alfa = Buffer.alloc(W * H);
for (let p = 0; p < W * H; p++) {
  if (zemin[p]) continue;
  alfa[p] = 255;
  const x = p % W, y = (p / W) | 0;
  if (x < x0) x0 = x; if (x > x1) x1 = x;
  if (y < y0) y0 = y; if (y > y1) y1 = y;
}

// Kenarı hafifçe yumuşat — testere dişi kalmasın.
// toColourspace('b-w') şart: sharp tek kanallı girdiyi bulanıklaştırırken
// sRGB'ye çevirip ÜÇ kanal döndürüyor. Bunu fark etmeden tek kanal gibi
// okursanız alfa kayar ve ürün dikey çizgili, yarı saydam çıkar.
const yumusakAlfa = await sharp(alfa, { raw: { width: W, height: H, channels: 1 } })
  .blur(0.8).toColourspace('b-w').raw().toBuffer();
if (yumusakAlfa.length !== W * H) {
  throw new Error(`alfa arabelleği beklenmedik uzunlukta: ${yumusakAlfa.length}, beklenen ${W * H}`);
}

// RGBA'yı elle örüyoruz. joinChannel + extract birlikte kullanıldığında sharp
// kırpmayı uygulamıyor ve çıktı sessizce yanlış boyutta çıkıyor.
const rgba = Buffer.alloc(W * H * 4);
for (let p = 0; p < W * H; p++) {
  rgba[p * 4] = data[p * C];
  rgba[p * 4 + 1] = data[p * C + 1];
  rgba[p * 4 + 2] = data[p * C + 2];
  rgba[p * 4 + 3] = yumusakAlfa[p];
}

const sol = Math.max(0, x0 - PAY);
const ust = Math.max(0, y0 - PAY);
const kesim = {
  left: sol,
  top: ust,
  width: Math.min(W - 1, x1 + PAY) - sol,
  height: Math.min(H - 1, y1 + PAY) - ust,
};

await sharp(rgba, { raw: { width: W, height: H, channels: 4 } })
  .extract(kesim)
  .resize({ width: hedefGenislik, withoutEnlargement: true })
  .webp({ quality: 88, alphaQuality: 100 })
  .toFile(cikti);

const m = await sharp(cikti).metadata();
console.log(`  ${cikti}  ${m.width}x${m.height}  ${Math.round(statSync(cikti).size / 1024)} KB  alfa:${m.hasAlpha}`);
