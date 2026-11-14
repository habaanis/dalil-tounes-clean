import { createClient } from "npm:@supabase/supabase-js@2.112.2";
import webpush from "npm:web-push@3.6.7";

const json = (data:unknown,status=200) => new Response(JSON.stringify(data),{status,headers:{"content-type":"application/json","cache-control":"no-store"}});
const allowedOrigins = new Set(["https://dalil-tounes.com","https://www.dalil-tounes.com","https://app.dalil-tounes.com","http://localhost:5173"]);
Deno.serve(async req=>{
  if(req.method==="OPTIONS") {
    const origin=req.headers.get("origin")||"";
    return new Response(null,{status:204,headers:{"access-control-allow-origin":allowedOrigins.has(origin)?origin:"https://dalil-tounes.com","access-control-allow-headers":"authorization,apikey,content-type","access-control-allow-methods":"POST,OPTIONS"}});
  }
  const origin=req.headers.get("origin")||"";
  const headers={"access-control-allow-origin":allowedOrigins.has(origin)?origin:"https://dalil-tounes.com","vary":"Origin"};
  if(req.method!=="POST" || !allowedOrigins.has(origin)) return json({error:"Not allowed"},403);
  const authorization=req.headers.get("authorization")||"";
  const bearer=authorization.match(/^Bearer (.+)$/i)?.[1];
  if(!bearer) return json({error:"Authentication required"},401);
  try {
    const url=Deno.env.get("SUPABASE_URL");
    const secret=Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if(!url||!secret) return json({error:"Service unavailable"},503);
    const db=createClient(url,secret,{auth:{persistSession:false,autoRefreshToken:false}});
    const {data:identity,error:authError}=await db.auth.getUser(bearer);
    if(authError||!identity.user) return json({error:"Unauthorized"},401);
    const {data:admin,error:adminError}=await db.from("dalil_admin_access")
      .select("id").eq("id",identity.user.id).maybeSingle();
    if(adminError||!admin) return json({error:"Forbidden"},403);
    const input=await req.json();
    const productId=input?.productId;
    if(typeof productId!=="string"||!/^[0-9a-f-]{36}$/i.test(productId)) return json({error:"Invalid product"},400);
    const {data:product,error:productError}=await db.from("dalil_boutique_products")
      .select("id,profile_id,title,status,approved_at,updated_at")
      .eq("id",productId).eq("status","approved").maybeSingle();
    if(productError||!product||!product.approved_at) return json({error:"Product not approved"},409);
    const {data:profile}=await db.from("entreprise").select("nom,ville,slug,approved,statut_publication,statut_validation")
      .eq("id",product.entreprise_id).maybeSingle();
    if(!profile||profile.approved!==true||profile.statut_publication!=="Publié"||profile.statut_validation!=="publie") return json({error:"Merchant not published"},409);
    const {data:config}=await db.from("dalil_push_config").select("vapid_public_key,vapid_private_key").eq("id",1).maybeSingle();
    if(!config) return json({sent:0,reason:"No push configuration"});
    const {data:subscriptions,error:subError}=await db.from("dalil_boutique_push_subscriptions")
      .select("id,endpoint,p256dh,auth").eq("entreprise_id",product.entreprise_id).limit(500);
    if(subError) return json({error:"Subscriptions unavailable"},503);
    if(!subscriptions?.length) return json({sent:0,reason:"No subscribers"});
    const version=product.updated_at || product.approved_at;
    const {error:dedupeError}=await db.from("dalil_push_sent_events").insert({product_id:productId,version_at:version});
    if(dedupeError?.code==="23505") return json({sent:0,reason:"Already notified"});
    if(dedupeError) return json({error:"Notification guard unavailable"},503);
    webpush.setVapidDetails("https://dalil-tounes.com",config.vapid_public_key,config.vapid_private_key);
    const notification=JSON.stringify({
      title:"Nouveauté · "+String(profile.nom||"Boutique").slice(0,50),
      body:String(product.title).slice(0,120),
      path:"/entreprise/"+encodeURIComponent(String(profile.ville||"").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9-]+/g,"-"))+"/"+encodeURIComponent(String(profile.slug||"")),
      tag:"dalil-boutique-"+product.id,
    });
    let sent=0, expired=0, failed=0;
    for(let i=0;i<(subscriptions?.length||0);i+=10) {
      const batch=(subscriptions||[]).slice(i,i+10);
      await Promise.all(batch.map(async sub=>{
        try {
          await webpush.sendNotification({endpoint:sub.endpoint,keys:{p256dh:sub.p256dh,auth:sub.auth}},notification,{TTL:3600,urgency:"normal"});
          sent++;
        } catch(err) {
          if(err && typeof err==="object" && "statusCode" in err && (err.statusCode===404||err.statusCode===410)) {
            await db.from("dalil_boutique_push_subscriptions").delete().eq("id",sub.id);
            expired++;
          } else failed++;
        }
      }));
    }
    return new Response(JSON.stringify({sent,expired,failed}),{headers:{"content-type":"application/json",...headers}});
  } catch(err) {
    console.error("Push dispatch failed",err instanceof Error?err.name:"unknown");
    return json({error:"Notification service unavailable"},503);
  }
});
