import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import path from 'node:path';
import { build } from 'esbuild';

// Real mounted React hooks and controls. Only the session and network boundary
// are replaced; no real registration, transfer, account or message is created.
const require = createRequire(import.meta.url);
let reactRequire = require;
try { require.resolve('react-test-renderer'); }
catch { reactRequire = createRequire(path.resolve(process.env.DALIL_QA_RUNTIME || '../qa-runtime', 'package.json')); }
const React = reactRequire('react');
const { create, act } = reactRequire('react-test-renderer');
const mockClient = `
const state=()=>globalThis.__adminRegistrationTest;
export const supabase={
  from(){throw Error('Admin workflow must use server-authorized RPCs');},
  async rpc(name,args){
    const s=state();s.calls.push({name,args});
    if(name==='dalil_registration_is_admin')return {data:s.admin,error:s.adminError?{code:'42501'}:null};
    if(name==='dalil_admin_registration_list')return {data:s.badList?{}:{dossiers:s.rows,businesses:s.businesses},error:s.listError?{message:'Unavailable'}:null};
    if(s.rpcError)return {data:null,error:s.rpcError};
    if(s.malformed)return {data:{},error:null};
    const row=s.rows.find(row=>row.id===args.p_request_id);if(!row)throw Error('Unexpected request');
    let next=structuredClone(row);next.version++;
    if(name==='dalil_admin_registration_prepare'){
      next={...next,status:'draft',entreprise_id:args.p_business_id||'new-fixture-business',company_name:args.p_dossier.companyName,
        company_created:!args.p_business_id,owner_email:args.p_owner_email,reviewed_dossier:args.p_dossier,
        assets_ready:args.p_dossier.logoChoice==='none'||Boolean(args.p_dossier.logoUrl&&!args.p_business_id)};
    }else if(name==='dalil_admin_registration_confirm_payment'){
      next={...next,status:'paid',confirmed_plan:args.p_plan,payment_amount:args.p_amount,payment_reference:args.p_reference,
        payment_received_at:args.p_received_at,payment_confirmed_at:'2026-11-26T11:00:00.000Z'};
    }else if(name==='dalil_admin_registration_finish_assets'){
      next.reviewed_dossier.logoUrl=args.p_logo_url;next.assets_ready=true;
    }else if(name==='dalil_admin_registration_publish'){
      next={...next,status:'published',published_at:'2026-11-26T11:30:00.000Z',
        public_url:'https://app.dalil-tounes.com/fixture-shop/cv',account_url:'https://app.dalil-tounes.com/fixture-shop/compte',account_status:s.accountAfterPublish||'missing'};
    }else if(name==='dalil_admin_registration_link_account'){
      next={...next,status:'active',account_status:'linked',owner_linked_at:'2026-11-26T12:00:00.000Z'};
    }else throw Error('Unexpected RPC: '+name);
    if(s.transformResponse)next=s.transformResponse(next);
    if(!s.transformResponse)s.rows=s.rows.map(item=>item.id===next.id?next:item);
    return {data:next,error:null};
  },
  functions:{async invoke(name,args){
    const s=state();s.calls.push({name,args});
    if(s.integrationError)return {data:null,error:{message:'Unavailable'}};
    const row=s.rows.find(item=>item.id===args.body.id);
    row.integration_status={airtable:{status:'ok',attempts:2,updated_at:'2026-11-26T12:00:00Z'},notification:{status:'ok',attempts:2,updated_at:'2026-11-26T12:00:00Z'}};
    return {data:{success:true,id:row.id,integration_status:row.integration_status},error:null};
  }}
};`;
const bundle=await build({entryPoints:['src/pages/AdminPremium.tsx'],bundle:true,write:false,platform:'node',format:'cjs',jsx:'automatic',external:['react','react/jsx-runtime'],
  plugins:[{name:'admin-fixtures',setup(builder){
    builder.onResolve({filter:/supabaseClient$/},()=>({path:'supabase',namespace:'admin-fixtures'}));
    builder.onResolve({filter:/context\/AuthContext$/},()=>({path:'auth',namespace:'admin-fixtures'}));
    builder.onResolve({filter:/context\/LanguageContext$/},()=>({path:'language',namespace:'admin-fixtures'}));
    builder.onResolve({filter:/^react-router-dom$/},()=>({path:'router',namespace:'admin-fixtures'}));
    builder.onLoad({filter:/.*/,namespace:'admin-fixtures'},args=>({loader:'js',contents:
      args.path==='supabase'?mockClient:
      args.path==='auth'?`export const useAuth=()=>({user:globalThis.__adminRegistrationTest.user,loading:false});`:
      args.path==='language'?`export const useLanguage=()=>({language:globalThis.__adminRegistrationTest.language||'fr'});`:
      `import React from 'react';export const Link=({to,children,...props})=>React.createElement('a',{href:to,...props},children);`
    }));
  }}]});
const module={exports:{}};
new Function('require','module','exports',bundle.outputFiles[0].text)(reactRequire,module,module.exports);
const Admin=module.exports.default;
const dossier={schemaVersion:1,plan:'artisan',companyName:'Fixture atelier',managerName:'',phone:'00000000',email:'owner@example.test',sector:'Artisanat',governorate:'Tunis',city:'Tunis',assistance:'autonomous',presentationModel:'portfolio',palette:'ivory',openingStyle:'framed',address:'',openingHours:'',googleMapsUrl:'',googleReviewsUrl:'',logoChoice:'none',logoUrl:'',photoUrls:[],productsDescription:'Catalogue à préparer',activityDescription:'Présentation de notre atelier de test.',notes:'',socialLinks:{facebook:'',instagram:'',tiktok:'',youtube:'',linkedin:'',website:'',other:'',whatsapp:'',googleBusiness:''},selectedPlatforms:[],preferredContactMethods:['email'],preferredContactTimes:['anytime'],pricing:{currency:'TND',creationAmount:30,logoAmount:0,totalAmount:30,maintenanceAnnualAmount:50,firstYearIncluded:true,maintenanceOptional:true}};
const baseRow={id:'request-fixture',version:0,created_at:'2026-11-26T10:00:00Z',name:'Fixture atelier',city:'Tunis',email:'owner@example.test',phone:'00000000',requested_plan:'artisan',status:'received',legacy:false,source_message:'Dossier fictif pour test UI.',creation_dossier:dossier,reviewed_dossier:null,owner_email:null,entreprise_id:null,company_name:null,company_created:false,confirmed_plan:null,payment_amount:null,payment_reference:null,payment_received_at:null,payment_confirmed_at:null,published_at:null,owner_linked_at:null,public_url:null,account_url:null,account_status:'not_ready',assets_ready:false,integration_status:{airtable:{status:'ok',attempts:1,updated_at:'2026-11-26T10:00:01Z'},notification:{status:'ok',attempts:1,updated_at:'2026-11-26T10:00:01Z'}}};
const draftRow={...baseRow,version:1,status:'draft',reviewed_dossier:dossier,owner_email:'owner@example.test',entreprise_id:'new-fixture-business',company_name:baseRow.name,company_created:true,assets_ready:true};
const paidRow={...draftRow,version:2,status:'paid',confirmed_plan:'artisan',payment_amount:30,payment_reference:'BANK-FIXTURE-01',payment_received_at:'2026-11-26T10:30:00.000Z',payment_confirmed_at:'2026-11-26T11:00:00.000Z'};
const publishedRow={...paidRow,version:3,status:'published',published_at:'2026-11-26T11:30:00.000Z',public_url:'https://app.dalil-tounes.com/fixture-shop/cv',account_url:'https://app.dalil-tounes.com/fixture-shop/compte',account_status:'missing'};
const existing={id:'historical-business',name:'Établissement historique',city:'Sousse',plan:'premium',approved:true,slug:'historic-fixture'};
const socialBundle=await build({entryPoints:['src/lib/cvBusinessDalilAdapter.ts'],bundle:true,write:false,platform:'node',format:'esm'});
const {buildSocialLinks,adaptDalilBusiness}=await import('data:text/javascript;base64,'+Buffer.from(socialBundle.outputFiles[0].text).toString('base64'));
for(const url of ['https://x.com/atelier','https://www.twitter.com/atelier','https://mobile.twitter.com/atelier']){
  const [link]=buildSocialLinks({id:'social-fixture',lien_x:url});assert.equal(link.network,'x');assert.equal(link.label,'X');assert.equal(link.url,url);
}
for(const url of ['https://www.pinterest.com/atelier','https://x.com.example.test/atelier']){
  const [link]=buildSocialLinks({id:'social-fixture',lien_x:url});assert.equal(link.network,'other');assert.equal(link.label,new URL(url).hostname.replace(/^www\./,''));
}
const socialRecord={id:'social-fixture',nom:'Atelier fictif','lien facebook':'https://facebook.example.test/atelier','Lien Instagram':'https://instagram.example.test/atelier','Lien TikTok':'https://tiktok.example.test/atelier','Lien LinkedIn':'https://linkedin.example.test/atelier','Lien YouTube':'https://youtube.example.test/atelier',lien_x:'https://pinterest.com/atelier'};
for(const style of ['business','portfolio']){
  const links=adaptDalilBusiness(socialRecord,{language:'fr',style}).socialLinks;assert.equal(links.length,6);assert.equal(links.at(-1).label,'pinterest.com');
}
assert.equal(buildSocialLinks({id:'social-fixture',lien_x:'javascript:alert(1)'}).length,0);
console.log('PASS both public models preserve six social links; X labels only X/Twitter hosts and other networks show their domain');
const oldWindow=globalThis.window;
globalThis.window={confirm:()=>globalThis.__adminRegistrationTest.confirm};
let renderer;
const state=()=>globalThis.__adminRegistrationTest;
const text=node=>typeof node==='string'||typeof node==='number'?String(node):node?.children?.map(text).join('')||'';
const hasText=value=>text(renderer.root).includes(value);
const button=label=>renderer.root.findAllByType('button').find(node=>text(node).trim()===label);
const field=name=>renderer.root.findAll(node=>typeof node.type==='string'&&['input','textarea','select'].includes(node.type)&&node.props.name===name)[0];
const calls=name=>state().calls.filter(call=>call.name===name);
async function mount(options={}){
  if(renderer)await act(async()=>renderer.unmount());
  globalThis.__adminRegistrationTest={user:{id:'admin-fixture'},admin:true,confirm:true,rows:[structuredClone(baseRow)],businesses:[structuredClone(existing)],calls:[],...options};
  await act(async()=>{renderer=create(React.createElement(Admin));});
}
async function open(){const node=renderer.root.findAllByType('button').find(node=>node.props['aria-expanded']===false);assert.ok(node);await act(async()=>node.props.onClick());}
async function set(name,value){const node=field(name);assert.ok(node,`Control exists: ${name}`);await act(async()=>node.props.onChange({target:{value,checked:typeof value==='boolean'?value:undefined}}));}
async function click(label){const node=button(label);assert.ok(node,`Button exists: ${label}`);assert.ok(!node.props.disabled,`Button enabled: ${label}`);await act(async()=>node.props.onClick());}
async function submit(label){const node=button(label);assert.ok(node,`Submit exists: ${label}`);let form=node.parent;while(form&&form.type!=='form')form=form.parent;assert.ok(form);await act(async()=>form.props.onSubmit({preventDefault(){}}));}
async function payment(amount='30'){
  await set('amount',amount);await set('reference','BANK-FIXTURE-02');await set('received_at','2026-11-26T10:30');await set('transfer_checked',true);
}
try{
  for(const config of [{user:null},{admin:false},{adminError:true},{admin:'true'}]){
    await mount(config);assert.ok(hasText('Accès réservé'));assert.equal(calls('dalil_admin_registration_list').length,0);assert.ok(!hasText('Fixture atelier'));
  }
  for(const config of [{listError:true},{badList:true}]){await mount(config);assert.ok(hasText('Impossible de charger'));assert.equal(renderer.root.findAllByType('article').length,0);}
  console.log('PASS admin guard: anonymous, unauthorized, failed and malformed checks never load private dossiers; list failures stay closed');

  await mount({rows:[{...structuredClone(baseRow),legacy:true,creation_dossier:null}]});await open();
  assert.ok(button('Préparer le brouillon').props.disabled);assert.equal(button('Confirmer le virement'),undefined);assert.equal(button('Publier la mini-appli'),undefined);
  await set('reviewed',true);await submit('Préparer le brouillon');assert.equal(calls('dalil_admin_registration_prepare').length,0);assert.ok(hasText('Vérifiez les champs requis'));
  await set('sector','Artisanat');await set('activityDescription','Présentation saisie après vérification du dossier.');await set('presentationModel','portfolio');await set('palette','night');await set('openingStyle','framed');
  assert.equal(field('reviewed').props.checked,false);
  await set('business_id',existing.id);await set('owner_email','OWNER@example.test');await set('reviewed',true);await submit('Préparer le brouillon');
  const prepared=calls('dalil_admin_registration_prepare')[0].args;
  assert.equal(prepared.p_request_id,baseRow.id);assert.equal(prepared.p_expected_version,0);assert.equal(prepared.p_business_id,existing.id);assert.equal(prepared.p_owner_email,'owner@example.test');
  assert.equal(prepared.p_dossier.palette,'night');assert.equal(prepared.p_dossier.presentationModel,'portfolio');assert.equal(prepared.p_dossier.openingStyle,'framed');
  assert.ok(hasText('Brouillon enregistré et vérifié.'));assert.equal(state().businesses[0].plan,'premium');assert.equal(field('business_id'),undefined);
  console.log('PASS legacy review: required fields, explicit choices and owner email; selected historical business preserved without direct writes');

  await mount();await open();await set('photoUrls',Array.from({length:6},(_,i)=>`https://images.example.test/${i}.jpg`).join('\n'));await set('reviewed',true);await submit('Préparer le brouillon');assert.equal(calls('dalil_admin_registration_prepare').length,0);
  await set('photoUrls','');for(const key of ['facebook','instagram','tiktok'])await set(`social_${key}`,`https://${key}.example.test/company`);
  await set('reviewed',true);await submit('Préparer le brouillon');assert.equal(calls('dalil_admin_registration_prepare').length,0);
  const premium={...structuredClone(baseRow),requested_plan:'premium',creation_dossier:{...structuredClone(dossier),plan:'premium',presentationModel:null,palette:null,openingStyle:null}};
  await mount({rows:[premium]});await open();assert.equal(field('presentationModel').props.value,'business');assert.ok(button('Préparer le brouillon').props.disabled);
  await set('photoUrls',Array.from({length:10},(_,i)=>`https://images.example.test/${i}.jpg`).join('\n'));
  for(const key of ['facebook','instagram','tiktok','youtube','linkedin','other'])await set(`social_${key}`,`https://${key}.example.test/company`);
  await set('reviewed',true);await submit('Préparer le brouillon');assert.equal(calls('dalil_admin_registration_prepare')[0].args.p_dossier.photoUrls.length,10);assert.ok(hasText('Brouillon enregistré et vérifié.'));
  console.log('PASS review limits: Artisan blocks sixth photo and third network; Premium ten photos and proposed presentation require explicit review');

  await mount({rows:[structuredClone(draftRow)]});await open();await payment('59');assert.ok(button('Confirmer le virement').props.disabled);
  await submit('Confirmer le virement');assert.equal(calls('dalil_admin_registration_confirm_payment').length,0);
  await set('amount','30');await set('transfer_checked',true);await submit('Confirmer le virement');
  const transfer=calls('dalil_admin_registration_confirm_payment')[0].args;
  assert.deepEqual(transfer,{p_request_id:baseRow.id,p_expected_version:1,p_plan:'artisan',p_amount:30,p_reference:'BANK-FIXTURE-02',p_received_at:new Date('2026-11-26T10:30').toISOString()});
  assert.ok(hasText('Virement confirmé et vérifié.'));assert.equal(button('Revoir le brouillon'),undefined);assert.ok(button('Publier la mini-appli').props.disabled);
  await act(async()=>button('Publier la mini-appli').props.onClick());assert.equal(calls('dalil_admin_registration_publish').length,0);
  await set('publish_checked',true);await click('Publier la mini-appli');assert.ok(hasText('Publication enregistrée et vérifiée.'));assert.equal(button('Rattacher le compte vérifié'),undefined);assert.ok(hasText('doit créer son compte'));
  assert.equal(renderer.root.findAllByType('a').find(node=>text(node)==='Ouvrir le compte professionnel').props.href,publishedRow.account_url);
  console.log('PASS bank transfer: exact amount, reference, date and explicit receipt; publication gated and actual returned links shown');

  const logoDraft={...structuredClone(draftRow),assets_ready:false,reviewed_dossier:{...structuredClone(dossier),logoChoice:'create',logoUrl:''}};
  await mount({rows:[logoDraft]});await open();assert.ok(hasText('Montant attendu : 50 TND'));await payment('50');await submit('Confirmer le virement');
  assert.equal(button('Publier la mini-appli'),undefined);assert.ok(hasText('Ajoutez le logo prévu'));
  await set('delivered_logo','https://images.example.test/delivered-logo.png');await submit('Valider le logo livré');
  assert.deepEqual(calls('dalil_admin_registration_finish_assets')[0].args,{p_request_id:baseRow.id,p_expected_version:2,p_logo_url:'https://images.example.test/delivered-logo.png'});
  assert.ok(hasText('Logo enregistré et vérifié.'));assert.ok(button('Publier la mini-appli'));
  console.log('PASS paid logo delivery: +20 TND included, publication blocked until saved logo and assets_ready are confirmed');

  for(const config of [{rpcError:{code:'42501'}},{rpcError:{code:'40001'}},{malformed:true},{transformResponse:next=>({...next,id:'wrong-request'})},{transformResponse:next=>({...next,owner_email:'another@example.test'})},{transformResponse:next=>({...next,reviewed_dossier:{...next.reviewed_dossier,palette:'night'}})}]){
    await mount(config);await open();await set('reviewed',true);await submit('Préparer le brouillon');assert.ok(!hasText('Brouillon enregistré et vérifié.'));
    assert.ok(renderer.root.findAll(node=>node.props.role==='alert').length>0);assert.equal(button('Confirmer le virement'),undefined);
  }
  await mount({rows:[structuredClone(draftRow)],transformResponse:next=>({...next,payment_amount:59})});await open();await payment();await submit('Confirmer le virement');assert.ok(!hasText('Virement confirmé et vérifié.'));
  await mount({rows:[structuredClone(paidRow)],transformResponse:next=>({...next,public_url:'https://untrusted.example.test/result'})});await open();await set('publish_checked',true);await click('Publier la mini-appli');assert.ok(!hasText('Publication enregistrée et vérifiée.'));
  console.log('PASS no false success: permission/concurrency errors, malformed or mismatched request, owner, content, amount and publication URL are rejected');

  for(const status of ['missing','unverified','conflict']){
    await mount({rows:[{...structuredClone(publishedRow),account_status:status}]});await open();assert.equal(button('Rattacher le compte vérifié'),undefined);assert.equal(calls('dalil_admin_registration_link_account').length,0);
  }
  await mount({rows:[{...structuredClone(publishedRow),account_status:'ready'}]});await open();await click('Rattacher le compte vérifié');
  assert.deepEqual(calls('dalil_admin_registration_link_account')[0].args,{p_request_id:baseRow.id,p_expected_version:3});assert.ok(hasText('Compte professionnel rattaché.'));
  console.log('PASS verified owner linking: absent, unverified and conflicting accounts cannot be linked; ready account requires exact server confirmation');

  for(const status of ['unknown','running']){
    await mount({rows:[{...structuredClone(baseRow),integration_status:{airtable:{status},notification:{status:'ok'}}}]});await open();assert.equal(button('Reprendre les transmissions non finalisées'),undefined);
  }
  for(const status of ['failed','pending']){
    await mount({confirm:false,rows:[{...structuredClone(baseRow),integration_status:{airtable:{status},notification:{status:'ok'}}}]});await open();
    await click('Reprendre les transmissions non finalisées');assert.equal(calls('retry-company-registration-integrations').length,0);
    state().confirm=true;await click('Reprendre les transmissions non finalisées');assert.equal(calls('retry-company-registration-integrations').length,1);
    assert.equal(calls('dalil_admin_registration_list').length,2);assert.ok(hasText('Tentative enregistrée'));
  }
  console.log('PASS integration recovery: only failed/pending, explicit confirmation, exact request and refetch; no retries for uncertain or running work');

  await mount();assert.ok(hasText('Fixture atelier'));state().user=null;await act(async()=>renderer.update(React.createElement(Admin)));
  assert.ok(hasText('Accès réservé'));assert.ok(!hasText('Fixture atelier'));
  console.log('PASS session change removes private dossiers immediately');
}finally{
  if(renderer)await act(async()=>renderer.unmount());
  delete globalThis.__adminRegistrationTest;
  if(oldWindow===undefined)delete globalThis.window;else globalThis.window=oldWindow;
}
