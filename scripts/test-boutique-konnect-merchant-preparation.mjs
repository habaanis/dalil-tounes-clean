import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import ts from 'typescript';
const source=readFileSync('src/lib/boutiqueKonnectMerchant.ts','utf8');
const js=ts.transpileModule(source,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext}}).outputText;
const {buildMerchantKonnectIntent,tndToMillimes,verifyMerchantKonnectEvidence}=await import('data:text/javascript;base64,'+Buffer.from(js).toString('base64'));
const check=(name,fn)=>{fn();console.log('PASS',name)};
const merchant={receiverWalletId:'merchantWallet123',credentialSecretRef:'vault:merchant:1',environment:'sandbox',enabled:true,verified:true};
const order={orderId:'36f84b99-2c37-47d1-91ba-4c35cda8c1af',entrepriseId:'company-A',kind:'order',currency:'TND',totalTnd:85.5,verifiedPaidTnd:0};
const request=(more={})=>buildMerchantKonnectIntent({order,account:merchant,approvedAccountEntrepriseId:'company-A',stage:'full',...more});
check('full payment routes only to approved merchant wallet with millime amount',()=>{
 const intent=request();assert.equal(intent.receiverWalletId,merchant.receiverWalletId);
 assert.equal(intent.amount,85500);assert.equal(intent.token,'TND');
 assert.equal(intent.orderId,order.orderId);
});
check('strict TND millime conversion',()=>{
 assert.equal(tndToMillimes(.001),1);
 assert.equal(tndToMillimes(19.875),19875);
 assert.throws(()=>tndToMillimes(19.8756));
 assert.throws(()=>tndToMillimes(-1));
});
check('deposit and remaining balance are exact and never overpaid',()=>{
 assert.equal(request({stage:'deposit',depositTnd:30}).amount,30000);
 assert.throws(()=>request({stage:'deposit',depositTnd:85.5}));
 assert.throws(()=>request({stage:'deposit'}));
 assert.equal(request({stage:'balance',order:{...order,verifiedPaidTnd:30}}).amount,55500);
 assert.throws(()=>request({stage:'full',order:{...order,verifiedPaidTnd:30}}));
});
check('merchant account cannot use another company wallet',()=>{
 assert.throws(()=>request({approvedAccountEntrepriseId:'company-B'}));
 assert.throws(()=>request({account:{...merchant,enabled:false}}));
 assert.throws(()=>request({account:{...merchant,verified:false}}));
 assert.throws(()=>request({account:{...merchant,environment:'production'}}));
 assert.throws(()=>request({order:{...order,kind:'quote'}}));
 assert.throws(()=>request({order:{...order,currency:'EUR'}}));
});
const evidence={paymentId:'konnect-ref-1',orderId:order.orderId,receiverWalletId:merchant.receiverWalletId,token:'TND',status:'completed',reachedAmount:85500};
const verify=(change={})=>verifyMerchantKonnectEvidence({
 evidence:{...evidence,...change},expectedPaymentRef:evidence.paymentId,
 expectedOrderId:order.orderId,expectedReceiverWalletId:merchant.receiverWalletId,expectedMillimes:85500,
});
check('only completed exact-payment evidence passes',()=>{
 assert.equal(verify(),true);
 for(const bad of [{paymentId:'other'},{orderId:'other'},{receiverWalletId:'dalil-wallet'},{token:'EUR'},
 {status:'pending'},{status:'failed'},{reachedAmount:85499},{reachedAmount:85501},{reachedAmount:0}])
   assert.equal(verify(bad),false,JSON.stringify(bad));
});
const migration=readFileSync('supabase/migrations/20261119223500_boutique_direct_merchant_payment_preparation.sql','utf8');
check('private DB tables default off with no browser access',()=>{
 assert.match(migration,/enabled boolean not null default false/);
 assert.match(migration,/enable row level security/g);
 assert.match(migration,/revoke all .* from anon,authenticated/);
 assert.doesNotMatch(migration,/api_key\s+text/i);
});
const checkout=readFileSync('supabase/functions/dalil-boutique-customer-submit/index.ts','utf8');
check('original customer orders remain disabled by default',()=>{
 assert.match(checkout,/DALIL_BOUTIQUE_ORDERS_ENABLED/);
});
console.log('PASS Konnect direct-merchant sandbox preparation; no payment attempted');
