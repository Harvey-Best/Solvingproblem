import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Camera, FileText, Save } from "lucide-react";

import { QuoteCheckResult } from "@/components/quote/quote-result";
import { Button } from "@/components/ui/button";
import { signImageUrls } from "@/lib/diagnoses";
import { getQuoteCheckForViewer } from "@/lib/quote-checks";
import { getViewer } from "@/lib/viewer";

export const metadata: Metadata = {
  title: "Your quote check",
  robots: { index: false },
};

export default async function QuoteCheckPage(props: PageProps<"/q/[id]">) {
  const { id } = await props.params;
  const viewer = await getViewer();
  const record = await getQuoteCheckForViewer(id, viewer);
  if (!record) notFound();

  if (record.status !== "complete" || !record.result_json) {
    return (
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-10">
        <h1 className="font-display text-3xl font-semibold">
          {record.status === "pending" ? "Still reading it" : "We couldn't read this quote"}
        </h1>
        <p className="mt-2 text-muted-foreground">
          {record.status === "pending"
            ? "Refresh in a few seconds."
            : "It didn't count against you. Try again with flat, well-lit photos of each page."}
        </p>
        <Button asChild size="lg" className="mt-6">
          <Link href="/quote">Try again</Link>
        </Button>
      </main>
    );
  }

  const imageUrls = await signImageUrls(record.image_paths);

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-6">
      <QuoteCheckResult quote={record.result_json} imageUrls={imageUrls} />

      {!viewer.userId && (
        <div className="mt-6 rounded-3xl border border-primary/15 bg-(image:--grad-soft) p-5">
          <p className="font-display text-xl font-semibold">Save this quote check</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Create a free account to keep it next to your diagnoses and come back before you sign.
          </p>
          <Button asChild size="lg" className="mt-4 w-full sm:w-auto">
            <Link href={`/login?reason=save&next=/q/${record.id}`}>
              <Save /> Save it to my account
            </Link>
          </Button>
        </div>
      )}

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <Button asChild variant="outline" size="lg">
          <Link href="/quote">
            <FileText /> Check another quote
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/diagnose">
            <Camera /> Diagnose a problem
          </Link>
        </Button>
      </div>
    </main>
  );
}
