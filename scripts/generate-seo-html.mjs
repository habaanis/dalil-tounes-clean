import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const distDir = path.join(root, 'dist');
const indexPath = path.join(distDir, 'index.html');
const sourcePath = path.join(root, 'src', 'lib', 'seoLandingData.ts');
const supabaseClientPath = path.join(root, 'src', 'lib', 'supabaseClient.ts');
const shortRoutesManifestPath = path.join(distDir, 'seo-short-routes.json');

if (!fs.existsSync(indexPath)) {
  throw new Error('dist/index.html introuvable. Exécutez Vite avant ce script.');
}

const baseHtml = fs.readFileSync(indexPath, 'utf8');
const source = fs.readFileSync(sourcePath, 'utf8');
const supabaseClientSource = fs.readFileSync(supabaseClientPath, 'utf8');
const ORIGIN = 'https://dalil-tounes.com';
const DEFAULT_IMAGE = `${ORIGIN}/images/logo_dalil_tounes_crop.png`;
const MIN_INDEXABLE_BUSINESSES = 3;

function htmlEscape(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function normalize(value) {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

function extractArrayBlock(name, nextMarker) {
  const startMarker = `export const ${name}`;
  const start = source.indexOf(startMarker);
  if (start < 0) return '';
  const searchFrom = start + startMarker.length;
  const end = nextMarker ? source.indexOf(nextMarker, searchFrom) : source.length;
  return source.slice(start, end < 0 ? source.length : end);
}

function parseEntries(block, includeDescription = false, includeValue = false) {
  const entries = [];
  const objectRe = /\{([\s\S]*?)\}/g;
  for (const match of block.matchAll(objectRe)) {
    const object = match[1];
    const slug = object.match(/slug:\s*'([^']+)'/)?.[1];
    const label = object.match(/label:\s*'((?:\\'|[^'])+)'/)?.[1]?.replaceAll("\\'", "'");
    if (!slug || !label) continue;
    const description = includeDescription
      ? object.match(/description:\s*'((?:\\'|[^'])+)'/)?.[1]?.replaceAll("\\'", "'")
      : undefined;
    const value = includeValue
      ? object.match(/value:\s*'((?:\\'|[^'])+)'/)?.[1]?.replaceAll("\\'", "'")
      : undefined;
    entries.push({ slug, label, description, value: value || label });
  }
  return entries;
}

function parseSousCategories() {
  const block = extractArrayBlock('SEO_SOUS_CATEGORIES', 'export interface SecteurEntry');
  const result = new Map();
  const groupRe = /(?:'([^']+)'|([a-zA-Z0-9-]+))\s*:\s*\[([\s\S]*?)\],/g;

  for (const match of block.matchAll(groupRe)) {
    const metierSlug = match[1] || match[2];
    const entries = parseEntries(match[3]);
    if (metierSlug && entries.length > 0) result.set(metierSlug, entries);
  }

  return result;
}

function replaceOrInsertMeta(html, { title, description, canonical, robots = 'index, follow' }) {
  const escapedTitle = htmlEscape(title);
  const escapedDescription = htmlEscape(description);
  const escapedCanonical = htmlEscape(canonical);
  const escapedRobots = htmlEscape(robots);

  let out = html
    .replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapedTitle}</title>`)
    .replace(/<meta\s+name="description"\s+content="[^"]*"\s*\/?\s*>/i, `<meta name="description" content="${escapedDescription}" />`)
    .replace(/<meta\s+property="og:title"\s+content="[^"]*"\s*\/?\s*>/i, `<meta property="og:title" content="${escapedTitle}" />`)
    .replace(/<meta\s+property="og:description"\s+content="[^"]*"\s*\/?\s*>/i, `<meta property="og:description" content="${escapedDescription}" />`)
    .replace(/<meta\s+property="og:url"\s+content="[^"]*"\s*\/?\s*>/i, `<meta property="og:url" content="${escapedCanonical}" />`)
    .replace(/<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/?\s*>/i, `<meta name="twitter:title" content="${escapedTitle}" />`)
    .replace(/<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/?\s*>/i, `<meta name="twitter:description" content="${escapedDescription}" />`);

  if (/<link\s+rel="canonical"/i.test(out)) {
    out = out.replace(/<link\s+rel="canonical"\s+href="[^"]*"\s*\/?\s*>/i, `<link rel="canonical" href="${escapedCanonical}" />`);
  } else {
    out = out.replace('</head>', `    <link rel="canonical" href="${escapedCanonical}" />\n  </head>`);
  }

  if (/<meta\s+name="robots"/i.test(out)) {
    out = out.replace(/<meta\s+name="robots"\s+content="[^"]*"\s*\/?\s*>/i, `<meta name="robots" content="${escapedRobots}" />`);
  } else {
    out = out.replace('</head>', `    <meta name="robots" content="${escapedRobots}" />\n  </head>`);
  }

  if (!/<meta\s+property="og:image"/i.test(out)) {
    out = out.replace('</head>', `    <meta property="og:image" content="${DEFAULT_IMAGE}" />\n  </head>`);
  }

  return out;
}

const writtenRoutes = new Set();
function writePage(route, meta) {
  const cleanRoute = route.replace(/^\/+|\/+$/g, '');
  const dir = path.join(distDir, ...cleanRoute.split('/'));
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), replaceOrInsertMeta(baseHtml, meta));
  writtenRoutes.add(route);
}

function readPublicSupabaseConfig() {
  const fallbackUrl = supabaseClientSource.match(/const PROD_URL = "([^"]+)"/)?.[1];
  const fallbackKey = supabaseClientSource.match(/const PROD_KEY = "([^"]+)"/)?.[1];
  const envUrl = process.env.VITE_SUPABASE_URL;
  const envKey = process.env.VITE_SUPABASE_ANON_KEY;
  const useEnv = Boolean(envUrl?.includes('kmvjegbtroksjqaqliyv') && envKey);
  return { url: useEnv ? envUrl : fallbackUrl, key: useEnv ? envKey : fallbackKey };
}

async function fetchSeoBusinessRows() {
  const { url, key } = readPublicSupabaseConfig();
  if (!url || !key) throw new Error('configuration Supabase publique introuvable');
  const rows = [];
  const pageSize = 1000;
  for (let offset = 0; ; offset += pageSize) {
    const endpoint = new URL(`${url.replace(/\/$/, '')}/rest/v1/entreprise`);
    endpoint.searchParams.set('select', 'ville,sous_categories_texte');
    endpoint.searchParams.set('limit', String(pageSize));
    endpoint.searchParams.set('offset', String(offset));
    const response = await fetch(endpoint, { headers: { apikey: key, Authorization: `Bearer ${key}` } });
    if (!response.ok) throw new Error(`Supabase HTTP ${response.status}`);
    const page = await response.json();
    rows.push(...page);
    if (page.length < pageSize) break;
  }
  return rows.map((row) => ({
    ville: normalize(row.ville),
    sousCategories: normalize(row.sous_categories_texte),
  }));
}

function countMatchingBusinesses(rows, metierValue, villeLabel, sousCategorieLabel = null) {
  const metierNeedle = normalize(metierValue);
  const villeNeedle = normalize(villeLabel);
  const sousCategorieNeedle = sousCategorieLabel ? normalize(sousCategorieLabel) : null;
  if (!metierNeedle || !villeNeedle) return 0;

  let count = 0;
  for (const row of rows) {
    if (!row.ville.includes(villeNeedle)) continue;
    if (!row.sousCategories.includes(metierNeedle)) continue;
    if (sousCategorieNeedle && !row.sousCategories.includes(sousCategorieNeedle)) continue;
    count += 1;
  }
  return count;
}

const metiers = parseEntries(extractArrayBlock('SEO_METIERS', 'export const SEO_VILLES'), false, true);
const villes = parseEntries(extractArrayBlock('SEO_VILLES', 'export const SEO_SOUS_CATEGORIES'));
const sousCategories = parseSousCategories();
const secteurs = parseEntries(extractArrayBlock('SEO_SECTEURS', 'const SECTEUR_LABEL_TO_SLUG'), true);
const gouvernorats = parseEntries(extractArrayBlock('SEO_GOUVERNORATS', 'export const SEO_'), true);

for (const item of metiers) {
  const route = `/metier/${item.slug}`;
  writePage(route, {
    title: `${item.label} en Tunisie | Professionnels et entreprises | Dalil Tounes`,
    description: `Trouvez des ${item.label.toLowerCase()} en Tunisie, consultez leurs informations professionnelles et découvrez leur CV Business sur Dalil Tounes.`,
    canonical: `${ORIGIN}${route}`,
  });
}
for (const item of villes) {
  const route = `/ville/${item.slug}`;
  writePage(route, {
    title: `Entreprises et professionnels à ${item.label} | Dalil Tounes`,
    description: `Découvrez les entreprises, artisans, commerces et professionnels présents à ${item.label} sur Dalil Tounes.`,
    canonical: `${ORIGIN}${route}`,
  });
}
for (const item of secteurs) {
  const route = `/secteur/${item.slug}`;
  writePage(route, {
    title: `${item.label} en Tunisie | Entreprises et professionnels | Dalil Tounes`,
    description: item.description || `Découvrez les professionnels du secteur ${item.label} en Tunisie sur Dalil Tounes.`,
    canonical: `${ORIGIN}${route}`,
  });
}
for (const item of gouvernorats) {
  const route = `/gouvernorat/${item.slug}`;
  writePage(route, {
    title: `Entreprises dans le gouvernorat de ${item.label} | Dalil Tounes`,
    description: item.description || `Découvrez les entreprises et professionnels du gouvernorat de ${item.label} sur Dalil Tounes.`,
    canonical: `${ORIGIN}${route}`,
  });
}

let businessRows = [];
try {
  businessRows = await fetchSeoBusinessRows();
} catch (error) {
  console.warn(`[seo-short-routes] Comptage Supabase indisponible : ${error instanceof Error ? error.message : String(error)}`);
}

const manifest = [];
let metierVilleCount = 0;
let metierVilleIndexable = 0;
for (const metier of metiers) {
  for (const ville of villes) {
    const route = `/${metier.slug}-${ville.slug}`;
    const businessCount = countMatchingBusinesses(businessRows, metier.value, ville.label);
    const indexable = businessCount >= MIN_INDEXABLE_BUSINESSES;
    writePage(route, {
      title: `${metier.label} à ${ville.label} | Adresses et professionnels | Dalil Tounes`,
      description: `Trouvez des ${metier.label.toLowerCase()} à ${ville.label}. Consultez leurs informations, horaires et coordonnées sur Dalil Tounes.`,
      canonical: `${ORIGIN}${route}`,
      robots: indexable ? 'index, follow' : 'noindex, follow',
    });
    manifest.push({ route, type: 'metier-ville', businessCount, indexable });
    metierVilleCount += 1;
    if (indexable) metierVilleIndexable += 1;
  }
}

let sousCategorieVilleCount = 0;
let sousCategorieVilleIndexable = 0;
for (const metier of metiers) {
  const entries = sousCategories.get(metier.slug) || [];
  for (const sousCategorie of entries) {
    for (const ville of villes) {
      const route = `/${metier.slug}-${sousCategorie.slug}-${ville.slug}`;
      const businessCount = countMatchingBusinesses(businessRows, metier.value, ville.label, sousCategorie.label);
      const indexable = businessCount >= MIN_INDEXABLE_BUSINESSES;
      writePage(route, {
        title: `${metier.label} ${sousCategorie.label} à ${ville.label} | Dalil Tounes`,
        description: `${metier.label} spécialisé en ${sousCategorie.label} à ${ville.label}. Découvrez les professionnels, leurs horaires et coordonnées sur Dalil Tounes.`,
        canonical: `${ORIGIN}${route}`,
        robots: indexable ? 'index, follow' : 'noindex, follow',
      });
      manifest.push({ route, type: 'specialite-ville', businessCount, indexable });
      sousCategorieVilleCount += 1;
      if (indexable) sousCategorieVilleIndexable += 1;
    }
  }
}

fs.writeFileSync(shortRoutesManifestPath, JSON.stringify({
  generatedAt: new Date().toISOString(),
  minIndexableBusinesses: MIN_INDEXABLE_BUSINESSES,
  routes: manifest,
}, null, 2));

console.log(`SEO HTML généré : ${metiers.length} métiers, ${villes.length} villes, ${secteurs.length} secteurs, ${gouvernorats.length} gouvernorats.`);
console.log(`Routes SEO courtes : ${metierVilleIndexable}/${metierVilleCount} métier-ville indexables, ${sousCategorieVilleIndexable}/${sousCategorieVilleCount} spécialité-ville indexables (seuil ${MIN_INDEXABLE_BUSINESSES}).`);
console.log(`Routes SEO uniques générées : ${writtenRoutes.size}.`);
