import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { LoadingStatus, Skeleton, SkeletonText } from "@/components/ui/skeleton";

/** Mirrors DiagnosisResult: photos, badges, title, then the first few cards. */
export default function DiagnosisLoading() {
  return (
    <main aria-busy="true" className="mx-auto w-full max-w-2xl flex-1 px-4 py-6">
      <LoadingStatus label="Loading your diagnosis…" />
      <div className="space-y-4">
        <div className="flex gap-2">
          <Skeleton className="size-20 rounded-xl" />
          <Skeleton className="size-20 rounded-xl" />
        </div>

        <div className="space-y-3">
          <div className="flex flex-wrap gap-1.5">
            <Skeleton className="h-[30px] w-20 rounded-full" />
            <Skeleton className="h-[30px] w-32 rounded-full" />
            <Skeleton className="h-[30px] w-24 rounded-full" />
          </div>
          <SkeletonText lines={2} lineHeight="h-[2.205rem]" className="max-w-md" />
        </div>

        <SkeletonText lines={2} lineHeight="h-5" />

        <Card>
          <CardHeader>
            <SkeletonText lineHeight="h-5" className="w-32" />
          </CardHeader>
          <CardContent>
            <SkeletonText lines={3} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <SkeletonText lineHeight="h-5" className="w-44" />
          </CardHeader>
          <CardContent className="space-y-3">
            <Skeleton className="h-[30px] w-24 rounded-full" />
            <SkeletonText lines={2} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <SkeletonText lineHeight="h-5" className="w-36" />
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="flex gap-3">
                  <Skeleton className="size-6 shrink-0 rounded-full" />
                  <SkeletonText lines={2} className="flex-1 pt-0.5" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
