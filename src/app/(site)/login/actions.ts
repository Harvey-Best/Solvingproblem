"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";

import { rotateAnonId } from "@/lib/claim";
import { LOGIN_NONCE_COOKIE, loginNonceCookieOptions } from "@/lib/cookies";
import { env } from "@/lib/env";
import { onSignedIn } from "@/lib/onboarding";
import { createClient } from "@/lib/supabase/server";
import { safeNextPath } from "@/lib/utils";

export type LoginState =
  | { step: "email"; error?: string; email?: string }
  | { step: "code"; email: string; error?: string };

const emailSchema = z.string().trim().toLowerCase().pipe(z.email());

export async function sendMagicLink(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const email = emailSchema.safeParse(formData.get("email"));
  const next = safeNextPath(formData.get("next")?.toString());
  if (!email.success) {
    return { step: "email", error: "That doesn't look like an email address." };
  }

  // Send the link back to whichever deployment the user is on (prod, preview,
  // localhost). Supabase only honors origins on its redirect allowlist.
  const origin = (await headers()).get("origin") || env.siteUrl;
  // Ties the emailed link to this browser, so the callback knows whether it's
  // safe to attach this browser's anonymous work to the account.
  const nonce = crypto.randomUUID();
  (await cookies()).set(LOGIN_NONCE_COOKIE, nonce, loginNonceCookieOptions);
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    email: email.data,
    options: {
      shouldCreateUser: true,
      emailRedirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}&n=${nonce}`,
    },
  });
  if (error) {
    console.error("signInWithOtp failed", error);
    const message = error.status === 429
      ? "Too many attempts. Wait a minute and try again."
      : "We couldn't send the email. Please try again.";
    return { step: "email", email: email.data, error: message };
  }
  return { step: "code", email: email.data };
}

export async function verifyEmailCode(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const email = emailSchema.safeParse(formData.get("email"));
  const token = formData.get("code")?.toString().replace(/\D/g, "") ?? "";
  const next = safeNextPath(formData.get("next")?.toString());
  if (!email.success) return { step: "email", error: "Please enter your email again." };
  if (token.length < 6) {
    return { step: "code", email: email.data, error: "Enter the code from the email." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.verifyOtp({ email: email.data, token, type: "email" });
  if (error || !data.user) {
    return { step: "code", email: email.data, error: "That code didn't work. It may have expired." };
  }

  // The code was typed into this browser, so its anonymous work is theirs.
  await onSignedIn(data.user.id, { claimWork: true });
  redirect(next);
}

/**
 * Finishes Google's own "Sign in with Google" button: the browser hands us the
 * ID token Google issued for this site, plus the nonce it asked Google to
 * embed (so a token lifted from elsewhere can't be replayed). Server actions
 * only run for same-origin posts, and the token came from a Google popup in
 * this browser, so this browser's anonymous work is safe to claim.
 */
export async function signInWithGoogleCredential(
  credential: string,
  nonce: string,
  nextPath: string
): Promise<{ redirectTo: string } | { error: string }> {
  const failed = { error: "Google sign-in didn't work. Please try again, or use email." };
  if (typeof credential !== "string" || credential.length > 8192 || typeof nonce !== "string" || nonce.length > 256) {
    return failed;
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithIdToken({ provider: "google", token: credential, nonce });
  if (error || !data.user) {
    console.error("signInWithIdToken failed", error?.message);
    return failed;
  }

  await onSignedIn(data.user.id, { claimWork: true });
  return { redirectTo: safeNextPath(nextPath) };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  // Whoever uses this device next starts clean, and can't have their
  // anonymous work claimed by this account on its next sign-in.
  await rotateAnonId();
  redirect("/");
}
