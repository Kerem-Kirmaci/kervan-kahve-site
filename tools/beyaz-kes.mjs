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

/* --zemin <#rrggbb> : şeffaflık yerine zemini bu renge boyar.
 *
 * ŞEFFAF AMBALAJLAR İÇİN. Beyaz zeminde çekilmiş şeffaf bir poşette, opak
 * beyaz etiketi şeffaf filmden ayırmak mümkün değil — ikisi de beyaz, ikisi
 * de dış zemine bağlı. Hangi eşik seçilirse seçilsin ya etiket siliniyor ya
 * gölge kalıyor; bilgi görselde yok.
 *
 * Doğrusu zaten şudur: şeffaf poşet arkasındaki yüzeyi göstermeli. Zemini
 * kartın rengine boyayınca poşet kartın üstünde doğru görünür.
 *
 * Karşılığı: çıktı opak olur. Kart zemini ileride değişirse bu görseller
 * uyumsuz kalır — o yüzden yalnızca gerektiğinde kullanın, ürün opak ise
 * şeffaf kesim her zaman daha sağlam.
 */
const zi = process.argv.indexOf('--zemin');
const ZEMIN_RENK = zi > -1 ? process.argv[zi + 1] : null;
if (!girdi || !cikti) {
  console.error('kullanım: node tools/beyaz-kes.mjs girdi.jpg cikti.webp [--genislik 900]');
  process.exit(1);
}

// Bunun üstündeki her kanal "zemin beyazı" sayılır. Şeffaf ambalajlarda
// dikkat: poşetin boş üst kısmı zeminle aynı parlaklıkta olabiliyor ve
// doldurma içeri sızıp poşeti yiyor. Öyle bir durumda eşiği YÜKSELTİN.
const ei = process.argv.indexOf('--esik');
const ESIK = ei > -1 ? Number(process.argv[ei + 1]) : 242;
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

// --- serpinti artıkları ele
// Zemindeki vinyet/gölge kalıntıları eşiği geçemeyip ön planda kalıyor ve
// kadraja serpiliyor. Görünmüyorlar ama sınırlayıcı kutuyu şişiriyorlar:
// ürün karta object-contain ile oturduğu için asıl ürün üçte bir boyutta
// görünüyordu.
//
// YALNIZCA EN BÜYÜK bileşeni tutmak yetmiyor: şeffaf ambalajda poşetin boş
// üst kısmı zeminle aynı parlaklıkta olduğu için siliniyor ve etiket ayrı
// bir parça hâline geliyor. Etiket ürünün en önemli parçası ama en büyük
// kütle değil — tek bileşen tutulunca logoyla birlikte atılıyordu.
// Bu yüzden kayda değer BÜTÜN bileşenler tutuluyor, yalnızca serpinti elenir.
const bilesen = new Int32Array(W * H).fill(-1);
const boyutlar = new Map();
let enBuyukBoy = 0;
for (let bas = 0; bas < W * H; bas++) {
  if (zemin[bas] || bilesen[bas] !== -1) continue;
  const kimlik = bas;
  let boy = 0;
  const y = [bas];
  bilesen[bas] = kimlik;
  while (y.length) {
    const p = y.pop();
    boy++;
    const x = p % W, yy = (p / W) | 0;
    const komsu = [];
    if (x > 0) komsu.push(p - 1);
    if (x < W - 1) komsu.push(p + 1);
    if (yy > 0) komsu.push(p - W);
    if (yy < H - 1) komsu.push(p + W);
    for (const k of komsu) {
      if (!zemin[k] && bilesen[k] === -1) { bilesen[k] = kimlik; y.push(k); }
    }
  }
  boyutlar.set(kimlik, boy);
  if (boy > enBuyukBoy) enBuyukBoy = boy;
}

// En büyük kütlenin %1'inden küçük her parça serpinti sayılır.
//
// Zemin boyama kipinde bu filtre UYGULANMAZ: orada beyaz etiket kartı da
// siliniyor ve üstündeki her harf ayrı bir küçük parçaya dönüşüyor. Filtre
// açık olsaydı harfler serpinti sanılıp atılırdı — "YEŞİL ÇAY" yazısı
// "YEŞ" olarak çıkmıştı. O kipte artıklar zaten zemin rengine boyandığı
// için görünmüyor, elemeye gerek yok.
const ASGARI = ZEMIN_RENK ? 0 : enBuyukBoy * 0.01;
const tutulan = new Set([...boyutlar].filter(([, b]) => b >= ASGARI).map(([k]) => k));

// --- ürünün sınırları
// Zemin boyama kipinde silüeti alfadan alamayız (film beyaz, zeminle aynı).
// Onun yerine ürünün AYIRT EDİLEBİLİR kısımlarını arıyoruz: çay, etiket
// kenarı, logo, zımba, poşetin kırışık gölgeleri. Hepsi zeminden belirgin
// biçimde koyu.
let x0 = W, x1 = 0, y0 = H, y1 = 0;
if (ZEMIN_RENK) {
  // Tek tek koyu piksellere bakmak yetmiyor: gölgenin ucundaki bir tek piksel
  // bile kutuyu o yöne uzatıyor ve ürün kadrajda sola/sağa kayıyor. Onun
  // yerine satır ve sütun YOĞUNLUKLARINA bakıp seyrek uçları atıyoruz.
  const sut = new Int32Array(W), sat = new Int32Array(H);
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const i = (y * W + x) * C;
      if (data[i] < 215 || data[i + 1] < 215 || data[i + 2] < 215) { sut[x]++; sat[y]++; }
    }
  }
  const esikSut = Math.max(...sut) * 0.01;
  const esikSat = Math.max(...sat) * 0.01;
  x0 = sut.findIndex((v) => v >= esikSut);
  x1 = W - 1 - [...sut].reverse().findIndex((v) => v >= esikSut);
  y0 = sat.findIndex((v) => v >= esikSat);
  y1 = H - 1 - [...sat].reverse().findIndex((v) => v >= esikSat);
}
const alfa = Buffer.alloc(W * H);
for (let p = 0; p < W * H; p++) {
  if (zemin[p] || !tutulan.has(bilesen[p])) continue;
  alfa[p] = 255;
  if (ZEMIN_RENK) continue;
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

let boru = sharp(rgba, { raw: { width: W, height: H, channels: 4 } })
  .extract(kesim)
  .resize({ width: hedefGenislik, withoutEnlargement: true });

// Zemin rengi verildiyse şeffaflığı o rengin üstüne düzleştiriyoruz.
if (ZEMIN_RENK) boru = boru.flatten({ background: ZEMIN_RENK });

await boru.webp({ quality: 88, alphaQuality: 100 }).toFile(cikti);

const m = await sharp(cikti).metadata();
console.log(`  ${cikti}  ${m.width}x${m.height}  ${Math.round(statSync(cikti).size / 1024)} KB  alfa:${m.hasAlpha}`);
