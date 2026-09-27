import "server-only";

import { after } from "next/server";
import { PostHog } from "posthog-node";

import type { AnalyticsEvent } from "@/lib/analytics";

let client: PostHog | null = null;

function getPostHog(): PostHog | null {
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (!key) return null;
  // Serverless functions freeze after the response, so nothing may wait in a
  // queue: events go out one by one, right away.
  client ??= new PostHog(key, {
    host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com",
    flushAt: 1,
    flushInterval: 0,
  });
  return client;
}

/**
 * Server-side events (signup, trial_start, subscribe, cancel) come from places
 * the browser never sees, like the Stripe webhook. The distinct id is the
 * Supabase user id, the same one the browser identifies with, so both land on
 * one person. Logged when no PostHog key is set. Never throws.
 */
export function trackServer(event: AnalyticsEvent, distinctId: string, properties?: Record<string, unknown>) {
  try {
    const posthog = getPostHog();
    if (!posthog) {
      console.info(JSON.stringify({ analytics: event, distinct_id: distinctId, ...properties }));
      return;
    }
    const sent = posthog
      .captureImmediate({ distinctId, event, properties })
      .catch((err) => console.error("posthog capture failed", { event, error: (err as Error).message }));
    // Keeps the function alive until the event is sent, without delaying the response.
    after(() => sent);
  } catch (err) {
    console.error("trackServer failed", { event, error: (err as Error).message });
  }
}
