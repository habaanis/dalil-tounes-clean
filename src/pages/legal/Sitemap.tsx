import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

type PublicLanguage = 'fr' | 'ar' | 'en' | 'it' | 'ru';

type Section = { title: string; links: Array<{ label: string; to: string }> };

const COPY: Record<PublicLanguage, { badge: string; title: string; back: string; sections: Section[] }> = {
  fr: {
    badge: 'Plan du site', title: 'Plan du site', back: "Retour à l'accueil",
    sections: [
      { title: 'Navigation principale', links: [
        { label: 'Accueil', to: '/' }, { label: 'Entreprises', to: '/entreprises' }, { label: 'Emplois', to: '/emplois' }, { label: 'Notre Concept', to: '/notre-concept' }, { label: 'Blog', to: '/blog' }, { label: 'Abonnements', to: '/abonnement' },
      ]},
      { title: 'Espace Citoyens', links: [
        { label: 'Santé', to: '/citizens/health' }, { label: 'Éducation', to: '/education' }, { label: 'Services Publics', to: '/citizens/services' }, { label: 'Commerces & Magasins', to: '/citizens/shops' }, { label: 'Loisirs & Événements', to: '/citizens/leisure' },
      ]},
      { title: 'Informations légales', links: [
        { label: 'Contact', to: '/contact' }, { label: 'Mentions légales', to: '/mentions-legales' }, { label: "Conditions Générales d'Utilisation", to: '/cgu' }, { label: 'Politique de confidentialité', to: '/politique-confidentialite' },
      ]},
    ],
  },
  ar: {
    badge: 'خريطة الموقع', title: 'خريطة الموقع', back: 'العودة إلى الصفحة الرئيسية',
    sections: [
      { title: 'التنقل الرئيسي', links: [
        { label: 'الرئيسية', to: '/' }, { label: 'المؤسسات', to: '/entreprises' }, { label: 'الوظائف', to: '/emplois' }, { label: 'فكرتنا', to: '/notre-concept' }, { label: 'المقالات', to: '/blog' }, { label: 'الاشتراكات', to: '/abonnement' },
      ]},
      { title: 'فضاء المواطنين', links: [
        { label: 'الصحة', to: '/citizens/health' }, { label: 'التعليم', to: '/education' }, { label: 'الخدمات العمومية', to: '/citizens/services' }, { label: 'المحلات والمتاجر', to: '/citizens/shops' }, { label: 'الترفيه والفعاليات', to: '/citizens/leisure' },
      ]},
      { title: 'المعلومات القانونية', links: [
        { label: 'اتصل بنا', to: '/contact' }, { label: 'الإشعارات القانونية', to: '/mentions-legales' }, { label: 'الشروط العامة للاستخدام', to: '/cgu' }, { label: 'سياسة الخصوصية', to: '/politique-confidentialite' },
      ]},
    ],
  },
  en: {
    badge: 'Sitemap', title: 'Sitemap', back: 'Back to home',
    sections: [
      { title: 'Main navigation', links: [
        { label: 'Home', to: '/' }, { label: 'Businesses', to: '/entreprises' }, { label: 'Jobs', to: '/emplois' }, { label: 'Our Concept', to: '/notre-concept' }, { label: 'Blog', to: '/blog' }, { label: 'Subscriptions', to: '/abonnement' },
      ]},
      { title: 'Citizen area', links: [
        { label: 'Health', to: '/citizens/health' }, { label: 'Education', to: '/education' }, { label: 'Public Services', to: '/citizens/services' }, { label: 'Shops & Stores', to: '/citizens/shops' }, { label: 'Leisure & Events', to: '/citizens/leisure' },
      ]},
      { title: 'Legal information', links: [
        { label: 'Contact', to: '/contact' }, { label: 'Legal Notice', to: '/mentions-legales' }, { label: 'Terms of Use', to: '/cgu' }, { label: 'Privacy Policy', to: '/politique-confidentialite' },
      ]},
    ],
  },
  it: {
    badge: 'Mappa del sito', title: 'Mappa del sito', back: 'Torna alla home',
    sections: [
      { title: 'Navigazione principale', links: [
        { label: 'Home', to: '/' }, { label: 'Aziende', to: '/entreprises' }, { label: 'Lavoro', to: '/emplois' }, { label: 'Il nostro concept', to: '/notre-concept' }, { label: 'Blog', to: '/blog' }, { label: 'Abbonamenti', to: '/abonnement' },
      ]},
      { title: 'Spazio cittadini', links: [
        { label: 'Salute', to: '/citizens/health' }, { label: 'Istruzione', to: '/education' }, { label: 'Servizi pubblici', to: '/citizens/services' }, { label: 'Negozi e commerci', to: '/citizens/shops' }, { label: 'Tempo libero ed eventi', to: '/citizens/leisure' },
      ]},
      { title: 'Informazioni legali', links: [
        { label: 'Contatti', to: '/contact' }, { label: 'Note legali', to: '/mentions-legales' }, { label: 'Condizioni generali di utilizzo', to: '/cgu' }, { label: 'Informativa sulla privacy', to: '/politique-confidentialite' },
      ]},
    ],
  },
  ru: {
    badge: 'Карта сайта', title: 'Карта сайта', back: 'Вернуться на главную',
    sections: [
      { title: 'Основная навигация', links: [
        { label: 'Главная', to: '/' }, { label: 'Компании', to: '/entreprises' }, { label: 'Работа', to: '/emplois' }, { label: 'Наша концепция', to: '/notre-concept' }, { label: 'Блог', to: '/blog' }, { label: 'Подписки', to: '/abonnement' },
      ]},
      { title: 'Раздел для граждан', links: [
        { label: 'Здоровье', to: '/citizens/health' }, { label: 'Образование', to: '/education' }, { label: 'Государственные услуги', to: '/citizens/services' }, { label: 'Магазины', to: '/citizens/shops' }, { label: 'Досуг и события', to: '/citizens/leisure' },
      ]},
      { title: 'Юридическая информация', links: [
        { label: 'Контакты', to: '/contact' }, { label: 'Юридическая информация', to: '/mentions-legales' }, { label: 'Условия использования', to: '/cgu' }, { label: 'Политика конфиденциальности', to: '/politique-confidentialite' },
      ]},
    ],
  },
};

const Sitemap: React.FC = () => {
  const { language } = useLanguage();
  const lang = (['fr', 'ar', 'en', 'it', 'ru'].includes(language) ? language : 'fr') as PublicLanguage;
  const copy = COPY[lang];
  const isRTL = lang === 'ar';

  return (
    <div className="min-h-screen bg-[#111111] px-4 py-16" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-block mb-4 px-4 py-1.5 rounded-full border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-medium tracking-widest uppercase" style={{ letterSpacing: '0.15em' }}>{copy.badge}</div>
          <h1 className="text-3xl md:text-4xl font-bold text-white" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{copy.title}</h1>
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto mt-6" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {copy.sections.map((section) => (
            <div key={section.title}>
              <h2 className="text-sm font-semibold text-[#D4AF37] uppercase tracking-widest mb-4" style={{ letterSpacing: '0.1em' }}>{section.title}</h2>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.to}><Link to={link.to} className="text-gray-400 hover:text-[#D4AF37] text-sm transition-colors">{link.label}</Link></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-14 text-center">
          <Link to="/" className="inline-block px-8 py-3 border border-[#D4AF37]/60 text-[#D4AF37] text-sm font-medium rounded-lg hover:bg-[#D4AF37] hover:text-black transition-all duration-200">{copy.back}</Link>
        </div>
      </div>
    </div>
  );
};

export default Sitemap;
