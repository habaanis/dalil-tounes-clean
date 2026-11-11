import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Search, ArrowRight, AlertCircle } from 'lucide-react';
import { SEOHead } from '../../components/SEOHead';
import SearchBar from '../../components/SearchBar';
import Breadcrumb from '../../components/seo/Breadcrumb';
import SeoBusinessCard from '../../components/seo/SeoBusinessCard';
import LoadMoreButton from '../../components/seo/LoadMoreButton';
import { findVilleBySlug, SEO_METIERS, SEO_VILLES, getMetierLabel, getVilleLabel } from '../../lib/seoLandingData';
import { getVilleSeoMeta } from '../../lib/seoMetaTemplates';
import { usePaginatedSeoBusinesses } from '../../hooks/usePaginatedSeoBusinesses';
import StructuredData from '../../components/StructuredData';
import { generateBreadcrumbSchema } from '../../lib/structuredDataSchemas';
import SeoFAQ from '../../components/seo/SeoFAQ';
import TopRecommendedSection from '../../components/seo/TopRecommendedSection';
import { useLanguage } from '../../context/LanguageContext';
import { useRTL } from '../../lib/useRTL';
import { getSeoPageTranslations } from '../../lib/seoPageTranslations';

const VillePage: React.FC = () => {
  const { villeSlug } = useParams<{ villeSlug: string }>();
  const ville = villeSlug ? findVilleBySlug(villeSlug) : undefined;
  const { language } = useLanguage();
  const { isRTL } = useRTL();
  const t = getSeoPageTranslations(language);

  const { businesses, total, loading, loadingMore, hasMore, loadMore } = usePaginatedSeoBusinesses(
    { city: ville?.label, pageSize: 20 },
    [villeSlug]
  );

  if (!ville) {
    return <Navigate to="/" replace />;
  }

  const villeLabel = getVilleLabel(ville, language);

  const seo = getVilleSeoMeta(ville.label, ville.slug);
  const pageTitle = seo.title;
  const pageDescription = seo.description;
  const pageKeywords = seo.keywords;

  const faqData = [
    { question: t.faqHowToFindProfessionalCity(villeLabel), answer: t.faqHowToFindProfessionalCityAnswer(villeLabel) },
    { question: t.faqWhatBusinessesCity(villeLabel), answer: t.faqWhatBusinessesCityAnswer(villeLabel) },
    { question: t.faqReliableCity(villeLabel), answer: t.faqReliableCityAnswer },
  ];

  const otherVilles = SEO_VILLES.filter(v => v.slug !== ville.slug).slice(0, 12);

  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: pageTitle,
    description: pageDescription,
    url: `https://dalil-tounes.com/ville/${ville.slug}`,
    about: {
      '@type': 'City',
      name: ville.label,
      containedInPlace: {
        '@type': 'State',
        name: ville.gouvernorat,
        containedInPlace: { '@type': 'Country', name: 'Tunisie' },
      },
    },
  };

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Accueil', url: '/' },
    { name: 'Entreprises', url: '/entreprises' },
    { name: ville.label, url: `/ville/${ville.slug}` },
  ]);

  const popularMetiers = SEO_METIERS.filter(m =>
    ['medecin', 'dentiste', 'avocat', 'restaurant', 'coiffeur', 'pharmacie', 'garage', 'hotel', 'notaire', 'expert-comptable', 'architecte', 'plombier'].includes(m.slug)
  );

  const ArrowIcon = isRTL ? ArrowRight : ArrowRight;

  return (
    <>
      <SEOHead
        title={pageTitle}
        description={pageDescription}
        keywords={pageKeywords}
        canonical={`https://dalil-tounes.com/ville/${ville.slug}`}
        currentPath={`/ville/${ville.slug}`}
      />

      <StructuredData data={[schemaData, breadcrumbSchema]} />

      <div className="public-surface min-h-screen bg-[#fcfaf5]" dir={isRTL ? 'rtl' : 'ltr'}>
        <div
          className="relative py-10 px-4 overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #fcfaf5 0%, #0d1318 50%, #fcfaf5 100%)',
          }}
        >
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: 'radial-gradient(circle at 50% 50%, #D4AF37 0%, transparent 60%)',
            }}
          />
          <div className="public-seo-container mx-auto max-w-5xl relative">
            <Breadcrumb
              items={[
                { label: t.breadcrumbHome, href: '/' },
                { label: t.breadcrumbBusinesses, href: '/entreprises' },
                { label: villeLabel },
              ]}
            />

            <span className={`inline-block mb-4 px-3 py-1 rounded-full border border-[#D4AF37]/40 text-[#806336] text-xs font-medium ${isRTL ? '' : 'tracking-widest uppercase'}`}>
              {ville.gouvernorat}, {t.tunisia}
            </span>

            <h1
              className="public-title text-3xl md:text-5xl font-medium text-[#35172f] mb-4 leading-tight"
              style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', serif" }}
            >
              {t.platform('')}{' '}
              <span className="text-[#806336]">{villeLabel}</span>
            </h1>

            <p className="text-[#6c6068] text-base md:text-lg max-w-2xl leading-relaxed">
              {pageDescription}
            </p>

            {!loading && (
              <div className="flex items-center gap-2 mt-6 text-sm text-gray-500">
                <Search className="w-4 h-4 text-[#806336]" />
                <span>{t.establishmentCountFound(total)}</span>
              </div>
            )}
          </div>
        </div>

        <div className="public-seo-container mx-auto max-w-5xl px-4 py-8">
          <div className="mb-8 bg-[#fffdf9] rounded-xl p-4 border border-[#D4AF37]/30">
            <SearchBar scope="global" />
          </div>

          <TopRecommendedSection city={ville.label} contextLabel={villeLabel} sectionId={ville.slug} />

          <div className="mb-10">
            <h2 className={`public-heading text-xs font-semibold text-[#6c6068] mb-4 uppercase tracking-wider ${isRTL ? '' : 'uppercase'}`} style={{ letterSpacing: isRTL ? '0' : '0.1em' }}>
              {t.searchByTrade} {villeLabel}
            </h2>
            <div className="flex flex-wrap gap-2">
              {popularMetiers.map(metier => (
                <Link
                  key={metier.slug}
                  to={`/${metier.slug}-${ville.slug}`}
                  className="px-4 py-2 rounded-full border border-[#d9c9a4] hover:border-[#D4AF37]/60 text-[#6c6068] hover:text-[#806336] text-sm transition-all duration-200"
                >
                  {getMetierLabel(metier, language)}
                </Link>
              ))}
            </div>
          </div>



          <div className="w-full h-px bg-[#eee7d8] mb-10" />

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-[#fffdf9] rounded-xl p-5 animate-pulse">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-[#eee7d8] rounded-lg" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-[#eee7d8] rounded w-3/4" />
                      <div className="h-3 bg-[#eee7d8] rounded w-1/2" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : businesses.length > 0 ? (
            <>
              <div className="flex items-center justify-between mb-6">
                <h2
                  className="public-heading text-xl font-semibold text-[#35172f]"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {t.resultsCount(total)}
                </h2>
                <Link
                  to={`/entreprises?gouvernorat=${encodeURIComponent(ville.gouvernorat)}`}
                  className="flex items-center gap-1 text-sm text-[#806336] hover:underline"
                >
                  {t.allProfessionals}
                  <ArrowIcon className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {businesses.map(b => (
                  <SeoBusinessCard key={b.id} business={b} />
                ))}
              </div>

              {hasMore && (
                <LoadMoreButton
                  onClick={loadMore}
                  loading={loadingMore}
                  shown={businesses.length}
                  total={total}
                />
              )}
            </>
          ) : (
            <div className="text-center py-10">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#eee7d8] mb-6">
                <AlertCircle className="w-8 h-8 text-gray-600" />
              </div>
              <h2 className="public-heading text-xl font-semibold text-[#35172f] mb-3">
                {t.noResultsCity(villeLabel)}
              </h2>
              <p className="text-gray-500 text-sm mb-8">
                {t.registerEstablishmentFree}
              </p>
              <Link
                to="/abonnement"
                className="inline-block px-8 py-3 bg-[#D4AF37] text-black text-sm font-semibold rounded-lg hover:bg-[#c9a42e] transition-all"
              >
                {t.registerEstablishment}
              </Link>
            </div>
          )}
          {businesses.length > 0 && (
            <p className="text-center text-[11px] text-gray-500 mt-6 leading-relaxed">
              {t.disclaimer}{' '}
              <Link to="/info-avis" className="text-[#806336] hover:underline">{t.learnMore}</Link>
            </p>
          )}

          <div className="mt-16 pt-10 border-t border-[#e6dcc5]">
            <h2
              className="public-heading text-lg font-semibold text-[#35172f] mb-4"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {t.otherCities}
            </h2>
            <div className="flex flex-wrap gap-2">
              {otherVilles.map(v => (
                <Link
                  key={v.slug}
                  to={`/ville/${v.slug}`}
                  className="px-3 py-1.5 rounded-full border border-[#d9c9a4] hover:border-[#D4AF37]/50 text-[#6c6068] hover:text-[#806336] text-xs transition-all"
                >
                  {getVilleLabel(v, language)}
                </Link>
              ))}
            </div>
          </div>

          <SeoFAQ title={t.faqTitle(villeLabel)} questions={faqData} />
        </div>
      </div>
    </>
  );
};

export default VillePage;
