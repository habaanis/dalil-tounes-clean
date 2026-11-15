import { createClient } from "npm:@supabase/supabase-js@2.112.2";

const allowedOrigins = new Set(["https://dalil-tounes.com", "https://www.dalil-tounes.com", "https://app.dalil-tounes.com"]);
const respond = (data: unknown, status: number, origin: string) =>
  new Response(JSON.stringify(data), {status, headers: {"content-type":"application/json","cache-control":"no-store",...(allowedOrigins.has(origin)?{"access-control-allow-origin":origin,"vary":"Origin"}:{})}});

function validImage(bytes: Uint8Array, type: string) {
  if(type === "image/jpeg") return bytes.length > 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  if(type === "image/png") return bytes.length > 8 && bytes.slice(0,8).every((byte,i)=>byte === [137,80,78,71,13,10,26,10][i]);
  if(type === "image/webp") return bytes.length > 12 && String.fromCharCode(...bytes.slice(0,4)) === "RIFF" && String.fromCharCode(...bytes.slice(8,12)) === "WEBP";
  return false;
}

Deno.serve(async (request: Request) => {
  const origin=request.headers.get("origin") || "";
  if(request.method === "OPTIONS") {
    if(!allowedOrigins.has(origin)) return respond({error:"Forbidden origin"},403,origin);
    return new Response(null,{status:204,headers:{"access-control-allow-origin":origin,"access-control-allow-headers":"authorization,apikey,content-type,x-client-info","access-control-allow-methods":"POST,OPTIONS","vary":"Origin"}});
  }
  if(request.method !== "POST") return respond({error:"Method not allowed"},405,origin);
  if(origin && !allowedOrigins.has(origin)) return respond({error:"Forbidden origin"},403,origin);
  try {
    const url=Deno.env.get("SUPABASE_URL");
    const secret=Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const key=Deno.env.get("SUPABASE_ANON_KEY") || Deno.env.get("SUPABASE_PUBLISHABLE_KEY");
    if(!url || !secret || !key) return respond({error:"Service unavailable"},503,origin);
    const authHeader=request.headers.get("authorization") || "";
    const jwt=authHeader.match(/^Bearer (.+)$/i)?.[1];
    if(!jwt) return respond({error:"Authentication required"},401,origin);
    const adminClient=createClient(url,secret,{auth:{persistSession:false,autoRefreshToken:false}});
    const {data:identity,error:identityError}=await adminClient.auth.getUser(jwt);
    if(identityError || !identity.user) return respond({error:"Unauthorized"},401,origin);
    const {data:isAdmin,error:roleError}=await adminClient.from("admins")
      .select("id,role").eq("id",identity.user.id).in("role",["admin","super_admin"]).maybeSingle();
    if(roleError || !isAdmin) return respond({error:"Forbidden"},403,origin);
    const input=await request.json().catch(()=>null);
    const requestId=input?.requestId;
    if(typeof requestId !== "string" || !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(requestId))
      return respond({error:"Invalid request ID"},400,origin);
    const {data:proposal,error:proposalError}=await adminClient.from("dalil_boutique_product_requests")
      .select("id,user_id,status,photo_path").eq("id",requestId).maybeSingle();
    if(proposalError) return respond({error:"Proposal unavailable"},503,origin);
    if(!proposal) return respond({error:"Proposal not found"},404,origin);
    if(proposal.status !== "pending") return respond({error:"Proposal already processed"},409,origin);
    if(!proposal.photo_path || !proposal.photo_path.startsWith(proposal.user_id + "/"))
      return respond({error:"A product photo is required before publication"},409,origin);
    const suffix=/\.(jpg|jpeg|png|webp)$/.exec(proposal.photo_path.toLowerCase())?.[0];
    if(!suffix) return respond({error:"Unsupported image file"},400,origin);
    const type=suffix === ".jpg" || suffix === ".jpeg" ? "image/jpeg" : suffix === ".png" ? "image/png" : "image/webp";
    const {data:file,error:downloadError}=await adminClient.storage.from("dalil-boutique-submissions").download(proposal.photo_path);
    if(downloadError || !file) return respond({error:"Private photo unavailable"},409,origin);
    if(file.size > 5*1024*1024 || file.size === 0) return respond({error:"Photo too large or empty"},413,origin);
    const bytes=new Uint8Array(await file.arrayBuffer());
    if(!validImage(bytes,type)) return respond({error:"Invalid image format"},422,origin);
    const path="boutique-approved/" + requestId + suffix;
    const {error:uploadError}=await adminClient.storage.from("dalil-boutique-approved")
      .upload(path,bytes,{upsert:false,contentType:type,cacheControl:"3600"});
    if(uploadError) return respond({error:"Public photo transfer failed; no product was published"},409,origin);
    const ownerClient=createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false},global:{headers:{Authorization:authHeader}}});
    const {data:productId,error:approvalError}=await ownerClient.rpc("dalil_publish_moderated_boutique_product",{p_request_id:requestId,p_image_path:path});
    if(approvalError || !productId) {
      await adminClient.storage.from("dalil-boutique-approved").remove([path]);
      return respond({error:"Approval failed; no product published"},409,origin);
    }
    return respond({ok:true,productId},200,origin);
  } catch {
    return respond({error:"Publication unavailable"},503,origin);
  }
});
