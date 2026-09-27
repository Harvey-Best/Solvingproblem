/**
 * Product analytics. Events are wired at their call sites now; Phase 4 swaps
 * this body for posthog.capture() so nothing else has to change.
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
  if (process.env.NODE_ENV !== "production") {
    console.debug("[track]", event, properties ?? {});
  }
}
