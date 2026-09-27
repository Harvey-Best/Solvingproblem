import "server-only";

import { randomBytes } from "node:crypto";
import { cache } from "react";

import type { Diagnosis } from "@/lib/ai/schema";
import { getThread } from "@/lib/diagnoses";
import {
  DIY_VERDICT_META,
  SEVERITY_META,
  type Confidence,
  type DiyVerdict,
  type Hazard,
  type ModelCategoryId,
  type Severity,
} from "@/lib/diagnosis-meta";
import { createAdminClient } from "@/lib/supabase/admin";
import { latestDiagnosis, toExchanges } from "@/lib/thread";
import { formatUsdRange } from "@/lib/utils";

/**
 * Share links: the owner of a diagnosis can publish a read-only summary at
 * /s/<shareId>, with share images at /og/share/<shareId>. Anyone with the link
 * can see it, so the public side only ever gets toPublicDiagnosis(): never
 * photos, the homeowner's own words, follow-up answers, or who owns it.
 */

/** 16 random bytes (128 bits) as base64url: 22 URL-safe characters, unguessable. */
export const SHARE_ID_BYTES = 16;
const SHARE_ID_RE = /^[A-Za-z0-9_-]{22}$/;

export function newShareId(): string {
  return randomBytes(SHARE_ID_BYTES).toString("base64url");
}

export function isShareId(value: unknown): value is string {
  return typeof value === "string" && SHARE_ID_RE.test(value);
}

export type ShareCardFormat = "wide" | "square";

export const sharePath = (shareId: string) => `/s/${shareId}`;

/** Wide (1200x630) is the link preview; square (1080x1080) is for Instagram and stories. */
export const shareCardPath = (shareId: string, format: ShareCardFormat = "wide") =>
  `/og/share/${shareId}${format === "square" ? "?format=square" : ""}`;

/** What the result page's share button needs: the page link and the square image. */
export type ShareLink = { url: string; imageUrl: string };

export function shareLink(shareId: string, origin?: string): ShareLink {
  const path = sharePath(shareId);
  return { url: origin ? new URL(path, origin).toString() : path, imageUrl: shareCardPath(shareId, "square") };
}

/** The only diagnosis fields a share link ever exposes. */
export type PublicDiagnosis = {
  title: string;
  category: ModelCategoryId;
  severity: Severity;
  likely_cause: string;
  confidence: Confidence;
  diy_verdict: DiyVerdict;
  /** Empty when the verdict is "call a pro". */
  time_estimate: string;
  pro_cost_range: { low: number; high: number; note: string };
  /** How many parts the fix needs and what they cost together. */
  parts: { count: number; low: number; high: number };
  /** Hazard types only. The warning text stays with the owner. */
  hazards: Hazard[];
};

/**
 * Pure projection from the model output to what a share link shows. It picks
 * fields one by one (never spreads), so nothing new leaks when the schema grows.
 */
export function toPublicDiagnosis(d: Diagnosis): PublicDiagnosis {
  const parts = d.parts ?? [];
  return {
    title: d.title,
    category: d.category,
    severity: d.severity,
    likely_cause: d.likely_cause,
    confidence: d.confidence,
    diy_verdict: d.diy_verdict,
    time_estimate: d.diy_verdict === "call_pro" ? "" : d.time_estimate.trim(),
    pro_cost_range: { low: d.pro_cost_range.low, high: d.pro_cost_range.high, note: d.pro_cost_range.note },
    parts: {
      count: parts.length,
      low: parts.reduce((sum, p) => sum + p.price_low, 0),
      high: parts.reduce((sum, p) => sum + p.price_high, 0),
    },
    hazards: [...new Set((d.safety_warnings ?? []).map((w) => w.hazard))],
  };
}

/** "30-45 minutes" → "30–45 min", for chips and cards. */
export function shortTimeEstimate(time: string): string {
  return time
    .trim()
    .replace(/(\d)\s*(?:-|–|to)\s*(\d)/g, "$1–$2")
    .replace(/\bminutes?\b/gi, "min")
    .replace(/\bmins\b/gi, "min");
}

/** One-line summary for link previews and the page description. */
export function shareDescription(d: PublicDiagnosis): string {
  const time = shortTimeEstimate(d.time_estimate);
  const verdict =
    d.diy_verdict === "call_pro"
      ? "Best left to a pro"
      : `${DIY_VERDICT_META[d.diy_verdict].label}${time ? `, about ${time}` : ""}`;
  const price = formatUsdRange(d.pro_cost_range.low, d.pro_cost_range.high);
  return `${SEVERITY_META[d.severity].label}. ${verdict}. A pro typically charges ${price}. Diagnosed from a photo with Home Doctor.`;
}

export type SharedDiagnosis = { shareId: string; diagnosis: PublicDiagnosis };

/**
 * The public side of a share link: the latest version of the diagnosis
 * (after any follow-ups), projected. Null when the id is unknown or revoked.
 * Cached per request so the page and its metadata share one lookup.
 */
export const getSharedDiagnosis = cache(async (shareId: string): Promise<SharedDiagnosis | null> => {
  if (!isShareId(shareId)) return null;
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("diagnoses")
    .select("id, status, result_json")
    .eq("share_id", shareId)
    .maybeSingle<{ id: string; status: string; result_json: Diagnosis | null }>();
  if (error) throw error;
  if (!data || data.status !== "complete" || !data.result_json) return null;
  const current = latestDiagnosis(data.result_json, toExchanges(await getThread(data.id)));
  return { shareId, diagnosis: toPublicDiagnosis(current) };
});

// Owner side. Callers check ownership (getDiagnosisForViewer) first.

async function readShareId(diagnosisId: string): Promise<string | null> {
  const { data, error } = await createAdminClient()
    .from("diagnoses")
    .select("share_id")
    .eq("id", diagnosisId)
    .maybeSingle<{ share_id: string | null }>();
  if (error) throw error;
  return data?.share_id ?? null;
}

/**
 * The diagnosis's current share id, or null. Never throws, so the result page
 * still renders if sharing is unavailable (e.g. before the migration runs).
 */
export async function getShareId(diagnosisId: string): Promise<string | null> {
  try {
    return await readShareId(diagnosisId);
  } catch (err) {
    console.error("share id lookup failed", { diagnosisId, error: (err as Error).message });
    return null;
  }
}

/** Returns the existing share id, or creates one. Safe against double taps. */
export async function ensureShareId(diagnosisId: string): Promise<string> {
  const existing = await readShareId(diagnosisId);
  if (existing) return existing;
  const { data, error } = await createAdminClient()
    .from("diagnoses")
    .update({ share_id: newShareId(), shared_at: new Date().toISOString() })
    .eq("id", diagnosisId)
    .is("share_id", null)
    .select("share_id")
    .maybeSingle<{ share_id: string }>();
  if (error) throw error;
  if (data?.share_id) return data.share_id;
  // Another request shared it between our read and write: use that link.
  const winner = await readShareId(diagnosisId);
  if (!winner) throw new Error("Share link was not created");
  return winner;
}

/** Stop sharing: the link and its images stop working (images after the CDN cache expires). */
export async function revokeShareId(diagnosisId: string): Promise<void> {
  const { error } = await createAdminClient()
    .from("diagnoses")
    .update({ share_id: null, shared_at: null })
    .eq("id", diagnosisId);
  if (error) throw error;
}
