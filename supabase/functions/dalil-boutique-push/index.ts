import { createClient } from "npm:@supabase/supabase-js@2.112.2";
import webpush from "npm:web-push@3.6.7";

const allowedOrigins = new Set(["https://dalil-tounes.com", "https://www.dalil-tounes.com", "https://app.dalil-tounes.com", "http://localhost:5173"]);
const json = (value: unknown, status=200, origin="") => new Response(JSON.stringify(value), {
  status,
  headers: {"content-type":"application/json", "cache-control":"no-store",
    ...(allowedOrigins.has(origin)?{"access-control-allow-origin":origin,"vary":"Origin"}:{})},
});
const base64 = async (value:string) => Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256",new TextEncoder().encode(value)))).map(x=>x.toString(16).padStart(2,"0")).join("");
const validEndpoint = (endpoint:string) => {
  try {
    const u=new URL(endpoint);
    return u.protocol==="https:" && !u.username && !u.password
      && /^(fcm\.googleapis\.com|updates\.push\.services\.mozilla\.com|web\.push\.apple\.com|webpush\.push\.apple\.com|[\w-]+\.notify\.windows\.com)$/.test(u.hostname)
      && endpoint.length<1600;
  } catch { return false; }
};
const validBase64Url=(value:string,min:number,max:number) => value.length>=min && value.length<=max && /^[\w-]+$/.test(value);
Deno.serve(async req=>{
  const origin=req.headers.get("origin")||"";
  if(req.method==="OPTIONS") return new Response(null,{status:204,headers:{
    "access-control-allow-origin":allowedOrigins.has(origin)?origin:"https://dalil-tounes.com",
    "access-control-allow-methods":"POST, OPTIONS","access-control-allow-headers":"authorization,apikey,content-type","vary":"Origin",
  }});
  if(req.method!=="POST" || !allowedOrigins.has(origin)) return json({error:"Not allowed"},403,origin);
  try {
    const key=Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const url=Deno.env.get("SUPABASE_URL");
    if(!key||!url) return json({error:"Service indisponible"},503,origin);
    const db=createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false}});
    const body=await req.json();
    if(!body || typeof body.action!=="string") return json({error:"Invalid request"},400,origin);
    if(body.action==="config") {
      const {data:stored,error:fetchError}=await db.from("dalil_push_config").select("vapid_public_key").eq("id",1).maybeSingle();
      if(fetchError) return json({error:"Configuration indisponible"},503,origin);
      if(stored?.vapid_public_key) return json({publicKey:stored.vapid_public_key,enabled:true},200,origin);
      // One permanent keypair per project, stored server-side, never exposed to browsers.
      const generated=webpush.generateVAPIDKeys();
      await db.from("dalil_push_config").upsert({id:1,vapid_public_key:generated.publicKey,vapid_private_key:generated.privateKey},{onConflict:"id",ignoreDuplicates:true});
      const {data:ready}=await db.from("dalil_push_config").select("vapid_public_key").eq("id",1).single();
      if(!ready?.vapid_public_key) return json({error:"Configuration indisponible"},503,origin);
      return json({publicKey:ready.vapid_public_key,enabled:true},200,origin);
    }
    if(!["subscribe","unsubscribe","status"].includes(body.action)) return json({error:"Unknown action"},400,origin);
    const profileId=body.profileId;
    const sub=body.subscription;
    const endpoint=sub?.endpoint, p256dh=sub?.keys?.p256dh, auth=sub?.keys?.auth;
    if(typeof profileId!=="string"|| !/^[0-9a-f-]{36}$/i.test(profileId)
       || typeof endpoint!=="string" || !validEndpoint(endpoint)
       || typeof p256dh!=="string" || !validBase64Url(p256dh,40,180)
       || typeof auth!=="string" || !validBase64Url(auth,12,100)) return json({error:"Invalid subscription"},400,origin);
    const ip=req.headers.get("cf-connecting-ip") || req.headers.get("x-forwarded-for")?.split(",")[0]?.trim()||"unknown";
    const fingerprint=await base64(ip+":"+new Date().toISOString().slice(0,13));
    const {data:limit}=await db.from("dalil_push_rate_limits").select("attempts").eq("id",fingerprint).maybeSingle();
    if(limit && limit.attempts>=40) return json({error:"Trop de demandes, réessayez plus tard"},429,origin);
    await db.from("dalil_push_rate_limits").upsert({id:fingerprint,window_start:new Date().toISOString(),attempts:(limit?.attempts||0)+1},{onConflict:"id"});
    if(body.action==="status") {
      const {data,error}=await db.from("dalil_boutique_push_subscriptions")
        .select("id").eq("entreprise_id",profileId).eq("endpoint",endpoint).eq("auth",auth).maybeSingle();
      return error?json({error:"Vérification indisponible"},503,origin):json({subscribed:Boolean(data)},200,origin);
    }
    if(body.action==="unsubscribe") {
      const {error}=await db.from("dalil_boutique_push_subscriptions").delete()
        .eq("entreprise_id",profileId).eq("endpoint",endpoint).eq("auth",auth);
      return error?json({error:"Désabonnement indisponible"},503,origin):json({subscribed:false},200,origin);
    }
    const {data:profile,error:profileErr}=await db.from("entreprise")
      .select("id").eq("id",profileId).eq("approved",true).eq("statut_publication","Publié").eq("statut_validation","publie").maybeSingle();
    if(profileErr || !profile) return json({error:"Boutique non disponible"},404,origin);
    const {count}=await db.from("dalil_boutique_push_subscriptions").select("id",{head:true,count:"exact"}).eq("entreprise_id",profileId);
    if((count||0)>5000) return json({error:"Capacité temporairement atteinte"},429,origin);
    const {error}=await db.from("dalil_boutique_push_subscriptions").upsert({
      entreprise_id:profileId,endpoint,p256dh,auth,last_seen_at:new Date().toISOString(),
    },{onConflict:"entreprise_id,endpoint"});
    return error?json({error:"Abonnement indisponible"},503,origin):json({subscribed:true},200,origin);
  } catch(error) {
    console.error("Boutique subscription error",error instanceof Error?error.name:"unknown");
    return json({error:"Service indisponible"},503,origin);
  }
});
