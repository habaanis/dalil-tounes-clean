type CheckoutOffer =
  | 'artisan_monthly'
  | 'artisan_annual'
  | 'premium_monthly'
  | 'premium_annual'
  | 'cv_essential'
  | 'cv_complete';

type PriceExpectation = {
  priceId: string;
  mode: 'payment' | 'subscription';
  unitAmount: number;
  interval?: 'month' | 'year';
};

const PRICE_CONFIG: Record<CheckoutOffer, PriceExpectation> = {
  artisan_monthly: { priceId: 'price_1TtSXXP0Sa7CREYI3NQWRij7', mode: 'subscription', unitAmount: 890, interval: 'month' },
  artisan_annual: { priceId: 'price_1U0ic4P0Sa7CREYIn2Tb78b0', mode: 'subscription', unitAmount: 8900, interval: 'year' },
  premium_monthly: { priceId: 'price_1TtSnBP0Sa7CREYI5JPtxP57', mode: 'subscription', unitAmount: 1790, interval: 'month' },
  premium_annual: { priceId: 'price_1U0iXAP0Sa7CREYIwfRnDgP3', mode: 'subscription', unitAmount: 17500, interval: 'year' },
  cv_essential: { priceId: 'price_1U0hpWP0Sa7CREYIK1SsoDNn', mode: 'payment', unitAmount: 2300 },
  cv_complete: { priceId: 'price_1U0i8jP0Sa7CREYI5PilQZeQ', mode: 'payment', unitAmount: 5900 },
};

type StripePrice = {
  active: boolean;
  currency: string;
  unit_amount: number | null;
  recurring: { interval?: string } | null;
};

function json(body: unknown, status = 200) {
  return Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } });
}

function checkoutOrigin(request: Request): string {
  if (process.env.VERCEL_ENV === 'production') return 'https://dalil-tounes.com';

  const origin = request.headers.get('origin');
  if (!origin) return 'https://dalil-tounes.com';

  try {
    const url = new URL(origin);
    const isLocal = url.hostname === 'localhost' || url.hostname === '127.0.0.1';
    const isPreview = url.protocol === 'https:' && url.hostname.endsWith('.vercel.app');
    return isLocal || isPreview ? url.origin : 'https://dalil-tounes.com';
  } catch {
    return 'https://dalil-tounes.com';
  }
}

function safeReference(value: unknown): string {
  const text = String(value || '').trim();
  return /^[a-zA-Z0-9-]{8,100}$/.test(text) ? text : '';
}

async function stripeRequest(path: string, secretKey: string, init?: RequestInit) {
  return fetch(`https://api.stripe.com/v1/${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${secretKey}`,
      ...(init?.headers ?? {}),
    },
  });
}

export default async function handler(request: Request) {
  if (request.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) return json({ error: 'Stripe is not configured' }, 503);

  let payload: { offer?: string; email?: string; orderRef?: string; requestId?: string };
  try {
    payload = await request.json();
  } catch {
    return json({ error: 'Invalid request' }, 400);
  }

  if (!payload.offer || !(payload.offer in PRICE_CONFIG)) {
    return json({ error: 'Invalid offer' }, 400);
  }

  const offer = payload.offer as CheckoutOffer;
  const expected = PRICE_CONFIG[offer];
  const priceResponse = await stripeRequest(`prices/${expected.priceId}`, secretKey);
  if (!priceResponse.ok) return json({ error: 'Unable to validate Stripe price' }, 502);

  const price = await priceResponse.json() as StripePrice;
  const interval = price.recurring?.interval;
  const validPrice = price.active
    && price.currency.toLowerCase() === 'eur'
    && price.unit_amount === expected.unitAmount
    && (expected.mode === 'payment' ? price.recurring === null : interval === expected.interval);

  if (!validPrice) return json({ error: 'Stripe price configuration does not match the expected offer' }, 409);

  const origin = checkoutOrigin(request);
  const orderRef = safeReference(payload.orderRef || payload.requestId);
  const successUrl = new URL('/paiement/confirmation', origin);
  successUrl.searchParams.set('provider', 'stripe');
  successUrl.searchParams.set('session_id', '{CHECKOUT_SESSION_ID}');
  if (orderRef) successUrl.searchParams.set('order_ref', orderRef);

  const cancelUrl = new URL('/subscription', origin);
  cancelUrl.searchParams.set('checkout', 'cancelled');

  const form = new URLSearchParams({
    mode: expected.mode,
    'line_items[0][price]': expected.priceId,
    'line_items[0][quantity]': '1',
    success_url: successUrl.toString(),
    cancel_url: cancelUrl.toString(),
    locale: 'auto',
    'metadata[dalil_tounes_offer]': offer,
  });

  if (orderRef) {
    form.set('client_reference_id', orderRef);
    form.set('metadata[dalil_tounes_order_ref]', orderRef);
  }

  if (payload.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
    form.set('customer_email', payload.email.slice(0, 180));
  }

  const checkoutResponse = await stripeRequest('checkout/sessions', secretKey, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: form,
  });
  const checkout = await checkoutResponse.json() as { url?: string };

  if (!checkoutResponse.ok || !checkout.url) {
    return json({ error: 'Unable to create Stripe Checkout session' }, 502);
  }

  return json({ url: checkout.url });
}
