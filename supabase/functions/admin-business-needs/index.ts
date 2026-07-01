import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-application-name",
};

const businessNeedColumns = `
  id,
  created_at,
  updated_at,
  published_at,
  deleted_at,
  deleted_by,
  type,
  title,
  description,
  company_name,
  contact_name,
  contact_email,
  contact_phone,
  city,
  governorate,
  urgency,
  status,
  moderation_status,
  moderation_reason,
  category,
  budget_min,
  budget_max,
  deadline,
  zone_intervention
`;

type AdminContext = {
  id: string;
  email: string;
  mode: "supabase-admin" | "temporary-v1";
};

type RequestBody = {
  action?: "list" | "count" | "approve" | "reject" | "delete" | "restore";
  id?: string;
  moderation_reason?: string | null;
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function getAdminEmails() {
  const configured =
    Deno.env.get("BUSINESS_NEEDS_ADMIN_EMAILS") ||
    Deno.env.get("ADMIN_EMAILS") ||
    "contact@dalil-tounes.com,zenanis75@hotmail.com";

  return configured
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

function getServiceRoleKey() {
  const legacyKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (legacyKey) return legacyKey;

  const secretKeys = Deno.env.get("SUPABASE_SECRET_KEYS");
  if (!secretKeys) return "";

  try {
    const parsed = JSON.parse(secretKeys) as Record<string, string>;
    return parsed.default || "";
  } catch {
    return "";
  }
}

function getBearerToken(req: Request) {
  const header = req.headers.get("authorization") || "";
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match?.[1] || "";
}

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  const [, payload] = token.split(".");
  if (!payload) return null;

  try {
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(normalized.length + (4 - normalized.length % 4) % 4, "=");
    return JSON.parse(atob(padded)) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function getProjectRef() {
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  if (!supabaseUrl) return "";

  try {
    return new URL(supabaseUrl).hostname.split(".")[0] || "";
  } catch {
    return "";
  }
}

function isTemporaryV1AdminRequest(token: string) {
  const publicKeys = [
    Deno.env.get("SUPABASE_ANON_KEY"),
    Deno.env.get("SUPABASE_PUBLISHABLE_KEY"),
  ].filter(Boolean);

  if (publicKeys.includes(token)) return true;

  const payload = decodeJwtPayload(token);
  return payload?.role === "anon" && payload?.ref === getProjectRef();
}

async function requireAdmin(req: Request, supabaseAdmin: ReturnType<typeof createClient>): Promise<AdminContext> {
  const token = getBearerToken(req);

  if (!token) {
    throw new Response(JSON.stringify({ error: "Session admin requise" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // TODO: remplacer ce mode temporaire V1 par une vraie authentification admin
  // Supabase et supprimer l'acceptation de la clé publique anon pour l'administration.
  if (isTemporaryV1AdminRequest(token)) {
    return {
      id: "temporary-admin-v1",
      email: "temporary-admin-v1@dalil-tounes.local",
      mode: "temporary-v1",
    };
  }

  const { data: userData, error: userError } = await supabaseAdmin.auth.getUser(token);
  const user = userData?.user;

  if (userError || !user?.id) {
    throw new Response(JSON.stringify({ error: "Session admin invalide" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const email = (user.email || "").toLowerCase();
  const emailAllowed = getAdminEmails().includes(email);

  const { data: adminRow, error: adminError } = await supabaseAdmin
    .from("admins")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  if (adminError) {
    console.error("[admin-business-needs] admins lookup failed", {
      code: adminError.code,
      message: adminError.message,
    });
  }

  if (!emailAllowed && !adminRow) {
    throw new Response(JSON.stringify({ error: "Acces admin refuse" }), {
      status: 403,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  return { id: user.id, email, mode: "supabase-admin" };
}

async function readRequestBody(req: Request): Promise<RequestBody> {
  if (req.method === "GET") return { action: "list" };

  try {
    return (await req.json()) as RequestBody;
  } catch {
    return {};
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  if (!["GET", "POST"].includes(req.method)) {
    return json({ error: "Methode non supportee" }, 405);
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceRoleKey = getServiceRoleKey();

    if (!supabaseUrl || !serviceRoleKey) {
      console.error("[admin-business-needs] Missing Supabase admin environment");
      return json({ error: "Configuration serveur incomplete" }, 500);
    }

    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false },
    });

    await requireAdmin(req, supabaseAdmin);

    const body = await readRequestBody(req);
    const action = body.action || "list";

    if (action === "list") {
      const { data, error, count } = await supabaseAdmin
        .from("business_needs")
        .select(businessNeedColumns, { count: "exact" })
        .order("created_at", { ascending: false })
        .range(0, 9999);

      if (error) throw error;

      return json({ data: data || [], count: count ?? data?.length ?? 0 });
    }

    if (action === "count") {
      const { count, error } = await supabaseAdmin
        .from("business_needs")
        .select("id", { count: "exact", head: true })
        .eq("status", "pending_review")
        .is("deleted_at", null);

      if (error) throw error;

      return json({ counts: { pending_review: count ?? 0 } });
    }

    if (!body.id) {
      return json({ error: "Identifiant manquant" }, 400);
    }

    if (action === "approve") {
      const now = new Date().toISOString();
      const { data, error } = await supabaseAdmin
        .from("business_needs")
        .update({
          status: "published",
          moderation_status: "approved",
          visibility: "public",
          published_at: now,
          updated_at: now,
        })
        .eq("id", body.id)
        .is("deleted_at", null)
        .select(businessNeedColumns)
        .maybeSingle();

      if (error) throw error;
      if (!data) return json({ error: "Besoin introuvable" }, 404);

      return json({ data });
    }

    if (action === "reject") {
      const { data, error } = await supabaseAdmin
        .from("business_needs")
        .update({
          status: "rejected",
          moderation_status: "rejected",
          moderation_reason: body.moderation_reason || null,
          visibility: "private",
          updated_at: new Date().toISOString(),
        })
        .eq("id", body.id)
        .is("deleted_at", null)
        .select(businessNeedColumns)
        .maybeSingle();

      if (error) throw error;
      if (!data) return json({ error: "Besoin introuvable" }, 404);

      return json({ data });
    }

    if (action === "delete") {
      const now = new Date().toISOString();
      const { data, error } = await supabaseAdmin
        .from("business_needs")
        .update({
          deleted_at: now,
          deleted_by: "admin",
          status: "deleted",
          visibility: "private",
          updated_at: now,
        })
        .eq("id", body.id)
        .is("deleted_at", null)
        .select(businessNeedColumns)
        .maybeSingle();

      if (error) throw error;
      if (!data) return json({ error: "Besoin introuvable" }, 404);

      return json({ data });
    }

    if (action === "restore") {
      const now = new Date().toISOString();
      const { data, error } = await supabaseAdmin
        .from("business_needs")
        .update({
          deleted_at: null,
          deleted_by: null,
          status: "pending_review",
          moderation_status: "pending",
          moderation_reason: null,
          visibility: "private",
          published_at: null,
          updated_at: now,
        })
        .eq("id", body.id)
        .select(businessNeedColumns)
        .maybeSingle();

      if (error) throw error;
      if (!data) return json({ error: "Besoin introuvable" }, 404);

      return json({ data });
    }

    return json({ error: "Action non supportee" }, 400);
  } catch (err) {
    if (err instanceof Response) return err;

    const message = err instanceof Error ? err.message : "Erreur serveur";
    console.error("[admin-business-needs] unexpected error", message);
    return json({ error: message }, 500);
  }
});
