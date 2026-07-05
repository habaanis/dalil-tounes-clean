import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Search, ArrowRight, AlertCircle } from 'lucide-react';
import { SEOHead } from '../../components/SEOHead';
import SearchBar from '../../components/SearchBar';
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
} from '../../lib/seoLandingData';
import { usePaginatedSeoSecteur } from '../../hooks/usePaginatedSeoSecteur';
import { getSecteurSeoMeta } from '../../lib/seoMetaTemplates';

const SecteurPage: React.FC = () => {
  const { secteurSlug } = useParams<{ secteurSlug: string }>();
  const secteur = secteurSlug ? findSecteurBySlug(secteurSlug) : undefined;

  const { businesses, total, loading, loadingMore, hasMore, loadMore } =
    usePaginatedSeoSecteur(secteur?.slug, 20);

  if (!secteur) {
    return <Navigate to="/" replace />;
  }

  const metiers = getMetiersBySecteur(secteur.slug);
  const popularVilles = SEO_VILLES.slice(0, 12);
  const otherSecteurs = SEO_SECTEURS.filter(s => s.slug !== secteur.slug).slice(0, 10);

  const seo = getSecteurSeoMeta(secteur.label, secteur.slug, secteur.description, secteur.keywords);
  const pageTitle = seo.title;
  const pageDescription = seo.description;
  const pageKeywords = seo.keywords;

  const faqData = [
    {
      question: `Comment trouver un professionnel du secteur ${secteur.label} en Tunisie ?`,
      answer: `Utilisez la barre de recherche Dalil Tounes ou parcourez les métiers du secteur ${secteur.label} ci-dessous. Vous pouvez également filtrer par ville pour trouver un professionnel proche de chez vous.`,
    },
    {
      question: `Quels métiers sont disponibles dans le secteur ${secteur.label} ?`,
      answer: `Dalil Tounes référence ${metiers.length} métiers dans le secteur ${secteur.label}, dont ${metiers.slice(0, 4).map(m => m.label).join(', ')}${metiers.length > 4 ? ' et bien d\'autres' : ''}.`,
    },
    {
      question: `Les entreprises du secteur ${secteur.label} sont-elles vérifiées ?`,
      answer: `Les données proviennent de sources publiques ou sont communiquées par les professionnels. Les notes affichées sont basées sur les avis Google publics. Dalil Tounes n'attribue aucune note et n'effectue aucun classement éditorial.`,
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

      <div className="min-h-screen bg-[#0f0f0f]">
        {/* Hero */}
        <div
          className="relative py-16 px-4 overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #111111 0%, #1a1008 50%, #111111 100%)',
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
                { label: 'Accueil', href: '/' },
                { label: 'Entreprises', href: '/entreprises' },
                { label: secteur.label },
              ]}
            />

            <span className="inline-block mb-4 px-3 py-1 rounded-full border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-medium tracking-widest uppercase">
              Secteur
            </span>

            <h1
              className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight"
              style={{
                fontFamily: "'Playfair Display', 'Cormorant Garamond', serif",
              }}
            >
              <span className="text-[#D4AF37]">{secteur.label}</span> en Tunisie
            </h1>

            <p className="text-gray-400 text-base md:text-lg max-w-2xl leading-relaxed">
              {pageDescription}
            </p>

            <div className="flex flex-wrap gap-3 mt-6">
              {!loading && (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Search className="w-4 h-4 text-[#D4AF37]" />
                  <span>
                    {total} entreprise{total !== 1 ? 's' : ''} dans ce secteur
                  </span>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span className="text-[#D4AF37]">{metiers.length}</span>
                <span>
                  métier{metiers.length !== 1 ? 's' : ''} référencé
                  {metiers.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto max-w-5xl px-4 py-8">
          {/* Search */}
          <div className="mb-8 bg-[#1a1a1a] rounded-xl p-4 border border-[#D4AF37]/30">
            <SearchBar scope="global" />
          </div>

          {/* Metiers grid */}
          {metiers.length > 0 && (
            <div className="mb-10">
              <h2
                className="text-xs font-semibold text-gray-400 mb-4 uppercase tracking-wider"
                style={{ letterSpacing: '0.1em' }}
              >
                Métiers du secteur {secteur.label}
              </h2>
              <div className="flex flex-wrap gap-2">
                {metiers.map(m => (
                  <Link
                    key={m.slug}
                    to={`/metier/${m.slug}`}
                    className="px-4 py-2 rounded-full border border-gray-700 hover:border-[#D4AF37]/60 text-gray-400 hover:text-[#D4AF37] text-sm transition-all duration-200"
                  >
                    {m.label}
                  </Link>
                ))}
              </div>
            </div>
          )}

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
                  {total} résultat{total !== 1 ? 's' : ''}
                </h2>
                <Link
                  to="/entreprises"
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
                Les résultats affichés reposent sur des critères automatisés (avis
                publics, notes Google, complétude de la fiche).{' '}
                <Link
                  to="/info-avis"
                  className="text-[#D4AF37] hover:underline"
                >
                  En savoir plus
                </Link>
              </p>
            </>
          ) : (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-800 mb-6">
                <AlertCircle className="w-8 h-8 text-gray-600" />
              </div>
              <h2 className="text-xl font-semibold text-white mb-3">
                Aucune entreprise dans le secteur {secteur.label} pour l'instant
              </h2>
              <p className="text-gray-500 text-sm mb-8">
                Référencez votre établissement gratuitement dès maintenant.
              </p>
              <Link
                to="/abonnement"
                className="inline-block px-8 py-3 bg-[#D4AF37] text-black text-sm font-semibold rounded-lg hover:bg-[#c9a42e] transition-all"
              >
                Inscrire mon établissement
              </Link>
            </div>
          )}

          {/* Villes populaires */}
          <div className="mt-16 pt-10 border-t border-gray-800">
            <h2
              className="text-lg font-semibold text-white mb-4"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {secteur.label} par ville
            </h2>
            <div className="flex flex-wrap gap-2">
              {popularVilles.map(v => {
                const firstMetier = metiers[0];
                return firstMetier ? (
                  <Link
                    key={v.slug}
                    to={`/${firstMetier.slug}-${v.slug}`}
                    className="px-3 py-1.5 rounded-full border border-gray-700 hover:border-[#D4AF37]/50 text-gray-400 hover:text-[#D4AF37] text-xs transition-all"
                  >
                    {v.label}
                  </Link>
                ) : null;
              })}
            </div>
          </div>

          {/* Autres secteurs */}
          <div className="mt-10 pt-8 border-t border-gray-800">
            <h2
              className="text-lg font-semibold text-white mb-4"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Autres secteurs
            </h2>
            <div className="flex flex-wrap gap-2">
              {otherSecteurs.map(s => (
                <Link
                  key={s.slug}
                  to={`/secteur/${s.slug}`}
                  className="px-3 py-1.5 rounded-full border border-gray-700 hover:border-[#D4AF37]/50 text-gray-400 hover:text-[#D4AF37] text-xs transition-all"
                >
                  {s.label}
                </Link>
              ))}
            </div>
          </div>

          {/* FAQ */}
          <SeoFAQ
            title={`Questions fréquentes - ${secteur.label}`}
            questions={faqData}
            includeSchema={false}
          />
        </div>
      </div>
    </>
  );
};

export default SecteurPage;
