import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization, X-Client-Info, Apikey",
};

const ADMIN_EMAILS = ["zenanis75@hotmail.com", "contact@dalil-tounes.com"];
const FROM_EMAIL = "Dalil Tounes <notifications@dalil-tounes.com>";

interface NotifyPayload {
  type: string;
  data: Record<string, unknown>;
  admin_url?: string;
}

function formatData(data: Record<string, unknown>): string {
  return Object.entries(data)
    .filter(([, v]) => v !== null && v !== undefined && v !== "")
    .map(([k, v]) => `<tr><td style="padding:6px 12px;font-weight:600;vertical-align:top;border-bottom:1px solid #eee;">${k}</td><td style="padding:6px 12px;border-bottom:1px solid #eee;">${String(v)}</td></tr>`)
    .join("\n");
}

function buildHtml(payload: NotifyPayload): string {
  const now = new Date().toLocaleString("fr-TN", { timeZone: "Africa/Tunis" });

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:Arial,sans-serif;background:#f9f9f9;padding:20px;">
  <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:8px;overflow:hidden;border:1px solid #e0e0e0;">
    <div style="background:#1a1a2e;color:#D4AF37;padding:16px 24px;">
      <h2 style="margin:0;font-size:18px;">Dalil Tounes - ${payload.type}</h2>
    </div>
    <div style="padding:24px;">
      <p style="color:#666;margin:0 0 16px;">Soumission reçue le <strong>${now}</strong></p>
      <table style="width:100%;border-collapse:collapse;font-size:14px;">
        ${formatData(payload.data)}
      </table>
      ${payload.admin_url ? `<p style="margin:24px 0 0;"><a href="${payload.admin_url}" style="background:#D4AF37;color:#1a1a2e;padding:10px 20px;border-radius:6px;text-decoration:none;font-weight:600;">Voir dans l'admin</a></p>` : ""}
    </div>
    <div style="background:#f5f5f5;padding:12px 24px;font-size:12px;color:#999;">
      Dalil Tounes - Notification automatique
    </div>
  </div>
</body>
</html>`;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const resendKey = Deno.env.get("RESEND_API_KEY");
    if (!resendKey) {
      return new Response(
        JSON.stringify({ error: "RESEND_API_KEY not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const payload: NotifyPayload = await req.json();

    if (!payload.type || !payload.data) {
      return new Response(
        JSON.stringify({ error: "Missing 'type' or 'data' in payload" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const subject = `[Dalil Tounes] ${payload.type}`;
    const html = buildHtml(payload);

    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: ADMIN_EMAILS,
        subject,
        html,
      }),
    });

    if (!resendRes.ok) {
      const err = await resendRes.text();
      return new Response(
        JSON.stringify({ error: "Resend API error", details: err }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const result = await resendRes.json();

    return new Response(
      JSON.stringify({ success: true, id: result.id }),
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
