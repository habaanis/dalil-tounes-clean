import { createClient } from 'npm:@supabase/supabase-js@2.57.4';
import webpush from 'npm:web-push@3.6.7';

const origins = new Set(['https://dalil-tounes.com','https://www.dalil-tounes.com','https://appli.dalil-tounes.com','https://dalil-tounes-pwa.vercel.app']);
const allowedOrigin = (o: string) => origins.has(o) || /^https:\/\/dalil-tounes(?:-clean|-pwa)?-[a-z0-9-]+-haba-anis-projects\.vercel\.app$/.test(o);
const hash = async (s: string) => Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s)))).map(x=>x.toString(16).padStart(2,'0')).join('');
const tokenValid = (v: unknown): v is string => typeof v === 'string' && /^[0-9a-f]{64}$/.test(v);
const endpointValid = (v: unknown): v is string => {
  if(typeof v !== 'string' || v.length>1600) return false;
  try { const u=new URL(v); return u.protocol==='https:' && !u.port && !u.username && !u.password && !u.hash && /^(fcm\.googleapis\.com|updates\.push\.services\.mozilla\.com|web\.push\.apple\.com|webpush\.push\.apple\.com|[\w-]+\.notify\.windows\.com)$/.test(u.hostname); } catch { return false; }
};
const keyValid = (v: unknown,bytes:number) => {
  if(typeof v!=='string'||!/^[A-Za-z0-9_-]+$/.test(v))return false;
  try{return atob(v.replace(/-/g,'+').replace(/_/g,'/')).length===bytes;}catch{return false;}
};
const copy:Record<string,[string,string,string]> = {
 fr:['Dalil Tounes · Emploi','Nouvelles offres correspondant à votre recherche','Alerte emploi : notification de test'],
 ar:['دليل تونس · وظائف','عروض جديدة تطابق بحثك','تنبيه الوظائف: إشعار تجريبي'],
 en:['Dalil Tounes · Jobs','New jobs matching your search','Job alert: test notification'],
 it:['Dalil Tounes · Lavoro','Nuove offerte corrispondenti alla ricerca','Avviso lavoro: notifica di prova'],
 ru:['Dalil Tounes · Работа','Новые вакансии по вашему запросу','Оповещение о работе: тестовое уведомление']
};
const fields='id,keyword,governorate,contract,frequency,language,enabled,criteria_since,last_dispatch_at,consent_at';
Deno.serve(async req=>{
 const origin=req.headers.get('origin')||'';
 const headers={'Content-Type':'application/json','Cache-Control':'no-store','Vary':'Origin',...(allowedOrigin(origin)?{'Access-Control-Allow-Origin':origin}:{}),'Access-Control-Allow-Headers':'authorization,apikey,content-type,x-client-info','Access-Control-Allow-Methods':'POST, OPTIONS'};
 const json=(body:unknown,status=200)=>new Response(JSON.stringify(body),{status,headers});
 if(req.method==='OPTIONS')return new Response(null,{status:allowedOrigin(origin)?204:403,headers});
 if(req.method!=='POST')return json({error:'method'},405);
 const url=Deno.env.get('SUPABASE_URL'),key=Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
 if(!url||!key)return json({error:'unavailable'},503);
 const db=createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false}});
 try {
  const raw=await req.text();if(raw.length>12000)return json({error:'size'},413);
  const b=JSON.parse(raw);
  if(!b||typeof b!=='object'||Array.isArray(b))return json({error:'invalid'},400);
  const cfg=await db.from('emploi_alert_config').select('enabled,dispatch_hash').eq('id',1).single();
  if(cfg.error)return json({error:'unavailable'},503);
  if(b.action==='dispatch'){
   if(!tokenValid(b.dispatchToken)||await hash(b.dispatchToken)!==cfg.data.dispatch_hash)return json({error:'forbidden'},403);
   await db.from('emploi_alert_rate_limits').delete().lt('expires_at',new Date().toISOString());
   await db.from('emploi_alert_deliveries').update({status:'unknown'}).eq('status','reserved').lt('reserved_at',new Date(Date.now()-15*60_000).toISOString());
   if(!cfg.data.enabled)return json({ok:true,disabled:true,sent:0});
   const config=await db.from('dalil_push_config').select('vapid_public_key,vapid_private_key').eq('id',1).single();
   if(config.error)return json({error:'unavailable'},503);
   webpush.setVapidDetails('https://dalil-tounes.com',config.data.vapid_public_key,config.data.vapid_private_key);
   const batch=await db.rpc('emploi_alert_reserve',{p_limit:10});
   if(batch.error)return json({error:'reserve'},503);
   let sent=0,failed=0,skipped=0;
   await Promise.all((batch.data||[]).map(async (s:any)=>{
    const current=await db.from('emploi_alert_subscriptions').select('enabled,criteria_since,endpoint,p256dh,auth').eq('id',s.subscription_id).maybeSingle();
    const active=await db.from('emploi_alert_eligible_jobs').select('id,title,company,city').in('id',s.job_ids);
    const finish=async(status:string)=>{const r=await db.from('emploi_alert_deliveries').update({status,...(status==='sent'?{sent_at:new Date().toISOString()}:{})}).eq('subscription_id',s.subscription_id).in('job_id',s.job_ids);if(r.error)console.error('emploi delivery status failed',r.error.code);};
    if(current.error||active.error){await finish('failed');failed++;return;}
    if(!current.data?.enabled||current.data.criteria_since!==s.criteria_since||current.data.endpoint!==s.endpoint||current.data.auth!==s.auth||current.data.p256dh!==s.p256dh||!active.data?.length){await finish('failed');skipped++;return;}
    const jobs=active.data;const t=copy[s.language]||copy.fr;
    const path=jobs.length===1?'/jobs?job='+encodeURIComponent(jobs[0].id):'/jobs?jobs='+encodeURIComponent(jobs.map(j=>j.id).join(','));
    const payload=JSON.stringify({title:t[0],body:jobs.length===1?jobs[0].title+' · '+jobs[0].city:jobs.length+' · '+t[1],path,url:path,tag:'emploi-'+s.subscription_id+'-'+s.job_ids[0]});
    try{await webpush.sendNotification({endpoint:s.endpoint,keys:{p256dh:s.p256dh,auth:s.auth}},payload,{TTL:3600,urgency:'normal',timeout:8000});const actualIds=jobs.map(j=>j.id);
      const written=await db.from('emploi_alert_deliveries').update({status:'sent',sent_at:new Date().toISOString()}).eq('subscription_id',s.subscription_id).in('job_id',actualIds);
      if(written.error)console.error('emploi delivery status failed',written.error.code);
      const excluded=s.job_ids.filter((id:string)=>!actualIds.includes(id));
      if(excluded.length)await db.from('emploi_alert_deliveries').update({status:'failed'}).eq('subscription_id',s.subscription_id).in('job_id',excluded);
      sent++;}
    catch(e){const status=Number((e as {statusCode?:number})?.statusCode||0);if(status===404||status===410){await db.from('emploi_alert_subscriptions').delete().eq('id',s.subscription_id);}else await finish(status>=400&&status<500?'failed':'unknown');failed++;}
   }));
   return json({ok:true,sent,failed,skipped});
  }
  if(!allowedOrigin(origin))return json({error:'origin'},403);
  const pilot=async()=>{
   const bearer=req.headers.get('authorization')?.replace(/^Bearer\s+/i,'')||'';
   if(!bearer)return false;
   const u=await db.auth.getUser(bearer);
   if(u.error||!u.data.user)return false;
   const admin=await db.from('admins').select('id').eq('id',u.data.user.id).maybeSingle();
   return !admin.error&&!!admin.data;
  };
  const available=(cfg.data.enabled && origins.has(origin)) || await pilot();
  if(b.action==='config'){
   if(!available)return json({enabled:false});
   const r=await db.from('dalil_push_config').select('vapid_public_key').eq('id',1).single();
   return r.error?json({error:'unavailable'},503):json({enabled:true,pilot:!cfg.data.enabled,publicKey:r.data.vapid_public_key});
  }
  if(!tokenValid(b.token))return json({error:'token'},400);
  const digest=await hash(b.token);
  const ip=req.headers.get('cf-connecting-ip')||req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()||'unknown';
  const rate=await db.rpc('emploi_alert_rate_limit',{p_fingerprint:await hash('emploi:'+ip+':'+new Date().toISOString().slice(0,13))});
  if(rate.error||rate.data!==true)return json({error:'rate'},429);
  const existing=await db.from('emploi_alert_subscriptions').select(fields).eq('management_token_hash',digest).maybeSingle();
  if(existing.error)return json({error:'unavailable'},503);
  if(b.action==='status')return json({alert:existing.data});
  if(b.action==='delete'){
   const r=await db.from('emploi_alert_subscriptions').delete().eq('management_token_hash',digest);
   return r.error?json({error:'unavailable'},503):json({alert:null});
  }
  if(b.action==='pause'){
   const r=await db.from('emploi_alert_subscriptions').update({enabled:false}).eq('management_token_hash',digest).select(fields).maybeSingle();
   return r.error?json({error:'unavailable'},503):json({alert:r.data});
  }
  if(!available)return json({error:'disabled'},503);
  if(b.action==='save'){
   const keyword=typeof b.keyword==='string'?b.keyword.trim():'';
   const governorate=typeof b.governorate==='string'?b.governorate.trim():'';
   const contract=typeof b.contract==='string'?b.contract:'';
   const sub=b.subscription;
   if(b.consent!==true||keyword.length>120||governorate.length>80||!['','CDI','CDD','SIVP','Stage','Saisonnier','Temps partiel'].includes(contract)||(!keyword&&!governorate&&!contract)||!['instant','daily','weekly'].includes(b.frequency)||!Object.hasOwn(copy,b.language)||!endpointValid(sub?.endpoint)||!keyValid(sub?.keys?.p256dh,65)||!keyValid(sub?.keys?.auth,16))return json({error:'invalid'},400);
   const now=new Date().toISOString();
   const prior=existing.data;
   const unchanged=prior?.enabled && prior.keyword===keyword && prior.governorate===governorate && prior.contract===contract && prior.frequency===b.frequency;
   const row={management_token_hash:digest,endpoint:sub.endpoint,p256dh:sub.keys.p256dh,auth:sub.keys.auth,keyword,governorate,contract,frequency:b.frequency,language:b.language,enabled:true,consent_at:prior?.consent_at||now,criteria_since:unchanged?prior.criteria_since:now,last_dispatch_at:unchanged?prior.last_dispatch_at:null};
   const r=await db.from('emploi_alert_subscriptions').upsert(row,{onConflict:'management_token_hash'}).select(fields).single();
   return r.error?json({error:r.error.code==='23505'?'existing':'unavailable'},r.error.code==='23505'?409:503):json({alert:r.data});
  }
  if(b.action==='test'){
   if(!existing.data?.enabled)return json({error:'inactive'},409);
   const limit=await db.from('emploi_alert_rate_limits').insert({fingerprint:await hash('test:'+digest+':'+new Date().toISOString().slice(0,16)),expires_at:new Date(Date.now()+2*60*60_000).toISOString()});
   if(limit.error)return json({error:'rate'},429);
   const sub=await db.from('emploi_alert_subscriptions').select('endpoint,p256dh,auth,language').eq('management_token_hash',digest).eq('enabled',true).single();
   const config=await db.from('dalil_push_config').select('vapid_public_key,vapid_private_key').eq('id',1).single();
   if(sub.error||config.error)return json({error:'unavailable'},503);
   const t=copy[sub.data.language]||copy.fr;
   webpush.setVapidDetails('https://dalil-tounes.com',config.data.vapid_public_key,config.data.vapid_private_key);
   await webpush.sendNotification({endpoint:sub.data.endpoint,keys:{p256dh:sub.data.p256dh,auth:sub.data.auth}},JSON.stringify({title:t[0],body:t[2],path:'/jobs',url:'/jobs',tag:'emploi-test'}),{TTL:300,timeout:8000});
   return json({accepted:true});
  }
  return json({error:'action'},400);
 }catch(e){console.error('emploi alerts',e instanceof Error?e.name:'unknown');return json({error:'unavailable'},503);}
});
