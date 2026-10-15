
import { createClient } from "npm:@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get("SUPABASE_URL");
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const turnstileSecret = Deno.env.get("TURNSTILE_SECRET_KEY");

const supabase =
  supabaseUrl && serviceRoleKey
    ? createClient(supabaseUrl, serviceRoleKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      })
    : null;

const allowedOrigins = new Set([
  "https://elnara-egc-glow-corner-1vmm.vercel.app",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
]);

function jsonResponse(
  body: Record<string, unknown>,
  status: number,
  headers: Record<string, string> = {},
) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  });
}

Deno.serve(async (req: Request) => {
  const origin = req.headers.get("origin");
  const corsHeaders: Record<string, string> = {};

  if (origin && allowedOrigins.has(origin)) {
    corsHeaders["Access-Control-Allow-Origin"] = origin;
    corsHeaders["Vary"] = "Origin";
  } else if (origin) {
    return jsonResponse({ error: "Origin not allowed." }, 403);
  }

  corsHeaders["Access-Control-Allow-Methods"] = "POST, OPTIONS";
  corsHeaders["Access-Control-Allow-Headers"] =
    "authorization, apikey, content-type, x-client-info";

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return jsonResponse(
      { error: "Method not allowed." },
      405,
      corsHeaders,
    );
  }

  if (!supabase || !turnstileSecret) {
  console.error("Supabase or Turnstile server configuration is missing.");

  return jsonResponse(
    { error: "Booking service is temporarily unavailable." },
    500,
    corsHeaders,
  );
}

  try {
    const body = await req.json();

    const serviceId =
      typeof body.service_id === "string" ? body.service_id.trim() : "";
    const startsAt =
      typeof body.starts_at === "string" ? body.starts_at.trim() : "";
    const customerName =
      typeof body.customer_name === "string"
        ? body.customer_name.trim()
        : "";
    const customerPhone =
      typeof body.customer_phone === "string"
        ? body.customer_phone.trim()
        : "";
    const customerEmail =
      typeof body.customer_email === "string"
        ? body.customer_email.trim()
        : "";
        const turnstileToken =
     typeof body.turnstile_token === "string"
    ? body.turnstile_token.trim()
    : "";

    if (
      !turnstileToken ||
      !serviceId ||
      !startsAt ||
      !customerName ||
      !customerPhone ||
      !customerEmail
    ) {
      return jsonResponse(
        { error: "Please complete all required fields." },
        400,
        corsHeaders,
      );
    }

    if (
      serviceId.length > 100 ||
      customerName.length > 120 ||
      customerPhone.length > 40 ||
      customerEmail.length > 254
    ) {
      return jsonResponse(
        { error: "One or more fields are too long." },
        400,
        corsHeaders,
      );
    }

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)
    ) {
      return jsonResponse(
        { error: "Please enter a valid email address." },
        400,
        corsHeaders,
      );
    }

    if (
      !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/.test(
        startsAt,
      ) ||
      !Number.isFinite(Date.parse(startsAt))
    ) {
      return jsonResponse(
        { error: "Invalid appointment date or time." },
        400,
        corsHeaders,
      );
    }


const verificationBody = new URLSearchParams({
  secret: turnstileSecret,
  response: turnstileToken,
});

const clientIp = req.headers.get("cf-connecting-ip");
if (clientIp) {
  verificationBody.set("remoteip", clientIp);
}

const verificationResponse = await fetch(
  "https://challenges.cloudflare.com/turnstile/v0/siteverify",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: verificationBody,
  },
);

if (!verificationResponse.ok) {
  return jsonResponse(
    { error: "Security verification is temporarily unavailable." },
    503,
    corsHeaders,
  );
}

      const verification = await verificationResponse.json();

      const allowedHostnames = new Set([
        "elnara-egc-glow-corner-1vmm.vercel.app",
        "localhost",
        "127.0.0.1",
      ]);

      if (
        verification.success !== true ||
        !allowedHostnames.has(verification.hostname)
      ) {
        return jsonResponse(
          { error: "Security verification failed. Please try again." },
          403,
          corsHeaders,
        );
      }


    const { data, error } = await supabase.rpc("create_appointment", {
      p_service_id: serviceId,
      p_starts_at: startsAt,
      p_customer_name: customerName,
      p_customer_phone: customerPhone,
      p_customer_email: customerEmail,
    });

    if (error) {
      console.error("Appointment creation failed:", error.message);

      const conflict =
        /no longer available|just been booked|outside business hours/i.test(
          error.message,
        );

      return jsonResponse(
        {
          error: conflict
            ? "This time slot is no longer available. Please choose another."
            : "We could not create your appointment. Please check your details and try again.",
        },
        conflict ? 409 : 400,
        corsHeaders,
      );
    }

    const appointment = Array.isArray(data) ? data[0] : data;

    if (!appointment?.appointment_id) {
      return jsonResponse(
        { error: "Booking could not be confirmed. Please try again." },
        500,
        corsHeaders,
      );
    }

    return jsonResponse(
      {
        success: true,
        appointment: {
          id: appointment.appointment_id,
          status: appointment.appointment_status,
          starts_at: appointment.appointment_starts_at,
          ends_at: appointment.appointment_ends_at,
        },
      },
      201,
      corsHeaders,
    );
  } catch (error) {
    console.error(
      "Unexpected booking request error:",
      error instanceof Error ? error.message : "Unknown error",
    );

    return jsonResponse(
      { error: "Invalid request. Please try again." },
      400,
      corsHeaders,
    );
  }
});
