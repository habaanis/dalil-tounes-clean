import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const distDir = path.join(root, 'dist');
const indexPath = path.join(distDir, 'index.html');
const supabaseClientPath = path.join(root, 'src', 'lib', 'supabaseClient.ts');
const ORIGIN = 'https://dalil-tounes.com';
const DEFAULT_IMAGE = `${ORIGIN}/images/logo_dalil_tounes_crop.png`;

if (!fs.existsSync(indexPath)) {
  throw new Error('dist/index.html introuvable. Exécutez Vite avant ce script.');
}

const baseHtml = fs.readFileSync(indexPath, 'utf8');
const supabaseClientSource = fs.readFileSync(supabaseClientPath, 'utf8');

function htmlEscape(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function cleanText(value) {
  return String(value ?? '')
    .replace(/\s+/g, ' ')
    .trim();
}

function truncate(value, max = 160) {
  const text = cleanText(value);
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1).trimEnd()}…`;
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

function validSlug(value) {
  const slug = cleanText(value).replace(/^\/+|\/+$/g, '');
  if (!slug || slug.includes('/') || slug.includes('..')) return '';
  return slug;
}

function firstImage(value) {
  const raw = String(value ?? '');
  const match = raw.match(/https?:\/\/[^,\s]+/i)?.[0];
  return match ? match.replace(/[\\]+$/, '') : '';
}

function firstActivity(business) {
  const specialty = cleanText(business.sous_categories_texte)
    .replace(/^\{\}|^\[\]$/, '')
    .split(/[,;•|]/)
    .map((item) => item.trim())
    .find(Boolean);
  if (specialty) return specialty;

  if (Array.isArray(business.categorie)) {
    return cleanText(business.categorie.find(Boolean));
  }

  return cleanText(business.categorie);
}

function readPublicSupabaseConfig() {
  const fallbackUrl = supabaseClientSource.match(/const PROD_URL = "([^"]+)"/)?.[1];
  const fallbackKey = supabaseClientSource.match(/const PROD_KEY = "([^"]+)"/)?.[1];
  const envUrl = process.env.VITE_SUPABASE_URL;
  const envKey = process.env.VITE_SUPABASE_ANON_KEY;
  const useEnv = Boolean(envUrl?.includes('kmvjegbtroksjqaqliyv') && envKey);
  return { url: useEnv ? envUrl : fallbackUrl, key: useEnv ? envKey : fallbackKey };
}

async function fetchBusinesses() {
  const { url, key } = readPublicSupabaseConfig();
  if (!url || !key) throw new Error('configuration Supabase publique introuvable');

  const rows = [];
  const pageSize = 1000;
  for (let offset = 0; ; offset += pageSize) {
    const endpoint = new URL(`${url.replace(/\/$/, '')}/rest/v1/entreprise`);
    endpoint.searchParams.set(
      'select',
      'slug,nom,ville,categorie,sous_categories_texte,description,logo_url,image_url,telephone,adresse,site_web'
    );
    endpoint.searchParams.set('limit', String(pageSize));
    endpoint.searchParams.set('offset', String(offset));
    const response = await fetch(endpoint, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
    });
    if (!response.ok) throw new Error(`Supabase HTTP ${response.status}`);
    const page = await response.json();
    rows.push(...page);
    if (page.length < pageSize) break;
  }
  return rows;
}

function replaceMeta(html, { title, description, canonical, image, structuredData }) {
  const escapedTitle = htmlEscape(title);
  const escapedDescription = htmlEscape(description);
  const escapedCanonical = htmlEscape(canonical);
  const escapedImage = htmlEscape(image || DEFAULT_IMAGE);

  let out = html
    .replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapedTitle}</title>`)
    .replace(/<meta\s+name="description"\s+content="[^"]*"\s*\/?\s*>/i, `<meta name="description" content="${escapedDescription}" />`)
    .replace(/<meta\s+property="og:title"\s+content="[^"]*"\s*\/?\s*>/i, `<meta property="og:title" content="${escapedTitle}" />`)
    .replace(/<meta\s+property="og:description"\s+content="[^"]*"\s*\/?\s*>/i, `<meta property="og:description" content="${escapedDescription}" />`)
    .replace(/<meta\s+property="og:url"\s+content="[^"]*"\s*\/?\s*>/i, `<meta property="og:url" content="${escapedCanonical}" />`)
    .replace(/<meta\s+property="og:image"\s+content="[^"]*"\s*\/?\s*>/i, `<meta property="og:image" content="${escapedImage}" />`)
    .replace(/<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/?\s*>/i, `<meta name="twitter:title" content="${escapedTitle}" />`)
    .replace(/<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/?\s*>/i, `<meta name="twitter:description" content="${escapedDescription}" />`)
    .replace(/<meta\s+name="twitter:image"\s+content="[^"]*"\s*\/?\s*>/i, `<meta name="twitter:image" content="${escapedImage}" />`);

  if (/<link\s+rel="canonical"/i.test(out)) {
    out = out.replace(/<link\s+rel="canonical"\s+href="[^"]*"\s*\/?\s*>/i, `<link rel="canonical" href="${escapedCanonical}" />`);
  } else {
    out = out.replace('</head>', `    <link rel="canonical" href="${escapedCanonical}" />\n  </head>`);
  }

  if (/<meta\s+name="robots"/i.test(out)) {
    out = out.replace(/<meta\s+name="robots"\s+content="[^"]*"\s*\/?\s*>/i, '<meta name="robots" content="index, follow" />');
  } else {
    out = out.replace('</head>', '    <meta name="robots" content="index, follow" />\n  </head>');
  }

  const json = JSON.stringify(structuredData).replaceAll('</script', '<\\/script');
  out = out.replace('</head>', `    <script type="application/ld+json" data-dalil-business-seo>${json}</script>\n  </head>`);
  return out;
}

function buildSeo(business) {
  const name = cleanText(business.nom);
  if (!name) return null;

  const slug = validSlug(business.slug) || slugify(name);
  if (!slug) return null;

  const city = cleanText(business.ville);
  const citySlug = slugify(city);
  const route = citySlug ? `/entreprise/${citySlug}/${slug}` : `/entreprise/${slug}`;
  const canonical = `${ORIGIN}${route}`;
  const activity = firstActivity(business);
  const suppliedDescription = cleanText(business.description);
  const fallbackDescription = [
    `Découvrez ${name}`,
    activity ? `, ${activity}` : '',
    city ? ` à ${city}` : ' en Tunisie',
    ', ses informations professionnelles, coordonnées et services sur Dalil Tounes.',
  ].join('');
  const description = truncate(suppliedDescription || fallbackDescription, 165);
  const titleParts = [name];
  if (activity) titleParts.push(activity);
  if (city) titleParts.push(city);
  titleParts.push('Dalil Tounes');
  const title = truncate(titleParts.join(' | '), 70);
  const image = firstImage(business.image_url) || firstImage(business.logo_url) || DEFAULT_IMAGE;

  const address = {};
  if (cleanText(business.adresse)) address.streetAddress = cleanText(business.adresse);
  if (city) address.addressLocality = city;
  address.addressCountry = 'TN';

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name,
    url: canonical,
    description,
    image,
    ...(cleanText(business.telephone) ? { telephone: cleanText(business.telephone) } : {}),
    address: { '@type': 'PostalAddress', ...address },
    ...(city ? { areaServed: city } : {}),
    ...(cleanText(business.site_web) ? { sameAs: [cleanText(business.site_web)] } : {}),
  };

  return { route, title, description, canonical, image, structuredData };
}

const businesses = await fetchBusinesses();
let generated = 0;
let skipped = 0;

for (const business of businesses) {
  const seo = buildSeo(business);
  if (!seo) {
    skipped += 1;
    continue;
  }
  const cleanRoute = seo.route.replace(/^\/+|\/+$/g, '');
  const dir = path.join(distDir, ...cleanRoute.split('/'));
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), replaceMeta(baseHtml, seo));
  generated += 1;
}

console.log(`SEO fiches entreprises : ${generated} pages HTML générées, ${skipped} ignorées faute de nom/slug exploitable.`);
