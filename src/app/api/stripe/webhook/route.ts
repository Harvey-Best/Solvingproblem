import { NextResponse } from "next/server";
import type Stripe from "stripe";

import { env, isBillingConfigured } from "@/lib/env";
import { getStripe } from "@/lib/stripe";
import { handleStripeEvent } from "@/lib/stripe-events";
import { createAdminClient } from "@/lib/supabase/admin";

/** A claim this old with no processed_at means the function handling it died. */
const STALE_CLAIM_SECONDS = 5 * 60;

/**
 * Stripe webhook. Verifies the signature against the raw body, claims the
 * event id (claim_stripe_event) so redeliveries aren't handled twice, marks
 * it processed when done, and releases it if handling fails so Stripe's retry
 * gets another go.
 */
export async function POST(request: Request) {
  if (!isBillingConfigured() || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Billing isn't configured" }, { status: 503 });
  }

  const payload = await request.text();
  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(
      payload,
      request.headers.get("stripe-signature") ?? "",
      env.stripeWebhookSecret
    );
  } catch (err) {
    console.error("stripe webhook signature check failed", (err as Error).message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const admin = createAdminClient();
  const { data: claim, error: claimError } = await admin.rpc("claim_stripe_event", {
    p_id: event.id,
    p_type: event.type,
    p_stale_seconds: STALE_CLAIM_SECONDS,
  });
  if (claimError) {
    console.error("claim_stripe_event failed", claimError);
    return NextResponse.json({ error: "Storage error" }, { status: 500 });
  }
  if (claim === "processed") return NextResponse.json({ received: true, duplicate: true });
  if (claim !== "claimed") {
    // Another delivery is handling it right now; if that one dies, Stripe's retry takes over.
    return NextResponse.json({ error: "Already processing" }, { status: 409 });
  }

  try {
    await handleStripeEvent(event);
  } catch (err) {
    console.error("stripe webhook handling failed", { id: event.id, type: event.type, error: (err as Error).message });
    await admin.from("stripe_events").delete().eq("id", event.id);
    return NextResponse.json({ error: "Handler error" }, { status: 500 });
  }
  const { error: doneError } = await admin
    .from("stripe_events")
    .update({ processed_at: new Date().toISOString() })
    .eq("id", event.id);
  // Handlers are idempotent, so the worst case is handling a redelivery again.
  if (doneError) console.error("stripe_events processed_at update failed", doneError);
  return NextResponse.json({ received: true });
}
