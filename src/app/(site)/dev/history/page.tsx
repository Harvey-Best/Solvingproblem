import { notFound } from "next/navigation";

import { HistoryList } from "@/components/history/history-list";
import type { HistoryItem } from "@/lib/history";

/** Dev-only preview of the history list with sample rows. */
export default function DevHistoryPreview() {
  if (process.env.NODE_ENV === "production") notFound();
  const items: HistoryItem[] = [
    { kind: "quote", id: "q1", title: "Water heater replacement quote", priceAssessment: "within_typical", createdAt: "2026-09-26T18:00:00Z", thumbUrl: null },
    { kind: "diagnosis", id: "d1", title: "Worn faucet cartridge", category: "plumbing", severity: "fix_soon", createdAt: "2026-09-25T15:00:00Z", thumbUrl: null },
    { kind: "diagnosis", id: "d2", title: "Overloaded kitchen circuit", category: "electrical", severity: "urgent", createdAt: "2026-09-20T09:00:00Z", thumbUrl: null },
    { kind: "diagnosis", id: "d3", title: "Hairline settling crack", category: "walls_paint", severity: "cosmetic", createdAt: "2026-09-12T12:00:00Z", thumbUrl: null },
  ];
  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-6">
      <h1 className="font-display text-3xl font-semibold tracking-tight">Your history</h1>
      <p className="mt-1 text-muted-foreground">Every diagnosis and quote check you&apos;ve run.</p>
      <HistoryList items={items} />
    </main>
  );
}
