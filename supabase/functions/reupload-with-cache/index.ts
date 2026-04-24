import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const BUCKET = "photos-dalil";
const CACHE_TTL = "31536000"; // 1 an

const FILES = [
  { path: "drapeau-tunisie.jpg", contentType: "image/jpeg" },
  { path: "drapeau-tunisie.webp", contentType: "image/webp" },
];

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const results = [];

    for (const file of FILES) {
      const { data: fileData, error: downloadError } = await supabase.storage
        .from(BUCKET)
        .download(file.path);

      if (downloadError || !fileData) {
        results.push({ path: file.path, success: false, error: downloadError?.message ?? "Not found" });
        continue;
      }

      const { error: uploadError } = await supabase.storage
        .from(BUCKET)
        .upload(file.path, fileData, {
          cacheControl: CACHE_TTL,
          contentType: file.contentType,
          upsert: true,
        });

      if (uploadError) {
        results.push({ path: file.path, success: false, error: uploadError.message });
      } else {
        results.push({ path: file.path, success: true, cacheControl: `public, max-age=${CACHE_TTL}, immutable` });
      }
    }

    return new Response(
      JSON.stringify({ bucket: BUCKET, results }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ success: false, error: String(err) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
