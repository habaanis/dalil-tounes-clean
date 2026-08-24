import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const distDir = path.join(root, 'dist');
const indexPath = path.join(distDir, 'index.html');
const sourcePath = path.join(root, 'src', 'lib', 'seoLandingData.ts');

if (!fs.existsSync(indexPath)) {
  throw new Error('dist/index.html introuvable. Exécutez Vite avant ce script.');
}

const baseHtml = fs.readFileSync(indexPath, 'utf8');
const source = fs.readFileSync(sourcePath, 'utf8');
const ORIGIN = 'https://dalil-tounes.com';
const DEFAULT_IMAGE = `${ORIGIN}/images/logo_dalil_tounes_crop.png`;

function htmlEscape(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function extractArrayBlock(name, nextMarker) {
  const startMarker = `export const ${name}`;
  const start = source.indexOf(startMarker);
  if (start < 0) return '';
  const searchFrom = start + startMarker.length;
  const end = nextMarker ? source.indexOf(nextMarker, searchFrom) : source.length;
  return source.slice(start, end < 0 ? source.length : end);
}

function parseEntries(block, includeDescription = false) {
  const entries = [];
  const re = includeDescription
    ? /\{\s*slug:\s*'([^']+)'\s*,\s*label:\s*'((?:\\'|[^'])+)'\s*,\s*description:\s*'((?:\\'|[^'])+)'/g
    : /\{\s*slug:\s*'([^']+)'\s*,\s*label:\s*'((?:\\'|[^'])+)'/g;

  for (const match of block.matchAll(re)) {
    entries.push({
      slug: match[1],
      label: match[2].replaceAll("\\'", "'"),
      description: includeDescription ? match[3].replaceAll("\\'", "'") : undefined,
    });
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

function replaceOrInsertMeta(html, { title, description, canonical }) {
  const escapedTitle = htmlEscape(title);
  const escapedDescription = htmlEscape(description);
  const escapedCanonical = htmlEscape(canonical);

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

  if (!/<meta\s+name="robots"/i.test(out)) {
    out = out.replace('</head>', '    <meta name="robots" content="index, follow" />\n  </head>');
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

const metiers = parseEntries(extractArrayBlock('SEO_METIERS', 'export const SEO_VILLES'));
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

let metierVilleCount = 0;
for (const metier of metiers) {
  for (const ville of villes) {
    const route = `/${metier.slug}-${ville.slug}`;
    writePage(route, {
      title: `${metier.label} à ${ville.label} | Adresses et professionnels | Dalil Tounes`,
      description: `Trouvez des ${metier.label.toLowerCase()} à ${ville.label}. Consultez leurs informations, horaires et coordonnées sur Dalil Tounes.`,
      canonical: `${ORIGIN}${route}`,
    });
    metierVilleCount += 1;
  }
}

let sousCategorieVilleCount = 0;
for (const metier of metiers) {
  const entries = sousCategories.get(metier.slug) || [];
  for (const sousCategorie of entries) {
    for (const ville of villes) {
      const route = `/${metier.slug}-${sousCategorie.slug}-${ville.slug}`;
      writePage(route, {
        title: `${metier.label} ${sousCategorie.label} à ${ville.label} | Dalil Tounes`,
        description: `${metier.label} spécialisé en ${sousCategorie.label} à ${ville.label}. Découvrez les professionnels, leurs horaires et coordonnées sur Dalil Tounes.`,
        canonical: `${ORIGIN}${route}`,
      });
      sousCategorieVilleCount += 1;
    }
  }
}

console.log(`SEO HTML généré : ${metiers.length} métiers, ${villes.length} villes, ${secteurs.length} secteurs, ${gouvernorats.length} gouvernorats.`);
console.log(`Routes SEO courtes générées : ${metierVilleCount} métier-ville, ${sousCategorieVilleCount} spécialité-ville, ${writtenRoutes.size} routes SEO uniques au total.`);
