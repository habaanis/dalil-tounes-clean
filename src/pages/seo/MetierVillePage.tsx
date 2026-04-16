import React, { useEffect, useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Search, MapPin, ArrowRight, AlertCircle } from 'lucide-react';
import { SEOHead } from '../../components/SEOHead';
import Breadcrumb from '../../components/seo/Breadcrumb';
import SeoBusinessCard from '../../components/seo/SeoBusinessCard';
import { parseMetierVilleSlug } from '../../lib/seoLandingData';
import { fetchSeoBusinesses } from '../../lib/seoBusinessQueries';

const MetierVillePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const parsed = slug ? parseMetierVilleSlug(slug) : null;

  useEffect(() => {
    if (!parsed) return;
    setLoading(true);
    fetchSeoBusinesses({
      limit: 30,
      metier: parsed.metier.value,
      city: parsed.ville.label,
    }).then(({ data }) => {
      setBusinesses(data ?? []);
      setLoading(false);
    });
  }, [slug]);

  if (!parsed) {
    return <Navigate to="/" replace />;
  }

  const { metier, ville } = parsed;
  const pageTitle = `Meilleurs ${metier.label} à ${ville.label} - Dalil Tounes`;
  const pageDescription = `Trouvez un ${metier.label} de confiance à ${ville.label} avec avis et coordonnées. Annuaire complet des ${metier.label.toLowerCase()}s en Tunisie.`;
  const pageKeywords = `${metier.label} ${ville.label}, ${metier.label.toLowerCase()} tunisie, trouver ${metier.label.toLowerCase()} ${ville.label}, ${metier.secteur} ${ville.label}`;

  const sortedBusinesses = [...businesses].sort((a, b) => {
    const ratingA = a['Note Google Globale'] ?? 0;
    const ratingB = b['Note Google Globale'] ?? 0;
    return ratingB - ratingA;
  });

  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'SearchResultsPage',
    name: pageTitle,
    description: pageDescription,
    url: `https://dalil-tounes.com/${slug}`,
  };

  return (
    <>
      <SEOHead
        title={pageTitle}
        description={pageDescription}
        keywords={pageKeywords}
        canonical={`https://dalil-tounes.com/${slug}`}
        currentPath={`/${slug}`}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />

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
              backgroundImage: 'radial-gradient(circle at 30% 50%, #D4AF37 0%, transparent 50%), radial-gradient(circle at 70% 50%, #D4AF37 0%, transparent 50%)',
            }}
          />
          <div className="container mx-auto max-w-5xl relative">
            <Breadcrumb
              items={[
                { label: 'Accueil', href: '/' },
                { label: 'Entreprises', href: '/entreprises' },
                { label: metier.label, href: `/${metier.slug}` },
                { label: ville.label },
              ]}
            />

            <div className="flex items-center gap-3 mb-4">
              <span className="inline-block px-3 py-1 rounded-full border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-medium tracking-widest uppercase">
                {metier.secteur}
              </span>
            </div>

            <h1
              className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight"
              style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', serif" }}
            >
              {metier.label} à{' '}
              <span className="text-[#D4AF37]">{ville.label}</span>
            </h1>

            <p className="text-gray-400 text-base md:text-lg max-w-2xl leading-relaxed">
              {pageDescription}
            </p>

            <div className="flex flex-wrap gap-3 mt-8">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <MapPin className="w-4 h-4 text-[#D4AF37]" />
                <span>{ville.label}, Tunisie</span>
              </div>
              {!loading && (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Search className="w-4 h-4 text-[#D4AF37]" />
                  <span>{sortedBusinesses.length} établissement{sortedBusinesses.length !== 1 ? 's' : ''} trouvé{sortedBusinesses.length !== 1 ? 's' : ''}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="container mx-auto max-w-5xl px-4 py-12">
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
                  {sortedBusinesses.length} résultat{sortedBusinesses.length !== 1 ? 's' : ''}
                </h2>
                <Link
                  to={`/entreprises?categorie=${encodeURIComponent(metier.value)}&gouvernorat=${encodeURIComponent(ville.gouvernorat)}`}
                  className="flex items-center gap-1 text-sm text-[#D4AF37] hover:underline"
                >
                  Voir tout l'annuaire
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sortedBusinesses.map(b => (
                  <SeoBusinessCard key={b.id} business={b} />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-800 mb-6">
                <AlertCircle className="w-8 h-8 text-gray-600" />
              </div>
              <h2 className="text-xl font-semibold text-white mb-3">
                Aucun résultat pour {metier.label} à {ville.label}
              </h2>
              <p className="text-gray-500 text-sm mb-8 max-w-md mx-auto">
                Aucun établissement n'a encore été référencé pour cette combinaison. Consultez l'annuaire complet pour plus d'options.
              </p>
              <Link
                to="/entreprises"
                className="inline-block px-8 py-3 border border-[#D4AF37]/60 text-[#D4AF37] text-sm font-medium rounded-lg hover:bg-[#D4AF37] hover:text-black transition-all"
              >
                Voir tout l'annuaire
              </Link>
            </div>
          )}

          <div className="mt-16 pt-10 border-t border-gray-800">
            <h2
              className="text-lg font-semibold text-white mb-6"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Autres recherches populaires
            </h2>
            <div className="flex flex-wrap gap-2">
              {['Tunis', 'Sfax', 'Sousse', 'Nabeul', 'Bizerte', 'Monastir'].map(v => (
                <Link
                  key={v}
                  to={`/${metier.slug}-${v.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-')}`}
                  className="px-3 py-1.5 rounded-full border border-gray-700 hover:border-[#D4AF37]/50 text-gray-400 hover:text-[#D4AF37] text-xs transition-all"
                >
                  {metier.label} à {v}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MetierVillePage;
