import "server-only";

import { createClient } from "@supabase/supabase-js";

import { env } from "@/lib/env";

/**
 * Service-role client. Bypasses RLS, so every caller must do its own ownership
 * checks. Never import this from client code.
 */
export function createAdminClient() {
  return createClient(env.supabaseUrl, env.supabaseServiceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export const UPLOADS_BUCKET = "uploads";
