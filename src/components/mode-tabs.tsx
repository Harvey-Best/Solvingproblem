import Link from "next/link";

import { cn } from "@/lib/utils";

/** The two modes of the app: diagnose a problem, or check a contractor's quote. */
export function ModeTabs({ active }: { active: "diagnose" | "quote" }) {
  const tab = (key: "diagnose" | "quote", href: string, label: string) => (
    <Link
      href={href}
      aria-current={active === key ? "page" : undefined}
      className={cn(
        // 44px tall, and small enough on phones that "Diagnose a problem" stays on one line at 360px.
        "flex min-h-11 items-center justify-center whitespace-nowrap rounded-full px-2 text-center text-[13px] transition-all duration-200 sm:px-3 sm:text-sm",
        active === key
          ? "bg-(image:--grad) text-primary-foreground shadow-[0_8px_18px_-12px_var(--primary)]"
          : "text-muted-foreground hover:text-foreground"
      )}
    >
      {label}
    </Link>
  );
  return (
    <nav aria-label="Mode" className="grid grid-cols-2 gap-1 rounded-full border bg-card p-1 font-semibold">
      {tab("diagnose", "/diagnose", "Diagnose a problem")}
      {tab("quote", "/quote", "Check a quote")}
    </nav>
  );
}
