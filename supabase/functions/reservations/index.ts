import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ReservationPayload {
  business_id: string;
  business_name: string;
  business_email?: string;
  business_phone?: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  requested_date: string;
  requested_time: string;
  message?: string;
  source?: string;
  idempotency_key?: string;
}

function jsonResponse(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildEmailHtml(p: ReservationPayload): string {
  return `
<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;background:#fafafa;border:1px solid #e0e0e0;border-radius:8px;">
  <div style="text-align:center;padding-bottom:16px;border-bottom:2px solid #D4AF37;">
    <h2 style="color:#1a1a1a;margin:0;">Nouvelle demande de r&eacute;servation</h2>
    <p style="color:#666;font-size:13px;margin:4px 0 0;">via Dalil Tounes</p>
  </div>
  <table style="width:100%;margin-top:20px;border-collapse:collapse;">
    <tr><td style="padding:8px 4px;color:#888;font-size:13px;width:140px;">Entreprise</td><td style="padding:8px 4px;font-size:14px;font-weight:600;">${escapeHtml(p.business_name)}</td></tr>
    <tr style="background:#f5f5f5;"><td style="padding:8px 4px;color:#888;font-size:13px;">Client</td><td style="padding:8px 4px;font-size:14px;font-weight:600;">${escapeHtml(p.customer_name)}</td></tr>
    <tr><td style="padding:8px 4px;color:#888;font-size:13px;">T&eacute;l&eacute;phone</td><td style="padding:8px 4px;font-size:14px;"><a href="tel:${escapeHtml(p.customer_phone)}" style="color:#D4AF37;text-decoration:none;">${escapeHtml(p.customer_phone)}</a></td></tr>
    <tr style="background:#f5f5f5;"><td style="padding:8px 4px;color:#888;font-size:13px;">Email client</td><td style="padding:8px 4px;font-size:14px;">${p.customer_email ? escapeHtml(p.customer_email) : "Non renseign&eacute;"}</td></tr>
    <tr><td style="padding:8px 4px;color:#888;font-size:13px;">Date souhait&eacute;e</td><td style="padding:8px 4px;font-size:14px;font-weight:600;">${escapeHtml(p.requested_date)}</td></tr>
    <tr style="background:#f5f5f5;"><td style="padding:8px 4px;color:#888;font-size:13px;">Heure souhait&eacute;e</td><td style="padding:8px 4px;font-size:14px;font-weight:600;">${escapeHtml(p.requested_time)}</td></tr>
  </table>
  ${p.message ? `
  <div style="margin-top:16px;padding:12px;background:#fff;border:1px solid #eee;border-radius:6px;">
    <p style="color:#888;font-size:12px;margin:0 0 6px;">Message :</p>
    <p style="color:#333;font-size:14px;margin:0;white-space:pre-wrap;">${escapeHtml(p.message)}</p>
  </div>` : ""}
  <div style="margin-top:20px;padding:12px;background:#fffbeb;border:1px solid #f5e6a3;border-radius:6px;">
    <p style="color:#92400e;font-size:13px;margin:0;">Merci de contacter directement le client pour confirmer la r&eacute;servation.<br/>
    Nous conseillons au client de vous t&eacute;l&eacute;phoner 24h avant pour confirmer sa venue.</p>
  </div>
  <p style="color:#aaa;font-size:11px;text-align:center;margin-top:24px;">Dalil Tounes &mdash; L'annuaire de la Tunisie</p>
</div>`;
}

async function sendEmailNotification(
  payload: ReservationPayload
): Promise<{ sent: boolean; error?: string; recipients?: string[] }> {
  const resendApiKey = Deno.env.get("RESEND_API_KEY");
  if (!resendApiKey) {
    console.warn("[Email] RESEND_API_KEY not configured, skipping email");
    return { sent: false, error: "RESEND_API_KEY not configured" };
  }

  const recipients: string[] = ["contact@dalil-tounes.com"];
  if (payload.business_email?.trim()) {
    recipients.push(payload.business_email.trim());
  }

  console.log("[Email] recipients:", recipients);

  const subject = `Nouvelle demande de reservation via Dalil Tounes - ${payload.business_name}`;
  const html = buildEmailHtml(payload);

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Dalil Tounes <onboarding@resend.dev>",
        to: recipients,
        subject,
        html,
      }),
    });

    const responseText = await res.text();
    console.log("[Email] response status:", res.status);
    console.log("[Email] response body:", responseText);

    if (!res.ok) {
      console.error("[Email] Resend error:", res.status, responseText);
      return { sent: false, error: `Resend ${res.status}: ${responseText}`, recipients };
    }

    let data;
    try {
      data = JSON.parse(responseText);
    } catch {
      data = {};
    }
    console.log("[Email] Sent successfully to:", recipients.join(", "), "id:", data.id);
    return { sent: true, recipients };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[Email] Exception:", msg);
    return { sent: false, error: msg, recipients };
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { status: 200, headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return jsonResponse({ success: false, error: "Method not allowed" }, 405);
  }

  try {
    const airtableToken = Deno.env.get("AIRTABLE_TOKEN");
    const airtableBaseId = Deno.env.get("AIRTABLE_BASE_ID");
    const airtableTable = "Reservations";

    if (!airtableToken || !airtableBaseId) {
      return jsonResponse(
        { success: false, error: "Airtable configuration missing" },
        500
      );
    }

    const payload: ReservationPayload = await req.json();

    if (
      !payload.business_id ||
      !payload.business_name ||
      !payload.customer_name ||
      !payload.customer_phone ||
      !payload.requested_date ||
      !payload.requested_time
    ) {
      return jsonResponse(
        { success: false, error: "Missing required fields" },
        400
      );
    }

    const idempotencyKey = payload.idempotency_key || null;

    // --- Supabase insert (with idempotency check) ---
    let supabaseOk = false;
    let supabaseDuplicate = false;
    try {
      const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
      const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
      const sb = createClient(supabaseUrl, supabaseServiceKey);

      if (idempotencyKey) {
        const { data: existing } = await sb
          .from("reservations")
          .select("id")
          .eq("idempotency_key", idempotencyKey)
          .limit(1);

        if (existing && existing.length > 0) {
          console.log("[Supabase] Duplicate idempotency_key, skipping insert:", idempotencyKey);
          supabaseOk = true;
          supabaseDuplicate = true;
        }
      }

      if (!supabaseDuplicate) {
        const { error: dbError } = await sb.from("reservations").insert({
          business_id: payload.business_id,
          business_name: payload.business_name,
          business_email: payload.business_email || null,
          business_phone: payload.business_phone || null,
          customer_name: payload.customer_name,
          customer_phone: payload.customer_phone,
          customer_email: payload.customer_email || null,
          requested_date: payload.requested_date,
          requested_time: payload.requested_time,
          message: payload.message || null,
          source: payload.source || "business_detail",
          status: "new",
          idempotency_key: idempotencyKey,
        });

        if (dbError) {
          console.error("[Supabase] insert error:", dbError.message);
        } else {
          console.log("[Supabase] insert OK");
          supabaseOk = true;
        }
      }
    } catch (err) {
      console.error("[Supabase] exception:", err instanceof Error ? err.message : err);
    }

    // --- Airtable insert (skip if duplicate) ---
    let airtableOk = false;
    let airtableId: string | null = null;

    if (supabaseDuplicate) {
      console.log("[Airtable] Skipped (duplicate idempotency_key)");
      airtableOk = true;
    } else {
      const airtableUrl = `https://api.airtable.com/v0/${airtableBaseId}/${encodeURIComponent(airtableTable)}`;

      const airtableRes = await fetch(airtableUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${airtableToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          records: [
            {
              fields: {
                "Business ID": payload.business_id,
                "Business Name": payload.business_name,
                "Business Email": payload.business_email || "",
                "Business Phone / WhatsApp": payload.business_phone || "",
                "Customer Name": payload.customer_name,
                "Customer Phone": payload.customer_phone,
                "Customer Email": payload.customer_email || "",
                "Requested Date": payload.requested_date,
                "Requested Time": payload.requested_time,
                "Message": payload.message || "",
                "Status": "New",
                "Source": payload.source || "business_detail",
              },
            },
          ],
        }),
      });

      if (!airtableRes.ok) {
        const errText = await airtableRes.text();
        console.error("[Airtable] error:", airtableRes.status, errText);
      } else {
        const airtableData = await airtableRes.json();
        airtableId = airtableData?.records?.[0]?.id || null;
        console.log("[Airtable] success, id:", airtableId);
        airtableOk = true;
      }
    }

    // --- Email notification (never blocks the response) ---
    const emailResult = await sendEmailNotification(payload);
    console.log("[Email] Result:", JSON.stringify(emailResult));

    return jsonResponse({
      success: airtableOk || supabaseOk,
      duplicate: supabaseDuplicate,
      airtable_id: airtableId,
      supabase_ok: supabaseOk,
      email_sent: emailResult.sent,
      email_error: emailResult.error || null,
      email_recipients: emailResult.recipients || [],
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[Reservation] error:", message);
    return jsonResponse({ success: false, error: message }, 500);
  }
});
