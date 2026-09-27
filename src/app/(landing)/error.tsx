"use client"; // Error boundaries must be Client Components

import { ErrorState } from "@/components/ui/error-state";

/** The landing page has no shared header, so this brings the logo along. */
export default function LandingError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return <ErrorState error={error} retry={retry} withLogo />;
}
