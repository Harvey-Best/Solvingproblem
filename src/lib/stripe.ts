import "server-only";

import Stripe from "stripe";

import { env } from "@/lib/env";
import type { PlanId } from "@/lib/plans";

let client: Stripe | null = null;

/** Pinned to the SDK's API version, so upgrades are explicit (bump the package). */
export function getStripe(): Stripe {
  client ??= new Stripe(env.stripeSecretKey, {
    appInfo: { name: "Home Doctor" },
    maxNetworkRetries: 2,
  });
  return client;
}

export function priceIdFor(plan: PlanId): string {
  return plan === "yearly" ? env.stripePriceYearly : env.stripePriceMonthly;
}

/** Billing period end moved from the subscription to its items in newer API versions. */
export function subscriptionPeriodEnd(sub: Stripe.Subscription): number | null {
  const ends = sub.items.data.map((item) => item.current_period_end).filter((n): n is number => typeof n === "number");
  return ends.length ? Math.max(...ends) : null;
}

export function toIso(unixSeconds: number | null | undefined): string | null {
  return typeof unixSeconds === "number" ? new Date(unixSeconds * 1000).toISOString() : null;
}

/** The subscription an invoice belongs to (moved under invoice.parent in newer API versions). */
export function invoiceSubscriptionId(invoice: Stripe.Invoice): string | null {
  const sub = invoice.parent?.subscription_details?.subscription;
  if (!sub) return null;
  return typeof sub === "string" ? sub : sub.id;
}
