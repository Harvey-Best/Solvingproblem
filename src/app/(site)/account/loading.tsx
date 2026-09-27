import { PlanPickerSkeleton } from "@/components/billing/plan-picker";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingStatus, Skeleton, SkeletonText } from "@/components/ui/skeleton";

/** Mirrors the account page: heading and email, the plan card, then the history / sign out buttons. */
export default function AccountLoading() {
  return (
    <main aria-busy="true" className="mx-auto w-full max-w-2xl flex-1 space-y-4 px-4 py-6">
      <LoadingStatus label="Loading your account…" />
      <div>
        <h1 className="font-display text-3xl font-semibold tracking-tight">Your account</h1>
        <SkeletonText className="mt-1 w-56" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Plan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-1">
            <SkeletonText lineHeight="h-8" className="w-40" />
            <SkeletonText className="w-64 max-w-full" />
          </div>
          <PlanPickerSkeleton />
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-2">
        <Skeleton className="h-10 w-36 rounded-full" />
        <Skeleton className="h-10 w-28 rounded-full" />
      </div>
    </main>
  );
}
