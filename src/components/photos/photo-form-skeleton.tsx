import { SubmitBar } from "@/components/submit-bar";
import { Skeleton, SkeletonText } from "@/components/ui/skeleton";

/**
 * Loading stand-in for DiagnoseForm / QuoteForm: same sections, picker and
 * submit bar, so nothing jumps when the real form arrives.
 */
export function PhotoFormSkeleton({ chips = false }: { chips?: boolean }) {
  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <div>
          <SkeletonText className="w-44" />
          <SkeletonText lines={2} lineHeight="h-5" className="max-w-md" />
        </div>
        <div className="space-y-3">
          <Skeleton className="h-32 rounded-xl" />
          <div className="grid grid-cols-2 gap-3">
            <Skeleton className="h-12 rounded-full" />
            <Skeleton className="h-12 rounded-full" />
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <SkeletonText lineHeight="h-4" className="w-52" />
        <Skeleton className="h-24 rounded-lg" />
      </section>

      {chips && (
        <section className="space-y-3">
          <SkeletonText className="w-60" />
          <div className="flex flex-wrap gap-2">
            {/* Widths of the real category chips. */}
            {[115, 116, 89, 138, 151, 128, 172, 109, 109].map((w, i) => (
              <Skeleton key={i} className="h-11 rounded-full" style={{ width: w }} />
            ))}
          </div>
        </section>
      )}

      <SubmitBar>
        <Skeleton className="h-14 rounded-full" />
      </SubmitBar>
    </div>
  );
}
