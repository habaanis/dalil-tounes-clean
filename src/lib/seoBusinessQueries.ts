import { supabase } from './supabaseClient';

export interface SeoBusiness {
  id: string;
  nom: string;
  adresse?: string;
  ville?: string;
  gouvernorat?: string;
  telephone?: string;
  'catégorie'?: string[];
  'Note Google Globale'?: number | null;
  'Compteur Avis Google'?: number | null;
  logo_url?: string;
  description?: string;
  is_premium?: boolean;
  statut_abonnement?: string | null;
  horaires_ok?: string | null;
}

function mapEntrepriseRow(row: Record<string, unknown>): SeoBusiness {
  const sousCats = Array.isArray(row.sous_categories)
    ? (row.sous_categories as string[])
    : row.sous_categories
      ? [row.sous_categories as string]
      : [];
  return {
    id: row.id as string,
    nom: (row.nom as string) ?? '',
    adresse: row.adresse as string | undefined,
    ville: row.ville as string | undefined,
    gouvernorat: row.gouvernorat as string | undefined,
    telephone: row.telephone as string | undefined,
    'catégorie': sousCats.length > 0 ? sousCats : (row.categorie ? [row.categorie as string] : []),
    'Note Google Globale': row.score_avis as number | null ?? null,
    'Compteur Avis Google': null,
    logo_url: row.logo_url as string | undefined || row.image_url as string | undefined,
    description: row.description as string | undefined,
    is_premium: false,
    statut_abonnement: (row['statut Abonnement'] as string | null) ?? (row.statut_abonnement as string | null) ?? null,
    horaires_ok: row.horaires_ok as string | null ?? null,
  };
}

export async function fetchSeoBusinesses(options: {
  limit?: number;
  metier?: string;
  sousCategorie?: string;
  city?: string;
  categorie?: string;
}): Promise<{ data: SeoBusiness[]; error: unknown }> {
  const { limit = 40, sousCategorie, city } = options;
  const metierValue = options.metier ?? options.categorie;

  // TEMP: filtre statut_validation désactivé (à réactiver après validation des fiches)
  const { data, error } = await supabase
    .from('entreprise')
    .select('*');

  if (error || !data) {
    return { data: [], error };
  }

  const filtered = (data as Record<string, unknown>[]).filter(item => {
    const sousCatsRaw = Array.isArray(item.sous_categories)
      ? (item.sous_categories as string[]).join(' ')
      : (item.sous_categories as string) ?? '';

    const matchMetier = metierValue
      ? sousCatsRaw.toLowerCase().includes(metierValue.toLowerCase())
      : true;

    const matchSousCategorie = sousCategorie
      ? sousCatsRaw.toLowerCase().includes(sousCategorie.toLowerCase())
      : true;

    const matchLocation = city
      ? (item.gouvernorat as string | undefined)?.toLowerCase().includes(city.toLowerCase()) ||
        (item.ville as string | undefined)?.toLowerCase().includes(city.toLowerCase())
      : true;

    return matchMetier && matchSousCategorie && matchLocation;
  });

  const limited = filtered.slice(0, limit);

  return { data: limited.map(mapEntrepriseRow), error: null };
}
