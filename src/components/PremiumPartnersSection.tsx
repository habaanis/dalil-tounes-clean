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
      className="rounded-xl overflow-hidden border border-gray-100 bg-white animate-pulse"
      style={{ minHeight: '180px', maxHeight: '220px' }}
    >
      <div className="bg-gray-200 h-20 w-full" />
      <div className="px-2 pt-2 pb-2 flex flex-col gap-2">
        <div className="w-8 h-8 rounded-full bg-gray-200 -mt-5 border-2 border-white" />
        <div className="h-3 bg-gray-200 rounded w-3/4" />
        <div className="h-2.5 bg-gray-100 rounded w-1/2" />
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

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {loading ? (
            [1, 2, 3, 4, 5].map((i) => <PartnerSkeleton key={i} />)
          ) : partners.length === 0 ? (
            <div className="text-center py-8 text-gray-500 text-sm col-span-2 md:col-span-4 lg:col-span-5">
              Aucun établissement à afficher pour le moment
            </div>
          ) : (
            partners.map((biz) => (
              <div
                key={biz.id}
                onClick={() => onCardClick(biz.id)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer',
                }}
              >
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <BusinessCard
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
                    name_ar: biz.name_ar,
                    description_ar: biz.description_ar,
                  }}
                  onClick={() => onCardClick(biz.id)}
                />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default PremiumPartnersSection;
