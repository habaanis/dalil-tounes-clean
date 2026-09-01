import { BusinessCardPreview, type BusinessCardPreviewLanguage } from './BusinessCardPreview';
import { CvBusinessQrVisual } from './CvBusinessQrVisual';

export { CvBusinessQrVisual } from './CvBusinessQrVisual';
export type { CvBusinessQrVisualProps } from './CvBusinessQrVisual';

const productCopy: Record<BusinessCardPreviewLanguage, {
  productLabel: string;
  productTitle: string;
  productText: string;
}> = {
  fr: {
    productLabel: 'Le CV Business vivant',
    productTitle: 'Toute votre activité dans une vitrine professionnelle.',
    productText: 'Un seul lien réunit vos informations, vos actions de contact, vos services, vos avis, vos réalisations et vos réseaux sociaux.',
  },
  ar: {
    productLabel: 'CV Business الحي',
    productTitle: 'كل نشاطك في واجهة مهنية واحدة.',
    productText: 'رابط واحد يجمع معلوماتك ووسائل الاتصال والخدمات والآراء والأعمال وشبكات التواصل.',
  },
  en: {
    productLabel: 'The living Business CV',
    productTitle: 'Your whole business in one professional showcase.',
    productText: 'One link brings together your information, contact actions, services, reviews, work and social networks.',
  },
  it: {
    productLabel: 'Il CV Business vivo',
    productTitle: 'Tutta la tua attività in una vetrina professionale.',
    productText: 'Un solo link riunisce informazioni, contatti, servizi, recensioni, lavori e social network.',
  },
  ru: {
    productLabel: 'Живой Business CV',
    productTitle: 'Весь ваш бизнес в одной профессиональной витрине.',
    productText: 'Одна ссылка объединяет информацию, контакты, услуги, отзывы, работы и социальные сети.',
  },
};

export function CvBusinessProductVisuals({
  language = 'fr',
  showExplanations = true,
}: {
  language?: BusinessCardPreviewLanguage;
  showExplanations?: boolean;
}) {
  const t = productCopy[language] ?? productCopy.fr;
  const isRtl = language === 'ar';

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'} className="w-full">
      {showExplanations && (
        <div className="mx-auto mb-5 max-w-3xl text-center">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-[#D4AF37]">{t.productLabel}</p>
          <h3 className="mt-2 text-xl font-bold text-[#4A1D43] md:text-2xl">{t.productTitle}</h3>
          <p className="mt-2 text-sm leading-relaxed text-gray-600">{t.productText}</p>
        </div>
      )}

      <div className="grid items-start gap-5 md:grid-cols-2">
        <div className="flex justify-center">
          <BusinessCardPreview variant="premium" size="compact" interactive={false} language={language} />
        </div>
        <div className="flex justify-center">
          <CvBusinessQrVisual language={language} />
        </div>
      </div>
    </div>
  );
}

export default CvBusinessProductVisuals;
