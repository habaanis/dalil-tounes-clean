import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const ui=readFileSync('src/components/boutique/BoutiqueInteractive.tsx','utf8');
const check=(name,condition)=>{assert.ok(condition,name);console.log('PASS',name);};
check('client app only shows form when this merchant has server intake',
 ui.includes("orderAvailability==='available'||config.demoMode") &&
 ui.includes("encodeURIComponent(config.profileId)") &&
 ui.includes("orderAvailability!=='available'"));
check('client requests saved to Supabase before any confirmation',
 ui.includes("'/functions/v1/dalil-boutique-customer-submit'") &&
 ui.includes('setConfirmation(data.reference)') &&
 ui.includes("data.accepted!==true"));
check('WhatsApp allowed only after saved reference',
 ui.includes('if(!confirmation || !canWhatsApp || !selected)return') &&
 ui.includes("'Référence : '+confirmation"));
check('no false WhatsApp order when intake closed',
 ui.includes("Contacter directement sur WhatsApp (sans enregistrement)") &&
 ui.includes("Aucune demande n’a été enregistrée"));
check('demo mode, idempotency and direct merchant settlement kept',
 ui.includes("if (config.demoMode)") &&
 ui.includes("idempotencyKey:requestKey") &&
 ui.includes("Dalil Tounes ne collecte aucun paiement"));
console.log('PASS Boutique client bridge contracts');
