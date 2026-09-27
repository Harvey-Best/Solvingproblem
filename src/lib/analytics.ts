import posthog from "posthog-js";

/**
 * Product analytics in the browser. PostHog is set up in
 * src/instrumentation-client.ts, only when NEXT_PUBLIC_POSTHOG_KEY is set;
 * without it events go to the dev console. Properties are snake_case and never
 * carry PII (no emails, no free-text descriptions).
 */
export type AnalyticsEvent =
  | "landing_view"
  | "diagnose_start"
  | "image_uploaded"
  | "diagnosis_complete"
  | "followup_sent"
  | "quote_check_complete"
  | "signup"
  | "trial_start"
  | "subscribe"
  | "cancel";

export function track(event: AnalyticsEvent, properties?: Record<string, unknown>) {
  if (!posthog.__loaded) {
    if (process.env.NODE_ENV !== "production") console.debug("[track]", event, properties ?? {});
    return;
  }
  try {
    posthog.capture(event, properties);
  } catch {
    // Analytics never breaks the app.
  }
}

/**
 * Ties this browser to the signed-in Supabase user id (never the email), so
 * events from before sign-up merge into that person. With no user, forgets the
 * last one, so the next person on this browser starts anonymous.
 */
export function syncIdentity(userId: string | null) {
  try {
    if (!posthog.__loaded) return;
    if (userId) {
      if (posthog.get_distinct_id() === userId) return;
      // A different account on this browser: don't merge it into the last one.
      if (posthog._isIdentified()) posthog.reset();
      posthog.identify(userId);
    } else if (posthog._isIdentified()) {
      posthog.reset();
    }
  } catch {
    // Analytics never breaks the app.
  }
}
