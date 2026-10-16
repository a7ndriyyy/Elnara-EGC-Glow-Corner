import { createClient } from "npm:@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
const turnstileSecret = Deno.env.get("TURNSTILE_SECRET_KEY");
const appUrl = Deno.env.get("PUBLIC_APP_URL");
const depositPercent = Number(Deno.env.get("STRIPE_DEPOSIT_PERCENT") || "");

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const allowedOrigins = new Set([
  "https://elnara-egc-glow-corner-1vmm.vercel.app",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
]);

function respond(body: Record<string, unknown>, status: number, headers: Record<string, string>) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...headers },
  });
}

Deno.serve(async (req: Request) => {
  const origin = req.headers.get("origin");
  const cors: Record<string, string> = {
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "authorization, apikey, content-type, x-client-info",
    "Vary": "Origin",
  };

  if (origin && !allowedOrigins.has(origin)) return respond({ error: "Origin not allowed." }, 403, cors);
  if (origin) cors["Access-Control-Allow-Origin"] = origin;
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
  if (req.method !== "POST") return respond({ error: "Method not allowed." }, 405, cors);

  if (!stripeSecretKey || !turnstileSecret || !appUrl || !Number.isInteger(depositPercent) || depositPercent < 1 || depositPercent > 100) {
    console.error("Stripe checkout server configuration is incomplete.");
    return respond({ error: "Online deposit payments are not configured yet." }, 503, cors);
  }

  let holdId: string | null = null;
  try {
    const body = await req.json();
    const serviceId = typeof body.service_id === "string" ? body.service_id.trim() : "";
    const startsAt = typeof body.starts_at === "string" ? body.starts_at.trim() : "";
    const customerName = typeof body.customer_name === "string" ? body.customer_name.trim() : "";
    const customerPhone = typeof body.customer_phone === "string" ? body.customer_phone.trim() : "";
    const customerEmail = typeof body.customer_email === "string" ? body.customer_email.trim() : "";
    const turnstileToken = typeof body.turnstile_token === "string" ? body.turnstile_token.trim() : "";

    if (!serviceId || !startsAt || !customerName || !customerPhone || !customerEmail || !turnstileToken) {
      return respond({ error: "Please complete all required fields." }, 400, cors);
    }
    if (customerName.length > 120 || customerPhone.length > 40 || customerEmail.length > 254 ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail) ||
        !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/.test(startsAt) ||
        !Number.isFinite(Date.parse(startsAt))) {
      return respond({ error: "Please check your contact details and appointment time." }, 400, cors);
    }

    const verificationResponse = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret: turnstileSecret, response: turnstileToken }),
    });
    if (!verificationResponse.ok) return respond({ error: "Security verification is temporarily unavailable." }, 503, cors);
    const verification = await verificationResponse.json();
    const allowedHostnames = new Set(["elnara-egc-glow-corner-1vmm.vercel.app", "localhost", "127.0.0.1"]);
    if (verification.success !== true || !allowedHostnames.has(verification.hostname)) {
      return respond({ error: "Security verification failed. Please try again." }, 403, cors);
    }

    const { data: service, error: serviceError } = await supabase
      .from("services")
      .select("id, name, price_eur, is_active")
      .eq("id", serviceId)
      .eq("is_active", true)
      .maybeSingle();
    if (serviceError || !service || service.price_eur == null || Number(service.price_eur) <= 0) {
      return respond({ error: "This service is not available for online payment." }, 400, cors);
    }

    const fullPriceCents = Math.round(Number(service.price_eur) * 100);
    const depositCents = Math.round(fullPriceCents * depositPercent / 100);
    if (!Number.isSafeInteger(depositCents) || depositCents < 50) {
      return respond({ error: "The deposit amount is not configured correctly." }, 400, cors);
    }

    const { data: hold, error: holdError } = await supabase.rpc("create_booking_payment_hold", {
      p_service_id: serviceId,
      p_starts_at: startsAt,
      p_customer_name: customerName,
      p_customer_phone: customerPhone,
      p_customer_email: customerEmail,
      p_amount_total_cents: depositCents,
    }).maybeSingle();

    if (holdError || !hold?.hold_id) {
      console.error("Could not reserve appointment slot for checkout:", holdError?.message);
      return respond({ error: "This time slot is no longer available. Please choose another." }, 409, cors);
    }
    holdId = hold.hold_id;

    const successUrl = `${appUrl.replace(/\/$/, "")}/#/booking?payment=processing&session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${appUrl.replace(/\/$/, "")}/#/booking?payment=cancelled`;
    const stripeParams = new URLSearchParams();
    stripeParams.set("mode", "payment");
    stripeParams.set("success_url", successUrl);
    stripeParams.set("cancel_url", cancelUrl);
    stripeParams.set("customer_email", customerEmail);
    stripeParams.set("client_reference_id", holdId);
    stripeParams.set("expires_at", String(Math.floor(Date.now() / 1000) + 30 * 60));
    stripeParams.set("metadata[hold_id]", holdId);
    stripeParams.set("line_items[0][quantity]", "1");
    stripeParams.set("line_items[0][price_data][currency]", "eur");
    stripeParams.set("line_items[0][price_data][unit_amount]", String(depositCents));
    stripeParams.set("line_items[0][price_data][product_data][name]", `Deposit — ${service.name}`);
    stripeParams.set("line_items[0][price_data][product_data][description]", `${depositPercent}% deposit for appointment; total service price €${Number(service.price_eur).toFixed(2)}`);

    const stripeResponse = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${stripeSecretKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
        "Idempotency-Key": `elnara-checkout-${holdId}`,
      },
      body: stripeParams,
    });
    const session = await stripeResponse.json();
    if (!stripeResponse.ok || !session?.id || !session?.url) {
      console.error("Stripe Checkout session creation failed:", session?.error?.type || stripeResponse.status);
      await supabase.rpc("release_booking_payment_hold", { p_hold_id: holdId });
      return respond({ error: "We could not start the payment. Please try again." }, 502, cors);
    }

    const { error: updateError } = await supabase
      .from("booking_payment_holds")
      .update({ stripe_session_id: session.id })
      .eq("id", holdId)
      .eq("status", "pending");
    if (updateError) {
      console.error("Could not link Stripe session to booking hold:", updateError.message);
      await supabase.rpc("release_booking_payment_hold", { p_hold_id: holdId });
      await fetch(`https://api.stripe.com/v1/checkout/sessions/${session.id}/expire`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${stripeSecretKey}` },
      });
      return respond({ error: "We could not start the payment. Please try again." }, 500, cors);
    }

    return respond({ checkout_url: session.url }, 200, cors);
  } catch (error) {
    if (holdId) await supabase.rpc("release_booking_payment_hold", { p_hold_id: holdId });
    console.error("Unexpected checkout error:", error instanceof Error ? error.message : "Unknown error");
    return respond({ error: "Unable to start checkout. Please try again." }, 400, cors);
  }
});
