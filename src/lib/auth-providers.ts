import "server-only";

import { env, isSupabaseConfigured } from "@/lib/env";
import { canonicalOrigin } from "@/lib/site";

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

const CLIENT_ID_RE = /^[\w.-]+\.apps\.googleusercontent\.com$/;
const CLIENT_ID_TTL_MS = 60 * 60 * 1000;
let discovered: { clientId: string; at: number } | null = null;

/**
 * The Google OAuth web client id, for Google's own "Sign in with Google"
 * button (which shows our address on Google's screen instead of Supabase's).
 * The id is public. GOOGLE_CLIENT_ID wins when set; otherwise it's
 * read from Supabase's Google redirect, so it always matches the client
 * configured there. Null when neither works: the page then falls back to the
 * Supabase redirect flow.
 */
export async function googleClientId(): Promise<string | null> {
  const configured = process.env.GOOGLE_CLIENT_ID?.trim();
  if (configured) return CLIENT_ID_RE.test(configured) ? configured : null;
  if (!isSupabaseConfigured()) return null;
  if (discovered && Date.now() - discovered.at < CLIENT_ID_TTL_MS) return discovered.clientId;

  try {
    const redirectTo = encodeURIComponent(`${canonicalOrigin()}/auth/callback`);
    const res = await fetch(`${env.supabaseUrl}/auth/v1/authorize?provider=google&redirect_to=${redirectTo}`, {
      headers: { apikey: env.supabaseAnonKey },
      redirect: "manual",
      cache: "no-store",
      signal: AbortSignal.timeout(3000),
    });
    const location = res.headers.get("location");
    const clientId = location ? new URL(location).searchParams.get("client_id") : null;
    if (!clientId || !CLIENT_ID_RE.test(clientId)) return null;
    discovered = { clientId, at: Date.now() };
    return clientId;
  } catch {
    return null;
  }
}
