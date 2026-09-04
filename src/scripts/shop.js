// Mağaza sayfası — filtreleme, arama ve kaydırdıkça ürün açma.
//
// Eski sürümden en önemli fark: ürün kartları artık build sırasında HTML'e
// basılıyor. Bu dosya kart ÜRETMİYOR, yalnızca var olan kartları gösterip
// gizliyor. Sonuçları:
//  - 100 ürün arama motorlarına görünür (eskiden JS üretiyordu, HTML'de yoktu)
//  - filtreleme sırasında yeniden render yok, sadece class değişimi
//  - "her tıkta 72 ürün birden yükleniyor" hatasına yol açan yarış durumu yok
//  - kartlarda inline onclick kalmadı (lightbox olay delegasyonuyla çalışıyor)

const grid = document.getElementById('product-grid');

if (grid) {
  const cards = Array.from(grid.querySelectorAll('.urun-karti'));
  const searchInput = document.getElementById('product-search');
  const countEl = document.getElementById('product-count');
  const loader = document.getElementById('infinite-scroll-loader');
  const endMsg = document.getElementById('end-of-products');
  const noResults = document.getElementById('no-results');
  const sekmeler = Array.from(document.querySelectorAll('.kategori-sekme'));

  const BATCH = Number(grid.dataset.initialVisible) || 24;

  // Tek kategori seçilir; boş dize "Tümü" demektir. Öncesinde onay kutularıyla
  // çoklu seçim vardı ama altı ilgisiz kategoriyi birleştirmek pratikte
  // kullanılmıyordu; kategoriler arası arama zaten arama kutusuyla yapılıyor.
  let selectedCategory = '';
  let searchQuery = '';
  let visibleLimit = BATCH;
  let matching = cards;

  function computeMatching() {
    matching = cards.filter((card) => {
      const categoryOk = selectedCategory === '' || card.dataset.category === selectedCategory;
      const searchOk = searchQuery === '' || (card.dataset.search || '').includes(searchQuery);
      return categoryOk && searchOk;
    });
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

  // ---- Kategori sekmeleri -------------------------------------------------
  function sekmeyiIsaretle(kategori) {
    for (const s of sekmeler) {
      s.setAttribute('aria-selected', String(s.dataset.category === kategori));
    }
  }

  function kategoriSec(kategori, { kaydir = true } = {}) {
    selectedCategory = kategori;
    sekmeyiIsaretle(kategori);
    applyFilters();

    // Adres çubuğu paylaşılabilir kalsın
    const url = new URL(window.location.href);
    if (kategori) url.searchParams.set('category', kategori);
    else url.searchParams.delete('category');
    window.history.replaceState({}, '', url);

    // Derinlerdeyken kategori değiştirince boş ekrana bakmayalım
    if (kaydir && window.scrollY > grid.offsetTop) {
      window.scrollTo({ top: grid.offsetTop - 120, behavior: 'smooth' });
    }
  }

  sekmeler.forEach((s) => {
    s.addEventListener('click', () => kategoriSec(s.dataset.category));
  });

  let searchTimer;
  searchInput?.addEventListener('input', (e) => {
    clearTimeout(searchTimer);
    const value = e.target.value.trim().toLowerCase();
    searchTimer = setTimeout(() => {
      searchQuery = value;
      applyFilters();
    }, 150);
  });

  // ---- URL parametreleri (?category= / ?search=) --------------------------
  const params = new URLSearchParams(window.location.search);
  const urlCategory = params.get('category');
  const urlSearch = params.get('search');

  if (urlCategory && sekmeler.some((s) => s.dataset.category === urlCategory)) {
    selectedCategory = urlCategory;
    sekmeyiIsaretle(urlCategory);
  }

  if (urlSearch) {
    searchQuery = urlSearch.trim().toLowerCase();
    if (searchInput) searchInput.value = urlSearch;
  }

  applyFilters();
}
