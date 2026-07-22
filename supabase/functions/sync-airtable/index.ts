import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, X-Client-Info, Apikey, x-cron-secret",
};

const EXPECTED_COUNT = 1887;
const AIRTABLE_BASE_ID_DEFAULT = "app9Q828Splwvm4jW";
const AIRTABLE_TABLE_NAME = "entreprise";
const BATCH_SIZE = 50;
const DRY_RUN_SAMPLE_SIZE = 10;

const ENTERPRISE_COLUMNS = new Set([
  "id_airtable",
  "nom",
  "description",
  "a_propos",
  "adresse",
  "ville",
  "gouvernorat",
  "statut_carte",
  "statut_abonnement",
  "statut_validation",
  "status",
  "telephone",
  "telephone2",
  "email",
  "email2",
  "site_web",
  "whatsapp",
  "latitude",
  "longitude",
  "image_url",
  "logo_url",
  "video_url",
  "image_couverture",
  "slug",
  "search_text",
  "mots cles recherche",
  "synonymes_seo",
  "synonymes_seo_calcule",
  "lien facebook",
  "Lien Instagram",
  "Lien LinkedIn",
  "Lien TikTok",
  "Lien YouTube",
  "lien_x",
  "Note Google Globale",
  "Compteur Avis Google",
  "score_avis",
  "views_count",
  "horaires_ok",
  "BTN_Maps",
  "Lien Avis Google",
  "google_url",
  "approved",
  "featured",
  "home_featured",
  "is_premium",
  "is_local_verified",
  "verifie",
  "page commerce local",
  "mise en avant pub",
  "priorite",
  "niveau_priorite",
  "mis_a_jour_le",
  "name_ar",
  "name_en",
  "name_it",
  "name_ru",
  "description_ar",
  "description_en",
  "description_it",
  "description_ru",
  "keywords_fr",
  "keywords_en",
  "keywords_it",
  "keywords_ru",
  "keywords_ar",
  "sous_categories_texte",
  "sous_categories_clean",
  "services",
  "qr_code_url",
  "theme_culturel",
  "secteur_evenement",
  "liste_pages",
  "categorie",
]);

const FIELD_VARIANTS = {
  nom: ["nom", "Nom", "Nom entreprise", "Nom de l'entreprise", "Nom de l’entreprise"],
  description: ["description", "Description"],
  a_propos: ["a_propos", "À propos", "A propos", "about"],
  adresse: ["adresse", "Adresse"],
  ville: ["ville", "Ville"],
  gouvernorat: ["gouvernorat", "Gouvernorat"],
  statut_carte: ["statut_carte", "Statut carte", "statut carte"],
  statut_abonnement: [
    "statut_abonnement",
    "Statut_abonnement",
    "statut Abonnement",
    "Statut Abonnement",
    "statut abonnement",
  ],
  statut_validation: ["statut_validation", "Statut Validation"],
  status: ["status", "Status"],
  telephone: ["telephone", "telephone1", "Téléphone", "Telephone"],
  telephone2: ["telephone2", "telephone 2", "Téléphone 2", "Telephone 2"],
  email: ["email", "Email", "email 1", "Email 1", "Email_Final", "email_professionnel"],
  email2: ["email2", "Email 2", "Email secondaire"],
  site_web: ["site_web", "Site web", "Site Web"],
  whatsapp: ["whatsapp", "WhatsApp", "Whatsapp", "Numéro Whatsapp", "Numéro WhatsApp"],
  latitude: ["latitude", "Latitude"],
  longitude: ["longitude", "Longitude"],
  image_url: ["image_url", "Image", "image"],
  logo_url: ["logo_url", "Logo", "logo"],
  video_url: ["video_url", "Video_URL", "Vidéo", "Video", "video"],
  image_couverture: ["image_couverture", "Image couverture", "Image Couverture"],
  slug: ["slug", "Slug"],
  search_text: ["search_text", "Search Text"],
  mots_cles_recherche: ["mots cles recherche", "Mots clés recherche", "mots_cles_recherche"],
  synonymes_seo: ["synonymes_seo", "Synonymes_SEO", "Synonymes SEO"],
  synonymes_seo_calcule: ["synonymes_seo_calcule", "Synonymes SEO calculé"],
  lien_facebook: ["lien facebook", "Lien Facebook", "lien_facebook"],
  lien_instagram: ["Lien Instagram", "lien_instagram"],
  lien_linkedin: ["Lien LinkedIn", "lien_linkedin"],
  lien_tiktok: ["Lien TikTok", "lien_tiktok"],
  lien_youtube: ["Lien YouTube", "lien_youtube"],
  lien_x: ["lien_x", "lien x", "Lien X", "Lien Twitter"],
  note_google: ["Note Google Globale", "note_google_globale"],
  compteur_avis_google: ["Compteur Avis Google", "compteur_avis_google"],
  score_avis: ["score_avis", "Score Avis", "Score Classement Avis"],
  views_count: ["views_count", "Views Count"],
  horaires_ok: ["horaires_ok", "Horaires_ok", "Horaires", "horaires"],
  btn_maps: ["BTN_Maps", "Lien Google Maps", "btn_maps", "url_google_maps"],
  lien_avis_google: ["Lien Avis Google", "lien_avis_google"],
  google_url: ["google_url", "Google URL", "url_google_maps"],
  approved: ["approved", "Approved"],
  featured: ["featured", "Featured"],
  home_featured: ["home_featured", "Home Featured"],
  is_premium: ["is_premium", "Is Premium"],
  is_local_verified: ["is_local_verified", "Is Local Verified"],
  verifie: ["verifie", "Vérifié", "Verifie"],
  page_commerce_local: ["page commerce local", "page Commerce local", "Page Commerce Local"],
  mise_en_avant_pub: ["mise en avant pub", "mise_en_avant_pub", "Mise en avant pub"],
  priorite: ["priorite", "Priorité", "Priorite"],
  niveau_priorite: [
    "niveau_priorite",
    "Niveau Priorité",
    "Niveau Priorité abonnement",
    "Niveau Priorité abonnement ",
  ],
  mis_a_jour_le: ["mis_a_jour_le", "Mis à jour le"],
  name_ar: ["name_ar", "Nom AR"],
  name_en: ["name_en", "Nom EN"],
  name_it: ["name_it", "Nom IT"],
  name_ru: ["name_ru", "Nom RU"],
  description_ar: ["description_ar", "Description AR"],
  description_en: ["description_en", "Description EN"],
  description_it: ["description_it", "Description IT"],
  description_ru: ["description_ru", "Description RU"],
  keywords_fr: ["keywords_fr", "Keywords_FR", "Keywords FR"],
  keywords_en: ["keywords_en", "Keywords_EN ", "Keywords EN"],
  keywords_it: ["keywords_it", "Keywords_IT ", "Keywords IT"],
  keywords_ru: ["keywords_ru", "Keywords_RU ", "Keywords RU"],
  keywords_ar: ["keywords_ar", "Keywords_AR", "Keywords AR"],
  sous_categories: [
    "sous_categories",
    "Sous-catégories",
    "sous_categories_array",
    "sous_categories_texte",
  ],
  sous_categories_clean: ["sous_categories_clean", "Sous-catégories clean"],
  services: ["services", "Services"],
  qr_code_url: ["qr_code_url", "QR Code URL", "QR Code Preuve 2"],
  theme_culturel: ["theme_culturel", "thème culturel", "Thème Culturel"],
  secteur_evenement: ["secteur_evenement", "Secteur Événement"],
  liste_pages: ["liste pages", "Liste Pages", "liste_pages"],
  categorie: ["categorie", "Catégorie", "catégorie", "Categorie"],
} as const;

const RECOGNIZED_AIRTABLE_FIELDS = new Set(
  Object.values(FIELD_VARIANTS).flatMap((keys) => [...keys]),
);

interface AirtableRecord {
  id: string;
  fields: Record<string, unknown>;
  createdTime?: string;
}

interface AirtableResponse {
  records: AirtableRecord[];
  offset?: string;
}

type EnterprisePayload = Record<string, unknown> & { id_airtable: string };

type ExistingEnterprise = {
  id_airtable: string | null;
  nom: string | null;
  ville: string | null;
  description: string | null;
  slug: string | null;
  statut_validation: string | null;
  statut_abonnement: string | null;
  liste_pages: string[] | null;
};

function respond(body: Record<string, unknown>, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function isAbsent(val: unknown): boolean {
  if (val === undefined || val === null) return true;
  if (typeof val === "string") return val.trim() === "";
  if (Array.isArray(val)) return val.length === 0;
  return false;
}

function pickFirstNonEmpty(
  fields: Record<string, unknown>,
  keys: readonly string[],
): unknown {
  for (const key of keys) {
    const val = fields[key];
    if (!isAbsent(val)) return val;
  }
  return null;
}

function choiceName(val: unknown): string | null {
  if (isAbsent(val)) return null;
  if (typeof val === "string") return val.trim() || null;
  if (typeof val === "number" || typeof val === "boolean") return String(val);
  if (typeof val === "object" && val !== null) {
    const obj = val as Record<string, unknown>;
    if (typeof obj.name === "string" && obj.name.trim()) return obj.name.trim();
    if (typeof obj.url === "string" && obj.url.trim()) return obj.url.trim();
    if (typeof obj.text === "string" && obj.text.trim()) return obj.text.trim();
  }
  return null;
}

function textValue(val: unknown): string | null {
  if (isAbsent(val)) return null;
  if (Array.isArray(val)) {
    const parts = val.map(choiceName).filter(Boolean) as string[];
    return parts.length > 0 ? parts.join(", ") : null;
  }
  return choiceName(val);
}

function urlValue(val: unknown): string | null {
  if (isAbsent(val)) return null;
  if (Array.isArray(val)) {
    for (const item of val) {
      const url = urlValue(item);
      if (url) return url;
    }
    return null;
  }
  if (typeof val === "object" && val !== null) {
    const obj = val as Record<string, unknown>;
    if (typeof obj.url === "string" && obj.url.trim()) return obj.url.trim();
  }
  return textValue(val);
}

function numberValue(val: unknown): number | null {
  if (isAbsent(val)) return null;
  const n = Number(val);
  return Number.isFinite(n) ? n : null;
}

function integerValue(val: unknown): number | null {
  const n = numberValue(val);
  return n === null ? null : Math.round(n);
}

function booleanValue(val: unknown): boolean | null {
  if (val === undefined || val === null) return null;
  if (typeof val === "boolean") return val;
  if (typeof val === "number") return val === 1 ? true : val === 0 ? false : null;
  if (typeof val === "string") {
    const normalized = val.trim().toLowerCase();
    if (["true", "1", "yes", "oui", "vrai"].includes(normalized)) return true;
    if (["false", "0", "no", "non", "faux"].includes(normalized)) return false;
  }
  const name = choiceName(val)?.toLowerCase();
  if (!name) return null;
  if (["true", "1", "yes", "oui", "vrai"].includes(name)) return true;
  if (["false", "0", "no", "non", "faux"].includes(name)) return false;
  return null;
}

function textArrayValue(val: unknown): string[] | null {
  if (isAbsent(val)) return null;
  if (Array.isArray(val)) {
    const values = val.map(choiceName).filter(Boolean) as string[];
    return values.length > 0 ? values : null;
  }
  if (typeof val === "string") {
    const values = val.split(",").map((item) => item.trim()).filter(Boolean);
    return values.length > 0 ? values : null;
  }
  const single = choiceName(val);
  return single ? [single] : null;
}

function setIfPresent(
  payload: EnterprisePayload,
  column: string,
  val: unknown,
): void {
  if (!ENTERPRISE_COLUMNS.has(column)) {
    console.warn(`sync-airtable: ignored unknown Supabase column "${column}"`);
    return;
  }
  if (isAbsent(val)) return;
  payload[column] = val;
}

function mapRecord(record: AirtableRecord): EnterprisePayload {
  const f = record.fields;
  const payload: EnterprisePayload = { id_airtable: record.id };
  const pick = (key: keyof typeof FIELD_VARIANTS) =>
    pickFirstNonEmpty(f, FIELD_VARIANTS[key]);

  setIfPresent(payload, "nom", textValue(pick("nom")));
  setIfPresent(payload, "description", textValue(pick("description")));
  setIfPresent(payload, "a_propos", textValue(pick("a_propos")));
  setIfPresent(payload, "adresse", textValue(pick("adresse")));
  setIfPresent(payload, "ville", textValue(pick("ville")));
  setIfPresent(payload, "gouvernorat", textValue(pick("gouvernorat")));

  setIfPresent(payload, "statut_carte", textValue(pick("statut_carte")));
  setIfPresent(payload, "statut_abonnement", textValue(pick("statut_abonnement")));
  setIfPresent(payload, "statut_validation", textValue(pick("statut_validation")));
  setIfPresent(payload, "status", textValue(pick("status")));

  setIfPresent(payload, "telephone", textValue(pick("telephone")));
  setIfPresent(payload, "telephone2", textValue(pick("telephone2")));
  setIfPresent(payload, "email", textValue(pick("email")));
  setIfPresent(payload, "email2", textValue(pick("email2")));
  setIfPresent(payload, "site_web", textValue(pick("site_web")));
  setIfPresent(payload, "whatsapp", textValue(pick("whatsapp")));

  setIfPresent(payload, "latitude", numberValue(pick("latitude")));
  setIfPresent(payload, "longitude", numberValue(pick("longitude")));

  setIfPresent(payload, "image_url", urlValue(pick("image_url")));
  setIfPresent(payload, "logo_url", urlValue(pick("logo_url")));
  setIfPresent(payload, "video_url", urlValue(pick("video_url")));
  setIfPresent(payload, "image_couverture", urlValue(pick("image_couverture")));

  setIfPresent(payload, "slug", textValue(pick("slug")));
  setIfPresent(payload, "search_text", textValue(pick("search_text")));
  setIfPresent(payload, "mots cles recherche", textValue(pick("mots_cles_recherche")));
  setIfPresent(payload, "synonymes_seo", textValue(pick("synonymes_seo")));
  setIfPresent(payload, "synonymes_seo_calcule", textValue(pick("synonymes_seo_calcule")));

  setIfPresent(payload, "lien facebook", textValue(pick("lien_facebook")));
  setIfPresent(payload, "Lien Instagram", textValue(pick("lien_instagram")));
  setIfPresent(payload, "Lien LinkedIn", textValue(pick("lien_linkedin")));
  setIfPresent(payload, "Lien TikTok", textValue(pick("lien_tiktok")));
  setIfPresent(payload, "Lien YouTube", textValue(pick("lien_youtube")));
  setIfPresent(payload, "lien_x", textValue(pick("lien_x")));

  setIfPresent(payload, "Note Google Globale", numberValue(pick("note_google")));
  setIfPresent(payload, "Compteur Avis Google", integerValue(pick("compteur_avis_google")));
  setIfPresent(payload, "score_avis", numberValue(pick("score_avis")));
  setIfPresent(payload, "views_count", integerValue(pick("views_count")));

  setIfPresent(payload, "horaires_ok", textValue(pick("horaires_ok")));
  setIfPresent(payload, "BTN_Maps", textValue(pick("btn_maps")));
  setIfPresent(payload, "Lien Avis Google", textValue(pick("lien_avis_google")));
  setIfPresent(payload, "google_url", textValue(pick("google_url")));

  setIfPresent(payload, "approved", booleanValue(pick("approved")));
  setIfPresent(payload, "featured", booleanValue(pick("featured")));
  setIfPresent(payload, "home_featured", booleanValue(pick("home_featured")));
  setIfPresent(payload, "is_premium", booleanValue(pick("is_premium")));
  setIfPresent(payload, "is_local_verified", booleanValue(pick("is_local_verified")));
  setIfPresent(payload, "verifie", booleanValue(pick("verifie")));
  setIfPresent(payload, "page commerce local", booleanValue(pick("page_commerce_local")));
  setIfPresent(payload, "mise en avant pub", booleanValue(pick("mise_en_avant_pub")));

  setIfPresent(payload, "priorite", integerValue(pick("priorite")));
  setIfPresent(payload, "niveau_priorite", integerValue(pick("niveau_priorite")));
  setIfPresent(payload, "mis_a_jour_le", textValue(pick("mis_a_jour_le")));

  setIfPresent(payload, "name_ar", textValue(pick("name_ar")));
  setIfPresent(payload, "name_en", textValue(pick("name_en")));
  setIfPresent(payload, "name_it", textValue(pick("name_it")));
  setIfPresent(payload, "name_ru", textValue(pick("name_ru")));
  setIfPresent(payload, "description_ar", textValue(pick("description_ar")));
  setIfPresent(payload, "description_en", textValue(pick("description_en")));
  setIfPresent(payload, "description_it", textValue(pick("description_it")));
  setIfPresent(payload, "description_ru", textValue(pick("description_ru")));
  setIfPresent(payload, "keywords_fr", textValue(pick("keywords_fr")));
  setIfPresent(payload, "keywords_en", textValue(pick("keywords_en")));
  setIfPresent(payload, "keywords_it", textValue(pick("keywords_it")));
  setIfPresent(payload, "keywords_ru", textValue(pick("keywords_ru")));
  setIfPresent(payload, "keywords_ar", textValue(pick("keywords_ar")));

  const sousCategories = textArrayValue(pick("sous_categories"));
  if (sousCategories) {
    setIfPresent(payload, "sous_categories_texte", sousCategories.join(", "));
    setIfPresent(payload, "sous_categories_clean", sousCategories.join(", "));
  } else {
    setIfPresent(payload, "sous_categories_clean", textValue(pick("sous_categories_clean")));
  }

  setIfPresent(payload, "services", textValue(pick("services")));
  setIfPresent(payload, "qr_code_url", textValue(pick("qr_code_url")));
  setIfPresent(payload, "theme_culturel", textValue(pick("theme_culturel")));
  setIfPresent(payload, "secteur_evenement", textValue(pick("secteur_evenement")));
  setIfPresent(payload, "liste_pages", textArrayValue(pick("liste_pages")));
  setIfPresent(payload, "categorie", textArrayValue(pick("categorie")));

  return payload;
}

function findUnusedAirtableFields(records: AirtableRecord[]): string[] {
  const unknown = new Set<string>();
  for (const record of records) {
    for (const fieldName of Object.keys(record.fields)) {
      if (!RECOGNIZED_AIRTABLE_FIELDS.has(fieldName)) unknown.add(fieldName);
    }
  }
  return [...unknown].sort();
}

function hasText(val: unknown): boolean {
  return typeof val === "string" && val.trim() !== "";
}

function wouldLoseCriticalValue(
  existing: ExistingEnterprise | undefined,
  payload: EnterprisePayload,
  column: "nom" | "ville",
): boolean {
  if (!existing || !hasText(existing[column])) return false;
  return column in payload && !hasText(payload[column]);
}

function analyzeRecords(
  records: AirtableRecord[],
  mapped: EnterprisePayload[],
  existingByAirtableId: Map<string, ExistingEnterprise>,
) {
  let airtableNameEmpty = 0;
  let airtableVilleEmpty = 0;
  let wouldModify = 0;
  let wouldCreate = 0;
  let wouldLoseNom = 0;
  let wouldLoseVille = 0;
  const recognizedFieldCounts: Record<string, number> = {};
  const samples: unknown[] = [];

  for (let i = 0; i < mapped.length; i++) {
    const record = records[i];
    const payload = mapped[i];
    const existing = existingByAirtableId.get(record.id);
    const changedColumns = Object.keys(payload).filter((key) => key !== "id_airtable");

    if (!hasText(payload.nom)) airtableNameEmpty++;
    if (!hasText(payload.ville)) airtableVilleEmpty++;
    if (existing) wouldModify++;
    else wouldCreate++;
    if (wouldLoseCriticalValue(existing, payload, "nom")) wouldLoseNom++;
    if (wouldLoseCriticalValue(existing, payload, "ville")) wouldLoseVille++;

    for (const key of changedColumns) {
      recognizedFieldCounts[key] = (recognizedFieldCounts[key] ?? 0) + 1;
    }

    if (samples.length < DRY_RUN_SAMPLE_SIZE) {
      samples.push({
        id_airtable: record.id,
        airtableName: textValue(pickFirstNonEmpty(record.fields, FIELD_VARIANTS.nom)),
        existing: existing
          ? {
              nom: existing.nom,
              ville: existing.ville,
              slug: existing.slug,
              statut_validation: existing.statut_validation,
              statut_abonnement: existing.statut_abonnement,
              liste_pages: existing.liste_pages,
            }
          : null,
        payload,
        changedColumns,
      });
    }
  }

  const total = records.length;
  return {
    total,
    wouldModify,
    wouldCreate,
    airtableNameEmpty,
    airtableVilleEmpty,
    airtableNameEmptyRate: total > 0 ? airtableNameEmpty / total : 0,
    airtableVilleEmptyRate: total > 0 ? airtableVilleEmpty / total : 0,
    wouldLoseNom,
    wouldLoseVille,
    wouldLoseCriticalRate: total > 0 ? (wouldLoseNom + wouldLoseVille) / total : 0,
    recognizedFieldCounts,
    samples,
  };
}

function guardViolations(analysis: ReturnType<typeof analyzeRecords>): string[] {
  const violations: string[] = [];
  if (analysis.total === 0) violations.push("No Airtable records found.");
  if (analysis.airtableNameEmptyRate > 0.2) {
    violations.push(
      `More than 20% of Airtable records have no mapped name (${analysis.airtableNameEmpty}/${analysis.total}).`,
    );
  }
  if (analysis.wouldLoseCriticalRate > 0.1) {
    violations.push(
      `More than 10% of rows would lose a non-empty nom/ville (${analysis.wouldLoseNom + analysis.wouldLoseVille}/${analysis.total}).`,
    );
  }
  const mappedNames = analysis.recognizedFieldCounts.nom ?? 0;
  if (analysis.total > 0 && mappedNames / analysis.total < 0.8) {
    violations.push(
      `Recognized name field coverage is below 80% (${mappedNames}/${analysis.total}).`,
    );
  }
  return violations;
}

async function fetchAllFromAirtable(
  baseId: string,
  token: string,
): Promise<AirtableRecord[]> {
  const allRecords: AirtableRecord[] = [];
  let offset: string | undefined;
  let page = 0;

  do {
    page++;
    const url = new URL(
      `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(AIRTABLE_TABLE_NAME)}`,
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

async function fetchExistingEntreprises(
  supabase: ReturnType<typeof createClient>,
  ids: string[],
): Promise<Map<string, ExistingEnterprise>> {
  const existingByAirtableId = new Map<string, ExistingEnterprise>();

  for (let i = 0; i < ids.length; i += 500) {
    const batchIds = ids.slice(i, i + 500);
    const { data, error } = await supabase
      .from("entreprise")
      .select(
        "id_airtable,nom,ville,description,slug,statut_validation,statut_abonnement,liste_pages",
      )
      .in("id_airtable", batchIds);

    if (error) {
      throw new Error(`Existing entreprise lookup failed: ${error.message}`);
    }

    for (const row of data ?? []) {
      if (row.id_airtable) existingByAirtableId.set(row.id_airtable, row);
    }
  }

  return existingByAirtableId;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization") ?? "";
    const cronSecret = Deno.env.get("CRON_SECRET");
    const cronHeader = req.headers.get("x-cron-secret");

    const isCron = cronSecret && cronHeader === cronSecret;

    if (!isCron && !authHeader.startsWith("Bearer ")) {
      return respond({ error: "Unauthorized" }, 401);
    }

    const url = new URL(req.url);
    const forceRefresh = url.searchParams.get("refresh") === "true";
    const dryRun =
      url.searchParams.get("dry_run") === "true" ||
      Deno.env.get("DRY_RUN") === "true";
    const forceSync =
      url.searchParams.get("force_sync") === "true" ||
      Deno.env.get("FORCE_SYNC") === "true";
    const recordIdsParam = url.searchParams.get("record_ids") ||
      url.searchParams.get("record_id") ||
      "";
    const requestedRecordIds = recordIdsParam
      .split(",")
      .map((id) => id.trim())
      .filter(Boolean);
    const limit = integerValue(url.searchParams.get("limit"));

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const airtableToken = Deno.env.get("AIRTABLE_TOKEN");
    const airtableBaseId =
      Deno.env.get("AIRTABLE_BASE_ID") || AIRTABLE_BASE_ID_DEFAULT;

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { count, error: countError } = await supabase
      .from("entreprise")
      .select("id", { count: "exact", head: true });

    if (countError) {
      return respond(
        { error: "Count query failed", details: countError.message },
        500,
      );
    }

    const currentCount = count ?? 0;

    if (!forceRefresh && !dryRun && requestedRecordIds.length === 0 && currentCount >= EXPECTED_COUNT) {
      return respond({
        source: "supabase",
        synced: false,
        message: `Base already contains ${currentCount} fiches (target: ${EXPECTED_COUNT}). Use ?refresh=true after a successful ?dry_run=true.`,
        count: currentCount,
      });
    }

    if (!airtableToken) {
      return respond(
        {
          error:
            "AIRTABLE_TOKEN is not configured. Add it in Supabase Dashboard > Edge Functions > Secrets.",
          count: currentCount,
        },
        400,
      );
    }

    let records = await fetchAllFromAirtable(airtableBaseId, airtableToken);

    if (requestedRecordIds.length > 0) {
      const requested = new Set(requestedRecordIds);
      records = records.filter((record) => requested.has(record.id));
    }

    if (limit && limit > 0) {
      records = records.slice(0, limit);
    }

    const mapped = records.map(mapRecord);
    const existingByAirtableId = await fetchExistingEntreprises(
      supabase,
      records.map((record) => record.id),
    );
    const analysis = analyzeRecords(records, mapped, existingByAirtableId);
    const violations = guardViolations(analysis);
    const unknownAirtableFields = findUnusedAirtableFields(records);

    if (dryRun) {
      return respond({
        source: "airtable",
        synced: false,
        dryRun: true,
        previousSupabaseCount: currentCount,
        totalAirtable: records.length,
        analysis,
        guardViolations: violations,
        unknownAirtableFields,
        message:
          "Dry-run only: no Supabase upsert was executed. Review guardViolations and samples before syncing.",
      });
    }

    if (violations.length > 0 && !forceSync) {
      return respond(
        {
          source: "airtable",
          synced: false,
          previousSupabaseCount: currentCount,
          totalAirtable: records.length,
          analysis,
          guardViolations: violations,
          unknownAirtableFields,
          message:
            "Sync blocked by safety guards. Run ?dry_run=true, fix the mapping/source, or pass force_sync=true only after manual validation.",
        },
        409,
      );
    }

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
          `Batch ${Math.floor(i / BATCH_SIZE) + 1}: ${upsertError.message}`,
        );
      } else {
        upsertedCount += batch.length;
      }
    }

    return respond({
      source: "airtable",
      synced: errors.length === 0,
      message: `Import terminé: ${upsertedCount} / ${records.length} fiches synchronisées.`,
      count: upsertedCount,
      totalAirtable: records.length,
      previousSupabaseCount: currentCount,
      analysis,
      guardViolations: violations,
      unknownAirtableFields,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return respond({ error: message }, 500);
  }
});
