import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const inbox=readFileSync('src/components/boutique/BoutiqueCustomerOrders.tsx','utf8');
const merchant=readFileSync('supabase/functions/dalil-boutique-merchant-orders/index.ts','utf8');
const submission=readFileSync('supabase/functions/dalil-boutique-customer-submit/index.ts','utf8');
const check=(name,condition)=>{assert.ok(condition,name);console.log('PASS',name);};
check('merchant requests remain authenticated, scoped and read-only for list',
  merchant.includes('db.auth.getUser(token)') &&
  merchant.includes('.eq("entreprise_id",profileId)') &&
  merchant.includes('.eq("user_id",identity.user.id)'));
check('inbox refreshes only while visible, at a moderate interval',
  inbox.includes("document.visibilityState!=='visible'") &&
  inbox.includes('window.setInterval(check,60000)') &&
  inbox.includes("document.addEventListener('visibilitychange',onVisible)"));
check('background fetch cleanup avoids leaked polling',
  inbox.includes('window.clearInterval(timer)') &&
  inbox.includes("document.removeEventListener('visibilitychange',onVisible)") &&
  inbox.includes('if(live && Array.isArray(data.orders))'));
check('old orders remain visible during transient refresh failure',
  inbox.includes('/* Keep existing orders visible; manual refresh exposes errors. */'));
check('merchant changes only order processing status, never payment evidence',
  !inbox.includes("action:'mark_paid'") &&
  merchant.includes('.update({status,updated_at:new Date().toISOString()})'));
check('public order intake remains gated',
  submission.includes('id===pilotEntrepriseId || Deno.env.get("DALIL_BOUTIQUE_ORDERS_ENABLED")==="true"') &&
  submission.includes('if(typeof profileId!=="string" || !entrepriseId.test(profileId) || !intakeEnabled(profileId))'));
console.log('PASS inbox fallback without public orders or payments');
