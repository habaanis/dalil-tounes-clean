type StripeCheckoutSession = {
  id: string;
  payment_status?: string;
  status?: string;
  customer_details?: { email?: string | null } | null;
  customer_email?: string | null;
  client_reference_id?: string | null;
  metadata?: Record<string, string> | null;
};

function json(body: unknown, status = 200) {
  return Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } });
}

async function stripeRequest(path: string, secretKey: string) {
  return fetch(`https://api.stripe.com/v1/${path}`, {
    headers: { Authorization: `Bearer ${secretKey}` },
  });
}

export default async function handler(request: Request) {
  if (request.method !== 'GET') return json({ error: 'Method not allowed' }, 405);

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) return json({ error: 'Stripe is not configured' }, 503);

  const url = new URL(request.url);
  const sessionId = String(url.searchParams.get('session_id') || '').trim();
  if (!/^cs_[a-zA-Z0-9_]+$/.test(sessionId)) {
    return json({ error: 'Invalid session' }, 400);
  }

  const response = await stripeRequest(`checkout/sessions/${encodeURIComponent(sessionId)}`, secretKey);
  if (!response.ok) return json({ error: 'Unable to verify Stripe checkout' }, 502);

  const session = await response.json() as StripeCheckoutSession;
  const orderRef = session.metadata?.dalil_tounes_order_ref || session.client_reference_id || '';
  const offer = session.metadata?.dalil_tounes_offer || '';
  const paid = session.payment_status === 'paid' || session.payment_status === 'no_payment_required';

  return json({
    paid,
    paymentStatus: session.payment_status || '',
    checkoutStatus: session.status || '',
    orderRef,
    offer,
    email: session.customer_details?.email || session.customer_email || '',
  });
}
