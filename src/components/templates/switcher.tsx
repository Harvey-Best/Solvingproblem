"use client";

import { Fragment, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

export const TEMPLATES = [
  { slug: "cobalt", name: "Cobalt", swatch: "#2447F5", group: "solid" },
  { slug: "orange", name: "Orange", swatch: "#FF5A1F", group: "solid" },
  { slug: "green", name: "Green", swatch: "#0C7D4C", group: "solid" },
  { slug: "green-gradient", name: "Green Glow", swatch: "linear-gradient(120deg, #1F8A3B, #0B7F7A)", group: "gradient" },
  { slug: "purple", name: "Purple", swatch: "linear-gradient(120deg, #7C3AED, #2563EB)", group: "gradient" },
  { slug: "blue", name: "Blue", swatch: "linear-gradient(120deg, #1D4ED8, #0E7490)", group: "gradient" },
] as const;

/** Floating pill to flip between template previews on a phone. */
export function TemplateSwitcher() {
  const pathname = usePathname();
  const scroller = useRef<HTMLDivElement>(null);

  // Keep the current template's pill visible when the row scrolls on phones.
  useEffect(() => {
    scroller.current
      ?.querySelector<HTMLElement>('[aria-current="page"]')
      ?.scrollIntoView({ inline: "center", block: "nearest" });
  }, [pathname]);

  return (
    <nav
      aria-label="Template previews"
      className="fixed inset-x-0 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-50 flex justify-center px-3"
    >
      <div
        ref={scroller}
        className="flex max-w-full items-center gap-0.5 overflow-x-auto rounded-full border border-black/10 bg-white/90 p-1 text-xs shadow-lg shadow-black/10 backdrop-blur [scrollbar-width:none] sm:gap-1 sm:text-sm [&::-webkit-scrollbar]:hidden"
      >
        <Link
          href="/templates"
          aria-current={pathname === "/templates" ? "page" : undefined}
          className={cn(
            "shrink-0 rounded-full px-2.5 py-1 font-medium text-neutral-500 transition-colors hover:text-neutral-900 sm:px-3 sm:py-1.5",
            pathname === "/templates" && "bg-neutral-900 text-white hover:text-white"
          )}
        >
          All
        </Link>
        {TEMPLATES.map((t, i) => {
          const active = pathname === `/templates/${t.slug}`;
          const startsGroup = i > 0 && TEMPLATES[i - 1].group !== t.group;
          return (
            <Fragment key={t.slug}>
              {startsGroup && <span className="mx-1 h-4 w-px shrink-0 bg-black/15" aria-hidden />}
              <Link
                href={`/templates/${t.slug}`}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 font-medium text-neutral-600 transition-colors hover:text-neutral-900 sm:px-3 sm:py-1.5",
                  active && "bg-neutral-900 text-white hover:text-white"
                )}
              >
                <span className="size-2 rounded-full sm:size-2.5" style={{ background: t.swatch }} />
                {t.name}
              </Link>
            </Fragment>
          );
        })}
      </div>
    </nav>
  );
}
