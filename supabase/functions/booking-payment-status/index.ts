import { createClient } from "npm:@supabase/supabase-js@2";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  { auth: { autoRefreshToken: false, persistSession: false } },
);

const allowedOrigins = new Set([
  "https://elnara-egc-glow-corner-1vmm.vercel.app",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
]);

Deno.serve(async (req: Request) => {
  const origin = req.headers.get("origin");
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "authorization, apikey, content-type, x-client-info",
    "Vary": "Origin",
  };
  if (origin && !allowedOrigins.has(origin)) {
    return new Response(JSON.stringify({ error: "Origin not allowed." }), { status: 403, headers });
  }
  if (origin) headers["Access-Control-Allow-Origin"] = origin;
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers });
  if (req.method !== "POST") return new Response(JSON.stringify({ error: "Method not allowed." }), { status: 405, headers });

  try {
    const body = await req.json();
    const sessionId = typeof body.session_id === "string" ? body.session_id.trim() : "";
    if (!/^cs_test_[A-Za-z0-9]+$/.test(sessionId)) {
      return new Response(JSON.stringify({ error: "Invalid test checkout session." }), { status: 400, headers });
    }
    const { data, error } = await supabase
      .from("booking_payment_holds")
      .select("status")
      .eq("stripe_session_id", sessionId)
      .maybeSingle();
    if (error) throw error;
    if (!data) return new Response(JSON.stringify({ status: "unknown" }), { status: 200, headers });
    return new Response(JSON.stringify({
      status: data.status === "paid" ? "paid" : data.status === "pending" || data.status === "processing" ? "pending" : "not_paid",
    }), { status: 200, headers });
  } catch (error) {
    console.error("Payment status lookup failed:", error instanceof Error ? error.message : "Unknown error");
    return new Response(JSON.stringify({ error: "Unable to check payment status." }), { status: 500, headers });
  }
});
