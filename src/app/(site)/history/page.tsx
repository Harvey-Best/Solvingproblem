import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Camera, FileText } from "lucide-react";

import { HistoryList } from "@/components/history/history-list";
import { Button } from "@/components/ui/button";
import { listHistory } from "@/lib/history";
import { getViewer } from "@/lib/viewer";

export const metadata: Metadata = { title: "Your history", robots: { index: false } };

export default async function HistoryPage() {
  const { userId } = await getViewer();
  if (!userId) redirect("/login?reason=history&next=/history");
  const items = await listHistory(userId);

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-6">
      <h1 className="font-display text-3xl font-semibold tracking-tight">Your history</h1>
      <p className="mt-1 text-muted-foreground">Every diagnosis and quote check you&apos;ve run.</p>

      {items.length === 0 ? (
        <div className="mt-8 rounded-3xl border border-primary/15 bg-(image:--grad-soft) p-6 text-center">
          <p className="font-display text-xl font-semibold">Nothing here yet</p>
          <p className="mt-1 text-sm text-muted-foreground">Your diagnoses and quote checks will show up here.</p>
          <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/diagnose">Diagnose a problem</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/quote">Check a quote</Link>
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <Button asChild>
              <Link href="/diagnose">
                <Camera /> New diagnosis
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/quote">
                <FileText /> Check a quote
              </Link>
            </Button>
          </div>
          <HistoryList items={items} />
        </>
      )}
    </main>
  );
}
