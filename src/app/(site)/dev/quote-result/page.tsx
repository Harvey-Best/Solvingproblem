import { notFound } from "next/navigation";

import { QuoteCheckResult } from "@/components/quote/quote-result";
import { normalizeQuoteCheck } from "@/lib/ai/quote-guard";
import { MOCK_QUOTE } from "@/lib/ai/quote-mock";

/** Dev-only preview of the quote check result with canned data. */
export default function DevQuoteResultPreview() {
  if (process.env.NODE_ENV === "production") notFound();
  const { quote } = normalizeQuoteCheck(MOCK_QUOTE);
  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-6">
      <QuoteCheckResult quote={quote} imageUrls={[]} />
    </main>
  );
}
