const BASE = 'https://kmvjegbtroksjqaqliyv.supabase.co/storage/v1/object/public/photos-dalil';

/** Drapeau tunisien — image hero utilisée sur toutes les pages de bannière.
 *  Hébergée localement dans /public/images pour éliminer la connexion externe
 *  et bénéficier du cache HTTP long terme servi par l'hébergeur statique.
 *  Incrémenter ?v= après chaque remplacement d'asset pour invalider le cache. */
export const HERO_IMAGE_URL     = '/images/drapeau-tunisie.webp?v=1';
export const HERO_IMAGE_JPG_URL = `${BASE}/drapeau-tunisie.jpg`;
