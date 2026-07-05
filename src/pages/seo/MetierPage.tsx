import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Search, ArrowRight, AlertCircle } from 'lucide-react';
import { SEOHead } from '../../components/SEOHead';
import SearchBar from '../../components/SearchBar';
import Breadcrumb from '../../components/seo/Breadcrumb';
import SeoBusinessCard from '../../components/seo/SeoBusinessCard';
import LoadMoreButton from '../../components/seo/LoadMoreButton';
import { findMetierBySlug, SEO_VILLES, SEO_METIERS } from '../../lib/seoLandingData';
import { getMetierSeoMeta } from '../../lib/seoMetaTemplates';
import { usePaginatedSeoBusinesses } from '../../hooks/usePaginatedSeoBusinesses';
import StructuredData from '../../components/StructuredData';
import { generateBreadcrumbSchema } from '../../lib/structuredDataSchemas';
import SeoFAQ from '../../components/seo/SeoFAQ';

const MetierPage: React.FC = () => {
  const { metierSlug } = useParams<{ metierSlug: string }>();
  const metier = metierSlug ? findMetierBySlug(metierSlug) : undefined;

  const { businesses, total, loading, loadingMore, hasMore, loadMore } = usePaginatedSeoBusinesses(
    { metier: metier?.value, pageSize: 20 },
    [metierSlug]
  );

  if (!metier) {
    return <Navigate to="/" replace />;
  }

  const seo = getMetierSeoMeta(metier.label, metier.slug, metier.secteur);
  const pageTitle = seo.title;
  const pageDescription = seo.description;
  const pageKeywords = seo.keywords;

  const faqData = [
    { question: `Comment trouver un ${metier.label.toLowerCase()} en Tunisie ?`, answer: `Utilisez la barre de recherche Dalil Tounes ou parcourez la liste ci-dessous. Vous pouvez également filtrer par ville pour trouver un ${metier.label.toLowerCase()} proche de chez vous.` },
    { question: `Les avis sur les ${metier.label.toLowerCase()}s sont-ils fiables ?`, answer: `Les notes affichées proviennent des avis Google publics. Dalil Tounes n'attribue aucune note et n'effectue aucun classement éditorial. Les résultats sont triés selon des critères automatisés : avis, complétude de la fiche et présence de photos.` },
    { question: `Comment inscrire mon cabinet ou établissement de ${metier.label.toLowerCase()} sur Dalil Tounes ?`, answer: `Vous pouvez référencer votre établissement gratuitement sur Dalil Tounes. Rendez-vous sur la page Abonnement pour découvrir les options de mise en avant disponibles.` },
  ];

  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: pageTitle,
    description: pageDescription,
    url: `https://dalil-tounes.com/metier/${metier.slug}`,
  };

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: 'Accueil', url: '/' },
    { name: 'Entreprises', url: '/entreprises' },
    { name: metier.label, url: `/metier/${metier.slug}` },
  ]);

  const popularVilles = SEO_VILLES.slice(0, 12);

  const otherMetiers = SEO_METIERS.filter(m => m.slug !== metier.slug && m.secteur === metier.secteur).slice(0, 10);
  const otherSectorMetiers = otherMetiers.length < 6
    ? SEO_METIERS.filter(m => m.slug !== metier.slug && m.secteur !== metier.secteur).slice(0, 12 - otherMetiers.length)
    : [];

  return (
    <>
      <SEOHead
        title={pageTitle}
        description={pageDescription}
        keywords={pageKeywords}
        canonical={`https://dalil-tounes.com/metier/${metier.slug}`}
        currentPath={`/metier/${metier.slug}`}
      />

      <StructuredData data={[schemaData, breadcrumbSchema]} />

      <div className="min-h-screen bg-[#0f0f0f]">
        <div
          className="relative py-16 px-4 overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #111111 0%, #1a1008 50%, #111111 100%)',
          }}
        >
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: 'radial-gradient(circle at 50% 50%, #D4AF37 0%, transparent 60%)',
            }}
          />
          <div className="container mx-auto max-w-5xl relative">
            <Breadcrumb
              items={[
                { label: 'Accueil', href: '/' },
                { label: 'Entreprises', href: '/entreprises' },
                { label: metier.label },
              ]}
            />

            <span className="inline-block mb-4 px-3 py-1 rounded-full border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-medium tracking-widest uppercase">
              {metier.secteur}
            </span>

            <h1
              className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight"
              style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', serif" }}
            >
              <span className="text-[#D4AF37]">{metier.label}</span> en Tunisie
            </h1>

            <p className="text-gray-400 text-base md:text-lg max-w-2xl leading-relaxed">
              {pageDescription}
            </p>

            {!loading && (
              <div className="flex items-center gap-2 mt-6 text-sm text-gray-500">
                <Search className="w-4 h-4 text-[#D4AF37]" />
                <span>{total} établissement{total !== 1 ? 's' : ''} référencé{total !== 1 ? 's' : ''}</span>
              </div>
            )}
          </div>
        </div>

        <div className="container mx-auto max-w-5xl px-4 py-8">
          <div className="mb-8 bg-[#1a1a1a] rounded-xl p-4 border border-[#D4AF37]/30">
            <SearchBar scope="global" />
          </div>

          <div className="mb-10">
            <h2
              className="text-base font-semibold text-gray-400 mb-4 uppercase tracking-wider text-xs"
              style={{ letterSpacing: '0.1em' }}
            >
              Chercher par ville
            </h2>
            <div className="flex flex-wrap gap-2">
              {popularVilles.map(ville => (
                <Link
                  key={ville.slug}
                  to={`/${metier.slug}-${ville.slug}`}
                  className="px-4 py-2 rounded-full border border-gray-700 hover:border-[#D4AF37]/60 text-gray-400 hover:text-[#D4AF37] text-sm transition-all duration-200"
                >
                  {ville.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="w-full h-px bg-gray-800 mb-10" />

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
                  {total} résultat{total !== 1 ? 's' : ''}
                </h2>
                <Link
                  to={`/entreprises?categorie=${encodeURIComponent(metier.value)}`}
                  className="flex items-center gap-1 text-sm text-[#D4AF37] hover:underline"
                >
                  Annuaire complet
                  <ArrowRight className="w-4 h-4" />
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
                Les résultats affichés reposent sur des critères automatisés (avis publics, notes Google, complétude de la fiche).{' '}
                <Link to="/info-avis" className="text-[#D4AF37] hover:underline">En savoir plus</Link>
              </p>
            </>
          ) : (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-800 mb-6">
                <AlertCircle className="w-8 h-8 text-gray-600" />
              </div>
              <h2 className="text-xl font-semibold text-white mb-3">
                Aucun {metier.label} référencé pour l'instant
              </h2>
              <p className="text-gray-500 text-sm mb-8">
                Soyez le premier à inscrire votre établissement.
              </p>
              <Link
                to="/abonnement"
                className="inline-block px-8 py-3 bg-[#D4AF37] text-black text-sm font-semibold rounded-lg hover:bg-[#c9a42e] transition-all"
              >
                Inscrire mon établissement
              </Link>
            </div>
          )}

          {(otherMetiers.length > 0 || otherSectorMetiers.length > 0) && (
            <div className="mt-16 pt-10 border-t border-gray-800">
              <h2
                className="text-lg font-semibold text-white mb-4"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Métiers associés
              </h2>
              <div className="flex flex-wrap gap-2">
                {[...otherMetiers, ...otherSectorMetiers].map(m => (
                  <Link
                    key={m.slug}
                    to={`/metier/${m.slug}`}
                    className="px-3 py-1.5 rounded-full border border-gray-700 hover:border-[#D4AF37]/50 text-gray-400 hover:text-[#D4AF37] text-xs transition-all"
                  >
                    {m.label}
                  </Link>
                ))}
              </div>
            </div>
          )}

          <SeoFAQ title={`Questions fréquentes - ${metier.label}`} questions={faqData} />
        </div>
      </div>
    </>
  );
};

export default MetierPage;
