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
  const clearBtn = document.getElementById('clear-filters');
  const loader = document.getElementById('infinite-scroll-loader');
  const endMsg = document.getElementById('end-of-products');
  const noResults = document.getElementById('no-results');
  const checkboxes = Array.from(document.querySelectorAll('.category-checkbox'));

  const BATCH = Number(grid.dataset.initialVisible) || 24;

  let selectedCategories = [];
  let searchQuery = '';
  let visibleLimit = BATCH;
  let matching = cards;

  function computeMatching() {
    matching = cards.filter((card) => {
      const categoryOk =
        selectedCategories.length === 0 || selectedCategories.includes(card.dataset.category);
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

  // ---- Filtre girdileri ---------------------------------------------------
  checkboxes.forEach((box) => {
    box.addEventListener('change', () => {
      selectedCategories = checkboxes
        .filter((b) => b.checked)
        .map((b) => b.dataset.category);
      applyFilters();
    });
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

  clearBtn?.addEventListener('click', () => {
    checkboxes.forEach((b) => (b.checked = false));
    if (searchInput) searchInput.value = '';
    selectedCategories = [];
    searchQuery = '';
    applyFilters();
  });

  // ---- URL parametreleri (?category= / ?search=) --------------------------
  const params = new URLSearchParams(window.location.search);
  const urlCategory = params.get('category');
  const urlSearch = params.get('search');

  if (urlCategory) {
    const box = checkboxes.find((b) => b.dataset.category === urlCategory);
    if (box) {
      box.checked = true;
      selectedCategories = [urlCategory];
    }
  }

  if (urlSearch) {
    searchQuery = urlSearch.trim().toLowerCase();
    if (searchInput) searchInput.value = urlSearch;
  }

  applyFilters();
}

// ---- Mobil filtre paneli --------------------------------------------------
// Eskiden mobil menü modülünün sonundan çağrılıyordu; artık bağımsız.
const filterToggle = document.getElementById('mobile-filter-toggle');
const sidebar = document.querySelector('aside.lg\\:col-span-1');

if (filterToggle && sidebar) {
  const filterClose = document.getElementById('mobile-filter-close');
  const filterOverlay = document.getElementById('mobile-filter-overlay');

  const openFilter = () => {
    sidebar.classList.remove('hidden');
    sidebar.classList.add('mobile-filter-visible');
    filterOverlay?.classList.add('mobile-filter-overlay-visible');
    document.body.style.overflow = 'hidden';
    filterToggle.setAttribute('aria-expanded', 'true');
  };

  const closeFilter = () => {
    sidebar.classList.remove('mobile-filter-visible');
    sidebar.classList.add('hidden');
    filterOverlay?.classList.remove('mobile-filter-overlay-visible');
    document.body.style.overflow = '';
    filterToggle.setAttribute('aria-expanded', 'false');
  };

  filterToggle.setAttribute('aria-expanded', 'false');
  filterToggle.addEventListener('click', () =>
    sidebar.classList.contains('mobile-filter-visible') ? closeFilter() : openFilter()
  );
  filterClose?.addEventListener('click', closeFilter);
  filterOverlay?.addEventListener('click', closeFilter);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sidebar.classList.contains('mobile-filter-visible')) closeFilter();
  });
}
