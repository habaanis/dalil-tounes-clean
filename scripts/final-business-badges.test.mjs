import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { execFileSync } from 'node:child_process';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createClient } from '@supabase/supabase-js';
import ts from 'typescript';
const base = '8709ed39d4eaff448dc151a370b6b3fd6d112f0b';
function load(path, deps = {}) {
  const exports = {};
  const code = ts.transpileModule(fs.readFileSync(path,'utf8'), { compilerOptions: { jsx: ts.JsxEmit.React, module: ts.ModuleKind.CommonJS, esModuleInterop: true, target: ts.ScriptTarget.ES2022 } }).outputText;
  vm.runInNewContext(code, { React, exports, require: id => {
    if (id === 'react') return React;
    if (id in deps) return deps[id];
    throw Error(`Unstubbed dependency ${id} in ${path}`);
  }});
  return exports;
}
const certification = load('src/lib/businessCertification.ts');
const { isCertifiedBusiness, applyCertificationFilter } = certification;
const Rating = load('src/components/GoogleRatingSummary.tsx', {'lucide-react': {Star: () => null}}).default;
const render = (Component, props) => renderToStaticMarkup(React.createElement(Component, props));
const rating = (value, count, language = 'fr') => render(Rating,{rating:value,reviewCount:count,language});
test('Current publication certifies both models, regardless of subscription and legacy status; never mutates records', () => {
  for (const model of [null, 'business','portfolio']) for (const legacy of [null,'⚠️ NON CERTIFIÉ','⭐ CERTIFIÉ DALIL TOUNES']) {
    const row = Object.freeze({modele_cv:model,statut_carte:legacy,cv_business_status:'published',statut_abonnement:'Essentielle'});
    assert.equal(isCertifiedBusiness(row),true);
  }
  for (const status of [undefined,null,'none','draft','paid','unpublished','pending']) {
    assert.equal(isCertifiedBusiness(Object.freeze({cv_business_status:status,statut_carte:'⭐ CERTIFIÉ DALIL TOUNES',cv_business_published_at:'2026-01-01',verifie:true})),false);
  }
});
test('Real Supabase builders preserve combined city/publication filters and order for both certification choices', () => {
  const db=createClient('https://fixture.invalid','fixture');
  for (const choice of ['','certifie','non_certifie']) {
    const query=db.from('entreprise').select('id').eq('ville','Mahdia').or('statut_publication.is.null,statut_publication.eq.Publié').order('nom');
    const filtered=applyCertificationFilter(query,choice);
    const params=filtered.url.searchParams;
    assert.equal(params.get('ville'),'eq.Mahdia');
    assert.equal(params.get('order'),'nom.asc');
    assert.ok(params.getAll('or').includes('(statut_publication.is.null,statut_publication.eq.Publié)'));
    assert.equal(params.get('cv_business_status'),choice==='certifie'?'eq.published':null);
    if(choice==='non_certifie')assert.ok(params.getAll('or').includes('(cv_business_status.is.null,cv_business_status.neq.published)'));
  }
});
test('Review badge boundaries include decimal comma, at least five actual reviews, and no subscription input', () => {
  for (const value of [4,'4,0',4.49]) assert.ok(rating(value,5).includes('Bien notée par les clients'));
  for (const value of [4.5,'4,5',5]) assert.ok(rating(value,'5 avis').includes('Très bien notée par les clients'));
  for (const [value,count] of [[3.99,100],[4.5,4],[4,0],[5,null],[4,4.9],[6,100],[null,10],['invalid',10]]) assert.doesNotMatch(rating(value,count),/notée par les clients/);
  for (const lang of ['fr','ar','en','it','ru']) assert.ok(rating(4.5,5,lang).includes('basis-full'));
});
const icons={Clock:()=>null,Phone:()=>null,ChevronDown:()=>null};
const Gratuit=load('src/components/GratuitCard.tsx',{
 '../lib/businessCertification':certification,
 'lucide-react':icons,
 '../lib/horaireUtils':{isCurrentlyOpen:()=>false},
 '../lib/textNormalization':{cleanArabicField:x=>x},
 './GoogleRatingSummary':{default:Rating,__esModule:true},
 '../lib/imagekitUtils':{getCoverImageUrl:()=>''},
 '../lib/categoryIllustrations':{getCategoryIllustration:()=>null,isRealBusinessPhoto:()=>false,isWikimediaIllustration:()=>false,getWikimediaCreditUrl:()=>''},
}).default;
test('Actual Essentielle card displays Google badge independently and ignores old certification labels',()=>{
 const free={name:'Fixture',language:'fr',googleRating:4.6,googleReviewCount:7,statut_carte:'⭐ CERTIFIÉ DALIL TOUNES'};
 const html=render(Gratuit,free);
 assert.ok(html.includes('Très bien notée par les clients'));
 assert.ok(!html.includes('Certifiée Dalil Tounes'));
 assert.ok(render(Gratuit,{...free,cv_business_status:'published',statut_carte:'⚠️ NON CERTIFIÉ'}).includes('Certifiée Dalil Tounes'));
});
test('Existing founder component renders its summary and existing full-story link, preserving the story source',()=>{
 assert.equal(fs.readFileSync('src/components/FounderStory.tsx','utf8'),execFileSync('git',['show',`${base}:src/components/FounderStory.tsx`],{encoding:'utf8'}));
 const Story=load('src/components/FounderStory.tsx',{'react-router-dom':{useLocation:()=>({hash:''}),Link:({to,children,...props})=>React.createElement('a',{href:to,...props},children)},'../context/LanguageContext':{useLanguage:()=>({language:'fr'})}}).FounderStory;
 const html=render(Story,{});
 assert.ok(html.includes('Découvrir mon histoire'));
 assert.ok(html.includes('/pourquoi-dalil-tounes#histoire-fondateur'));
 assert.ok(html.includes('Le bouche-à-oreille'));
 assert.ok(fs.readFileSync('src/pages/SeparationPreview.tsx','utf8').includes('<FounderStory />'));
});
test('Ranking functions and all premium pages outside the three requested entry points remain byte-identical',()=>{
 const page=fs.readFileSync('src/pages/Businesses.tsx','utf8');
 const old=execFileSync('git',['show',`${base}:src/pages/Businesses.tsx`],{encoding:'utf8'});
 const ranking=s=>s.slice(s.indexOf('function hasPublishedCv('),s.indexOf('export const Businesses'));
 assert.equal(ranking(page),ranking(old));
 const changed=execFileSync('git',['diff','--name-only',base,'--','src/pages'],{encoding:'utf8'}).trim().split('\n');
 assert.deepEqual(changed.sort(),['src/pages/Businesses.tsx','src/pages/CertifiedBusinesses.tsx','src/pages/SeparationPreview.tsx'].sort());
 assert.match(fs.readFileSync('src/lib/homeDataPrefetch.ts','utf8'),/\.select\('id', \{ count: 'exact' \}\)[\s\S]*?\.eq\('cv_business_status', 'published'\)/);
});

test('BusinessDetail normalization preserves current publication independently of old status',()=>{
 const source=fs.readFileSync('src/components/BusinessDetail.tsx','utf8');
 const start=source.indexOf('function normalizeBusiness(');
 const end=source.indexOf('export function normalizeMapsUrl',start);
 const output=ts.transpileModule(source.slice(start,end),{compilerOptions:{target:ts.ScriptTarget.ES2022}}).outputText;
 const context={extractFrenchName:x=>x,getAboutText:()=>'',getLogoUrl:x=>x,cleanArabicField:x=>x};
 vm.createContext(context);vm.runInContext(output,context);
 const row=Object.freeze({id:'fixture',nom:'Fixture',cv_business_status:'published',statut_carte:'⚠️ NON CERTIFIÉ'});
 assert.equal(isCertifiedBusiness(context.normalizeBusiness(row)),true);
 assert.equal(context.normalizeBusiness(row).statut_carte,row.statut_carte);
});
