import { NextResponse } from "next/server";
import type Stripe from "stripe";

import { env, isBillingConfigured } from "@/lib/env";
import { getStripe } from "@/lib/stripe";
import { handleStripeEvent } from "@/lib/stripe-events";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Stripe webhook. Verifies the signature against the raw body, records the
 * event id so redeliveries are ignored, and releases it again if handling
 * fails so Stripe's retry gets another go.
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
  const { error: claimError } = await admin.from("stripe_events").insert({ id: event.id, type: event.type });
  if (claimError) {
    if (claimError.code === "23505") return NextResponse.json({ received: true, duplicate: true });
    console.error("stripe_events insert failed", claimError);
    return NextResponse.json({ error: "Storage error" }, { status: 500 });
  }

  try {
    await handleStripeEvent(event);
  } catch (err) {
    console.error("stripe webhook handling failed", { id: event.id, type: event.type, error: (err as Error).message });
    await admin.from("stripe_events").delete().eq("id", event.id);
    return NextResponse.json({ error: "Handler error" }, { status: 500 });
  }
  return NextResponse.json({ received: true });
}
