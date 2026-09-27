import "server-only";

import { createHash } from "node:crypto";
import { cookies, headers } from "next/headers";

import { ANON_COOKIE, UTM_COOKIE, anonCookieOptions } from "@/lib/cookies";
import { env, isSupabaseConfigured } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";
import { parseAttributionCookie, type Attribution } from "@/lib/utm";
import { isUuid } from "@/lib/utils";

export type Viewer = {
  userId: string | null;
  email: string | null;
  anonId: string | null;
};

/** Who is making this request: the signed-in user (if any) and their anon cookie. */
export async function getViewer(): Promise<Viewer> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(ANON_COOKIE)?.value;
  const anonId = isUuid(raw) ? raw : null;

  let userId: string | null = null;
  let email: string | null = null;
  if (isSupabaseConfigured()) {
    // getClaims verifies the JWT locally (asymmetric signing keys), so this
    // doesn't cost a round trip to Supabase Auth on every page render.
    const supabase = await createClient();
    const { data } = await supabase.auth.getClaims();
    if (data?.claims?.sub) {
      userId = data.claims.sub;
      email = typeof data.claims.email === "string" ? data.claims.email : null;
    }
  }
  return { userId, email, anonId };
}

/**
 * Like getViewer, but guarantees an anon id (route handlers / server actions
 * only, since it may need to set a cookie). The proxy normally sets it first.
 */
export async function getViewerForWrite(): Promise<Viewer & { anonId: string }> {
  const viewer = await getViewer();
  if (viewer.anonId) return viewer as Viewer & { anonId: string };
  const anonId = crypto.randomUUID();
  const cookieStore = await cookies();
  cookieStore.set(ANON_COOKIE, anonId, anonCookieOptions);
  return { ...viewer, anonId };
}

export async function getAttribution(): Promise<Attribution | null> {
  const cookieStore = await cookies();
  return parseAttributionCookie(cookieStore.get(UTM_COOKIE)?.value);
}

/** Salted hash of the caller's IP, used only for anonymous abuse limits. */
export async function getIpHash(): Promise<string | null> {
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip");
  if (!ip) return null;
  return createHash("sha256").update(`${env.anonIdSalt}:${ip}`).digest("hex").slice(0, 32);
}
