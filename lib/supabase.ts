import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Like lib/stripe.ts: never instantiate at module scope — read the env vars
// when the handler actually runs.
export function getServiceClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY are not set"
    );
  }
  return createClient(url, key, { auth: { persistSession: false } });
}
