import { HomeBusinessRow } from '../hooks/useHomeData';
import { BusinessCard } from './BusinessCard';

interface PremiumPartnersSectionProps {
  onCardClick: (id: string) => void;
  partners: HomeBusinessRow[];
  loading: boolean;
}

function PartnerSkeleton() {
  return (
    <div
      className="rounded-2xl overflow-hidden border border-gray-100 bg-white animate-pulse"
      style={{ width: '200px', minHeight: '220px' }}
    >
      {/* image placeholder */}
      <div className="bg-gray-200 h-28 w-full" />
      {/* logo circle */}
      <div className="px-3 pt-3 pb-2 flex flex-col gap-2">
        <div className="w-10 h-10 rounded-full bg-gray-200 -mt-6 border-2 border-white" />
        <div className="h-3 bg-gray-200 rounded w-3/4" />
        <div className="h-2.5 bg-gray-100 rounded w-1/2" />
        <div className="h-2 bg-gray-100 rounded w-2/3" />
      </div>
    </div>
  );
}

export const PremiumPartnersSection = ({ onCardClick, partners, loading }: PremiumPartnersSectionProps) => {
  return (
    <section className="py-6 px-4 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-5">
          <h2 className="text-lg md:text-xl font-light text-gray-900 mb-1">
            Établissements à la Une
          </h2>
          <p className="text-gray-600 text-sm">
            Découvrez nos établissements premium et leurs services d'excellence
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 260px))', gap: '1rem', justifyContent: 'center' }}>
          {loading ? (
            [1, 2, 3, 4].map((i) => <PartnerSkeleton key={i} />)
          ) : partners.length === 0 ? (
            <div className="text-center py-8 text-gray-500 text-sm w-full">
              Aucun établissement à afficher pour le moment
            </div>
          ) : (
            partners.map((biz) => (
              <BusinessCard
                key={biz.id}
                business={{
                  id: biz.id,
                  name: biz.nom,
                  category: Array.isArray(biz.sous_categories)
                    ? (biz.sous_categories as unknown as string[]).join(', ')
                    : (biz.sous_categories || ''),
                  ville: biz.ville,
                  gouvernorat: biz.gouvernorat,
                  statut_abonnement: biz['statut Abonnement'],
                  'niveau priorité abonnement': biz['niveau priorité abonnement'],
                  imageUrl: biz.image_url,
                  logoUrl: biz.logo_url,
                  horaires_ok: biz.horaires_ok,
                  telephone: biz.telephone,
                  statut_carte: biz.statut_carte,
                }}
                onClick={() => onCardClick(biz.id)}
              />
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default PremiumPartnersSection;
