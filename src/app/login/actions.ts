"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { claimAnonymousWork } from "@/lib/claim";
import { env } from "@/lib/env";
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

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    email: email.data,
    options: {
      shouldCreateUser: true,
      emailRedirectTo: `${env.siteUrl}/auth/callback?next=${encodeURIComponent(next)}`,
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

  await claimAnonymousWork(data.user.id);
  redirect(next);
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
