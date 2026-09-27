/**
 * Who gets to run paid features, as a pure function of billing state so it can
 * be unit tested. Loading that state lives in src/lib/billing.ts.
 */

/**
 * Stripe statuses that can keep access on. past_due only does for a grace
 * period (see isEntitled) while Stripe retries the card.
 */
export const ENTITLED_STATUSES = ["active", "trialing", "past_due"] as const;

/** How long a failed renewal keeps access, counted from the start of the unpaid period. */
export const PAST_DUE_GRACE_DAYS = 14;

export type SubscriptionRow = {
  id: string;
  status: string;
  plan_interval: string | null;
  trial_end: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  cancel_at: string | null;
  canceled_at: string | null;
  created_at: string;
};

export type Access =
  | { kind: "subscribed"; subscription: SubscriptionRow; pastDue: boolean }
  | { kind: "trial"; endsAt: Date; daysLeft: number }
  | { kind: "expired"; endedAt: Date | null; hadSubscription: boolean };

const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * When the current (unpaid) period began: one interval before its end. Stripe
 * periods are calendar-anchored, so this is exact apart from month-end
 * clamping.
 */
function periodStart(sub: SubscriptionRow): Date | null {
  if (!sub.current_period_end) return null;
  const start = new Date(sub.current_period_end);
  if (sub.plan_interval === "year") start.setUTCFullYear(start.getUTCFullYear() - 1);
  else start.setUTCMonth(start.getUTCMonth() - 1);
  return start;
}

/**
 * Whether this subscription keeps paid features on. A past_due subscription
 * does for PAST_DUE_GRACE_DAYS after the failed renewal, and no longer, even
 * if Stripe is set to leave it past_due after the last retry.
 */
export function isEntitled(sub: SubscriptionRow, now: Date): boolean {
  if (!(ENTITLED_STATUSES as readonly string[]).includes(sub.status)) return false;
  if (sub.status !== "past_due") return true;
  const start = periodStart(sub);
  return !start || now.getTime() < start.getTime() + PAST_DUE_GRACE_DAYS * DAY_MS;
}

/**
 * When a subscription stopped giving access. A cancel-at-period-end
 * subscription ends at cancel_at (the period end), not canceled_at, which is
 * when the person clicked cancel. An immediate cancel ends at canceled_at.
 */
export function subscriptionEndedAt(sub: SubscriptionRow): string | null {
  if (sub.cancel_at) return sub.cancel_at;
  if (sub.cancel_at_period_end) return sub.current_period_end;
  return sub.canceled_at ?? sub.current_period_end;
}

/** Whole days left, rounded up: 6.2 days left reads as "7 days left". */
export function daysLeft(endsAt: Date, now: Date): number {
  return Math.max(0, Math.ceil((endsAt.getTime() - now.getTime()) / DAY_MS));
}

export function resolveAccess({
  subscriptions,
  trialEndsAt,
  now = new Date(),
}: {
  subscriptions: SubscriptionRow[];
  trialEndsAt: Date | null;
  now?: Date;
}): Access {
  const entitled = subscriptions
    .filter((s) => isEntitled(s, now))
    .sort((a, b) => b.created_at.localeCompare(a.created_at))[0];
  if (entitled) return { kind: "subscribed", subscription: entitled, pastDue: entitled.status === "past_due" };

  if (trialEndsAt && trialEndsAt > now) {
    return { kind: "trial", endsAt: trialEndsAt, daysLeft: daysLeft(trialEndsAt, now) };
  }

  const lastEnded = subscriptions
    .map(subscriptionEndedAt)
    .filter((d): d is string => Boolean(d))
    .sort()
    .at(-1);
  return {
    kind: "expired",
    endedAt: lastEnded ? new Date(lastEnded) : trialEndsAt,
    hadSubscription: subscriptions.length > 0,
  };
}

export function hasAccess(access: Access): boolean {
  return access.kind !== "expired";
}

/**
 * When someone subscribes during their free trial, Stripe's trial runs to the
 * end of ours so they aren't charged early. Checkout needs it at least 48h out;
 * closer than that, billing starts now.
 */
export function checkoutTrialEnd(trialEndsAt: Date | null, now = new Date()): number | undefined {
  if (!trialEndsAt) return undefined;
  const minimum = now.getTime() + 48 * 60 * 60 * 1000 + 5 * 60 * 1000;
  return trialEndsAt.getTime() >= minimum ? Math.floor(trialEndsAt.getTime() / 1000) : undefined;
}
