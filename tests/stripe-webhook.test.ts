import Stripe from "stripe";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const db = vi.hoisted(() => ({
  insert: vi.fn(),
  deleteEq: vi.fn(),
}));
vi.mock("@/lib/supabase/admin", () => ({
  createAdminClient: () => ({
    from: () => ({
      insert: db.insert,
      delete: () => ({ eq: db.deleteEq }),
    }),
  }),
}));

const handler = vi.hoisted(() => vi.fn());
vi.mock("@/lib/stripe-events", () => ({ handleStripeEvent: handler }));

import { POST } from "@/app/api/stripe/webhook/route";

const { isCancellationScheduled } =
  await vi.importActual<typeof import("@/lib/stripe-events")>("@/lib/stripe-events");

const SECRET = "whsec_test_secret";
const stripe = new Stripe("sk_test_dummy");

function signedRequest(event: object, secret = SECRET) {
  const payload = JSON.stringify(event);
  const header = stripe.webhooks.generateTestHeaderString({ payload, secret });
  return new Request("http://localhost/api/stripe/webhook", {
    method: "POST",
    headers: { "stripe-signature": header, "content-type": "application/json" },
    body: payload,
  });
}

const EVENT = { id: "evt_1", object: "event", type: "invoice.paid", data: { object: { id: "in_1" } } };

beforeEach(() => {
  vi.stubEnv("STRIPE_SECRET_KEY", "sk_test_dummy");
  vi.stubEnv("STRIPE_PRICE_MONTHLY", "price_m");
  vi.stubEnv("STRIPE_PRICE_YEARLY", "price_y");
  vi.stubEnv("STRIPE_WEBHOOK_SECRET", SECRET);
  db.insert.mockResolvedValue({ error: null });
  db.deleteEq.mockResolvedValue({ error: null });
  handler.mockResolvedValue(undefined);
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.clearAllMocks();
});

describe("Stripe webhook", () => {
  it("rejects a bad signature without touching the database", async () => {
    const res = await POST(signedRequest(EVENT, "whsec_wrong"));
    expect(res.status).toBe(400);
    expect(db.insert).not.toHaveBeenCalled();
    expect(handler).not.toHaveBeenCalled();
  });

  it("records the event, then handles it", async () => {
    const res = await POST(signedRequest(EVENT));
    expect(res.status).toBe(200);
    expect(db.insert).toHaveBeenCalledWith({ id: "evt_1", type: "invoice.paid" });
    expect(handler).toHaveBeenCalledWith(expect.objectContaining({ id: "evt_1", type: "invoice.paid" }));
  });

  it("acknowledges a redelivered event without handling it twice", async () => {
    db.insert.mockResolvedValue({ error: { code: "23505", message: "duplicate key" } });
    const res = await POST(signedRequest(EVENT));
    expect(res.status).toBe(200);
    expect(await res.json()).toMatchObject({ duplicate: true });
    expect(handler).not.toHaveBeenCalled();
  });

  it("releases the event and returns 500 when handling fails, so Stripe retries", async () => {
    handler.mockRejectedValue(new Error("boom"));
    const res = await POST(signedRequest(EVENT));
    expect(res.status).toBe(500);
    expect(db.deleteEq).toHaveBeenCalledWith("id", "evt_1");
  });

  it("returns 503 when billing isn't configured", async () => {
    vi.stubEnv("STRIPE_SECRET_KEY", "");
    const res = await POST(signedRequest(EVENT));
    expect(res.status).toBe(503);
  });
});

describe("cancellation analytics", () => {
  it("fires only on the update that schedules the cancellation", () => {
    expect(isCancellationScheduled({ cancel_at_period_end: true, cancel_at: null }, { cancel_at_period_end: false })).toBe(true);
    expect(isCancellationScheduled({ cancel_at_period_end: false, cancel_at: 1790000000 }, { cancel_at: null })).toBe(true);
    expect(isCancellationScheduled({ cancel_at_period_end: true, cancel_at: null }, { status: "active" })).toBe(false);
    expect(isCancellationScheduled({ cancel_at_period_end: true, cancel_at: null }, undefined)).toBe(false);
  });
});
