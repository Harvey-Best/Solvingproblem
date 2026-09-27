import Link from "next/link";
import { Camera } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { CategoryId } from "@/lib/diagnosis-meta";

/** "Not sure it's this? Snap it." Sends the reader to /diagnose, category prefilled. */
export function GuideCta({ category, title, body }: { category?: CategoryId; title: string; body: string }) {
  const href = category ? `/diagnose?category=${category}` : "/diagnose";
  return (
    <div className="relative isolate overflow-hidden rounded-3xl bg-(image:--grad) p-6 text-white sm:p-7">
      <div
        aria-hidden
        className="absolute -right-16 -top-20 -z-10 size-64 rounded-full opacity-40 blur-3xl"
        style={{ background: "radial-gradient(circle, var(--glow-b), transparent 65%)" }}
      />
      <p className="font-display text-2xl font-semibold leading-tight">{title}</p>
      <p className="mt-1.5 text-white/85">{body}</p>
      <Button asChild size="lg" variant="secondary" className="mt-5 rounded-full bg-white text-foreground hover:bg-white/90">
        <Link href={href}>
          <Camera className="size-5" /> Diagnose it from a photo
        </Link>
      </Button>
      <p className="mt-3 text-sm text-white/75">First diagnosis free. No account needed.</p>
    </div>
  );
}
