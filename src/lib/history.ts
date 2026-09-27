import "server-only";

import type { PriceAssessment } from "@/lib/ai/quote-schema";
import type { Severity } from "@/lib/diagnosis-meta";
import { createAdminClient, UPLOADS_BUCKET } from "@/lib/supabase/admin";

export type HistoryItem =
  | {
      kind: "diagnosis";
      id: string;
      title: string;
      category: string | null;
      severity: Severity | null;
      createdAt: string;
      thumbUrl: string | null;
    }
  | {
      kind: "quote";
      id: string;
      title: string;
      priceAssessment: PriceAssessment | null;
      createdAt: string;
      thumbUrl: string | null;
    };

const LIMIT = 50;

/** A signed-in user's finished diagnoses and quote checks, newest first. */
export async function listHistory(userId: string): Promise<HistoryItem[]> {
  const admin = createAdminClient();
  const [diagnoses, quotes] = await Promise.all([
    admin
      .from("diagnoses")
      .select("id, title, category, severity, image_paths, created_at")
      .eq("user_id", userId)
      .eq("status", "complete")
      .order("created_at", { ascending: false })
      .limit(LIMIT),
    admin
      .from("quote_checks")
      .select("id, title, image_paths, created_at, price_assessment:result_json->>price_assessment")
      .eq("user_id", userId)
      .eq("status", "complete")
      .order("created_at", { ascending: false })
      .limit(LIMIT),
  ]);
  if (diagnoses.error) throw diagnoses.error;
  if (quotes.error) throw quotes.error;

  // One batch of short-lived signed URLs for the first photo of each item.
  const firstPaths = [...(diagnoses.data ?? []), ...(quotes.data ?? [])]
    .map((row) => (row.image_paths as string[])[0])
    .filter(Boolean);
  const thumbs = new Map<string, string>();
  if (firstPaths.length) {
    const { data } = await admin.storage.from(UPLOADS_BUCKET).createSignedUrls(firstPaths, 60 * 60);
    data?.forEach((d) => d.path && d.signedUrl && thumbs.set(d.path, d.signedUrl));
  }
  const thumbFor = (paths: string[]) => (paths[0] ? (thumbs.get(paths[0]) ?? null) : null);

  const items: HistoryItem[] = [
    ...(diagnoses.data ?? []).map((d) => ({
      kind: "diagnosis" as const,
      id: d.id as string,
      title: (d.title as string | null) ?? "Diagnosis",
      category: d.category as string | null,
      severity: d.severity as Severity | null,
      createdAt: d.created_at as string,
      thumbUrl: thumbFor(d.image_paths as string[]),
    })),
    ...(quotes.data ?? []).map((q) => ({
      kind: "quote" as const,
      id: q.id as string,
      title: (q.title as string | null) ?? "Quote check",
      priceAssessment: (q.price_assessment as PriceAssessment | null) ?? null,
      createdAt: q.created_at as string,
      thumbUrl: thumbFor(q.image_paths as string[]),
    })),
  ];
  return items.sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, LIMIT);
}
