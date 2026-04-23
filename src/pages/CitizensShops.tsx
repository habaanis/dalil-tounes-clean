import { Store, ChevronRight, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { FeaturedBusinessesStrip } from '../components/FeaturedBusinessesStrip';
import { LocalBusinessesSection } from '../components/LocalBusinessesSection';
import { scrollToWithOffsetDelayed } from '../lib/scrollUtils';
import MeilleursSection from '../components/MeilleursSection';
import { useLanguage } from '../context/LanguageContext';

interface CitizensShopsProps {
  onNavigate?: (page: any) => void;
}

export default function CitizensShops({ onNavigate }: CitizensShopsProps = {}) {
  const { language } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Header avec Image de Fond */}
      <section
        className="relative w-full overflow-hidden rounded-b-2xl shadow-md h-[300px] bg-cover"
        style={{
          backgroundImage: `linear-gradient(to top, rgba(74, 29, 67, 0.8), rgba(74, 29, 67, 0.3), transparent), url(/images/cat_magasin.jpg.jpg)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 30%'
        }}
      >


        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4 py-6">
          <h1 className="text-3xl md:text-4xl font-semibold mb-2 drop-shadow-lg text-[#D4AF37]">
            Commerces & Magasins
          </h1>
          <p className="text-sm md:text-base font-light text-white/95 max-w-3xl leading-relaxed drop-shadow-lg">
            Votre guide des commerces de proximité en Tunisie. Trouvez un magasin ouvert maintenant, bénéficiez des promotions
            et découvrez les produits locaux. Achetez local, soutenez l'économie tunisienne.
          </p>
        </div>
      </section>

      {/* Slogan Marketing Épuré */}
      <section className="py-6 px-4 bg-white">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-lg md:text-xl font-light mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
            <span className="text-[#4A0404]">Vous êtes présent, mais êtes-vous trouvable ?</span>
          </p>
          <div className="flex justify-center">
            <div className="w-[40px] h-[1px] bg-[#D4AF37]"></div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-8">


        {/* Commerces Locaux à la Une */}
        <div className="mb-10">
          <LocalBusinessesSection
            onCardClick={(id) => navigate(`/business/${id}`)}
          />
        </div>

        {/* Magasins mis en avant */}
        <div className="mb-10">
          <FeaturedBusinessesStrip
            variant="magasins"
            onCardClick={(id) => navigate(`/business/${id}`)}
          />
        </div>

        {/* Meilleurs commerces + article blog */}
        <div className="py-8">
          <MeilleursSection
            secteurLabel="commerces"
            listePage="commerce local"
            accentColor="#4A0404"
            sectionTitle="Meilleurs commerces & magasins"
            blogArticle={{
              title: "Activités à faire en famille en Tunisie",
              excerpt: "Sorties, sports, culture : découvrez les meilleures activités pour passer de bons moments en famille.",
              slug: "activites-en-famille"
            }}
          />
        </div>

        {/* Business Registration Block - Bottom */}
        <div className="mt-10 relative overflow-hidden rounded-xl border border-[#D4AF37] shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-r from-[#4A0404] via-[#8B0000] to-[#4A0404]/60"></div>
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-3 p-5">
            <div>
              <h3 className="text-lg font-bold text-white mb-1 drop-shadow" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Vous êtes présent, mais êtes-vous trouvable ?
              </h3>
              <p className="text-sm text-white/90 font-light leading-snug">
                Voyez nos offres • Abonnements VIP & Premium • Augmentez votre visibilité
              </p>
            </div>
            <button
              onClick={() => {
                onNavigate?.('subscription');
                scrollToWithOffsetDelayed('form-inscription-entreprise', 100, 300);
              }}
              className="flex items-center gap-2 bg-white text-[#4A0404] px-5 py-2.5 rounded-lg font-semibold hover:bg-[#D4AF37] hover:text-white hover:shadow-xl hover:scale-105 transition-all duration-300 whitespace-nowrap shadow-md text-sm"
            >
              Voir nos offres
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
