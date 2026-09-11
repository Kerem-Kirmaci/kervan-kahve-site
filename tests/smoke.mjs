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
  'gizlilik-politikasi', 'cerez-politikasi', 'kullanim-sartlari', 'menu', 'kafe',
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
const yanlisAktif = await page.locator('nav.desktop-nav a.active').count();
check('iletisim: menüde yanlış öğe vurgulanmıyor', yanlisAktif === 0,
  `${yanlisAktif} öğe vurgulu`);

// ------------------------------------------------------------------ mobil menü
console.log('\n[3] Mobil menü (hamburger ikonu dahil)');
const mobileCtx = await browser.newContext({ viewport: { width: 375, height: 760 } });
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

await page.click('.kategori-sekme[data-category="espresso"]');
await page.waitForTimeout(200);
check('Kahveler sekmesi 8 ürüne indiriyor', (await visible()) === 8, `${await visible()}`);
check('sayaç sekmeyle güncelleniyor', (await countText())?.includes('8'), await countText());

await page.click('.kategori-sekme[data-category="cay"]');
await page.waitForTimeout(200);
check('Bitki Çayları sekmesi 6 ürüne indiriyor', (await visible()) === 6, `${await visible()}`);

const aktif = await page.locator('.kategori-sekme[aria-selected="true"]').count();
check('tek sekme aktif kalıyor', aktif === 1, `${aktif} sekme aktif`);

await page.click('.kategori-sekme[data-category=""]');
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

// İkinci bir ürüne tıklandığında bir an ÖNCEKİ ürünün fotoğrafı görünüyordu:
// img.src'ye atama yüklemeyi başlatır ama <img> yeni görsel çözülene kadar
// eskisini göstermeye devam eder, modal ise beklemeden açılıyordu. Yükleme
// yavaşlatılıp yakalanıyor — hızlı bağlantıda hata görünmez.
await page.route('**/_astro/**.webp', async (route) => {
  await new Promise((r) => setTimeout(r, 600));
  // unroute çağrıldığında bekleyen yönlendiriciler kalabiliyor; onların
  // continue() çağrısı "Route is already handled" ile patlıyor.
  try {
    await route.continue();
  } catch {}
});
const kartlar = page.locator('.zoomable-image');
await kartlar.nth(0).click();
await page.waitForTimeout(1200); // ilk görsel tam yüklensin
await page.keyboard.press('Escape');
await page.waitForTimeout(300);
await kartlar.nth(1).click();
await page.waitForTimeout(150); // yeni görsel daha yüklenmedi
// currentSrc'ye bakmak işe yaramaz: src atanır atanmaz güncelleniyor ama
// ekranda hâlâ eski görselin pikselleri duruyor. Asıl hatalı durum şu —
// modal açık, görsel henüz yüklenmemiş VE gizlenmemiş. Tarayıcı o aralıkta
// bir öncekini çiziyor.
const durum = await page.evaluate(() => {
  const i = document.getElementById('lightbox-image');
  return {
    modalAcik: document.getElementById('image-lightbox').classList.contains('active'),
    yuklendi: i.complete && i.naturalWidth > 0,
    gizli: i.classList.contains('yukleniyor'),
  };
});
check(
  'ikinci açılışta önceki ürünün fotoğrafı görünmüyor',
  !durum.modalAcik || durum.gizli || durum.yuklendi,
  'modal açık, görsel yüklenmemiş ve gizlenmemiş — eski görsel çiziliyor'
);
await page.unroute('**/_astro/**.webp');
await page.keyboard.press('Escape');
await page.waitForTimeout(300);

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

// ----------------------------------------------------------- iletişim sayfası
console.log('\n[7b] İletişim sayfası (gömülü harita yok)');
const haritaIstekleri = [];
const haritaDinleyici = (req) => {
  if (req.url().includes('google.com/maps')) haritaIstekleri.push(req.url());
};
page.on('request', haritaDinleyici);
await page.goto(`${BASE}/iletisim.html`, { waitUntil: 'networkidle' });
check('sayfada iframe yok', await page.locator('iframe').count() === 0);
check('sayfa açılışında Google Maps isteği yok', haritaIstekleri.length === 0,
  `${haritaIstekleri.length} istek`);
check('yol tarifi bağlantısı var', await page.locator('a[href*="google.com/maps/dir"]').count() === 1);
check('dört kanal kartı var', await page.locator('.kanal-karti').count() === 4);
check('WhatsApp bağlantısı var', await page.locator('.kanal-karti[href*="wa.me"]').count() === 1);
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

// ------------------------------------------------------------ kafe menüsü
console.log('\n[8b] Kafe QR menüsü');
{
  // Masadaki telefon: 390 genişlik, şerit yapışkan, JS bulunulan bölümü işaretler
  const c = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const pg = await c.newPage();
  pg.on('console', (m) => {
    if (m.type() === 'error') consoleErrors.push(`${pg.url()} :: ${m.text()}`);
  });
  pg.on('pageerror', (e) => consoleErrors.push(`${pg.url()} :: ${e.message}`));
  await pg.goto(`${BASE}/kafe.html`, { waitUntil: 'networkidle' });

  check('kafe: noindex', await pg.locator('meta[name="robots"][content*="noindex"]').count() === 1);
  check('kafe: site gezinmesi ve arama yok',
    await pg.locator('nav.desktop-nav, #mobile-menu, form[role="search"], #mobile-menu-btn').count() === 0);

  const serit = await pg.evaluate(() => {
    const cipler = [...document.querySelectorAll('.serit a[href^="#"]')];
    return {
      cip: cipler.length,
      bolum: document.querySelectorAll('main section[id]').length,
      kirik: cipler.filter((a) => !document.getElementById(a.hash.slice(1))).length,
    };
  });
  check('kafe: her kategorinin çipi var ve hedefini buluyor',
    serit.cip > 0 && serit.cip === serit.bolum && serit.kirik === 0, JSON.stringify(serit));

  const fiyat = await pg.evaluate(() => {
    const kalemler = [...document.querySelectorAll('.kalem')];
    const fiyatlar = [...document.querySelectorAll('.fiyat')];
    return {
      kalem: kalemler.length,
      fiyatsiz: kalemler.filter((k) => !k.querySelector('.fiyat')).length,
      bozuk: fiyatlar.filter((f) => !/\d\s?₺$/.test(f.textContent.trim())).length,
    };
  });
  check('kafe: her kalemde fiyat var', fiyat.kalem > 0 && fiyat.fiyatsiz === 0,
    `${fiyat.fiyatsiz}/${fiyat.kalem} fiyatsız`);
  check('kafe: her fiyat ₺ ile bitiyor', fiyat.bozuk === 0, `${fiyat.bozuk} bozuk`);

  // Tatlı görselleri: shop'taki [8] ile aynı ölçüt
  const kafeImg = await pg.evaluate(() => {
    const imgs = [...document.querySelectorAll('main img')];
    return {
      total: imgs.length,
      ok: imgs.filter((i) => i.getAttribute('width') && i.getAttribute('height')
        && i.hasAttribute('alt') && (i.getAttribute('src') || '').endsWith('.webp')).length,
    };
  });
  check('kafe: tatlı görsellerinde width+height, alt ve WebP var',
    kafeImg.total > 0 && kafeImg.ok === kafeImg.total, `${kafeImg.ok}/${kafeImg.total}`);

  await pg.locator('details summary').first().click();
  check('kafe: alerjen/bileşen detayı açılıyor', await pg.locator('details[open]').count() === 1);

  // Gözlemci: ikinci bölüme kaydırınca çipi işaretlenmeli (son bölüm sayfa
  // sonunda banda giremeyebilir, o yüzden ikinci)
  const ikinci = await pg.evaluate(() => document.querySelectorAll('main section[id]')[1].id);
  await pg.evaluate((id) => document.getElementById(id).scrollIntoView(), ikinci);
  await pg.waitForTimeout(600);
  check('kafe: kaydırınca bulunulan kategori şeritte işaretleniyor',
    await pg.locator('.serit a[aria-current="true"]').getAttribute('href') === `#${ikinci}`);

  await pg.emulateMedia({ media: 'print' });
  check('kafe: baskıda şerit gizli', !(await pg.locator('.serit').isVisible()));
  await pg.emulateMedia({ media: null });

  const html = await pg.content();
  check('kafe: HTML 80 KB altında', html.length < 80_000, `${html.length} karakter`);

  await c.close();
}

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
