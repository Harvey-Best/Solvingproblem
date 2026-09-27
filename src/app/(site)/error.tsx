"use client"; // Error boundaries must be Client Components

import { ErrorState } from "@/components/ui/error-state";

/** Runtime errors inside the site render here, under the site header. */
export default function SiteError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return <ErrorState error={error} retry={retry} />;
}
