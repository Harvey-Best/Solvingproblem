import Script from "next/script";

import { GA_ID } from "@/lib/google-analytics";

// Loads the Google Analytics library (gtag.js). gtag() itself is set up earlier,
// before hydration, in src/instrumentation-client.ts. Page views, including
// App Router navigations, come from GA's enhanced measurement (browser history
// changes); the app's own events are forwarded by track() in src/lib/analytics.ts.
export function GoogleAnalytics() {
  if (!GA_ID) return null;
  return <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />;
}
