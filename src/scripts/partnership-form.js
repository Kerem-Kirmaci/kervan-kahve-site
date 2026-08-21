// İş ortaklığı başvuru formu — girilen bilgileri WhatsApp mesajına dönüştürür.
//
// Eski sürümde bu kod ortaklik.html içinde inline <script> olarak duruyordu ve
// forma onsubmit="sendToWhatsApp(event)" ile bağlanan global bir fonksiyondu.
// Artık modül olarak yükleniyor, global isim alanını kirletmiyor.

const form = document.getElementById('partnership-form');

if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Tarayıcının kendi doğrulaması (zorunlu alanlar + KVKK onayı) geçilmeden gönderilmesin
    if (!form.reportValidity()) return;

    const value = (id) => document.getElementById(id)?.value.trim() ?? '';

    const lines = [
      '*İş Ortaklığı Başvurusu*',
      '',
      `*Şirket Adı:* ${value('company-name')}`,
      `*Yetkili Kişi:* ${value('contact-person')}`,
      `*E-posta:* ${value('email')}`,
      `*Telefon:* ${value('phone')}`,
      `*İşletme Türü:* ${value('business-type')}`,
      '',
      '*İşletme Hakkında:*',
      value('message'),
    ];

    const url = `https://wa.me/905453207713?text=${encodeURIComponent(lines.join('\n'))}`;
    window.open(url, '_blank', 'noopener');
  });
}
