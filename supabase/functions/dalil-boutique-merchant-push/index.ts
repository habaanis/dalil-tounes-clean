import { createClient } from "npm:@supabase/supabase-js@2.112.2";

const origins = new Set([
  "https://dalil-tounes.com","https://www.dalil-tounes.com",
  "https://app.dalil-tounes.com","https://appli.dalil-tounes.com",
  "https://dalil-tounes-pwa.vercel.app","http://localhost:5173",
]);
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const reply = (value:unknown,status=200,origin="")=>new Response(JSON.stringify(value),{status,headers:{
  "content-type":"application/json","cache-control":"no-store","vary":"Origin",
  ...(origins.has(origin)?{"access-control-allow-origin":origin}:{})
}});
const validEndpoint = (endpoint:string) => {
  try {
    const value = new URL(endpoint);
    return endpoint.length<1600 && value.protocol==="https:" && !value.username && !value.password &&
      /^(fcm\.googleapis\.com|updates\.push\.services\.mozilla\.com|web\.push\.apple\.com|webpush\.push\.apple\.com|[\w-]+\.notify\.windows\.com)$/.test(value.hostname);
  } catch { return false; }
};
const validKey = (value:string,min:number,max:number) =>
  value.length>=min && value.length<=max && /^[\w-]+$/.test(value);
Deno.serve(async req=>{
  const origin=req.headers.get("origin")||"";
  if(req.method==="OPTIONS") {
    if(!origins.has(origin))return reply({error:"Forbidden"},403,origin);
    return new Response(null,{status:204,headers:{
      "access-control-allow-origin":origin,
      "access-control-allow-methods":"POST,OPTIONS",
      "access-control-allow-headers":"authorization,apikey,content-type",
      "vary":"Origin",
    }});
  }
  if(req.method!=="POST")return reply({error:"Method not allowed"},405,origin);
  if(!origins.has(origin))return reply({error:"Forbidden"},403,origin);
  const token=req.headers.get("authorization")?.match(/^Bearer (.+)$/i)?.[1];
  if(!token)return reply({error:"Authentication required"},401,origin);
  if(!/^application\/json(?:\s*;|\s*$)/i.test(req.headers.get("content-type")||""))
    return reply({error:"JSON required"},415,origin);
  const raw=await req.text().catch(()=>"");
  if(new TextEncoder().encode(raw).length>8192)return reply({error:"Too large"},413,origin);
  let input:any=null;
  try { const parsed=JSON.parse(raw);if(parsed&&typeof parsed==="object"&&!Array.isArray(parsed))input=parsed; }
  catch { /* Invalid JSON */ }
  if(!input||typeof input.action!=="string")return reply({error:"Invalid request"},400,origin);
  const url=Deno.env.get("SUPABASE_URL"),key=Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if(!url||!key)return reply({error:"Service unavailable"},503,origin);
  try {
    const db=createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false}});
    const {data:identity,error:authError}=await db.auth.getUser(token);
    if(authError||!identity.user)return reply({error:"Unauthorized"},401,origin);
    const profileId=input.profileId;
    if(typeof profileId!=="string"||!uuid.test(profileId))return reply({error:"Invalid company"},400,origin);
    const {data:access,error:accessError}=await db.from("professional_profile_access")
      .select("entreprise_id").eq("user_id",identity.user.id).eq("entreprise_id",profileId).maybeSingle();
    if(accessError)return reply({error:"Access unavailable"},503,origin);
    if(!access)return reply({error:"Forbidden"},403,origin);
    if(input.action==="config") {
      const {data:config,error}=await db.from("dalil_push_config")
        .select("vapid_public_key").eq("id",1).maybeSingle();
      return error||!config ? reply({error:"Notifications unavailable"},503,origin)
        : reply({enabled:true,publicKey:config.vapid_public_key},200,origin);
    }
    if(!["subscribe","unsubscribe","status"].includes(input.action))return reply({error:"Unknown action"},400,origin);
    const subscription=input.subscription;
    const endpoint=subscription?.endpoint,p256dh=subscription?.keys?.p256dh,auth=subscription?.keys?.auth;
    if(typeof endpoint!=="string"||!validEndpoint(endpoint)||
       typeof p256dh!=="string"||!validKey(p256dh,40,180)||
       typeof auth!=="string"||!validKey(auth,12,100))
      return reply({error:"Invalid subscription"},400,origin);
    const table=db.from("dalil_boutique_merchant_push_subscriptions");
    if(input.action==="status") {
      const {data,error}=await table.select("id")
        .eq("entreprise_id",profileId).eq("user_id",identity.user.id)
        .eq("endpoint",endpoint).eq("p256dh",p256dh).eq("auth",auth).maybeSingle();
      return error ? reply({error:"Status unavailable"},503,origin)
        : reply({subscribed:Boolean(data)},200,origin);
    }
    if(input.action==="unsubscribe") {
      const {error}=await table.delete().eq("entreprise_id",profileId).eq("user_id",identity.user.id)
        .eq("endpoint",endpoint);
      return error ? reply({error:"Unsubscribe unavailable"},503,origin)
        : reply({subscribed:false},200,origin);
    }
    const {count,error:countError}=await table.select("id",{head:true,count:"exact"})
      .eq("entreprise_id",profileId).eq("user_id",identity.user.id);
    if(countError)return reply({error:"Subscription unavailable"},503,origin);
    if((count||0)>=10) {
      const {data:existing}=await table.select("id").eq("entreprise_id",profileId)
        .eq("user_id",identity.user.id).eq("endpoint",endpoint).maybeSingle();
      if(!existing)return reply({error:"Device limit reached"},429,origin);
    }
    const {error}=await table.upsert({
      entreprise_id:profileId,user_id:identity.user.id,endpoint,p256dh,auth,last_seen_at:new Date().toISOString(),
    },{onConflict:"entreprise_id,user_id,endpoint"});
    return error ? reply({error:"Subscription unavailable"},503,origin)
      : reply({subscribed:true},200,origin);
  } catch {
    return reply({error:"Service unavailable"},503,origin);
  }
});
