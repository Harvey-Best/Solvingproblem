import "server-only";

import type { Access } from "@/lib/access";
import { accessAllowsPaidFeatures, getAccess } from "@/lib/billing";
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
/** Fair-use backstop for signed-in users (trial or paid), both kinds combined. */
export const USER_PER_DAY = 25;
/** Follow-up answers allowed on one diagnosis. */
export const FOLLOW_UPS_PER_DIAGNOSIS = { anonymous: 2, signedIn: 6 };

export type DenyReason = "signup_required" | "subscription_required" | "rate_limited";

/** `access` is set for signed-in viewers, so pages can show trial status without a second lookup. */
export type Allowance =
  | { allowed: true; access?: Access }
  | { allowed: false; reason: DenyReason; access?: Access };

const DAY_MS = 24 * 60 * 60 * 1000;
// In-flight runs count too. Runs can take up to maxDuration (300s), plus slack.
const PENDING_WINDOW_MS = 6 * 60 * 1000;

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
    const access = await getAccess(viewer.userId);
    if (!accessAllowsPaidFeatures(access)) return { allowed: false, reason: "subscription_required", access };
    const used = await countBothKinds({ userId: viewer.userId, since });
    return used >= USER_PER_DAY ? { allowed: false, reason: "rate_limited", access } : { allowed: true, access };
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

/**
 * Checks the allowance and, if allowed, inserts the run's pending row in the
 * same database transaction (see reserve_run), so parallel requests can't all
 * slip under the limit. checkAllowance is the read-only version for pages.
 */
export async function reserveRun(
  kind: RunKind,
  viewer: Viewer,
  ipHash: string | null
): Promise<({ allowed: true; id: string } | { allowed: false; reason: DenyReason }) & { access?: Access }> {
  let access: Access | undefined;
  if (viewer.userId) {
    access = await getAccess(viewer.userId);
    if (!accessAllowsPaidFeatures(access)) return { allowed: false, reason: "subscription_required", access };
  }

  const { data, error } = await createAdminClient().rpc("reserve_run", {
    p_kind: kind,
    p_user_id: viewer.userId,
    p_anon_id: viewer.userId ? null : viewer.anonId,
    p_ip_hash: viewer.userId ? null : ipHash,
    p_user_per_day: USER_PER_DAY,
    p_anon_free: ANON_FREE_PER_KIND,
    p_ip_per_day: ANON_PER_IP_PER_DAY,
    p_pending_seconds: PENDING_WINDOW_MS / 1000,
  });
  if (error) throw error;
  const result = data as { id?: string; denied?: DenyReason };
  if (result.denied) return { allowed: false, reason: result.denied, access };
  if (!result.id) throw new Error("reserve_run returned no id");
  return { allowed: true, id: result.id, access };
}

/** API error for a denied run. 402 tells the client to send the viewer to the plans. */
export const DENY_RESPONSES: Record<RunKind, Record<DenyReason, { status: number; message: string }>> = {
  diagnosis: {
    signup_required: { status: 401, message: "Create a free account to run another diagnosis." },
    subscription_required: { status: 402, message: "Your free trial has ended. Choose a plan to keep diagnosing." },
    rate_limited: { status: 429, message: "You've hit today's limit. Please try again tomorrow." },
  },
  quote: {
    signup_required: { status: 401, message: "Create a free account to check another quote." },
    subscription_required: { status: 402, message: "Your free trial has ended. Choose a plan to keep checking quotes." },
    rate_limited: { status: 429, message: "You've hit today's limit. Please try again tomorrow." },
  },
};
