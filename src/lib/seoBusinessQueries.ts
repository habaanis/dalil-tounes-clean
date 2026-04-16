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
}

const SEO_COLUMNS = `
  id,
  nom,
  categorie,
  sous_categories,
  ville,
  adresse,
  telephone,
  description,
  image_url,
  score_avis,
  statut_validation
`;

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
    gouvernorat: row.ville as string | undefined,
    telephone: row.telephone as string | undefined,
    'catégorie': sousCats.length > 0 ? sousCats : (row.categorie ? [row.categorie as string] : []),
    'Note Google Globale': row.score_avis as number | null ?? null,
    'Compteur Avis Google': null,
    logo_url: row.image_url as string | undefined,
    description: row.description as string | undefined,
    is_premium: false,
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

  let query = supabase
    .from('entreprise')
    .select(SEO_COLUMNS)
    .eq('statut_validation', 'valider');

  if (metierValue) {
    query = query.contains('sous_categories', [metierValue]);
  }

  if (sousCategorie) {
    query = query.contains('sous_categories', [sousCategorie]);
  }

  if (city) {
    query = query.ilike('ville', `%${city}%`);
  }

  query = query.limit(limit);

  const { data, error } = await query;

  if (error || !data) {
    return { data: [], error };
  }

  return { data: (data as Record<string, unknown>[]).map(mapEntrepriseRow), error: null };
}
