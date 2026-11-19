import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=p=>readFileSync(p,'utf8');
const inbox=read('src/components/boutique/BoutiqueCustomerOrders.tsx');
const checkout=read('src/components/boutique/BoutiqueInteractive.tsx');
const check=(name,valid)=>{assert.ok(valid,name);console.log('PASS',name)};
check('paid and remaining amounts are presented read-only',
 inbox.includes('Montant vérifié :') && inbox.includes('Solde restant :') &&
 inbox.includes('order.paid_amount') && inbox.includes('order.amount_total'));
check('unverified payment cannot count as money received',
 inbox.includes("['partially_paid','paid','refunded'].includes(order.payment_status) ? order.paid_amount : 0") &&
 inbox.includes("['partially_paid','paid'].includes(order.payment_status) ? order.paid_amount : 0"));
check('quote is never displayed as a paid order',
 inbox.includes("order.kind === 'quote'") && inbox.includes("aucun montant à encaisser"));
check('merchant cannot self-attest card, deposit or balance',
 !inbox.includes("action:'mark_paid'") && !inbox.includes("payment_status:status") &&
 !inbox.includes("payment_provider:") && !inbox.includes("action:'verify_payment'"));
check('deposit confirmation does not allow completion before full payment',
 inbox.includes("const canConfirm=order.kind==='quote'||['partially_paid','paid'].includes(order.payment_status)") &&
 inbox.includes("const canFinish=order.status==='confirmed'&&(order.kind==='quote'||order.payment_status==='paid')"));
check('checkout does not pretend card payment is live',
 checkout.includes("Aucun paiement n’a été effectué") &&
 checkout.includes("Acompte ou paiement total obligatoire") &&
 checkout.includes("selected.currency !== 'TND'"));
console.log('PASS Boutique payment-readiness contracts');
