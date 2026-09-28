import Link from "next/link";

import { formatReviewed } from "@/lib/guides";
import { LEGAL_UPDATED, contactEmail } from "@/lib/site";

/** Shared layout for the privacy policy and terms: plain type, readable width. */
export function LegalPage({ title, intro, children }: { title: string; intro: string; children: React.ReactNode }) {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 pb-16 pt-8">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Legal</p>
      <h1 className="mt-3 text-balance font-display text-[2.4rem] font-semibold leading-[1.04] tracking-tight sm:text-5xl">
        {title}
      </h1>
      <p className="mt-3 text-sm text-muted-foreground">Last updated {formatReviewed(LEGAL_UPDATED)}</p>
      <p className="mt-5 max-w-2xl text-[17px] leading-relaxed">{intro}</p>
      <div className="mt-10 space-y-10">{children}</div>
      <p className="mt-12 text-sm text-muted-foreground">
        See also our{" "}
        <Link href="/privacy" className="font-medium text-foreground underline underline-offset-2">
          Privacy Policy
        </Link>{" "}
        and{" "}
        <Link href="/terms" className="font-medium text-foreground underline underline-offset-2">
          Terms of Service
        </Link>
        .
      </p>
    </main>
  );
}

export function LegalSection({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section aria-labelledby={id} className="scroll-mt-20">
      <h2 id={id} className="font-display text-2xl font-semibold">
        {title}
      </h2>
      <div className="mt-3 space-y-3 text-[15px] leading-relaxed text-muted-foreground [&_li]:pl-1 [&_strong]:text-foreground [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5">
        {children}
      </div>
    </section>
  );
}

/** "email us at x" with a mailto link, or a neutral line until CONTACT_EMAIL is set. */
export function ContactLine({ purpose }: { purpose: string }) {
  const email = contactEmail();
  if (!email) return <p>{purpose} Contact details are being added to this page.</p>;
  return (
    <p>
      {purpose} Email us at{" "}
      <a href={`mailto:${email}`} className="font-medium text-foreground underline underline-offset-2">
        {email}
      </a>
      .
    </p>
  );
}
