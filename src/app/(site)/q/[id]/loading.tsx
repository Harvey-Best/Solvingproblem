import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { LoadingStatus, Skeleton, SkeletonText } from "@/components/ui/skeleton";

/** Mirrors QuoteCheckResult: pages, badges, title, bottom line, then the price and red flags. */
export default function QuoteCheckLoading() {
  return (
    <main aria-busy="true" className="mx-auto w-full max-w-2xl flex-1 px-4 py-6">
      <LoadingStatus label="Loading your quote check…" />
      <div className="space-y-4">
        <div className="flex gap-2">
          <Skeleton className="size-20 rounded-xl" />
        </div>

        <div className="space-y-3">
          <div className="flex flex-wrap gap-1.5">
            <Skeleton className="h-[30px] w-28 rounded-full" />
            <Skeleton className="h-[30px] w-24 rounded-full" />
          </div>
          <SkeletonText lines={2} lineHeight="h-[2.205rem]" className="max-w-md" />
          <SkeletonText lines={2} />
        </div>

        <div className="rounded-3xl border border-primary/15 bg-(image:--grad-soft) p-5">
          <SkeletonText lineHeight="h-4" className="w-24" />
          <SkeletonText lines={3} lineHeight="h-[1.71875rem]" className="mt-1.5" />
        </div>

        <Card>
          <CardHeader>
            <SkeletonText lineHeight="h-5" className="w-24" />
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="flex items-end justify-between gap-2">
              <div>
                <SkeletonText lineHeight="h-4" className="w-16" />
                <SkeletonText lineHeight="h-9" className="w-28" />
              </div>
              <Skeleton className="h-[30px] w-40 rounded-full" />
            </div>
            <div className="pb-6 pt-7">
              <Skeleton className="h-2.5 rounded-full" />
            </div>
            <SkeletonText lines={3} lineHeight="h-5" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <SkeletonText lineHeight="h-5" className="w-24" />
          </CardHeader>
          <CardContent className="space-y-2">
            <Skeleton className="h-24 rounded-xl" />
            <Skeleton className="h-24 rounded-xl" />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
