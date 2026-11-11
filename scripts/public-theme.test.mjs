import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';
const source=fs.readFileSync('src/lib/publicPageTheme.ts','utf8');
const js=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.ESNext}}).outputText;
const {usesPublicPageTheme:theme}=await import(`data:text/javascript;base64,${Buffer.from(js).toString('base64')}`);
test('Public route families and future pages share chrome',()=>{
 for(const path of ['/','/entreprises','/citizens/sante','/metier/dentiste','/dentiste-tunis','/subscription','/emplois/publier','/new-public-guide'])assert.equal(theme(path),true,path);
});
test('Client CV, QR, aliases, preview and private routes never receive public styles',()=>{
 for(const path of ['/cv/amina','/p/amina','/qr-business/123','/qr-business/123/cv','/entreprise/tunis/amina','/entreprises/123/amina','/business/123','/amina/cv/','/card-preview','/admin','/admin/inscriptions','/dashboard/candidat','/preview/separation-plateforme-cv','/emplois/123/candidats'])assert.equal(theme(path),false,path);
 for(const path of ['/','/amina','/contact'])assert.equal(theme(path,true),false,path);
});
