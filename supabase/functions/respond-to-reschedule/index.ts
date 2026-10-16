import { createClient } from "npm:@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get("SUPABASE_URL");
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const supabase = supabaseUrl && serviceRoleKey
  ? createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    })
  : null;

const allowedOrigins = new Set([
  "https://elnara-egc-glow-corner-1vmm.vercel.app",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
]);

function jsonResponse(body: Record<string, unknown>, status: number, headers: Record<string, string> = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json", ...headers },
  });
}

async function sha256(value: string) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
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
  corsHeaders["Access-Control-Allow-Headers"] = "authorization, apikey, content-type, x-client-info";

  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: corsHeaders });
  if (req.method !== "POST") return jsonResponse({ error: "Method not allowed." }, 405, corsHeaders);
  if (!supabase) return jsonResponse({ error: "Rescheduling service is temporarily unavailable." }, 500, corsHeaders);

  try {
    const body = await req.json();
    const token = typeof body.token === "string" ? body.token.trim() : "";
    const action = typeof body.action === "string" ? body.action.trim() : "";

    if (!/^[0-9a-f]{64}$/i.test(token) || !["accept", "reject"].includes(action)) {
      return jsonResponse({ error: "Invalid proposal link or response." }, 400, corsHeaders);
    }

    const tokenHash = await sha256(token.toLowerCase());
    const { data, error } = await supabase.rpc("respond_to_reschedule_proposal", {
      p_token_hash: tokenHash,
      p_action: action,
    });

    if (error) {
      console.error("Reschedule response failed:", error.message);
      return jsonResponse({ error: "We could not process this response. Please contact the practitioner." }, 400, corsHeaders);
    }

    const result = typeof data === "object" && data !== null ? data : {};
    return jsonResponse({ success: true, status: result.status }, 200, corsHeaders);
  } catch (error) {
    console.error("Unexpected reschedule response error:", error instanceof Error ? error.message : "Unknown error");
    return jsonResponse({ error: "Invalid request. Please try again." }, 400, corsHeaders);
  }
});
