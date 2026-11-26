import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import path from 'node:path';
import { build } from 'esbuild';

// Mounted PWA dashboard + actual claim helper. No live account is modified.
const require=createRequire(import.meta.url);
let reactRequire=require;
try{require.resolve('react-test-renderer');}catch{reactRequire=createRequire(path.resolve(process.env.DALIL_QA_RUNTIME||'../qa-runtime','package.json'));}
const React=reactRequire('react');
const {create,act}=reactRequire('react-test-renderer');
const bundle=await build({entryPoints:['src/pages/CompanyDashboard.tsx'],bundle:true,write:false,format:'cjs',platform:'node',jsx:'automatic',external:['react','react/jsx-runtime'],plugins:[{name:'pwa-claim-fixture',setup(builder){
  builder.onResolve({filter:/supabaseClient$/},()=>({path:'supabase',namespace:'pwa-fixture'}));
  builder.onResolve({filter:/context\/AuthContext$/},()=>({path:'auth',namespace:'pwa-fixture'}));
  builder.onResolve({filter:/components\/forms\/JobPostForm$/},()=>({path:'jobs',namespace:'pwa-fixture'}));
  builder.onResolve({filter:/^lucide-react$/},()=>({path:'icons',namespace:'pwa-fixture'}));
  builder.onLoad({filter:/.*/,namespace:'pwa-fixture'},({path})=>({loader:'js',contents:path==='supabase'?`
    const state=()=>globalThis.__pwaClaimTest;
    export const supabase={
      async rpc(name,args){const s=state();s.calls.push({name,args});return {data:s.claim,error:s.claimError?new Error('Claim unavailable'):null};},
      from(table){
        const s=state();s.calls.push({table});
        return {select(){return {async eq(key,value){
          s.calls.push({key,value});return {data:s.rows,error:s.readError?new Error('Read unavailable'):null};
        }};}};
      }
    };
    `:path==='auth'?`export const useAuth=()=>({user:globalThis.__pwaClaimTest.user,signOut:async()=>{}});`:
    path==='jobs'?`export default function JobPostForm(){return null;}`:
    `const Icon=()=>null;export {Icon as Briefcase,Icon as Users,Icon as Building2,Icon as Settings,Icon as LogOut};`
  }));
}}]});
const module={exports:{}};
new Function('require','module','exports',bundle.outputFiles[0].text)(reactRequire,module,module.exports);
const Dashboard=module.exports.default;
const originalStorage=globalThis.localStorage;
globalThis.localStorage={getItem:()=>null,removeItem:()=>{}};
let renderer;
const state=()=>globalThis.__pwaClaimTest;
const accessLinks=()=>renderer.root.findAllByType('a').map(node=>node.props.href);
const alerts=()=>renderer.root.findAll(node=>node.props.role==='alert');
async function mount(options={}){
  if(renderer)await act(async()=>renderer.unmount());
  globalThis.__pwaClaimTest={user:{id:'owner-fixture',email:'owner@example.test'},calls:[],rows:[{entreprise_id:'own-business'}],claim:{claimed:['claim-result-not-used-for-access'],conflicts:0,requires_confirmation:false},...options};
  await act(async()=>{renderer=create(React.createElement(Dashboard,{onNavigate:()=>{}}));});
}
try{
  await mount();
  assert.deepEqual(state().calls,[{name:'dalil_claim_my_miniapps',args:undefined},{table:'professional_profile_access'},{key:'user_id',value:'owner-fixture'}]);
  assert.deepEqual(accessLinks(),['https://app.dalil-tounes.com/own-business/compte']);assert.equal(alerts().length,0);
  console.log('PASS PWA claims first without client email/company arguments, then displays only authenticated access rows');
  await mount({claimError:true});assert.equal(accessLinks().length,1);assert.equal(alerts().length,0);
  console.log('PASS existing PWA professional access remains available when automatic claim fails');
  for(const options of [{claimError:true,rows:[]},{claim:{},rows:[]},{readError:true}]){
    await mount(options);assert.equal(accessLinks().length,0);assert.equal(alerts().length,1);
  }
  console.log('PASS failed/malformed claim without existing access and access read errors never grant or announce false access');
  await mount({rows:[],claim:{claimed:[],conflicts:0,requires_confirmation:true}});assert.equal(accessLinks().length,0);
  await mount({user:null});assert.equal(state().calls.length,0);assert.equal(accessLinks().length,0);
  console.log('PASS unconfirmed and anonymous accounts gain no professional links');
}finally{
  if(renderer)await act(async()=>renderer.unmount());delete globalThis.__pwaClaimTest;
  if(originalStorage===undefined)delete globalThis.localStorage;else globalThis.localStorage=originalStorage;
}
