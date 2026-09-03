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

export default function handler(request: Request) {
  const url = new URL(request.url, 'https://dalil-tounes.com');
  const id = safeId(url.searchParams.get('id'));
  const name = safeText(url.searchParams.get('name'), 'CV Business');
  const logo = safeHttpsUrl(url.searchParams.get('logo'));

  if (!id) {
    return Response.json({ error: 'Missing business id' }, { status: 400 });
  }

  const startUrl = `/qr-business/${id}?source=pwa`;
  const icons = logo
    ? [
        { src: logo, sizes: '192x192', type: 'image/png', purpose: 'any' },
        { src: logo, sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
      ]
    : DALIL_ICONS;

  return new Response(
    JSON.stringify({
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
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/manifest+json; charset=utf-8',
        'Cache-Control': 'private, max-age=300',
      },
    },
  );
}
