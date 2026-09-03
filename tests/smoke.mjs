// Kervan Kahve — build sonrası işlevsel kontrol.
// Sistemdeki Chrome'u sürer (ayrı tarayıcı indirmez).
//
// çalıştırma:  npm run build && npx http-server dist  (veya python3 -m http.server)
//              node tests/smoke.mjs http://127.0.0.1:8900

import { chromium } from 'playwright';

const BASE = process.argv[2] || 'http://127.0.0.1:8900';

let pass = 0;
let fail = 0;
const consoleErrors = [];

function check(name, ok, detail = '') {
  if (ok) {
    pass++;
    console.log(`  ✓ ${name}`);
  } else {
    fail++;
    console.log(`  ✗ ${name}${detail ? ' — ' + detail : ''}`);
  }
}

const browser = await chromium.launch({ channel: 'chrome' });
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await context.newPage();

page.on('console', (m) => {
  if (m.type() === 'error') consoleErrors.push(`${page.url()} :: ${m.text()}`);
});
page.on('pageerror', (e) => consoleErrors.push(`${page.url()} :: ${e.message}`));

const pages = [
  'index', 'shop', 'hakkimizda', 'ortaklik', 'iletisim',
  'gizlilik-politikasi', 'cerez-politikasi', 'kullanim-sartlari', 'menu',
];

// ---------------------------------------------------------------- sayfa yapısı
console.log('\n[1] Sayfa yapısı ve başlıklar');
for (const p of pages) {
  await page.goto(`${BASE}/${p}.html`, { waitUntil: 'networkidle' });
  const h1 = await page.locator('h1').count();
  check(`${p}: tam olarak bir <h1>`, h1 === 1, `${h1} adet bulundu`);
  const hasHeader = await page.locator('header').count();
  const hasFooter = await page.locator('footer').count();
  check(`${p}: header + footer var`, hasHeader === 1 && hasFooter === 1);
}

// ---------------------------------------------------------- aktif menü vurgusu
console.log('\n[2] Aktif sayfa vurgusu');
const activeMap = { shop: 'Ürünlerimiz', ortaklik: 'İş Ortaklığı', hakkimizda: 'Hakkımızda' };
for (const [slug, label] of Object.entries(activeMap)) {
  await page.goto(`${BASE}/${slug}.html`, { waitUntil: 'domcontentloaded' });
  const active = await page.locator('nav.desktop-nav a.active').first().textContent();
  check(`${slug}: masaüstü menüde "${label}" aktif`, active?.trim() === label, `bulunan: ${active}`);
}
await page.goto(`${BASE}/iletisim.html`, { waitUntil: 'domcontentloaded' });
const bottomActive = await page.locator('.bottom-nav a[aria-current="page"]').count();
check('iletisim: alt menüde yanlış öğe vurgulanmıyor', bottomActive === 0,
  `${bottomActive} öğe vurgulu`);

// ------------------------------------------------------------------ mobil menü
console.log('\n[3] Mobil menü (hamburger ikonu dahil)');
const mobileCtx = await browser.newContext({ viewport: { width: 820, height: 900 } });
const mpage = await mobileCtx.newPage();
mpage.on('pageerror', (e) => consoleErrors.push(`${mpage.url()} :: ${e.message}`));
for (const p of ['index', 'shop', 'gizlilik-politikasi', 'kullanim-sartlari']) {
  await mpage.goto(`${BASE}/${p}.html`, { waitUntil: 'domcontentloaded' });
  await mpage.click('#mobile-menu-btn');
  await mpage.waitForTimeout(400);
  const open = await mpage.locator('#mobile-menu.active').count();
  const closeIconVisible = await mpage.locator('#close-icon').isVisible();
  const hamburgerHidden = !(await mpage.locator('#hamburger-icon').isVisible());
  check(`${p}: menü açılıyor`, open === 1);
  check(`${p}: hamburger ikonu kapatma ikonuna dönüşüyor`, closeIconVisible && hamburgerHidden);
  await mpage.keyboard.press('Escape');
  await mpage.waitForTimeout(400);
  check(`${p}: ESC ile kapanıyor`, (await mpage.locator('#mobile-menu.active').count()) === 0);
}

// ----------------------------------------------------------------- mağaza akışı
console.log('\n[4] Mağaza: filtre, arama, sonsuz kaydırma');
await page.goto(`${BASE}/shop.html`, { waitUntil: 'networkidle' });

const visible = () => page.locator('.urun-karti:not(.product-hidden)').count();
const countText = () => page.locator('#product-count').textContent();

check('başlangıçta 24 ürün görünür', (await visible()) === 24, `${await visible()}`);
check('sayaç 100 ürün diyor', (await countText())?.includes('100'), await countText());

await page.check('.category-checkbox[data-category="espresso"]');
await page.waitForTimeout(300);
check('Kahveler filtresi 8 ürüne indiriyor', (await visible()) === 8, `${await visible()}`);
check('sayaç filtreyle güncelleniyor', (await countText())?.includes('8'), await countText());

await page.check('.category-checkbox[data-category="cay"]');
await page.waitForTimeout(300);
check('iki kategori birlikte 14 ürün', (await visible()) === 14, `${await visible()}`);

await page.click('#clear-filters');
await page.waitForTimeout(300);
check('filtre temizleme 24 görünüre dönüyor', (await visible()) === 24, `${await visible()}`);

await page.fill('#product-search', 'vanilya');
await page.waitForTimeout(400);
const searchCount = await visible();
check('arama sonuç veriyor', searchCount > 0 && searchCount < 24, `${searchCount} sonuç`);

await page.fill('#product-search', 'zzzbulunamaz');
await page.waitForTimeout(400);
check('sonuçsuz aramada uyarı görünüyor', await page.locator('#no-results').isVisible());
check('sonuçsuz aramada 0 kart', (await visible()) === 0);

await page.fill('#product-search', '');
await page.waitForTimeout(400);

// sonsuz kaydırma: tek seferde 24'er artmalı
await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
await page.waitForTimeout(900);
const after1 = await visible();
check('kaydırınca 48 ürüne çıkıyor (72 değil)', after1 === 48, `${after1}`);

await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
await page.waitForTimeout(900);
check('ikinci kaydırmada 72', (await visible()) === 72, `${await visible()}`);

// URL parametresi
await page.goto(`${BASE}/shop.html?category=surup`, { waitUntil: 'networkidle' });
check('?category=surup çalışıyor', (await visible()) === 15, `${await visible()}`);
await page.goto(`${BASE}/shop.html?search=kahve`, { waitUntil: 'networkidle' });
check('?search=kahve çalışıyor', (await visible()) > 0, `${await visible()}`);

// ------------------------------------------------------------------- lightbox
console.log('\n[5] Lightbox');
await page.goto(`${BASE}/shop.html`, { waitUntil: 'networkidle' });
await page.locator('.zoomable-image').first().click();
await page.waitForTimeout(400);
check('lightbox açılıyor', await page.locator('#image-lightbox.active').isVisible());
const lbSrc = await page.locator('#lightbox-image').getAttribute('src');
check('lightbox görseli dolu', Boolean(lbSrc && lbSrc.length > 5), lbSrc ?? '');
const lbName = await page.locator('#lightbox-name').textContent();
check('lightbox ürün adı dolu', Boolean(lbName?.trim()), lbName ?? '');
await page.keyboard.press('Escape');
await page.waitForTimeout(400);
check('ESC ile kapanıyor', (await page.locator('#image-lightbox.active').count()) === 0);

// ------------------------------------------------------ ana sayfa slider okları
console.log('\n[6] Ana sayfa slider okları (çift kayma bug\'ı)');
await page.goto(`${BASE}/index.html`, { waitUntil: 'networkidle' });
const before = await page.evaluate(() => document.getElementById('syrups-container').scrollLeft);
await page.click('#scroll-right-syrups');
await page.waitForTimeout(900);
const afterScroll = await page.evaluate(() => document.getElementById('syrups-container').scrollLeft);
const delta = afterScroll - before;
check('sağ ok tam 528px kaydırıyor (1056 değil)', Math.abs(delta - 528) < 5, `${delta}px kaydı`);

const sliderCards = await page.locator('#syrups-container [data-product-id]').count();
check('slider ürünleri HTML\'de basılı', sliderCards === 15, `${sliderCards} kart`);

// ------------------------------------------------------------- ortaklık formu
console.log('\n[7] Ortaklık formu ve KVKK onayı');
await page.goto(`${BASE}/ortaklik.html`, { waitUntil: 'networkidle' });
check('KVKK onay kutusu var', await page.locator('#kvkk-consent').count() === 1);
check('KVKK kutusu zorunlu', await page.locator('#kvkk-consent').getAttribute('required') !== null);
await page.fill('#company-name', 'Test Kafe');
await page.fill('#contact-person', 'Test Kişi');
await page.fill('#email', 'test@example.com');
await page.fill('#phone', '5551234567');
await page.fill('#business-type', 'Kafe');
await page.fill('#message', 'Deneme mesajı');
const validBefore = await page.evaluate(() =>
  document.getElementById('partnership-form').checkValidity());
check('onay kutusu işaretsizken form geçersiz', validBefore === false);
await page.check('#kvkk-consent');
const validAfter = await page.evaluate(() =>
  document.getElementById('partnership-form').checkValidity());
check('onay kutusu işaretliyken form geçerli', validAfter === true);

// -------------------------------------------------------------- harita cephesi
console.log('\n[7b] İletişim haritası (tıklayınca yükleniyor)');
const haritaIstekleri = [];
const haritaDinleyici = (req) => {
  if (req.url().includes('google.com/maps')) haritaIstekleri.push(req.url());
};
page.on('request', haritaDinleyici);
await page.goto(`${BASE}/iletisim.html`, { waitUntil: 'networkidle' });
check('başlangıçta harita cephesi görünüyor', await page.locator('#map-embed').isVisible());
check('başlangıçta iframe yok', await page.locator('iframe').count() === 0);
check('sayfa açılışında Google Maps isteği yok', haritaIstekleri.length === 0,
  `${haritaIstekleri.length} istek`);
check('yol tarifi bağlantısı var', await page.locator('.map-facade-link').count() === 1);
await page.click('#map-load');
await page.waitForTimeout(1500);
check('tıklayınca iframe yükleniyor', await page.locator('iframe').count() === 1);
const haritaSrc = await page.locator('iframe').getAttribute('src');
check('iframe doğru adrese bakıyor', (haritaSrc || '').includes('google.com/maps/embed'));
check('cephe kayboluyor', await page.locator('#map-embed').count() === 0);
page.off('request', haritaDinleyici);

// --------------------------------------------------------- görsel öznitelikleri
console.log('\n[8] Görsel öznitelikleri (düzen kayması)');
await page.goto(`${BASE}/shop.html`, { waitUntil: 'networkidle' });
const imgStats = await page.evaluate(() => {
  // Lightbox görseli tıklanana kadar boştur (src ve alt'ı JS dolduruyor) — hariç.
  const imgs = [...document.querySelectorAll('main img')].filter((i) => i.id !== 'lightbox-image');
  return {
    total: imgs.length,
    withDims: imgs.filter((i) => i.getAttribute('width') && i.getAttribute('height')).length,
    withAlt: imgs.filter((i) => i.getAttribute('alt')).length,
    // currentSrc değil src'ye bakıyoruz: gizli kartlardaki lazy görseller
    // henüz indirilmemiş olabilir, ama kaynakları yine de WebP'dir.
    webp: imgs.filter((i) => (i.getAttribute('src') || '').endsWith('.webp')).length,
  };
});
check('tüm görsellerde width+height var', imgStats.withDims === imgStats.total,
  `${imgStats.withDims}/${imgStats.total}`);
check('tüm görsellerde alt var', imgStats.withAlt === imgStats.total,
  `${imgStats.withAlt}/${imgStats.total}`);
check('görseller WebP olarak sunuluyor', imgStats.webp === imgStats.total,
  `${imgStats.webp}/${imgStats.total}`);

// -------------------------------------------------------------- yatay taşma
console.log('\n[9] Yatay taşma (mobil/tablet/masaüstü)');
for (const w of [375, 768, 1280]) {
  const c = await browser.newContext({ viewport: { width: w, height: 900 } });
  const pg = await c.newPage();
  for (const p of pages) {
    await pg.goto(`${BASE}/${p}.html`, { waitUntil: 'networkidle' });
    const overflow = await pg.evaluate(() =>
      document.documentElement.scrollWidth - document.documentElement.clientWidth);
    if (overflow > 1) check(`${w}px ${p}: yatay taşma yok`, false, `${overflow}px taşma`);
  }
  check(`${w}px: hiçbir sayfada yatay taşma yok`, true);
  await c.close();
}

// ------------------------------------------------------------------ konsol
console.log('\n[10] Konsol hataları');
check('konsolda hata yok', consoleErrors.length === 0, consoleErrors.slice(0, 5).join(' | '));

await browser.close();

console.log(`\n${'='.repeat(60)}`);
console.log(`GEÇEN: ${pass}   KALAN: ${fail}`);
process.exit(fail > 0 ? 1 : 0);
