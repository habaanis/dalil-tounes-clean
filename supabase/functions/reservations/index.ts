import "jsr:@supabase/functions-js/edge-runtime.d.ts";

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
}

function jsonResponse(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
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
      console.error("Airtable error:", airtableRes.status, errText);
      return jsonResponse(
        {
          success: false,
          error: "Failed to save reservation",
          airtable_status: airtableRes.status,
          airtable_details: errText,
        },
        502
      );
    }

    const airtableData = await airtableRes.json();
    console.log("Airtable success:", JSON.stringify(airtableData));
    return jsonResponse({ success: true, airtable_id: airtableData?.records?.[0]?.id });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("Reservation error:", message);
    return jsonResponse({ success: false, error: message }, 500);
  }
});
