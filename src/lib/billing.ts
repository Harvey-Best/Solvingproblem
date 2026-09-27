import "server-only";

import type Stripe from "stripe";

import { resolveAccess, type Access, type SubscriptionRow } from "@/lib/access";
import { isBillingConfigured } from "@/lib/env";
import { TRIAL_DAYS } from "@/lib/plans";
import { getStripe, subscriptionPeriodEnd, toIso } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";

const DAY_MS = 24 * 60 * 60 * 1000;

export type TrialStart = { started: true; endsAt: Date; email: string | null; fullName: string | null } | { started: false };

/**
 * Starts the free trial the first time it's called for a user; later calls do
 * nothing. The conditional update makes it safe to call from every sign-in
 * path at once: exactly one caller gets `started: true`.
 */
export async function startTrialIfNew(userId: string, now = new Date()): Promise<TrialStart> {
  const endsAt = new Date(now.getTime() + TRIAL_DAYS * DAY_MS);
  const { data, error } = await createAdminClient()
    .from("users")
    .update({ trial_started_at: now.toISOString(), trial_ends_at: endsAt.toISOString() })
    .eq("id", userId)
    .is("trial_started_at", null)
    .select("email, full_name");
  if (error) throw error;
  if (!data?.length) return { started: false };
  return { started: true, endsAt, email: data[0].email, fullName: data[0].full_name };
}

const SUBSCRIPTION_COLUMNS =
  "id, status, plan_interval, trial_end, current_period_end, cancel_at_period_end, cancel_at, canceled_at, created_at";

/** Billing state for a signed-in user. Starts the trial if it somehow never started. */
export async function getAccess(userId: string): Promise<Access> {
  const admin = createAdminClient();
  const [userRes, subsRes] = await Promise.all([
    admin.from("users").select("trial_ends_at").eq("id", userId).maybeSingle<{ trial_ends_at: string | null }>(),
    admin.from("subscriptions").select(SUBSCRIPTION_COLUMNS).eq("user_id", userId).returns<SubscriptionRow[]>(),
  ]);
  if (userRes.error) throw userRes.error;
  if (subsRes.error) throw subsRes.error;

  let trialEndsAt = userRes.data?.trial_ends_at ? new Date(userRes.data.trial_ends_at) : null;
  if (userRes.data && !trialEndsAt) {
    const trial = await startTrialIfNew(userId);
    if (trial.started) trialEndsAt = trial.endsAt;
  }
  return resolveAccess({ subscriptions: subsRes.data ?? [], trialEndsAt });
}

/** Paid features are open when the user has access, or when billing isn't set up yet. */
export function accessAllowsPaidFeatures(access: Access): boolean {
  return access.kind !== "expired" || !isBillingConfigured();
}

/** The user's Stripe customer, created on first checkout. */
export async function getOrCreateCustomer(userId: string, email: string | null): Promise<string> {
  const admin = createAdminClient();
  const { data: user, error } = await admin
    .from("users")
    .select("stripe_customer_id")
    .eq("id", userId)
    .single<{ stripe_customer_id: string | null }>();
  if (error) throw error;
  if (user.stripe_customer_id) return user.stripe_customer_id;

  const customer = await getStripe().customers.create(
    { email: email ?? undefined, metadata: { user_id: userId } },
    // Two quick taps create one customer, not two.
    { idempotencyKey: `customer-${userId}` }
  );
  const { data: saved } = await admin
    .from("users")
    .update({ stripe_customer_id: customer.id })
    .eq("id", userId)
    .is("stripe_customer_id", null)
    .select("stripe_customer_id");
  if (saved?.length) return customer.id;

  // Another request saved one first; use that.
  const { data: again } = await admin.from("users").select("stripe_customer_id").eq("id", userId).single();
  return again?.stripe_customer_id ?? customer.id;
}

async function userIdForSubscription(sub: Stripe.Subscription): Promise<string | null> {
  if (sub.metadata?.user_id) return sub.metadata.user_id;
  const customerId = typeof sub.customer === "string" ? sub.customer : sub.customer.id;
  const { data } = await createAdminClient()
    .from("users")
    .select("id")
    .eq("stripe_customer_id", customerId)
    .maybeSingle<{ id: string }>();
  return data?.id ?? null;
}

/**
 * Mirrors a Stripe subscription into public.subscriptions. Always pass a
 * freshly retrieved subscription: webhook events can arrive out of order.
 */
export async function syncSubscription(sub: Stripe.Subscription): Promise<{ userId: string } | null> {
  const userId = await userIdForSubscription(sub);
  if (!userId) {
    console.error("syncSubscription: no user for subscription", sub.id);
    return null;
  }
  const item = sub.items.data[0];
  const customerId = typeof sub.customer === "string" ? sub.customer : sub.customer.id;
  const { error } = await createAdminClient()
    .from("subscriptions")
    .upsert({
      id: sub.id,
      user_id: userId,
      stripe_customer_id: customerId,
      status: sub.status,
      price_id: item?.price.id ?? null,
      plan_interval: item?.price.recurring?.interval ?? null,
      trial_end: toIso(sub.trial_end),
      current_period_end: toIso(subscriptionPeriodEnd(sub)),
      cancel_at_period_end: sub.cancel_at_period_end,
      cancel_at: toIso(sub.cancel_at),
      canceled_at: toIso(sub.canceled_at),
    });
  if (error) throw error;
  return { userId };
}

export async function getStripeCustomerId(userId: string): Promise<string | null> {
  const { data } = await createAdminClient()
    .from("users")
    .select("stripe_customer_id")
    .eq("id", userId)
    .maybeSingle<{ stripe_customer_id: string | null }>();
  return data?.stripe_customer_id ?? null;
}
