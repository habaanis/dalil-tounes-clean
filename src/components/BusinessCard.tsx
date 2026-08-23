import GratuitCard from './GratuitCard';
import BusinessSearchCardV2 from './BusinessSearchCardV2';
import { useLanguage } from '../context/LanguageContext';
import { extractMainCategory, getAllKeywords } from '../lib/categoryDisplay';
import { mapSubscriptionToTier } from '../lib/subscriptionTiers';
import { useCategoryTranslation } from '../hooks/useCategoryTranslation';
import { getMultilingualField } from '../lib/databaseI18n';

interface BusinessCardProps {
  business: {
    id: string;
    name: string;
    category?: string;
    categorie?: string;
    ville?: string | null;
    gouvernorat?: string | null;
    adresse?: string | null;
    description?: string | null;
    telephone?: string | null;
    phone?: string | null;
    statut_abonnement?: string | null;
    niveau_priorite_abonnement?: number | null;
    badges?: string[];
    imageUrl?: string | null;
    logoUrl?: string | null;
    horaires_ok?: string | null;
    note_google?: string | number | null;
    'Note Google Globale'?: string | number | null;
    nombre_avis?: string | number | null;
    'Compteur Avis Google'?: string | number | null;
    score_avis?: string | number | null;
    statut_carte?: string | null;
    name_ar?: string | null;
    name_en?: string | null;
    name_it?: string | null;
    name_ru?: string | null;
    description_ar?: string | null;
    description_en?: string | null;
    description_it?: string | null;
    description_ru?: string | null;
    google_url?: string | null;
    'BTN_Maps'?: string | null;
    latitude?: number | string | null;
    longitude?: number | string | null;
    featured?: boolean | null;
    is_premium?: boolean | null;
    approved?: boolean | null;
    statut_validation?: string | null;
  };
  onClick: () => void;
  variant?: 'simple' | 'premium';
}

/**
 * Carte de résultat :
 * - Gratuit conserve la carte annuaire historique ;
 * - Artisan et Premium utilisent la BusinessCard compacte validée.
 *
 * Toutes les variantes ouvrent la fiche entreprise via le même onClick.
 * Aucun champ Airtable/Supabase ni droit d'abonnement n'est modifié ici.
 */
export const BusinessCard = ({ business, onClick }: BusinessCardProps) => {
  const { language } = useLanguage();
  const { getCategory } = useCategoryTranslation();

  const businessForI18n = { ...business, nom: business.name };
  const displayName =
    String(getMultilingualField(businessForI18n, 'nom', language, true) || '') ||
    business.name;
  const displayDescription =
    String(getMultilingualField(businessForI18n, 'description', language, true) || '') ||
    business.description ||
    null;

  const rawCategory =
    getMultilingualField(business, 'category', language, true) ||
    getMultilingualField(business, 'categorie', language, true) ||
    business.category ||
    business.categorie ||
    '';
  const mainCategory = extractMainCategory(rawCategory);
  const translatedCategory = getCategory(mainCategory);
  const allKeywords = getAllKeywords(rawCategory);

  const tier = mapSubscriptionToTier({
    statut_abonnement: business.statut_abonnement,
    niveau_priorite_abonnement: business.niveau_priorite_abonnement,
  });

  if (tier === 'gratuit') {
    return (
      <div
        role="button"
        tabIndex={0}
        onClick={onClick}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            onClick();
          }
        }}
        className="h-full cursor-pointer rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/60"
        aria-label={`Voir les détails de ${displayName}`}
      >
        <GratuitCard
          name={displayName}
          logoUrl={business.logoUrl}
          category={translatedCategory}
          ville={business.ville}
          gouvernorat={business.gouvernorat || undefined}
          horaires_ok={business.horaires_ok}
          telephone={business.telephone || business.phone}
          language={language}
          allKeywords={allKeywords}
          statut_carte={business.statut_carte}
          description_ar={language === 'ar' ? business.description_ar || null : null}
        />
      </div>
    );
  }

  return (
    <BusinessSearchCardV2
      business={business}
      tier={tier === 'artisan' ? 'artisan' : 'premium'}
      displayName={displayName}
      displayDescription={displayDescription}
      categoryLabel={translatedCategory}
      language={language}
      onClick={onClick}
    />
  );
};
