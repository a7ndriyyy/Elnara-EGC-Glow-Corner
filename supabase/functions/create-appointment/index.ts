// Direct appointment creation is intentionally disabled for the deposit flow.
// Public booking must go through create-checkout-session. A signed Stripe webhook
// finalizes paid bookings through the private complete_paid_booking RPC.
const allowedOrigins = new Set([
  "https://elnara-egc-glow-corner-1vmm.vercel.app",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
]);

Deno.serve((req: Request) => {
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
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed." }), { status: 405, headers });
  }

  return new Response(JSON.stringify({
    success: false,
    error: "Online appointments now require a deposit. Please start a secure checkout from the booking page.",
  }), { status: 410, headers });
});
