import * as React from "react";

import { cn } from "@/lib/utils";

/** Placeholder block for loading states. Pulses gently, and holds still under prefers-reduced-motion. */
function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      aria-hidden="true"
      className={cn("animate-pulse rounded-md bg-foreground/8 motion-reduce:animate-none", className)}
      {...props}
    />
  );
}

/**
 * Placeholder text: `lines` rows, each exactly one line box tall (`lineHeight`,
 * e.g. "h-6" for text-base, "h-5" for text-sm), so it takes the same space as the
 * real copy. The last of several lines is shorter, like a ragged paragraph.
 */
function SkeletonText({
  lines = 1,
  lineHeight = "h-6",
  className,
}: {
  lines?: number;
  lineHeight?: string;
  className?: string;
}) {
  return (
    <div aria-hidden="true" className={cn("flex flex-col", className)}>
      {Array.from({ length: lines }, (_, i) => (
        <div key={i} className={cn("flex items-center", lineHeight)}>
          <Skeleton className={cn("h-[60%]", lines > 1 && i === lines - 1 ? "w-3/5" : "w-full")} />
        </div>
      ))}
    </div>
  );
}

/** Screen-reader announcement for a loading page; the skeletons themselves are hidden from assistive tech. */
function LoadingStatus({ label = "Loading…" }: { label?: string }) {
  return (
    <p role="status" className="sr-only">
      {label}
    </p>
  );
}

export { Skeleton, SkeletonText, LoadingStatus };
