/**
 * Who gets to run paid features, as a pure function of billing state so it can
 * be unit tested. Loading that state lives in src/lib/billing.ts.
 */

/** Stripe statuses that keep access on. past_due keeps it while Stripe retries the card. */
export const ENTITLED_STATUSES = ["active", "trialing", "past_due"] as const;

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
    .filter((s) => (ENTITLED_STATUSES as readonly string[]).includes(s.status))
    .sort((a, b) => b.created_at.localeCompare(a.created_at))[0];
  if (entitled) return { kind: "subscribed", subscription: entitled, pastDue: entitled.status === "past_due" };

  if (trialEndsAt && trialEndsAt > now) {
    return { kind: "trial", endsAt: trialEndsAt, daysLeft: daysLeft(trialEndsAt, now) };
  }

  const lastEnded = subscriptions
    .map((s) => s.canceled_at ?? s.current_period_end)
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
