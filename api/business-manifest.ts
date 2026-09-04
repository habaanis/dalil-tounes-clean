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
    }
    return url.toString();
  } catch {
    return value;
  }
};

const firstQueryValue = (value: string | string[] | undefined): string | null =>
  Array.isArray(value) ? value[0] || null : value || null;

export default function handler(request: VercelRequest, response: VercelResponse) {
  const id = safeId(firstQueryValue(request.query?.id));
  const name = safeText(firstQueryValue(request.query?.name), 'CV Business');
  const logo = safeHttpsUrl(firstQueryValue(request.query?.logo));

  if (!id) {
    response.status(400).json({ error: 'Missing business id' });
    return;
  }

  const startUrl = `/qr-business/${id}?source=pwa`;
  const icons = logo
    ? [
        { src: sizedIconUrl(logo, 192), sizes: '192x192', purpose: 'any' },
        { src: sizedIconUrl(logo, 512), sizes: '512x512', purpose: 'any maskable' },
      ]
    : DALIL_ICONS;

  response.setHeader('Content-Type', 'application/manifest+json; charset=utf-8');
  response.setHeader('Cache-Control', 'private, max-age=300');
  response.status(200).json({
      id: startUrl,
      name,
      short_name: name.slice(0, 30),
      description: `${name} — CV Business Dalil Tounes`,
      start_url: startUrl,
      scope: '/',
      display: 'standalone',
      orientation: 'portrait-primary',
      theme_color: '#032D21',
      background_color: '#032D21',
      lang: 'fr',
      dir: 'auto',
      categories: ['business'],
      icons,
      related_applications: [],
      prefer_related_applications: false,
  });
}
