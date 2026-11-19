// Static navigation contract — checks the real client mini-app files, without account access.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const read=p=>readFileSync(p,'utf8');
const showcase=read('src/components/BusinessShowcaseLienoraDetail.tsx');
const account=read('src/pages/ClientAccount.tsx');
const login=read('src/components/auth/LoginForm.tsx');
const qr=read('src/pages/BusinessQr.tsx');
const clientUrls=read('src/lib/clientAppUrl.ts');
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
  showcase.includes('Retour au QR code')&&showcase.includes("'/compte?return-model=' + presentationStyle"));
check('the chosen Business or Portfolio model follows the user into Mon compte',
  showcase.includes("'/compte?return-model=' + presentationStyle") &&
  qr.includes("'?return-model=' + cvModel") &&
  account.includes("get('return-model')") &&
  account.includes("selectedModel ? '&preview-model=' + selectedModel") &&
  !account.includes('preview-model=business&skip-opening=1'));
check('Portfolio and preview flags survive QR, account, login, CV and QR navigation',
  qr.includes("cvLink.searchParams.set('preview-model', cvModel)") &&
  qr.includes("cvLink.searchParams.set('client-preview', '1')") &&
  qr.includes("'?return-model=' + cvModel + previewMarker") &&
  showcase.includes("const accountReturnHref =") &&
  showcase.includes("'/compte?return-model=' + presentationStyle") &&
  showcase.includes("if (isIsolatedClientPreview) clientQrReturnUrl.searchParams.set('client-preview', '1')") &&
  account.includes("const previewQuery = clientPreview ? '&client-preview=1' : ''") &&
  account.includes("const qrPath = '/' + encodeURIComponent(slug || '') + (clientPreview ? '?client-preview=1' : '')") &&
  !account.includes("preview-model=business&skip-opening=1"));
check('the QR error fallback does not force Business for a Portfolio',
  qr.includes("recoveryCvUrl.searchParams.set('preview-model', cvModel)") &&
  !qr.includes("recoveryCvUrl.searchParams.set('preview-model', 'business')"));
check('existing accounts can recover their password without a duplicate registration',
  account.includes('Mot de passe oublié ?') &&
  account.includes('resetPasswordForEmail') &&
  account.includes('supabase.auth.updateUser({password: newPassword})') &&
  account.includes('Se connecter avec un autre compte'));
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
check('client preview remains opt-in and isolated to Vercel host',
  clientUrls.includes("get('client-preview') === '1'")&&
  clientUrls.includes('sessionStorage')&&
  clientUrls.includes('return CLIENT_APP_ORIGIN;'));
check('account route recognizes isolated preview host',
  account.includes('isDedicatedClientHostname(window.location.hostname)'));
check('signup and login are both available inside the client app',
  account.includes("setMode('signup')")&&account.includes("setMode('login')")&&
  account.includes("signUp(email.trim().toLowerCase(),password,'company')"));
check('signup never redirects to the platform or assigns business ownership',
  !account.includes("navigate('/commercial')")&&
  !account.includes(".insert({user_id:")&&
  !account.includes(".upsert({user_id:")&&
  account.includes('le rattachement doit être vérifié'));
check('denied access shows connected identity and allows account switching',
  account.includes('Compte connecté :')&&account.includes('Se connecter avec un autre compte'));
check('mini-app hides duplicate install/contact/QR actions',
  showcase.includes('const cvActions = isDedicatedClientHostname(window.location.hostname)')&&
  showcase.includes('primaryActions.filter(action => action.label !== installLabel)')&&
  showcase.includes('sharingContent={isDedicatedClientRoute ? undefined : sharingContent}')&&
  showcase.includes('!isDedicatedClientRoute && (capabilities.showQrCode || capabilities.showShareTools)')&&
  showcase.includes('!isDedicatedClientRoute && <button type="button" className="dt-secondary-action" onClick={downloadContact}'));
check('opening animation blocked during internal return navigation',
  showcase.includes("window.history.state?.idx === 'number'")&&
  showcase.includes('!isInternalClientReturn')&&
  showcase.includes("get('skip-opening') !== '1'"));
console.log('PASS QR/vitrine/compte navigation contracts');
