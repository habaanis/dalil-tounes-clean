import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=p=>readFileSync(p,'utf8');
const inbox=read('src/components/boutique/BoutiqueCustomerOrders.tsx');
const checkout=read('src/components/boutique/BoutiqueInteractive.tsx');
const merchant=read('supabase/functions/dalil-boutique-merchant-orders/index.ts');
const submit=read('supabase/functions/dalil-boutique-customer-submit/index.ts');
const check=(name,valid)=>{assert.ok(valid,name);console.log('PASS',name)};
check('Dalil acts only as intermediary in customer checkout',
 checkout.includes('Dalil Tounes ne collecte aucun paiement') &&
 checkout.includes('Convenez directement du règlement avec le professionnel') &&
 checkout.includes('Votre demande reste enregistrée dans Dalil Tounes'));
check('merchant inbox describes direct payment arrangement',
 inbox.includes('Le paiement se règle directement entre le client et le professionnel') &&
 inbox.includes("Dalil Tounes n'encaisse pas") &&
 !inbox.includes('Montant vérifié :') && !inbox.includes('Solde restant :'));
check('merchant confirmation is independent of payment verification',
 inbox.includes("const canConfirm=['received','in_progress'].includes(order.status)") &&
 inbox.includes("const canFinish=order.status==='confirmed'") &&
 merchant.includes('Confirm the request before marking it completed') &&
 !merchant.includes('Verified deposit or full payment required') &&
 !merchant.includes('Order cannot be completed before verified payment'));
check('server still requires authenticated merchant ownership',
 merchant.includes('db.auth.getUser(token)') &&
 merchant.includes('.eq("user_id",identity.user.id).eq("entreprise_id",profileId)') &&
 merchant.includes('if(!access)return respond({error:"Forbidden"},403,origin)'));
check('status transitions still controlled and no financial evidence writable',
 merchant.includes('validTransitions[current.status]?.has(status)') &&
 merchant.includes('.update({status,updated_at:new Date().toISOString()})') &&
 !merchant.includes("payment_status:status") &&
 !merchant.includes("paid_amount:"));
check('no checkout provider or actual payments introduced',
 !inbox.includes("action:'verify_payment'") &&
 !checkout.includes('init-payment') &&
 checkout.includes("selected.currency !== 'TND'"));
check('customer requests still disabled until separately verified',
 submit.includes('Deno.env.get("DALIL_BOUTIQUE_ORDERS_ENABLED")!=="true"'));
console.log('PASS Boutique direct-settlement intermediary flow contracts');
