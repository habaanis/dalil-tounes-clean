import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, X-Client-Info, Apikey",
};

const EXPECTED_COUNT = 1887;
const AIRTABLE_BASE_ID_DEFAULT = "app9Q828Splwvm4jW";
const AIRTABLE_TABLE_NAME = "entreprise";
const BATCH_SIZE = 50;

interface AirtableRecord {
  id: string;
  fields: Record<string, unknown>;
  createdTime?: string;
}

interface AirtableResponse {
  records: AirtableRecord[];
  offset?: string;
}

function respond(body: Record<string, unknown>, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function mapRecord(record: AirtableRecord): Record<string, unknown> {
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
    "statut Abonnement":
      f["statut Abonnement"] ?? f["Statut Abonnement"] ?? null,
    "niveau priorité abonnement":
      f["niveau priorité abonnement"] ??
      f["Niveau priorité abonnement"] ??
      null,
    statut_carte: f["statut_carte"] ?? f["Statut carte"] ?? null,
    statut_abonnement:
      f["statut_abonnement"] ??
      f["statut Abonnement"] ??
      f["Statut Abonnement"] ??
      null,
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

async function fetchAllFromAirtable(
  baseId: string,
  token: string
): Promise<AirtableRecord[]> {
  const allRecords: AirtableRecord[] = [];
  let offset: string | undefined;
  let page = 0;

  do {
    page++;
    const url = new URL(
      `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(AIRTABLE_TABLE_NAME)}`
    );
    url.searchParams.set("pageSize", "100");
    if (offset) url.searchParams.set("offset", offset);

    const res = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      const errBody = await res.text();
      throw new Error(`Airtable API ${res.status} (page ${page}): ${errBody}`);
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
    // -- Auth: either Supabase JWT (admin button) or CRON_SECRET header (cron) --
    const authHeader = req.headers.get("Authorization") ?? "";
    const cronSecret = Deno.env.get("CRON_SECRET");
    const cronHeader = req.headers.get("x-cron-secret");

    const isCron = cronSecret && cronHeader === cronSecret;

    if (!isCron && !authHeader.startsWith("Bearer ")) {
      return respond({ error: "Unauthorized" }, 401);
    }

    // -- Parse params --
    const url = new URL(req.url);
    const forceRefresh = url.searchParams.get("refresh") === "true";

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const airtableToken = Deno.env.get("AIRTABLE_TOKEN");
    const airtableBaseId =
      Deno.env.get("AIRTABLE_BASE_ID") || AIRTABLE_BASE_ID_DEFAULT;

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // 1. Count current rows
    const { count, error: countError } = await supabase
      .from("entreprise")
      .select("id", { count: "exact", head: true });

    if (countError) {
      return respond(
        { error: "Count query failed", details: countError.message },
        500
      );
    }

    const currentCount = count ?? 0;

    // 2. If already at target and no force, skip
    if (!forceRefresh && currentCount >= EXPECTED_COUNT) {
      return respond({
        source: "supabase",
        synced: false,
        message: `Base already contains ${currentCount} fiches (target: ${EXPECTED_COUNT}). Use ?refresh=true to force.`,
        count: currentCount,
      });
    }

    // 3. Validate Airtable token
    if (!airtableToken) {
      return respond(
        {
          error:
            "AIRTABLE_TOKEN is not configured. Add it in Supabase Dashboard > Edge Functions > Secrets.",
          count: currentCount,
        },
        400
      );
    }

    // 4. Fetch all records from Airtable (full pagination)
    const records = await fetchAllFromAirtable(airtableBaseId, airtableToken);

    // 5. Map to Supabase schema
    const mapped = records.map(mapRecord);

    // 6. Upsert in batches
    let upsertedCount = 0;
    const errors: string[] = [];

    for (let i = 0; i < mapped.length; i += BATCH_SIZE) {
      const batch = mapped.slice(i, i + BATCH_SIZE);
      const { error: upsertError } = await supabase
        .from("entreprise")
        .upsert(batch as never[], {
          onConflict: "id_airtable",
          ignoreDuplicates: false,
        });

      if (upsertError) {
        errors.push(
          `Batch ${Math.floor(i / BATCH_SIZE) + 1}: ${upsertError.message}`
        );
      } else {
        upsertedCount += batch.length;
      }
    }

    return respond({
      source: "airtable",
      synced: true,
      message: `Import terminé: ${upsertedCount} / ${records.length} fiches synchronisées.`,
      count: upsertedCount,
      totalAirtable: records.length,
      previousSupabaseCount: currentCount,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return respond({ error: message }, 500);
  }
});
