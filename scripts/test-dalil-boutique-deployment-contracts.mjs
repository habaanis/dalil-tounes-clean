// Static readiness gates for a not-yet-deployed Boutique order backend.
// This checks migration and API contracts without connecting to a database.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read=p=>readFileSync(p,'utf8');
const registry=read('supabase/migrations/20261115223000_dalil_boutique_customer_orders.sql');
const safety=read('supabase/migrations/20261115224500_dalil_order_safety_constraints.sql');
const publicApi=read('supabase/functions/dalil-boutique-customer-submit/index.ts');
const merchantApi=read('supabase/functions/dalil-boutique-merchant-orders/index.ts');
const frontend=read('src/components/boutique/BoutiqueInteractive.tsx');
const merchantUi=read('src/components/boutique/BoutiqueCustomerOrders.tsx');
let count=0;
function check(label,condition){assert.ok(condition,label);console.log('PASS',label);count++}
check('private orders table with RLS',/CREATE TABLE public\.dalil_boutique_customer_orders\b/i.test(registry)&&/ALTER TABLE public\.dalil_boutique_customer_orders ENABLE ROW LEVEL SECURITY/i.test(registry));
check('no browser privileges for orders',/REVOKE ALL ON TABLE public\.dalil_boutique_customer_orders FROM PUBLIC, anon, authenticated/i.test(registry));
check('no browser privileges for limiter',/REVOKE ALL ON TABLE public\.dalil_boutique_customer_order_limits FROM PUBLIC,anon,authenticated/i.test(registry));
check('merchant ownership independently checked',/professional_profile_access/.test(merchantApi)&&/eq\("user_id",identity\.user\.id\)/.test(merchantApi));
check('merchant payment status is read only',!/\.update\(\{[^}]*payment_status/.test(merchantApi));
check('verified payment needed before merchant confirmation',/Verified deposit or full payment required/.test(merchantApi));
check('idempotency fingerprint constraint',/request_fingerprint text NOT NULL/.test(safety)&&/request_fingerprint:requestFingerprint/.test(publicApi));
check('payment evidence state constraint',/dalil_order_payment_state_exact_amount/.test(safety));
check('limited origin allow-list for both functions',publicApi.includes('https://dalil-tounes-pwa.vercel.app')&&merchantApi.includes('https://dalil-tounes-pwa.vercel.app')&&!publicApi.includes('https://lienora.fr')&&!merchantApi.includes('https://lienora.fr'));
check('both API routes enforce actual JSON byte size',publicApi.includes('new TextEncoder().encode(raw).length>8192')&&merchantApi.includes('new TextEncoder().encode(raw).length>8192'));
check('no unverified external payment CTA',!frontend.includes('href={payLink}')&&!frontend.includes('merchantPaymentLink('));
check('EUR checkout is explicitly blocked',frontend.includes("selected.currency !== 'TND'"));
check('server does not accept EUR until approved migration',publicApi.includes('product.currency!=="TND"')&&registry.includes("CHECK (currency = 'TND')"));
check('merchant UI hides reject after confirmation',merchantUi.includes("['received','in_progress'].includes(order.status)&&<button")&&merchantUi.includes("order.status==='confirmed'&&<button")&&merchantUi.includes("update(order,'cancelled')"));
check('optional date picker persists in customer request note',frontend.includes('type="date"')&&frontend.includes("const note = [requestedDate ? 'Date souhaitée : '+requestedDate")&&frontend.includes("contact:contact.trim(),note,"));
check('outdated dates rejected before customer API call',frontend.includes("requestedDate < localToday")&&frontend.includes("Sélectionnez une date d’événement valide"));
check('idempotency key refreshes after editing request fields',frontend.includes('const editRequest = () => { setRequestKey(crypto.randomUUID());') &&
  ['setName(event.target.value); editRequest();','setContact(event.target.value); editRequest();',
   'setRequestedDate(event.target.value); editRequest();','setDetails(event.target.value); editRequest();',
   'setQuantity(Math.max(1,Math.min(99,Number(event.target.value)||1))); editRequest();'].every(snippet=>frontend.includes(snippet)));
check('unchanged retry retains idempotency key',frontend.includes('idempotencyKey:requestKey')&&
  !frontend.includes('setRequestKey(crypto.randomUUID());\n    setSending(true)'));
check('cancellation warns about independent refund processing',merchantUi.includes("cancellationNotice")&&merchantUi.includes("ne déclenche aucun remboursement")&&merchantUi.includes("ne rembourse pas automatiquement le client"));
check('merchant cannot write payment evidence',merchantUi.includes("action:'update'")&&!merchantUi.includes("action:'mark_paid'")&&!merchantApi.includes('payment_status:status'));
check('live customer order intake requires explicit server flag',publicApi.includes('Deno.env.get("DALIL_BOUTIQUE_ORDERS_ENABLED")!=="true"'));
console.log(`${count}/${count} Boutique static pre-deployment contracts passed (no database calls).`);
