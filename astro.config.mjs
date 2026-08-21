import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://kervankahve.com',

  // Mevcut URL'ler korunsun diye dizin yerine dosya çıktısı:
  // /shop.html olduğu gibi kalır, arama motorlarındaki adresler kırılmaz.
  build: {
    format: 'file',
  },

  integrations: [
    sitemap({
      // Menü yer tutucusu geçici bir sayfa, dizine girmesin
      filter: (page) => !page.includes('/menu'),

      // Sitemap varsayılan olarak uzantısız URL üretiyor (/shop). Sayfalardaki
      // canonical etiketleri ise /shop.html diyor. İkisi çelişmesin diye
      // sitemap'i de .html biçimine çeviriyoruz.
      serialize(item) {
        const url = new URL(item.url);
        if (url.pathname === '/' || url.pathname === '') {
          item.url = `${url.origin}/`;
        } else if (!url.pathname.endsWith('.html')) {
          url.pathname += '.html';
          item.url = url.href;
        }
        return item;
      },
    }),
  ],
});
