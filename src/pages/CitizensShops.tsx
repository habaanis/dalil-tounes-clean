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
            {language === 'fr' ? 'Commerces & Magasins' :
             language === 'ar' ? 'المحلات والمتاجر' :
             language === 'en' ? 'Shops & Stores' :
             'Negozi e Commerci'}
          </h1>
          <p className="text-sm md:text-base font-light text-white/95 max-w-3xl leading-relaxed drop-shadow-lg">
            {language === 'fr' ? "Votre guide des commerces de proximité en Tunisie. Trouvez un magasin ouvert maintenant, bénéficiez des promotions et découvrez les produits locaux. Achetez local, soutenez l'économie tunisienne." :
             language === 'ar' ? 'دليلك للتجارة المحلية في تونس. اعثر على متجر مفتوح الآن، استفد من العروض الترويجية واكتشف المنتجات المحلية. اشترِ محليّاً وادعم الاقتصاد التونسي.' :
             language === 'en' ? 'Your guide to local shops in Tunisia. Find an open shop now, take advantage of promotions and discover local products. Buy local, support the Tunisian economy.' :
             'La tua guida ai negozi di prossimità in Tunisia. Trova un negozio aperto ora, approfitta delle promozioni e scopri i prodotti locali. Compra locale, sostieni l\'economia tunisina.'}
          </p>
        </div>
      </section>

      {/* Slogan Marketing Épuré */}
      <section className="py-6 px-4 bg-white">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-lg md:text-xl font-light mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
            <span className="text-[#4A0404]">
              {language === 'fr' ? 'Vous êtes présent, mais êtes-vous trouvable ?' :
               language === 'ar' ? 'أنت موجود، لكن هل يمكن العثور عليك؟' :
               language === 'en' ? 'You are present, but can you be found?' :
               'Sei presente, ma sei trovabile?'}
            </span>
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
            secteurLabel={
              language === 'fr' ? 'commerces' :
              language === 'ar' ? 'محلات' :
              language === 'en' ? 'shops' :
              'commerci'
            }
            listePage="commerce local"
            accentColor="#4A0404"
            sectionTitle={
              language === 'fr' ? 'Meilleurs commerces & magasins' :
              language === 'ar' ? 'أفضل المحلات والمتاجر' :
              language === 'en' ? 'Best shops & stores' :
              'Migliori negozi e commerci'
            }
            blogArticle={{
              title:
                language === 'fr' ? 'Activités à faire en famille en Tunisie' :
                language === 'ar' ? 'أنشطة عائلية في تونس' :
                language === 'en' ? 'Family activities to do in Tunisia' :
                'Attività da fare in famiglia in Tunisia',
              excerpt:
                language === 'fr' ? 'Sorties, sports, culture : découvrez les meilleures activités pour passer de bons moments en famille.' :
                language === 'ar' ? 'نزهات، رياضة، ثقافة: اكتشف أفضل الأنشطة لقضاء أوقات ممتعة مع العائلة.' :
                language === 'en' ? 'Outings, sports, culture: discover the best activities to enjoy quality time with your family.' :
                'Uscite, sport, cultura: scopri le migliori attività per trascorrere bei momenti in famiglia.',
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
                {language === 'fr' ? 'Vous êtes présent, mais êtes-vous trouvable ?' :
                 language === 'ar' ? 'أنت موجود، لكن هل يمكن العثور عليك؟' :
                 language === 'en' ? 'You are present, but can you be found?' :
                 'Sei presente, ma sei trovabile?'}
              </h3>
              <p className="text-sm text-white/90 font-light leading-snug">
                {language === 'fr' ? 'Voyez nos offres • Abonnements VIP & Premium • Augmentez votre visibilité' :
                 language === 'ar' ? 'تصفح عروضنا • اشتراكات VIP وPremium • عزّز ظهورك' :
                 language === 'en' ? 'See our offers • VIP & Premium subscriptions • Boost your visibility' :
                 'Vedi le nostre offerte • Abbonamenti VIP & Premium • Aumenta la tua visibilità'}
              </p>
            </div>
            <button
              onClick={() => {
                onNavigate?.('subscription');
                scrollToWithOffsetDelayed('form-inscription-entreprise', 100, 300);
              }}
              className="flex items-center gap-2 bg-white text-[#4A0404] px-5 py-2.5 rounded-lg font-semibold hover:bg-[#D4AF37] hover:text-white hover:shadow-xl hover:scale-105 transition-all duration-300 whitespace-nowrap shadow-md text-sm"
            >
              {language === 'fr' ? 'Voir nos offres' :
               language === 'ar' ? 'عرض عروضنا' :
               language === 'en' ? 'See our offers' :
               'Vedi le nostre offerte'}
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
