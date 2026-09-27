import posthog from "posthog-js";

// Product analytics (src/lib/analytics.ts). Runs before hydration, so track()
// works from the first render. Off until a project key is set.
const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const host = (process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com").replace(/\/$/, "");

if (key) {
  try {
    posthog.init(key, {
      // First-party path, rewritten to PostHog in next.config.ts, so ad
      // blockers don't drop events.
      api_host: "/ingest",
      // Links from the toolbar and debug logs go to the dashboard (us.posthog.com).
      ui_host: host.replace(".i.posthog.com", ".posthog.com"),
      defaults: "2026-01-30",
      // The first load plus every App Router navigation.
      capture_pageview: "history_change",
      // Anonymous visitors get a person profile only once they sign in.
      person_profiles: "identified_only",
      // Privacy: pageviews and our own events only. No replays, no click autocapture.
      disable_session_recording: true,
      autocapture: false,
    });
  } catch (err) {
    console.error("posthog init failed", err);
  }
}
