import { createClient } from "@supabase/supabase-js";

/**
 * Create a Supabase admin client with service role key.
 * Bypasses RLS - use ONLY for server-side admin operations.
 * NEVER expose this client to the browser.
 */
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    // During build (e.g. generateStaticParams), env vars may not be available.
    // Return a client pointed at a placeholder URL so callers that handle
    // errors gracefully (returning [] or null) can proceed without crashing
    // the entire build.
    return createClient("https://placeholder.supabase.co", "placeholder", {
      auth: { autoRefreshToken: false, persistSession: false },
    });
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
