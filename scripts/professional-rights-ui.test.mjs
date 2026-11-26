import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import path from 'node:path';
import { build } from 'esbuild';

// Uses React 18's real mounted hooks; only the external session, server and
// unrelated dashboard panels are fixtures. DALIL_QA_RUNTIME can isolate deps.
const require = createRequire(import.meta.url);
let reactRequire = require;
try { require.resolve('react-test-renderer'); }
catch { reactRequire = createRequire(path.resolve(process.env.DALIL_QA_RUNTIME || '../qa-runtime', 'package.json')); }
const React = reactRequire('react');
const { act, create } = reactRequire('react-test-renderer');
const networkNames = ['Facebook', 'Instagram', 'TikTok', 'LinkedIn', 'YouTube', 'X'];
const networkKeys = ['lien facebook', 'Lien Instagram', 'Lien TikTok', 'Lien LinkedIn', 'Lien YouTube', 'lien_x'];
const modelNames = ['CV Portfolio', 'CV Business'];
const paletteNames = ['Vert Prestige', 'Ivoire & Or', 'Bleu Nuit'];
const openingNames = ['A — Photo + logo', 'B — Logo encadré'];
const baseRights = {
  plan: 'artisan', source: 'formule_commerciale', confirmation_required: false,
  photo_limit: 5, photo_count: 0, social_limit: 2, social_count: 2,
  models: ['business'], palettes: ['prestige'], openings: ['photo'],
  current_model: 'business', current_palette: 'prestige', current_opening: 'photo',
};
const premiumRights = { ...baseRights, plan: 'premium', photo_limit: 10, social_limit: 6,
  models: ['business', 'portfolio'], palettes: ['prestige', 'ivory', 'night'], openings: ['photo', 'framed'] };
const mockClient = `
const state = () => globalThis.__rightsTest;
export const supabase = {
  from(table) { return { select() { return {
    eq() { return { async single() { return {data: state().row, error:null}; } }; },
    order() { return { async limit() { return {data:[], error:null}; } }; },
  }; } }; },
  async rpc(name,args) {
    const s=state(); s.calls.push({name,args});
    if(name==='dalil_professional_boutique_stats') return {data:[{entreprise_id:'rights-fixture',push_subscriptions:0,published_products:0,draft_products:0}],error:null};
    if(name==='dalil_get_my_showcase_entitlements') return s.rightsError ? {data:null,error:{message:'Unavailable'}} : {data:s.rights,error:null};
    if(s.saveMode==='error')return {data:null,error:{message:'Save rejected'}};
    if(s.saveMode==='mismatch')return {data:{},error:null};
    if(name==='dalil_save_my_profile_fields') {Object.assign(s.row,args.p_changes);return {data:args.p_changes,error:null};}
    if(name==='dalil_update_my_cv_presentation')return {data:{modele_cv:args.p_modele_cv,opening_style:args.p_opening_style},error:null};
    if(name==='dalil_update_my_cv_palette')return {data:{palette_cv:args.p_palette},error:null};
    throw Error('Unexpected RPC: '+name);
  },
};`;
async function loadComponent(entryPoint) {
  const bundle = await build({ entryPoints: [entryPoint], bundle: true, write: false, format: 'cjs', platform: 'node', jsx: 'automatic',
    external: ['react', 'react/jsx-runtime'], plugins: [{name:'rights-fixtures',setup(builder){
      builder.onResolve({filter:/supabaseClient$/},()=>({path:'supabase',namespace:'rights-fixtures'}));
      builder.onResolve({filter:/context\/LanguageContext$/},()=>({path:'language',namespace:'rights-fixtures'}));
      builder.onResolve({filter:/context\/AuthContext$/},()=>({path:'auth',namespace:'rights-fixtures'}));
      builder.onResolve({filter:/^react-router-dom$/},()=>({path:'router',namespace:'rights-fixtures'}));
      builder.onResolve({filter:/^lucide-react$/},()=>({path:'icons',namespace:'rights-fixtures'}));
      builder.onResolve({filter:/components\/(?:OwnerProfileEditor|OwnerShowcaseMedia|forms\/JobPostForm|boutique\/)/},args=>args.kind==='entry-point'?undefined:({path:'panel',namespace:'rights-fixtures'}));
      builder.onLoad({filter:/.*/,namespace:'rights-fixtures'},args=>({loader:'js',contents:
        args.path==='supabase'?mockClient:
        args.path==='language'?`export function useLanguage(){return {language:'fr'}}`:
        args.path==='auth'?`export function useAuth(){return {user:globalThis.__rightsTest.user,loading:false,signOut:async()=>{}}}`:
        args.path==='router'?`export function useNavigate(){return ()=>{}}`:
        args.path==='icons'?`const Icon=()=>null;export {Icon as Briefcase,Icon as Users,Icon as Building2,Icon as Settings,Icon as LogOut,Icon as Store,Icon as Package,Icon as BarChart3,Icon as ShieldCheck,Icon as ClipboardList};`:
        `export default function Panel(){return null}`
      }));
    }}] });
  const module={exports:{}};
  new Function('require','module','exports',bundle.outputFiles[0].text)(reactRequire,module,module.exports);
  return module.exports.default;
}
const Editor = await loadComponent('src/components/OwnerProfileEditor.tsx');
const Dashboard = await loadComponent('src/pages/CompanyDashboard.tsx');
const previousGlobals = Object.fromEntries(['window','document','localStorage'].map(key=>[key,globalThis[key]]));
globalThis.window={location:{search:'',pathname:'/rights-fixture/compte'},requestAnimationFrame:callback=>callback()};
globalThis.document={getElementById:()=>null};
globalThis.localStorage={getItem:()=>null,removeItem:()=>{}};
let renderer;
const text = node => typeof node==='string' ? node : node.children.map(text).join('');
const button = name => renderer.root.findAllByType('button').find(node=>text(node).trim()===name);
const labelledInput = label => renderer.root.findAllByType('label').find(node=>text(node).trim()===label)?.findByType('input');
const saveCalls = name => globalThis.__rightsTest.calls.filter(call=>call.name===name);
const hasText = value => text(renderer.root).includes(value);
const selectedNetworks = () => networkNames.filter(name=>labelledInput(name).props.checked);
async function mount(Component, { rights=baseRights, networks=2, rightsError=false, saveMode='success' }={}) {
  if(renderer)await act(async()=>renderer.unmount());
  const row=Object.fromEntries(networkKeys.slice(0,networks).map((key,index)=>[key,`https://networks.example.test/${index}`]));
  globalThis.__rightsTest={rights,rightsError,saveMode,row,calls:[],callbacks:[],user:{id:'fixture-user',email:'fixture@example.test'}};
  await act(async()=>{renderer=create(React.createElement(Component,Component===Editor
    ?{id:'rights-fixture',section:'infos'}
    :{clientAppMode:true,accountId:'rights-fixture',onPresentationSaved:model=>globalThis.__rightsTest.callbacks.push(model)}));});
  if(Component===Dashboard)await act(async()=>button('Ma vitrine').props.onClick());
}
async function toggle(name,checked) { await act(async()=>labelledInput(name).props.onChange({target:{checked}})); }
async function setInput(label,value) { await act(async()=>labelledInput(label).props.onChange({target:{value}})); }
async function submitProfile() { await act(async()=>renderer.root.findByType('form').props.onSubmit({preventDefault(){}})); }
async function click(name) { const node=button(name);assert.ok(node,`Button exists: ${name}`);assert.ok(!node.props.disabled,`Button enabled: ${name}`);await act(async()=>node.props.onClick()); }
function assertEnabled(names,expected) { assert.deepEqual(names.filter(name=>!button(name).props.disabled),expected); }
try {
  await mount(Editor);
  assert.deepEqual(selectedNetworks(),['Facebook','Instagram']);
  assert.ok(hasText('2/2 réseaux sélectionnés'));
  for(const name of networkNames.slice(2))assert.equal(labelledInput(name).props.disabled,true);
  // Even a directly dispatched disabled control cannot add a third network.
  await toggle('TikTok',true);
  assert.deepEqual(selectedNetworks(),['Facebook','Instagram']);
  await toggle('Instagram',false);
  await toggle('TikTok',true);
  await setInput('Lien TikTok','https://tiktok.example.test/owner');
  await submitProfile();
  assert.ok(hasText('Modifications enregistrées.'));
  assert.deepEqual(saveCalls('dalil_save_my_profile_fields')[0].args.p_changes,{'Lien Instagram':'','Lien TikTok':'https://tiktok.example.test/owner'});
  assert.deepEqual(selectedNetworks(),['Facebook','TikTok']);
  console.log('PASS Artisan editor: two networks, third blocked, replacement saved with exact server confirmation');

  await mount(Editor,{rights:premiumRights,networks:1});
  for(const name of networkNames.slice(1)){
    assert.equal(labelledInput(name).props.disabled,false);
    await toggle(name,true);await setInput('Lien '+name,`https://networks.example.test/${name.toLowerCase()}`);
  }
  await submitProfile();assert.equal(selectedNetworks().length,6);assert.ok(hasText('6/6 réseaux sélectionnés'));
  assert.ok(hasText('Modifications enregistrées.'));
  console.log('PASS Premium editor: all six supported networks available and confirmed');

  const unknown={...baseRights,plan:'unconfirmed',source:'existing_assets_only',confirmation_required:true,social_limit:0,social_count:0};
  await mount(Editor,{rights:unknown,networks:0});
  for(const name of networkNames)assert.equal(labelledInput(name).props.disabled,true);
  await toggle('Facebook',true);assert.deepEqual(selectedNetworks(),[]);assert.equal(saveCalls('dalil_save_my_profile_fields').length,0);
  await mount(Editor,{rightsError:true,networks:2});
  for(const name of networkNames.slice(2))assert.equal(labelledInput(name).props.disabled,true);
  assert.ok(hasText('Impossible de vérifier les droits'));
  assert.equal(labelledInput('Facebook').props.disabled,false);
  console.log('PASS unknown/failed rights: no network expansion; existing networks preserved');

  for(const saveMode of ['error','mismatch']){
    await mount(Editor,{saveMode});await setInput('Lien Facebook','https://facebook.example.test/new');await submitProfile();
    assert.ok(!hasText('Modifications enregistrées.'));
    assert.equal(saveCalls('dalil_save_my_profile_fields').length,1);
  }
  console.log('PASS editor does not announce success on rejected or mismatched save');

  await mount(Dashboard);
  assertEnabled(modelNames,['CV Business']);assertEnabled(paletteNames,['Vert Prestige']);assertEnabled(openingNames,['A — Photo + logo']);
  assert.equal(button('CV Business').props['aria-pressed'],true);assert.equal(button('Vert Prestige').props['aria-pressed'],true);
  await click('Enregistrer mes choix');await click('Appliquer cette couleur au QR et au CV');
  assert.ok(hasText('Présentation enregistrée.'));assert.ok(hasText('Couleur enregistrée pour le QR et les deux CV.'));
  assert.deepEqual(globalThis.__rightsTest.callbacks,['business']);
  assert.deepEqual(saveCalls('dalil_update_my_cv_presentation')[0].args,{p_entreprise_id:'rights-fixture',p_modele_cv:'business',p_opening_style:'photo'});
  // Frontend save guards also reject a programmatically selected disabled option.
  await act(async()=>button('CV Portfolio').props.onClick());
  assert.equal(button('Enregistrer mes choix').props.disabled,true);
  await act(async()=>button('Enregistrer mes choix').props.onClick());
  assert.equal(saveCalls('dalil_update_my_cv_presentation').length,1);
  console.log('PASS Artisan dashboard: exactly one model/palette/opening, verified saves, disallowed choice guarded');

  await mount(Dashboard,{rights:premiumRights});
  assertEnabled(modelNames,modelNames);assertEnabled(paletteNames,paletteNames);assertEnabled(openingNames,openingNames);
  await click('CV Portfolio');await click('B — Logo encadré');await click('Bleu Nuit');
  await click('Enregistrer mes choix');await click('Appliquer cette couleur au QR et au CV');
  assert.deepEqual(saveCalls('dalil_update_my_cv_presentation')[0].args,{p_entreprise_id:'rights-fixture',p_modele_cv:'portfolio',p_opening_style:'framed'});
  assert.deepEqual(saveCalls('dalil_update_my_cv_palette')[0].args,{p_entreprise_id:'rights-fixture',p_palette:'night'});
  assert.deepEqual(globalThis.__rightsTest.callbacks,['portfolio']);
  console.log('PASS Premium dashboard: both models/openings and three palettes, actual selected values saved');

  await mount(Dashboard,{rights:unknown,networks:0});
  assertEnabled(modelNames,['CV Business']);assertEnabled(paletteNames,['Vert Prestige']);assertEnabled(openingNames,['A — Photo + logo']);
  assert.ok(hasText('Formule à confirmer'));
  for(const config of [{rightsError:true},{rights:{...baseRights,models:[]}}]){
    await mount(Dashboard,config);
    assertEnabled(modelNames,[]);assertEnabled(paletteNames,[]);assertEnabled(openingNames,[]);
    assert.equal(button('Enregistrer mes choix').props.disabled,true);assert.equal(button('Appliquer cette couleur au QR et au CV').props.disabled,true);
    await act(async()=>button('Enregistrer mes choix').props.onClick());
    assert.equal(saveCalls('dalil_update_my_cv_presentation').length,0);
  }
  console.log('PASS unknown dashboard keeps current choices; failed/malformed rights fail closed');

  for(const saveMode of ['error','mismatch']){
    await mount(Dashboard,{rights:premiumRights,saveMode});
    await click('CV Portfolio');await click('Bleu Nuit');await click('Enregistrer mes choix');await click('Appliquer cette couleur au QR et au CV');
    assert.ok(!hasText('Présentation enregistrée.'));assert.ok(!hasText('Couleur enregistrée pour le QR et les deux CV.'));
    assert.ok(hasText('Enregistrement impossible.'));assert.ok(hasText('Couleur non enregistrée.'));
    assert.deepEqual(globalThis.__rightsTest.callbacks,[]);
  }
  console.log('PASS dashboard never announces success or changes return model on rejected/mismatched saves');
} finally {
  if(renderer)await act(async()=>renderer.unmount());
  delete globalThis.__rightsTest;
  for(const [key,value] of Object.entries(previousGlobals)){if(value===undefined)delete globalThis[key];else globalThis[key]=value;}
}
