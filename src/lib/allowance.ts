import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";
import type { Viewer } from "@/lib/viewer";

/** Anonymous visitors get this many diagnoses before we ask them to sign up. */
export const ANON_FREE_DIAGNOSES = 1;
/**
 * Backstop against people clearing cookies. Kept generous because mobile
 * carriers put many real users behind one IP (CGNAT).
 */
export const ANON_PER_IP_PER_DAY = 5;
/** Cost backstop for signed-in users until the paywall lands (Phase 3). */
export const USER_PER_DAY = 25;

export type Allowance =
  | { allowed: true }
  | { allowed: false; reason: "signup_required" | "rate_limited" };

const DAY_MS = 24 * 60 * 60 * 1000;
// In-flight requests count too, so two fast taps can't both use the free one.
const PENDING_WINDOW_MS = 3 * 60 * 1000;

export async function checkDiagnosisAllowance(
  viewer: Viewer,
  ipHash: string | null
): Promise<Allowance> {
  const admin = createAdminClient();
  const since = new Date(Date.now() - DAY_MS).toISOString();
  const pendingSince = new Date(Date.now() - PENDING_WINDOW_MS).toISOString();
  const countedStatus = `status.eq.complete,and(status.eq.pending,created_at.gte.${pendingSince})`;

  if (viewer.userId) {
    const { count, error } = await admin
      .from("diagnoses")
      .select("id", { count: "exact", head: true })
      .eq("user_id", viewer.userId)
      .gte("created_at", since)
      .or(countedStatus);
    if (error) throw error;
    return (count ?? 0) >= USER_PER_DAY ? { allowed: false, reason: "rate_limited" } : { allowed: true };
  }

  if (viewer.anonId) {
    const { count, error } = await admin
      .from("diagnoses")
      .select("id", { count: "exact", head: true })
      .eq("anon_id", viewer.anonId)
      .or(countedStatus);
    if (error) throw error;
    if ((count ?? 0) >= ANON_FREE_DIAGNOSES) return { allowed: false, reason: "signup_required" };
  }

  if (ipHash) {
    const { count, error } = await admin
      .from("diagnoses")
      .select("id", { count: "exact", head: true })
      .is("user_id", null)
      .eq("ip_hash", ipHash)
      .gte("created_at", since)
      .or(countedStatus);
    if (error) throw error;
    if ((count ?? 0) >= ANON_PER_IP_PER_DAY) return { allowed: false, reason: "signup_required" };
  }

  return { allowed: true };
}
