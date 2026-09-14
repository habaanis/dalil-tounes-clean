import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Search, MapPin, ArrowRight, AlertCircle } from 'lucide-react';
import { SEOHead } from '../../components/SEOHead';
import SearchBar from '../../components/SearchBar';
import Breadcrumb from '../../components/seo/Breadcrumb';
import SeoBusinessCard from '../../components/seo/SeoBusinessCard';
import LoadMoreButton from '../../components/seo/LoadMoreButton';
import SeoFAQ from '../../components/seo/SeoFAQ';
import StructuredData from '../../components/StructuredData';
import { generateBreadcrumbSchema, generateFAQSchema } from '../../lib/structuredDataSchemas';
import {
  findGouvernoratBySlug,
  getVillesByGouvernorat,
  SEO_GOUVERNORATS,
  SEO_SECTEURS,
  SEO_METIERS,
  getGouvernoratLabel,
  getVilleLabel,
  getMetierLabel,
  getSecteurLabel,
} from '../../lib/seoLandingData';
import { usePaginatedSeoGouvernorat } from '../../hooks/usePaginatedSeoGouvernorat';
import { getGouvernoratSeoMeta } from '../../lib/seoMetaTemplates';
import { useLanguage } from '../../context/LanguageContext';
import { useRTL } from '../../lib/useRTL';
import { getSeoPageTranslations } from '../../lib/seoPageTranslations';

const GouvernoratPage: React.FC = () => {
  const { gouvernoratSlug } = useParams<{ gouvernoratSlug: string }>();
  const gouvernorat = gouvernoratSlug ? findGouvernoratBySlug(gouvernoratSlug) : undefined;
  const { language } = useLanguage();
  const { isRTL } = useRTL();
  const t = getSeoPageTranslations(language);

  const { businesses, total, loading, loadingMore, hasMore, loadMore } =
    usePaginatedSeoGouvernorat(gouvernorat?.slug, 20);

  if (!gouvernorat) {
    return <Navigate to="/" replace />;
  }

  const gouvLabel = getGouvernoratLabel(gouvernorat, language);
  const villes = getVillesByGouvernorat(gouvernorat.slug);
  const otherGouvernorats = SEO_GOUVERNORATS.filter(g => g.slug !== gouvernorat.slug).slice(0, 10);
  const popularMetiers = SEO_METIERS.filter(m =>
    ['medecin-generaliste', 'dentiste', 'avocat', 'restaurant', 'coiffeur', 'pharmacie', 'garage', 'plombier', 'electricien', 'hotel', 'architecte', 'notaire'].includes(m.slug)
  );
  const popularSecteurs = SEO_SECTEURS.slice(0, 8);

  const seo = getGouvernoratSeoMeta(gouvernorat.label, gouvernorat.slug, gouvernorat.description, gouvernorat.keywords);
  const pageTitle = seo.title;
  const pageDescription = seo.description;
  const pageKeywords = seo.keywords;

  const faqData = [
    {
      question: t.faqWhatBusinessesGovernorate(gouvLabel),
      answer: t.faqWhatBusinessesGovernorateAnswer(gouvLabel),
    },
    {
      question: t.faqFindGovernorateProfessional(gouvLabel),
      answer: t.faqFindGovernorateProfessionalAnswer(gouvLabel, villes.length > 0 ? villes.slice(0, 3).map(v => getVilleLabel(v, language)).join(', ') : ''),
    },
    {
      question: t.faqHowManyCitiesGovernorate(gouvLabel),
      answer: t.faqHowManyCitiesGovernorateAnswer(villes.length, gouvLabel, villes.length > 0 ? villes.map(v => getVilleLabel(v, language)).join(', ') : ''),
    },
  ];

  const breadcrumbItems = [
    { name: 'Accueil', url: '/' },
    { name: 'Entreprises', url: '/entreprises' },
    { name: `Gouvernorat de ${gouvernorat.label}`, url: `/gouvernorat/${gouvernorat.slug}` },
  ];
  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbItems);

  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: pageTitle,
    description: pageDescription,
    url: `https://dalil-tounes.com/gouvernorat/${gouvernorat.slug}`,
    about: {
      '@type': 'AdministrativeArea',
      name: `Gouvernorat de ${gouvernorat.label}`,
      containedInPlace: { '@type': 'Country', name: 'Tunisie' },
    },
  };

  const faqSchema = generateFAQSchema(faqData);

  const ArrowIcon = ArrowRight;

  return (
    <>
      <SEOHead
        title={pageTitle}
        description={pageDescription}
        keywords={pageKeywords}
        canonical={`https://dalil-tounes.com/gouvernorat/${gouvernorat.slug}`}
        currentPath={`/gouvernorat/${gouvernorat.slug}`}
      />

      <StructuredData data={[schemaData, breadcrumbSchema, faqSchema]} />

      <div className="min-h-screen bg-[#0f0f0f]" dir={isRTL ? 'rtl' : 'ltr'}>
        {/* Hero */}
        <div
          className="relative py-16 px-4 overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #111111 0%, #0d1318 50%, #111111 100%)',
          }}
        >
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage:
                'radial-gradient(circle at 50% 50%, #D4AF37 0%, transparent 60%)',
            }}
          />
          <div className="container mx-auto max-w-5xl relative">
            <Breadcrumb
              items={[
                { label: t.breadcrumbHome, href: '/' },
                { label: t.breadcrumbBusinesses, href: '/entreprises' },
                { label: t.breadcrumbGovernorate(gouvLabel) },
              ]}
            />

            <div className="flex items-center gap-3 mb-4">
              <span className={`inline-block px-3 py-1 rounded-full border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-medium ${isRTL ? '' : 'tracking-widest uppercase'}`}>
                {t.badgeGovernorate}
              </span>
              <span className="flex items-center gap-1 text-sm text-gray-500">
                <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                {t.tunisia}
              </span>
            </div>

            <h1
              className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight"
              style={{
                fontFamily: "'Playfair Display', 'Cormorant Garamond', serif",
              }}
            >
              {t.businessesInGovernorate('')}{' '}
              <span className="text-[#D4AF37]">{gouvLabel}</span>
            </h1>

            <p className="text-gray-400 text-base md:text-lg max-w-2xl leading-relaxed">
              {pageDescription}
            </p>

            <div className="flex flex-wrap gap-4 mt-6">
              {!loading && (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Search className="w-4 h-4 text-[#D4AF37]" />
                  <span>
                    {t.businessCount(total)}
                  </span>
                </div>
              )}
              {villes.length > 0 && (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <MapPin className="w-4 h-4 text-[#D4AF37]" />
                  <span>
                    {t.cityCount(villes.length)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto max-w-5xl px-4 py-8">
          {/* Search */}
          <div className="mb-8 bg-[#1a1a1a] rounded-xl p-4 border border-[#D4AF37]/30">
            <SearchBar scope="global" />
          </div>

          {/* Villes */}
          {villes.length > 0 && (
            <div className="mb-10">
              <h2
                className={`text-xs font-semibold text-gray-400 mb-4 uppercase tracking-wider`}
                style={{ letterSpacing: isRTL ? '0' : '0.1em' }}
              >
                {t.citiesInGovernorate(gouvLabel)}
              </h2>
              <div className="flex flex-wrap gap-2">
                {villes.map(v => (
                  <Link
                    key={v.slug}
                    to={`/ville/${v.slug}`}
                    className="px-4 py-2 rounded-full border border-gray-700 hover:border-[#D4AF37]/60 text-gray-400 hover:text-[#D4AF37] text-sm transition-all duration-200"
                  >
                    {getVilleLabel(v, language)}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Metiers populaires */}
          <div className="mb-10">
            <h2
              className={`text-xs font-semibold text-gray-400 mb-4 uppercase tracking-wider`}
              style={{ letterSpacing: isRTL ? '0' : '0.1em' }}
            >
              {t.popularTrades}
            </h2>
            <div className="flex flex-wrap gap-2">
              {popularMetiers.map(m => {
                const firstVille = villes[0];
                const href = firstVille
                  ? `/${m.slug}-${firstVille.slug}`
                  : `/metier/${m.slug}`;
                return (
                  <Link
                    key={m.slug}
                    to={href}
                    className="px-4 py-2 rounded-full border border-gray-700 hover:border-[#D4AF37]/60 text-gray-400 hover:text-[#D4AF37] text-sm transition-all duration-200"
                  >
                    {getMetierLabel(m, language)}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="w-full h-px bg-gray-800 mb-10" />

          {/* Businesses */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-[#1a1a1a] rounded-xl p-5 animate-pulse">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-gray-800 rounded-lg" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-800 rounded w-3/4" />
                      <div className="h-3 bg-gray-800 rounded w-1/2" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : businesses.length > 0 ? (
            <>
              <div className="flex items-center justify-between mb-6">
                <h2
                  className="text-xl font-semibold text-white"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {t.resultsCount(total)}
                </h2>
                <Link
                  to={`/entreprises?gouvernorat=${encodeURIComponent(gouvernorat.label)}`}
                  className="flex items-center gap-1 text-sm text-[#D4AF37] hover:underline"
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

              <p className="text-center text-[11px] text-gray-500 mt-6 leading-relaxed">
                {t.disclaimer}{' '}
                <Link
                  to="/info-avis"
                  className="text-[#D4AF37] hover:underline"
                >
                  {t.learnMore}
                </Link>
              </p>
            </>
          ) : (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-800 mb-6">
                <AlertCircle className="w-8 h-8 text-gray-600" />
              </div>
              <h2 className="text-xl font-semibold text-white mb-3">
                {t.noResultsGovernorate(gouvLabel)}
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

          {/* Secteurs populaires */}
          <div className="mt-16 pt-10 border-t border-gray-800">
            <h2
              className="text-lg font-semibold text-white mb-4"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {t.badgeSector === 'Secteur' ? 'Secteurs populaires' : t.popularTrades}
            </h2>
            <div className="flex flex-wrap gap-2">
              {popularSecteurs.map(s => (
                <Link
                  key={s.slug}
                  to={`/secteur/${s.slug}`}
                  className="px-3 py-1.5 rounded-full border border-gray-700 hover:border-[#D4AF37]/50 text-gray-400 hover:text-[#D4AF37] text-xs transition-all"
                >
                  {getSecteurLabel(s, language)}
                </Link>
              ))}
            </div>
          </div>

          {/* Autres gouvernorats */}
          <div className="mt-10 pt-8 border-t border-gray-800">
            <h2
              className="text-lg font-semibold text-white mb-4"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {t.otherGovernorates}
            </h2>
            <div className="flex flex-wrap gap-2">
              {otherGouvernorats.map(g => (
                <Link
                  key={g.slug}
                  to={`/gouvernorat/${g.slug}`}
                  className="px-3 py-1.5 rounded-full border border-gray-700 hover:border-[#D4AF37]/50 text-gray-400 hover:text-[#D4AF37] text-xs transition-all"
                >
                  {getGouvernoratLabel(g, language)}
                </Link>
              ))}
            </div>
          </div>

          {/* FAQ */}
          <SeoFAQ
            title={t.faqTitleGovernorate(gouvLabel)}
            questions={faqData}
            includeSchema={false}
          />
        </div>
      </div>
    </>
  );
};

export default GouvernoratPage;
