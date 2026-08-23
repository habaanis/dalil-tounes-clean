import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BusinessCard } from '../BusinessCard';
import { buildEntrepriseUrl } from '../../lib/slugify';

interface SeoBusinessCardProps {
  business: {
    id: string;
    nom: string;
    slug?: string | null;
    adresse?: string;
    ville?: string;
    gouvernorat?: string;
    telephone?: string;
    'catégorie'?: string[];
    categorie?: string | string[];
    sous_categories?: string | string[];
    'Note Google Globale'?: number | string | null;
    'Compteur Avis Google'?: number | string | null;
    logo_url?: string;
    image_url?: string | null;
    description?: string;
    is_premium?: boolean;
    statut_abonnement?: string | null;
    niveau_priorite_abonnement?: number | null;
    horaires_ok?: string | null;
    statut_carte?: string | null;
    name_ar?: string | null;
    description_ar?: string | null;
  };
}

function toLabel(value: string | string[] | null | undefined): string {
  if (Array.isArray(value)) return value.filter(Boolean).join(', ');
  return value || '';
}

const SeoBusinessCard: React.FC<SeoBusinessCardProps> = ({ business }) => {
  const navigate = useNavigate();
  const categoryLabel =
    toLabel(business.sous_categories) ||
    toLabel(business.categorie) ||
    toLabel(business['catégorie']);

  return (
    <BusinessCard
      business={{
        id: business.id,
        name: business.nom,
        category: categoryLabel,
        ville: business.ville || null,
        gouvernorat: business.gouvernorat || null,
        adresse: business.adresse || null,
        description: business.description || null,
        telephone: business.telephone || null,
        statut_abonnement: business.statut_abonnement || (business.is_premium ? 'premium' : null),
        niveau_priorite_abonnement: business.niveau_priorite_abonnement ?? null,
        imageUrl: business.image_url || null,
        logoUrl: business.logo_url || null,
        horaires_ok: business.horaires_ok || null,
        note_google: business['Note Google Globale'] ?? null,
        nombre_avis: business['Compteur Avis Google'] ?? null,
        'Note Google Globale': business['Note Google Globale'] ?? null,
        'Compteur Avis Google': business['Compteur Avis Google'] ?? null,
        statut_carte: business.statut_carte || null,
        name_ar: business.name_ar || null,
        description_ar: business.description_ar || null,
      }}
      onClick={() => {
        navigate(buildEntrepriseUrl({
          slug: business.slug,
          nom: business.nom,
          ville: business.ville,
          id: business.id,
        }));
      }}
    />
  );
};

export default SeoBusinessCard;
