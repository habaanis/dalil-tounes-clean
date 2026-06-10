import { ArrowLeft } from 'lucide-react';
import SearchBar from '../components/SearchBar';
import { getSupabaseImageUrl } from '../lib/imageUtils';
import MeilleursSection from '../components/MeilleursSection';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

interface CitizensTourismProps {
  onNavigate?: (page: any) => void;
}

export default function CitizensTourism({ onNavigate }: CitizensTourismProps = {}) {
  const navigate = useNavigate();
  const { language } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <section className="relative w-full h-[280px] overflow-hidden">
        <img
          src={getSupabaseImageUrl('entreprise_banner.webp')}
          alt="Tourisme Local & Expatriation"
          className="absolute inset-0 w-full h-full object-cover"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#4A1D43]/80 via-[#4A1D43]/70 to-transparent"></div>

        <button
          onClick={() => window.history.length > 1 ? navigate(-1) : navigate('/citoyens')}
          className="absolute top-4 left-4 z-10 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm text-[#4A1D43] px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-white transition-colors shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          {language === 'fr' ? 'Retour' : language === 'ar' ? 'رجوع' : language === 'en' ? 'Back' : 'Indietro'}
        </button>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4 py-6">
          <h1 className="text-3xl md:text-4xl font-semibold mb-2 drop-shadow-lg text-[#D4AF37]">
            {language === 'fr' ? 'Tourisme Local & Expatriation' :
             language === 'ar' ? 'السياحة المحلية والاغتراب' :
             language === 'en' ? 'Local Tourism & Expatriation' :
             'Turismo Locale ed Espatrio'}
          </h1>
          <p className="text-sm md:text-base font-light text-white/95 max-w-3xl leading-relaxed drop-shadow-lg">
            {language === 'fr' ? "Découvrez les meilleurs services pour touristes et expatriés en Tunisie. Hébergement, guides touristiques, services d'immigration et plus encore." :
             language === 'ar' ? 'اكتشف أفضل الخدمات للسياح والمغتربين في تونس. الإقامة، الأدلة السياحية، خدمات الهجرة والمزيد.' :
             language === 'en' ? 'Discover the best services for tourists and expatriates in Tunisia. Accommodation, tourist guides, immigration services and more.' :
             'Scopri i migliori servizi per turisti ed espatriati in Tunisia. Alloggio, guide turistiche, servizi di immigrazione e molto altro.'}
          </p>
        </div>
      </section>

      <section className="py-6 px-4 bg-white">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-lg md:text-xl font-light mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
            <span className="text-[#4A0404]">
              {language === 'fr' ? 'Votre guide pour un séjour réussi en Tunisie' :
               language === 'ar' ? 'دليلك لإقامة ناجحة في تونس' :
               language === 'en' ? 'Your guide to a successful stay in Tunisia' :
               'La tua guida per un soggiorno di successo in Tunisia'}
            </span>
          </p>
          <div className="flex justify-center">
            <div className="w-[40px] h-[1px] bg-[#D4AF37]"></div>
          </div>
        </div>
      </section>

      <section className="py-2 px-4 relative z-[9999]" style={{ overflow: 'visible' }}>
        <div className="max-w-5xl mx-auto" style={{ overflow: 'visible' }}>
          <div className="bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-[#D4AF37] p-2.5 md:p-3" style={{ overflow: 'visible' }}>
            <SearchBar scope="tourism" intentEnabled={false} enabled />
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <MeilleursSection
          secteurLabel={
            language === 'fr' ? 'tourisme' :
            language === 'ar' ? 'سياحة' :
            language === 'en' ? 'tourism' :
            'turismo'
          }
          listePage="tourisme local & expatriation"
          accentColor="#4A0404"
          sectionTitle={
            language === 'fr' ? 'Entreprises les plus recommandées par les clients' :
            language === 'ar' ? 'المؤسسات الأكثر توصية من قبل العملاء' :
            language === 'en' ? 'Most recommended businesses by customers' :
            'Aziende più raccomandate dai clienti'
          }
          blogArticle={{
            title:
              language === 'fr' ? 'Guide du tourisme en Tunisie' :
              language === 'ar' ? 'دليل السياحة في تونس' :
              language === 'en' ? 'Tourism guide in Tunisia' :
              'Guida al turismo in Tunisia',
            excerpt:
              language === 'fr' ? 'Découvrez les meilleurs sites, hébergements et activités pour un séjour inoubliable en Tunisie.' :
              language === 'ar' ? 'اكتشف أفضل المواقع والإقامات والأنشطة لإقامة لا تُنسى في تونس.' :
              language === 'en' ? 'Discover the best sites, accommodations and activities for an unforgettable stay in Tunisia.' :
              'Scopri i migliori siti, alloggi e attività per un soggiorno indimenticabile in Tunisia.',
            slug: "guide-tourisme-tunisie"
          }}
        />
      </div>
    </div>
  );
}
