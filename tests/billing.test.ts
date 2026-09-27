import { describe, expect, it } from "vitest";

import { checkoutTrialEnd, daysLeft, hasAccess, resolveAccess, type SubscriptionRow } from "@/lib/access";
import { receiptEmail, trialEndingEmail, welcomeEmail } from "@/lib/email/templates";
import { PLANS, planForInterval, yearlySavingsPercent } from "@/lib/plans";

const NOW = new Date("2026-10-01T12:00:00Z");
const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;

function sub(overrides: Partial<SubscriptionRow>): SubscriptionRow {
  return {
    id: "sub_1",
    status: "active",
    plan_interval: "month",
    trial_end: null,
    current_period_end: "2026-10-20T00:00:00Z",
    cancel_at_period_end: false,
    cancel_at: null,
    canceled_at: null,
    created_at: "2026-09-20T00:00:00Z",
    ...overrides,
  };
}

describe("resolveAccess", () => {
  it("gives access to active, Stripe-trialing and past-due subscriptions", () => {
    for (const status of ["active", "trialing", "past_due"]) {
      const access = resolveAccess({ subscriptions: [sub({ status })], trialEndsAt: null, now: NOW });
      expect(access.kind, status).toBe("subscribed");
      expect(hasAccess(access)).toBe(true);
    }
    const pastDue = resolveAccess({ subscriptions: [sub({ status: "past_due" })], trialEndsAt: null, now: NOW });
    expect(pastDue.kind === "subscribed" && pastDue.pastDue).toBe(true);
  });

  it("prefers a live subscription over the app trial", () => {
    const access = resolveAccess({ subscriptions: [sub({})], trialEndsAt: new Date(NOW.getTime() + 3 * DAY), now: NOW });
    expect(access.kind).toBe("subscribed");
  });

  it("uses the app trial while it runs", () => {
    const access = resolveAccess({ subscriptions: [], trialEndsAt: new Date(NOW.getTime() + 2.5 * DAY), now: NOW });
    expect(access).toMatchObject({ kind: "trial", daysLeft: 3 });
  });

  it("expires when the trial is over, and remembers a past subscription", () => {
    const ended = new Date(NOW.getTime() - DAY);
    expect(resolveAccess({ subscriptions: [], trialEndsAt: ended, now: NOW })).toEqual({
      kind: "expired",
      endedAt: ended,
      hadSubscription: false,
    });
    const canceled = resolveAccess({
      subscriptions: [sub({ status: "canceled", canceled_at: "2026-09-25T00:00:00Z" })],
      trialEndsAt: ended,
      now: NOW,
    });
    expect(canceled).toMatchObject({ kind: "expired", hadSubscription: true });
    expect(canceled.kind === "expired" && canceled.endedAt?.toISOString()).toBe("2026-09-25T00:00:00.000Z");
  });

  it("keeps past_due access only for the grace period after the failed renewal", () => {
    // Monthly period 2026-09-20 -> 2026-10-20: the renewal failed on 2026-09-20.
    const pastDue = sub({ status: "past_due" });
    const within = resolveAccess({ subscriptions: [pastDue], trialEndsAt: null, now: new Date("2026-10-03T00:00:00Z") });
    expect(within.kind).toBe("subscribed");
    const after = resolveAccess({ subscriptions: [pastDue], trialEndsAt: null, now: new Date("2026-10-05T00:00:00Z") });
    expect(after.kind).toBe("expired");
    // Yearly: the grace counts from a year before the period end.
    const yearly = sub({ status: "past_due", plan_interval: "year", current_period_end: "2027-09-20T00:00:00Z" });
    expect(resolveAccess({ subscriptions: [yearly], trialEndsAt: null, now: new Date("2026-09-30T00:00:00Z") }).kind).toBe("subscribed");
    expect(resolveAccess({ subscriptions: [yearly], trialEndsAt: null, now: new Date("2026-10-10T00:00:00Z") }).kind).toBe("expired");
  });

  it("says a cancel-at-period-end subscription ended at the period end, not when cancel was clicked", () => {
    const access = resolveAccess({
      subscriptions: [
        sub({
          status: "canceled",
          cancel_at_period_end: true,
          cancel_at: "2026-09-30T00:00:00Z",
          canceled_at: "2026-09-05T00:00:00Z",
          current_period_end: "2026-09-30T00:00:00Z",
        }),
      ],
      trialEndsAt: null,
      now: NOW,
    });
    expect(access.kind === "expired" && access.endedAt?.toISOString()).toBe("2026-09-30T00:00:00.000Z");
  });

  it("never treats incomplete or unpaid subscriptions as access", () => {
    for (const status of ["incomplete", "incomplete_expired", "unpaid", "paused", "canceled"]) {
      const access = resolveAccess({ subscriptions: [sub({ status })], trialEndsAt: null, now: NOW });
      expect(access.kind, status).toBe("expired");
    }
  });
});

describe("trial math", () => {
  it("rounds days left up and never below zero", () => {
    expect(daysLeft(new Date(NOW.getTime() + 6.1 * DAY), NOW)).toBe(7);
    expect(daysLeft(new Date(NOW.getTime() + HOUR), NOW)).toBe(1);
    expect(daysLeft(new Date(NOW.getTime() - HOUR), NOW)).toBe(0);
  });

  it("carries the rest of the free trial into Stripe only when Checkout allows it (48h+)", () => {
    const threeDays = new Date(NOW.getTime() + 3 * DAY);
    expect(checkoutTrialEnd(threeDays, NOW)).toBe(Math.floor(threeDays.getTime() / 1000));
    expect(checkoutTrialEnd(new Date(NOW.getTime() + 47 * HOUR), NOW)).toBeUndefined();
    expect(checkoutTrialEnd(new Date(NOW.getTime() + 48 * HOUR), NOW)).toBeUndefined();
    expect(checkoutTrialEnd(null, NOW)).toBeUndefined();
  });
});

describe("plans", () => {
  it("match the advertised prices", () => {
    expect(PLANS.monthly.price).toBe(9.99);
    expect(PLANS.yearly.price).toBe(69.99);
    expect(yearlySavingsPercent()).toBe(41);
    expect(PLANS.yearly.note).toContain(`$${(PLANS.yearly.price / 12).toFixed(2)} a month`);
    expect(PLANS.yearly.note).toContain(`${yearlySavingsPercent()}%`);
    expect(planForInterval("month")?.id).toBe("monthly");
    expect(planForInterval("year")?.id).toBe("yearly");
    expect(planForInterval(null)).toBeNull();
  });
});

describe("email templates", () => {
  const siteUrl = "https://homedoctor.app";

  it("welcome: names the trial end date, links to diagnose, escapes the name", () => {
    const email = welcomeEmail({ name: "<b>Sam</b> Lee", trialEndsAt: new Date("2026-10-08T12:00:00Z"), siteUrl });
    expect(email.subject).toContain("7-day free trial");
    expect(email.html).toContain("Thursday, October 8");
    expect(email.html).toContain(`${siteUrl}/diagnose`);
    expect(email.html).not.toContain("<b>Sam</b>");
    expect(email.html).toContain("&lt;b&gt;Sam&lt;/b&gt;");
    expect(email.text).toContain("No card needed");
  });

  it("trial ending: says when, lists both plans, promises no surprise charge", () => {
    const inTwoDays = trialEndingEmail({ trialEndsAt: new Date(NOW.getTime() + 44 * HOUR), siteUrl, now: NOW });
    expect(inTwoDays.subject).toBe("Your Home Doctor trial ends in 2 days");
    expect(inTwoDays.html).toContain("$9.99/month");
    expect(inTwoDays.html).toContain("$69.99/year");
    expect(inTwoDays.html).toContain(`${siteUrl}/pricing`);
    expect(inTwoDays.text).toContain("nothing is charged unless you subscribe");
    const tomorrow = trialEndingEmail({ trialEndsAt: new Date(NOW.getTime() + 20 * HOUR), siteUrl, now: NOW });
    expect(tomorrow.subject).toBe("Your Home Doctor trial ends tomorrow");
    // Monday noon ET run, trial ending Tuesday 11pm ET (35h away): that's tomorrow, not "in 2 days".
    const monday = new Date("2026-10-05T16:00:00Z");
    const tuesdayNight = trialEndingEmail({ trialEndsAt: new Date("2026-10-07T03:00:00Z"), siteUrl, now: monday });
    expect(tuesdayNight.subject).toBe("Your Home Doctor trial ends tomorrow");
    expect(tuesdayNight.html).toContain("Tuesday, October 6");
  });

  it("receipt: amount, plan, invoice link and renewal", () => {
    const email = receiptEmail({
      amountCents: 999,
      currency: "usd",
      plan: PLANS.monthly,
      paidAt: new Date("2026-10-08T12:00:00Z"),
      invoiceNumber: "HD-0001",
      invoiceUrl: "https://invoice.stripe.com/i/abc",
      renewsAt: new Date("2026-11-08T12:00:00Z"),
      siteUrl,
    });
    expect(email.subject).toBe("Your Home Doctor receipt ($9.99)");
    expect(email.html).toContain("Home Doctor Monthly");
    expect(email.html).toContain("HD-0001");
    expect(email.html).toContain("https://invoice.stripe.com/i/abc");
    expect(email.text).toContain("Renews: November 8, 2026");
  });
});
