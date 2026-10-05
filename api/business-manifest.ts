const DALIL_ICONS = [
  { src: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png', purpose: 'any maskable' },
  { src: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
];

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://kmvjegbtroksjqaqliyv.supabase.co';
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImttdmplZ2J0cm9rc2pxYXFsaXl2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE4MDA1NTEsImV4cCI6MjA2NzM3NjU1MX0.MbU7b-HWQBwlYtbJeE7_ABvrGhuhzeAuqvkcVvvoE1o';

const safeId = (value: string | null): string =>
  String(value || '').trim().replace(/[^a-zA-Z0-9\u00C0-\u024F-]/g, '').slice(0, 160);

const safeText = (value: string | null, fallback: string): string => {
  const text = String(value || '').trim().replace(/[<>]/g, '');
  return text.slice(0, 80) || fallback;
};

const safeHttpsUrl = (value: string | null): string => {
  const raw = String(value || '').trim();
  if (!raw) return '';
  try {
    const url = new URL(raw);
    return url.protocol === 'https:' ? url.toString() : '';
  } catch {
    return '';
  }
};

type VercelRequest = {
  query?: Record<string, string | string[] | undefined>;
};

type VercelResponse = {
  status: (code: number) => VercelResponse;
  setHeader: (name: string, value: string) => void;
  json: (body: unknown) => void;
};

const sizedIconUrl = (value: string, size: 192 | 512): string => {
  if (!value) return '';
  try {
    const url = new URL(value);
    if (url.hostname === 'ik.imagekit.io') {
      url.searchParams.set('tr', `w-${size},h-${size},fo-auto,f-png`);
      url.searchParams.set('dt-app', '6');
    }
    return url.toString();
  } catch {
    return value;
  }
};

const firstQueryValue = (value: string | string[] | undefined): string | null =>
  Array.isArray(value) ? value[0] || null : value || null;

type SupportedLanguage = 'fr' | 'ar' | 'en' | 'it' | 'ru';
type PaletteId = 'prestige' | 'ivory' | 'night';
type CvModel = 'business' | 'portfolio';

type BusinessManifestRecord = {
  id?: string | null;
  nom?: string | null;
  slug?: string | null;
  slug_court?: string | null;
  name_ar?: string | null;
  name_en?: string | null;
  name_it?: string | null;
  name_ru?: string | null;
  logo_url?: string | null;
  palette_cv?: string | null;
  modele_cv?: string | null;
};

const PALETTE_COLORS: Record<PaletteId, { theme: string; background: string }> = {
  prestige: { theme: '#032D21', background: '#032D21' },
  ivory: { theme: '#FFF8E7', background: '#FFF8E7' },
  night: { theme: '#10243A', background: '#10243A' },
};

const getPalette = (value: string | null): PaletteId => {
  const normalized = String(value || '').trim().toLowerCase();
  return normalized === 'ivory' || normalized === 'night' ? normalized : 'prestige';
};

const getLanguage = (value: string | null): SupportedLanguage => {
  const language = String(value || '').trim().toLowerCase();
  return ['fr', 'ar', 'en', 'it', 'ru'].includes(language)
    ? language as SupportedLanguage
    : 'fr';
};

const getModel = (value: string | null): CvModel =>
  String(value || '').trim().toLowerCase().includes('portfolio') ? 'portfolio' : 'business';

const PRODUCT_LABELS: Record<SupportedLanguage, Record<CvModel, string>> = {
  fr: { business: 'CV Business', portfolio: 'CV Portfolio' },
  ar: { business: 'CV Business', portfolio: 'CV Portfolio' },
  en: { business: 'CV Business', portfolio: 'CV Portfolio' },
  it: { business: 'CV Business', portfolio: 'CV Portfolio' },
  ru: { business: 'CV Business', portfolio: 'CV Portfolio' },
};

const localizedBusinessName = (business: BusinessManifestRecord | null, language: SupportedLanguage): string | null => {
  if (!business) return null;
  const localized = language === 'ar'
    ? business.name_ar
    : language === 'en'
      ? business.name_en
      : language === 'it'
        ? business.name_it
        : language === 'ru'
          ? business.name_ru
          : business.nom;
  return localized || business.nom || null;
};

async function fetchBusiness(id: string): Promise<BusinessManifestRecord | null> {
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
  const filters: Array<'id' | 'slug' | 'slug_court'> = isUuid ? ['id'] : ['slug_court', 'slug'];

  for (const field of filters) {
    const query = new URLSearchParams({
      select: 'id,nom,slug,slug_court,name_ar,name_en,name_it,name_ru,logo_url,palette_cv,modele_cv',
      [field]: `eq.${id}`,
      limit: '1',
    });
    try {
      const result = await fetch(`${SUPABASE_URL}/rest/v1/entreprise?${query.toString()}`, {
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
      });
      if (!result.ok) continue;
      const rows = await result.json() as BusinessManifestRecord[];
      if (rows[0]) return rows[0];
    } catch {
      // The manifest remains valid with generic fallbacks if Supabase is unavailable.
    }
  }

  return null;
}

export default async function handler(request: VercelRequest, response: VercelResponse) {
  const id = safeId(firstQueryValue(request.query?.id));
  const lang = getLanguage(firstQueryValue(request.query?.lang));
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);

  if (!id) {
    response.status(400).json({ error: 'Missing business id' });
    return;
  }

  const requestedName = safeText(firstQueryValue(request.query?.name), '');
  const requestedLogo = safeHttpsUrl(firstQueryValue(request.query?.logo));
  const requestedPalette = firstQueryValue(request.query?.palette);
  const requestedModel = firstQueryValue(request.query?.model);
  const requestedAppSlug = safeId(firstQueryValue(request.query?.app_slug));
  const hasPersonalName = Boolean(requestedName && requestedName.toLowerCase() !== 'cv business');
  const business = hasPersonalName && requestedLogo && requestedPalette && requestedModel
    ? null
    : await fetchBusiness(id);
  const name = requestedName && requestedName.toLowerCase() !== 'cv business'
    ? requestedName
    : safeText(localizedBusinessName(business, lang), 'CV Business');
  const logo = requestedLogo || safeHttpsUrl(business?.logo_url || null);
  const palette = getPalette(requestedPalette || business?.palette_cv || null);
  const model = getModel(requestedModel || business?.modele_cv || null);

  const resolvedAppSlug = requestedAppSlug
    || safeId(business?.slug_court || business?.slug || (!isUuid ? id : null));
  const appPath = resolvedAppSlug
    ? `/${encodeURIComponent(resolvedAppSlug)}`
    : `/qr-business/${encodeURIComponent(id)}`;
  const startUrl = `${appPath}?source=pwa&app=client&lang=${lang}&palette=${palette}`;
  const shortName = name.length <= 12
    ? name
    : name.split(/\s+/).slice(0, 2).join(' ').slice(0, 12);
  const icons = logo
      ? [
        { src: sizedIconUrl(logo, 192), sizes: '192x192', type: 'image/png', purpose: 'any' },
        { src: sizedIconUrl(logo, 512), sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
      ]
    : DALIL_ICONS;

  response.setHeader('Content-Type', 'application/manifest+json; charset=utf-8');
  response.setHeader('Cache-Control', 'no-store, max-age=0');
  response.status(200).json({
      id: appPath,
      name,
      short_name: shortName,
      description: `${name} — ${PRODUCT_LABELS[lang][model]}`,
      start_url: startUrl,
      scope: appPath,
      launch_handler: { client_mode: 'navigate-new' },
      display: 'standalone',
      orientation: 'portrait-primary',
      theme_color: PALETTE_COLORS[palette].theme,
      background_color: PALETTE_COLORS[palette].background,
      lang,
      dir: lang === 'ar' ? 'rtl' : 'ltr',
      categories: ['business'],
      icons,
      related_applications: [],
      prefer_related_applications: false,
  });
}
