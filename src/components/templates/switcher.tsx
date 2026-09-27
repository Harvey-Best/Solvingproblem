"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

export const TEMPLATES = [
  { slug: "cobalt", name: "Cobalt", color: "#2447F5" },
  { slug: "orange", name: "Orange", color: "#FF5A1F" },
  { slug: "green", name: "Green", color: "#0C7D4C" },
] as const;

/** Floating pill to flip between template previews on a phone. */
export function TemplateSwitcher() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Template previews"
      className="fixed inset-x-0 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-50 flex justify-center px-3"
    >
      <div className="flex items-center gap-0.5 rounded-full border border-black/10 bg-white/90 p-1 text-xs shadow-lg shadow-black/10 backdrop-blur sm:gap-1 sm:text-sm">
        <Link
          href="/templates"
          className={cn(
            "rounded-full px-2.5 py-1 font-medium text-neutral-500 transition-colors hover:text-neutral-900 sm:px-3 sm:py-1.5",
            pathname === "/templates" && "bg-neutral-900 text-white hover:text-white"
          )}
        >
          All
        </Link>
        {TEMPLATES.map((t) => {
          const active = pathname === `/templates/${t.slug}`;
          return (
            <Link
              key={t.slug}
              href={`/templates/${t.slug}`}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center gap-1.5 rounded-full px-2.5 py-1 font-medium text-neutral-600 transition-colors hover:text-neutral-900 sm:px-3 sm:py-1.5",
                active && "bg-neutral-900 text-white hover:text-white"
              )}
            >
              <span className="size-2 rounded-full sm:size-2.5" style={{ background: t.color }} />
              {t.name}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
