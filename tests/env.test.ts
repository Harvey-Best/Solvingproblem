import { afterEach, describe, expect, it, vi } from "vitest";

import { env, hasStripeWebhookSecret, isBillingConfigured, isStripeLive } from "@/lib/env";

afterEach(() => vi.unstubAllEnvs());

function stubStripe(key: string) {
  vi.stubEnv("STRIPE_SECRET_KEY", key);
  vi.stubEnv("STRIPE_WEBHOOK_SECRET", "whsec_test");
  vi.stubEnv("STRIPE_PRICE_MONTHLY", "price_test_m");
  vi.stubEnv("STRIPE_PRICE_YEARLY", "price_test_y");
  vi.stubEnv("STRIPE_LIVE_WEBHOOK_SECRET", "whsec_live");
  vi.stubEnv("STRIPE_LIVE_PRICE_MONTHLY", "price_live_m");
  vi.stubEnv("STRIPE_LIVE_PRICE_YEARLY", "price_live_y");
}

describe("Stripe mode", () => {
  it("uses the test settings with a test key", () => {
    stubStripe("sk_test_123");
    expect(isStripeLive()).toBe(false);
    expect(env.stripePriceMonthly).toBe("price_test_m");
    expect(env.stripePriceYearly).toBe("price_test_y");
    expect(env.stripeWebhookSecret).toBe("whsec_test");
  });

  it("switches every setting to its live counterpart with a live key", () => {
    stubStripe("sk_live_123");
    expect(isStripeLive()).toBe(true);
    expect(env.stripePriceMonthly).toBe("price_live_m");
    expect(env.stripePriceYearly).toBe("price_live_y");
    expect(env.stripeWebhookSecret).toBe("whsec_live");
    stubStripe("rk_live_123");
    expect(isStripeLive()).toBe(true);
  });

  it("keeps the paywall off in live mode until the live prices are set", () => {
    stubStripe("sk_live_123");
    expect(isBillingConfigured()).toBe(true);
    vi.stubEnv("STRIPE_LIVE_PRICE_YEARLY", "");
    expect(isBillingConfigured()).toBe(false);
    vi.stubEnv("STRIPE_LIVE_WEBHOOK_SECRET", "");
    expect(hasStripeWebhookSecret()).toBe(false);
  });
});
