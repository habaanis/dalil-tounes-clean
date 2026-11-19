// Synthetic-only security regression tests. No remote Supabase call or real order.
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { transform } from 'esbuild';
import vm from 'node:vm';

const entreprise='36f84b99-2c37-47d1-91ba-4c35cda8c1af';
const secondEntreprise='46f84b99-2c37-47d1-91ba-4c35cda8c1af';
const productId='9e445ab7-10be-4bb4-ac9d-0c865e49dacb';
// Existing approved quote item from Aux Saveurs d'Anis; requests stay synthetic.
const pilotQuoteId='f371389d-5db1-4987-a47d-d275ed085d2c';
const data={
  entreprise:[{id:entreprise,approved:true,statut_publication:'Publié',statut_validation:'publie'},
    {id:secondEntreprise,approved:true,statut_publication:'Publié',statut_validation:'publie'}],
  dalil_boutique_products:[{id:productId,entreprise_id:entreprise,title:'Test',mode:'order',price:30,currency:'TND',status:'approved',approved_at:'2026-11-14T10:00:00Z'},
    {id:pilotQuoteId,entreprise_id:entreprise,title:'Buffet de mariage',mode:'quote',price:null,currency:'TND',status:'approved',approved_at:'2026-11-14T19:59:36Z'}],
  dalil_boutique_customer_orders:[],
  professional_profile_access:[{user_id:'merchant-1',entreprise_id:entreprise},
    {user_id:'merchant-2',entreprise_id:secondEntreprise}],
};
let rateLimited=false;
let liveOrdersEnabled=true;
function mockQuery(table){
  assert.ok(data[table], 'Unexpected table '+table);
  let filters=[],operation='read',payload;
  const matched=()=>data[table].filter(row=>filters.every(([key,value])=>row[key]===value));
  const query={
    select:()=>query, eq:(key,value)=>{filters.push([key,value]);return query;},
    order:()=>query, limit:()=>query, insert:values=>{operation='insert';payload=values;return query;},
    update:values=>{operation='update';payload=values;return query;},
    maybeSingle:async()=>{
      if(operation==='insert'){
        const old=data[table].find(row=>row.entreprise_id===payload.entreprise_id&&row.idempotency_key===payload.idempotency_key);
        if(old)return {data:null,error:{code:'23505'}};
        const row={...payload,id:crypto.randomUUID(),status:'received',payment_status:'not_requested',created_at:new Date().toISOString()};
        data[table].push(row);return{data:row,error:null};
      }
      if(operation==='update'){
        const row=matched()[0];if(row)Object.assign(row,payload);
        return{data:row||null,error:null};
      }
      return{data:matched()[0]||null,error:null};
    },
    single:async()=>query.maybeSingle(),
    then:(resolve,reject)=>Promise.resolve({data:matched(),error:null}).then(resolve,reject),
  };
  return query;
}
function mockClient(){
  return{from:mockQuery,rpc:async()=>({data:!rateLimited,error:null}),
    auth:{getUser:async token=>({data:{user:{id:token==='merchant-token'?'merchant-1':token==='second-merchant-token'?'merchant-2':'outsider'}},error:null})}};
}
async function loadEndpoint(slug){
  const file='supabase/functions/'+slug+'/index.ts';
  let source=await readFile(file,'utf8');
  source=source.replace('import { createClient } from "npm:@supabase/supabase-js@2.112.2";','const createClient=globalThis.mockCreateClient;');
  const script=(await transform(source,{loader:'ts',target:'es2022',format:'cjs'})).code;
  let handler;
  vm.runInNewContext(script,{
    Request,Response,Date,URL,crypto,TextEncoder,Set,RegExp,Number,String,JSON,Array,Promise,Uint8Array,
    Deno:{serve:fn=>{handler=fn;},env:{get:k=>k==='SUPABASE_URL'?'https://example.supabase.co':
      k==='SUPABASE_SERVICE_ROLE_KEY'?'fake-private-key':
      k==='DALIL_BOUTIQUE_ORDERS_RATE_LIMIT_SECRET'?'local-test-only-secret-12345678901234567890':
      k==='DALIL_BOUTIQUE_ORDERS_ENABLED'?(liveOrdersEnabled?'true':'false'):null}},
    mockCreateClient:mockClient,
  },{filename:slug+'.js'});
  return handler;
}
const request=(payload,token,origin='https://app.dalil-tounes.com')=>new Request('https://example.invalid',{
  method:'POST',headers:{origin,'content-type':'application/json',...(token?{authorization:'Bearer '+token}:{})},
  body:JSON.stringify(payload),
});
const submit=await loadEndpoint('dalil-boutique-customer-submit');
const merchant=await loadEndpoint('dalil-boutique-merchant-orders');
const input={profileId:entreprise,productId,idempotencyKey:'8e445ab7-10be-4bb4-ac9d-0c865e49dacb',
  quantity:2,name:'Test Client',contact:'test@example.com',note:'Test only'};
// Browser preflight must accept real Supabase client headers, while excluding
// unknown origins and preserving the requirement for authenticated merchant POSTs.
const requiredBrowserHeaders=['authorization','x-client-info','apikey','content-type'];
for(const [slug,handler] of [
  ['customer-submit',submit], ['merchant-orders',merchant],
]){
  const preflight=await handler(new Request('https://example.invalid',{
    method:'OPTIONS',
    headers:{origin:'https://dalil-tounes-pwa.vercel.app',
      'access-control-request-method':'POST',
      'access-control-request-headers':requiredBrowserHeaders.join(',')},
  }));
  assert.equal(preflight.status,204,slug+' preflight must succeed');
  const permitted=(preflight.headers.get('access-control-allow-headers')||'').split(',').map(x=>x.trim().toLowerCase());
  for(const header of requiredBrowserHeaders) assert.ok(permitted.includes(header),slug+' missing CORS header '+header);
  assert.equal(preflight.headers.get('access-control-allow-origin'),'https://dalil-tounes-pwa.vercel.app');
  console.log('PASS',slug+' Supabase browser CORS preflight 204');
  const forbidden=await handler(new Request('https://example.invalid',{
    method:'OPTIONS',
    headers:{origin:'https://lienora.fr',
      'access-control-request-method':'POST',
      'access-control-request-headers':requiredBrowserHeaders.join(',')},
  }));
  assert.equal(forbidden.status,403,slug+' foreign origin must be rejected');
  console.log('PASS',slug+' foreign-origin preflight rejected 403');
}
// Request parsing and size-limit regression tests for both public and private handlers.
for (const [slug,handler] of [['customer-submit',submit],['merchant-orders',merchant]]) {
  const url='https://example.invalid';
  const create=(body,headers={})=>new Request(url,{method:'POST',
    headers:{origin:'https://app.dalil-tounes.com',...headers},body});
  const cases=[
    ['non-JSON content type',create('{}',{'content-type':'text/plain'}),415],
    ['oversized JSON body',create(JSON.stringify({padding:'x'.repeat(8300)}),{'content-type':'application/json'}),413],
    ['JSON array forbidden',create('[]',{'content-type':'application/json'}),400],
  ];
  for(const [scenario,request,status] of cases){
    // The merchant endpoint checks authentication before parsing the body.
    if(slug==='merchant-orders')request.headers.set('authorization','Bearer merchant-token');
    const response=await handler(request);
    assert.equal(response.status,status,slug+': '+scenario);
    console.log('PASS',slug,scenario,status);
  }
}
liveOrdersEnabled=false;
const closed=await submit(request(input));
assert.equal(closed.status,503,'Orders must fail closed without explicit server opt-in');
console.log('PASS disabled live order intake fails closed 503');
liveOrdersEnabled=true;
const cases=[
  ['Reject Lienora origin',()=>submit(request(input,undefined,'https://lienora.fr')),403],
  ['Reject missing fields',()=>submit(request({})),400],
  ['Accept validated order',()=>submit(request(input)),201],
  ['Idempotent same request',()=>submit(request(input)),200],
  ['Reject replay changed contact',()=>submit(request({...input,contact:'changed@example.com'})),409],
  ['Reject cross-enterprise product',()=>submit(request({...input,profileId:'10f84b99-2c37-47d1-91ba-4c35cda8c1af',idempotencyKey:'7e445ab7-10be-4bb4-ac9d-0c865e49dacb'})),404],
  ['Rate-limit repeated request',()=>{rateLimited=true;return submit(request({...input,idempotencyKey:'6e445ab7-10be-4bb4-ac9d-0c865e49dacb'}));},429],
  ['Deny unauthenticated merchant',()=>merchant(request({profileId:entreprise,action:'list'})),401],
  ['Deny other merchant',()=>merchant(request({profileId:entreprise,action:'list'},'outsider-token')),403],
  ['Merchant own inbox',()=>merchant(request({profileId:entreprise,action:'list'},'merchant-token')),200],
  ['Second merchant own inbox',()=>merchant(request({profileId:secondEntreprise,action:'list'},'second-merchant-token')),200],
  ['First merchant cannot read second merchant orders',()=>merchant(request({profileId:secondEntreprise,action:'list'},'merchant-token')),403],
  ['Second merchant cannot read first merchant orders',()=>merchant(request({profileId:entreprise,action:'list'},'second-merchant-token')),403],
  ['Second merchant cannot update first merchant order through own profile',()=>merchant(request({profileId:secondEntreprise,action:'update',id:data.dalil_boutique_customer_orders[0].id,status:'in_progress'},'second-merchant-token')),404],
  ['Cannot confirm unpaid order',()=>merchant(request({profileId:entreprise,action:'update',id:data.dalil_boutique_customer_orders[0].id,status:'confirmed'},'merchant-token')),409],
  ['Allow start processing',()=>merchant(request({profileId:entreprise,action:'update',id:data.dalil_boutique_customer_orders[0].id,status:'in_progress'},'merchant-token')),200],
  ['Cannot jump to completed',()=>merchant(request({profileId:entreprise,action:'update',id:data.dalil_boutique_customer_orders[0].id,status:'completed'},'merchant-token')),409],
];
for(const [name,act,status] of cases){
  const response=await act();
  assert.equal(response.status,status,name);
  console.log('PASS',name,status);
}
assert.equal(data.dalil_boutique_customer_orders.length,1,'No duplicate must be inserted');
console.log('PASS single stored order, no external communications');
 
// Full quote journey for the real pilot catalogue product, using mocked endpoints only.
// No production customer, order, payment, WhatsApp or email is created.
rateLimited=false;
const pilotRequest={profileId:entreprise,productId:pilotQuoteId,
  idempotencyKey:'3b89089b-d302-4a81-b1a1-f527a1412bb5',
  quantity:3,name:'ESSAI PILOTE - NE PAS TRAITER',
  contact:'pilot@example.invalid',note:'Date souhaitée : 2026-12-22\\nSimulation sans commande réelle'};
const pilotSubmitted=await submit(request(pilotRequest));
assert.equal(pilotSubmitted.status,201,'Pilot quote must be recorded');
const pilotPayload=await pilotSubmitted.json();
assert.equal(pilotPayload.kind,'quote');
assert.ok(pilotPayload.reference,'Pilot reference must exist');
assert.equal(data.dalil_boutique_customer_orders.length,2);
console.log('PASS pilot quote submitted with reference, no paid amount');
const pilotRetry=await submit(request(pilotRequest));
assert.equal(pilotRetry.status,200,'Retry must not duplicate quote');
assert.equal((await pilotRetry.json()).reference,pilotPayload.reference);
assert.equal(data.dalil_boutique_customer_orders.length,2);
console.log('PASS pilot quote retry does not duplicate');
const pilotInbox=await merchant(request({profileId:entreprise,action:'list'},'merchant-token'));
assert.equal(pilotInbox.status,200);
const pilotOrders=(await pilotInbox.json()).orders;
const storedPilot=pilotOrders.find(item=>item.id===pilotPayload.reference);
assert.ok(storedPilot,'Pilot quote must appear in professional inbox');
assert.equal(storedPilot.kind,'quote');
assert.equal(storedPilot.amount_total,null);
assert.equal(storedPilot.customer_note,pilotRequest.note);
console.log('PASS pilot quote visible to assigned merchant with chosen date');
const stolen=await merchant(request({profileId:entreprise,action:'list'},'second-merchant-token'));
assert.equal(stolen.status,403);
console.log('PASS pilot quote not visible to another merchant');
const pilotConfirmed=await merchant(request({profileId:entreprise,action:'update',
  id:pilotPayload.reference,status:'confirmed'},'merchant-token'));
assert.equal(pilotConfirmed.status,200,'Quote can be confirmed without payment');
const pilotCompleted=await merchant(request({profileId:entreprise,action:'update',
  id:pilotPayload.reference,status:'completed'},'merchant-token'));
assert.equal(pilotCompleted.status,200,'Quote can be completed');
const pilotRepeat=await merchant(request({profileId:entreprise,action:'update',
  id:pilotPayload.reference,status:'completed'},'merchant-token'));
assert.equal(pilotRepeat.status,409,'Closed quote cannot be modified again');
console.log('PASS quote workflow received to confirmed to completed, no payment claim');

