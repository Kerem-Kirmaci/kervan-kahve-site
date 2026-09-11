// Kafe QR menüsü — bulunulan kategoriyi şeritte işaretler.
//
// Sayfa JS olmadan da çalışır: çipler #bölüm bağlantısı, bölümler
// scroll-margin-top ile şeridin altına iniyor. Bu dosya yalnızca iki şey
// ekler:
//  - kaydırdıkça görünen bölümün çipine aria-current="true" verir ve çipi
//    şeridin ortasına getirir (serit.scrollTo — scrollIntoView değil, o iOS
//    Safari'de sayfayı dikeyde de oynatıyor)
//  - yazdırmadan önce bütün <details>'ları açar; kapalı details içeriğini
//    CSS tek başına basamıyor ve basılı menüde alerjen/bileşen görünmeli

const serit = document.querySelector('.serit-ic');
const cipler = serit ? Array.from(serit.querySelectorAll('a[href^="#"]')) : [];
const bolumler = cipler
  .map((a) => document.getElementById(decodeURIComponent(a.hash.slice(1))))
  .filter(Boolean);

if (serit && bolumler.length && 'IntersectionObserver' in window) {
  const sakin = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const isaretle = (id) => {
    for (const cip of cipler) {
      if (cip.hash !== `#${id}`) {
        cip.removeAttribute('aria-current');
        continue;
      }
      cip.setAttribute('aria-current', 'true');
      serit.scrollTo({
        left: cip.offsetLeft - (serit.clientWidth - cip.offsetWidth) / 2,
        behavior: sakin ? 'auto' : 'smooth',
      });
    }
  };

  // Şeridin hemen altındaki bant: bir bölümün başlığı oraya girince o bölüm
  // "bulunulan" sayılır. Alt sınır %60 kesilerek uzun bölümlerde iki bölümün
  // aynı anda seçilmesi önlenir.
  const gozcu = new IntersectionObserver(
    (girdiler) => {
      for (const g of girdiler) if (g.isIntersecting) isaretle(g.target.id);
    },
    { rootMargin: `-${Math.round(serit.getBoundingClientRect().height)}px 0px -60% 0px` }
  );
  bolumler.forEach((b) => gozcu.observe(b));
}

window.addEventListener('beforeprint', () => {
  document.querySelectorAll('details').forEach((d) => {
    d.open = true;
  });
});
