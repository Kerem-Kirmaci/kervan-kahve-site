import forms from '@tailwindcss/forms';
import containerQueries from '@tailwindcss/container-queries';

/**
 * Kervan Kahve tasarım sistemi — tek kaynak.
 *
 * Renkler markanın kendi logosundan türetildi (#502808 kahve, #F8C838 altın).
 * Buradaki her değer erişilebilirlik için ölçüldü; kullanılan metin/zemin
 * çiftlerinin tamamı WCAG AA'yı geçiyor (çoğu AAA).
 *
 * Kural: Tailwind'in amber/orange/yellow/blue/green/gray skalaları bu projede
 * KULLANILMAZ. Renk buradan gelir. Ayrıntı: .claude/skills/kervan-tasarim-sistemi
 */

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,svelte,ts,tsx,vue}'],
  theme: {
    // Tailwind'in varsayılan renk skalaları bilinçli olarak devre dışı:
    // sitede dört paralel renk sistemi oluşmasının sebebi onlardı.
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      inherit: 'inherit',

      /* koyu yüzeyler — hero, ortaklık, footer */
      kavurma: '#2E1D10',
      kabuk: '#6B4526',

      /* tek aksan (altın). Koyu zeminde `altin`, açık zeminde `altin-koyu`. */
      altin: '#E0A924',
      'altin-koyu': '#8A5B12',

      /* açık yüzeyler */
      kum: '#F1EADD',
      kagit: '#FBF8F2',

      /* metin */
      murekkep: '#241509',      // açık zeminde birincil
      is: '#6A5644',            // açık zeminde ikincil
      krem: '#F5EFE3',          // koyu zeminde birincil
      'krem-ikincil': '#CDBBA2', // koyu zeminde ikincil

      /* kenarlık */
      cizgi: '#DED2BE',         // açık zeminde
      'cizgi-koyu': '#46301D',  // koyu zeminde

      /* form durumları — aksandan ayrı tutulur */
      hata: '#9C3D2A',
      onay: '#3F6B41',
    },

    // Altı adımlı ölçek. Eskiden 10 Tailwind puntosu + elle yazılmış
    // 12 font-size vardı; hiçbiri birbiriyle ilişkili değildi.
    fontSize: {
      mini:  ['0.8125rem', { lineHeight: '1.4' }],   // 13px — rozet, etiket
      kucuk: ['0.9375rem', { lineHeight: '1.55' }],  // 15px — ikincil metin
      govde: ['1.125rem',  { lineHeight: '1.65' }],  // 18px — gövde
      alt:   ['1.5rem',    { lineHeight: '1.3', letterSpacing: '-0.01em' }],
      orta:  ['clamp(1.75rem, 3.5vw, 2.25rem)', { lineHeight: '1.15', letterSpacing: '-0.02em' }],
      buyuk: ['clamp(2.25rem, 6vw, 3.375rem)',  { lineHeight: '1.05', letterSpacing: '-0.025em' }],
    },

    borderRadius: {
      none: '0',
      DEFAULT: '6px',
      kart: '6px',
      tam: '9999px',
    },

    boxShadow: {
      none: 'none',
      kart: '0 1px 2px rgba(36,21,9,.06), 0 8px 20px -12px rgba(36,21,9,.22)',
      yuzen: '0 4px 8px rgba(36,21,9,.10), 0 24px 48px -16px rgba(36,21,9,.35)',
    },

    extend: {
      fontFamily: {
        sans: ['Archivo', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      maxWidth: {
        okuma: '68ch', // gövde metni için satır uzunluğu tavanı
      },
    },
  },
  plugins: [forms, containerQueries],
};
