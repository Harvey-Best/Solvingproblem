import "server-only";

import { cookies } from "next/headers";

import { ANON_COOKIE, anonCookieOptions } from "@/lib/cookies";
import { createAdminClient } from "@/lib/supabase/admin";
import { getAttribution, getViewer } from "@/lib/viewer";

/**
 * Called right after sign-in. Records first-touch attribution on the user
 * row if it isn't set yet, and, when `claimWork` is set, attaches anything
 * the visitor did anonymously (keyed by the hd_anon cookie) to the account.
 *
 * Only claim when the sign-in provably started in this browser (the email
 * code, Google's PKCE flow, or a magic link carrying this browser's nonce).
 * Otherwise someone could send a victim their own sign-in link and pull the
 * victim's anonymous diagnoses into their account.
 *
 * After claiming, the anon id is replaced so later anonymous use on this
 * device can't be claimed by this account again.
 */
export async function claimAnonymousWork(userId: string, { claimWork }: { claimWork: boolean }) {
  const [{ anonId }, attribution] = await Promise.all([getViewer(), getAttribution()]);
  const admin = createAdminClient();

  const jobs: PromiseLike<unknown>[] = [];
  if (anonId && claimWork) {
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
  if (anonId && claimWork) await rotateAnonId();
}

/** Starts a fresh anonymous identity for this browser (after a claim, and on sign-out). */
export async function rotateAnonId() {
  const cookieStore = await cookies();
  cookieStore.set(ANON_COOKIE, crypto.randomUUID(), anonCookieOptions);
}
