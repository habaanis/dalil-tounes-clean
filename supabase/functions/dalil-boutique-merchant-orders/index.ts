import { createClient } from "npm:@supabase/supabase-js@2.112.2";
import webpush from "npm:web-push@3.6.7";
import { orderCapabilities } from "./order-policy.ts";

// Merchant inbox in Dalil. The authenticated owner may only access assigned establishments.
const origins=new Set(["https://dalil-tounes.com","https://www.dalil-tounes.com","https://app.dalil-tounes.com","https://appli.dalil-tounes.com","https://pwa.dalil-tounes.com","https://dalil-tounes-pwa.vercel.app","http://localhost:5173"]);
const companyId=/^[a-z0-9][a-z0-9_-]{0,99}$/i;
const uuid=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const statuses=new Set(["in_progress","confirmed","completed","rejected","cancelled"]);
const respond=(data:unknown,status=200,origin="")=>new Response(JSON.stringify(data),{status,headers:{
  "content-type":"application/json","cache-control":"no-store","vary":"Origin",
  ...(origins.has(origin)?{"access-control-allow-origin":origin}:{})
}});

const notifyCustomerConfirmation = async (db:ReturnType<typeof createClient>, orderId:string, profileId:string) => {
  // Only the exact order's explicitly opted-in browser receives this push.
  const {data:subscription,error:subError}=await db.from("dalil_boutique_order_push_subscriptions")
    .select("endpoint,p256dh,auth,notified_at").eq("order_id",orderId).maybeSingle();
  if(subError||!subscription||subscription.notified_at)return {sent:false,reason:"not_subscribed"};
  const {data:config,error:configError}=await db.from("dalil_push_config")
    .select("vapid_public_key,vapid_private_key").eq("id",1).maybeSingle();
  if(configError||!config?.vapid_private_key)return {sent:false,reason:"push_unavailable"};
  const {data:profile}=await db.from("entreprise")
    .select("nom,slug_court,slug").eq("id",profileId).maybeSingle();
  const name=String(profile?.nom||"Votre professionnel").slice(0,58);
  const slug=String(profile?.slug_court||profile?.slug||profileId);
  webpush.setVapidDetails("https://dalil-tounes.com",config.vapid_public_key,config.vapid_private_key);
  const payload=JSON.stringify({
    title:name+" · Commande confirmée",
    body:"Votre commande est confirmée. Merci pour votre confiance.",
    path:"/"+encodeURIComponent(slug)+"/cv?skip-opening=1",
    tag:"dalil-customer-confirmed-"+orderId
  });
  try {
    await webpush.sendNotification({
      endpoint:subscription.endpoint,keys:{p256dh:subscription.p256dh,auth:subscription.auth}
    },payload,{TTL:86400,urgency:"normal"});
    await db.from("dalil_boutique_order_push_subscriptions")
      .update({notified_at:new Date().toISOString()})
      .eq("order_id",orderId).is("notified_at",null);
    return {sent:true};
  } catch(error) {
    const code=error&&typeof error==="object"&&"statusCode" in error?Number(error.statusCode):0;
    if(code===404||code===410) {
      await db.from("dalil_boutique_order_push_subscriptions").delete().eq("order_id",orderId);
    }
    console.error("Customer confirmation push failed",code||"unknown");
    return {sent:false,reason:code===404||code===410?"subscription_expired":"delivery_unconfirmed"};
  }
};

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
      const archived=input.archived===true;
      const offset=input.offset??0;
      if(!Number.isInteger(offset)||offset<0||offset>100000)
        return respond({error:"Invalid page"},400,origin);
      let query=db.from("dalil_boutique_customer_orders")
        .select("id,kind,product_title,quantity,currency,unit_price,amount_total,customer_name,customer_contact,customer_note,status,payment_option,payment_status,paid_amount,payment_provider,payment_reference,payment_verified_at,created_at,updated_at,archived_at,deleted_at",{count:"exact"})
        .eq("entreprise_id",profileId).is("deleted_at",null);
      query=archived?query.not("archived_at","is",null):query.is("archived_at",null);
      const {data,error,count}=await query.order("created_at",{ascending:false})
        .order("id",{ascending:false}).range(offset,offset+49);
      if(error)return respond({error:"Orders unavailable"},503,origin);
      const orders=(data??[]).map(row=>{
        const {payment_provider: _provider,payment_reference: _reference,
          payment_verified_at: _verified,deleted_at: _deleted,...order}=row;
        return {...order,...orderCapabilities(row)};
      });
      return respond({profileId,orders,total:count??orders.length,archived,hasMore:offset+orders.length<(count??0)},200,origin);
    }
    if(["archive","restore","delete"].includes(input?.action)){
      if(typeof input.id!=="string"||!uuid.test(input.id))
        return respond({error:"Commande invalide."},400,origin);
      if(input.action==="delete"&&input.confirmDelete!==true)
        return respond({error:"Confirmez la suppression de cette demande."},400,origin);
      if(typeof input.expectedUpdatedAt!=="string"||!Number.isFinite(Date.parse(input.expectedUpdatedAt)))
        return respond({error:"Actualisez les commandes avant de continuer."},409,origin);
      // The caller's user id is verified above, never accepted from the browser.
      // This service-role-only RPC locks and checks the row before any mutation.
      const {data,error}=await db.rpc("dalil_merchant_manage_order",{
        p_user_id:identity.user.id,p_profile_id:profileId,p_order_id:input.id,
        p_action:input.action,p_expected_updated_at:input.expectedUpdatedAt,
        p_confirm_delete:input.confirmDelete===true,
      });
      if(error){
        const messages:Record<string,string>={
          order_not_found:"Commande introuvable ou inaccessible.",
          order_changed:"Cette commande a changé. Actualisez la liste.",
          order_closed_required:"Terminez, refusez ou annulez la demande avant de l’archiver.",
          financial_history_protected:"Cette demande doit conserver son historique. Vous pouvez l’archiver.",
          delete_confirmation_required:"Confirmez la suppression de cette demande.",
        };
        const status=error.code==="42501"?403:error.code==="22023"?400:error.code==="P0002"?404:
          ["23514","40001"].includes(error.code)?409:503;
        return respond({error:messages[error.message]||"Modification indisponible."},status,origin);
      }
      if(!data||data.id!==input.id)return respond({error:"Confirmation de modification absente."},503,origin);
      return respond({profileId,order:data},200,origin);
    }
    if(input?.action==="update"){
      const id=input?.id,status=input?.status;
      if(typeof id!=="string"||!uuid.test(id)||typeof status!=="string"||!statuses.has(status))
        return respond({error:"Invalid status"},400,origin);
      const {data:current,error:readError}=await db.from("dalil_boutique_customer_orders")
        .select("id,status,kind,payment_status").eq("id",id).eq("entreprise_id",profileId)
        .is("archived_at",null).is("deleted_at",null).maybeSingle();
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
      // Dalil is only a commercial intermediary. Processing status does not attest to
      // payment: customer and merchant settle directly outside the platform.
      if(status==="completed"&&current.status!=="confirmed")
        return respond({error:"Confirm the request before marking it completed"},409,origin);
      // Never permit a merchant to self-attest paid or alter payment evidence.
      const {data,error}=await db.from("dalil_boutique_customer_orders")
        .update({status,updated_at:new Date().toISOString()})
        .eq("id",id).eq("entreprise_id",profileId).eq("status",current.status)
        .eq("payment_status",current.payment_status)
        .is("archived_at",null).is("deleted_at",null)
        .select("id,status,updated_at").maybeSingle();
      if(error)return respond({error:"Update unavailable"},503,origin);
      if(!data)return respond({error:"Order changed, refresh and retry"},409,origin);
      // The status transition succeeded. A push failure must never roll it back.
      const notification=status==="confirmed"
        ? await notifyCustomerConfirmation(db,id,profileId)
        : {sent:false,reason:"status_not_confirmed"};
      return respond({profileId,order:data,customerNotification:notification},200,origin);
    }
    return respond({error:"Invalid action"},400,origin);
  }catch{return respond({error:"Service unavailable"},503,origin);}
});

