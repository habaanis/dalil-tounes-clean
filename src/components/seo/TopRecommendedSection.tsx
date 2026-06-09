import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trophy } from 'lucide-react';
import { fetchTopRecommendedByCity, type RecommendedBusiness } from '../../lib/seoBusinessQueries';
import { buildEntrepriseUrl } from '../../lib/slugify';
import { BusinessCard } from '../BusinessCard';
import { extractFrenchName } from '../../lib/textNormalization';

interface TopRecommendedSectionProps {
  ville: string;
  villeSlug: string;
}

function mapToBusinessCardProps(biz: RecommendedBusiness) {
  const rawCat = biz['catégorie'] || [];
  const category = Array.isArray(rawCat) ? rawCat.join(', ') : rawCat;

  return {
    id: biz.id,
    name: extractFrenchName(biz.nom),
    category,
    ville: biz.ville,
    gouvernorat: biz.gouvernorat,
    statut_abonnement: biz.statut_abonnement || null,
    logoUrl: biz.logo_url,
    horaires_ok: biz.horaires_ok ?? null,
    telephone: biz.telephone,
    'Note Google Globale': biz['Note Google Globale'] ?? null,
    'Compteur Avis Google': biz['Compteur Avis Google'] ?? null,
    description: biz.description,
  };
}

export default function TopRecommendedSection({ ville, villeSlug }: TopRecommendedSectionProps) {
  const [items, setItems] = useState<RecommendedBusiness[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    fetchTopRecommendedByCity(ville, 6).then((result) => {
      if (!cancelled) {
        setItems(result);
        setLoading(false);
      }
    });

    return () => { cancelled = true; };
  }, [ville]);

  if (!loading && items.length < 3) return null;

  return (
    <section className="mb-10" aria-labelledby={`top-recommended-${villeSlug}`}>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-xl bg-[#D4AF37]/15 flex items-center justify-center shrink-0">
          <Trophy className="w-5 h-5 text-[#D4AF37]" />
        </div>
        <div>
          <h2
            id={`top-recommended-${villeSlug}`}
            className="text-lg md:text-xl font-bold text-white leading-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Entreprises les plus recommandees par les clients a{' '}
            <span className="text-[#D4AF37]">{ville}</span>
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Basees sur les avis Google et la satisfaction client
          </p>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-[#1a1a1a] rounded-xl overflow-hidden animate-pulse">
              <div className="h-24 bg-gray-800" />
              <div className="p-3.5 space-y-2">
                <div className="h-4 bg-gray-800 rounded w-3/4" />
                <div className="h-3 bg-gray-800 rounded w-1/2" />
                <div className="h-3 bg-gray-800 rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((biz) => {
            const url = buildEntrepriseUrl({ slug: biz.slug ?? null, nom: biz.nom, ville: biz.ville, id: biz.id });
            const cardProps = mapToBusinessCardProps(biz);

            return (
              <Link
                key={biz.id}
                to={url}
                className="block no-underline"
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <BusinessCard
                  business={cardProps}
                  onClick={() => navigate(url)}
                />
              </Link>
            );
          })}
        </div>
      )}

      <p className="text-center text-[11px] text-gray-600 mt-4 leading-relaxed">
        Les classements reposent sur des criteres automatises (avis publics, notes Google, volume d'avis).{' '}
        <Link to="/info-avis" className="text-[#D4AF37] hover:underline">En savoir plus</Link>
      </p>
    </section>
  );
}
