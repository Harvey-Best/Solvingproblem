"use client"; // Error boundaries must be Client Components

import { ErrorState } from "@/components/ui/error-state";
import { cssVars } from "@/lib/utils";

import "./globals.css";

// The root layout's next/font variables aren't here, so fall back to system fonts.
const FONT_FALLBACKS = cssVars({
  "--font-geist-sans": "ui-sans-serif, system-ui, sans-serif",
  "--font-geist-mono": "ui-monospace, monospace",
  "--font-fraunces": "Georgia",
});

/** Replaces the root layout when it fails, so it brings its own html, body and styles. */
export default function GlobalError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <html lang="en" className="h-full antialiased" style={FONT_FALLBACKS}>
      <body className="flex min-h-full flex-col font-sans">
        <title>Something went wrong · Home Doctor</title>
        <ErrorState error={error} retry={retry} withLogo />
      </body>
    </html>
  );
}
