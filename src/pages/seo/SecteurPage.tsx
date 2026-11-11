import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Search, ArrowRight, AlertCircle } from 'lucide-react';
import { SEOHead } from '../../components/SEOHead';
import SearchBar from '../../components/SearchBar';
import TopRecommendedSection from '../../components/seo/TopRecommendedSection';
import Breadcrumb from '../../components/seo/Breadcrumb';
import SeoBusinessCard from '../../components/seo/SeoBusinessCard';
import LoadMoreButton from '../../components/seo/LoadMoreButton';
import SeoFAQ from '../../components/seo/SeoFAQ';
import StructuredData from '../../components/StructuredData';
import { generateBreadcrumbSchema, generateFAQSchema } from '../../lib/structuredDataSchemas';
import {
  findSecteurBySlug,
  getMetiersBySecteur,
  SEO_SECTEURS,
  SEO_VILLES,
  getSecteurLabel,
  getMetierLabel,
  getVilleLabel,
} from '../../lib/seoLandingData';
import { usePaginatedSeoSecteur } from '../../hooks/usePaginatedSeoSecteur';
import { getSecteurSeoMeta } from '../../lib/seoMetaTemplates';
import { useLanguage } from '../../context/LanguageContext';
import { useRTL } from '../../lib/useRTL';
import { getSeoPageTranslations } from '../../lib/seoPageTranslations';

const SecteurPage: React.FC = () => {
  const { secteurSlug } = useParams<{ secteurSlug: string }>();
  const secteur = secteurSlug ? findSecteurBySlug(secteurSlug) : undefined;
  const { language } = useLanguage();
  const { isRTL } = useRTL();
  const t = getSeoPageTranslations(language);

  const { businesses, total, loading, loadingMore, hasMore, loadMore } =
    usePaginatedSeoSecteur(secteur?.slug, 20);

  if (!secteur) {
    return <Navigate to="/" replace />;
  }

  const secteurLabel = getSecteurLabel(secteur, language);
  const metiers = getMetiersBySecteur(secteur.slug);
  const popularVilles = SEO_VILLES.slice(0, 12);
  const otherSecteurs = SEO_SECTEURS.filter(s => s.slug !== secteur.slug).slice(0, 10);

  const seo = getSecteurSeoMeta(secteur.label, secteur.slug, secteur.description, secteur.keywords);
  const pageTitle = seo.title;
  const pageDescription = seo.description;
  const pageKeywords = seo.keywords;

  const faqData = [
    {
      question: t.faqFindSectorProfessional(secteurLabel),
      answer: t.faqFindSectorProfessionalAnswer(secteurLabel),
    },
    {
      question: t.faqWhatTradesInSector(secteurLabel),
      answer: t.faqWhatTradesInSectorAnswer(metiers.length, metiers.slice(0, 4).map(m => getMetierLabel(m, language)).join(', ')),
    },
    {
      question: t.faqSectorVerified(secteurLabel),
      answer: t.faqSectorVerifiedAnswer,
    },
  ];

  const breadcrumbItems = [
    { name: 'Accueil', url: '/' },
    { name: 'Entreprises', url: '/entreprises' },
    { name: secteur.label, url: `/secteur/${secteur.slug}` },
  ];
  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbItems);

  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: pageTitle,
    description: pageDescription,
    url: `https://dalil-tounes.com/secteur/${secteur.slug}`,
    about: {
      '@type': 'Thing',
      name: secteur.label,
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
        canonical={`https://dalil-tounes.com/secteur/${secteur.slug}`}
        currentPath={`/secteur/${secteur.slug}`}
      />

      <StructuredData data={[schemaData, breadcrumbSchema, faqSchema]} />

      <div className="public-surface min-h-screen bg-[#fcfaf5]" dir={isRTL ? 'rtl' : 'ltr'}>
        {/* Hero */}
        <div
          className="relative py-10 px-4 overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #fcfaf5 0%, #f3eddf 50%, #fcfaf5 100%)',
          }}
        >
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage:
                'radial-gradient(circle at 50% 50%, #D4AF37 0%, transparent 60%)',
            }}
          />
          <div className="public-seo-container mx-auto max-w-5xl relative">
            <Breadcrumb
              items={[
                { label: t.breadcrumbHome, href: '/' },
                { label: t.breadcrumbBusinesses, href: '/entreprises' },
                { label: secteurLabel },
              ]}
            />

            <span className={`inline-block mb-4 px-3 py-1 rounded-full border border-[#D4AF37]/40 text-[#806336] text-xs font-medium ${isRTL ? '' : 'tracking-widest uppercase'}`}>
              {t.badgeSector}
            </span>

            <h1
              className="public-title text-3xl md:text-5xl font-medium text-[#35172f] mb-4 leading-tight"
              style={{
                fontFamily: "'Playfair Display', 'Cormorant Garamond', serif",
              }}
            >
              <span className="text-[#806336]">{secteurLabel}</span> {t.tunisia}
            </h1>

            <p className="text-[#6c6068] text-base md:text-lg max-w-2xl leading-relaxed">
              {pageDescription}
            </p>

            <div className="flex flex-wrap gap-3 mt-6">
              {!loading && (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Search className="w-4 h-4 text-[#806336]" />
                  <span>
                    {t.businessCountInSector(total)}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span className="text-[#806336]">{metiers.length}</span>
                <span>
                  {t.tradeCount(metiers.length)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="public-seo-container mx-auto max-w-5xl px-4 py-8">
          {/* Search */}
          <div className="mb-8 bg-[#fffdf9] rounded-xl p-4 border border-[#D4AF37]/30">
            <SearchBar scope="global" />
          </div>

          <TopRecommendedSection secteurSlug={secteur.slug} contextLabel={secteurLabel} sectionId={secteur.slug} />

          {/* Metiers grid */}
          {metiers.length > 0 && (
            <div className="mb-10">
              <h2
                className={`text-xs font-semibold text-[#6c6068] mb-4 uppercase tracking-wider`}
                style={{ letterSpacing: isRTL ? '0' : '0.1em' }}
              >
                {t.tradesInSector(secteurLabel)}
              </h2>
              <div className="flex flex-wrap gap-2">
                {metiers.map(m => (
                  <Link
                    key={m.slug}
                    to={`/metier/${m.slug}`}
                    className="px-4 py-2 rounded-full border border-[#d9c9a4] hover:border-[#D4AF37]/60 text-[#6c6068] hover:text-[#806336] text-sm transition-all duration-200"
                  >
                    {getMetierLabel(m, language)}
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="w-full h-px bg-[#eee7d8] mb-10" />

          {/* Businesses */}
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
                  to="/entreprises"
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

              <p className="text-center text-[11px] text-gray-500 mt-6 leading-relaxed">
                {t.disclaimer}{' '}
                <Link
                  to="/info-avis"
                  className="text-[#806336] hover:underline"
                >
                  {t.learnMore}
                </Link>
              </p>
            </>
          ) : (
            <div className="text-center py-10">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#eee7d8] mb-6">
                <AlertCircle className="w-8 h-8 text-gray-600" />
              </div>
              <h2 className="public-heading text-xl font-semibold text-[#35172f] mb-3">
                {t.noResultsSector(secteurLabel)}
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

          {/* Villes populaires */}
          <div className="mt-16 pt-10 border-t border-[#e6dcc5]">
            <h2
              className="public-heading text-lg font-semibold text-[#35172f] mb-4"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {t.sectorByCity(secteurLabel)}
            </h2>
            <div className="flex flex-wrap gap-2">
              {popularVilles.map(v => {
                const firstMetier = metiers[0];
                return firstMetier ? (
                  <Link
                    key={v.slug}
                    to={`/${firstMetier.slug}-${v.slug}`}
                    className="px-3 py-1.5 rounded-full border border-[#d9c9a4] hover:border-[#D4AF37]/50 text-[#6c6068] hover:text-[#806336] text-xs transition-all"
                  >
                    {getVilleLabel(v, language)}
                  </Link>
                ) : null;
              })}
            </div>
          </div>

          {/* Autres secteurs */}
          <div className="mt-10 pt-8 border-t border-[#e6dcc5]">
            <h2
              className="public-heading text-lg font-semibold text-[#35172f] mb-4"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {t.otherSectors}
            </h2>
            <div className="flex flex-wrap gap-2">
              {otherSecteurs.map(s => (
                <Link
                  key={s.slug}
                  to={`/secteur/${s.slug}`}
                  className="px-3 py-1.5 rounded-full border border-[#d9c9a4] hover:border-[#D4AF37]/50 text-[#6c6068] hover:text-[#806336] text-xs transition-all"
                >
                  {getSecteurLabel(s, language)}
                </Link>
              ))}
            </div>
          </div>

          {/* FAQ */}
          <SeoFAQ
            title={t.faqTitle(secteurLabel)}
            questions={faqData}
            includeSchema={false}
          />
        </div>
      </div>
    </>
  );
};

export default SecteurPage;
