import "server-only";

import { env, isSupabaseConfigured } from "@/lib/env";

/**
 * Whether Google sign-in is switched on in Supabase (Authentication →
 * Providers). Read from Supabase's public auth settings and cached for five
 * minutes, so the button appears on its own once the provider is enabled and
 * never leads to an "Unsupported provider" error page before that.
 */
export async function isGoogleSignInEnabled(): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  try {
    const res = await fetch(`${env.supabaseUrl}/auth/v1/settings`, {
      headers: { apikey: env.supabaseAnonKey },
      cache: "force-cache",
      next: { revalidate: 300 },
      signal: AbortSignal.timeout(3000),
    });
    if (!res.ok) return false;
    const settings = (await res.json()) as { external?: Record<string, boolean> };
    return settings.external?.google === true;
  } catch {
    return false;
  }
}
