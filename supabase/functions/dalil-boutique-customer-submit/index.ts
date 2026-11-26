import { createClient } from "npm:@supabase/supabase-js@2.112.2";
import webpush from "npm:web-push@3.6.7";


// Server-validated customer requests. Never trust client price, payment state or product ownership.
const origins = new Set(["https://dalil-tounes.com","https://www.dalil-tounes.com","https://app.dalil-tounes.com","https://appli.dalil-tounes.com","https://pwa.dalil-tounes.com","https://dalil-tounes-pwa.vercel.app","http://localhost:5173"]);
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const entrepriseId = /^[a-z0-9][a-z0-9_-]{0,99}$/i;
// Public orders are available to every published, approved professional with an approved product.
// Merchant publication and product approval are enforced again on every POST.
// Service configuration and rate limiting remain mandatory.
const intakeEnabled=(_id:string)=>true;
const reply = (data:unknown,status=200,origin="") => new Response(JSON.stringify(data),{status,headers:{
  "content-type":"application/json","cache-control":"no-store","vary":"Origin",
  ...(origins.has(origin)?{"access-control-allow-origin":origin}:{})
}});
const hash = async (text:string) => Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256",new TextEncoder().encode(text))))
  .map(byte=>byte.toString(16).padStart(2,"0")).join("");


// Only bind browser push to the order created by this request, never to a
// merchant's general followers or another customer's order.
const validCustomerPush = (sub:any) => {
  try {
    const endpoint=sub?.endpoint, p256dh=sub?.keys?.p256dh, auth=sub?.keys?.auth;
    if(typeof endpoint!=="string"||endpoint.length>1600
      ||typeof p256dh!=="string"||!/(^[A-Za-z0-9_-]{40,180}$)/.test(p256dh)
      ||typeof auth!=="string"||!/(^[A-Za-z0-9_-]{12,100}$)/.test(auth))return null;
    const url=new URL(endpoint);
    if(url.protocol!=="https:"||url.username||url.password||
      !/^(fcm\.googleapis\.com|updates\.push\.services\.mozilla\.com|web\.push\.apple\.com|webpush\.push\.apple\.com|[\w-]+\.notify\.windows\.com)$/.test(url.hostname))return null;
    return { endpoint, p256dh, auth };
  } catch { return null; }
};

// Merchant notifications use a private subscription table, never customer followers.
const sendMerchantAlert = async (db:ReturnType<typeof createClient>,profileId:string,orderId:string,kind:string) => {
  const {data:assigned,error:assignmentError}=await db.from("professional_profile_access")
    .select("user_id").eq("entreprise_id",profileId).limit(50);
  if(assignmentError||!assigned?.length)return;
  const allowed=assigned.map(item=>item.user_id);
  const {data:subscriptions,error:subscriptionsError}=await db.from("dalil_boutique_merchant_push_subscriptions")
    .select("id,endpoint,p256dh,auth").eq("entreprise_id",profileId).in("user_id",allowed).limit(50);
  if(subscriptionsError||!subscriptions?.length)return;
  const {data:config,error:configError}=await db.from("dalil_push_config")
    .select("vapid_public_key,vapid_private_key").eq("id",1).maybeSingle();
  if(configError||!config)return;
  // Use the dedicated, owner-restricted mini-app account rather than the
  // platform-wide dashboard. The customer-facing CV choice stays unchanged.
  const {data:merchant}=await db.from("entreprise")
    .select("slug_court,slug,modele_cv").eq("id",profileId).maybeSingle();
  const appId=String(merchant?.slug_court||merchant?.slug||profileId);
  const cv=String(merchant?.modele_cv||"").toLowerCase().includes("portfolio")?"portfolio":"business";
  const path="/"+encodeURIComponent(appId)+"/compte?tab=orders&cv="+cv;
  webpush.setVapidDetails("https://dalil-tounes.com",config.vapid_public_key,config.vapid_private_key);
  const payload=JSON.stringify({
    title:kind==="quote"?"Nouvelle demande de devis":"Nouvelle commande à traiter",
    body:"Ouvrez Mes commandes dans votre mini-appli.",
    path,
    url:"https://app.dalil-tounes.com"+path,
    tag:"dalil-merchant-order-"+orderId,
  });
  for(let index=0;index<subscriptions.length;index+=10) {
    await Promise.all(subscriptions.slice(index,index+10).map(async sub=>{
      try {
        await webpush.sendNotification({endpoint:sub.endpoint,keys:{p256dh:sub.p256dh,auth:sub.auth}},
          payload,{TTL:3600,urgency:"normal"});
      } catch(error) {
        const status=error&&typeof error==="object"&&"statusCode" in error?Number(error.statusCode):0;
        if(status===404||status===410)
          await db.from("dalil_boutique_merchant_push_subscriptions").delete().eq("id",sub.id);
      }
    }));
  }
};

Deno.serve(async req => {
  const origin=req.headers.get("origin")||"";
  if(req.method==="OPTIONS"){
    if(!origins.has(origin))return reply({error:"Forbidden"},403,origin);
    return new Response(null,{status:204,headers:{"access-control-allow-origin":origin,
      "access-control-allow-methods":"GET,POST,OPTIONS","access-control-allow-headers":"authorization,x-client-info,apikey,content-type,x-retry-count,traceparent,tracestate,baggage","vary":"Origin"}});
  }
  // Public read-only readiness check: no credentials, payment, customer data or order writes.
  // Browser must not present a writable form while live intake remains disabled.
  if(req.method==="GET"){
    if(!origins.has(origin))return reply({error:"Forbidden"},403,origin);
    // Dedicated rate-limit secret is preferred, but a private service-key-derived fallback
    // preserves per-customer throttling if the optional custom secret is not configured.
    const configured=Boolean(Deno.env.get("SUPABASE_URL") && (Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")||"").length>=24);
    const id=new URL(req.url).searchParams.get("profileId")||"";
    return reply({available:configured && entrepriseId.test(id) && intakeEnabled(id)},200,origin);
  }
  if(req.method!=="POST")return reply({error:"Method not allowed"},405,origin);
  if(!origins.has(origin))return reply({error:"Forbidden"},403,origin);
  if(Number(req.headers.get("content-length")||"0")>8192)return reply({error:"Payload too large"},413,origin);
  // Reject oversized or non-JSON bodies even when Content-Length is omitted or falsified.
  if(!/^application\/json(?:\s*;|\s*$)/i.test(req.headers.get("content-type")||""))
    return reply({error:"JSON required"},415,origin);
  const raw=await req.text().catch(()=>"");
  if(new TextEncoder().encode(raw).length>8192)return reply({error:"Payload too large"},413,origin);
  let body:any=null;
  try { const parsed=JSON.parse(raw); if(parsed&&typeof parsed==="object"&&!Array.isArray(parsed))body=parsed; } catch { /* Invalid JSON */ }
  if(!body)return reply({error:"Invalid request"},400,origin);
  const {profileId,productId,idempotencyKey,quantity}=body;
  const customerPush=validCustomerPush(body?.customerPush);
  // All eligible published merchants can receive requests; validation remains server-side.
  if(typeof profileId!=="string" || !entrepriseId.test(profileId) || !intakeEnabled(profileId))
    return reply({error:"Orders are not yet active"},503,origin);
  const customerName=typeof body.name==="string"?body.name.trim():"";
  const contact=typeof body.contact==="string"?body.contact.trim():"";
  const note=typeof body.note==="string"?body.note.trim():"";
  if(typeof profileId!=="string"||!entrepriseId.test(profileId)||
     typeof productId!=="string"||!uuid.test(productId)||
     typeof idempotencyKey!=="string"||!uuid.test(idempotencyKey)||
     !Number.isInteger(quantity)||quantity<1||quantity>100||
     customerName.length<2||customerName.length>120||
     contact.length<3||contact.length>250||note.length>1000||
     /[\r\n<>]/.test(contact))return reply({error:"Invalid fields"},400,origin);

  const url=Deno.env.get("SUPABASE_URL"),key=Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if(!url||!key||key.length<24)return reply({error:"Service unavailable"},503,origin);
  const privateLimiterSecret=Deno.env.get("DALIL_BOUTIQUE_ORDERS_RATE_LIMIT_SECRET")||"";
  // Server-only fallback keeps salted rate limiting active without requiring a second secret.
  const secret=privateLimiterSecret.length>=24 ? privateLimiterSecret : "dalil-boutique-rate-limit-v1:"+key;
  try{
    const db=createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false}});
    const requestFingerprint=await hash(secret+":request:"+JSON.stringify([
      profileId,productId,quantity,customerName,contact,note
    ]));
    // Retries cannot create duplicates, including when the user opens WhatsApp or loses network.
    const {data:existing,error:existingError}=await db.from("dalil_boutique_customer_orders")
      .select("id,request_fingerprint,kind,deleted_at").eq("entreprise_id",profileId).eq("idempotency_key",idempotencyKey).maybeSingle();
    if(existingError)return reply({error:"Service unavailable"},503,origin);
    if(existing){
      if(existing.request_fingerprint!==requestFingerprint)return reply({error:"Reference mismatch"},409,origin);
      if(existing.deleted_at)return reply({error:"Cette demande a été supprimée. Commencez une nouvelle demande si nécessaire."},410,origin);
      return reply({accepted:true,reference:existing.id,kind:existing.kind},200,origin);
    }
    // The exact merchant and product must still be publicly published.
    const {data:company,error:companyError}=await db.from("entreprise")
      .select("id").eq("id",profileId).eq("approved",true).eq("statut_publication","Publié")
      .eq("statut_validation","publie").maybeSingle();
    if(companyError)return reply({error:"Business unavailable"},503,origin);
    if(!company)return reply({error:"Business unavailable"},404,origin);
    const {data:product,error:productError}=await db.from("dalil_boutique_products")
      .select("id,entreprise_id,title,mode,currency,price,status,approved_at")
      .eq("id",productId).eq("entreprise_id",profileId).eq("status","approved").maybeSingle();
    if(productError)return reply({error:"Product unavailable"},503,origin);
    if(!product||!product.approved_at||Date.parse(product.approved_at)>Date.now()||
      !["quote","order"].includes(product.mode)||product.currency!=="TND")
      return reply({error:"Product unavailable"},404,origin);
    const price=product.mode==="order"?Number(product.price):null;
    if(product.mode==="order"&&(!Number.isFinite(price)||price===null||price<=0||price>100000))
      return reply({error:"Product unavailable"},404,origin);

    // Transactional limits on rotating salted fingerprints. Never store raw IP in the limiter.
    const ip=req.headers.get("cf-connecting-ip")||req.headers.get("x-forwarded-for")?.split(",")[0]?.trim()||"unknown";
    const bucket=new Date(Math.floor(Date.now()/600000)*600000).toISOString();
    // Do not collapse all customers into one shared "unknown" IP bucket
    // when a proxy does not provide a trustworthy address header.
    // Contact throttling remains active for every request.
    const fingerprints=await Promise.all([
      ...(ip!=="unknown" ? [hash(secret+":ip:"+ip+":"+profileId)] : []),
      hash(secret+":contact:"+contact.toLowerCase()+":"+profileId),
    ]);
    for(const fingerprint of fingerprints){
      const {data:allowed,error}=await db.rpc("dalil_boutique_customer_limit_attempt",{
        p_fingerprint:fingerprint,p_window_start:bucket,
      });
      if(error)return reply({error:"Service unavailable"},503,origin);
      if(allowed!==true)return reply({error:"Too many requests"},429,origin);
    }
    const amountTotal=price===null?null:Math.round(price*quantity*1000)/1000;
    const {data:created,error:writeError}=await db.from("dalil_boutique_customer_orders")
      .insert({entreprise_id:profileId,product_id:productId,kind:product.mode,quantity,
        product_title:product.title,currency:"TND",unit_price:price,amount_total:amountTotal,
        customer_name:customerName,customer_contact:contact,customer_note:note||null,
        idempotency_key:idempotencyKey,request_fingerprint:requestFingerprint})
      .select("id,kind").single();
    if(writeError){
      if(writeError.code==="23505"){
        const {data:retry}=await db.from("dalil_boutique_customer_orders")
          .select("id,request_fingerprint,kind,deleted_at").eq("entreprise_id",profileId)
          .eq("idempotency_key",idempotencyKey).maybeSingle();
        if(retry){
          if(retry.deleted_at&&retry.request_fingerprint===requestFingerprint)
            return reply({error:"Cette demande a été supprimée. Commencez une nouvelle demande si nécessaire."},410,origin);
          if(retry.request_fingerprint===requestFingerprint)
            return reply({accepted:true,reference:retry.id,kind:retry.kind},200,origin);
          return reply({error:"Reference mismatch"},409,origin);
        }
      }
      return reply({error:"Request not saved. Please retry."},503,origin);
    }
    // A customer may opt in to one confirmation alert, scoped to this new order only.
    // Push registration failure never invalidates a successfully recorded order.
    if(customerPush) {
      const {error:pushError}=await db.from("dalil_boutique_order_push_subscriptions")
        .insert({order_id:created.id,...customerPush});
      if(pushError)console.error("Customer order push registration failed",pushError.code||"unknown");
    }
    // Keep the successful order response independent of push-service availability.
    // No alert is sent for idempotent retries; the merchant must opt in first.
    const alert=sendMerchantAlert(db,profileId,created.id,created.kind).catch(() => {});
    const runtime=globalThis as unknown as {EdgeRuntime?:{waitUntil:(promise:Promise<unknown>)=>void}};
    if(runtime.EdgeRuntime?.waitUntil)runtime.EdgeRuntime.waitUntil(alert);
    else await alert;
    return reply({accepted:true,reference:created.id,kind:created.kind},201,origin);
  }catch{return reply({error:"Service unavailable"},503,origin);}
});

