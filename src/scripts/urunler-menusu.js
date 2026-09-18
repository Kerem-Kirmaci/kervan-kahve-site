// Masaüstü menüsündeki kategori paneli ("Ürünlerimiz" ▾) — tüm sayfalarda.
//
// Kalıp: WAI-ARIA "disclosure navigation" — üst bağlantı bağlantı olarak
// kalır, paneli yanındaki buton açar. İmleçle grubun üstüne gelince de
// açılır; ama yalnızca hover'a dayanmıyor, çünkü klavye ve dokunmatik
// kullanıcı hover üretemez.
//
// Kapanma: Escape (odak butona döner), grup dışına tıklama, odağın grup
// dışına çıkması, imlecin gruptan ayrılması.

export function initUrunlerMenusu() {
  const grup = document.querySelector('.nav-grup--acilir');
  const buton = grup?.querySelector('.nav-acici');
  const panel = grup?.querySelector('.nav-panel');
  if (!grup || !buton || !panel) return;

  const acikMi = () => buton.getAttribute('aria-expanded') === 'true';

  const ac = () => {
    panel.hidden = false;
    buton.setAttribute('aria-expanded', 'true');
  };

  const kapat = () => {
    panel.hidden = true;
    buton.setAttribute('aria-expanded', 'false');
  };

  // Tıklama: kapalıysa aç. Açıksa yalnızca imleç grubun üstünde DEĞİLSE
  // kapat — imleçle gelen kullanıcı için panel zaten hover'la açılmış olur,
  // oka tıklaması onu kapatmamalı. Klavyeden (Enter/Space) gelen tıklamada
  // :hover yok, düz aç/kapa çalışır.
  buton.addEventListener('click', () => {
    if (!acikMi()) ac();
    else if (!grup.matches(':hover')) kapat();
  });

  // İmleç: gruba girince aç, çıkınca kısa gecikmeyle kapat. Gecikme,
  // bağlantıdan panele geçerken aradaki birkaç pikselde kapanmasın diye.
  let kapatmaZamanlayici;
  grup.addEventListener('mouseenter', () => {
    clearTimeout(kapatmaZamanlayici);
    ac();
  });
  grup.addEventListener('mouseleave', () => {
    kapatmaZamanlayici = setTimeout(kapat, 150);
  });

  // Klavye: odak gruptan çıkınca kapat
  grup.addEventListener('focusout', (e) => {
    if (e.relatedTarget && grup.contains(e.relatedTarget)) return;
    kapat();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape' || !acikMi()) return;
    kapat();
    buton.focus();
  });

  document.addEventListener('pointerdown', (e) => {
    if (acikMi() && !grup.contains(e.target)) kapat();
  });
}

initUrunlerMenusu();
