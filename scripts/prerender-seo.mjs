import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { createClient } from '@supabase/supabase-js';

const DIST_DIR = join(process.cwd(), 'dist');
const TEMPLATE_PATH = join(DIST_DIR, 'index.html');
const DOMAIN = 'https://dalil-tounes.com';
const SUPABASE_URL = 'https://kmvjegbtroksjqaqliyv.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_LtS4rlNHzN52y7shlHyfVA_CTxbXuEj';
const PAGE_SIZE = 1000;

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function escapeJsonForHtml(value) {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}

function slugify(value) {
  return String(value ?? '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[œ]/g, 'oe')
    .replace(/[æ]/g, 'ae')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-+/g, '-');
}

function firstText(value) {
  if (Array.isArray(value)) return value.map(String).filter(Boolean).join(', ');
  return String(value ?? '').trim();
}

function firstUrl(value) {
  if (Array.isArray(value)) {
    return value.map(String).map(item => item.trim()).find(item => /^https?:\/\//i.test(item)) || '';
  }

  return String(value ?? '')
    .split(/[,;\n]+/)
    .map(item => item.trim())
    .find(item => /^https?:\/\//i.test(item)) || '';
}

function cleanDescription(value, fallback) {
  const text = String(value ?? '')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/^["'“”]+/, '')
    .replace(/["'“”]+$/, '');
  const selected = text || fallback;
  return selected.length > 160 ? `${selected.slice(0, 157).trim()}...` : selected;
}

function replaceOrInsertMeta(html, selectorRegex, replacement) {
  if (selectorRegex.test(html)) return html.replace(selectorRegex, replacement);
  return html.replace('</head>', `    ${replacement}\n  </head>`);
}

function buildSeoHtml(template, business) {
  const name = firstText(business.nom) || 'Entreprise';
  const ville = firstText(business.ville);
  const gouvernorat = firstText(business.gouvernorat);
  const category = firstText(business.categorie);
  const slug = firstText(business.slug) || slugify(name);
  const villeSlug = slugify(ville);
  const path = `/entreprise/${villeSlug}/${slug}`;
  const canonical = `${DOMAIN}${path}`;
  const locationLabel = [ville, gouvernorat].filter(Boolean).filter((value, index, values) => values.indexOf(value) === index).join(', ');
  const title = `${name}${ville ? ` à ${ville}` : ''} | Dalil Tounes`;
  const description = cleanDescription(
    business.description,
    `${name}${category ? ` — ${category}` : ''}${locationLabel ? ` à ${locationLabel}` : ''}. Coordonnées, services et informations professionnelles sur Dalil Tounes.`,
  );
  const image = firstUrl(business.image_url) || firstUrl(business.logo_url) || `${DOMAIN}/images/logo_dalil_tounes_crop.png`;
  const phone = firstText(business.telephone);
  const address = firstText(business.adresse);
  const rating = Number(business['Note Google Globale']);
  const reviewCount = Number(business['Compteur Avis Google']);

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${canonical}#business`,
    name,
    url: canonical,
    description,
    image,
    ...(category ? { category } : {}),
    ...(phone ? { telephone: phone } : {}),
    ...(address || ville || gouvernorat
      ? {
          address: {
            '@type': 'PostalAddress',
            ...(address ? { streetAddress: address } : {}),
            ...(ville ? { addressLocality: ville } : {}),
            ...(gouvernorat ? { addressRegion: gouvernorat } : {}),
            addressCountry: 'TN',
          },
        }
      : {}),
    ...(Number.isFinite(rating) && rating > 0 && Number.isFinite(reviewCount) && reviewCount > 0
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: Math.min(5, Math.max(0, rating)),
            reviewCount: Math.max(1, Math.floor(reviewCount)),
            bestRating: 5,
            worstRating: 1,
          },
        }
      : {}),
  };

  let html = template;
  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(title)}</title>`);
  html = replaceOrInsertMeta(
    html,
    /<meta\s+name=["']description["'][^>]*>/i,
    `<meta name="description" content="${escapeHtml(description)}" />`,
  );
  html = replaceOrInsertMeta(
    html,
    /<meta\s+property=["']og:title["'][^>]*>/i,
    `<meta property="og:title" content="${escapeHtml(title)}" />`,
  );
  html = replaceOrInsertMeta(
    html,
    /<meta\s+property=["']og:description["'][^>]*>/i,
    `<meta property="og:description" content="${escapeHtml(description)}" />`,
  );
  html = replaceOrInsertMeta(
    html,
    /<meta\s+property=["']og:image["'][^>]*>/i,
    `<meta property="og:image" content="${escapeHtml(image)}" />`,
  );
  html = replaceOrInsertMeta(
    html,
    /<meta\s+property=["']og:url["'][^>]*>/i,
    `<meta property="og:url" content="${escapeHtml(canonical)}" />`,
  );
  html = replaceOrInsertMeta(
    html,
    /<meta\s+name=["']twitter:title["'][^>]*>/i,
    `<meta name="twitter:title" content="${escapeHtml(title)}" />`,
  );
  html = replaceOrInsertMeta(
    html,
    /<meta\s+name=["']twitter:description["'][^>]*>/i,
    `<meta name="twitter:description" content="${escapeHtml(description)}" />`,
  );
  html = replaceOrInsertMeta(
    html,
    /<meta\s+name=["']twitter:image["'][^>]*>/i,
    `<meta name="twitter:image" content="${escapeHtml(image)}" />`,
  );

  if (/<link\s+rel=["']canonical["'][^>]*>/i.test(html)) {
    html = html.replace(/<link\s+rel=["']canonical["'][^>]*>/i, `<link rel="canonical" href="${escapeHtml(canonical)}" />`);
  } else {
    html = html.replace('</head>', `    <link rel="canonical" href="${escapeHtml(canonical)}" />\n  </head>`);
  }

  const schemaTag = `<script type="application/ld+json" data-dalil-prerender="business">${escapeJsonForHtml(schema)}</script>`;
  html = html.replace('</head>', `    ${schemaTag}\n  </head>`);

  const initialContent = `
    <main id="seo-prerender-business" aria-label="${escapeHtml(name)}" style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap">
      <h1>${escapeHtml(name)}${ville ? ` à ${escapeHtml(ville)}` : ''}</h1>
      ${category ? `<p>${escapeHtml(category)}</p>` : ''}
      <p>${escapeHtml(description)}</p>
      ${address ? `<p>${escapeHtml(address)}</p>` : ''}
      ${phone ? `<p>${escapeHtml(phone)}</p>` : ''}
    </main>`;
  html = html.replace('<div id="root"></div>', `${initialContent}\n    <div id="root"></div>`);

  return { html, path };
}

async function fetchPublishedBusinesses() {
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const rows = [];
  let offset = 0;

  while (true) {
    const { data, error } = await supabase
      .from('entreprise')
      .select('id, nom, slug, ville, gouvernorat, categorie, description, adresse, telephone, image_url, logo_url, statut_validation, "Note Google Globale", "Compteur Avis Google"')
      .ilike('statut_validation', 'publi%')
      .range(offset, offset + PAGE_SIZE - 1);

    if (error) throw error;
    const batch = data ?? [];
    rows.push(...batch);
    if (batch.length < PAGE_SIZE) break;
    offset += PAGE_SIZE;
  }

  return rows;
}

async function main() {
  let template;
  try {
    template = await readFile(TEMPLATE_PATH, 'utf8');
  } catch (error) {
    console.warn('[prerender-seo] dist/index.html unavailable; skipping prerender.', error);
    return;
  }

  let businesses;
  try {
    businesses = await fetchPublishedBusinesses();
  } catch (error) {
    console.warn('[prerender-seo] Unable to read published businesses; keeping normal Vite output.', error);
    return;
  }

  let generated = 0;
  let skipped = 0;

  for (const business of businesses) {
    const name = firstText(business.nom);
    const villeSlug = slugify(business.ville);
    const businessSlug = firstText(business.slug) || slugify(name);

    if (!name || !villeSlug || !businessSlug) {
      skipped += 1;
      continue;
    }

    const { html, path } = buildSeoHtml(template, business);
    const outputPath = join(DIST_DIR, path.replace(/^\//, ''), 'index.html');
    await mkdir(dirname(outputPath), { recursive: true });
    await writeFile(outputPath, html, 'utf8');
    generated += 1;
  }

  console.log(`[prerender-seo] Generated ${generated} business HTML pages; skipped ${skipped}.`);
}

await main();