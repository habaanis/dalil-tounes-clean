import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const ADMIN_EMAIL = Deno.env.get("BUSINESS_NEED_ADMIN_EMAIL") || "contact@dalil-tounes.com";
const FROM_EMAIL =
  Deno.env.get("BUSINESS_NEED_FROM_EMAIL") ||
  "Dalil Tounes <notifications@dalil-tounes.com>";
const SUBJECT = "Nouveau besoin professionnel à valider - Dalil Tounes";

interface BusinessNeedNotificationPayload {
  type?: string;
  title?: string;
  description?: string;
  company_name?: string;
  contact_name?: string;
  contact_email?: string;
  contact_phone?: string;
  city?: string;
  governorate?: string;
  urgency?: string;
  budget?: string | null;
  deadline?: string | null;
  category?: string | null;
  admin_url?: string | null;
}

function jsonResponse(body: Record<string, unknown>, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function escapeHtml(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function optionalValue(value: unknown): string {
  const text = String(value ?? "").trim();
  return text || "Non renseigné";
}

function row(label: string, value: unknown): string {
  return `
    <tr>
      <td style="padding:8px 10px;color:#555;font-size:13px;font-weight:700;border-bottom:1px solid #eee;width:160px;vertical-align:top;">${escapeHtml(label)}</td>
      <td style="padding:8px 10px;color:#222;font-size:14px;border-bottom:1px solid #eee;vertical-align:top;white-space:pre-wrap;">${escapeHtml(optionalValue(value))}</td>
    </tr>`;
}

function buildHtml(payload: BusinessNeedNotificationPayload): string {
  const now = new Date().toLocaleString("fr-TN", { timeZone: "Africa/Tunis" });

  return `<!DOCTYPE html>
<html>
  <head><meta charset="utf-8"></head>
  <body style="margin:0;background:#f7f7f8;font-family:Arial,sans-serif;color:#222;">
    <div style="max-width:680px;margin:0 auto;padding:24px;">
      <div style="background:#4A1D43;color:#fff;padding:18px 22px;border-radius:8px 8px 0 0;">
        <h1 style="margin:0;font-size:20px;line-height:1.3;">Nouveau besoin professionnel à valider</h1>
        <p style="margin:6px 0 0;color:#F3D37A;font-size:13px;">Dalil Tounes - Centre d'affaires</p>
      </div>
      <div style="background:#fff;border:1px solid #e6e6e6;border-top:0;padding:22px;border-radius:0 0 8px 8px;">
        <p style="margin:0 0 16px;color:#666;font-size:13px;">Soumission reçue le <strong>${escapeHtml(now)}</strong></p>
        <table style="width:100%;border-collapse:collapse;">
          ${row("Type", payload.type)}
          ${row("Titre", payload.title)}
          ${row("Description", payload.description)}
          ${row("Entreprise", payload.company_name)}
          ${row("Contact", payload.contact_name)}
          ${row("Email", payload.contact_email)}
          ${row("Téléphone", payload.contact_phone)}
          ${row("Ville", payload.city)}
          ${row("Gouvernorat", payload.governorate)}
          ${row("Urgence", payload.urgency)}
          ${row("Budget", payload.budget)}
          ${row("Délai", payload.deadline)}
          ${row("Catégorie", payload.category)}
        </table>
        ${payload.admin_url ? `<p style="margin:22px 0 0;"><a href="${escapeHtml(payload.admin_url)}" style="display:inline-block;background:#D4AF37;color:#4A1D43;padding:10px 14px;border-radius:6px;text-decoration:none;font-weight:700;font-size:13px;">Ouvrir l'administration</a></p>` : ""}
        <p style="margin:22px 0 0;color:#999;font-size:12px;">Notification automatique. Les coordonnées restent côté serveur et ne sont pas exposées au client.</p>
      </div>
    </div>
  </body>
</html>`;
}

function validatePayload(payload: BusinessNeedNotificationPayload): string | null {
  const required: Array<keyof BusinessNeedNotificationPayload> = [
    "type",
    "title",
    "description",
    "company_name",
    "contact_name",
    "contact_email",
    "contact_phone",
    "city",
    "governorate",
    "urgency",
  ];

  const missing = required.filter((key) => !String(payload[key] ?? "").trim());
  return missing.length > 0 ? `Missing required fields: ${missing.join(", ")}` : null;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { status: 200, headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return jsonResponse({ success: false, error: "Method not allowed" }, 405);
  }

  try {
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      console.error("[notify-business-need] RESEND_API_KEY is not configured");
      return jsonResponse({ success: false, error: "Email service not configured" }, 500);
    }

    const payload = (await req.json()) as BusinessNeedNotificationPayload;
    const validationError = validatePayload(payload);
    if (validationError) {
      return jsonResponse({ success: false, error: validationError }, 400);
    }

    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [ADMIN_EMAIL],
        subject: SUBJECT,
        html: buildHtml(payload),
      }),
    });

    const responseText = await resendResponse.text();
    if (!resendResponse.ok) {
      console.error("[notify-business-need] Resend error:", resendResponse.status, responseText);
      return jsonResponse(
        { success: false, error: "Resend API error", status: resendResponse.status },
        502
      );
    }

    let result: Record<string, unknown> = {};
    try {
      result = JSON.parse(responseText);
    } catch {
      result = {};
    }

    return jsonResponse({ success: true, id: result.id ?? null });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("[notify-business-need] Unexpected error:", message);
    return jsonResponse({ success: false, error: message }, 500);
  }
});
