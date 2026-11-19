import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const read = path => readFileSync(path, 'utf8');
const catalogue = read('src/components/boutique/BoutiqueInteractive.tsx');
const orders = read('src/components/boutique/BoutiqueCustomerOrders.tsx');
const follow = read('src/components/boutique/BoutiquePushFollow.tsx');
const check = (name, yes) => { assert.ok(yes, name); console.log('PASS', name); };

check('festive categories follow approved five-section ordering',
  catalogue.includes("['Menu des fêtes', 'Entrées', 'Plats', 'Fromages', 'Desserts']") &&
  catalogue.includes('rankCategory(a), bRank = rankCategory(b)'));
check('product cards follow festive category order without rearranging a category',
  catalogue.includes("const first = rankCategory(a.category?.trim() || '')") &&
  catalogue.includes('if (catalogueCategory || catalogueQuery.trim()) return 0;') &&
  catalogue.includes('return first - second;'));
check('catalogue no longer uses plum accents',
  !catalogue.includes("#4d2a47") &&
  !catalogue.includes("#4b2e47"));
check('server acknowledgment required before claiming successful submission',
  catalogue.includes('data.accepted!==true') && catalogue.includes('setConfirmation(data.reference)'));
check('euros stay unavailable for live checkout until properly implemented',
  catalogue.includes("selected.currency !== 'TND'"));
check('calendar date included in request and guarded against past dates',
  catalogue.includes('Date souhaitée : ') && catalogue.includes('requestedDate < localToday'));
check('merchant payment cannot be self-certified from UI',
  !orders.includes("action:'mark_paid'") && !orders.includes("payment_status:status"));
check('customer notifications are voluntary and cancellable',
  follow.includes("api('subscribe'") && follow.includes("api('unsubscribe'") &&
  !follow.includes('Tester une notification'));
console.log('PASS Boutique A catalogue and commercial safety contracts');
