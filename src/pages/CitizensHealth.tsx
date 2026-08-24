import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Building2, X, Plus, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useTranslation } from '../lib/i18n';
import LocationSelectTunisie from '../components/LocationSelectTunisie';
import VehicleTypeAutocomplete from '../components/VehicleTypeAutocomplete';
import MeilleursSection from '../components/MeilleursSection';
import SearchBar from '../components/SearchBar';
import MedicalTransportCard from '../components/MedicalTransportCard';
import MedicalTransportRegistrationForm from '../components/MedicalTransportRegistrationForm';
import { supabase } from '../lib/supabaseClient';
import { getSupabaseImageUrl } from '../lib/imageUtils';
import { useNavigate } from 'react-router-dom';

type PublicLanguage = 'fr' | 'ar' | 'en' | 'it' | 'ru';

interface TransportFilters {
  gouvernorat: string;
  vehicleType: string;
  urgenceOnly: boolean;
}

const COPY: Record<PublicLanguage, {
  back: string;
  pageTitle: string;
  heroAlt: string;
  sector: string;
  bestTitle: string;
  guideTitle: string;
  guideExcerpt: string;
  improving: string;
  transportAlt: string;
  transportTitle: string;
  transportSubtitle: string;
  governorate: string;
  search: string;
  searching: string;
  providerSing: string;
  providerPlur: string;
  availableSing: string;
  availablePlur: string;
  noProvider: string;
  modifyCriteria: string;
  ctaTitle: string;
  ctaText: string;
  ctaButton: string;
  close: string;
}> = {
  fr: {
    back: 'Retour',
    pageTitle: 'Santé',
    heroAlt: 'Soins médicaux et urgences en Tunisie',
    sector: 'professionnels de santé',
    bestTitle: 'Entreprises les plus recommandées par les clients',
    guideTitle: 'Comment choisir son médecin en Tunisie ?',
    guideExcerpt: "Trouver le bon médecin n'est pas toujours simple. Voici les questions à se poser avant de prendre rendez-vous.",
    improving: "Section en cours d'amélioration",
    transportAlt: 'Ambulance et transport médical en Tunisie',
    transportTitle: 'Transport médical',
    transportSubtitle: 'Ambulances, taxis médicaux et transports adaptés disponibles 24h/7j. Trouvez rapidement un véhicule ou inscrivez-vous comme prestataire.',
    governorate: 'Gouvernorat',
    search: 'Rechercher',
    searching: 'Recherche des prestataires...',
    providerSing: 'prestataire',
    providerPlur: 'prestataires',
    availableSing: 'disponible',
    availablePlur: 'disponibles',
    noProvider: 'Aucun prestataire trouvé',
    modifyCriteria: 'Essayez de modifier vos critères de recherche',
    ctaTitle: 'Vous avez un véhicule adapté ?',
    ctaText: 'Rejoignez notre réseau de prestataires de transport médical et aidez les citoyens à accéder plus facilement aux soins. Inscription gratuite et simple.',
    ctaButton: "S'inscrire comme prestataire",
    close: 'Fermer',
  },
  ar: {
    back: 'رجوع',
    pageTitle: 'الصحة',
    heroAlt: 'الرعاية الطبية وخدمات الطوارئ في تونس',
    sector: 'المهنيين الصحيين',
    bestTitle: 'المؤسسات الأكثر توصية من قبل العملاء',
    guideTitle: 'كيف تختار طبيبك في تونس؟',
    guideExcerpt: 'اختيار الطبيب المناسب ليس دائماً سهلاً. إليك أهم الأسئلة التي يمكن طرحها قبل حجز موعد.',
    improving: 'نعمل حالياً على تطوير هذا القسم',
    transportAlt: 'سيارة إسعاف ونقل طبي في تونس',
    transportTitle: 'النقل الطبي',
    transportSubtitle: 'سيارات إسعاف ونقل طبي وخدمات نقل مهيأة متاحة على مدار الساعة. اعثر بسرعة على وسيلة نقل أو سجّل كمقدم خدمة.',
    governorate: 'الولاية',
    search: 'بحث',
    searching: 'جارٍ البحث عن مقدمي الخدمة...',
    providerSing: 'مقدم خدمة',
    providerPlur: 'مقدمي خدمة',
    availableSing: 'متاح',
    availablePlur: 'متاحون',
    noProvider: 'لم يتم العثور على مقدم خدمة',
    modifyCriteria: 'حاول تعديل معايير البحث',
    ctaTitle: 'هل لديك مركبة مهيأة؟',
    ctaText: 'انضم إلى شبكة مقدمي خدمات النقل الطبي وساعد المواطنين على الوصول إلى الرعاية بسهولة أكبر. التسجيل مجاني وبسيط.',
    ctaButton: 'التسجيل كمقدم خدمة',
    close: 'إغلاق',
  },
  en: {
    back: 'Back',
    pageTitle: 'Health',
    heroAlt: 'Medical care and emergency services in Tunisia',
    sector: 'healthcare professionals',
    bestTitle: 'Most recommended businesses by customers',
    guideTitle: 'How to choose your doctor in Tunisia?',
    guideExcerpt: 'Finding the right doctor is not always easy. Here are the key questions to consider before booking an appointment.',
    improving: 'This section is being improved',
    transportAlt: 'Ambulance and medical transport in Tunisia',
    transportTitle: 'Medical transport',
    transportSubtitle: 'Ambulances, medical taxis and adapted transport available 24/7. Quickly find a vehicle or register as a provider.',
    governorate: 'Governorate',
    search: 'Search',
    searching: 'Searching for providers...',
    providerSing: 'provider',
    providerPlur: 'providers',
    availableSing: 'available',
    availablePlur: 'available',
    noProvider: 'No provider found',
    modifyCriteria: 'Try changing your search criteria',
    ctaTitle: 'Do you have an adapted vehicle?',
    ctaText: 'Join our medical transport provider network and help citizens access care more easily. Registration is free and simple.',
    ctaButton: 'Register as a provider',
    close: 'Close',
  },
  it: {
    back: 'Indietro',
    pageTitle: 'Salute',
    heroAlt: 'Cure mediche e servizi di emergenza in Tunisia',
    sector: 'professionisti sanitari',
    bestTitle: 'Aziende più raccomandate dai clienti',
    guideTitle: 'Come scegliere il proprio medico in Tunisia?',
    guideExcerpt: 'Trovare il medico giusto non è sempre semplice. Ecco le domande principali da porsi prima di prenotare una visita.',
    improving: 'Questa sezione è in fase di miglioramento',
    transportAlt: 'Ambulanza e trasporto medico in Tunisia',
    transportTitle: 'Trasporto medico',
    transportSubtitle: 'Ambulanze, taxi medici e trasporti adattati disponibili 24 ore su 24. Trova rapidamente un veicolo o registrati come fornitore.',
    governorate: 'Governatorato',
    search: 'Cerca',
    searching: 'Ricerca dei fornitori...',
    providerSing: 'fornitore',
    providerPlur: 'fornitori',
    availableSing: 'disponibile',
    availablePlur: 'disponibili',
    noProvider: 'Nessun fornitore trovato',
    modifyCriteria: 'Prova a modificare i criteri di ricerca',
    ctaTitle: 'Hai un veicolo adattato?',
    ctaText: "Unisciti alla nostra rete di trasporto medico e aiuta i cittadini ad accedere più facilmente alle cure. L'iscrizione è gratuita e semplice.",
    ctaButton: 'Registrati come fornitore',
    close: 'Chiudi',
  },
  ru: {
    back: 'Назад',
    pageTitle: 'Здоровье',
    heroAlt: 'Медицинская помощь и экстренные службы в Тунисе',
    sector: 'медицинские специалисты',
    bestTitle: 'Компании, которые чаще всего рекомендуют клиенты',
    guideTitle: 'Как выбрать врача в Тунисе?',
    guideExcerpt: 'Найти подходящего врача не всегда просто. Вот основные вопросы, которые стоит учесть перед записью на приём.',
    improving: 'Этот раздел сейчас улучшается',
    transportAlt: 'Скорая помощь и медицинский транспорт в Тунисе',
    transportTitle: 'Медицинский транспорт',
    transportSubtitle: 'Скорая помощь, медицинские такси и адаптированный транспорт доступны круглосуточно. Найдите транспорт или зарегистрируйтесь как поставщик услуг.',
    governorate: 'Губернаторство',
    search: 'Искать',
    searching: 'Поиск поставщиков услуг...',
    providerSing: 'поставщик',
    providerPlur: 'поставщики',
    availableSing: 'доступен',
    availablePlur: 'доступны',
    noProvider: 'Поставщики не найдены',
    modifyCriteria: 'Попробуйте изменить параметры поиска',
    ctaTitle: 'У вас есть адаптированный транспорт?',
    ctaText: 'Присоединяйтесь к сети медицинского транспорта и помогайте людям легче получать необходимую помощь. Регистрация бесплатная и простая.',
    ctaButton: 'Зарегистрироваться как поставщик',
    close: 'Закрыть',
  },
};

interface CitizensHealthProps {
  onNavigate?: (page: any) => void;
}

export default function CitizensHealth({}: CitizensHealthProps) {
  const { language } = useLanguage();
  const t = useTranslation(language);
  const navigate = useNavigate();
  const lang = (['fr', 'ar', 'en', 'it', 'ru'].includes(language) ? language : 'fr') as PublicLanguage;
  const c = COPY[lang];
  const isRTL = lang === 'ar';

  const [transportCity, setTransportCity] = useState('');
  const [vehicleType, setVehicleType] = useState('');
  const [transportProviders, setTransportProviders] = useState<any[]>([]);
  const [loadingTransport, setLoadingTransport] = useState(false);
  const [showTransportModal, setShowTransportModal] = useState(false);

  const emergencyNumbers = useMemo(() => ([
    { num: '190', label: t.health.emergency.samu },
    { num: '198', label: t.health.emergency.civil },
    { num: '197', label: t.health.emergency.police },
  ]), [t]);

  const searchTransport = async (filters: TransportFilters) => {
    setLoadingTransport(true);
    try {
      let query = supabase
        .from('medical_transport_providers')
        .select('*')
        .order('est_premium', { ascending: false })
        .order('created_at', { ascending: false });

      if (filters.gouvernorat) query = query.eq('governorate', filters.gouvernorat);
      if (filters.vehicleType) query = query.eq('vehicle_type', filters.vehicleType);
      if (filters.urgenceOnly) query = query.eq('vehicle_type', 'Ambulance').eq('est_disponible_nuit', true);

      const { data, error } = await query.limit(50);
      if (error) {
        console.error('Error fetching transport providers:', error);
        setTransportProviders([]);
      } else {
        setTransportProviders(data ?? []);
      }
    } finally {
      setLoadingTransport(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50" dir={isRTL ? 'rtl' : 'ltr'}>
      <section className="relative w-full overflow-hidden rounded-b-3xl shadow-lg">
        <img src={getSupabaseImageUrl('sante.jpg')} alt={c.heroAlt} className="w-full h-[240px] object-cover" decoding="async" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#4A1D43]/40 to-[#6B2D5C]/30" />
        <button
          onClick={() => navigate('/citizens')}
          className={`absolute top-4 z-10 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm text-[#4A1D43] px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-white transition-colors shadow-sm ${isRTL ? 'right-4' : 'left-4'}`}
        >
          <ArrowLeft className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
          {c.back}
        </button>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <motion.h1 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6 }} className="text-4xl md:text-5xl font-light text-[#D4AF37] mb-3 drop-shadow-lg" style={{ fontFamily: "'Playfair Display', serif" }}>
            {c.pageTitle}
          </motion.h1>
          <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6, delay: 0.1 }} className="text-base md:text-lg font-light text-white/95 max-w-3xl leading-relaxed drop-shadow-lg">
            {t.health.hero.description}
          </motion.p>
        </div>
      </section>

      <section className="py-2 px-4 relative z-[9999]" style={{ overflow: 'visible' }}>
        <div className="max-w-5xl mx-auto" style={{ overflow: 'visible' }}>
          <div className="bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-[#D4AF37] p-2.5 md:p-3" style={{ overflow: 'visible' }}>
            <SearchBar scope="sante" intentEnabled={false} enabled resultMode="redirectToResults" />
          </div>
        </div>
      </section>

      <section className="py-8 bg-white">
        <MeilleursSection
          secteurLabel={c.sector}
          listePage="santé"
          accentColor="#4A1D43"
          sectionTitle={c.bestTitle}
          blogArticle={{ title: c.guideTitle, excerpt: c.guideExcerpt, slug: 'comment-choisir-son-medecin' }}
        />
      </section>

      <section className="px-4 pt-2 pb-4">
        <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-br from-[#4A1D43]/5 to-[#D4AF37]/5 border border-[#D4AF37] rounded-xl px-3 py-3 shadow-lg">
            <div className="text-center mb-2">
              <h2 className="text-xl font-light text-[#4A1D43]" style={{ fontFamily: "'Playfair Display', serif" }}>{t.health.emergency.title}</h2>
              <p className="text-[10px] text-gray-600 mt-0.5">{t.health.emergency.subtitle}</p>
            </div>
            <div className="flex flex-col md:flex-row justify-center gap-2">
              {emergencyNumbers.map((n) => (
                <a key={n.num} href={`tel:${n.num}`} className="bg-[#4A1D43] hover:bg-[#5A2D53] rounded-lg px-3 py-2 border border-[#D4AF37] transition-all duration-300 flex flex-col items-center shadow-md hover:shadow-xl w-full md:w-[140px]">
                  <Phone className="w-4 h-4 text-[#D4AF37] mb-1" />
                  <div className="text-lg font-semibold text-[#D4AF37] leading-none">{n.num}</div>
                  <div className="text-[10px] text-white/90 mt-1">{n.label}</div>
                </a>
              ))}
            </div>
            <div className="mt-2 bg-white rounded-lg border border-[#D4AF37] px-3 py-3 text-center">
              <p className="text-[11px] text-gray-500 italic">{c.improving}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 pb-8">
        <div className="max-w-7xl mx-auto">
          <div className="relative h-32 rounded-xl overflow-hidden mb-4 shadow-lg border border-[#D4AF37]">
            <img src={getSupabaseImageUrl('sante_banner.webp')} alt={c.transportAlt} className="w-full h-full object-cover" decoding="async" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#4A1D43]/90 to-[#6B2D5C]/80" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
              <h2 className="text-xl md:text-2xl font-light text-[#D4AF37] mb-1 drop-shadow-lg" style={{ fontFamily: "'Playfair Display', serif" }}>🚑 {c.transportTitle}</h2>
              <p className="text-white/95 text-xs md:text-sm font-light max-w-2xl mx-auto drop-shadow leading-snug">{c.transportSubtitle}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-[#D4AF37] p-4 mb-4 flex flex-wrap gap-3 items-end">
            <div className="flex-1 min-w-[180px]">
              <LocationSelectTunisie value={transportCity} onChange={setTransportCity} placeholder={c.governorate} className="px-3 py-2 rounded-lg text-sm" />
            </div>
            <div className="flex-1 min-w-[180px]"><VehicleTypeAutocomplete value={vehicleType} onChange={setVehicleType} /></div>
            <button onClick={() => searchTransport({ gouvernorat: transportCity, vehicleType, urgenceOnly: false })} className="px-5 py-2 bg-[#4A1D43] text-[#D4AF37] border border-[#D4AF37] rounded-lg text-sm font-medium hover:bg-[#5A2D53] transition-all">{c.search}</button>
          </div>

          {loadingTransport ? (
            <div className="text-center py-16">
              <div className="inline-block w-12 h-12 border-4 border-[#4A1D43] border-t-transparent rounded-full animate-spin" />
              <p className="mt-4 text-[#4A1D43]">{c.searching}</p>
            </div>
          ) : transportProviders.length > 0 ? (
            <div className="mt-8">
              <h3 className="text-2xl font-light text-[#4A1D43] mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
                {transportProviders.length} {transportProviders.length > 1 ? c.providerPlur : c.providerSing} {transportProviders.length > 1 ? c.availablePlur : c.availableSing}
              </h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {transportProviders.map((provider) => <MedicalTransportCard key={provider.id} provider={provider} />)}
              </div>
            </div>
          ) : (
            <div className="mt-8 text-center py-12 bg-white rounded-xl border border-[#D4AF37]">
              <Building2 className="w-16 h-16 text-[#D4AF37]/50 mx-auto mb-4" />
              <p className="text-[#4A1D43] mb-2 font-medium">{c.noProvider}</p>
              <p className="text-sm text-gray-500">{c.modifyCriteria}</p>
            </div>
          )}

          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="mt-8 bg-gradient-to-br from-[#4A1D43]/5 to-[#D4AF37]/5 border-2 border-[#D4AF37] rounded-2xl p-6 text-center shadow-lg">
            <div className="max-w-2xl mx-auto">
              <h3 className="text-2xl font-light text-[#4A1D43] mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>{c.ctaTitle}</h3>
              <p className="text-gray-700 text-sm mb-4 leading-relaxed">{c.ctaText}</p>
              <button onClick={() => setShowTransportModal(true)} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#4A1D43] text-[#D4AF37] text-sm font-semibold border border-[#D4AF37] hover:bg-[#5A2D53] hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <Plus className="w-4 h-4" />{c.ctaButton}
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {showTransportModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <button aria-label={c.close} title={c.close} onClick={() => setShowTransportModal(false)} className={`sticky top-4 z-10 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition ${isRTL ? 'left-4 float-left' : 'right-4 float-right'}`}>
              <X className="w-5 h-5 text-gray-600" />
            </button>
            <MedicalTransportRegistrationForm onSuccess={() => setTimeout(() => setShowTransportModal(false), 2500)} onCancel={() => setShowTransportModal(false)} />
          </motion.div>
        </div>
      )}

      <section className="px-4 pb-12">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-3">
          <div className="bg-white rounded-xl border border-[#D4AF37] p-4 hover:shadow-lg transition-all duration-300"><h4 className="text-sm font-medium text-[#4A1D43] mb-1.5" style={{ fontFamily: "'Playfair Display', serif" }}>{t.health.info.cnamTitle}</h4><p className="text-xs text-gray-700">{t.health.info.cnamBody}</p></div>
          <div className="bg-white rounded-xl border border-[#D4AF37] p-4 hover:shadow-lg transition-all duration-300"><h4 className="text-sm font-medium text-[#4A1D43] mb-1.5" style={{ fontFamily: "'Playfair Display', serif" }}>{t.health.info.csbTitle}</h4><p className="text-xs text-gray-700">{t.health.info.csbBody}</p></div>
          <div className="bg-white rounded-xl border border-[#D4AF37] p-4 hover:shadow-lg transition-all duration-300"><h4 className="text-sm font-medium text-[#4A1D43] mb-1.5" style={{ fontFamily: "'Playfair Display', serif" }}>{t.health.info.tipsTitle}</h4><p className="text-xs text-gray-700">{t.health.info.tipsBody}</p></div>
        </div>
      </section>
    </div>
  );
}
