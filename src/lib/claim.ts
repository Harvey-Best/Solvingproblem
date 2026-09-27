import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";
import { getAttribution, getViewer } from "@/lib/viewer";

/**
 * Called right after sign-in: attaches anything the visitor did anonymously
 * (keyed by the hd_anon cookie) to their account, and records first-touch
 * attribution on the user row if it isn't set yet.
 */
export async function claimAnonymousWork(userId: string) {
  const [{ anonId }, attribution] = await Promise.all([getViewer(), getAttribution()]);
  const admin = createAdminClient();

  const jobs: PromiseLike<unknown>[] = [];
  if (anonId) {
    jobs.push(
      admin.from("diagnoses").update({ user_id: userId }).eq("anon_id", anonId).is("user_id", null),
      admin.from("quote_checks").update({ user_id: userId }).eq("anon_id", anonId).is("user_id", null)
    );
  }
  if (attribution) {
    jobs.push(admin.from("users").update({ utm: attribution }).eq("id", userId).is("utm", null));
  }

  const results = await Promise.all(jobs);
  for (const result of results) {
    const error = (result as { error?: unknown }).error;
    if (error) console.error("claimAnonymousWork failed", error);
  }
}
