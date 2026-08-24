import type { Language } from './i18n';

const COPY: Record<Language, { service: string; certified: string }> = {
  fr: {
    service: 'Premium / Artisan : niveau de services',
    certified: 'Certifié : identité et informations vérifiées',
  },
  ar: {
    service: 'Premium / Artisan: مستوى الخدمات',
    certified: 'موثّق: تم التحقق من الهوية والمعلومات',
  },
  en: {
    service: 'Premium / Artisan: service level',
    certified: 'Certified: identity and information verified',
  },
  it: {
    service: 'Premium / Artisan: livello di servizi',
    certified: 'Certificato: identità e informazioni verificate',
  },
  ru: {
    service: 'Premium / Artisan: уровень услуг',
    certified: 'Проверено: личность и информация подтверждены',
  },
};

export function getBusinessBadgeLegendTranslations(language: Language) {
  return COPY[language] ?? COPY.fr;
}
