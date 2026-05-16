import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, X-Client-Info, Apikey",
};

const EXPECTED_COUNT = 1887;

interface AirtableRecord {
  id: string;
  fields: Record<string, unknown>;
  createdTime?: string;
}

interface AirtableResponse {
  records: AirtableRecord[];
  offset?: string;
}

function mapAirtableToSupabase(record: AirtableRecord): Record<string, unknown> {
  const f = record.fields;
  return {
    id_airtable: record.id,
    nom: f["nom"] ?? f["Nom"] ?? null,
    categorie: f["categorie"] ?? f["Catégorie"] ?? f["categorie_fr"] ?? null,
    sous_categories: f["sous_categories"] ?? f["Sous-catégories"] ?? null,
    ville: f["ville"] ?? f["Ville"] ?? null,
    gouvernorat: f["gouvernorat"] ?? f["Gouvernorat"] ?? null,
    adresse: f["adresse"] ?? f["Adresse"] ?? null,
    telephone: f["telephone"] ?? f["Téléphone"] ?? null,
    telephone2: f["telephone2"] ?? f["Téléphone 2"] ?? null,
    whatsapp: f["whatsapp"] ?? f["WhatsApp"] ?? null,
    email: f["email"] ?? f["Email"] ?? null,
    email2: f["email2"] ?? f["Email 2"] ?? null,
    site_web: f["site_web"] ?? f["Site web"] ?? null,
    description: f["description"] ?? f["Description"] ?? null,
    services: f["services"] ?? f["Services"] ?? null,
    image_url: f["image_url"] ?? f["Image"] ?? null,
    logo_url: f["logo_url"] ?? f["Logo"] ?? null,
    video_url: f["video_url"] ?? f["Vidéo"] ?? null,
    horaires_ok: f["horaires_ok"] ?? f["Horaires"] ?? null,
    score_avis: f["score_avis"] ?? f["Score Avis"] ?? null,
    "BTN_Maps": f["BTN_Maps"] ?? f["Lien Google Maps"] ?? null,
    "Lien Instagram": f["Lien Instagram"] ?? null,
    "Lien TikTok": f["Lien TikTok"] ?? null,
    "Lien LinkedIn": f["Lien LinkedIn"] ?? null,
    "Lien YouTube": f["Lien YouTube"] ?? null,
    "lien facebook": f["lien facebook"] ?? f["Lien Facebook"] ?? null,
    "Lien Avis Google": f["Lien Avis Google"] ?? null,
    "statut Abonnement": f["statut Abonnement"] ?? f["Statut Abonnement"] ?? null,
    "niveau priorité abonnement": f["niveau priorité abonnement"] ?? f["Niveau priorité abonnement"] ?? null,
    statut_carte: f["statut_carte"] ?? f["Statut carte"] ?? null,
    statut_abonnement: f["statut_abonnement"] ?? f["statut Abonnement"] ?? f["Statut Abonnement"] ?? null,
    name_ar: f["name_ar"] ?? null,
    description_ar: f["description_ar"] ?? null,
    tags: f["tags"] ?? f["Tags"] ?? null,
    page_categorie: f["page_categorie"] ?? null,
    secteur: f["secteur"] ?? f["Secteur"] ?? null,
    is_premium: f["is_premium"] ?? false,
    is_featured: f["is_featured"] ?? false,
    is_local_verified: f["is_local_verified"] ?? false,
  };
}

async function fetchAllAirtableRecords(
  baseId: string,
  token: string,
  tableName: string
): Promise<AirtableRecord[]> {
  const allRecords: AirtableRecord[] = [];
  let offset: string | undefined;

  do {
    const url = new URL(
      `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}`
    );
    url.searchParams.set("pageSize", "100");
    if (offset) url.searchParams.set("offset", offset);

    const res = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      const errBody = await res.text();
      throw new Error(
        `Airtable API error ${res.status}: ${errBody}`
      );
    }

    const data: AirtableResponse = await res.json();
    allRecords.push(...data.records);
    offset = data.offset;
  } while (offset);

  return allRecords;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const forceRefresh = url.searchParams.get("refresh") === "true";

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const airtableToken = Deno.env.get("AIRTABLE_TOKEN");
    const airtableBaseId = Deno.env.get("AIRTABLE_BASE_ID") || "app9Q828Splwvm4jW";

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // 1. Count current rows in Supabase
    const { count, error: countError } = await supabase
      .from("entreprise")
      .select("id", { count: "exact", head: true });

    if (countError) {
      return new Response(
        JSON.stringify({
          error: "Failed to count entreprise rows",
          details: countError.message,
        }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const currentCount = count ?? 0;

    // 2. If count >= expected and no force refresh, return status only
    if (!forceRefresh && currentCount >= EXPECTED_COUNT) {
      return new Response(
        JSON.stringify({
          source: "supabase",
          message: `Supabase already has ${currentCount} fiches (>= ${EXPECTED_COUNT}). No sync needed.`,
          count: currentCount,
          synced: false,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 3. Need to sync from Airtable
    if (!airtableToken) {
      return new Response(
        JSON.stringify({
          error: "AIRTABLE_TOKEN secret is not configured. Add it in Supabase Dashboard > Edge Functions > Secrets.",
          count: currentCount,
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const records = await fetchAllAirtableRecords(
      airtableBaseId,
      airtableToken,
      "entreprise"
    );

    // 4. Map records to Supabase schema
    const mapped = records.map(mapAirtableToSupabase);

    // 5. Upsert in batches of 50 to avoid payload limits
    const BATCH_SIZE = 50;
    let upsertedCount = 0;
    const errors: string[] = [];

    for (let i = 0; i < mapped.length; i += BATCH_SIZE) {
      const batch = mapped.slice(i, i + BATCH_SIZE);
      const { error: upsertError } = await supabase
        .from("entreprise")
        .upsert(batch as never[], { onConflict: "id_airtable", ignoreDuplicates: false });

      if (upsertError) {
        errors.push(`Batch ${i / BATCH_SIZE + 1}: ${upsertError.message}`);
      } else {
        upsertedCount += batch.length;
      }
    }

    return new Response(
      JSON.stringify({
        source: "airtable",
        message: `Synced ${upsertedCount} / ${records.length} records from Airtable.`,
        count: upsertedCount,
        totalAirtable: records.length,
        previousCount: currentCount,
        synced: true,
        errors: errors.length > 0 ? errors : undefined,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
