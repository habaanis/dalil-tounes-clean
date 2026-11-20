import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {transform} from 'esbuild';
import vm from 'node:vm';

const server=readFileSync('supabase/functions/dalil-boutique-customer-submit/index.ts','utf8')
  .replace('import { createClient } from "npm:@supabase/supabase-js@2.112.2";','const createClient=globalThis.mockCreateClient;')
  .replace('import webpush from "npm:web-push@3.6.7";','const webpush=globalThis.mockWebpush;');
const compiled=(await transform(server,{loader:'ts',format:'cjs',target:'es2022'})).code;
let handler;
let live=false;
let dbCalls=0;
vm.runInNewContext(compiled,{
  Deno:{serve:fn=>{handler=fn;},env:{get:key=>key==='DALIL_BOUTIQUE_ORDERS_ENABLED'?(live?'true':'false'):
    key==='SUPABASE_URL'?'https://example.invalid':
    key==='SUPABASE_SERVICE_ROLE_KEY'?'test-not-a-real-secret':
    key==='DALIL_BOUTIQUE_ORDERS_RATE_LIMIT_SECRET'?'synthetic-secret-12345678901234567890':null}},
  mockCreateClient:()=>{dbCalls++;throw Error('DB must not be touched by availability checks');},
  mockWebpush:{},Request,Response,Date,URL,crypto,TextEncoder,Set,RegExp,Number,String,JSON,Array,Promise,Uint8Array,
},{filename:'customer-submit.js'});
assert.equal(typeof handler,'function');
const request=(method,origin='https://appli.dalil-tounes.com',profileId='')=>new Request('https://example.invalid?profileId='+encodeURIComponent(profileId),{method,
  headers:{origin,...(method==='POST'?{'content-type':'application/json'}:{})},
  ...(method==='POST'?{body:'{}'}:{})});
const closed=await handler(request('GET'));
assert.equal(closed.status,200);
assert.deepEqual(JSON.parse(await closed.text()),{available:false});
assert.equal(dbCalls,0);
console.log('PASS GET readiness rejects closed orders without accessing data');
const denied=await handler(request('GET','https://lienora.fr'));
assert.equal(denied.status,403);
console.log('PASS readiness rejects other origins');
const pilotId='36f84b99-2c37-47d1-91ba-4c35cda8c1af';
const another='46f84b99-2c37-47d1-91ba-4c35cda8c1af';
const allowed=await handler(request('GET','https://appli.dalil-tounes.com',pilotId));
assert.deepEqual(JSON.parse(await allowed.text()),{available:true});
assert.equal(dbCalls,0);
console.log('PASS specifically approved merchant pilot readiness opens');
const stillClosed=await handler(request('GET','https://appli.dalil-tounes.com',another));
assert.deepEqual(JSON.parse(await stillClosed.text()),{available:false});
console.log('PASS unapproved merchants stay closed');
const post=await handler(request('POST'));
assert.equal(post.status,503);
assert.equal(dbCalls,0);
console.log('PASS non-pilot POST remains closed');
live=true;
const eligible=await handler(request('GET','https://appli.dalil-tounes.com',another));
assert.deepEqual(JSON.parse(await eligible.text()),{available:true});
assert.equal(dbCalls,0);
console.log('PASS full rollout still requires the separate server-side flag');
const preflight=await handler(request('OPTIONS'));
assert.equal(preflight.status,204);
assert.ok(preflight.headers.get('access-control-allow-methods')?.includes('GET'));
console.log('PASS browser CORS allows read-only availability request');

const ui=readFileSync('src/components/boutique/BoutiqueInteractive.tsx','utf8');
assert.ok(ui.includes("orderAvailability==='available'||config.demoMode"));
assert.ok(ui.includes('encodeURIComponent(config.profileId)'));

assert.ok(ui.includes("orderAvailability!=='available'"));
assert.ok(ui.includes('Aucune demande n’a été enregistrée'));
assert.ok(ui.includes('sans enregistrement'));
assert.ok(ui.includes('if(!confirmation || !canWhatsApp || !selected)return;'));
console.log('PASS UI never pretends disabled orders were saved; WhatsApp explicitly direct');
console.log('PASS public readiness and intermediary-only safety contracts');
