/**
 * Plans and trial terms as shown to people. Pure data, safe in client
 * components. The Stripe price ids live in env (STRIPE_PRICE_MONTHLY /
 * STRIPE_PRICE_YEARLY) and must match these amounts.
 */

export const TRIAL_DAYS = 7;

export const PLAN_IDS = ["monthly", "yearly"] as const;
export type PlanId = (typeof PLAN_IDS)[number];

export type Plan = {
  id: PlanId;
  label: string;
  /** USD, what Stripe charges per interval. */
  price: number;
  interval: "month" | "year";
  /** Short price line, e.g. "$9.99/month". */
  priceLabel: string;
  note: string;
};

export const PLANS: Record<PlanId, Plan> = {
  monthly: {
    id: "monthly",
    label: "Monthly",
    price: 9.99,
    interval: "month",
    priceLabel: "$9.99/month",
    note: "Cancel anytime.",
  },
  yearly: {
    id: "yearly",
    label: "Yearly",
    price: 69.99,
    interval: "year",
    priceLabel: "$69.99/year",
    note: "About $5.83 a month. Save 41%.",
  },
};

/** Percent saved on yearly versus 12 months of monthly, rounded down. */
export function yearlySavingsPercent(): number {
  return Math.floor((1 - PLANS.yearly.price / (PLANS.monthly.price * 12)) * 100);
}

export function planForInterval(interval: string | null | undefined): Plan | null {
  if (interval === "month") return PLANS.monthly;
  if (interval === "year") return PLANS.yearly;
  return null;
}

export const PLAN_FEATURES = [
  "Photo diagnoses for anything in the house",
  "Quote checks before you sign",
  "Follow-up questions that sharpen the answer",
  "Parts lists with prices, and fair pro price ranges",
  "Your full history, saved",
];
