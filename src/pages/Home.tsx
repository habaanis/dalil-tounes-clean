import { useLanguage } from '../context/LanguageContext';
import { useTranslation } from '../lib/i18n';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Search, Building2, Handshake, ArrowRight } from 'lucide-react';
import CompanyCountCard from '../components/CompanyCountCard';
import { isSearchBarAllowed } from '../config/searchBars';
import { HERO_IMAGE_URL } from '../constants/images';
import StructuredData from '../components/StructuredData';
import { SEOHead } from '../components/SEOHead';
import { getHomeSeoMeta } from '../lib/seoMetaTemplates';
import { generateOrganizationSchema, generateWebSiteSchema } from '../lib/structuredDataSchemas';
import { supabase } from '../lib/BoltDatabase';
import { notifyAdmin } from '../lib/notifyAdmin';
import React, { lazy, Suspense, useEffect, useState } from 'react';
import InstallAppBanner from '../components/InstallAppBanner';

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
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [requestForm, setRequestForm] = useState({
    title: '',
    phone: '',
    email: '',
    message: '',
  });
  const [requestSubmitting, setRequestSubmitting] = useState(false);
  const [requestSuccess, setRequestSuccess] = useState(false);
  const [requestError, setRequestError] = useState<string | null>(null);
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

  // ✅ Bouton demande : ouvre le formulaire simple directement sur la page d'accueil
  const handleSuggestBusiness = () => {
    setShowRequestForm(true);
    setRequestSuccess(false);
    setRequestError(null);
  };

  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRequestSubmitting(true);
    setRequestSuccess(false);
    setRequestError(null);

    try {
      const title = requestForm.title.trim();
      const phone = requestForm.phone.trim();
      const email = requestForm.email.trim();
      const message = requestForm.message.trim();

      if (!title) {
        setRequestError('Le titre de votre demande est obligatoire.');
        setRequestSubmitting(false);
        return;
      }

      if (!phone && !email) {
        setRequestError('Merci d’indiquer au moins un téléphone ou un email.');
        setRequestSubmitting(false);
        return;
      }

      if (email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          setRequestError('Format email invalide.');
          setRequestSubmitting(false);
          return;
        }
      }

      if (!message) {
        setRequestError('Merci de décrire brièvement votre demande.');
        setRequestSubmitting(false);
        return;
      }

      const payload = {
        nom_entreprise: title,
        secteur: 'Demande information / inscription',
        ville: null,
        contact_suggere: `${phone || ''}${phone && email ? ' - ' : ''}${email || ''}`.trim(),
        raison_suggestion: `Demande depuis la page d’accueil\n\n${message}`,
        submission_lang: language,
      };

      const { error } = await supabase
        .from('suggestions_entreprises')
        .insert([payload]);

      if (error) {
        console.error('Erreur Supabase:', error);
        setRequestError('Une erreur est survenue. Veuillez réessayer.');
        return;
      }

      notifyAdmin('Nouvelle demande depuis la page accueil', {
        Titre: title,
        Telephone: phone || 'Non renseigné',
        Email: email || 'Non renseigné',
        Message: message,
        Langue: language,
      });

      setRequestSuccess(true);
      setRequestForm({
        title: '',
        phone: '',
        email: '',
        message: '',
      });

      setTimeout(() => {
        setShowRequestForm(false);
        setRequestSuccess(false);
      }, 1800);
    } catch (error) {
      console.error('Erreur demande accueil:', error);
      setRequestError('Une erreur inattendue est survenue. Veuillez réessayer.');
    } finally {
      setRequestSubmitting(false);
    }
  };

  return (
    <div>
      <SEOHead
        title={getHomeSeoMeta().title}
        description={getHomeSeoMeta().description}
        keywords={getHomeSeoMeta().keywords}
        canonical={getHomeSeoMeta().canonical}
        currentPath="/"
      />
      <StructuredData data={[generateOrganizationSchema(), generateWebSiteSchema()]} />

      {/* 1. Hero — hauteur fixe (aspect-ratio) pour que l'image LCP soit
           immédiatement stable. Aucun repaint déclenché par l'arrivée
           ultérieure des données Supabase. */}
      <section className="py-4 px-4">
        <div className="max-w-3xl mx-auto">
          <div
            className="relative overflow-hidden rounded-3xl border border-[#D4AF37] text-center"
            style={{ aspectRatio: '3 / 1', minHeight: 180 }}
          >
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
            <div className="absolute inset-0 bg-black/30" />

            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6">
              <h1 className="text-2xl md:text-3xl font-light text-white mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                {t.home.connection.title}
              </h1>
              <p className="text-base md:text-lg text-white leading-relaxed italic font-medium" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                {t.home.connection.description}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. À quoi sert Dalil Tounes ? */}
      <section id="section-pourquoi" className="py-3 px-4 bg-white scroll-mt-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-3">
            <h2 className="text-lg md:text-xl font-light text-gray-900 mb-1">
              À quoi sert Dalil Tounes ?
            </h2>
            <p className="mx-auto max-w-3xl text-[11px] md:text-xs leading-relaxed text-gray-600">
              Dalil Tounes est une plateforme numérique qui met en relation les citoyens et les entreprises tunisiennes. Les entreprises y présentent leur activité grâce à une fiche professionnelle complète, tandis que les citoyens peuvent rechercher, comparer et contacter plus facilement les professionnels qui répondent à leurs besoins.
            </p>
            <button
              type="button"
              onClick={() => navigate('/pourquoi-dalil-tounes')}
              className="mt-2 inline-flex items-center text-[11px] font-semibold text-[#4A1D43] transition hover:text-[#D4AF37] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/60 rounded"
            >
              👉 Découvrir à quoi sert Dalil Tounes →
            </button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-2">
            <div className="group bg-white rounded-xl p-3 border border-[#D4AF37] hover:shadow-[0_6px_20px_rgba(74,29,67,0.12)] transition-all duration-300 hover:scale-105">
              <div className="w-8 h-8 bg-transparent rounded-lg flex items-center justify-center mb-2 group-hover:bg-[#D4AF37]/10 transition-colors">
                <Search className="w-3.5 h-3.5 text-[#4A1D43]" />
              </div>
              <h3 className="text-xs font-medium text-gray-900 mb-1">
                Trouver une entreprise
              </h3>
              <p className="text-[11px] text-gray-600 leading-relaxed">
                Trouvez rapidement un artisan, un commerçant ou un professionnel partout en Tunisie.
              </p>
            </div>

            <div className="group bg-white rounded-xl p-3 border border-[#D4AF37] hover:shadow-[0_6px_20px_rgba(74,29,67,0.12)] transition-all duration-300 hover:scale-105">
              <div className="w-8 h-8 bg-transparent rounded-lg flex items-center justify-center mb-2 group-hover:bg-[#D4AF37]/10 transition-colors">
                <Building2 className="w-3.5 h-3.5 text-[#4A1D43]" />
              </div>
              <h3 className="text-xs font-medium text-gray-900 mb-1">
                Développer sa visibilité
              </h3>
              <p className="text-[11px] text-gray-600 leading-relaxed">
                Présentez votre activité grâce à une fiche professionnelle complète.
              </p>
            </div>

            <div className="group bg-white rounded-xl p-3 border border-[#D4AF37] hover:shadow-[0_6px_20px_rgba(74,29,67,0.12)] transition-all duration-300 hover:scale-105">
              <div className="w-8 h-8 bg-transparent rounded-lg flex items-center justify-center mb-2 group-hover:bg-[#D4AF37]/10 transition-colors">
                <Handshake className="w-3.5 h-3.5 text-[#4A1D43]" />
              </div>
              <h3 className="text-xs font-medium text-gray-900 mb-1">
                Mettre en relation
              </h3>
              <p className="text-[11px] text-gray-600 leading-relaxed">
                Dalil Tounes rapproche les citoyens et les entreprises tunisiennes afin qu'ils puissent se retrouver plus facilement.
              </p>
            </div>

            <div className="group bg-white rounded-xl p-3 border border-[#D4AF37] hover:shadow-[0_6px_20px_rgba(74,29,67,0.12)] transition-all duration-300 hover:scale-105">
              <div className="w-8 h-8 bg-transparent rounded-lg flex items-center justify-center mb-2 group-hover:bg-[#D4AF37]/10 transition-colors">
                <ArrowRight className="w-3.5 h-3.5 text-[#4A1D43]" />
              </div>
              <h3 className="text-xs font-medium text-gray-900 mb-1">
                Découvrir la plateforme
              </h3>
              <p className="text-[11px] text-gray-600 leading-relaxed">
                Découvrez comment fonctionne Dalil Tounes, ses fonctionnalités actuelles et les évolutions à venir.
              </p>
              <button
                type="button"
                onClick={() => navigate('/pourquoi-dalil-tounes')}
                className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-[#4A1D43] transition hover:text-[#D4AF37] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/60 rounded"
              >
                En savoir plus
                <ChevronRight className="w-3 h-3" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Barre de recherche — le SDK Supabase (chunk vendor-supabase)
           ne se charge qu'au premier focus/clic pour ne pas pénaliser le LCP mobile. */}
      <section className="py-2 px-4 relative z-[1000] overflow-visible">
        <div className="max-w-5xl mx-auto relative z-[1001] overflow-visible">
          {isSearchBarAllowed('home') && (
            <div className="bg-white rounded-xl border border-[#D4AF37] p-2.5 md:p-3 relative overflow-visible md:shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
              {searchArmed ? (
                <Suspense fallback={<div style={{ minHeight: '56px' }} />}>
                  <SearchBar scope="global" autoSearch resultMode="redirectToResults" />
                </Suspense>
              ) : (
                <button
                  type="button"
                  onFocus={() => setSearchArmed(true)}
                  onPointerDown={() => setSearchArmed(true)}
                  className="w-full text-left h-12 px-3 rounded-lg bg-gray-50 text-gray-500 text-sm cursor-pointer"
                  aria-label={t.home.suggestBusiness}
                >
                  {(t as any).search?.placeholder || 'Rechercher...'}
                </button>
              )}
            </div>
          )}

         <div className="text-center mt-3">
  <p className="text-xs text-gray-500 mb-2.5">
    Une question, une inscription ou une demande professionnelle ?
  </p>

  <button
    onClick={handleSuggestBusiness}
    className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#4A1D43] text-[#D4AF37] font-bold rounded-xl border border-[#D4AF37] text-sm md:shadow-[0_4px_15px_rgba(212,175,55,0.25)] md:hover:bg-[#5A2D53] md:hover:shadow-[0_6px_25px_rgba(212,175,55,0.4)] md:transition-all md:duration-300 md:hover:scale-105 cursor-pointer"
  >
    Demande d’information / inscription
  </button>
</div>
        </div>
      </section>

      {/* 4. Compteur */}
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

      {/* 6.5 Bannière installation PWA — visible uniquement sur mobile */}
      <section className="py-3 px-4 md:hidden">
        <div className="max-w-5xl mx-auto">
          <InstallAppBanner />
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
      {showRequestForm && (
        <div
          className="fixed inset-0 bg-black/70 z-[99999] flex items-center justify-center p-4"
          onClick={(e) => e.target === e.currentTarget && setShowRequestForm(false)}
        >
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-[#D4AF37]">
            <div className="sticky top-0 bg-white border-b border-[#D4AF37]/40 px-6 py-4 flex items-start justify-between gap-4 rounded-t-2xl">
              <div>
                <h2 className="text-xl font-semibold text-[#4A1D43]">
                  Demande d’information / inscription
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Une question, une inscription ou une demande professionnelle ? Envoyez-nous votre demande, notre équipe vous recontactera rapidement.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowRequestForm(false)}
                className="p-2 rounded-full hover:bg-gray-100 transition"
                aria-label="Fermer le formulaire"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleRequestSubmit} className="p-6 space-y-5">
              {requestSuccess && (
                <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg text-sm">
                  Merci ! Votre demande a été envoyée avec succès. Nous vous recontacterons rapidement.
                </div>
              )}

              {requestError && (
                <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm">
                  {requestError}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Titre de votre demande <span className="text-[#800020]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={requestForm.title}
                  onChange={(e) => setRequestForm({ ...requestForm, title: e.target.value })}
                  placeholder="Ex : inscription entreprise, candidat emploi, chauffeur privé, professeur..."
                  className="w-full px-4 py-3 border border-[#D4AF37] rounded-lg focus:ring-2 focus:ring-[#4A1D43] focus:border-[#4A1D43] text-sm"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    value={requestForm.phone}
                    onChange={(e) => setRequestForm({ ...requestForm, phone: e.target.value })}
                    placeholder="+216 XX XXX XXX"
                    className="w-full px-4 py-3 border border-[#D4AF37] rounded-lg focus:ring-2 focus:ring-[#4A1D43] focus:border-[#4A1D43] text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={requestForm.email}
                    onChange={(e) => setRequestForm({ ...requestForm, email: e.target.value })}
                    placeholder="votre@email.com"
                    className="w-full px-4 py-3 border border-[#D4AF37] rounded-lg focus:ring-2 focus:ring-[#4A1D43] focus:border-[#4A1D43] text-sm"
                  />
                </div>
              </div>

              <p className="text-xs text-gray-500">
                Merci d’indiquer au moins un moyen de contact : téléphone ou email.
              </p>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message <span className="text-[#800020]">*</span>
                </label>
                <textarea
                  required
                  rows={5}
                  value={requestForm.message}
                  onChange={(e) => setRequestForm({ ...requestForm, message: e.target.value })}
                  placeholder="Expliquez brièvement votre demande, votre activité ou votre question..."
                  className="w-full px-4 py-3 border border-[#D4AF37] rounded-lg focus:ring-2 focus:ring-[#4A1D43] focus:border-[#4A1D43] text-sm resize-none"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowRequestForm(false)}
                  className="flex-1 px-5 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all text-sm font-medium"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={requestSubmitting}
                  className="flex-1 px-5 py-3 bg-[#4A1D43] text-[#D4AF37] border border-[#D4AF37] rounded-lg hover:bg-[#5A2D53] transition-all text-sm font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {requestSubmitting ? 'Envoi en cours...' : 'Envoyer ma demande'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
