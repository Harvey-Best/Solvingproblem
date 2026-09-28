import type { NextConfig } from "next";

// PostHog goes through /ingest on our own domain so ad blockers don't drop
// events (see src/instrumentation-client.ts). Cloud hosts serve their scripts
// from a sibling assets host: us.i.posthog.com → us-assets.i.posthog.com.
const posthogHost = (process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com").replace(/\/$/, "");
const posthogAssets = posthogHost.replace(/^https:\/\/(\w+)\.i\.posthog\.com$/, "https://$1-assets.i.posthog.com");

const OLD_HOST = "home-doctor-blue.vercel.app";
const canonicalHost = process.env.NEXT_PUBLIC_SITE_URL ? new URL(process.env.NEXT_PUBLIC_SITE_URL).host : null;

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async rewrites() {
    return [
      { source: "/ingest/static/:path*", destination: `${posthogAssets}/static/:path*` },
      { source: "/ingest/:path*", destination: `${posthogHost}/:path*` },
    ];
  },
  // Next would 308 PostHog's calls (/ingest/e/, /ingest/flags/) to drop the
  // slash. Turn that off, and keep it for every other path so each page still
  // has one URL (/pricing/ → /pricing).
  skipTrailingSlashRedirect: true,
  async redirects() {
    return [
      { source: "/:path((?!ingest/).+)/", destination: "/:path", permanent: true },
      // The site's first address. It serves the same deployment, so send people
      // and crawlers to the main one instead of a duplicate copy. API routes are
      // left alone for anything still pointed at the old host.
      ...(canonicalHost && canonicalHost !== OLD_HOST
        ? [
            {
              source: "/:path((?!api/).*)",
              has: [{ type: "host" as const, value: OLD_HOST }],
              destination: `https://${canonicalHost}/:path`,
              permanent: true,
            },
          ]
        : []),
    ];
  },
};

export default nextConfig;
