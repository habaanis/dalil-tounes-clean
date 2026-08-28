import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const distDir = path.join(root, 'dist');
const sourcePath = path.join(root, 'src', 'lib', 'seoLandingData.ts');
const supabaseClientPath = path.join(root, 'src', 'lib', 'supabaseClient.ts');
const shortRoutesManifestPath = path.join(distDir, 'seo-short-routes.json');
const ORIGIN = 'https://dalil-tounes.com';
const TODAY = new Date().toISOString().split('T')[0];

const source = fs.readFileSync(sourcePath, 'utf8');
const supabaseClientSource = fs.readFileSync(supabaseClientPath, 'utf8');

function xmlEscape(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

function slugify(value) {
  return String(value ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-+/g, '-');
}

function extractArrayBlock(name, nextMarker) {
  const startMarker = `export const ${name}`;
  const start = source.indexOf(startMarker);
  if (start < 0) return '';
  const searchFrom = start + startMarker.length;
  const end = nextMarker ? source.indexOf(nextMarker, searchFrom) : source.length;
  return source.slice(start, end < 0 ? source.length : end);
}

function parseSlugs(block) {
  return Array.from(block.matchAll(/\{\s*slug:\s*'([^']+)'/g), match => match[1]);
}

function readPublicSupabaseConfig() {
  const fallbackUrl = supabaseClientSource.match(/const PROD_URL = "([^"]+)"/)?.[1];
  const fallbackKey = supabaseClientSource.match(/const PROD_KEY = "([^"]+)"/)?.[1];
  const envUrl = process.env.VITE_SUPABASE_URL;
  const envKey = process.env.VITE_SUPABASE_ANON_KEY;
  const useEnv = Boolean(envUrl?.includes('kmvjegbtroksjqaqliyv') && envKey);
  return {
    url: useEnv ? envUrl : fallbackUrl,
    key: useEnv ? envKey : fallbackKey,
  };
}

const metiers = parseSlugs(extractArrayBlock('SEO_METIERS', 'export const SEO_VILLES'));
const villes = parseSlugs(extractArrayBlock('SEO_VILLES', 'export const SEO_SOUS_CATEGORIES'));
const secteurs = parseSlugs(extractArrayBlock('SEO_SECTEURS', 'const SECTEUR_LABEL_TO_SLUG'));
const gouvernorats = parseSlugs(extractArrayBlock('SEO_GOUVERNORATS', 'export const SEO_'));

const entries = new Map();
function add(route, priority = '0.7', changefreq = 'weekly', lastmod = TODAY) {
  if (!route || entries.has(route)) return;
  entries.set(route, { route, priority, changefreq, lastmod });
}

const corePages = [
  ['/', '1.0', 'daily'], ['/businesses', '0.9', 'daily'], ['/jobs', '0.8', 'daily'],
  ['/citizens', '0.8', 'weekly'], ['/citizens/health', '0.8', 'weekly'], ['/citizens/leisure', '0.8', 'weekly'],
  ['/citizens/admin', '0.7', 'weekly'], ['/citizens/shops', '0.8', 'weekly'], ['/citizens/services', '0.8', 'weekly'],
  ['/citizens/tourism', '0.8', 'weekly'], ['/education', '0.8', 'weekly'], ['/culture-events', '0.8', 'daily'],
  ['/around-me', '0.7', 'daily'], ['/inscription-entreprise', '0.8', 'monthly'],
  ['/subscription', '0.8', 'monthly'], ['/concept', '0.7', 'monthly'], ['/pourquoi-dalil-tounes', '0.7', 'monthly'],
  ['/partner-directory', '0.6', 'weekly'], ['/business-events', '0.6', 'weekly'], ['/besoins-professionnels', '0.7', 'daily'],
  ['/blog', '0.7', 'weekly'], ['/contact', '0.5', 'monthly'], ['/mentions-legales', '0.3', 'yearly'],
  ['/cgu', '0.3', 'yearly'], ['/politique-confidentialite', '0.3', 'yearly'], ['/info-avis', '0.4', 'yearly'],
  ['/plan-du-site', '0.3', 'monthly'],
];
for (const [route, priority, changefreq] of corePages) add(route, priority, changefreq);
for (const slug of metiers) add(`/metier/${slug}`, '0.75', 'weekly');
for (const slug of villes) add(`/ville/${slug}`, '0.75', 'weekly');
for (const slug of secteurs) add(`/secteur/${slug}`, '0.8', 'weekly');
for (const slug of gouvernorats) add(`/gouvernorat/${slug}`, '0.8', 'weekly');

let shortRouteCount = 0;
if (fs.existsSync(shortRoutesManifestPath)) {
  try {
    const manifest = JSON.parse(fs.readFileSync(shortRoutesManifestPath, 'utf8'));
    for (const item of manifest.routes || []) {
      if (!item?.indexable || !item?.route) continue;
      add(item.route, item.type === 'metier-ville' ? '0.78' : '0.72', 'weekly');
      shortRouteCount += 1;
    }
  } catch (error) {
    console.warn(`[sitemap] Manifeste SEO court illisible : ${error instanceof Error ? error.message : String(error)}`);
  }
}

async function fetchBusinesses() {
  const { url: supabaseUrl, key: anonKey } = readPublicSupabaseConfig();
  if (!supabaseUrl || !anonKey) throw new Error('configuration Supabase publique introuvable');

  const rows = [];
  const pageSize = 1000;
  for (let offset = 0; ; offset += pageSize) {
    const endpoint = new URL(`${supabaseUrl.replace(/\/$/, '')}/rest/v1/entreprise`);
    endpoint.searchParams.set('select', 'slug,nom,ville,updated_at,is_premium');
    endpoint.searchParams.set('order', 'updated_at.desc.nullslast');
    endpoint.searchParams.set('limit', String(pageSize));
    endpoint.searchParams.set('offset', String(offset));
    const response = await fetch(endpoint, { headers: { apikey: anonKey, Authorization: `Bearer ${anonKey}` } });
    if (!response.ok) throw new Error(`Supabase HTTP ${response.status}`);
    const page = await response.json();
    rows.push(...page);
    if (page.length < pageSize) break;
  }
  return rows;
}

let businessCount = 0;
let skippedBusinessCount = 0;
try {
  const businesses = await fetchBusinesses();
  for (const business of businesses) {
    const businessName = String(business.nom ?? '').trim();
    if (!businessName) {
      skippedBusinessCount += 1;
      continue;
    }
    const businessSlug = business.slug || slugify(businessName);
    if (!businessSlug) {
      skippedBusinessCount += 1;
      continue;
    }
    const villeSlug = slugify(business.ville);
    const route = villeSlug ? `/entreprise/${villeSlug}/${businessSlug}` : `/entreprise/${businessSlug}`;
    const lastmod = business.updated_at ? new Date(business.updated_at).toISOString().split('T')[0] : TODAY;
    add(route, business.is_premium ? '0.9' : '0.7', 'weekly', lastmod);
    businessCount += 1;
  }
} catch (error) {
  console.warn(`[sitemap] Entreprises dynamiques non chargées: ${error instanceof Error ? error.message : String(error)}`);
}

const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...Array.from(entries.values()).map(({ route, priority, changefreq, lastmod }) =>
    `  <url>\n    <loc>${xmlEscape(`${ORIGIN}${route}`)}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`
  ),
  '</urlset>',
  '',
].join('\n');

fs.writeFileSync(path.join(distDir, 'sitemap.xml'), xml);
fs.rmSync(shortRoutesManifestPath, { force: true });
console.log(`Sitemap généré : ${entries.size} URLs, dont ${businessCount} entreprises nommées, ${shortRouteCount} routes SEO courtes solides et ${skippedBusinessCount} entreprises incomplètes exclues.`);
