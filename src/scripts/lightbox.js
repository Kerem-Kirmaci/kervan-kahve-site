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

  image.src = trigger.dataset.lightboxSrc || trigger.currentSrc || trigger.src;
  image.alt = trigger.alt || '';
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
    if (e.key === 'Escape' && lightbox.classList.contains('active')) close();
  });
}
