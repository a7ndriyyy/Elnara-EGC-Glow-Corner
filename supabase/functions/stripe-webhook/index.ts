import { createClient } from "npm:@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return result === 0;
}

function hex(bytes: Uint8Array): string {
  return Array.from(bytes, (value) => value.toString(16).padStart(2, "0")).join("");
}

async function verifyStripeSignature(rawBody: string, header: string, secret: string): Promise<boolean> {
  const parts = header.split(",").map((item) => item.trim());
  const timestamp = parts.find((item) => item.startsWith("t="))?.slice(2);
  const signatures = parts.filter((item) => item.startsWith("v1=")).map((item) => item.slice(3));
  if (!timestamp || !/^\d+$/.test(timestamp) || signatures.length === 0) return false;
  if (Math.abs(Date.now() / 1000 - Number(timestamp)) > 300) return false;

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const digest = new Uint8Array(await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(`${timestamp}.${rawBody}`),
  ));
  const expected = hex(digest);
  return signatures.some((signature) => constantTimeEqual(signature, expected));
}

Deno.serve(async (req: Request) => {
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });
  if (!stripeSecretKey || !stripeSecretKey.startsWith("sk_test_") || !webhookSecret) {
    console.error("Stripe webhook server configuration is incomplete.");
    return new Response("Webhook not configured", { status: 503 });
  }

  const rawBody = await req.text();
  const signature = req.headers.get("stripe-signature") || "";
  if (!(await verifyStripeSignature(rawBody, signature, webhookSecret))) {
    return new Response("Invalid Stripe signature", { status: 400 });
  }

  try {
    const event = JSON.parse(rawBody);
    if (event.type === "checkout.session.expired") {
      const session = event.data?.object;
      const holdId = session?.metadata?.hold_id;
      if (typeof holdId === "string") {
        await supabase.rpc("release_booking_payment_hold", { p_hold_id: holdId });
      }
      return new Response(JSON.stringify({ received: true }), {
        status: 200, headers: { "Content-Type": "application/json" },
      });
    }

    if (event.type !== "checkout.session.completed") {
      return new Response(JSON.stringify({ received: true, ignored: true }), {
        status: 200, headers: { "Content-Type": "application/json" },
      });
    }

    const session = event.data?.object;
    const holdId = session?.metadata?.hold_id;
    if (session?.payment_status !== "paid" || typeof holdId !== "string" ||
        typeof session.id !== "string" || !Number.isInteger(session.amount_total) ||
        session.currency !== "eur") {
      return new Response("Invalid or unpaid checkout session", { status: 400 });
    }

    const { data: hold, error: holdError } = await supabase
      .from("booking_payment_holds")
      .select("id, amount_total_cents, currency, stripe_session_id, status")
      .eq("id", holdId)
      .maybeSingle();

    if (holdError) {
      console.error("Could not load payment hold:", holdError.message);
      return new Response("Temporary database error", { status: 500 });
    }
    if (!hold || hold.stripe_session_id !== session.id ||
        hold.amount_total_cents !== session.amount_total || hold.currency !== session.currency) {
      console.error("Stripe session did not match the expected payment hold.");
      return new Response("Payment details do not match", { status: 400 });
    }

    const paymentIntentId = typeof session.payment_intent === "string" ? session.payment_intent : "";
    const { error: completeError } = await supabase.rpc("complete_paid_booking", {
      p_hold_id: holdId,
      p_stripe_session_id: session.id,
      p_payment_intent_id: paymentIntentId,
    });
    if (completeError) {
      console.error("Paid booking finalization failed:", completeError.message);
      return new Response("Could not finalize paid booking", { status: 500 });
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200, headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Stripe webhook processing error:", error instanceof Error ? error.message : "Unknown error");
    return new Response("Invalid webhook event", { status: 400 });
  }
});
