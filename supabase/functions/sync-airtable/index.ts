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

function str(val: unknown): string | null {
  if (val === undefined || val === null) return null;
  if (typeof val === "string") return val;
  return String(val);
}

function num(val: unknown): number | null {
  if (val === undefined || val === null) return null;
  const n = Number(val);
  return isNaN(n) ? null : n;
}

function int(val: unknown): number | null {
  const n = num(val);
  return n === null ? null : Math.round(n);
}

function bool(val: unknown): boolean | null {
  if (val === undefined || val === null) return null;
  if (typeof val === "boolean") return val;
  if (val === "true" || val === 1) return true;
  if (val === "false" || val === 0) return false;
  return null;
}

function pick(f: Record<string, unknown>, ...keys: string[]): unknown {
  for (const k of keys) {
    if (f[k] !== undefined && f[k] !== null) return f[k];
  }
  return null;
}

function mapRecord(record: AirtableRecord): Record<string, unknown> {
  const f = record.fields;

  return {
    id_airtable: record.id,

    // -- Identite --
    nom: str(pick(f, "nom", "Nom")),
    description: str(pick(f, "description", "Description")),
    adresse: str(pick(f, "adresse", "Adresse")),
    ville: str(pick(f, "ville", "Ville")),
    gouvernorat: str(pick(f, "gouvernorat", "Gouvernorat")),

    // -- Statuts --
    statut_carte: str(pick(f, "statut_carte", "Statut carte", "statut carte")),
    "statut Abonnement": str(
      pick(f, "statut Abonnement", "Statut Abonnement", "statut_abonnement")
    ),
    statut_validation: str(
      pick(f, "statut_validation", "Statut Validation")
    ),
    status: str(pick(f, "status", "Status")),

    // -- Contact --
    telephone: str(pick(f, "telephone", "telephone1", "Téléphone", "Telephone")),
    telephone2: str(pick(f, "telephone2", "Téléphone 2", "Telephone 2")),
    email: str(pick(f, "email", "Email")),
    email2: str(pick(f, "email2", "Email 2")),
    site_web: str(pick(f, "site_web", "Site web", "Site Web")),
    whatsapp: str(pick(f, "whatsapp", "WhatsApp", "Whatsapp")),

    // -- Geo --
    latitude: num(pick(f, "latitude", "Latitude")),
    longitude: num(pick(f, "longitude", "Longitude")),

    // -- Media --
    image_url: str(pick(f, "image_url", "Image", "image")),
    logo_url: str(pick(f, "logo_url", "Logo", "logo")),
    video_url: str(pick(f, "video_url", "Vidéo", "Video", "video")),
    image_couverture: str(
      pick(f, "image_couverture", "Image couverture", "Image Couverture")
    ),

    // -- SEO / Slug --
    slug: str(pick(f, "slug", "Slug")),
    search_text: str(pick(f, "search_text", "Search Text")),
    "mots cles recherche": str(
      pick(f, "mots cles recherche", "Mots clés recherche", "mots_cles_recherche")
    ),
    synonymes_seo: str(pick(f, "synonymes_seo", "Synonymes SEO")),

    // -- Reseaux sociaux --
    "lien facebook": str(
      pick(f, "lien facebook", "Lien Facebook", "lien_facebook")
    ),
    "Lien Instagram": str(pick(f, "Lien Instagram", "lien_instagram")),
    "Lien LinkedIn": str(pick(f, "Lien LinkedIn", "lien_linkedin")),
    "Lien TikTok": str(pick(f, "Lien TikTok", "lien_tiktok")),
    "Lien YouTube": str(pick(f, "Lien YouTube", "lien_youtube")),
    lien_x: str(pick(f, "lien_x", "Lien X", "Lien Twitter")),

    // -- Avis / Notes --
    "Note Google Globale": num(
      pick(f, "Note Google Globale", "note_google_globale")
    ),
    "Compteur Avis Google": int(
      pick(f, "Compteur Avis Google", "compteur_avis_google")
    ),
    score_avis: num(pick(f, "score_avis", "Score Avis")),
    views_count: int(pick(f, "views_count", "Views Count")) ?? 0,

    // -- Horaires / Maps --
    horaires_ok: str(pick(f, "horaires_ok", "Horaires", "horaires")),
    "BTN_Maps": str(pick(f, "BTN_Maps", "Lien Google Maps", "btn_maps")),
    "Lien Avis Google": str(
      pick(f, "Lien Avis Google", "lien_avis_google")
    ),

    // -- Booleens --
    approved: bool(pick(f, "approved", "Approved")),
    featured: bool(pick(f, "featured", "Featured")),
    home_featured: bool(pick(f, "home_featured", "Home Featured")),
    is_premium: bool(pick(f, "is_premium", "Is Premium")) ?? false,
    is_local_verified: bool(
      pick(f, "is_local_verified", "Is Local Verified")
    ) ?? false,
    verifie: bool(pick(f, "verifie", "Vérifié", "Verifie")),
    "page commerce local": bool(
      pick(f, "page commerce local", "Page Commerce Local")
    ),
    "mise en avant pub": bool(
      pick(f, "mise en avant pub", "Mise en avant pub")
    ),
    email_lancement_envoye: bool(
      pick(f, "email_lancement_envoye", "Email Lancement Envoyé")
    ),

    // -- Priorites / Niveaux --
    priorite: int(pick(f, "priorite", "Priorité", "Priorite")),
    niveau_priorite: int(pick(f, "niveau_priorite", "Niveau Priorité")),
    "niveau priorité abonnement": num(
      pick(
        f,
        "niveau priorité abonnement",
        "Niveau priorité abonnement",
        "niveau_priorite_abonnement"
      )
    ),

    // -- Dates --
    mis_a_jour_le: str(pick(f, "mis_a_jour_le", "Mis à jour le")),
    "Date Fin Abonnement": str(
      pick(f, "Date Fin Abonnement", "date_fin_abonnement")
    ),

    // -- Multilingue --
    name_ar: str(pick(f, "name_ar", "Nom AR")),
    name_en: str(pick(f, "name_en", "Nom EN")),
    name_it: str(pick(f, "name_it", "Nom IT")),
    name_ru: str(pick(f, "name_ru", "Nom RU")),
    description_ar: str(pick(f, "description_ar", "Description AR")),
    description_en: str(pick(f, "description_en", "Description EN")),
    description_it: str(pick(f, "description_it", "Description IT")),
    description_ru: str(pick(f, "description_ru", "Description RU")),

    // -- Categories / Services --
    sous_categories_texte: str(
      pick(f, "sous_categories_texte", "Sous-catégories texte")
    ),
    sous_categories_clean: str(
      pick(f, "sous_categories_clean", "Sous-catégories clean")
    ),
    services: str(pick(f, "services", "Services")),
    qr_code_url: str(pick(f, "qr_code_url", "QR Code URL")),
    google_url: str(pick(f, "google_url", "Google URL")),
    matricule_fiscal: str(pick(f, "matricule_fiscal", "Matricule Fiscal")),
    email_professionnel: str(
      pick(f, "email_professionnel", "Email Professionnel")
    ),
    theme_culturel: str(pick(f, "theme_culturel", "Thème Culturel")),
    secteur_evenement: str(
      pick(f, "secteur_evenement", "Secteur Événement")
    ),
    "Sous-catégorie entreprise": str(
      pick(f, "Sous-catégorie entreprise", "sous_categorie_entreprise")
    ),
    "Statut Sync": str(pick(f, "Statut Sync", "statut_sync")),
    "Service RS Créé (VIP)": bool(
      pick(f, "Service RS Créé (VIP)", "service_rs_cree_vip")
    ),
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
    // -- Auth: Supabase JWT (admin button) OR x-cron-secret header (cron/n8n) --
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
