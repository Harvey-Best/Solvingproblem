import "server-only";

import type { Diagnosis } from "@/lib/ai/schema";
import { createAdminClient, UPLOADS_BUCKET } from "@/lib/supabase/admin";
import type { ThreadMessage } from "@/lib/thread";
import { isUuid } from "@/lib/utils";
import type { Viewer } from "@/lib/viewer";

export type DiagnosisRecord = {
  id: string;
  user_id: string | null;
  anon_id: string | null;
  status: "pending" | "complete" | "failed";
  category: string | null;
  description: string | null;
  image_paths: string[];
  result_json: Diagnosis | null;
  created_at: string;
};

export function canViewDiagnosis(
  row: Pick<DiagnosisRecord, "user_id" | "anon_id">,
  viewer: Pick<Viewer, "userId" | "anonId">
) {
  if (row.user_id) return row.user_id === viewer.userId;
  return Boolean(row.anon_id && row.anon_id === viewer.anonId);
}

/** Loads a diagnosis if (and only if) the current viewer owns it. */
export async function getDiagnosisForViewer(id: string, viewer: Viewer) {
  if (!isUuid(id)) return null;
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("diagnoses")
    .select("id, user_id, anon_id, status, category, description, image_paths, result_json, created_at")
    .eq("id", id)
    .maybeSingle<DiagnosisRecord>();
  if (error) throw error;
  if (!data || !canViewDiagnosis(data, viewer)) return null;
  return data;
}

/** Short-lived signed URLs for photos in the private bucket. */
export async function signImageUrls(paths: string[], expiresIn = 60 * 60): Promise<string[]> {
  if (paths.length === 0) return [];
  const admin = createAdminClient();
  const { data, error } = await admin.storage.from(UPLOADS_BUCKET).createSignedUrls(paths, expiresIn);
  if (error || !data) {
    console.error("createSignedUrls failed", error);
    return [];
  }
  return data.map((d) => d.signedUrl).filter((u): u is string => Boolean(u));
}

export async function getThread(diagnosisId: string): Promise<ThreadMessage[]> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from("diagnosis_messages")
    .select("id, role, content, result_json, error, created_at")
    .eq("diagnosis_id", diagnosisId)
    .order("created_at", { ascending: true })
    .returns<ThreadMessage[]>();
  if (error) throw error;
  return data ?? [];
}
