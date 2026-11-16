import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const qr = readFileSync('src/pages/BusinessQr.tsx', 'utf8');
const cv = readFileSync('src/components/BusinessShowcaseLienoraDetail.tsx', 'utf8');
const palette = readFileSync('src/lib/cvPalette.ts', 'utf8');
const clientLinks = readFileSync('src/lib/clientAppUrl.ts', 'utf8');
let checks = 0;
const check = (title, fn) => { fn(); checks++; console.log('PASS', title); };
const valid = new Set(['prestige','ivory','night']);
const resolve = (value) => {
  const x=String(value||'').trim().toLowerCase();
  if(x==='prestige'||x.includes('vert'))return 'prestige';
  if(x==='ivory'||x.includes('ivoire'))return 'ivory';
  if(x==='night'||x.includes('nuit')||x.includes('champagne'))return 'night';
  return null;
};
const effective = (saved, selected, legacy, preview) =>
  resolve(preview) || (selected ? resolve(saved) : (legacy ? 'ivory' : resolve(saved))) || 'prestige';

for (const id of valid) {
  check(id + ' saved owner choice is the same for QR and CV', () =>
    assert.equal(effective(id,true,true,null),id));
  check(id + ' preview takes precedence without writing saved choice', () =>
    assert.equal(effective('prestige',true,true,id),id));
  check(id + ' remains unchanged on QR-CV-QR reload', () => {
    const first=effective(id,true,true,null);
    const cvScreen=effective(id,true,true,first);
    const back=effective(id,true,true,null);
    assert.deepEqual([first,cvScreen,back],[id,id,id]);
  });
  check(id + ' is a known palette mapping', () => assert.ok(palette.includes('  '+id+': {')));
}
check('legacy ivory applies only when no explicit user choice', () => assert.equal(effective('prestige',false,true,null),'ivory'));
check('client-selected prestige supersedes historic ivory', () => assert.equal(effective('prestige',true,true,null),'prestige'));
check('QR selects owner choice before old badge', () => assert.ok(qr.includes('business?.palette_cv_user_selected ? business.palette_cv') && qr.includes('statut_carte')));
check('CV selects owner choice before old badge', () => assert.ok(cv.includes('userSelectedPalette ? storedPalette : (isHistoricalIvoryCard')));
check('QR query fetches both persistence fields', () => assert.ok(qr.includes('palette_cv, palette_cv_user_selected, statut_carte, opening_style')));
check('CV data query fetches full record', () => assert.ok(cv.includes(".from('entreprise')") && cv.includes(".select('*')")));
check('QR link carries resolved palette', () => assert.ok(qr.includes('buildClientCvUrl(business || identifier, language, paletteTheme.id)')));
check('CV return passes explicit preview palette to QR', () => assert.ok(cv.includes("clientAppUrl.searchParams.set('palette', activePalette")));
check('CV links support palette query parameter', () => assert.ok(clientLinks.includes("url.searchParams.set('palette', palette)")));
console.log(`${checks}/${checks} palette consistency checks passed (offline; no production changes).`);
