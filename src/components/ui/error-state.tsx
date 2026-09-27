"use client";

import { useEffect, useTransition } from "react";
import Link from "next/link";
import { Home, Loader2, RotateCcw, Wrench } from "lucide-react";

import { Button } from "@/components/ui/button";

/**
 * Friendly fallback for error.tsx / global-error.tsx: logs the error (with its
 * digest, to match server logs), offers a retry and a way home. `withLogo`
 * adds the brand mark for boundaries that render without the site header.
 */
export function ErrorState({
  error,
  retry,
  withLogo = false,
}: {
  error: Error & { digest?: string };
  retry: () => void;
  withLogo?: boolean;
}) {
  const [retrying, startTransition] = useTransition();

  useEffect(() => {
    console.error(`Home Doctor error${error.digest ? ` (digest ${error.digest})` : ""}`, error);
  }, [error]);

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center px-4 py-16 text-center">
      {withLogo && (
        <Link href="/" className="mb-10 flex min-h-11 items-center gap-2.5 rounded-xl" aria-label="Home Doctor home">
          <span className="grid size-8 place-items-center rounded-[10px] bg-(image:--grad) text-white">
            <svg viewBox="0 0 24 24" className="size-4" fill="currentColor" aria-hidden="true">
              <path d="M9 3h6v6h6v6h-6v6H9v-6H3V9h6z" />
            </svg>
          </span>
          <span className="whitespace-nowrap font-display text-[21px] font-semibold tracking-tight">Home Doctor</span>
        </Link>
      )}
      <span className="grid size-14 place-items-center rounded-2xl bg-(image:--grad-soft) text-primary" aria-hidden="true">
        <Wrench className="size-6" />
      </span>
      <h1 className="mt-5 text-balance font-display text-3xl font-semibold tracking-tight">Something went wrong</h1>
      <p className="mt-2 text-balance text-muted-foreground">
        That one&apos;s on us, not you. Try again, and if it keeps happening, start over from the home page.
      </p>
      <div className="mt-7 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
        <Button size="lg" onClick={() => startTransition(retry)} disabled={retrying}>
          {retrying ? <Loader2 className="animate-spin" /> : <RotateCcw />} {retrying ? "Trying again…" : "Try again"}
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="/">
            <Home /> Go home
          </Link>
        </Button>
      </div>
      {error.digest && (
        <p className="mt-6 text-xs text-muted-foreground">
          Reference: <code className="break-all font-mono">{error.digest}</code>
        </p>
      )}
    </main>
  );
}
