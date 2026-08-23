import { BusinessCard } from './BusinessCard';

interface UnifiedBusinessCardProps {
  business: {
    id: string;
    nom?: string;
    name?: string;
    categorie?: string | string[];
    category?: string;
    sous_categories?: string | string[];
    ville?: string;
    gouvernorat?: string;
    statut_abonnement?: string | null;
    subscription_tier?: string | null;
    niveau_priorite_abonnement?: number | null;
    image_url?: string | null;
    imageUrl?: string | null;
    logo_url?: string | null;
    logoUrl?: string | null;
    horaires_ok?: string | null;
    is_premium?: boolean;
    statut_carte?: string | null;
    name_ar?: string | null;
    description_ar?: string | null;
    telephone?: string | null;
    phone?: string | null;
    description?: string | null;
    'Note Google Globale'?: string | number | null;
    'Compteur Avis Google'?: string | number | null;
  };
  onClick: () => void;
}

function toLabel(value: string | string[] | null | undefined): string {
  if (Array.isArray(value)) return value.filter(Boolean).join(', ');
  return value || '';
}

const UnifiedBusinessCard = ({ business, onClick }: UnifiedBusinessCardProps) => {
  const name = business.nom || business.name || '';
  const category = business.category || toLabel(business.categorie) || toLabel(business.sous_categories);

  return (
    <BusinessCard
      business={{
        id: business.id,
        name,
        category,
        ville: business.ville || null,
        gouvernorat: business.gouvernorat || null,
        telephone: business.telephone || business.phone || null,
        description: business.description || null,
        statut_abonnement: business.statut_abonnement || business.subscription_tier || (business.is_premium ? 'premium' : null),
        niveau_priorite_abonnement: business.niveau_priorite_abonnement ?? null,
        imageUrl: business.image_url || business.imageUrl || null,
        logoUrl: business.logo_url || business.logoUrl || null,
        horaires_ok: business.horaires_ok || null,
        statut_carte: business.statut_carte || null,
        note_google: business['Note Google Globale'] ?? null,
        nombre_avis: business['Compteur Avis Google'] ?? null,
        'Note Google Globale': business['Note Google Globale'] ?? null,
        'Compteur Avis Google': business['Compteur Avis Google'] ?? null,
        name_ar: business.name_ar || null,
        description_ar: business.description_ar || null,
      }}
      onClick={onClick}
    />
  );
};

export { UnifiedBusinessCard };
export default UnifiedBusinessCard;
