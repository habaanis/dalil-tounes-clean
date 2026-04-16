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
  name,
  category,
  city,
  address,
  phone,
  description,
  image_url,
  status
`;

function mapBusinessRow(row: Record<string, unknown>): SeoBusiness {
  return {
    id: row.id as string,
    nom: (row.name as string) ?? '',
    adresse: row.address as string | undefined,
    ville: row.city as string | undefined,
    gouvernorat: row.city as string | undefined,
    telephone: row.phone as string | undefined,
    'catégorie': row.category ? [row.category as string] : [],
    'Note Google Globale': null,
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
  const { limit = 40, metier, sousCategorie, city } = options;

  const metierValue = metier ?? options.categorie;

  let query = supabase
    .from('businesses')
    .select(SEO_COLUMNS)
    .eq('status', 'approved');

  if (metierValue) {
    query = query.ilike('category', `%${metierValue}%`);
  }

  if (sousCategorie) {
    query = query.ilike('category', `%${sousCategorie}%`);
  }

  if (city) {
    query = query.ilike('city', `%${city}%`);
  }

  query = query.limit(limit);

  const { data, error } = await query;

  if (error || !data) {
    return { data: [], error };
  }

  return { data: (data as Record<string, unknown>[]).map(mapBusinessRow), error: null };
}
