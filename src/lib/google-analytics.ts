/**
 * Google Analytics 4. On only when NEXT_PUBLIC_GA_ID holds a measurement ID
 * (G-...), which is set for production alone, so local and preview visits stay
 * out of the reports.
 */
const id = process.env.NEXT_PUBLIC_GA_ID;
export const GA_ID = id && /^G-[A-Z0-9]+$/.test(id) ? id : undefined;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * The standard gtag() stub: commands queue in window.dataLayer until the
 * library (loaded by src/components/google-analytics.tsx) takes them over.
 * Called from src/instrumentation-client.ts, which runs before hydration, so
 * events the app sends on mount (landing_view, diagnose_start) aren't dropped.
 */
export function initGoogleAnalytics() {
  if (!GA_ID || typeof window === "undefined" || window.gtag) return;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    // gtag.js only reads real `arguments` objects, not arrays.
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer!.push(arguments);
  };
  window.gtag("js", new Date());
  window.gtag("config", GA_ID);
}
