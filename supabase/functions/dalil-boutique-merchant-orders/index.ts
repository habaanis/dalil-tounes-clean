import { createClient } from "npm:@supabase/supabase-js@2.112.2";

// Merchant inbox in Dalil. The authenticated owner may only access assigned establishments.
const origins=new Set(["https://dalil-tounes.com","https://www.dalil-tounes.com","https://app.dalil-tounes.com","https://dalil-tounes-pwa.vercel.app","http://localhost:5173"]);
const companyId=/^[a-z0-9][a-z0-9_-]{0,99}$/i;
const uuid=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const statuses=new Set(["in_progress","confirmed","completed","rejected","cancelled"]);
const respond=(data:unknown,status=200,origin="")=>new Response(JSON.stringify(data),{status,headers:{
  "content-type":"application/json","cache-control":"no-store","vary":"Origin",
  ...(origins.has(origin)?{"access-control-allow-origin":origin}:{})
}});
Deno.serve(async req=>{
  const origin=req.headers.get("origin")||"";
  if(req.method==="OPTIONS"){
    if(!origins.has(origin))return respond({error:"Forbidden"},403,origin);
    return new Response(null,{status:204,headers:{"access-control-allow-origin":origin,
      "access-control-allow-methods":"POST,OPTIONS","access-control-allow-headers":"authorization,x-client-info,apikey,content-type,x-retry-count,traceparent,tracestate,baggage",
      "vary":"Origin"}});
  }
  if(req.method!=="POST")return respond({error:"Method not allowed"},405,origin);
  if(origin&&!origins.has(origin))return respond({error:"Forbidden"},403,origin);
  if(Number(req.headers.get("content-length")||"0")>8192)return respond({error:"Too large"},413,origin);
  const token=req.headers.get("authorization")?.match(/^Bearer (.+)$/i)?.[1];
  if(!token)return respond({error:"Authentication required"},401,origin);
  const url=Deno.env.get("SUPABASE_URL"),key=Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if(!url||!key)return respond({error:"Service unavailable"},503,origin);
  try{
    const db=createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false}});
    const {data:identity,error:identityError}=await db.auth.getUser(token);
    if(identityError||!identity.user)return respond({error:"Unauthorized"},401,origin);
    if(!/^application\/json(?:\s*;|\s*$)/i.test(req.headers.get("content-type")||""))
      return respond({error:"JSON required"},415,origin);
    const raw=await req.text().catch(()=>"");
    if(new TextEncoder().encode(raw).length>8192)return respond({error:"Too large"},413,origin);
    let input:any=null;
    try { const parsed=JSON.parse(raw); if(parsed&&typeof parsed==="object"&&!Array.isArray(parsed))input=parsed; } catch { /* Invalid JSON */ }
    const profileId=input?.profileId;
    if(typeof profileId!=="string"||!companyId.test(profileId))return respond({error:"Invalid company"},400,origin);
    const {data:access,error:accessError}=await db.from("professional_profile_access")
      .select("entreprise_id").eq("user_id",identity.user.id).eq("entreprise_id",profileId).maybeSingle();
    if(accessError)return respond({error:"Access unavailable"},503,origin);
    if(!access)return respond({error:"Forbidden"},403,origin);
    if(input?.action==="list"){
      const {data,error}=await db.from("dalil_boutique_customer_orders")
        .select("id,kind,product_title,quantity,currency,unit_price,amount_total,customer_name,customer_contact,customer_note,status,payment_option,payment_status,paid_amount,created_at")
        .eq("entreprise_id",profileId).order("created_at",{ascending:false}).limit(50);
      if(error)return respond({error:"Orders unavailable"},503,origin);
      return respond({profileId,orders:data??[]},200,origin);
    }
    if(input?.action==="update"){
      const id=input?.id,status=input?.status;
      if(typeof id!=="string"||!uuid.test(id)||typeof status!=="string"||!statuses.has(status))
        return respond({error:"Invalid status"},400,origin);
      const {data:current,error:readError}=await db.from("dalil_boutique_customer_orders")
        .select("id,status,kind,payment_status").eq("id",id).eq("entreprise_id",profileId).maybeSingle();
      if(readError)return respond({error:"Unavailable"},503,origin);
      if(!current)return respond({error:"Order not found"},404,origin);
      if(["completed","cancelled","rejected"].includes(current.status))
        return respond({error:"Order already closed"},409,origin);
      const validTransitions:Record<string,Set<string>>={
        received:new Set(["in_progress","confirmed","rejected","cancelled"]),
        in_progress:new Set(["confirmed","rejected","cancelled"]),
        confirmed:new Set(["completed","cancelled"]),
      };
      if(!validTransitions[current.status]?.has(status))
        return respond({error:"Invalid status transition"},409,origin);
      if(status==="confirmed"&&current.kind==="order"&&!["partially_paid","paid"].includes(current.payment_status))
        return respond({error:"Verified deposit or full payment required"},409,origin);
      if(status==="completed"&&(current.status!=="confirmed"||
         (current.kind==="order"&&current.payment_status!=="paid")))
        return respond({error:"Order cannot be completed before verified payment"},409,origin);
      // Never permit a merchant to self-attest paid or alter payment evidence.
      const {data,error}=await db.from("dalil_boutique_customer_orders")
        .update({status,updated_at:new Date().toISOString()})
        .eq("id",id).eq("entreprise_id",profileId).eq("status",current.status)
        .eq("payment_status",current.payment_status)
        .select("id,status").maybeSingle();
      if(error)return respond({error:"Update unavailable"},503,origin);
      if(!data)return respond({error:"Order changed, refresh and retry"},409,origin);
      return respond({profileId,order:data},200,origin);
    }
    return respond({error:"Invalid action"},400,origin);
  }catch{return respond({error:"Service unavailable"},503,origin);}
});
