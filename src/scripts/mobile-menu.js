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
  const closeBtn = document.getElementById('mobile-menu-close');
  const hamburgerIcon = document.getElementById('hamburger-icon');
  const closeIcon = document.getElementById('close-icon');

  if (!menu) return;

  const setIcons = (isOpen) => {
    hamburgerIcon?.classList.toggle('hidden', isOpen);
    closeIcon?.classList.toggle('hidden', !isOpen);
  };

  const open = () => {
    menu.classList.add('active');
    document.body.style.overflow = 'hidden';
    btn?.setAttribute('aria-expanded', 'true');
    btn?.setAttribute('aria-label', 'Menüyü kapat');
    setIcons(true);
    closeBtn?.focus();
  };

  const close = () => {
    menu.classList.remove('active');
    document.body.style.overflow = '';
    btn?.setAttribute('aria-expanded', 'false');
    btn?.setAttribute('aria-label', 'Menüyü aç');
    setIcons(false);
    btn?.focus();
  };

  const toggle = () => (menu.classList.contains('active') ? close() : open());

  btn?.addEventListener('click', toggle);
  closeBtn?.addEventListener('click', close);
  // Bir menü linkine tıklanınca menü kapansın
  menu.querySelectorAll('a').forEach((link) => link.addEventListener('click', close));

  document.addEventListener('keydown', (e) => {
    if (!menu.classList.contains('active')) return;

    if (e.key === 'Escape') {
      close();
      return;
    }

    // Menü bir modal (aria-modal); odak arkadaki sayfaya kaçmasın
    if (e.key === 'Tab') {
      const odaklanabilir = menu.querySelectorAll('a[href], button');
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

initMobileMenu();
