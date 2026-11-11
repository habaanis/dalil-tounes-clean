import type { Language } from './i18n';

const COPY: Record<Language, { service: string; certified: string }> = {
  fr: {
    service: 'Premium / Artisan : niveau de services',
    certified: 'Certifiée Dalil Tounes : CV Business ou Portfolio publié',
  },
  ar: {
    service: 'Premium / Artisan: مستوى الخدمات',
    certified: 'موثّق من دليل تونس: CV Business أو Portfolio منشور',
  },
  en: {
    service: 'Premium / Artisan: service level',
    certified: 'Dalil Tounes Certified: published Business or Portfolio CV',
  },
  it: {
    service: 'Premium / Artisan: livello di servizi',
    certified: 'Certificata Dalil Tounes: CV Business o Portfolio pubblicato',
  },
  ru: {
    service: 'Premium / Artisan: уровень услуг',
    certified: 'Сертифицировано Dalil Tounes: опубликован CV Business или Portfolio',
  },
};

export function getBusinessBadgeLegendTranslations(language: Language) {
  return COPY[language] ?? COPY.fr;
}
