import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const BASE_ID = "app9Q828Splwvm4jW";
const TABLE_ID = "tbl28xvuFDmbrgu5f";
const PUBLIC_ORIGIN = "https://dalil-tounes.com";
const headers = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, apikey, content-type, x-client-info",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control": "no-store",
  "X-Robots-Tag": "noindex, nofollow, noarchive",
};

const reply = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status, headers });

const text = (value: unknown, max = 2000): string =>
  typeof value === "string" ? value.trim().slice(0, max) : "";

const httpUrl = (value: unknown): string => {
  const candidate = text(value, 2048);
  try {
    const url = new URL(candidate);
    return url.protocol === "https:" || url.protocol === "http:" ? url.toString() : "";
  } catch {
    return "";
  }
};

const sha256 = async (value: string) => {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
};

const randomToken = () =>
  [...crypto.getRandomValues(new Uint8Array(32))]
    .map((byte) => byte.toString(16).padStart(2, "0")).join("");

type AirtableRow = { id: string; fields: Record<string, unknown> };
const airtable = async (path: string, token: string, init?: RequestInit) => {
  const response = await fetch(`https://api.airtable.com/v0/${BASE_ID}/${TABLE_ID}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(init?.body ? { "Content-Type": "application/json" } : {}),
    },
  });
  if (!response.ok) throw new Error(`Airtable returned ${response.status}`);
  return response.json();
};

const isAdmin = async (request: Request, url: string, anonKey: string, admin: ReturnType<typeof createClient>) => {
  const jwt = request.headers.get("Authorization")?.replace(/^Bearer\s+/i, "");
  if (!jwt) return false;
  const publicClient = createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data: { user }, error } = await publicClient.auth.getUser(jwt);
  if (error || !user) return false;
  const [{ data: profile }, { data: adminRow }] = await Promise.all([
    admin.from("profiles").select("role").eq("id", user.id).maybeSingle(),
    admin.from("admins").select("id").eq("id", user.id).maybeSingle(),
  ]);
  return profile?.role === "admin" || Boolean(adminRow);
};

Deno.serve(async (request: Request) => {
  if (request.method === "OPTIONS") return new Response(null, { headers });
  const projectUrl = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
  if (!projectUrl || !serviceKey || !anonKey) return reply({ error: "Configuration manquante" }, 500);

  const admin = createClient(projectUrl, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const search = new URL(request.url).searchParams;
  try {
    if (request.method === "GET" && search.has("token")) {
      const token = search.get("token") || "";
      if (!/^[0-9a-f]{64}$/.test(token)) return reply({ error: "Lien invalide" }, 404);
      const { data, error } = await admin
        .from("business_previews")
        .select("content, expires_at, revoked_at")
        .eq("token_hash", await sha256(token))
        .maybeSingle();
      if (error || !data || data.revoked_at || new Date(data.expires_at).getTime() < Date.now()) {
        return reply({ error: "Lien expiré ou invalide" }, 404);
      }
      return reply({ preview: data.content });
    }

    if (!(await isAdmin(request, projectUrl, anonKey, admin))) {
      return reply({ error: "Accès réservé à l’administration" }, 403);
    }
    const airtableToken = Deno.env.get("AIRTABLE_TOKEN");
    if (!airtableToken) return reply({ error: "Connexion Airtable manquante" }, 500);

    if (request.method === "GET" && search.get("admin") === "list") {
      const data = await airtable("?pageSize=100", airtableToken) as { records: AirtableRow[] };
      return reply({
        records: data.records.map(({ id, fields }) => ({
          id,
          name: text(fields["Nom de l’établissement"], 200),
          email: text(fields["Email du client"], 320),
          stage: text(fields["Étape du dossier"], 100),
          link: httpUrl(fields["Lien de l’aperçu"]),
        })),
      });
    }
    if (request.method === "GET" && search.has("record_id")) {
      const id = search.get("record_id") || "";
      if (!/^rec[a-zA-Z0-9]{10,24}$/.test(id)) return reply({ error: "Dossier invalide" }, 400);
      const row = await airtable(`/${id}`, airtableToken) as AirtableRow;
      const { data: existing } = await admin
        .from("business_previews").select("content")
        .eq("airtable_record_id", id).maybeSingle();
      return reply({
        record: {
          id,
          name: text(row.fields["Nom de l’établissement"], 200),
          email: text(row.fields["Email du client"], 320),
          phone: text(row.fields["Téléphone du client"], 80),
          request: text(row.fields["Demande du client"], 5000),
          model: text(row.fields["Modèle demandé"], 100),
          formula: text(row.fields["Formule demandée"], 100),
          palette: text(row.fields["Palette demandée"], 100),
          link: httpUrl(row.fields["Lien de l’aperçu"]),
        },
        preview: existing?.content || null,
      });
    }
    if (request.method === "POST") {
      const body = await request.json();
      const recordId = text(body.recordId, 40);
      if (!/^rec[a-zA-Z0-9]{10,24}$/.test(recordId)) return reply({ error: "Dossier invalide" }, 400);
      const row = await airtable(`/${recordId}`, airtableToken) as AirtableRow;
      const input = body.preview || {};
      const name = text(input.nom, 200) || text(row.fields["Nom de l’établissement"], 200);
      if (!name) return reply({ error: "Nom de l’établissement requis" }, 400);
      const content = {
        nom: name,
        categorie: text(input.categorie, 200),
        description: text(input.description, 5000),
        services: text(input.services, 5000),
        a_propos: text(input.a_propos, 5000),
        ville: text(input.ville, 200),
        gouvernorat: text(input.gouvernorat, 200),
        adresse: text(input.adresse, 500),
        telephone: text(input.telephone, 80),
        whatsapp: text(input.whatsapp, 80),
        email: text(input.email, 320),
        site_web: httpUrl(input.site_web),
        image_url: httpUrl(input.image_url),
        logo_url: httpUrl(input.logo_url),
        lien_facebook: httpUrl(input.lien_facebook),
        lien_instagram: httpUrl(input.lien_instagram),
        modele_cv: text(input.modele_cv, 100) || text(row.fields["Modèle demandé"], 100) || "Business",
        palette_cv: text(input.palette_cv, 100) || text(row.fields["Palette demandée"], 100) || "Prestige",
        formule_commerciale: text(input.formule_commerciale, 100) || text(row.fields["Formule demandée"], 100),
      };

      const previous = httpUrl(row.fields["Lien de l’aperçu"]);
      let token = "";
      try {
        const url = new URL(previous);
        if (url.origin === PUBLIC_ORIGIN) token = url.pathname.match(/^\/apercu\/([0-9a-f]{64})$/)?.[1] || "";
      } catch { /* no existing token */ }
      const { data: existing } = await admin
        .from("business_previews").select("token_hash")
        .eq("airtable_record_id", recordId).maybeSingle();
      if (!token || await sha256(token) !== existing?.token_hash) token = randomToken();
      const link = `${PUBLIC_ORIGIN}/apercu/${token}`;
      const { error } = await admin.from("business_previews").upsert({
        airtable_record_id: recordId,
        token_hash: await sha256(token),
        content,
        expires_at: new Date(Date.now() + 30 * 86400000).toISOString(),
        revoked_at: null,
        updated_at: new Date().toISOString(),
      }, { onConflict: "airtable_record_id" });
      if (error) throw error;
      try {
        const fields: Record<string, string> = {
          "Lien de l’aperçu": link,
          "Fiche préparée le": new Date().toISOString(),
        };
        if (row.fields["Étape du dossier"] === "Demande reçue") {
          fields["Étape du dossier"] = "Fiche en préparation";
        }
        await airtable(`/${recordId}`, airtableToken, {
          method: "PATCH", body: JSON.stringify({ fields }),
        });
      } catch {
        return reply({ link, warning: "Lien créé, mais non enregistré dans Airtable. Copiez-le depuis cette page." });
      }
      return reply({ link });
    }
    return reply({ error: "Méthode non autorisée" }, 405);
  } catch (error) {
    console.error("business-preview:", error);
    return reply({ error: "Impossible de traiter la demande" }, 500);
  }
});
