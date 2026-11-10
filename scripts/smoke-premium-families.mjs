// Read-only HTTP coverage, intentionally distinct from browser rendering checks.
import fs from 'node:fs';
const base=process.env.SMOKE_BASE_URL;
if(!base)throw new Error('SMOKE_BASE_URL required');
const routes=fs.readFileSync('docs/public-premium-routes.md','utf8').split('\n').filter(x=>x.endsWith('| Public |')).map(x=>x.split('|')[1].trim()).filter(x=>!x.includes(':')&&!x.includes('*')).concat(['/metier/dentiste','/ville/tunis','/secteur/sante','/gouvernorat/nabeul','/dentiste-tunis']);
const results=[];
for(const route of routes){
 const start=performance.now();
 try {const r=await fetch(new URL(route,base),{signal:AbortSignal.timeout(15000)});const html=await r.text();const ok=r.ok&&html.includes('id="root"');results.push({route,status:r.status,ok,ms:Math.round(performance.now()-start)});}
 catch(e){results.push({route,ok:false,error:e.message});}
}
console.log(JSON.stringify(results,null,2));
console.log(`${results.filter(r=>r.ok).length}/${routes.length} HTTP checks passed`);
if(results.some(r=>!r.ok))process.exitCode=1;
