import "server-only";

import type { QuoteCheck } from "@/lib/ai/quote-schema";
import { canViewDiagnosis } from "@/lib/diagnoses";
import { createAdminClient } from "@/lib/supabase/admin";
import { isUuid } from "@/lib/utils";
import type { Viewer } from "@/lib/viewer";

export type QuoteCheckRecord = {
  id: string;
  user_id: string | null;
  anon_id: string | null;
  status: "pending" | "complete" | "failed";
  description: string | null;
  image_paths: string[];
  result_json: QuoteCheck | null;
  created_at: string;
};

/** Loads a quote check if (and only if) the current viewer owns it. */
export async function getQuoteCheckForViewer(id: string, viewer: Viewer) {
  if (!isUuid(id)) return null;
  const { data, error } = await createAdminClient()
    .from("quote_checks")
    .select("id, user_id, anon_id, status, description, image_paths, result_json, created_at")
    .eq("id", id)
    .maybeSingle<QuoteCheckRecord>();
  if (error) throw error;
  if (!data || !canViewDiagnosis(data, viewer)) return null;
  return data;
}
