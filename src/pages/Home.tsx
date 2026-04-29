import { useLanguage } from '../context/LanguageContext';
import { useTranslation } from '../lib/i18n';
import { useNavigate } from 'react-router-dom';
import { MapPinned, MessageSquare, BarChart3, Smartphone, Navigation, ChevronRight } from 'lucide-react';
import CompanyCountCard from '../components/CompanyCountCard';
import { isSearchBarAllowed } from '../config/searchBars';
import { HERO_IMAGE_URL } from '../constants/images';
import StructuredData from '../components/StructuredData';
import { generateOrganizationSchema, generateWebSiteSchema } from '../lib/structuredDataSchemas';
import React, { lazy, Suspense, useEffect, useState } from 'react';

// Tous les composants lourds (liste Premium, Avis, Témoignages, SearchBar)
// sont chargés paresseusement afin de ne pas bloquer le rendu du Hero / LCP.
const PremiumPartnersSection = lazy(() =>
  import('../components/PremiumPartnersSection').then(m => ({ default: m.PremiumPartnersSection }))
);
const LeisureEventsSection = lazy(() => import('../components/LeisureEventsSection'));
const HomeTestimonials = lazy(() => import('../components/HomeTestimonials'));
const EntrepriseAvisForm = lazy(() => import('../components/EntrepriseAvisForm'));
const SearchBar = lazy(() => import('../components/SearchBar'));

import { useHomeData } from '../hooks/useHomeData';



interface HomeProps {
  onNavigate?: (page: 'home' | 'businesses' | 'citizens' | 'jobs' | 'subscription' | 'candidateList' | 'businessList') => void;
  onSuggestBusiness?: () => void;
  onNavigateToBusiness?: (businessId: string) => void;
  onSearchSubmit?: (keyword: string, city: string) => void;
}

export const Home = ({ onNavigate, onSuggestBusiness, onNavigateToBusiness, onSearchSubmit }: HomeProps = {}) => {
  const { language } = useLanguage();
  const t = useTranslation(language);
  const navigate = useNavigate();
  const { partners, totalCount, certifiedCount, loading } = useHomeData();

  // État pour capturer la valeur de recherche
  const [searchQuery, setSearchQuery] = React.useState('');

  // Tout ce qui est sous la barre de recherche est monté APRÈS le LCP.
  // On déclenche : 2 s après le chargement OU dès que l'utilisateur
  // interagit (scroll / focus / click) — le premier des deux.
  const [belowFoldReady, setBelowFoldReady] = useState(false);
  const [searchArmed, setSearchArmed] = useState(false);
  useEffect(() => {
    if (belowFoldReady) return;
    const ready = () => setBelowFoldReady(true);
    const timer = window.setTimeout(ready, 2000);
    const events: Array<keyof WindowEventMap> = ['scroll', 'pointerdown', 'keydown', 'touchstart'];
    events.forEach((e) => window.addEventListener(e, ready, { once: true, passive: true }));
    return () => {
      window.clearTimeout(timer);
      events.forEach((e) => window.removeEventListener(e, ready));
    };
  }, [belowFoldReady]);

  const handleNavigateToBusinessDetail = (businessId: number | string) => {
    console.log('🔥 [Home] handleNavigateToBusinessDetail appelé');
    console.log('📌 businessId:', businessId);
    console.log('📌 onNavigateToBusiness:', !!onNavigateToBusiness);

    const id = typeof businessId === 'number' ? businessId.toString() : businessId;

    if (onNavigateToBusiness) {
      console.log('✅ Utilisation du callback onNavigateToBusiness');
      onNavigateToBusiness(id);
    } else {
      console.log('✅ Navigation directe vers /business/' + id);
      navigate(`/business/${id}`);
    }
  };

  const handleNavigate = (page: string) => {
    if (onNavigate) {
      onNavigate(page as any);
    } else {
      // Fallback navigation avec React Router
      const pageMap: Record<string, string> = {
        'businesses': '/businesses',
        'citizens': '/citizens',
        'jobs': '/jobs',
        'subscription': '/subscription',
        'candidateList': '/candidates',
        'businessList': '/business-list'
      };
      navigate(pageMap[page] || '/');
    }
  };

  return (
    <div>
      <StructuredData data={[generateOrganizationSchema(), generateWebSiteSchema()]} />

      {/* 1. Hero — aucune animation / filtre au-dessus de la ligne de flottaison
           pour ne pas repousser la mesure du LCP. */}
      <section className="py-4 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl p-6 md:p-8 border border-[#D4AF37] text-center">
            <img
              src={HERO_IMAGE_URL}
              alt="Drapeau de la Tunisie"
              className="absolute inset-0 w-full h-full object-cover"
              width="1200"
              height="400"
              fetchpriority="high"
              loading="eager"
              decoding="async"
            />
            <div className="absolute inset-0 bg-black/30"></div>

            <div className="relative z-10">
              <h1 className="text-2xl md:text-3xl font-light text-white mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                {t.home.connection.title}
              </h1>
              <p className="text-base md:text-lg text-white leading-relaxed italic font-medium" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                {t.home.connection.description}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 1.5 Bouton Concept Premium — compact sur mobile pour ne pas
           repousser le drapeau hors du viewport initial. Aucune animation
           d'apparition ni transform : elles retardent le LCP. */}
      <section className="py-2 px-4 md:py-2.5">
        <div className="max-w-6xl mx-auto flex justify-center">
          <a
            href="#/notre-concept"
            className="inline-flex items-center gap-2 px-4 py-1.5 md:px-6 md:py-2.5 bg-[#4A1D43] rounded-xl border border-[#D4AF37]"
          >
            <span className="text-sm md:text-base font-semibold text-[#D4AF37]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              {t.concept.ctaButton}
            </span>
            <svg className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </section>

      {/* 2. Pourquoi choisir Dalil-Tounes */}
      <section id="section-pourquoi" className="py-3 px-4 bg-white scroll-mt-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-3">
            <h2 className="text-lg md:text-xl font-light text-gray-900 mb-1">
              {t.home.features.title}
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-2">
            <div className="group bg-white rounded-xl p-3 border border-[#D4AF37] hover:shadow-[0_6px_20px_rgba(74,29,67,0.12)] transition-all duration-300 hover:scale-105">
              <div className="w-8 h-8 bg-transparent rounded-lg flex items-center justify-center mb-2 group-hover:bg-[#D4AF37]/10 transition-colors">
                <MapPinned className="w-3.5 h-3.5 text-[#4A1D43]" />
              </div>
              <h3 className="text-xs font-medium text-gray-900 mb-1">
                {t.home.features.localSeo.title}
              </h3>
              <p className="text-[11px] text-gray-600 leading-relaxed">
                {t.home.features.localSeo.description}
              </p>
            </div>

            <div className="group bg-white rounded-xl p-3 border border-[#D4AF37] hover:shadow-[0_6px_20px_rgba(74,29,67,0.12)] transition-all duration-300 hover:scale-105">
              <div className="w-8 h-8 bg-transparent rounded-lg flex items-center justify-center mb-2 group-hover:bg-[#D4AF37]/10 transition-colors">
                <MessageSquare className="w-3.5 h-3.5 text-[#4A1D43]" />
              </div>
              <h3 className="text-xs font-medium text-gray-900 mb-1">
                {t.home.features.reviews.title}
              </h3>
              <p className="text-[11px] text-gray-600 leading-relaxed">
                {t.home.features.reviews.description}
              </p>
            </div>

            <div className="group bg-white rounded-xl p-3 border border-[#D4AF37] hover:shadow-[0_6px_20px_rgba(74,29,67,0.12)] transition-all duration-300 hover:scale-105">
              <div className="w-8 h-8 bg-transparent rounded-lg flex items-center justify-center mb-2 group-hover:bg-[#D4AF37]/10 transition-colors">
                <BarChart3 className="w-3.5 h-3.5 text-[#4A1D43]" />
              </div>
              <h3 className="text-xs font-medium text-gray-900 mb-1">
                {t.home.features.analytics.title}
              </h3>
              <p className="text-[11px] text-gray-600 leading-relaxed">
                {t.home.features.analytics.description}
              </p>
            </div>

            <div className="group bg-white rounded-xl p-3 border border-[#D4AF37] hover:shadow-[0_6px_20px_rgba(74,29,67,0.12)] transition-all duration-300 hover:scale-105">
              <div className="w-8 h-8 bg-transparent rounded-lg flex items-center justify-center mb-2 group-hover:bg-[#D4AF37]/10 transition-colors">
                <Smartphone className="w-3.5 h-3.5 text-[#4A1D43]" />
              </div>
              <h3 className="text-xs font-medium text-gray-900 mb-1">
                {t.home.features.mobileApp.title}
              </h3>
              <p className="text-[11px] text-gray-600 leading-relaxed">
                {t.home.features.mobileApp.description}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Compteur */}
      <section className="px-4 py-2">
        <CompanyCountCard language={language} totalCount={totalCount} certifiedCount={certifiedCount} loading={loading} />
      </section>

      {/* 5. Établissements à la Une — monté seulement après le LCP (interaction ou 2s) */}
      {belowFoldReady && (
        <Suspense fallback={<div style={{ minHeight: '220px' }} />}>
          <PremiumPartnersSection onCardClick={(id) => handleNavigateToBusinessDetail(id)} partners={partners} loading={loading} />
        </Suspense>
      )}

      {/* 5.5 Slogan Marketing */}
      <section className="py-8 px-4 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-light mb-3 text-[#4A0404]" style={{ fontFamily: "'Playfair Display', serif" }}>
            {(t as any).homeExtra?.slogan}
          </h2>
          <div className="flex justify-center">
            <div className="w-[40px] h-[1px] bg-[#D4AF37]"></div>
          </div>
        </div>
      </section>

      {/* 6. Barre de recherche — le SDK Supabase (chunk vendor-supabase)
           ne se charge qu'au premier focus/clic pour ne pas pénaliser le LCP mobile. */}
      <section className="py-2 px-4 relative z-[1000] overflow-visible">
        <div className="max-w-5xl mx-auto relative z-[1001] overflow-visible">
          {isSearchBarAllowed('home') && (
            <div className="bg-white rounded-xl border border-[#D4AF37] p-2.5 md:p-3 relative overflow-visible md:shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
              {searchArmed ? (
                <Suspense fallback={<div style={{ minHeight: '56px' }} />}>
                  <SearchBar scope="global" autoSearch />
                </Suspense>
              ) : (
                <button
                  type="button"
                  onFocus={() => setSearchArmed(true)}
                  onPointerDown={() => setSearchArmed(true)}
                  className="w-full text-left h-12 px-3 rounded-lg bg-gray-50 text-gray-500 text-sm"
                  aria-label={t.home.suggestBusiness}
                >
                  {(t as any).search?.placeholder || 'Rechercher...'}
                </button>
              )}
            </div>
          )}

          <div className="text-center mt-3">
            <p className="text-xs text-gray-500 mb-2.5">
              {(t as any).homeExtra?.suggestInvite}
            </p>
            <button
              onClick={onSuggestBusiness}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#4A1D43] text-[#D4AF37] font-bold rounded-xl border border-[#D4AF37] text-sm md:shadow-[0_4px_15px_rgba(212,175,55,0.25)] md:hover:bg-[#5A2D53] md:hover:shadow-[0_6px_25px_rgba(212,175,55,0.4)] md:transition-all md:duration-300 md:hover:scale-105"
            >
              {t.home.suggestBusiness}
            </button>
          </div>
        </div>
      </section>

      {/* 7. Section Marketing Épurée */}
      <section className="py-6 px-4 bg-white relative z-[1]">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-lg md:text-xl font-light mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
            <span className="text-[#4A0404]">{(t as any).homeExtra?.presentNotFindable}</span>
          </p>

          <div className="flex justify-center">
            <div className="w-[40px] h-[1px] bg-[#D4AF37]"></div>
          </div>
        </div>
      </section>

      {/* 8. Loisirs & Événements — chargé hors du chemin critique LCP */}
      {belowFoldReady && (
        <Suspense fallback={<div className="h-48" />}>
          <LeisureEventsSection />
        </Suspense>
      )}

      {/* Passerelle éditoriale → Blog */}
      <section className="py-8 px-4">
        <div
          className="mx-auto text-center"
          style={{
            maxWidth: '540px',
            borderTop: '1px solid #f0e6d2',
            borderBottom: '1px solid #f0e6d2',
            padding: '0.85rem 1rem',
          }}
        >
          <p style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontSize: '0.9rem', color: '#5a5a5a', lineHeight: '1.7', margin: 0 }}>
            {(t as any).homeExtra?.editorialTitle}
          </p>
          <p style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontSize: '0.85rem', color: '#7a7a7a', lineHeight: '1.7', margin: '0.25rem 0 0' }}>
            {(t as any).homeExtra?.editorialSubtitle}{' '}
            <a
              href="/blog/pourquoi-dalil-tounes-change-la-donne-pour-les-pros-et-les-clients"
              aria-label={(t as any).homeExtra?.editorialAria}
              style={{
                display: 'inline-block',
                textDecoration: 'none',
                transition: 'transform 0.2s ease',
                fontSize: '1rem',
              }}
              onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.25)')}
              onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
            >
              ☕
            </a>
          </p>
        </div>
        {/* SEO – maillage interne footer :
            Ajouter dans le Footer un lien texte :
            <a href="/blog/pourquoi-dalil-tounes-change-la-donne-pour-les-pros-et-les-clients">
              Pourquoi Dalil Tounes change la donne pour les pros et les clients
            </a>
            pour renforcer l'autorité interne de cet article. */}
      </section>

      {/* Témoignages publics — avis_entreprise avec entreprise_id IS NULL */}
      <section className="py-10 px-4 bg-gradient-to-b from-white to-gray-50 relative z-[1]">
        <div className="max-w-6xl mx-auto relative z-[1]">
          <div className="text-center mb-6">
            <h2
              className="text-2xl md:text-3xl font-light text-[#4A1D43] mb-2"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {(t as any).homeExtra?.testimonialsTitle || 'Ils parlent de nous'}
            </h2>
            <div className="flex justify-center">
              <div className="w-[40px] h-[1px] bg-[#D4AF37]" />
            </div>
          </div>
          {belowFoldReady && (
            <Suspense fallback={<div style={{ minHeight: '200px' }} />}>
              <HomeTestimonials />
            </Suspense>
          )}
        </div>
      </section>

      {/* Formulaire d'avis public (avis_entreprise, entreprise_id = null) */}
      <section className="py-6 px-4 bg-[#4A1D43] relative z-[1]">
        <div className="max-w-xl mx-auto relative z-[1]">
          <div className="text-center mb-4">
            <h2
              className="text-xl md:text-2xl font-light text-[#D4AF37] mb-1"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Laissez-nous votre avis
            </h2>
            <p className="text-xs text-gray-300">
              Votre retour nous aide à améliorer Dalil Tounes.
            </p>
          </div>
          {belowFoldReady && (
            <Suspense fallback={<div style={{ minHeight: '180px' }} />}>
              <EntrepriseAvisForm entrepriseId={null} />
            </Suspense>
          )}
        </div>
      </section>
    </div>
  );
};
