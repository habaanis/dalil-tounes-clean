// Synthetic-only security regression tests. No remote Supabase call or real order.
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { transform } from 'esbuild';
import vm from 'node:vm';

const entreprise='36f84b99-2c37-47d1-91ba-4c35cda8c1af';
const productId='9e445ab7-10be-4bb4-ac9d-0c865e49dacb';
const data={
  entreprise:[{id:entreprise,approved:true,statut_publication:'Publié',statut_validation:'publie'}],
  dalil_boutique_products:[{id:productId,entreprise_id:entreprise,title:'Test',mode:'order',price:30,currency:'TND',status:'approved',approved_at:'2026-11-14T10:00:00Z'}],
  dalil_boutique_customer_orders:[],
  professional_profile_access:[{user_id:'merchant-1',entreprise_id:entreprise}],
};
let rateLimited=false;
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
        if(matched().length) return {data:null,error:{code:'23505'}};
        const old=data[table].find(row=>row.entreprise_id===payload.entreprise_id&&row.idempotency_key===payload.idempotency_key);
        if(old)return {data:null,error:{code:'23505'}};
        const row={...payload,id:'e1ac9661-8fd8-4bcb-af79-b1c0e6edbd92',status:'received',payment_status:'not_requested',created_at:new Date().toISOString()};
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
    auth:{getUser:async token=>({data:{user:{id:token==='merchant-token'?'merchant-1':'outsider'}},error:null})}};
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
      k==='DALIL_BOUTIQUE_ORDERS_RATE_LIMIT_SECRET'?'local-test-only-secret-12345678901234567890':null}},
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
