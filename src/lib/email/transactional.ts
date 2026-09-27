import "server-only";

import type Stripe from "stripe";

import { ENTITLED_STATUSES } from "@/lib/access";
import { planForInterval } from "@/lib/plans";
import { canonicalOrigin } from "@/lib/site";
import { invoiceSubscriptionId } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";

import { sendEmailOnce, type SendResult } from "./send";
import { receiptEmail, trialEndingEmail, welcomeEmail } from "./templates";

export async function sendWelcomeEmail({
  userId,
  email,
  name,
  trialEndsAt,
}: {
  userId: string;
  email: string | null;
  name: string | null;
  trialEndsAt: Date;
}): Promise<SendResult | null> {
  if (!email) return null;
  return sendEmailOnce({
    key: `welcome:${userId}`,
    kind: "welcome",
    userId,
    to: email,
    content: welcomeEmail({ name, trialEndsAt, siteUrl: canonicalOrigin() }),
  });
}

const REMINDER_WINDOW_MS = 48 * 60 * 60 * 1000;
const PAGE_SIZE = 500;
const ID_CHUNK = 100;

/**
 * Daily job: everyone whose free trial ends within the next 48 hours and who
 * hasn't subscribed gets one "trial ends in 2 days" email.
 */
export async function sendTrialEndingEmails(now = new Date()) {
  const admin = createAdminClient();
  const users: { id: string; email: string; trial_ends_at: string }[] = [];
  // Page past PostgREST's row cap.
  for (let from = 0; ; from += PAGE_SIZE) {
    const { data, error } = await admin
      .from("users")
      .select("id, email, trial_ends_at")
      .gt("trial_ends_at", now.toISOString())
      .lte("trial_ends_at", new Date(now.getTime() + REMINDER_WINDOW_MS).toISOString())
      .not("email", "is", null)
      .order("id")
      .range(from, from + PAGE_SIZE - 1)
      .returns<{ id: string; email: string; trial_ends_at: string }[]>();
    if (error) throw error;
    users.push(...(data ?? []));
    if (!data || data.length < PAGE_SIZE) break;
  }
  if (!users.length) return { candidates: 0, sent: 0, skipped: 0, failed: 0 };

  // In chunks, so the id list never outgrows the request URL.
  const subscribed = new Set<string>();
  for (let i = 0; i < users.length; i += ID_CHUNK) {
    const { data: subs, error: subsError } = await admin
      .from("subscriptions")
      .select("user_id")
      .in("user_id", users.slice(i, i + ID_CHUNK).map((u) => u.id))
      .in("status", [...ENTITLED_STATUSES]);
    if (subsError) throw subsError;
    for (const sub of subs ?? []) subscribed.add(sub.user_id as string);
  }

  const tally = { candidates: users.length, sent: 0, skipped: 0, failed: 0 };
  for (const user of users) {
    if (subscribed.has(user.id)) {
      tally.skipped++;
      continue;
    }
    const result = await sendEmailOnce({
      key: `trial_ending:${user.id}`,
      kind: "trial_ending",
      userId: user.id,
      to: user.email,
      content: trialEndingEmail({ trialEndsAt: new Date(user.trial_ends_at), siteUrl: canonicalOrigin(), now }),
    });
    if (result.status === "failed") tally.failed++;
    else if (result.status === "skipped_duplicate") tally.skipped++;
    else tally.sent++;
  }
  return tally;
}

/** Receipt for a paid subscription invoice. $0 invoices (trial starts) get none. */
export async function sendReceiptEmail(invoice: Stripe.Invoice, userId: string): Promise<SendResult | null> {
  if (!invoice.id || invoice.amount_paid <= 0) return null;
  const admin = createAdminClient();
  const { data: user } = await admin.from("users").select("email").eq("id", userId).maybeSingle<{ email: string | null }>();
  const to = invoice.customer_email ?? user?.email;
  if (!to) return null;

  const subscriptionId = invoiceSubscriptionId(invoice);
  const { data: sub } = subscriptionId
    ? await admin
        .from("subscriptions")
        .select("plan_interval, current_period_end")
        .eq("id", subscriptionId)
        .maybeSingle<{ plan_interval: string | null; current_period_end: string | null }>()
    : { data: null };

  return sendEmailOnce({
    key: `receipt:${invoice.id}`,
    kind: "receipt",
    userId,
    to,
    content: receiptEmail({
      amountCents: invoice.amount_paid,
      currency: invoice.currency,
      plan: planForInterval(sub?.plan_interval),
      paidAt: new Date((invoice.status_transitions?.paid_at ?? invoice.created) * 1000),
      invoiceNumber: invoice.number,
      invoiceUrl: invoice.hosted_invoice_url ?? null,
      renewsAt: sub?.current_period_end ? new Date(sub.current_period_end) : null,
      siteUrl: canonicalOrigin(),
    }),
  });
}
