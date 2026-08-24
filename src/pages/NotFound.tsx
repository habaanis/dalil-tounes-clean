import { Link } from 'react-router-dom';
import { SEOHead } from '../components/SEOHead';
import { useLanguage } from '../context/LanguageContext';

const copy = {
  fr: { seoTitle: 'Page introuvable | Dalil Tounes', seoDescription: "Cette page n'existe pas ou n'est plus disponible sur Dalil Tounes.", error: 'Erreur 404', title: 'Page introuvable', text: "L'adresse demandée n'existe pas, a été déplacée ou n'est plus disponible.", home: "Retour à l'accueil", search: 'Rechercher un professionnel' },
  en: { seoTitle: 'Page not found | Dalil Tounes', seoDescription: 'This page does not exist or is no longer available on Dalil Tounes.', error: 'Error 404', title: 'Page not found', text: 'The requested address does not exist, has been moved, or is no longer available.', home: 'Back to home', search: 'Find a professional' },
  ar: { seoTitle: 'الصفحة غير موجودة | دليل تونس', seoDescription: 'هذه الصفحة غير موجودة أو لم تعد متاحة على دليل تونس.', error: 'خطأ 404', title: 'الصفحة غير موجودة', text: 'العنوان المطلوب غير موجود أو تم نقله أو لم يعد متاحاً.', home: 'العودة إلى الرئيسية', search: 'ابحث عن مهني' },
  it: { seoTitle: 'Pagina non trovata | Dalil Tounes', seoDescription: 'Questa pagina non esiste o non è più disponibile su Dalil Tounes.', error: 'Errore 404', title: 'Pagina non trovata', text: "L'indirizzo richiesto non esiste, è stato spostato o non è più disponibile.", home: 'Torna alla home', search: 'Cerca un professionista' },
  ru: { seoTitle: 'Страница не найдена | Dalil Tounes', seoDescription: 'Эта страница не существует или больше недоступна на Dalil Tounes.', error: 'Ошибка 404', title: 'Страница не найдена', text: 'Запрошенный адрес не существует, был перемещен или больше недоступен.', home: 'На главную', search: 'Найти специалиста' },
};

export default function NotFound() {
  const { language } = useLanguage();
  const t = copy[language] || copy.fr;
  return (
    <>
      <SEOHead
        title={t.seoTitle}
        description={t.seoDescription}
        noindex
        currentPath={window.location.pathname}
      />
      <main className="min-h-[70vh] bg-white px-4 py-20" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-5 text-sm font-semibold uppercase tracking-[0.2em] text-[#D4AF37]">{t.error}</div>
          <h1 className="mb-4 text-3xl font-bold text-[#4A1D43] md:text-5xl">{t.title}</h1>
          <p className="mx-auto mb-8 max-w-xl text-gray-600">{t.text}</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              to="/"
              className="rounded-xl bg-[#4A1D43] px-6 py-3 font-semibold text-white transition hover:opacity-90"
            >
              {t.home}
            </Link>
            <Link
              to="/businesses"
              className="rounded-xl border border-[#D4AF37] px-6 py-3 font-semibold text-[#4A1D43] transition hover:bg-[#FFF8E6]"
            >
              {t.search}
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
