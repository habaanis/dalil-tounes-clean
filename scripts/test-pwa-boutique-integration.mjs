// Read-only integration contracts for the Dalil platform PWA Boutique.
// Does not connect to Supabase and never creates a customer order.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const read=p=>readFileSync(p,'utf8');
const routes=read('src/AppRouter.tsx');
const dashboard=read('src/pages/CompanyDashboard.tsx');
const storefront=read('src/components/boutique/BoutiqueInteractive.tsx');
const inbox=read('src/components/boutique/BoutiqueCustomerOrders.tsx');
const management=read('src/components/boutique/BoutiqueProductManagement.tsx');
const appMode=read('src/lib/platformAppMode.ts');
const publicUrl=read('src/lib/clientAppUrl.ts');
const check=(name,condition)=>{assert.ok(condition,name);console.log('PASS',name);};
check('platform and business apps keep distinct host rules',
  appMode.includes('appli.dalil-tounes.com')&&
  publicUrl.includes('app.dalil-tounes.com'));
check('company dashboard uses app layout on mobile platform host',
  routes.includes('clientAppMode={inPlatformApp || isClientAppRoute}'));
check('company dashboard imports private merchant inbox',
  dashboard.includes("import BoutiqueCustomerOrders from '../components/boutique/BoutiqueCustomerOrders'"));
check('company dashboard links orders tab',
  dashboard.includes("id: 'orders'")&&dashboard.includes('<BoutiqueCustomerOrders'));
check('customer request is acknowledged by the server before confirmation',
  storefront.includes("data.accepted!==true")&&storefront.includes("setConfirmation(data.reference)"));
check('customer request has a fresh idempotency key after edits',
  storefront.includes('const editRequest = () => { setRequestKey(crypto.randomUUID());'));
check('checkout blocked on EUR products until currency support is approved',
  storefront.includes("selected.currency !== 'TND'"));
check('merchant inbox uses JWT and scoped profileId',
  inbox.includes("authorization:'Bearer '+session.access_token")&&
  inbox.includes('profileId:activeCompany'));
check('merchant cannot self-attest payment',
  !inbox.includes("action:'mark_paid'")&&
  !inbox.includes('payment_status:status'));
check('cancellation makes clear it does not refund',
  inbox.includes('ne rembourse pas automatiquement le client'));
check('product management remains available',management.includes('export default'));
console.log('PASS Dalil PWA Boutique integration contracts');
