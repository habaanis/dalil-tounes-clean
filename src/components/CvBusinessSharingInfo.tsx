import { Link2, QrCode, Share2 } from 'lucide-react';
import { CvBusinessQrVisual } from './CvBusinessProductVisuals';

export type CvBusinessSharingLanguage = 'fr' | 'ar' | 'en' | 'it' | 'ru';

const sharingCopy: Record<CvBusinessSharingLanguage, { title: string; text: string; note: string }> = {
  fr: {
    title: 'Partagez votre CV Business facilement',
    text: 'Envoyez simplement le lien de votre fiche par WhatsApp, e-mail ou réseaux sociaux, ou utilisez son QR Code. Placé sur une carte de visite, un comptoir, une vitrine ou simplement présenté depuis votre téléphone, le QR permet au client d’ouvrir directement votre CV Business en un scan, sans devoir rechercher votre entreprise ni saisir une adresse. Il retrouve alors immédiatement les boutons disponibles : appel, WhatsApp, itinéraire, réservation, site web, réseaux sociaux et partage.',
    note: 'Le QR transforme votre support physique ou votre téléphone en accès direct vers votre vitrine professionnelle. Une capture d’écran ou une image seule n’est pas interactive : pour profiter de toutes les fonctions, partagez le lien ou le QR Code.',
  },
  ar: {
    title: 'شارك CV Business بسهولة',
    text: 'أرسل رابط بطاقتك عبر واتساب أو البريد الإلكتروني أو شبكات التواصل، أو استخدم رمز QR الخاص بها. عند وضعه على بطاقة عمل أو واجهة أو مكتب، أو عرضه مباشرة من هاتفك، يمكن للعميل فتح CV Business بمسح واحد دون البحث عن شركتك أو كتابة أي عنوان. ثم يجد فوراً أزرار الاتصال وواتساب والاتجاهات والحجز والموقع الإلكتروني وشبكات التواصل والمشاركة.',
    note: 'يحوّل رمز QR أي وسيلة مطبوعة أو هاتفك إلى وصول مباشر لواجهتك المهنية. الصورة أو لقطة الشاشة وحدها ليست تفاعلية: للاستفادة من جميع الوظائف، شارك الرابط أو رمز QR.',
  },
  en: {
    title: 'Share your Business CV easily',
    text: 'Send your profile link by WhatsApp, email or social media, or use its QR Code. Placed on a business card, counter or storefront, or simply shown from your phone, the QR lets a customer open your Business CV in one scan without searching for your company or typing an address. They immediately reach the available actions: call, WhatsApp, directions, booking, website, social media and sharing.',
    note: 'The QR turns a physical support or your phone into direct access to your professional showcase. A screenshot or image alone is not interactive: share the link or QR Code to use every feature.',
  },
  it: {
    title: 'Condividi facilmente il tuo CV Business',
    text: 'Invia il link della scheda tramite WhatsApp, e-mail o social network, oppure usa il suo QR Code. Inserito su un biglietto da visita, un bancone o una vetrina, oppure mostrato direttamente dal telefono, il QR permette al cliente di aprire il CV Business con una sola scansione, senza cercare l’azienda o digitare un indirizzo. Trova subito chiamata, WhatsApp, indicazioni, prenotazione, sito web, social network e condivisione.',
    note: 'Il QR trasforma un supporto fisico o il telefono in un accesso diretto alla vetrina professionale. Uno screenshot o un’immagine da soli non sono interattivi: condividi il link o il QR Code.',
  },
  ru: {
    title: 'Легко делитесь своим CV Business',
    text: 'Отправьте ссылку на профиль через WhatsApp, электронную почту или социальные сети либо используйте его QR-код. Разместите QR на визитке, стойке или витрине либо просто покажите его на телефоне: клиент одним сканированием откроет Business CV без поиска компании и ввода адреса. Сразу будут доступны звонок, WhatsApp, маршрут, бронирование, сайт, социальные сети и отправка профиля.',
    note: 'QR-код превращает печатный носитель или ваш телефон в прямой вход в профессиональную витрину. Снимок экрана или изображение сами по себе не интерактивны: используйте ссылку или QR-код.',
  },
};

export function CvBusinessSharingInfo({ language = 'fr', className = '' }: { language?: CvBusinessSharingLanguage; className?: string }) {
  const copy = sharingCopy[language] ?? sharingCopy.fr;
  const isRtl = language === 'ar';

  return (
    <div className={className} dir={isRtl ? 'rtl' : 'ltr'}>
      <aside
        className="rounded-2xl border border-[#D4AF37]/55 bg-[linear-gradient(145deg,#073D31,#021F1A)] p-4 text-white shadow-[0_12px_28px_rgba(2,31,26,0.18)] sm:p-5"
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

      <div className="mt-5">
        <CvBusinessQrVisual language={language} />
      </div>
    </div>
  );
}