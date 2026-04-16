import React, { useEffect, useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Search, MapPin, ArrowRight, AlertCircle } from 'lucide-react';
import { SEOHead } from '../../components/SEOHead';
import Breadcrumb from '../../components/seo/Breadcrumb';
import SeoBusinessCard from '../../components/seo/SeoBusinessCard';
import { parseSeoSlug, SEO_SOUS_CATEGORIES } from '../../lib/seoLandingData';
import { fetchSeoBusinesses } from '../../lib/seoBusinessQueries';

const MetierSousCatVillePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const parsed = slug ? parseSeoSlug(slug) : null;

  useEffect(() => {
    if (!parsed) return;

    setLoading(true);

    if (parsed.type === 'metier-souscategorie-ville') {
      fetchSeoBusinesses({
        limit: 30,
        categorie: parsed.metier.value,
        sousCategorie: parsed.sousCategorie.label,
        city: parsed.ville.label,
      }).then(({ data }) => {
        setBusinesses(data ?? []);
        setLoading(false);
      });
    } else {
      fetchSeoBusinesses({
        limit: 30,
        categorie: parsed.metier.value,
        city: parsed.ville.label,
      }).then(({ data }) => {
        setBusinesses(data ?? []);
        setLoading(false);
      });
    }
  }, [slug]);

  if (!parsed) {
    return <Navigate to="/" replace />;
  }

  const { metier, ville } = parsed;
  const sousCategorie = parsed.type === 'metier-souscategorie-ville' ? parsed.sousCategorie : null;

  const pageTitle = sousCategorie
    ? `${metier.label} ${sousCategorie.label} à ${ville.label} - Dalil Tounes`
    : `Meilleurs ${metier.label} à ${ville.label} - Dalil Tounes`;

  const pageDescription = sousCategorie
    ? `Trouvez un ${metier.label} spécialisé en ${sousCategorie.label} à ${ville.label}. Annuaire complet avec avis et coordonnées.`
    : `Trouvez un ${metier.label} de confiance à ${ville.label} avec avis et coordonnées. Annuaire complet en Tunisie.`;

  const pageKeywords = sousCategorie
    ? `${metier.label} ${sousCategorie.label} ${ville.label}, ${metier.label.toLowerCase()} ${sousCategorie.label} tunisie, ${metier.secteur} ${ville.label}`
    : `${metier.label} ${ville.label}, ${metier.label.toLowerCase()} tunisie, ${metier.secteur} ${ville.label}`;

  const sortedBusinesses = [...businesses].sort((a, b) => {
    return (b['Note Google Globale'] ?? 0) - (a['Note Google Globale'] ?? 0);
  });

  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'SearchResultsPage',
    name: pageTitle,
    description: pageDescription,
    url: `https://dalil-tounes.com/${slug}`,
  };

  const sousCats = SEO_SOUS_CATEGORIES[metier.slug] ?? [];

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
                ...(sousCategorie
                  ? [
                      { label: sousCategorie.label, href: `/${metier.slug}-${sousCategorie.slug}-${ville.slug}` },
                      { label: ville.label },
                    ]
                  : [{ label: ville.label }]),
              ]}
            />

            <div className="flex items-center gap-3 mb-4">
              <span className="inline-block px-3 py-1 rounded-full border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-medium tracking-widest uppercase">
                {metier.secteur}
              </span>
              {sousCategorie && (
                <span className="inline-block px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-medium">
                  {sousCategorie.label}
                </span>
              )}
            </div>

            <h1
              className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight"
              style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', serif" }}
            >
              {metier.label}
              {sousCategorie && (
                <span className="text-[#D4AF37]"> {sousCategorie.label}</span>
              )}{' '}
              à <span className={sousCategorie ? 'text-white' : 'text-[#D4AF37]'}>{ville.label}</span>
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
                  <span>
                    {sortedBusinesses.length} établissement{sortedBusinesses.length !== 1 ? 's' : ''} trouvé{sortedBusinesses.length !== 1 ? 's' : ''}
                  </span>
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
                {sousCategorie
                  ? `Aucun ${metier.label} spécialisé en ${sousCategorie.label} à ${ville.label} pour le moment.`
                  : `Aucun résultat pour ${metier.label} à ${ville.label}`}
              </h2>
              <p className="text-gray-500 text-sm mb-8 max-w-md mx-auto">
                {sousCategorie
                  ? `Essayez une recherche plus générale ou consultez tous les ${metier.label.toLowerCase()}s à ${ville.label}.`
                  : `Aucun établissement n'a encore été référencé. Consultez l'annuaire complet pour plus d'options.`}
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                {sousCategorie && (
                  <Link
                    to={`/${metier.slug}-${ville.slug}`}
                    className="inline-block px-6 py-3 border border-[#D4AF37]/60 text-[#D4AF37] text-sm font-medium rounded-lg hover:bg-[#D4AF37] hover:text-black transition-all"
                  >
                    Tous les {metier.label.toLowerCase()}s à {ville.label}
                  </Link>
                )}
                <Link
                  to="/entreprises"
                  className="inline-block px-6 py-3 border border-gray-700 text-gray-400 text-sm font-medium rounded-lg hover:border-gray-500 hover:text-white transition-all"
                >
                  Voir tout l'annuaire
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
                Spécialisations disponibles à {ville.label}
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
                    {metier.label} {sc.label}
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
              Autres villes
            </h2>
            <div className="flex flex-wrap gap-2">
              {['tunis', 'sfax', 'sousse', 'nabeul', 'bizerte', 'monastir'].map(v => (
                <Link
                  key={v}
                  to={
                    sousCategorie
                      ? `/${metier.slug}-${sousCategorie.slug}-${v}`
                      : `/${metier.slug}-${v}`
                  }
                  className="px-3 py-1.5 rounded-full border border-gray-700 hover:border-[#D4AF37]/50 text-gray-400 hover:text-[#D4AF37] text-xs transition-all capitalize"
                >
                  {metier.label} à {v.charAt(0).toUpperCase() + v.slice(1)}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MetierSousCatVillePage;
