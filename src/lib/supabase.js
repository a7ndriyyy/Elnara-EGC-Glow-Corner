import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseKey);

// Without the keys (e.g. a Vercel project whose Environment Variables are not
// set) the site must still open: every Supabase call then fails with a clear
// error that the pages already handle, instead of crashing the whole app at load.
const missingConfig = () => {
  throw new Error('Supabase configuration is missing (VITE_SUPABASE_URL / VITE_SUPABASE_PUBLISHABLE_KEY).');
};
const notConfigured = new Proxy({}, { get: () => new Proxy(missingConfig, { get: () => missingConfig }) });

if (!isSupabaseConfigured) {
  console.error('Supabase configuration is missing. Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY.');
}

export const supabase = isSupabaseConfigured ? createClient(supabaseUrl, supabaseKey) : notConfigured;
