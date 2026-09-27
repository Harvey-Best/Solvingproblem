import { LoadingStatus, Skeleton, SkeletonText } from "@/components/ui/skeleton";

/** Mirrors the history page: heading, the two shortcut buttons, then list rows. */
export default function HistoryLoading() {
  return (
    <main aria-busy="true" className="mx-auto w-full max-w-2xl flex-1 px-4 py-6">
      <LoadingStatus label="Loading your history…" />
      <h1 className="font-display text-3xl font-semibold tracking-tight">Your history</h1>
      <p className="mt-1 text-muted-foreground">Every diagnosis and quote check you&apos;ve run.</p>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <Skeleton className="h-10 rounded-full" />
        <Skeleton className="h-10 rounded-full" />
      </div>

      <ul className="mt-6 space-y-3">
        {[0, 1, 2, 3].map((i) => (
          <li key={i} className="flex items-center gap-3 rounded-2xl border bg-card p-3">
            <Skeleton className="size-16 shrink-0 rounded-xl" />
            <div className="min-w-0 flex-1">
              <SkeletonText lineHeight="h-[1.375rem]" className="w-3/4" />
              <SkeletonText lineHeight="h-4" className="mt-0.5 w-1/2" />
              <Skeleton className="mt-1.5 h-[22px] w-24 rounded-full" />
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
