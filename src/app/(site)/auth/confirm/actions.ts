"use server";

import type { EmailOtpType } from "@supabase/supabase-js";
import { redirect } from "next/navigation";

import { onSignedIn } from "@/lib/onboarding";
import { createClient } from "@/lib/supabase/server";
import { safeNextPath } from "@/lib/utils";

const OTP_TYPES: EmailOtpType[] = ["email", "magiclink", "signup"];

/**
 * Finishes a magic-link sign-in that was opened outside the browser that
 * asked for it. Server actions only run for same-origin posts, so another site
 * can't submit this for someone. Anonymous work in this browser is left alone,
 * because nothing proves this browser belongs to the account's owner.
 */
export async function confirmSignIn(formData: FormData) {
  const tokenHash = formData.get("token_hash")?.toString() ?? "";
  const type = formData.get("type")?.toString() as EmailOtpType;
  const next = safeNextPath(formData.get("next")?.toString());
  const failed = `/login?error=link&next=${encodeURIComponent(next)}`;
  if (!tokenHash || !OTP_TYPES.includes(type)) redirect(failed);

  const supabase = await createClient();
  const { data, error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type });
  if (error || !data.user) {
    if (error) console.error("verifyOtp failed", error.message);
    redirect(failed);
  }

  await onSignedIn(data.user.id, { claimWork: false });
  redirect(next);
}
