import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

function escapeXml(str: string): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function generateSlug(text: string): string {
  if (!text) return '';
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[àáâãäå]/g, 'a')
    .replace(/[èéêë]/g, 'e')
    .replace(/[ìíîï]/g, 'i')
    .replace(/[òóôõö]/g, 'o')
    .replace(/[ùúûü]/g, 'u')
    .replace(/[ýÿ]/g, 'y')
    .replace(/[ñ]/g, 'n')
    .replace(/[ç]/g, 'c')
    .replace(/[œ]/g, 'oe')
    .replace(/[æ]/g, 'ae')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-+/g, '-');
}

function generateBusinessUrl(slug: string | null, name: string, ville?: string | null): string {
  const businessSlug = slug || generateSlug(name);
  if (!businessSlug) return '';
  if (ville) {
    const villeSlug = generateSlug(ville);
    if (villeSlug) return `/entreprise/${villeSlug}/${businessSlug}`;
  }
  return `/p/${businessSlug}`;
}

function toLastmod(dateStr: string | null, fallback: string): string {
  if (!dateStr) return fallback;
  try {
    return new Date(dateStr).toISOString().split('T')[0];
  } catch {
    return fallback;
  }
}

const staticPages = [
  { loc: '/', priority: '1.0', changefreq: 'daily' },
  { loc: '/entreprises', priority: '0.9', changefreq: 'daily' },
  { loc: '/emplois', priority: '0.9', changefreq: 'daily' },
  { loc: '/recherche', priority: '0.8', changefreq: 'daily' },
  { loc: '/citizens/health', priority: '0.8', changefreq: 'weekly' },
  { loc: '/citizens/leisure', priority: '0.8', changefreq: 'daily' },
  { loc: '/citizens/admin', priority: '0.8', changefreq: 'weekly' },
  { loc: '/citizens/shops', priority: '0.8', changefreq: 'weekly' },
  { loc: '/citizens/services', priority: '0.8', changefreq: 'weekly' },
  { loc: '/citizens/tourism', priority: '0.8', changefreq: 'weekly' },
  { loc: '/education', priority: '0.8', changefreq: 'weekly' },
  { loc: '/culture-events', priority: '0.8', changefreq: 'daily' },
  { loc: '/marketplace', priority: '0.7', changefreq: 'daily' },
  { loc: '/abonnement', priority: '0.7', changefreq: 'monthly' },
  { loc: '/notre-concept', priority: '0.6', changefreq: 'monthly' },
  { loc: '/around-me', priority: '0.7', changefreq: 'daily' },
  { loc: '/contact', priority: '0.5', changefreq: 'monthly' },
  { loc: '/blog', priority: '0.7', changefreq: 'weekly' },
  { loc: '/info-avis', priority: '0.4', changefreq: 'yearly' },
  { loc: '/mentions-legales', priority: '0.3', changefreq: 'yearly' },
  { loc: '/cgu', priority: '0.3', changefreq: 'yearly' },
  { loc: '/politique-confidentialite', priority: '0.3', changefreq: 'yearly' },
  { loc: '/plan-du-site', priority: '0.3', changefreq: 'monthly' },
];

const seoSecteurSlugs = [
  'sante', 'services', 'artisanat', 'juridique', 'beaute', 'restauration',
  'alimentation', 'auto', 'transport', 'education', 'immobilier', 'tech',
  'sport', 'bien-etre', 'mode', 'evenementiel', 'art', 'animaux',
  'profession-liberale', 'shopping',
];

const seoMetierSlugs = [
  'medecin-generaliste', 'medecin-specialiste', 'cardiologue', 'dentiste',
  'chirurgien-dentiste', 'orthodontiste', 'pediatre', 'gynecologue',
  'dermatologue', 'ophtalmologue', 'orl', 'kinesitherapeute',
  'osteopathe', 'podologue', 'psychologue', 'psychiatre',
  'orthophoniste', 'dieticien', 'pharmacie', 'laboratoire-analyse',
  'radiologie', 'infirmier', 'sage-femme', 'ambulance',
  'optique-lunetterie', 'audioprothesiste',
  'plombier', 'electricien', 'menuisier', 'serrurier', 'peintre',
  'carreleur', 'maccon', 'architecte', 'ingenieur', 'geometre',
  'notaire', 'avocat', 'expert-comptable', 'conseil-juridique', 'huissier',
  'coiffeur', 'coiffeur-homme', 'coiffeur-femme', 'barbier',
  'institut-beaute', 'esthethicienne', 'onglerie', 'spa-hammam',
  'restaurant', 'cafe', 'patisserie', 'boulangerie', 'traiteur',
  'pizzeria', 'fast-food', 'salon-the',
  'hotel', 'maison-hotes', 'location-vacances', 'guide-touristique',
  'garage', 'mecanicien', 'carrosserie', 'lavage-auto',
  'veterinaire', 'agence-immobiliere', 'agence-voyage',
  'photographe', 'graphiste', 'imprimerie', 'auto-ecole',
  'salle-sport', 'club-fitness', 'piscine', 'pisciniste',
];

const seoVilleSlugs = [
  'tunis', 'la-marsa', 'carthage', 'ariana', 'ennasr', 'el-menzah',
  'ben-arous', 'rades', 'la-manouba',
  'nabeul', 'hammamet', 'kelibia', 'korba', 'bizerte', 'zaghouan',
  'beja', 'jendouba', 'tabarka', 'ain-draham', 'le-kef', 'siliana',
  'sousse', 'msaken', 'monastir', 'moknine', 'jemmal', 'port-el-kantaoui', 'mahdia',
  'kairouan', 'kasserine', 'sidi-bouzid',
  'sfax', 'gabes', 'medenine', 'tataouine', 'zarzis', 'djerba', 'houmt-souk',
  'gafsa', 'tozeur', 'nefta', 'kebili', 'douz',
];

const seoGouvernoratSlugs = [
  'tunis', 'ariana', 'ben-arous', 'manouba', 'nabeul', 'zaghouan',
  'bizerte', 'beja', 'jendouba', 'le-kef', 'siliana', 'sousse',
  'monastir', 'mahdia', 'kairouan', 'kasserine', 'sidi-bouzid',
  'sfax', 'gabes', 'medenine', 'tataouine', 'gafsa', 'tozeur', 'kebili',
];

const BATCH_SIZE = 5000;

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const domain = 'https://dalil-tounes.com';
    const today = new Date().toISOString().split('T')[0];

    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n';
    xml += '        xmlns:xhtml="http://www.w3.org/1999/xhtml">\n\n';

    // Static pages
    for (const page of staticPages) {
      xml += `  <url>\n    <loc>${domain}${escapeXml(page.loc)}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${page.changefreq}</changefreq>\n    <priority>${page.priority}</priority>\n  </url>\n`;
    }

    // SEO secteur pages: /secteur/{slug}
    for (const slug of seoSecteurSlugs) {
      xml += `  <url>\n    <loc>${domain}/secteur/${escapeXml(slug)}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.75</priority>\n  </url>\n`;
    }

    // SEO metier pages: /metier/{slug}
    for (const slug of seoMetierSlugs) {
      xml += `  <url>\n    <loc>${domain}/metier/${escapeXml(slug)}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.7</priority>\n  </url>\n`;
    }

    // SEO ville pages: /ville/{slug}
    for (const slug of seoVilleSlugs) {
      xml += `  <url>\n    <loc>${domain}/ville/${escapeXml(slug)}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.7</priority>\n  </url>\n`;
    }

    // SEO gouvernorat pages: /gouvernorat/{slug}
    for (const slug of seoGouvernoratSlugs) {
      xml += `  <url>\n    <loc>${domain}/gouvernorat/${escapeXml(slug)}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.75</priority>\n  </url>\n`;
    }

    // SEO metier+ville combos for top metiers x top villes
    const topMetiers = ['avocat', 'dentiste', 'medecin-generaliste', 'plombier', 'electricien', 'coiffeur', 'restaurant', 'pharmacie', 'garage', 'hotel', 'architecte', 'notaire', 'expert-comptable', 'veterinaire'];
    const topVilles = ['tunis', 'sfax', 'sousse', 'nabeul', 'bizerte', 'monastir', 'gabes', 'kairouan', 'ariana', 'ben-arous', 'hammamet', 'la-marsa', 'djerba', 'mahdia'];
    for (const m of topMetiers) {
      for (const v of topVilles) {
        xml += `  <url>\n    <loc>${domain}/${escapeXml(m)}-${escapeXml(v)}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.65</priority>\n  </url>\n`;
      }
    }

    // Entreprises (paginated)
    let offset = 0;
    let hasMore = true;
    while (hasMore) {
      const { data: businesses } = await supabase
        .from('entreprise')
        .select('id, nom, slug, ville, updated_at, is_premium')
        .order('updated_at', { ascending: false })
        .range(offset, offset + BATCH_SIZE - 1);

      if (!businesses || businesses.length === 0) {
        hasMore = false;
        break;
      }

      for (const biz of businesses) {
        const url = generateBusinessUrl(biz.slug, biz.nom, biz.ville);
        if (!url) continue;
        const lastmod = toLastmod(biz.updated_at, today);
        const priority = biz.is_premium ? '0.9' : '0.7';
        xml += `  <url>\n    <loc>${domain}${escapeXml(url)}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>${priority}</priority>\n  </url>\n`;
      }

      if (businesses.length < BATCH_SIZE) {
        hasMore = false;
      } else {
        offset += BATCH_SIZE;
      }
    }

    // Offres d'emploi
    const { data: jobs } = await supabase
      .from('job_postings')
      .select('id, titre_poste, created_at')
      .eq('statut', 'active')
      .order('created_at', { ascending: false })
      .limit(2000);

    if (jobs) {
      for (const job of jobs) {
        const slug = generateSlug(job.titre_poste);
        const shortId = job.id.substring(0, 8);
        xml += `  <url>\n    <loc>${domain}/job/${escapeXml(slug)}-${escapeXml(shortId)}</loc>\n    <lastmod>${toLastmod(job.created_at, today)}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.7</priority>\n  </url>\n`;
      }
    }

    // Evenements locaux
    const { data: events } = await supabase
      .from('evenements_locaux')
      .select('id, titre, created_at')
      .eq('est_valide', true)
      .order('created_at', { ascending: false })
      .limit(1000);

    if (events) {
      for (const ev of events) {
        const slug = generateSlug(ev.titre);
        const shortId = ev.id.substring(0, 8);
        xml += `  <url>\n    <loc>${domain}/event/${escapeXml(slug)}-${escapeXml(shortId)}</loc>\n    <lastmod>${toLastmod(ev.created_at, today)}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.7</priority>\n  </url>\n`;
      }
    }

    // Activites de loisirs
    const { data: loisirs } = await supabase
      .from('inscriptions_loisirs')
      .select('id, titre_nom_evenement, created_at')
      .order('created_at', { ascending: false })
      .limit(1000);

    if (loisirs) {
      for (const act of loisirs) {
        const slug = generateSlug(act.titre_nom_evenement);
        const shortId = act.id.substring(0, 8);
        xml += `  <url>\n    <loc>${domain}/loisir/${escapeXml(slug)}-${escapeXml(shortId)}</loc>\n    <lastmod>${toLastmod(act.created_at, today)}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.7</priority>\n  </url>\n`;
      }
    }

    xml += '\n</urlset>';

    console.log(`[sitemap] Generated: ${staticPages.length} static + ${seoSecteurSlugs.length} secteurs + ${seoGouvernoratSlugs.length} gouvernorats + ${seoMetierSlugs.length} metiers + ${seoVilleSlugs.length} villes + ${topMetiers.length * topVilles.length} combos + dynamic entries`);

    return new Response(xml, {
      status: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=7200',
      },
    });

  } catch (error) {
    console.error('[sitemap] Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
