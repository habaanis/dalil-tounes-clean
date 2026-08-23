import { Link2, QrCode, Share2 } from 'lucide-react';
import { CvBusinessQrVisual } from './CvBusinessProductVisuals';

export type CvBusinessSharingLanguage = 'fr' | 'ar' | 'en' | 'it' | 'ru';

const sharingCopy: Record<CvBusinessSharingLanguage, { title: string; text: string; note: string }> = {
  fr: {
    title: 'Votre CV Business toujours avec vous',
    text: 'Vous n’avez plus besoin d’avoir en permanence des cartes de visite ou des flyers sur vous. Dans un café, un salon, un rendez-vous ou simplement face à un client, un partenaire ou un associé, affichez votre QR Code sur votre téléphone : il le scanne et ouvre immédiatement votre CV Business, sans rechercher votre entreprise ni saisir une adresse. Il retrouve alors vos informations, vos réalisations et les actions utiles : appel, WhatsApp, itinéraire, réservation, site web, réseaux sociaux et partage.',
    note: 'Votre téléphone devient ainsi une carte de visite numérique toujours disponible. Le QR peut aussi être imprimé sur une carte, un flyer, un comptoir ou une vitrine pour donner le même accès direct à votre présentation professionnelle.',
  },
  ar: {
    title: 'CV Business الخاص بك معك دائماً',
    text: 'لم تعد بحاجة إلى حمل بطاقات عمل أو منشورات معك طوال الوقت. في مقهى أو معرض أو موعد، أو أمام عميل أو شريك أو مساهم، اعرض رمز QR على هاتفك: يقوم بمسحه ويفتح CV Business مباشرة دون البحث عن شركتك أو كتابة أي عنوان. ويجد فوراً معلوماتك وأعمالك وأزرار الاتصال وواتساب والاتجاهات والحجز والموقع الإلكتروني وشبكات التواصل والمشاركة.',
    note: 'هكذا يصبح هاتفك بطاقة عمل رقمية متاحة دائماً. ويمكن أيضاً طباعة رمز QR على بطاقة أو منشور أو مكتب أو واجهة ليمنح نفس الوصول المباشر إلى عرضك المهني.',
  },
  en: {
    title: 'Your Business CV, always with you',
    text: 'You no longer need to carry business cards or flyers with you all the time. In a café, at an event, during a meeting, or simply with a client, partner or associate, show the QR Code on your phone: they scan it and open your Business CV instantly, without searching for your company or typing an address. They immediately see your information, work and useful actions: call, WhatsApp, directions, booking, website, social media and sharing.',
    note: 'Your phone becomes a digital business card that is always available. The QR can also be printed on a card, flyer, counter or storefront to provide the same direct access to your professional presentation.',
  },
  it: {
    title: 'Il tuo CV Business sempre con te',
    text: 'Non hai più bisogno di avere sempre con te biglietti da visita o volantini. In un bar, a un evento, durante un appuntamento o semplicemente con un cliente, un partner o un socio, mostra il QR Code sul telefono: lo scansiona e apre immediatamente il tuo CV Business, senza cercare l’azienda o digitare un indirizzo. Trova subito informazioni, realizzazioni e azioni utili: chiamata, WhatsApp, indicazioni, prenotazione, sito web, social network e condivisione.',
    note: 'Il telefono diventa così un biglietto da visita digitale sempre disponibile. Il QR può anche essere stampato su un biglietto, un volantino, un bancone o una vetrina per offrire lo stesso accesso diretto alla tua presentazione professionale.',
  },
  ru: {
    title: 'Ваш Business CV всегда с вами',
    text: 'Вам больше не нужно постоянно носить с собой визитки или листовки. В кафе, на выставке, на встрече или просто при разговоре с клиентом, партнёром или коллегой покажите QR-код на телефоне: его сканируют и сразу открывают ваш Business CV без поиска компании и ввода адреса. Сразу доступны информация, работы и полезные действия: звонок, WhatsApp, маршрут, бронирование, сайт, социальные сети и отправка профиля.',
    note: 'Телефон становится цифровой визиткой, которая всегда под рукой. QR-код также можно напечатать на визитке, листовке, стойке или витрине для такого же прямого доступа к профессиональной презентации.',
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