import "server-only";

import type { AnalyticsEvent } from "@/lib/analytics";

/**
 * Server-side events (signup, trial_start, subscribe, cancel) come from places
 * the browser never sees, like the Stripe webhook. Logged for now; Phase 4
 * sends them to PostHog with the user id as the distinct id.
 */
export function trackServer(event: AnalyticsEvent, distinctId: string, properties?: Record<string, unknown>) {
  console.info(JSON.stringify({ analytics: event, distinct_id: distinctId, ...properties }));
}
