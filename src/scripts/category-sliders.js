// Ana sayfa kategori slider'larının ok butonları.
//
// Eski kodda bu kurulum iki ayrı yoldan çağrılıyordu (loadCategorySliders'ın
// sonundan ve setupSliders'tan), bu yüzden her butona click dinleyicisi İKİ KEZ
// bağlanıyordu: bir tıklama 528 px yerine 1056 px kaydırıyor, yani her seferinde
// bir kart atlanıyordu. Artık tek giriş noktası var.
//
// Ayrıca hiçbir HTML elemanıyla eşleşmeyen eski slider sistemi (sliderStates,
// navigateSlider, updateSliderPosition, updateSliderItemsPerView) tamamen silindi.

const sliders = [
  { container: 'syrups-container', left: 'scroll-left-syrups', right: 'scroll-right-syrups' },
  { container: 'pure-container', left: 'scroll-left-pure', right: 'scroll-right-pure' },
  { container: 'sweets-container', left: 'scroll-left-sweets', right: 'scroll-right-sweets' },
  { container: 'coffees-container', left: 'scroll-left-coffees', right: 'scroll-right-coffees' },
  { container: 'teas-container', left: 'scroll-left-teas', right: 'scroll-right-teas' },
  {
    container: 'accessories-container',
    left: 'scroll-left-accessories',
    right: 'scroll-right-accessories',
  },
];

// 160px kart genişliği (w-40) + 16px boşluk (space-x-4) = 176px; 3 kart = 528px
const SCROLL_AMOUNT = 528;

for (const { container, left, right } of sliders) {
  const el = document.getElementById(container);
  const leftBtn = document.getElementById(left);
  const rightBtn = document.getElementById(right);
  if (!el || !leftBtn || !rightBtn) continue;

  leftBtn.addEventListener('click', () =>
    el.scrollBy({ left: -SCROLL_AMOUNT, behavior: 'smooth' })
  );
  rightBtn.addEventListener('click', () =>
    el.scrollBy({ left: SCROLL_AMOUNT, behavior: 'smooth' })
  );
}
