// Bir adres için QR kod üretir: SVG dosyası + terminale küçük bir kopya
// (telefonla doğrudan ekrandan okutmak için).
//
//   npm run qr                                   → https://kervankahve.com/kafe
//   npm run qr -- https://<onizleme>/kafe.html   → docs/qr/kafe.svg
//   npm run qr -- <adres> docs/qr/masa.svg       → çıktı yolu
//
// Baskı notları (docs/qr-menu-arastirma.md, NN/g ve USF bulguları):
//  - en az 3×3 cm, loş ortamda 4×4; her 10 cm okuma mesafesi için +1 cm
//  - koyu kod açık zemin, renkleri ters çevirme; mat baskı (parlak laminat
//    ışığı kameraya geri yansıtıyor)
//  - yanına "Menü" yazısı ve altına kısa adres — QR'ın kendisi ne olduğunu
//    söylemez
//  - hata düzeltme M: küçük leke ya da kırışıklıkta hâlâ okunur

import QRCode from 'qrcode';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';

const [adres = 'https://kervankahve.com/kafe', cikti = 'docs/qr/kafe.svg'] = process.argv.slice(2);

const secenekler = { errorCorrectionLevel: 'M', margin: 2 };

mkdirSync(dirname(cikti), { recursive: true });
writeFileSync(cikti, await QRCode.toString(adres, { ...secenekler, type: 'svg' }));

console.log(await QRCode.toString(adres, { ...secenekler, type: 'terminal', small: true }));
console.log(`${adres}\n→ ${cikti}`);
