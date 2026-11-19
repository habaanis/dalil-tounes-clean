// Static navigation contract — checks the real client mini-app files, without account access.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const read=p=>readFileSync(p,'utf8');
const showcase=read('src/components/BusinessShowcaseLienoraDetail.tsx');
const account=read('src/pages/ClientAccount.tsx');
const login=read('src/components/auth/LoginForm.tsx');
const qr=read('src/pages/BusinessQr.tsx');
const check=(label,ok)=>{assert.ok(ok,label);console.log('PASS '+label)};
const share=showcase.split('const sharingContent = (')[1]?.split('  const sections = [')[0]||'';
check('QR share panel retains share and copy actions',
  share.includes('onClick={() => void share()}')&&share.includes('onClick={() => void copyLink()}'));
check('QR share panel has no duplicate install, account, contact or install instructions',
  !share.includes('buildClientAppUrl(business, language)')&&!share.includes('/compte')&&
  !share.includes('downloadContact')&&!share.includes('dt-install-help'));
check('QR screen still owns account and install entry',
  qr.includes('accountHref={accountHref}')&&qr.includes('onInstall={installApp}'));
check('client CV has a persistent return to QR and one account link',
  showcase.includes('Navigation de la mini-application')&&
  showcase.includes('Retour au QR code')&&showcase.includes("' + '/compte'"));
check('no second Portfolio or Business back control on client host',
  showcase.includes('showClientQrBack={false}')&&
  showcase.includes('!isDedicatedClientHostname(window.location.hostname) && <button'));
check('account recovery links include both CV and QR',
  account.includes('const returnLinks=')&&account.includes('Retour à ma vitrine')&&account.includes('Retour au QR code'));
check('login to an existing business does not invite duplicate registration',
  account.includes('allowSignup={false}')&&
  !account.includes('SignupForm')&&login.includes('allowSignup &&'));
check('authorization remains tied to original business and signed in user',
  account.includes("eq('user_id',user.id).eq('entreprise_id',businessId)"));
console.log('PASS QR/vitrine/compte navigation contracts');
