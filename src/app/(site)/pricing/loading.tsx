import { PlanPickerSkeleton } from "@/components/billing/plan-picker";
import { LoadingStatus, Skeleton, SkeletonText } from "@/components/ui/skeleton";

/** Mirrors the pricing page: eyebrow, headline, intro, the plans, then the "not sure yet" card. */
export default function PricingLoading() {
  return (
    <main aria-busy="true" className="mx-auto w-full max-w-3xl flex-1 px-4 pb-16 pt-8">
      <LoadingStatus label="Loading pricing…" />
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Pricing</p>
      <SkeletonText lines={3} lineHeight="h-[2.496rem]" className="mt-3 max-w-md sm:hidden" />
      <SkeletonText lines={2} lineHeight="h-[3.12rem]" className="mt-3 hidden max-w-2xl sm:flex" />
      <SkeletonText lines={3} className="mt-3 max-w-xl sm:hidden" />
      <SkeletonText lines={2} className="mt-3 hidden max-w-xl sm:flex" />

      <div className="mt-8">
        <PlanPickerSkeleton />
      </div>

      <Skeleton className="mt-6 h-36 rounded-3xl sm:h-[5.5rem]" />
    </main>
  );
}
