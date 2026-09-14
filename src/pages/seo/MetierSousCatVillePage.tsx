import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Search, MapPin, ArrowRight, AlertCircle } from 'lucide-react';
import { SEOHead } from '../../components/SEOHead';
import SearchBar from '../../components/SearchBar';
import Breadcrumb from '../../components/seo/Breadcrumb';
import SeoBusinessCard from '../../components/seo/SeoBusinessCard';
import LoadMoreButton from '../../components/seo/LoadMoreButton';
import { parseSeoSlug, SEO_SOUS_CATEGORIES, SEO_VILLES, getMetierLabel, getVilleLabel, getSousCategorieLabel } from '../../lib/seoLandingData';
import { getMetierSousCatVilleSeoMeta } from '../../lib/seoMetaTemplates';
import { usePaginatedSeoBusinesses } from '../../hooks/usePaginatedSeoBusinesses';
import StructuredData from '../../components/StructuredData';
import { generateBreadcrumbSchema } from '../../lib/structuredDataSchemas';
import SeoFAQ from '../../components/seo/SeoFAQ';
import { useLanguage } from '../../context/LanguageContext';
import { useRTL } from '../../lib/useRTL';
import { getSeoPageTranslations } from '../../lib/seoPageTranslations';

const MetierSousCatVillePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const parsed = slug ? parseSeoSlug(slug) : null;
  const { language } = useLanguage();
  const { isRTL } = useRTL();
  const t = getSeoPageTranslations(language);

  const sousCategorieParsed = parsed?.type === 'metier-souscategorie-ville' ? parsed.sousCategorie : null;

  const { businesses, total, loading, loadingMore, hasMore, loadMore } = usePaginatedSeoBusinesses(
    {
      metier: parsed?.metier.value,
      sousCategorie: sousCategorieParsed?.label,
      city: parsed?.ville.label,
      pageSize: 20,
    },
    [slug]
  );

  if (!parsed) {
    return <Navigate to="/" replace />;
  }

  const { metier, ville } = parsed;
  const sousCategorie = sousCategorieParsed;

  const metierLabel = getMetierLabel(metier, language);
  const villeLabel = getVilleLabel(ville, language);
  const sousCatLabel = sousCategorie ? getSousCategorieLabel(sousCategorie, language) : null;

  const seo = getMetierSousCatVilleSeoMeta(metier.label, sousCategorie?.label || null, ville.label, slug!, metier.secteur);
  const pageTitle = seo.title;
  const pageDescription = seo.description;
  const pageKeywords = seo.keywords;

  const sortedBusinesses = businesses;

  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'SearchResultsPage',
    name: pageTitle,
    description: pageDescription,
    url: `https://dalil-tounes.com/${slug}`,
  };

  const breadcrumbItems = [
    { name: 'Accueil', url: '/' },
    { name: 'Entreprises', url: '/entreprises' },
    { name: metier.label, url: `/metier/${metier.slug}` },
    ...(sousCategorie
      ? [{ name: `${sousCategorie.label} ${ville.label}`, url: `/${slug}` }]
      : [{ name: ville.label, url: `/${slug}` }]),
  ];
  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbItems);

  const faqData = sousCategorie
    ? [
        { question: t.faqFindTradeSubcatCity(metier.label, sousCategorie.label, ville.label), answer: t.faqFindTradeSubcatCityAnswer(metier.label, sousCategorie.label, ville.label) },
        { question: t.faqTradeSubcatVerified(metier.label, sousCategorie.label, ville.label), answer: t.faqTradeSubcatVerifiedAnswer },
      ]
    : [
        { question: t.faqHowToFindTradeCity(metier.label, ville.label), answer: t.faqHowToFindTradeCityAnswer },
        { question: t.faqHowManyTradeCity(metier.label, ville.label), answer: t.faqHowManyTradeCityAnswer(metier.label, ville.label, ville.gouvernorat) },
      ];

  const sousCats = SEO_SOUS_CATEGORIES[metier.slug] ?? [];

  const otherVilles = SEO_VILLES.filter(v => v.slug !== ville.slug).slice(0, 8);

  const ArrowIcon = ArrowRight;

  return (
    <>
      <SEOHead
        title={pageTitle}
        description={pageDescription}
        keywords={pageKeywords}
        canonical={`https://dalil-tounes.com/${slug}`}
        currentPath={`/${slug}`}
      />

      <StructuredData data={[schemaData, breadcrumbSchema]} />

      <div className="min-h-screen bg-[#0f0f0f]" dir={isRTL ? 'rtl' : 'ltr'}>
        <div
          className="relative py-16 px-4 overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #111111 0%, #1a1008 50%, #111111 100%)',
          }}
        >
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: 'radial-gradient(circle at 30% 50%, #D4AF37 0%, transparent 50%), radial-gradient(circle at 70% 50%, #D4AF37 0%, transparent 50%)',
            }}
          />
          <div className="container mx-auto max-w-5xl relative">
            <Breadcrumb
              items={[
                { label: t.breadcrumbHome, href: '/' },
                { label: t.breadcrumbBusinesses, href: '/entreprises' },
                { label: metierLabel, href: `/${metier.slug}` },
                ...(sousCategorie
                  ? [
                      { label: sousCatLabel || sousCategorie.label, href: `/${metier.slug}-${sousCategorie.slug}-${ville.slug}` },
                      { label: villeLabel },
                    ]
                  : [{ label: villeLabel }]),
              ]}
            />

            <div className="flex items-center gap-3 mb-4">
              <span className={`inline-block px-3 py-1 rounded-full border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-medium ${isRTL ? '' : 'tracking-widest uppercase'}`}>
                {metier.secteur}
              </span>
              {sousCategorie && (
                <span className="inline-block px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-medium">
                  {sousCatLabel || sousCategorie.label}
                </span>
              )}
            </div>

            <h1
              className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight"
              style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', serif" }}
            >
              {metierLabel}
              {sousCategorie && (
                <span className="text-[#D4AF37]"> {sousCatLabel || sousCategorie.label}</span>
              )}{' '}
              {villeLabel.includes(' ') ? '' : ''}<span className={sousCategorie ? 'text-white' : 'text-[#D4AF37]'}>{villeLabel}</span>
            </h1>

            <p className="text-gray-400 text-base md:text-lg max-w-2xl leading-relaxed">
              {pageDescription}
            </p>

            <div className="flex flex-wrap gap-3 mt-8">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <MapPin className="w-4 h-4 text-[#D4AF37]" />
                <span>{t.cityTunisia(villeLabel)}</span>
              </div>
              {!loading && (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Search className="w-4 h-4 text-[#D4AF37]" />
                  <span>
                    {t.establishmentCountFound(total)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="container mx-auto max-w-5xl px-4 py-8">
          <div className="mb-8 bg-[#1a1a1a] rounded-xl p-4 border border-[#D4AF37]/30">
            <SearchBar scope="global" />
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-[#1a1a1a] rounded-xl p-5 animate-pulse">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-gray-800 rounded-lg" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-800 rounded w-3/4" />
                      <div className="h-3 bg-gray-800 rounded w-1/2" />
                      <div className="h-3 bg-gray-800 rounded w-2/3" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : sortedBusinesses.length > 0 ? (
            <>
              <div className="flex items-center justify-between mb-6">
                <h2
                  className="text-xl font-semibold text-white"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {t.resultsCount(total)}
                </h2>
                <Link
                  to={`/entreprises?categorie=${encodeURIComponent(metier.value)}&gouvernorat=${encodeURIComponent(ville.gouvernorat)}`}
                  className="flex items-center gap-1 text-sm text-[#D4AF37] hover:underline"
                >
                  {t.viewAllProfessionals}
                  <ArrowIcon className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sortedBusinesses.map(b => (
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

              <p className="text-center text-[11px] text-gray-500 mt-6 leading-relaxed">
                {t.disclaimer}{' '}
                <Link to="/info-avis" className="text-[#D4AF37] hover:underline">{t.learnMore}</Link>
              </p>
            </>
          ) : (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-800 mb-6">
                <AlertCircle className="w-8 h-8 text-gray-600" />
              </div>
              <h2 className="text-xl font-semibold text-white mb-3">
                {sousCategorie
                  ? t.noResultsTradeSubcat(metierLabel, sousCatLabel || sousCategorie.label, villeLabel)
                  : t.noResultsTradeCity(metierLabel, villeLabel)}
              </h2>
              <p className="text-gray-500 text-sm mb-8 max-w-md mx-auto">
                {sousCategorie
                  ? t.exploreAllProfessionals
                  : t.noEstablishmentReferenced}
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                {sousCategorie && (
                  <Link
                    to={`/${metier.slug}-${ville.slug}`}
                    className="inline-block px-6 py-3 border border-[#D4AF37]/60 text-[#D4AF37] text-sm font-medium rounded-lg hover:bg-[#D4AF37] hover:text-black transition-all"
                  >
                    {t.allTradesInCity(metierLabel, villeLabel)}
                  </Link>
                )}
                <Link
                  to="/entreprises"
                  className="inline-block px-6 py-3 border border-gray-700 text-gray-400 text-sm font-medium rounded-lg hover:border-gray-500 hover:text-white transition-all"
                >
                  {t.viewAllProfessionals}
                </Link>
              </div>
            </div>
          )}

          {sousCats.length > 0 && (
            <div className="mt-12 pt-8 border-t border-gray-800">
              <h2
                className="text-lg font-semibold text-white mb-4"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {t.specializationsAvailable(villeLabel)}
              </h2>
              <div className="flex flex-wrap gap-2">
                {sousCats.map(sc => (
                  <Link
                    key={sc.slug}
                    to={`/${metier.slug}-${sc.slug}-${ville.slug}`}
                    className={`px-3 py-1.5 rounded-full border text-xs transition-all ${
                      sousCategorie?.slug === sc.slug
                        ? 'border-[#D4AF37] bg-[#D4AF37]/10 text-[#D4AF37]'
                        : 'border-gray-700 hover:border-[#D4AF37]/50 text-gray-400 hover:text-[#D4AF37]'
                    }`}
                  >
                    {metierLabel} {getSousCategorieLabel(sc, language)}
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="mt-10 pt-8 border-t border-gray-800">
            <h2
              className="text-lg font-semibold text-white mb-4"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {t.tradeInOtherCities(metierLabel)}
            </h2>
            <div className="flex flex-wrap gap-2">
              {otherVilles.map(v => (
                <Link
                  key={v.slug}
                  to={
                    sousCategorie
                      ? `/${metier.slug}-${sousCategorie.slug}-${v.slug}`
                      : `/${metier.slug}-${v.slug}`
                  }
                  className="px-3 py-1.5 rounded-full border border-gray-700 hover:border-[#D4AF37]/50 text-gray-400 hover:text-[#D4AF37] text-xs transition-all"
                >
                  {t.tradeCity(metierLabel, getVilleLabel(v, language))}
                </Link>
              ))}
            </div>
          </div>

          <SeoFAQ
            title={sousCategorie
              ? t.faqTitleTradeSubcatCity(metier.label, sousCategorie.label, ville.label)
              : t.faqTitleTradeCity(metier.label, ville.label)
            }
            questions={faqData}
          />
        </div>
      </div>
    </>
  );
};

export default MetierSousCatVillePage;
