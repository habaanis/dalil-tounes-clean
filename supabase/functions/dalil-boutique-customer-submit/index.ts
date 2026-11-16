import { createClient } from "npm:@supabase/supabase-js@2.112.2";

// Server-validated customer requests. Never trust client price, payment state or product ownership.
const origins = new Set(["https://dalil-tounes.com","https://www.dalil-tounes.com","https://app.dalil-tounes.com","https://dalil-tounes-pwa.vercel.app","http://localhost:5173"]);
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const entrepriseId = /^[a-z0-9][a-z0-9_-]{0,99}$/i;
const reply = (data:unknown,status=200,origin="") => new Response(JSON.stringify(data),{status,headers:{
  "content-type":"application/json","cache-control":"no-store","vary":"Origin",
  ...(origins.has(origin)?{"access-control-allow-origin":origin}:{})
}});
const hash = async (text:string) => Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256",new TextEncoder().encode(text))))
  .map(byte=>byte.toString(16).padStart(2,"0")).join("");

Deno.serve(async req => {
  const origin=req.headers.get("origin")||"";
  if(req.method==="OPTIONS"){
    if(!origins.has(origin))return reply({error:"Forbidden"},403,origin);
    return new Response(null,{status:204,headers:{"access-control-allow-origin":origin,
      "access-control-allow-methods":"POST,OPTIONS","access-control-allow-headers":"authorization,x-client-info,apikey,content-type,x-retry-count,traceparent,tracestate,baggage","vary":"Origin"}});
  }
  if(req.method!=="POST")return reply({error:"Method not allowed"},405,origin);
  if(!origins.has(origin))return reply({error:"Forbidden"},403,origin);
  if(Number(req.headers.get("content-length")||"0")>8192)return reply({error:"Payload too large"},413,origin);
  // Reject oversized or non-JSON bodies even when Content-Length is omitted or falsified.
  if(!/^application\/json(?:\s*;|\s*$)/i.test(req.headers.get("content-type")||""))
    return reply({error:"JSON required"},415,origin);
  const raw=await req.text().catch(()=>"");
  if(new TextEncoder().encode(raw).length>8192)return reply({error:"Payload too large"},413,origin);
  let body:Record<string,unknown>|null=null;
  try { const parsed=JSON.parse(raw); if(parsed&&typeof parsed==="object"&&!Array.isArray(parsed))body=parsed; } catch { /* Invalid JSON */ }
  if(!body)return reply({error:"Invalid request"},400,origin);
  const {profileId,productId,idempotencyKey,quantity}=body;
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
  const secret=Deno.env.get("DALIL_BOUTIQUE_ORDERS_RATE_LIMIT_SECRET");
  if(!url||!key||!secret||secret.length<24)return reply({error:"Service unavailable"},503,origin);
  try{
    const db=createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false}});
    const requestFingerprint=await hash(secret+":request:"+JSON.stringify([
      profileId,productId,quantity,customerName,contact,note
    ]));
    // Retries cannot create duplicates, including when the user opens WhatsApp or loses network.
    const {data:existing,error:existingError}=await db.from("dalil_boutique_customer_orders")
      .select("id,request_fingerprint,kind").eq("entreprise_id",profileId).eq("idempotency_key",idempotencyKey).maybeSingle();
    if(existingError)return reply({error:"Service unavailable"},503,origin);
    if(existing){
      if(existing.request_fingerprint!==requestFingerprint)return reply({error:"Reference mismatch"},409,origin);
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
    const fingerprints=await Promise.all([
      hash(secret+":ip:"+ip+":"+profileId),
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
          .select("id,request_fingerprint,kind").eq("entreprise_id",profileId)
          .eq("idempotency_key",idempotencyKey).maybeSingle();
        if(retry&&retry.request_fingerprint===requestFingerprint)
          return reply({accepted:true,reference:retry.id,kind:retry.kind},200,origin);
      }
      return reply({error:"Request not saved. Please retry."},503,origin);
    }
    return reply({accepted:true,reference:created.id,kind:created.kind},201,origin);
  }catch{return reply({error:"Service unavailable"},503,origin);}
});
