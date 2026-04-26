import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';
import { BusinessCard } from './BusinessCard';
import { getSubscriptionPriority } from '../lib/subscriptionHelper';
import { extractFrenchName } from '../lib/textNormalization';

type RawVariant = 'home' | 'accueil' | 'businesses' | 'entreprises' | 'citizens' | 'citoyens' | 'shops' | 'magasins';
type NormalizedVariant = 'home' | 'businesses' | 'citizens' | 'shops';

interface FeaturedBusinessesStripProps {
  variant: RawVariant;
}

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
  name_ar: string | null;
  description_ar: string | null;
}

function normalizeVariant(variant: RawVariant): NormalizedVariant {
  switch (variant) {
    case 'home': case 'accueil': return 'home';
    case 'businesses': case 'entreprises': return 'businesses';
    case 'citizens': case 'citoyens': return 'citizens';
    case 'shops': case 'magasins': return 'shops';
    default: return 'home';
  }
}

function getTextsForVariant(variant: NormalizedVariant) {
  switch (variant) {
    case 'home': return { title: 'Ils font bouger la Tunisie', subtitle: "Une sélection d'entreprises, commerces et services qui illustrent la richesse économique du pays." };
    case 'businesses': return { title: 'Entreprises qui bougent', subtitle: 'Des prestataires et services B2B pour accompagner les professionnels et les projets.' };
    case 'citizens': return { title: 'Près de chez vous', subtitle: 'Les professionnels et services utiles à votre quotidien, partout en Tunisie.' };
    case 'shops': return { title: 'Commerces & boutiques', subtitle: 'Faites votre shopping en Tunisie : commerces de proximité, artisans et magasins.' };
    default: return { title: 'Établissements en vedette', subtitle: '' };
  }
}

export const FeaturedBusinessesStrip = ({ variant }: FeaturedBusinessesStripProps) => {
  const normalized = normalizeVariant(variant);
  const [businesses, setBusinesses] = useState<BusinessRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      setLoading(true);
      try {
        const FIELDS = `id, nom, ville, gouvernorat, sous_categories, "statut Abonnement", "niveau priorité abonnement", image_url, logo_url, horaires_ok, telephone, name_ar, description_ar`;

        const { data: fetchedData } = await supabase
          .from('entreprise')
          .select(FIELDS)
          .or('"statut Abonnement".ilike.*Elite Pro*,"statut Abonnement".ilike.*Elite*,"statut Abonnement".ilike.*Premium*')
          .not('"statut Abonnement"', 'ilike', '*gratuit*')
          .not('"statut Abonnement"', 'ilike', '*decouverte*')
          .not('"statut Abonnement"', 'ilike', '*découverte*')
          .order('"niveau priorité abonnement"', { ascending: false, nullsFirst: false })
          .limit(12);

        let rows: BusinessRow[] = (fetchedData as BusinessRow[] | null) || [];

        rows = rows.sort((a, b) =>
          getSubscriptionPriority(b['statut Abonnement']) - getSubscriptionPriority(a['statut Abonnement'])
        );

        if (isMounted) setBusinesses(rows);
      } catch (err) {
        console.error('[FeaturedBusinessesStrip] error:', err);
        if (isMounted) setBusinesses([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();
    return () => { isMounted = false; };
  }, [normalized]);

  const { title, subtitle } = getTextsForVariant(normalized);

  if (loading) {
    return (
      <section className="py-6">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <div className="w-5 h-5 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
            <span>Chargement des établissements en vedette...</span>
          </div>
        </div>
      </section>
    );
  }

  if (businesses.length === 0) {
    return (
      <section className="py-6">
        <div className="max-w-6xl mx-auto px-4">
          <p className="text-sm text-gray-500">Aucun établissement à afficher pour le moment.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-5">
          <h2 className="text-xl md:text-2xl font-light text-gray-900">{title}</h2>
          {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 justify-items-center">
          {businesses.map((biz, index) => (
            <motion.div
              key={biz.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
            >
              <BusinessCard
                business={{
                  id: biz.id,
                  name: extractFrenchName(biz.nom),
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
                  name_ar: biz.name_ar,
                  description_ar: biz.description_ar,
                }}
                onClick={() => {
                  window.location.hash = `#/business/${biz.id}`;
                }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedBusinessesStrip;
