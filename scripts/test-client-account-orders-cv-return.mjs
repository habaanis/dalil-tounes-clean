import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const dashboard=readFileSync('src/pages/CompanyDashboard.tsx','utf8');
const account=readFileSync('src/pages/ClientAccount.tsx','utf8');
const qr=readFileSync('src/pages/BusinessQr.tsx','utf8');
const route=readFileSync('src/AppRouter.tsx','utf8');
const merchant=readFileSync('src/components/boutique/BoutiqueCustomerOrders.tsx','utf8');
const alerts=readFileSync('src/components/boutique/BoutiqueMerchantOrderAlerts.tsx','utf8');
const check=(name,ok)=>{assert.ok(ok,name);console.log('PASS',name);};
check('Mobile account has four existing professional sections',
 dashboard.includes("{ id: 'showcase', label: 'Ma vitrine'") &&
 dashboard.includes("{ id: 'boutique', label: 'Ma boutique'") &&
 dashboard.includes("{ id: 'orders', label: 'Mes commandes'") &&
 dashboard.includes("{ id: 'stats', label: 'Mes statistiques'") &&
 dashboard.includes("grid grid-cols-2 gap-1"));
check('Orders section reuses secured merchant list and push controls',
 dashboard.includes('<BoutiqueCustomerOrders entrepriseIds=') &&
 dashboard.includes('<BoutiqueMerchantOrderAlerts key=') &&
 dashboard.includes("activeTab === 'orders'"));
check('Professional inbox and alerts keep authentication and scoped merchant',
 merchant.includes("supabase.auth.getSession()") &&
 merchant.includes("authorization:'Bearer '+session.access_token") &&
 alerts.includes("supabase.auth.getSession()") &&
 alerts.includes("action,profileId,subscription"));
check('Account never hardcodes return to Business',
 !account.includes('← Retour au CV Business') &&
 !account.includes('preview-model=business&skip-opening=1') &&
 account.includes("returnModel==='portfolio'?'Portfolio':'Business'") &&
 account.includes("cvReturnPath(slug,returnModel)"));
check('QR preserves published model for account navigation',
 qr.includes("'?cv=' + accountReturnModel") &&
 qr.includes("compte?cv=\u0024{accountReturnModel}") &&
 qr.includes("sessionStorage.getItem('dalil-return-cv:'"));
check('CV route remembers explicit preview model',
 route.includes("sessionStorage.setItem('dalil-return-cv:'") &&
 route.includes("selectedModel !== 'portfolio' && selectedModel !== 'business'"));
check('Deep link can open orders after notification',
 dashboard.includes("get('tab') === 'orders'"));
console.log('PASS client professional account return + orders integration');
