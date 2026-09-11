/**
 * Sosyal paylaşım kartını üretir: tools/og-kart.html → public/og-image.jpg
 *
 * Kart, bağlantı WhatsApp / LinkedIn / X'te paylaşıldığında görünen görsel.
 * Önceden yalnızca logo vardı; şimdi sitenin konumlandırma cümlesini taşıyor.
 *
 * Metni veya tasarımı değiştirmek için `og-kart.html`i düzenleyip bunu
 * yeniden çalıştır — kart elle çizilmiş bir görsel değil, sayfanın kendisiyle
 * aynı paletten ve aynı yazı tipinden üretiliyor.
 *
 *   node tools/og-kart-uret.mjs
 *
 * Sistemdeki Chrome'u sürer (tests/smoke.mjs gibi), ayrı tarayıcı indirmez.
 * 2× çekip 1200×630'a küçültür: metin kenarları böyle daha temiz çıkıyor.
 */
import { chromium } from 'playwright';
import sharp from 'sharp';
import { readFileSync, writeFileSync, unlinkSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const kokDizin = join(dirname(fileURLToPath(import.meta.url)), '..');
const kaynak = join(kokDizin, 'tools', 'og-kart.html');
const hedef = join(kokDizin, 'public', 'og-image.jpg');
const gecici = join(kokDizin, 'tools', '.og-kart-render.html');

// Logo data URI olarak gömülüyor: file:// sayfasından yerel dosya okumak
// tarayıcının güvenlik kısıtlarına takılabiliyor.
const logo = readFileSync(join(kokDizin, 'src/assets/images/logo.png')).toString('base64');
writeFileSync(gecici, readFileSync(kaynak, 'utf8').replace('LOGO_SRC', `data:image/png;base64,${logo}`));

const browser = await chromium.launch({ channel: 'chrome' });
try {
  const page = await browser.newPage({
    viewport: { width: 1200, height: 630 },
    deviceScaleFactor: 2,
  });
  await page.goto(`file:///${gecici.replace(/\\/g, '/')}`);
  // Archivo uzaktan yükleniyor; yüklenmeden çekersek yedek yazı tipi basılır.
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(600);

  const png = await page.screenshot({ clip: { x: 0, y: 0, width: 1200, height: 630 } });
  await sharp(png)
    .resize(1200, 630, { kernel: 'lanczos3' })
    // 4:4:4 — koyu zeminde açık metnin kenarları renk altörneklemesiyle kirleniyor
    .jpeg({ quality: 88, chromaSubsampling: '4:4:4', mozjpeg: true })
    .toFile(hedef);

  console.log(`public/og-image.jpg — 1200x630, ${Math.round(statSync(hedef).size / 1024)} KB`);
} finally {
  await browser.close();
  unlinkSync(gecici);
}
