import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";
import type { Viewer } from "@/lib/viewer";

/** The two paid-for model runs. Follow-ups are capped per diagnosis instead. */
export type RunKind = "diagnosis" | "quote";

const TABLE = { diagnosis: "diagnoses", quote: "quote_checks" } as const;

/** Anonymous visitors get one free diagnosis and one free quote check. */
export const ANON_FREE_PER_KIND = 1;
/**
 * Backstop against people clearing cookies (both kinds combined). Kept
 * generous because mobile carriers put many real users behind one IP (CGNAT).
 */
export const ANON_PER_IP_PER_DAY = 5;
/** Cost backstop for signed-in users until the paywall lands (Phase 3). Both kinds combined. */
export const USER_PER_DAY = 25;
/** Follow-up answers allowed on one diagnosis. */
export const FOLLOW_UPS_PER_DIAGNOSIS = { anonymous: 2, signedIn: 6 };

export type Allowance =
  | { allowed: true }
  | { allowed: false; reason: "signup_required" | "rate_limited" };

const DAY_MS = 24 * 60 * 60 * 1000;
// In-flight requests count too, so two fast taps can't both use the free one.
const PENDING_WINDOW_MS = 3 * 60 * 1000;

type Filter = { userId?: string; anonId?: string; ipHash?: string; since?: string };

async function countRuns(table: (typeof TABLE)[RunKind], filter: Filter) {
  const pendingSince = new Date(Date.now() - PENDING_WINDOW_MS).toISOString();
  let query = createAdminClient()
    .from(table)
    .select("id", { count: "exact", head: true })
    .or(`status.eq.complete,and(status.eq.pending,created_at.gte.${pendingSince})`);
  if (filter.userId) query = query.eq("user_id", filter.userId);
  if (filter.anonId) query = query.eq("anon_id", filter.anonId);
  if (filter.ipHash) query = query.is("user_id", null).eq("ip_hash", filter.ipHash);
  if (filter.since) query = query.gte("created_at", filter.since);
  const { count, error } = await query;
  if (error) throw error;
  return count ?? 0;
}

async function countBothKinds(filter: Filter) {
  const [diagnoses, quotes] = await Promise.all([
    countRuns(TABLE.diagnosis, filter),
    countRuns(TABLE.quote, filter),
  ]);
  return diagnoses + quotes;
}

export async function checkAllowance(kind: RunKind, viewer: Viewer, ipHash: string | null): Promise<Allowance> {
  const since = new Date(Date.now() - DAY_MS).toISOString();

  if (viewer.userId) {
    const used = await countBothKinds({ userId: viewer.userId, since });
    return used >= USER_PER_DAY ? { allowed: false, reason: "rate_limited" } : { allowed: true };
  }

  if (viewer.anonId) {
    const used = await countRuns(TABLE[kind], { anonId: viewer.anonId });
    if (used >= ANON_FREE_PER_KIND) return { allowed: false, reason: "signup_required" };
  }

  if (ipHash) {
    const used = await countBothKinds({ ipHash, since });
    if (used >= ANON_PER_IP_PER_DAY) return { allowed: false, reason: "signup_required" };
  }

  return { allowed: true };
}
