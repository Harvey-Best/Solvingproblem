import { redirect } from "next/navigation";

import { Paywall, TrialStatus } from "@/components/billing/access-ui";
import { JsonLd } from "@/components/json-ld";
import { ModeTabs } from "@/components/mode-tabs";
import { PageFaq } from "@/components/page-faq";
import { QuoteForm } from "@/components/quote/quote-form";
import { checkAllowance } from "@/lib/allowance";
import { isSupabaseConfigured } from "@/lib/env";
import { breadcrumbJsonLd, faqPageJsonLd, graph, pageMetadata } from "@/lib/seo";
import { absoluteUrl } from "@/lib/site";
import { QUOTE_FAQS } from "@/lib/tool-faqs";
import { getIpHash, getViewer } from "@/lib/viewer";

export const metadata = pageMetadata({
  title: "Check a contractor's quote",
  description:
    "Photograph a contractor's quote. See what's missing, red flags like a big deposit or no license number, and whether the price is within a typical range.",
  path: "/quote",
});

export default async function QuotePage() {
  if (!isSupabaseConfigured()) {
    return (
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-10">
        <h1 className="font-display text-3xl font-semibold">Almost there</h1>
        <p className="mt-2 text-muted-foreground">Supabase isn&apos;t configured yet. See the README.</p>
      </main>
    );
  }

  const viewer = await getViewer();
  const ipHash = viewer.userId ? null : await getIpHash();
  const allowance = await checkAllowance("quote", viewer, ipHash);
  if (!allowance.allowed && allowance.reason === "signup_required") {
    redirect("/login?reason=quote&next=/quote");
  }

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-6">
      <JsonLd
        data={graph(
          faqPageJsonLd(QUOTE_FAQS, absoluteUrl("/quote")),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Check a quote", path: "/quote" },
          ])
        )}
      />
      <ModeTabs active="quote" />
      <h1 className="mt-6 font-display text-3xl font-semibold tracking-tight">Check a contractor&apos;s quote</h1>
      <p className="mt-1 text-muted-foreground">
        We&apos;ll list what&apos;s in it, what&apos;s missing, any red flags, and whether the price is in a typical
        range.{!viewer.userId && " Your first quote check is free."}
      </p>
      <TrialStatus access={allowance.access} />
      {!allowance.allowed && allowance.reason === "subscription_required" && allowance.access ? (
        <Paywall access={allowance.access} kind="quote" />
      ) : !allowance.allowed ? (
        <p className="mt-6 rounded-xl border bg-card p-4 text-sm">
          You&apos;ve hit today&apos;s limit. Please come back tomorrow.
        </p>
      ) : (
        <div className="mt-6">
          <QuoteForm />
        </div>
      )}
      <PageFaq id="quote-faq" faqs={QUOTE_FAQS} />
    </main>
  );
}
