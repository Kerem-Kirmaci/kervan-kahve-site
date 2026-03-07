// Kervan Kahve - Ana JavaScript Dosyası
// .cursorrules dosyasına uygun olarak geliştirilmiştir

// Global değişkenler
let selectedCategories = [];
let searchQuery = '';

// Infinite scroll için değişkenler
const PRODUCTS_PER_PAGE = 24;
let currentlyDisplayedProducts = 0;
let allFilteredProducts = [];
let isLoadingMore = false;

// Slider state management
let sliderStates = {
    coffee: { currentIndex: 0, itemsPerView: 3 },
    syrup: { currentIndex: 0, itemsPerView: 3 },
    sweet: { currentIndex: 0, itemsPerView: 3 },
    tea: { currentIndex: 0, itemsPerView: 3 },
    accessory: { currentIndex: 0, itemsPerView: 3 }
};

// DOM yüklendiğinde çalışacak fonksiyonlar
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Uygulamayı başlat
function initializeApp() {
    loadProducts([], '');
    setupEventListeners(); 
    setupAnimations();
    setupSliders();
    initializeMobileMenu();
    initializeLightbox();
    setupInfiniteScroll();
}

// Ana ürün yükleme fonksiyonu
function loadProducts(categories = [], search = '') {
    const container = document.getElementById('product-grid');
    
    // Anasayfa için category sliders'ı yükle
    loadCategorySliders();
    
    // Mağaza sayfası için tüm ürünler (Infinite Scroll destekli)
    if (container) {
        let filteredProducts = filterProducts(categories, search);

        // Mağaza sıralaması: Şurup → Tatlı → Kahveler (Espresso) → Bitki Çayı → Aksesuar
        const categoryOrder = ['surup', 'pure-tatlandirici', 'tatli', 'espresso', 'cay', 'aksesuar'];
        const getCategoryIndex = (categoryKey) => {
            const index = categoryOrder.indexOf(categoryKey);
            return index === -1 ? Number.MAX_SAFE_INTEGER : index;
        };

        filteredProducts.sort((a, b) => {
            const aIndex = getCategoryIndex(a.category);
            const bIndex = getCategoryIndex(b.category);
            if (aIndex !== bIndex) return aIndex - bIndex;
            // İkincil: featured olanlar önce
            const aFeatured = a.featured ? 1 : 0;
            const bFeatured = b.featured ? 1 : 0;
            if (aFeatured !== bFeatured) return bFeatured - aFeatured;
            // Son: ada göre TR locale sıralama
            return a.name.localeCompare(b.name, 'tr', { sensitivity: 'base' });
        });
        
        // Infinite scroll için: tüm filtrelenmiş ürünleri sakla
        allFilteredProducts = filteredProducts;
        currentlyDisplayedProducts = 0;
        
        // Container'ı temizle
        container.innerHTML = '';
        
        // İlk 24 ürünü yükle
        loadMoreProducts();
        
        // Ürün sayısını güncelle
        updateProductCount(filteredProducts.length);
        
        // Infinite scroll durumunu güncelle
        updateInfiniteScrollState();
    }
    
    // Animasyonları başlat
    setTimeout(() => {
        setupProductAnimations();
    }, 100);
}

// Daha fazla ürün yükle (Infinite Scroll için)
function loadMoreProducts() {
    const container = document.getElementById('product-grid');
    if (!container || isLoadingMore) return;
    
    isLoadingMore = true;
    
    // Yüklenecek ürünleri belirle
    const startIndex = currentlyDisplayedProducts;
    const endIndex = Math.min(startIndex + PRODUCTS_PER_PAGE, allFilteredProducts.length);
    const productsToLoad = allFilteredProducts.slice(startIndex, endIndex);
    
    // Eğer yüklenecek ürün yoksa
    if (productsToLoad.length === 0) {
        isLoadingMore = false;
        return;
    }
    
    // Ürünleri ekle
    const productsHtml = productsToLoad.map(product => 
        createProductCard(product, 'shop')).join('');
    container.insertAdjacentHTML('beforeend', productsHtml);
    
    // Sayacı güncelle
    currentlyDisplayedProducts = endIndex;
    
    // Loading durumunu kapat
    isLoadingMore = false;
    
    // Infinite scroll durumunu güncelle
    updateInfiniteScrollState();
    
    // Yeni eklenen kartlar için animasyon
    setTimeout(() => {
        setupProductAnimations();
    }, 100);
}

// Infinite scroll durumunu güncelle
function updateInfiniteScrollState() {
    const loader = document.getElementById('infinite-scroll-loader');
    const endMessage = document.getElementById('end-of-products');
    
    if (!loader || !endMessage) return;
    
    // Tüm ürünler yüklendi mi?
    const allLoaded = currentlyDisplayedProducts >= allFilteredProducts.length;
    
    if (allLoaded) {
        loader.classList.add('hidden');
        // Sadece 24'ten fazla ürün varsa ve hepsi yüklendiyse mesajı göster
        if (allFilteredProducts.length > PRODUCTS_PER_PAGE) {
            endMessage.classList.remove('hidden');
        } else {
            endMessage.classList.add('hidden');
        }
    } else {
        loader.classList.add('hidden');
        endMessage.classList.add('hidden');
    }
}

// Infinite scroll event listener kurulumu
function setupInfiniteScroll() {
    // Sadece shop sayfasında çalış
    const container = document.getElementById('product-grid');
    if (!container) return;
    
    // Scroll event'i throttle ile dinle
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        if (scrollTimeout) return;
        
        scrollTimeout = setTimeout(() => {
            scrollTimeout = null;
            handleInfiniteScroll();
        }, 100);
    });
}

// Scroll event handler
function handleInfiniteScroll() {
    // Eğer zaten yükleme yapılıyorsa veya tüm ürünler yüklendiyse çık
    if (isLoadingMore || currentlyDisplayedProducts >= allFilteredProducts.length) {
        return;
    }
    
    const loader = document.getElementById('infinite-scroll-loader');
    
    // Sayfanın ne kadarının scroll edildiğini hesapla
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    
    // Sayfanın %80'ine ulaşıldığında yeni ürünleri yükle
    const scrollPercentage = (scrollTop + windowHeight) / documentHeight;
    
    if (scrollPercentage > 0.8) {
        // Loading göstergesini göster
        if (loader) {
            loader.classList.remove('hidden');
        }
        
        // Kısa bir gecikme ile yükle (görsel efekt için)
        setTimeout(() => {
            loadMoreProducts();
        }, 300);
    }
}

// Ürün filtreleme fonksiyonu
function filterProducts(categories, search) {
    return products.filter(product => {
        // Kategori filtresi - eğer hiç kategori seçilmemişse tüm ürünler gösterilir
        const categoryMatch = categories.length === 0 || categories.includes(product.category);
        
        // Arama filtresi
        const searchMatch = search === '' || 
                           product.name.toLowerCase().includes(search.toLowerCase()) ||
                           product.description.toLowerCase().includes(search.toLowerCase()) ||
                           (product.tastingNotes && product.tastingNotes.some(note => 
                               note.toLowerCase().includes(search.toLowerCase()))) ||
                           (product.healthBenefits && product.healthBenefits.some(benefit => 
                               benefit.toLowerCase().includes(search.toLowerCase())));
        
        return categoryMatch && searchMatch;
    });
}

// Modern ürün kartı oluşturma fonksiyonu
function createProductCard(product, type = 'shop') {
    const imageAlt = `${product.name} - ${product.description}`;
    
    // Belirlenen kategoriler için marka ve ürün adı ayrımı
    const titleHtml = (brandCategories.includes(product.category) && product.brand && product.productName)
        ? `<span class="card-brand">${product.brand}</span>
           <h3 class="card-title">${product.productName}</h3>`
        : `<h3 class="card-title">${product.name}</h3>`;
    
    if (type === 'featured') {
        return `
            <div class="modern-product-card fade-in" data-product-id="${product.id}">
                <div class="card-image zoom-icon-wrapper">
                    <img src="${product.image}" alt="${imageAlt}" class="loading-placeholder zoomable-image" loading="lazy" onclick="openLightbox(${product.id})">
                    <span class="zoom-icon">
                        <span class="material-icons">zoom_in</span>
                    </span>
                </div>
                <div class="card-content">
                    ${titleHtml}
                    <p class="card-description">${product.description}</p>
                    ${product.tastingNotes && product.tastingNotes.length > 0 ? `
                        <div class="card-tags">
                            ${product.tastingNotes.slice(0, 3).map(note => 
                                `<span class="card-tag">${note}</span>`
                            ).join('')}
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    } else {
        return `
            <div class="modern-product-card" data-product-id="${product.id}">
                <div class="card-image zoom-icon-wrapper">
                    <img src="${product.image}" alt="${imageAlt}" class="loading-placeholder zoomable-image" loading="lazy" onclick="openLightbox(${product.id})">
                    <span class="zoom-icon">
                        <span class="material-icons">zoom_in</span>
                    </span>
                </div>
                <div class="card-content">
                    ${titleHtml}
                    <p class="card-description">${product.description}</p>
                    ${product.tastingNotes && product.tastingNotes.length > 0 ? `
                        <div class="card-tags">
                            ${product.tastingNotes.slice(0, 3).map(note => 
                                `<span class="card-tag">${note}</span>`
                            ).join('')}
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }
}

// Event listener'ları ayarla
function setupEventListeners() {
    // Kategori checkbox filtreleme
    const categoryCheckboxes = document.querySelectorAll('.category-checkbox');
    categoryCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const category = this.dataset.category;
            
            if (this.checked) {
                if (!selectedCategories.includes(category)) {
                    selectedCategories.push(category);
                }
            } else {
                selectedCategories = selectedCategories.filter(c => c !== category);
            }
            
            loadProducts(selectedCategories, searchQuery);
        });
    });
    
    // Filtreleri temizle butonu
    const clearFiltersButton = document.getElementById('clear-filters');
    if (clearFiltersButton) {
        clearFiltersButton.addEventListener('click', function() {
            // Tüm checkbox'ları temizle
            categoryCheckboxes.forEach(checkbox => {
                checkbox.checked = false;
            });
            
            // Seçili kategorileri temizle
            selectedCategories = [];
            
            // Ürünleri yeniden yükle
            loadProducts(selectedCategories, searchQuery);
        });
    }
    
    // Arama fonksiyonu
    const searchInput = document.getElementById('product-search');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            searchQuery = this.value;
            loadProducts(selectedCategories, searchQuery);
        });
    }
    
    // Mobil menü toggle
    const mobileMenuButton = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
    }
}

// Ürün sayısını güncelle
function updateProductCount(count) {
    const countElement = document.getElementById('product-count');
    if (countElement) {
        countElement.textContent = `${count} ürün bulundu`;
    }
}

// Animasyonları ayarla
function setupAnimations() {
    // Fade-in animasyonları için Intersection Observer
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Gözlemlenecek elementleri seç
    const animatedElements = document.querySelectorAll('.fade-in-on-scroll');
    animatedElements.forEach(el => observer.observe(el));
}

// Ürün animasyonlarını ayarla
function setupProductAnimations() {
    const productCards = document.querySelectorAll('[data-product-id]');
    
    productCards.forEach((card, index) => {
        // Gecikmeli animasyon
        card.style.animationDelay = `${index * 0.1}s`;
        card.classList.add('fade-in');
        
        // Hover efektleri artık CSS'te tanımlandığı için JavaScript'e gerek yok
    });
}

// Resim yükleme durumunu izle
function setupImageLoading() {
    const images = document.querySelectorAll('.loading-placeholder');
    
    images.forEach(img => {
        img.addEventListener('load', function() {
            this.classList.remove('loading-placeholder');
            this.classList.add('loaded');
        });
        
        img.addEventListener('error', function() {
            this.src = 'images/placeholder-product.jpg'; // Fallback image
            this.classList.remove('loading-placeholder');
        });
    });
}

// Kategori isimlerini Türkçe'ye çevir
function getCategoryDisplayName(categoryKey) {
    const categoryNames = {
        'espresso': 'Kahveler',
        'surup': 'Şuruplar',
        'pure-tatlandirici': 'Püre ve Tatlandırıcılar',
        'cay': 'Bitki Çayları',
        'tatli': 'Tatlılar',
        'aksesuar': 'Aksesuarlar'
    };
    
    return categoryNames[categoryKey] || categoryKey;
}

// URL parametrelerini oku (ürün detayları için)
function getUrlParameters() {
    const urlParams = new URLSearchParams(window.location.search);
    return {
        product: urlParams.get('product'),
        category: urlParams.get('category'),
        search: urlParams.get('search')
    };
}

// Sayfa yüklendiğinde URL parametrelerini kontrol et
window.addEventListener('load', function() {
    const params = getUrlParameters();
    
    if (params.category) {
        const categoryCheckbox = document.querySelector(`.category-checkbox[data-category="${params.category}"]`);
        if (categoryCheckbox) {
            categoryCheckbox.checked = true;
            selectedCategories.push(params.category);
            loadProducts(selectedCategories, searchQuery);
        }
    }
    
    if (params.search) {
        const searchInput = document.getElementById('product-search');
        if (searchInput) {
            searchInput.value = params.search;
            searchQuery = params.search;
            loadProducts(selectedCategories, searchQuery);
        }
    }
});

// Debug fonksiyonu (geliştirme için)
function debugProducts() {
    console.log('Toplam ürün sayısı:', products.length);
    console.log('Kategoriler:', Object.keys(categories));
    console.log('Mevcut filtreler:', {
        selectedCategories: selectedCategories,
        search: searchQuery
    });
}

// Modern category sliders yükleme fonksiyonu
function loadCategorySliders() {
    const categoryMappings = {
        syrups: ['surup'],
        pure: ['pure-tatlandirici'],
        sweets: ['tatli'],
        coffees: ['espresso'],
        teas: ['cay'],
        accessories: ['aksesuar']
    };
    
    // Özel sıralama için öncelikli ürün ID'leri (başta gösterilecek)
    const priorityOrder = {
        syrups: [33, 55, 57],      // DaVinci Beyaz Çikolata, FO Vanilya, Gusse Çilek
        pure: [31, 7],             // Bobaco Bubble Tea, Montare D'oro Sprey Krema
        coffees: [48, 49, 50],     // Espresso, Filtre Kahve, Türk Kahvesi
        sweets: [10, 11, 28, 30, 29, 64, 69, 80, 86, 104],  // 5 normal pasta + 5 dilim tatlı
        teas: [],
        accessories: []
    };
    
    // Özel sıralama fonksiyonu
    function sortByPriority(products, priorityIds) {
        if (!priorityIds || priorityIds.length === 0) return products;
        
        const priorityProducts = [];
        const otherProducts = [];
        
        // Öncelikli ürünleri sırayla ekle
        priorityIds.forEach(id => {
            const product = products.find(p => p.id === id);
            if (product) priorityProducts.push(product);
        });
        
        // Diğer ürünleri ekle
        products.forEach(product => {
            if (!priorityIds.includes(product.id)) {
                otherProducts.push(product);
            }
        });
        
        return [...priorityProducts, ...otherProducts];
    }

    // Ana sayfa slider'larında gösterilecek maksimum ürün sayısı
    const sliderLimits = {
        syrups: 0,       // 0 = limit yok
        pure: 0,
        coffees: 0,
        sweets: 10,      // Sadece 10 tatlı göster (5 normal + 5 dilim)
        teas: 0,
        accessories: 0
    };

    Object.keys(categoryMappings).forEach(containerKey => {
        // Desktop container
        const container = document.getElementById(`${containerKey}-container`);
        if (container) {
            let categoryProducts = products.filter(product => 
                categoryMappings[containerKey].includes(product.category)
            );
            
            // Özel sıralama uygula
            categoryProducts = sortByPriority(categoryProducts, priorityOrder[containerKey]);
            
            // Limit varsa uygula
            if (sliderLimits[containerKey] > 0) {
                categoryProducts = categoryProducts.slice(0, sliderLimits[containerKey]);
            }
            
            container.innerHTML = categoryProducts.map(product => 
                createDesktopSliderCard(product)).join('');
        }
        
        // Mobile container (tüm kategoriler için)
        const mobileContainer = document.getElementById(`${containerKey}-container-mobile`);
        if (mobileContainer) {
            let categoryProducts = products.filter(product => 
                categoryMappings[containerKey].includes(product.category)
            );
            
            // Özel sıralama uygula
            categoryProducts = sortByPriority(categoryProducts, priorityOrder[containerKey]);
            
            // Limit varsa uygula
            if (sliderLimits[containerKey] > 0) {
                categoryProducts = categoryProducts.slice(0, sliderLimits[containerKey]);
            }
            
            mobileContainer.innerHTML = categoryProducts.map(product => 
                createMobileSliderCard(product)).join('');
        }
    });
    
    // Modern slider sistemini kur
    setupModernSliders();
}

// Marka/ürün adı ayrımı yapılacak kategoriler
const brandCategories = ['surup', 'espresso', 'cay', 'tatli', 'pure-tatlandirici', 'aksesuar'];

// Mobil slider için kompakt ürün kartı oluşturma
function createMobileSliderCard(product) {
    const imageAlt = `${product.name} - ${product.description}`;
    
    // Belirlenen kategoriler için marka ve ürün adı ayrımı
    const nameHtml = (brandCategories.includes(product.category) && product.brand && product.productName)
        ? `<p class="mt-2 text-sm text-amber-700 font-semibold tracking-wide uppercase">${product.brand}</p>
           <p class="font-medium text-gray-900 leading-tight">${product.productName}</p>`
        : `<p class="mt-2 font-medium text-gray-900">${product.name}</p>`;
    
    // Tüm ürünler için zoom özelliği aktif
    return `
        <div class="flex-shrink-0 w-40" data-product-id="${product.id}">
            <div class="zoom-icon-wrapper">
                <img alt="${imageAlt}" 
                     class="w-full h-40 object-cover rounded-lg shadow-md loading-placeholder zoomable-image" 
                     src="${product.image}" 
                     loading="lazy"
                     onclick="openLightbox(${product.id})">
                <span class="zoom-icon">
                    <span class="material-icons">zoom_in</span>
                </span>
            </div>
            ${nameHtml}
        </div>
    `;
}

// Desktop slider için basit ürün kartı oluşturma (mobil gibi)
function createDesktopSliderCard(product) {
    const imageAlt = `${product.name} - ${product.description}`;
    
    // Belirlenen kategoriler için marka ve ürün adı ayrımı
    const nameHtml = (brandCategories.includes(product.category) && product.brand && product.productName)
        ? `<p class="mt-2 text-sm text-amber-700 font-semibold tracking-wide uppercase">${product.brand}</p>
           <p class="font-medium text-gray-900 text-sm leading-tight">${product.productName}</p>`
        : `<p class="mt-2 font-medium text-gray-900 text-sm">${product.name}</p>`;
    
    // Tüm ürünler için zoom özelliği aktif
    return `
        <div class="flex-shrink-0 w-40" data-product-id="${product.id}">
            <div class="zoom-icon-wrapper">
                <img alt="${imageAlt}" 
                     class="w-full h-40 object-cover rounded-lg shadow-md loading-placeholder zoomable-image" 
                     src="${product.image}" 
                     loading="lazy"
                     onclick="openLightbox(${product.id})">
                <span class="zoom-icon">
                    <span class="material-icons">zoom_in</span>
                </span>
            </div>
            ${nameHtml}
        </div>
    `;
}

// Modern slider sistemini kurma
function setupModernSliders() {
    // Modern slider butonları için event listener'lar
    const sliderConfigs = [
        { container: 'syrups-container', leftBtn: 'scroll-left-syrups', rightBtn: 'scroll-right-syrups' },
        { container: 'pure-container', leftBtn: 'scroll-left-pure', rightBtn: 'scroll-right-pure' },
        { container: 'sweets-container', leftBtn: 'scroll-left-sweets', rightBtn: 'scroll-right-sweets' },
        { container: 'coffees-container', leftBtn: 'scroll-left-coffees', rightBtn: 'scroll-right-coffees' },
        { container: 'teas-container', leftBtn: 'scroll-left-teas', rightBtn: 'scroll-right-teas' },
        { container: 'accessories-container', leftBtn: 'scroll-left-accessories', rightBtn: 'scroll-right-accessories' }
    ];

    sliderConfigs.forEach(config => {
        const container = document.getElementById(config.container);
        const leftButton = document.getElementById(config.leftBtn);
        const rightButton = document.getElementById(config.rightBtn);
        
        if (container && leftButton && rightButton) {
            // 160px (w-40 kart genişliği) + 16px (space-x-4 gap) = 176px per card
            // 3 kart kaydır = 528px
            const scrollAmount = 528;
            
            leftButton.addEventListener('click', () => {
                container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            });
            
            rightButton.addEventListener('click', () => {
                container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            });
        }
    });
}

// Eski slider sistemini kurma (geriye uyumluluk için)
function setupSliders() {
    // Modern slider sistemini çağır
    setupModernSliders();
    
    // Responsive items per view ayarla
    updateSliderItemsPerView();
    
    // Window resize olayı için
    window.addEventListener('resize', updateSliderItemsPerView);
}

// Slider navigasyonu
function navigateSlider(category, direction) {
    const slider = document.getElementById(`${category}-slider`);
    if (!slider) return;
    
    const state = sliderStates[category];
    const totalItems = slider.children.length;
    
    if (direction === 'next') {
        if (state.currentIndex < totalItems - state.itemsPerView) {
            state.currentIndex++;
        } else {
            state.currentIndex = 0; // Başa dön
        }
    } else {
        if (state.currentIndex > 0) {
            state.currentIndex--;
        } else {
            state.currentIndex = Math.max(0, totalItems - state.itemsPerView); // Sona git
        }
    }
    
    updateSliderPosition(category);
}

// Slider pozisyonunu güncelle
function updateSliderPosition(category) {
    const slider = document.getElementById(`${category}-slider`);
    if (!slider) return;
    
    const state = sliderStates[category];
    const totalItems = slider.children.length;
    const itemWidth = slider.children[0] ? slider.children[0].offsetWidth + 16 : 384; // 16px = mx-2 * 2
    const translateX = -(state.currentIndex * itemWidth);
    
    slider.style.transform = `translateX(${translateX}px)`;
    
    // Butonları göster/gizle
    const prevBtn = document.querySelector(`.slider-prev[data-category="${category}"]`);
    const nextBtn = document.querySelector(`.slider-next[data-category="${category}"]`);
    
    if (prevBtn && nextBtn) {
        if (totalItems <= state.itemsPerView) {
            // Eğer ürün sayısı görüntülenen sayıdan azsa butonları gizle
            prevBtn.style.display = 'none';
            nextBtn.style.display = 'none';
        } else {
            prevBtn.style.display = 'block';
            nextBtn.style.display = 'block';
        }
    }
}

// Responsive items per view güncelleme
function updateSliderItemsPerView() {
    const screenWidth = window.innerWidth;
    let itemsPerView;
    
    if (screenWidth >= 1024) {
        itemsPerView = 3;
    } else if (screenWidth >= 768) {
        itemsPerView = 2;
    } else {
        itemsPerView = 1;
    }
    
    // Tüm slider state'leri güncelle
    Object.keys(sliderStates).forEach(category => {
        sliderStates[category].itemsPerView = itemsPerView;
        sliderStates[category].currentIndex = 0; // Reset position
        updateSliderPosition(category);
    });
}

// ========== Mobile Menu Functions ==========

// Mobile menu işlevselliği
function initializeMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
    const mobileMenuClose = document.getElementById('mobile-menu-close');
    const hamburgerIcon = document.getElementById('hamburger-icon');
    const closeIcon = document.getElementById('close-icon');

    // Mobile menu açma/kapama
    function toggleMobileMenu() {
        const isActive = mobileMenu.classList.contains('active');
        
        if (isActive) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    }

    function openMobileMenu() {
        mobileMenu.classList.add('active');
        mobileMenuOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Transform değerini doğrudan değiştir
        mobileMenu.style.transform = 'translateX(0)';
        
        // Icon değiştir
        if (hamburgerIcon && closeIcon) {
            hamburgerIcon.classList.add('hidden');
            closeIcon.classList.remove('hidden');
        }
    }

    function closeMobileMenu() {
        mobileMenu.classList.remove('active');
        mobileMenuOverlay.classList.remove('active');
        document.body.style.overflow = '';
        
        // Transform değerini doğrudan değiştir
        mobileMenu.style.transform = 'translateX(100%)';
        
        // Icon değiştir
        if (hamburgerIcon && closeIcon) {
            hamburgerIcon.classList.remove('hidden');
            closeIcon.classList.add('hidden');
        }
    }

    // Event listeners
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    }

    if (mobileMenuClose) {
        mobileMenuClose.addEventListener('click', closeMobileMenu);
    }

    if (mobileMenuOverlay) {
        mobileMenuOverlay.addEventListener('click', closeMobileMenu);
    }

    // Menu linklerine tıklandığında menüyü kapat
    const mobileMenuLinks = mobileMenu?.querySelectorAll('a');
    mobileMenuLinks?.forEach(link => {
        link.addEventListener('click', function() {
            closeMobileMenu();
        });
    });

    // ESC tuşu ile menüyü kapat
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && mobileMenu?.classList.contains('active')) {
            closeMobileMenu();
        }
    });
    
    // Shop sayfası mobil filtre toggle
    initializeMobileFilter();
}

// Mobil filtre işlevselliği (Shop sayfası için)
function initializeMobileFilter() {
    const mobileFilterBtn = document.getElementById('mobile-filter-toggle');
    const mobileFilterClose = document.getElementById('mobile-filter-close');
    const mobileFilterOverlay = document.getElementById('mobile-filter-overlay');
    const sidebar = document.querySelector('aside.lg\\:col-span-1');
    
    if (mobileFilterBtn && sidebar) {
        // Sidebar'a mobil görünüm için dinamik class ekle
        sidebar.classList.add('mobile-filter-sidebar');
        
        // Filtre ekranını açma
        function openMobileFilter() {
            sidebar.classList.remove('hidden');
            sidebar.classList.add('mobile-filter-visible');
            if (mobileFilterOverlay) {
                mobileFilterOverlay.classList.add('mobile-filter-overlay-visible');
            }
            document.body.style.overflow = 'hidden';
        }
        
        // Filtre ekranını kapatma
        function closeMobileFilter() {
            sidebar.classList.remove('mobile-filter-visible');
            sidebar.classList.add('hidden', 'lg:block');
            if (mobileFilterOverlay) {
                mobileFilterOverlay.classList.remove('mobile-filter-overlay-visible');
            }
            document.body.style.overflow = '';
        }
        
        // Filtrele butonuna tıklama
        mobileFilterBtn.addEventListener('click', function() {
            const isVisible = sidebar.classList.contains('mobile-filter-visible');
            if (isVisible) {
                closeMobileFilter();
            } else {
                openMobileFilter();
            }
        });
        
        // Kapatma butonuna tıklama
        if (mobileFilterClose) {
            mobileFilterClose.addEventListener('click', closeMobileFilter);
        }
        
        // Overlay'e tıklama
        if (mobileFilterOverlay) {
            mobileFilterOverlay.addEventListener('click', closeMobileFilter);
        }
        
        // ESC tuşu ile kapatma
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && sidebar.classList.contains('mobile-filter-visible')) {
                closeMobileFilter();
            }
        });
    }
}

// ========== Lightbox / Image Zoom Functions ==========

// Lightbox modal işlevselliği
function initializeLightbox() {
    const lightbox = document.getElementById('image-lightbox');
    const closeBtn = document.getElementById('lightbox-close');
    
    if (!lightbox) return;
    
    // Kapatma butonu
    if (closeBtn) {
        closeBtn.addEventListener('click', closeLightbox);
    }
    
    // Lightbox dışına tıklama ile kapatma
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    // ESC tuşu ile kapatma
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });
}

// Lightbox'ı açma
function openLightbox(productId) {
    const lightbox = document.getElementById('image-lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxName = document.getElementById('lightbox-name');
    const lightboxBrand = document.getElementById('lightbox-brand');
    
    if (!lightbox || !lightboxImage) return;
    
    // Ürünü bul
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    // Bilgileri doldur
    lightboxImage.src = product.image;
    lightboxImage.alt = product.name;
    
    if (lightboxName) {
        lightboxName.textContent = product.productName || product.name;
    }
    
    if (lightboxBrand && product.brand) {
        lightboxBrand.textContent = product.brand;
    } else if (lightboxBrand) {
        lightboxBrand.textContent = '';
    }
    
    // Modal'ı aç
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Lightbox'ı kapatma
function closeLightbox() {
    const lightbox = document.getElementById('image-lightbox');
    if (!lightbox) return;
    
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
}
 