import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { BusinessCard } from './BusinessCard';
import { getSubscriptionPriority } from '../lib/subscriptionHelper';

interface BusinessRow {
  id: string;
  nom: string;
  ville: string | null;
  gouvernorat: string | null;
  sous_categories: string | null;
  'statut Abonnement': string | null;
  'niveau priorité abonnement': number | null;
  image_url: string | null;
  logo_url: string | null;
  horaires_ok: string | null;
  telephone: string | null;
  is_featured: boolean | null;
}

interface PremiumPartnersSectionProps {
  onCardClick: (id: string) => void;
}

export const PremiumPartnersSection = ({ onCardClick }: PremiumPartnersSectionProps) => {
  const [partners, setPartners] = useState<BusinessRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPartners = async () => {
      setLoading(true);
      try {
        const FIELDS = `id, nom, ville, gouvernorat, sous_categories, "statut Abonnement", "niveau priorité abonnement", image_url, logo_url, horaires_ok, telephone, is_featured`;

        // Priorité 1 : is_featured = true
        const { data: featuredData } = await supabase
          .from('entreprise')
          .select(FIELDS)
          .eq('is_featured', true)
          .order('"niveau priorité abonnement"', { ascending: false, nullsFirst: false })
          .limit(4);

        let rows: BusinessRow[] = (featuredData as BusinessRow[] | null) || [];

        // Fallback : Elite Pro / Elite / Premium
        if (rows.length < 4) {
          const needed = 4 - rows.length;
          const existingIds = rows.map((r) => r.id);

          const { data: fallback } = await supabase
            .from('entreprise')
            .select(FIELDS)
            .or('"statut Abonnement".ilike.*Elite Pro*,"statut Abonnement".ilike.*Elite*,"statut Abonnement".ilike.*Premium*')
            .order('"niveau priorité abonnement"', { ascending: false, nullsFirst: false })
            .limit(needed + existingIds.length);

          const extras = ((fallback as BusinessRow[] | null) || []).filter(
            (r) => !existingIds.includes(r.id)
          );
          rows = [...rows, ...extras].slice(0, 4);
        }

        rows = rows.sort((a, b) => {
          if (a.is_featured && !b.is_featured) return -1;
          if (!a.is_featured && b.is_featured) return 1;
          return getSubscriptionPriority(b['statut Abonnement']) - getSubscriptionPriority(a['statut Abonnement']);
        });

        setPartners(rows);
      } catch (err) {
        console.error('[PremiumPartnersSection] error:', err);
        setPartners([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPartners();
  }, []);

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
