import { ModeTabs } from "@/components/mode-tabs";
import { PhotoFormSkeleton } from "@/components/photos/photo-form-skeleton";
import { LoadingStatus, SkeletonText } from "@/components/ui/skeleton";

export default function DiagnoseLoading() {
  return (
    <main aria-busy="true" className="mx-auto w-full max-w-2xl flex-1 px-4 py-6">
      <LoadingStatus />
      <ModeTabs active="diagnose" />
      <h1 className="mt-6 font-display text-3xl font-semibold tracking-tight">What&apos;s the problem?</h1>
      <SkeletonText className="mt-1 w-72 max-w-full" />
      <div className="mt-6">
        <PhotoFormSkeleton chips />
      </div>
    </main>
  );
}
