import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=file=>readFileSync(file,'utf8');
const merchant=read('supabase/functions/dalil-boutique-merchant-push/index.ts');
const submit=read('supabase/functions/dalil-boutique-customer-submit/index.ts');
const ui=read('src/components/boutique/BoutiqueMerchantOrderAlerts.tsx');
const dashboard=read('src/pages/CompanyDashboard.tsx');
const sw=read('public/service-worker.js');
const sql=read('supabase/migrations/20261119205500_boutique_merchant_push_subscriptions.sql');
const check=(name,okay)=>{assert.ok(okay,name);console.log('PASS',name)};
check('merchant push requires valid identity and ownership',
 merchant.includes('db.auth.getUser(token)')&&merchant.includes('.eq("user_id",identity.user.id)')
 && merchant.includes('if(!access)return reply({error:"Forbidden"},403,origin)'));
check('subscription requires approved endpoints and browser keys',
 merchant.includes('validEndpoint(endpoint)')&&merchant.includes('validKey(p256dh,40,180)')&&merchant.includes('validKey(auth,12,100)'));
check('merchant subscriptions isolated from customer follower table',
 !merchant.includes('dalil_boutique_push_subscriptions')&&
 merchant.includes('dalil_boutique_merchant_push_subscriptions'));
check('private table has RLS and no direct client grants',
 sql.includes('enable row level security')&&sql.includes('revoke all')&&
 sql.includes('from anon,authenticated'));
check('order submissions remain closed without explicit server setting',
 submit.includes('id===pilotEntrepriseId || Deno.env.get("DALIL_BOUTIQUE_ORDERS_ENABLED")==="true"') &&
 submit.includes('if(typeof profileId!=="string" || !entrepriseId.test(profileId) || !intakeEnabled(profileId))'));
check('existing idempotent retries never send merchant notifications',
 submit.indexOf('if(existing){')<submit.indexOf('sendMerchantAlert(db,profileId,created.id')&&
 submit.includes('if(writeError.code==="23505")'));
check('merchant push after successful insert only',
 submit.includes('sendMerchantAlert(db,profileId,created.id,created.kind)')&&
 submit.includes('.in("user_id",allowed)'));
check('push excludes personal customer details and keeps deep-link',
 submit.includes('https://appli.dalil-tounes.com/dashboard/entreprise?tab=orders')&&
 !submit.slice(submit.indexOf('const payload=JSON.stringify'),submit.indexOf('for(let index=0;')).includes('customer_contact'));
check('service worker handles push URL and click',
 sw.includes("data.url || '/'")&&sw.includes("notificationclick"));
check('merchant controls alerts and customer followers remain unchanged',
 ui.includes("api('subscribe'")&&ui.includes("api('unsubscribe'")&&
 dashboard.includes('<BoutiqueMerchantOrderAlerts'));
check('deep-link selects orders tab',
 dashboard.includes("get('tab') === 'orders'"));
console.log('PASS merchant order alerts contracts');
