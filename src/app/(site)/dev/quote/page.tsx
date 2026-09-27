import { notFound } from "next/navigation";

import { ModeTabs } from "@/components/mode-tabs";
import { QuoteForm } from "@/components/quote/quote-form";

/** Dev-only preview of the quote form without the allowance check. */
export default function DevQuotePreview() {
  if (process.env.NODE_ENV === "production") notFound();
  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-6">
      <ModeTabs active="quote" />
      <h1 className="mt-6 font-display text-3xl font-semibold tracking-tight">Check a contractor&apos;s quote</h1>
      <p className="mt-1 text-muted-foreground">
        We&apos;ll list what&apos;s in it, what&apos;s missing, any red flags, and whether the price is in a typical
        range. Your first quote check is free.
      </p>
      <div className="mt-6">
        <QuoteForm />
      </div>
    </main>
  );
}
