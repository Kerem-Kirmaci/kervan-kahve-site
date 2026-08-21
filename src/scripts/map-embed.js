// İletişim sayfasındaki harita — tıklanınca yükleniyor.
//
// Gömülü Google Maps çerçevesi tek başına ~1,7 MB JavaScript ve 54 harici
// istek getiriyordu; sayfayı açan herkese iniyordu. iframe'de loading="lazy"
// vardı ama masaüstü düzeninde harita görüş alanında kaldığı için tarayıcı
// yüklemeyi ertelemiyordu. Artık iframe bir <template> içinde duruyor ve
// yalnızca kullanıcı isteyince DOM'a giriyor.

const kutu = document.getElementById('map-embed');
const dugme = document.getElementById('map-load');
const sablon = document.getElementById('map-template');

if (kutu && dugme && sablon) {
  dugme.addEventListener('click', () => {
    kutu.replaceWith(sablon.content.cloneNode(true));
  });
}
