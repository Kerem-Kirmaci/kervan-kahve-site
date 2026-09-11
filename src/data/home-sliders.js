import { products } from './products.js';

// Ana sayfadaki kategori slider'ları.
//
// Eski kodda öne çıkarılacak ürünler app.js içinde sabit ID listeleriyle
// tutuluyordu ([33, 55, 57] gibi). Bir ürünün ID'si değişirse ya da ürün
// silinirse sessizce yanlış sıralama oluşuyordu. Artık slug kullanılıyor ve
// eşleşmeyen bir slug build'i durduruyor.

const sliderConfig = {
  syrups: {
    categories: ['surup'],
    oneCikanlar: [
      'davinci-gourmet-beyaz-cikolata-surubu',
      'fo-vanilya-surubu',
      'gusse-cilek-surubu',
    ],
  },
  pure: {
    categories: ['pure-tatlandirici'],
    oneCikanlar: ['bobaco-bubble-tea', 'montare-d-oro-sprey-krema'],
  },
  sweets: {
    categories: ['tatli'],
    oneCikanlar: [
      'doro-cake-frambuaz-joleli-cheesecake',
      'doro-cake-kakaolu-cikolatali-pasta',
      'doro-cake-frambuazli-pasta',
      'doro-cake-frambuazli-cikolata-bar',
      'doro-cake-orman-meyveli-cheesecake',
      'doro-cake-cikolatali-kurabiye',
      'doro-cake-tiramisu',
      'doro-cake-san-sebastian-cheesecake',
      'doro-cake-findikli-cikolata-topu',
      'doro-cake-mozaik-pasta',
    ],
    limit: 10,
  },
  coffees: {
    categories: ['espresso'],
    oneCikanlar: [
      'kervan-kahve-espresso',
      'kervan-kahve-filtre-kahve',
      'kervan-kahve-turk-kahvesi',
    ],
  },
  teas: { categories: ['cay'], oneCikanlar: [] },
  accessories: { categories: ['aksesuar'], oneCikanlar: [] },
};

function buildSlider(key, { categories, oneCikanlar = [], limit = 0 }) {
  const inCategory = products.filter((p) => categories.includes(p.category));

  const featured = oneCikanlar.map((slug) => {
    const product = inCategory.find((p) => p.slug === slug);
    if (!product) {
      throw new Error(
        `Ana sayfa slider'ı "${key}" için öne çıkan ürün bulunamadı: "${slug}". ` +
          `src/data/home-sliders.js içindeki slug'ı güncelleyin.`
      );
    }
    return product;
  });

  const rest = inCategory.filter((p) => !oneCikanlar.includes(p.slug));
  const ordered = [...featured, ...rest];

  return limit > 0 ? ordered.slice(0, limit) : ordered;
}

export const homeSliders = Object.fromEntries(
  Object.entries(sliderConfig).map(([key, config]) => [key, buildSlider(key, config)])
);
