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
const closeBtn = document.getElementById('lightbox-close');

let lastTrigger = null;

function open(trigger) {
  if (!lightbox || !image) return;

  const gorsel = trigger.querySelector('img') ?? trigger;
  image.src = trigger.dataset.lightboxSrc || gorsel.currentSrc || gorsel.src;
  image.alt = gorsel.alt || '';
  if (nameEl) nameEl.textContent = trigger.dataset.lightboxName || '';
  if (brandEl) brandEl.textContent = trigger.dataset.lightboxBrand || '';

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
