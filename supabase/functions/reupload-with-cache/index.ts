import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const BUCKET = "photos-dalil";
    const PATH = "drapeau-tunisie.jpg";
    const CACHE_TTL = "31536000"; // 1 an

    // 1. Télécharger le fichier existant
    const { data: fileData, error: downloadError } = await supabase.storage
      .from(BUCKET)
      .download(PATH);

    if (downloadError || !fileData) {
      throw new Error(`Download failed: ${downloadError?.message}`);
    }

    // 2. Ré-uploader avec le bon cacheControl (upsert pour remplacer)
    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(PATH, fileData, {
        cacheControl: CACHE_TTL,
        contentType: "image/jpeg",
        upsert: true,
      });

    if (uploadError) {
      throw new Error(`Upload failed: ${uploadError.message}`);
    }

    return new Response(
      JSON.stringify({
        success: true,
        bucket: BUCKET,
        path: PATH,
        cacheControl: `public, max-age=${CACHE_TTL}, immutable`,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ success: false, error: String(err) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
