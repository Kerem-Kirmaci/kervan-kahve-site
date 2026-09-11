// Ürün görseli büyütme.
//
// Eski sürümden farklar:
//  - Kartlardaki inline onclick="openLightbox(id)" kaldırıldı; artık olay
//    delegasyonu kullanılıyor. Bu, global fonksiyon ihtiyacını ortadan kaldırdı
//    ve modül sistemine geçişin önündeki tek engeldi.
//  - Ürün bilgisi products dizisinden aranmıyor; kartın kendi data-* özniteliklerinden
//    okunuyor. Böylece lightbox veri katmanından tamamen bağımsız.
//  - Odak yönetimi eklendi: açılırken kapatma butonuna odaklanır, kapanınca
//    tetikleyen görsele geri döner.

const lightbox = document.getElementById('image-lightbox');
const image = document.getElementById('lightbox-image');
const nameEl = document.getElementById('lightbox-name');
const brandEl = document.getElementById('lightbox-brand');
const descEl = document.getElementById('lightbox-desc');
const notesEl = document.getElementById('lightbox-notes');
const linkEl = document.getElementById('lightbox-link');
const linkTextEl = document.getElementById('lightbox-link-text');
const closeBtn = document.getElementById('lightbox-close');

let lastTrigger = null;

// Her açılışa bir numara veriyoruz: hızlıca iki ürüne tıklanırsa eskisinin
// yüklenmesi sonradan bitip yenisinin üstüne binmesin.
let acilisNo = 0;

/**
 * Görseli değiştirir ve yüklenene kadar gizli tutar.
 *
 * `img.src`e atama yapmak yüklemeyi başlatır ama <img> yeni görsel çözülene
 * kadar BİR ÖNCEKİNİ göstermeye devam eder. Modal beklemeden açıldığı için
 * ikinci ve sonraki açılışlarda bir an önceki ürünün fotoğrafı görünüyordu.
 *
 * Modal yine anında açılıyor — bilgi sütunu hemen okunuyor — yalnızca görsel
 * hazır olduğunda beliriyor. Önbellekteyse bekleme hiç olmuyor.
 */
function gorseliDegistir(src, alt) {
  const no = ++acilisNo;
  image.alt = alt;
  image.classList.add('yukleniyor');
  image.src = src;

  if (image.complete && image.naturalWidth > 0) {
    image.classList.remove('yukleniyor');
    return;
  }

  image
    .decode()
    // src bu arada değişirse decode() reddediyor; yeni açılış zaten
    // kendi numarasıyla ilgileniyor.
    .catch(() => {})
    .then(() => {
      if (no === acilisNo) image.classList.remove('yukleniyor');
    });
}

function open(trigger) {
  if (!lightbox || !image) return;

  const gorsel = trigger.querySelector('img') ?? trigger;
  const d = trigger.dataset;

  gorseliDegistir(d.lightboxSrc || gorsel.currentSrc || gorsel.src, gorsel.alt || '');
  if (nameEl) nameEl.textContent = d.lightboxName || '';
  if (brandEl) brandEl.textContent = d.lightboxBrand || '';
  if (descEl) descEl.textContent = d.lightboxDesc || '';

  // Tat notları
  if (notesEl) {
    notesEl.textContent = '';
    for (const not of (d.lightboxNotes || '').split('|').filter(Boolean)) {
      const li = document.createElement('li');
      li.textContent = not;
      notesEl.appendChild(li);
    }
  }

  // Kategoriye götüren bağlantı
  if (linkEl && linkTextEl) {
    linkEl.href = d.lightboxHref || '/shop.html';
    linkTextEl.textContent = d.lightboxCategory
      ? `${d.lightboxCategory} içinde gör`
      : 'Tüm ürünler';
  }

  lightbox.classList.add('active');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';

  lastTrigger = trigger;
  closeBtn?.focus();
}

function close() {
  if (!lightbox) return;
  lightbox.classList.remove('active');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  lastTrigger?.focus();
  lastTrigger = null;
}

if (lightbox) {
  // Olay delegasyonu: sayfaya sonradan eklenen kartlar için de çalışır
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('.zoomable-image');
    if (trigger) open(trigger);
  });

  closeBtn?.addEventListener('click', close);

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) close();
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;

    if (e.key === 'Escape') {
      close();
      return;
    }

    // Odak tuzağı: Tab, arkadaki sayfaya kaçıyordu. Lightbox bir modal
    // (aria-modal), odak içeride kalmalı.
    if (e.key === 'Tab') {
      const odaklanabilir = lightbox.querySelectorAll(
        'a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
      );
      if (odaklanabilir.length === 0) return;
      const ilk = odaklanabilir[0];
      const son = odaklanabilir[odaklanabilir.length - 1];
      if (e.shiftKey && document.activeElement === ilk) {
        e.preventDefault();
        son.focus();
      } else if (!e.shiftKey && document.activeElement === son) {
        e.preventDefault();
        ilk.focus();
      }
    }
  });
}
