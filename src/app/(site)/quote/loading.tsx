import { ModeTabs } from "@/components/mode-tabs";
import { PhotoFormSkeleton } from "@/components/photos/photo-form-skeleton";
import { LoadingStatus, SkeletonText } from "@/components/ui/skeleton";

export default function QuoteLoading() {
  return (
    <main aria-busy="true" className="mx-auto w-full max-w-2xl flex-1 px-4 py-6">
      <LoadingStatus />
      <ModeTabs active="quote" />
      <h1 className="mt-6 font-display text-3xl font-semibold tracking-tight">Check a contractor&apos;s quote</h1>
      <SkeletonText lines={3} className="mt-1 sm:hidden" />
      <SkeletonText lines={2} className="mt-1 hidden sm:flex" />
      <div className="mt-6">
        <PhotoFormSkeleton />
      </div>
    </main>
  );
}
