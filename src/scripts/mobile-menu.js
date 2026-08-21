// Mobil menü — tüm sayfalarda yüklenir.
//
// Eski sürümden farklar:
//  - transform artık elle yazılmıyor; .mobile-menu.active CSS kuralı hallediyor
//    (eski kodda HTML'deki inline !important stilini ezmek için gerekiyordu).
//  - Bütün elemanlar için null kontrolü var; eskiden mobileMenu null olsaydı
//    TypeError atacaktı.
//  - aria-expanded ve buton etiketi durumla birlikte güncelleniyor.
//  - Mobil filtre başlatması buradan çıkarıldı; artık ayrı bir modül (shop'a özel).

export function initMobileMenu() {
  const btn = document.getElementById('mobile-menu-btn');
  const menu = document.getElementById('mobile-menu');
  const overlay = document.getElementById('mobile-menu-overlay');
  const closeBtn = document.getElementById('mobile-menu-close');
  const hamburgerIcon = document.getElementById('hamburger-icon');
  const closeIcon = document.getElementById('close-icon');

  if (!menu || !overlay) return;

  const setIcons = (isOpen) => {
    hamburgerIcon?.classList.toggle('hidden', isOpen);
    closeIcon?.classList.toggle('hidden', !isOpen);
  };

  const open = () => {
    menu.classList.add('active');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    btn?.setAttribute('aria-expanded', 'true');
    btn?.setAttribute('aria-label', 'Menüyü kapat');
    setIcons(true);
  };

  const close = () => {
    menu.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
    btn?.setAttribute('aria-expanded', 'false');
    btn?.setAttribute('aria-label', 'Menüyü aç');
    setIcons(false);
  };

  const toggle = () => (menu.classList.contains('active') ? close() : open());

  btn?.addEventListener('click', toggle);
  closeBtn?.addEventListener('click', close);
  overlay.addEventListener('click', close);

  // Bir menü linkine tıklanınca menü kapansın
  menu.querySelectorAll('a').forEach((link) => link.addEventListener('click', close));

  // ESC ile kapat
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('active')) close();
  });
}

initMobileMenu();
