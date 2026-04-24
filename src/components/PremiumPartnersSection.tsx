import { HomeBusinessRow } from '../hooks/useHomeData';
import { BusinessCard } from './BusinessCard';

interface PremiumPartnersSectionProps {
  onCardClick: (id: string) => void;
  partners: HomeBusinessRow[];
  loading: boolean;
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

        {loading ? (
          <div className="flex justify-center gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="animate-pulse rounded-2xl bg-gray-100"
                style={{ width: '200px', height: '220px', border: '2px solid #e5e7eb' }}
              />
            ))}
          </div>
        ) : partners.length === 0 ? (
          <div className="text-center py-8 text-gray-500 text-sm">
            Aucun établissement à afficher pour le moment
          </div>
        ) : (
          <div className="flex flex-wrap gap-4 justify-center">
            {partners.map((biz) => (
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
                }}
                onClick={() => onCardClick(biz.id)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default PremiumPartnersSection;
