import { Link2, QrCode, Share2 } from 'lucide-react';

export type CvBusinessSharingLanguage = 'fr' | 'ar' | 'en' | 'it' | 'ru';

const sharingCopy: Record<CvBusinessSharingLanguage, { title: string; text: string; note: string }> = {
  fr: {
    title: 'Partagez votre CV Business facilement',
    text: 'Envoyez simplement le lien de votre fiche par WhatsApp, e-mail ou réseaux sociaux, ou partagez son QR Code. Vos clients pourront ouvrir votre CV Business et utiliser directement les boutons disponibles : appel, WhatsApp, itinéraire, réservation, site web, réseaux sociaux et partage.',
    note: 'Une capture d’écran ou une image n’est pas interactive. Pour profiter de toutes les fonctions, partagez le lien ou le QR Code.',
  },
  ar: {
    title: 'شارك CV Business بسهولة',
    text: 'أرسل رابط بطاقتك عبر واتساب أو البريد الإلكتروني أو شبكات التواصل، أو شارك رمز QR الخاص بها. سيتمكن عملاؤك من فتح CV Business واستخدام الأزرار المتاحة مباشرة: الاتصال، واتساب، الاتجاهات، الحجز، الموقع الإلكتروني، شبكات التواصل والمشاركة.',
    note: 'لقطة الشاشة أو الصورة ليست تفاعلية. للاستفادة من جميع الوظائف، شارك الرابط أو رمز QR.',
  },
  en: {
    title: 'Share your Business CV easily',
    text: 'Send your profile link by WhatsApp, email or social media, or share its QR Code. Your customers can open your Business CV and use the available buttons directly: call, WhatsApp, directions, booking, website, social media and sharing.',
    note: 'A screenshot or image is not interactive. To use every feature, share the link or QR Code.',
  },
  it: {
    title: 'Condividi facilmente il tuo CV Business',
    text: 'Invia il link della scheda tramite WhatsApp, e-mail o social network, oppure condividi il suo QR Code. I clienti potranno aprire il tuo CV Business e utilizzare direttamente i pulsanti disponibili: chiamata, WhatsApp, indicazioni, prenotazione, sito web, social network e condivisione.',
    note: 'Uno screenshot o un’immagine non sono interattivi. Per utilizzare tutte le funzioni, condividi il link o il QR Code.',
  },
  ru: {
    title: 'Легко делитесь своим CV Business',
    text: 'Отправьте ссылку на профиль через WhatsApp, электронную почту или социальные сети либо поделитесь его QR-кодом. Клиенты смогут открыть CV Business и сразу использовать доступные кнопки: звонок, WhatsApp, маршрут, бронирование, сайт, социальные сети и отправка профиля.',
    note: 'Снимок экрана или изображение не интерактивны. Чтобы использовать все функции, поделитесь ссылкой или QR-кодом.',
  },
};

export function CvBusinessSharingInfo({ language = 'fr', className = '' }: { language?: CvBusinessSharingLanguage; className?: string }) {
  const copy = sharingCopy[language] ?? sharingCopy.fr;
  const isRtl = language === 'ar';

  return (
    <aside
      className={`rounded-2xl border border-[#D4AF37]/55 bg-[linear-gradient(145deg,#073D31,#021F1A)] p-4 text-white shadow-[0_12px_28px_rgba(2,31,26,0.18)] sm:p-5 ${className}`}
      dir={isRtl ? 'rtl' : 'ltr'}
      aria-labelledby={`cv-sharing-title-${language}`}
    >
      <div className="flex items-start gap-3">
        <div className="flex shrink-0 gap-1.5 text-[#F4CE55]" aria-hidden="true">
          <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[#D4AF37]/50 bg-black/20"><Link2 className="h-4 w-4" /></span>
          <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[#D4AF37]/50 bg-black/20"><QrCode className="h-4 w-4" /></span>
          <span className="hidden h-8 w-8 items-center justify-center rounded-full border border-[#D4AF37]/50 bg-black/20 sm:flex"><Share2 className="h-4 w-4" /></span>
        </div>
        <div className="min-w-0">
          <h3 id={`cv-sharing-title-${language}`} className="text-base font-bold text-[#F4CE55] sm:text-lg">{copy.title}</h3>
          <p className="mt-1.5 text-sm leading-6 text-emerald-50">{copy.text}</p>
          <p className="mt-2 border-t border-white/15 pt-2 text-xs leading-5 text-emerald-100/85">{copy.note}</p>
        </div>
      </div>
    </aside>
  );
}
