import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const ADMIN_EMAIL = Deno.env.get("BUSINESS_NEED_ADMIN_EMAIL") || "contact@dalil-tounes.com";
const FROM_EMAIL = Deno.env.get("BUSINESS_NEED_FROM_EMAIL") || "Dalil Tounes <notifications@dalil-tounes.com>";
const AIRTABLE_TABLE = "Besoins & stocks professionnels";
const ADMIN_URL = "https://dalil-tounes.com/admin/business-needs";

type BusinessNeed = Record<string, unknown> & { id: string };

function json(body: Record<string, unknown>, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });
}

function escapeHtml(value: unknown): string {
  return String(value ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\"/g, "&quot;").replace(/'/g, "&#039;");
}

function display(value: unknown): string {
  const text = String(value ?? "").trim();
  return text || "Non renseigné";
}

function typeLabel(value: unknown): string {
  const labels: Record<string, string> = {
    supplier_search: "Recherche de fournisseur",
    service_provider_search: "Service professionnel",
    equipment_purchase: "Recherche de stock",
    equipment_sale: "Vente de stock",
    liquidation: "Vente de stock",
    partnership: "Recherche de partenaire",
    business_opportunity: "Appel d’offres",
    other: "Autre",
  };
  return labels[String(value)] || "Autre";
}

function urgencyLabel(value: unknown): string {
  return { low: "Faible", normal: "Normale", urgent: "Urgente" }[String(value)] || "Normale";
}

function airtableFields(need: BusinessNeed): Record<string, unknown> {
  return {
    "Titre": display(need.title),
    "Description": display(need.description),
    "ID Supabase": need.id,
    "Date de réception": display(need.created_at),
    "Entreprise": display(need.company_name),
    "Contact": display(need.contact_name),
    "E-mail": display(need.contact_email),
    "Téléphone": display(need.contact_phone),
    "Type de besoin": typeLabel(need.type),
    "Ville": display(need.city),
    "Gouvernorat": display(need.governorate),
    "Catégorie": String(need.category ?? ""),
    "Zone d’intervention": String(need.zone_intervention ?? ""),
    ...(need.budget_min == null ? {} : { "Budget minimum": Number(need.budget_min) }),
    ...(need.budget_max == null ? {} : { "Budget maximum": Number(need.budget_max) }),
    "Devise": display(need.currency || "TND"),
    "Échéance": String(need.deadline ?? ""),
    "Urgence": urgencyLabel(need.urgency),
    "Statut de publication": "En attente",
    "Langue": display(need.submission_lang || "fr"),
    "Lien administration": ADMIN_URL,
    "Synchronisé Supabase": true,
    "Dernière synchronisation": new Date().toISOString(),
  };
}

async function syncAirtable(need: BusinessNeed, token: string, baseId: string): Promise<string> {
  const baseUrl = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(AIRTABLE_TABLE)}`;
  const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
  let recordId = String(need.airtable_record_id ?? "").trim();

  if (!recordId) {
    const formula = encodeURIComponent(`{ID Supabase}='${need.id}'`);
    const lookup = await fetch(`${baseUrl}?maxRecords=1&filterByFormula=${formula}`, { headers });
    if (!lookup.ok) throw new Error(`Airtable lookup ${lookup.status}: ${await lookup.text()}`);
    const lookupData = await lookup.json();
    recordId = lookupData?.records?.[0]?.id || "";
  }

  const response = await fetch(baseUrl, {
    method: recordId ? "PATCH" : "POST",
    headers,
    body: JSON.stringify({ records: [{ ...(recordId ? { id: recordId } : {}), fields: airtableFields(need) }], typecast: true }),
  });
  if (!response.ok) throw new Error(`Airtable sync ${response.status}: ${await response.text()}`);
  const data = await response.json();
  return data?.records?.[0]?.id || recordId;
}

function emailHtml(need: BusinessNeed): string {
  const values: Array<[string, unknown]> = [
    ["Type", typeLabel(need.type)], ["Titre", need.title], ["Description", need.description],
    ["Entreprise", need.company_name], ["Contact", need.contact_name], ["E-mail", need.contact_email],
    ["Téléphone", need.contact_phone], ["Ville", need.city], ["Gouvernorat", need.governorate],
    ["Urgence", urgencyLabel(need.urgency)], ["Catégorie", need.category], ["Échéance", need.deadline],
  ];
  const rows = values.map(([label, value]) => `<tr><td style="padding:8px 10px;font-weight:700;border-bottom:1px solid #eee;width:150px">${escapeHtml(label)}</td><td style="padding:8px 10px;border-bottom:1px solid #eee;white-space:pre-wrap">${escapeHtml(display(value))}</td></tr>`).join("");
  return `<div style="font-family:Arial,sans-serif;max-width:680px;margin:auto"><div style="background:#4A1D43;color:white;padding:18px 22px"><h2 style="margin:0">Nouveau besoin professionnel à valider</h2><p style="color:#F3D37A;margin:6px 0 0">La demande est enregistrée dans Airtable.</p></div><div style="border:1px solid #eee;padding:20px"><table style="width:100%;border-collapse:collapse">${rows}</table><p style="margin-top:20px"><a href="${ADMIN_URL}" style="background:#D4AF37;color:#4A1D43;padding:10px 14px;text-decoration:none;font-weight:700">Ouvrir l’administration</a></p></div></div>`;
}

async function sendEmail(need: BusinessNeed, apiKey: string): Promise<string | null> {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: FROM_EMAIL, to: [ADMIN_EMAIL], subject: `Nouveau besoin professionnel - ${display(need.company_name)}`, html: emailHtml(need) }),
  });
  if (!response.ok) throw new Error(`Resend ${response.status}: ${await response.text()}`);
  const data = await response.json();
  return data?.id || null;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ success: false, error: "Method not allowed" }, 405);

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const airtableToken = Deno.env.get("AIRTABLE_TOKEN");
    const airtableBaseId = Deno.env.get("AIRTABLE_BASE_ID");
    const resendKey = Deno.env.get("RESEND_API_KEY");
    if (!supabaseUrl || !serviceKey || !airtableToken || !airtableBaseId || !resendKey) return json({ success: false, error: "Server configuration incomplete" }, 500);

    const { business_need_id } = await req.json();
    if (!/^[0-9a-f-]{36}$/i.test(String(business_need_id ?? ""))) return json({ success: false, error: "Invalid business need id" }, 400);

    const admin = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });
    const { data, error } = await admin.from("business_needs").select("*").eq("id", business_need_id).is("deleted_at", null).maybeSingle();
    if (error) throw error;
    if (!data || data.status !== "pending_review" || data.visibility !== "private") return json({ success: false, error: "Pending request not found" }, 404);

    const need = data as BusinessNeed;
    const airtableRecordId = await syncAirtable(need, airtableToken, airtableBaseId);
    const now = new Date().toISOString();
    let emailId: string | null = null;
    if (!need.notification_sent_at) emailId = await sendEmail(need, resendKey);

    const { error: updateError } = await admin.from("business_needs").update({
      airtable_record_id: airtableRecordId,
      airtable_sync_status: "synced",
      airtable_synced_at: now,
      ...(need.notification_sent_at ? {} : { notification_sent_at: now }),
      updated_at: now,
    }).eq("id", need.id);
    if (updateError) throw updateError;

    return json({ success: true, airtable_record_id: airtableRecordId, email_sent: Boolean(emailId), duplicate_notification: Boolean(need.notification_sent_at) });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[notify-business-need]", message);
    return json({ success: false, error: "Notification temporarily unavailable" }, 500);
  }
});
