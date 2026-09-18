// Mağaza sayfası — arama ve kaydırdıkça ürün açma.
//
// Ürün kartları build sırasında HTML'e basılıyor. Bu dosya kart ÜRETMİYOR,
// yalnızca var olan kartları gösterip gizliyor. Sonuçları:
//  - 100 ürün arama motorlarına görünür (eskiden JS üretiyordu, HTML'de yoktu)
//  - filtreleme sırasında yeniden render yok, sadece class değişimi
//  - "her tıkta 72 ürün birden yükleniyor" hatasına yol açan yarış durumu yok
//  - kartlarda inline onclick kalmadı (lightbox olay delegasyonuyla çalışıyor)
//
// Kategori filtresi artık burada değil: her kategori kendi sayfası
// (/toptan-surup.html gibi, bkz. src/pages/[kategori].astro). Şeritteki
// öğeler düz bağlantı; bu sayfa "Tümü" görünümü.

const grid = document.getElementById('product-grid');

if (grid) {
  const cards = Array.from(grid.querySelectorAll('.urun-karti'));
  const searchInput = document.getElementById('product-search');
  const countEl = document.getElementById('product-count');
  const loader = document.getElementById('infinite-scroll-loader');
  const endMsg = document.getElementById('end-of-products');
  const noResults = document.getElementById('no-results');

  const BATCH = Number(grid.dataset.initialVisible) || 24;

  let searchQuery = '';
  let visibleLimit = BATCH;
  let matching = cards;

  function computeMatching() {
    matching = cards.filter(
      (card) => searchQuery === '' || (card.dataset.search || '').includes(searchQuery)
    );
  }

  function render() {
    const shown = new Set(matching.slice(0, visibleLimit));

    for (const card of cards) {
      card.classList.toggle('product-hidden', !shown.has(card));
    }

    if (countEl) countEl.textContent = `${matching.length} ürün bulundu`;

    const allShown = visibleLimit >= matching.length;
    endMsg?.classList.toggle('hidden', !allShown || matching.length === 0);
    noResults?.classList.toggle('hidden', matching.length !== 0);
    loader?.classList.add('hidden');
  }

  function applyFilters() {
    visibleLimit = BATCH;
    computeMatching();
    render();
  }

  // ---- Kaydırdıkça daha fazla ürün aç -------------------------------------
  // Eski koddaki hata: eşiğe gelince setTimeout planlanıyor ama isLoadingMore
  // bayrağı ancak zamanlayıcı çalışınca set ediliyordu. 300 ms'lik pencerede
  // birden fazla çağrı birikip tek seferde 72 ürün basabiliyordu. Artık bayrak
  // planlama anında set ediliyor.
  let loadingMore = false;

  function revealMore() {
    if (visibleLimit >= matching.length) return;
    visibleLimit = Math.min(visibleLimit + BATCH, matching.length);
    render();
  }

  function onScroll() {
    if (loadingMore || visibleLimit >= matching.length) return;

    const scrolled = window.scrollY + window.innerHeight;
    const threshold = document.documentElement.scrollHeight * 0.8;
    if (scrolled < threshold) return;

    loadingMore = true;
    loader?.classList.remove('hidden');

    setTimeout(() => {
      revealMore();
      loadingMore = false;
    }, 300);
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  let searchTimer;
  searchInput?.addEventListener('input', (e) => {
    clearTimeout(searchTimer);
    const value = e.target.value.trim().toLowerCase();
    searchTimer = setTimeout(() => {
      searchQuery = value;
      applyFilters();
    }, 150);
  });

  // ---- URL parametreleri --------------------------------------------------
  const params = new URLSearchParams(window.location.search);
  const urlCategory = params.get('category');
  const urlSearch = params.get('search');

  // ?category=surup eski bağlantı biçimi (ana sayfa, ürün föyü ve dışarıdan
  // paylaşılmış adresler). Canlıda Netlify bunları 301 ile kategori sayfasına
  // gönderiyor (netlify.toml); burası yerel geliştirme ve başka bir sunucu
  // ihtimali için yedek. Hedef adres şeritteki bağlantıdan okunuyor, ikinci
  // bir eşleme tutulmuyor.
  if (urlCategory) {
    const hedef = document.querySelector(
      `.kategori-baglanti[data-category="${CSS.escape(urlCategory)}"]`
    );
    if (hedef && urlCategory !== '') window.location.replace(hedef.href);
  }

  if (urlSearch) {
    searchQuery = urlSearch.trim().toLowerCase();
    if (searchInput) searchInput.value = urlSearch;
  }

  applyFilters();
}
