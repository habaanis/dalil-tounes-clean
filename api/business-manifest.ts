const DALIL_ICONS = [
  { src: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png', purpose: 'any maskable' },
  { src: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
];

const safeId = (value: string | null): string =>
  String(value || '').trim().replace(/[^a-zA-Z0-9-]/g, '');

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
      url.searchParams.set('tr', `w-${size},h-${size},fo-auto`);
      url.searchParams.set('dt-app', '4');
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

const PRODUCT_LABELS: Record<SupportedLanguage, string> = {
  fr: 'CV Business',
  ar: 'السيرة المهنية',
  en: 'Business CV',
  it: 'CV Business',
  ru: 'Business CV',
};

export default function handler(request: VercelRequest, response: VercelResponse) {
  const id = safeId(firstQueryValue(request.query?.id));
  const name = safeText(firstQueryValue(request.query?.name), 'CV Business');
  const logo = safeHttpsUrl(firstQueryValue(request.query?.logo));
  const lang = getLanguage(firstQueryValue(request.query?.lang));
  const palette = getPalette(firstQueryValue(request.query?.palette));

  if (!id) {
    response.status(400).json({ error: 'Missing business id' });
    return;
  }

  const appPath = `/qr-business/${id}`;
  const startUrl = `${appPath}?source=pwa&app=client&lang=${lang}&palette=${palette}`;
  const icons = logo
    ? [
        { src: sizedIconUrl(logo, 192), sizes: '192x192', purpose: 'any' },
        { src: sizedIconUrl(logo, 512), sizes: '512x512', purpose: 'any maskable' },
      ]
    : DALIL_ICONS;

  response.setHeader('Content-Type', 'application/manifest+json; charset=utf-8');
  response.setHeader('Cache-Control', 'no-store, max-age=0');
  response.status(200).json({
      id: appPath,
      name,
      short_name: name.slice(0, 30),
      description: `${name} — ${PRODUCT_LABELS[lang]} Dalil Tounes`,
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
