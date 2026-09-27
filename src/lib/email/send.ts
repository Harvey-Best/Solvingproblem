import "server-only";

import { env } from "@/lib/env";
import { createAdminClient } from "@/lib/supabase/admin";

export type EmailContent = { subject: string; html: string; text: string };

export type SendResult = { status: "sent" | "skipped_duplicate" | "logged_only" | "failed"; error?: string };

/**
 * Sends a transactional email at most once per `key` (e.g. "receipt:in_123").
 * The key is claimed in email_log before sending and released if the send
 * fails, so a retry (webhook redelivery, next cron run) can try again.
 */
export async function sendEmailOnce({
  key,
  kind,
  userId,
  to,
  content,
}: {
  key: string;
  kind: "welcome" | "trial_ending" | "receipt";
  userId: string | null;
  to: string;
  content: EmailContent;
}): Promise<SendResult> {
  const admin = createAdminClient();
  const { error: claimError } = await admin.from("email_log").insert({ key, kind, user_id: userId, to_email: to });
  if (claimError) {
    if (claimError.code === "23505") return { status: "skipped_duplicate" };
    console.error("email_log claim failed", { key, error: claimError.message });
    return { status: "failed", error: claimError.message };
  }

  const apiKey = env.resendApiKey;
  if (!apiKey) {
    console.info(JSON.stringify({ email: kind, key, to, subject: content.subject, note: "RESEND_API_KEY unset; not sent" }));
    return { status: "logged_only" };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "Idempotency-Key": key,
      },
      body: JSON.stringify({
        from: env.emailFrom,
        to: [to],
        subject: content.subject,
        html: content.html,
        text: content.text,
        tags: [{ name: "kind", value: kind }],
      }),
    });
    const body = (await res.json().catch(() => ({}))) as { id?: string; message?: string };
    if (!res.ok) throw new Error(body.message ?? `Resend responded ${res.status}`);
    await admin.from("email_log").update({ provider_id: body.id ?? null }).eq("key", key);
    return { status: "sent" };
  } catch (err) {
    const message = (err as Error).message;
    console.error("email send failed", { key, error: message });
    await admin.from("email_log").delete().eq("key", key);
    return { status: "failed", error: message };
  }
}
