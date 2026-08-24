import React from 'react';
import { Link } from 'react-router-dom';
import { SEOHead } from '../../components/SEOHead';
import { useLanguage } from '../../context/LanguageContext';

type PublicLanguage = 'fr' | 'ar' | 'en' | 'it' | 'ru';

const COPY: Record<PublicLanguage, {
  seoTitle: string;
  seoDescription: string;
  eyebrow: string;
  title: string;
  sections: Array<{ title: string; text: string }>;
  updated: string;
  seeAlso: string;
  legal: string;
  terms: string;
  privacy: string;
}> = {
  fr: {
    seoTitle: 'Informations sur les avis et recommandations — Dalil Tounes',
    seoDescription: 'Politique de Dalil Tounes concernant les avis, les recommandations et le classement des entreprises affichées sur la plateforme.',
    eyebrow: 'Informations légales',
    title: 'Informations sur les avis et recommandations',
    sections: [
      { title: '1. Critères de mise en avant', text: 'Les entreprises présentées sur Dalil Tounes peuvent être mises en avant selon des critères objectifs et automatisés tels que les avis publics, les notes disponibles sur Google, la complétude des informations de la fiche, la présence de photos, les horaires renseignés et la qualité des informations fournies.' },
      { title: '2. Neutralité éditoriale', text: "Dalil Tounes n'attribue aucune note, n'émet aucun jugement de valeur sur les établissements et n'effectue aucun classement éditorial. Les données affichées proviennent de sources publiques ou des informations communiquées par les entreprises elles-mêmes." },
      { title: '3. Mentions de recommandation', text: 'Les mentions telles que « Entreprises les plus recommandées par les clients », « Établissements les plus appréciés » ou « Professionnels les mieux notés sur Google » ont uniquement pour objectif d’aider les utilisateurs à découvrir des établissements disposant d’avis publics positifs et ne constituent ni une certification officielle, ni un classement commercial.' },
    ],
    updated: 'Dernière mise à jour : juin 2026', seeAlso: 'Voir aussi :', legal: 'Mentions légales', terms: 'CGU', privacy: 'Confidentialité',
  },
  ar: {
    seoTitle: 'معلومات حول الآراء والتوصيات — دليل تونس',
    seoDescription: 'سياسة دليل تونس بشأن الآراء والتوصيات وطريقة إبراز المؤسسات المعروضة على المنصة.',
    eyebrow: 'معلومات قانونية',
    title: 'معلومات حول الآراء والتوصيات',
    sections: [
      { title: '1. معايير الإبراز', text: 'يمكن إبراز المؤسسات المعروضة على دليل تونس وفق معايير موضوعية وآلية مثل الآراء العامة، والتقييمات المتاحة على Google، ومدى اكتمال معلومات البطاقة، ووجود الصور، وساعات العمل المسجلة، وجودة المعلومات المقدمة.' },
      { title: '2. الحياد التحريري', text: 'لا يمنح دليل تونس أي تقييم، ولا يصدر أحكام قيمة على المؤسسات، ولا يقوم بأي ترتيب تحريري. تأتي البيانات المعروضة من مصادر عامة أو من المعلومات التي تقدمها المؤسسات نفسها.' },
      { title: '3. عبارات التوصية', text: 'عبارات مثل «المؤسسات الأكثر توصية من قبل العملاء» أو «المؤسسات الأكثر تقديراً» أو «المهنيون الأعلى تقييماً على Google» هدفها فقط مساعدة المستخدمين على اكتشاف مؤسسات لديها آراء عامة إيجابية، ولا تمثل شهادة رسمية أو ترتيباً تجارياً.' },
    ],
    updated: 'آخر تحديث: يونيو 2026', seeAlso: 'انظر أيضاً:', legal: 'الإشعارات القانونية', terms: 'شروط الاستخدام', privacy: 'الخصوصية',
  },
  en: {
    seoTitle: 'Reviews and recommendations information — Dalil Tounes',
    seoDescription: 'Dalil Tounes policy regarding reviews, recommendations and how businesses are highlighted on the platform.',
    eyebrow: 'Legal information',
    title: 'Information about reviews and recommendations',
    sections: [
      { title: '1. Highlighting criteria', text: 'Businesses displayed on Dalil Tounes may be highlighted according to objective and automated criteria such as public reviews, ratings available on Google, completeness of the profile, presence of photos, listed opening hours and the quality of the information provided.' },
      { title: '2. Editorial neutrality', text: 'Dalil Tounes does not assign ratings, make value judgments about businesses, or create editorial rankings. Displayed data comes from public sources or information supplied by the businesses themselves.' },
      { title: '3. Recommendation wording', text: 'Wording such as “Most recommended businesses by customers”, “Most appreciated establishments” or “Top-rated professionals on Google” is intended only to help users discover businesses with positive public reviews and does not constitute official certification or a commercial ranking.' },
    ],
    updated: 'Last updated: June 2026', seeAlso: 'See also:', legal: 'Legal notice', terms: 'Terms of Use', privacy: 'Privacy',
  },
  it: {
    seoTitle: 'Informazioni su recensioni e raccomandazioni — Dalil Tounes',
    seoDescription: 'Politica di Dalil Tounes relativa a recensioni, raccomandazioni e criteri di evidenza delle aziende sulla piattaforma.',
    eyebrow: 'Informazioni legali',
    title: 'Informazioni su recensioni e raccomandazioni',
    sections: [
      { title: '1. Criteri di evidenza', text: 'Le aziende presenti su Dalil Tounes possono essere messe in evidenza secondo criteri oggettivi e automatizzati, come recensioni pubbliche, valutazioni disponibili su Google, completezza della scheda, presenza di foto, orari indicati e qualità delle informazioni fornite.' },
      { title: '2. Neutralità editoriale', text: 'Dalil Tounes non assegna valutazioni, non esprime giudizi di valore sulle attività e non effettua classifiche editoriali. I dati mostrati provengono da fonti pubbliche o dalle informazioni comunicate dalle aziende stesse.' },
      { title: '3. Diciture di raccomandazione', text: 'Diciture come “Aziende più raccomandate dai clienti”, “Attività più apprezzate” o “Professionisti meglio valutati su Google” servono esclusivamente ad aiutare gli utenti a scoprire attività con recensioni pubbliche positive e non costituiscono né una certificazione ufficiale né una classifica commerciale.' },
    ],
    updated: 'Ultimo aggiornamento: giugno 2026', seeAlso: 'Vedi anche:', legal: 'Note legali', terms: 'Condizioni di utilizzo', privacy: 'Privacy',
  },
  ru: {
    seoTitle: 'Информация об отзывах и рекомендациях — Dalil Tounes',
    seoDescription: 'Политика Dalil Tounes в отношении отзывов, рекомендаций и принципов выделения компаний на платформе.',
    eyebrow: 'Юридическая информация',
    title: 'Информация об отзывах и рекомендациях',
    sections: [
      { title: '1. Критерии выделения', text: 'Компании на Dalil Tounes могут выделяться на основе объективных автоматизированных критериев, включая публичные отзывы, оценки Google, полноту карточки, наличие фотографий, указанные часы работы и качество предоставленной информации.' },
      { title: '2. Редакционная нейтральность', text: 'Dalil Tounes не присваивает оценки, не выносит оценочных суждений о компаниях и не формирует редакционные рейтинги. Отображаемые данные поступают из открытых источников или предоставляются самими компаниями.' },
      { title: '3. Формулировки рекомендаций', text: 'Фразы вроде «Компании, которые чаще всего рекомендуют клиенты», «Самые популярные заведения» или «Лучше всего оценённые специалисты в Google» предназначены только для помощи пользователям в поиске компаний с положительными публичными отзывами и не являются официальной сертификацией или коммерческим рейтингом.' },
    ],
    updated: 'Последнее обновление: июнь 2026', seeAlso: 'См. также:', legal: 'Юридическая информация', terms: 'Условия использования', privacy: 'Конфиденциальность',
  },
};

const InfoAvis: React.FC = () => {
  const { language } = useLanguage();
  const lang = (['fr', 'ar', 'en', 'it', 'ru'].includes(language) ? language : 'fr') as PublicLanguage;
  const copy = COPY[lang];
  const isRTL = lang === 'ar';

  return (
    <div className="min-h-screen bg-white" dir={isRTL ? 'rtl' : 'ltr'}>
      <SEOHead title={copy.seoTitle} description={copy.seoDescription} />
      <div className="pt-16 pb-10 px-4 border-b border-gray-100">
        <div className="max-w-3xl mx-auto text-center">
          <span className="inline-block text-xs uppercase tracking-[0.25em] text-[#D4AF37] font-medium mb-6">{copy.eyebrow}</span>
          <h1 className="text-3xl md:text-4xl font-light text-gray-900 leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>{copy.title}</h1>
          <div className="w-12 h-px bg-[#D4AF37] mx-auto mt-8" />
        </div>
      </div>
      <div className="max-w-3xl mx-auto px-4 py-12 space-y-10 text-gray-700 text-sm leading-relaxed">
        {copy.sections.map((section) => (
          <section key={section.title}>
            <h2 className="text-base font-semibold text-gray-900 uppercase tracking-wide mb-4">{section.title}</h2>
            <p>{section.text}</p>
          </section>
        ))}
        <div className="pt-6 border-t border-gray-100 space-y-3">
          <p className="text-xs text-gray-400">{copy.updated}</p>
          <p className="text-xs text-gray-500">
            {copy.seeAlso}{' '}
            <Link to="/mentions-legales" className="text-[#D4AF37] hover:underline">{copy.legal}</Link>{' '}&middot;{' '}
            <Link to="/cgu" className="text-[#D4AF37] hover:underline">{copy.terms}</Link>{' '}&middot;{' '}
            <Link to="/politique-confidentialite" className="text-[#D4AF37] hover:underline">{copy.privacy}</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default InfoAvis;
