import Link from "next/link";
import { ChevronRight, FileText, Stethoscope } from "lucide-react";

import { PRICE_ASSESSMENT_META } from "@/components/quote/quote-result";
import { Badge } from "@/components/ui/badge";
import { categoryLabel, SEVERITY_META } from "@/lib/diagnosis-meta";
import type { HistoryItem } from "@/lib/history";
import { cn } from "@/lib/utils";

const dateFormat = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" });

function Row({ item }: { item: HistoryItem }) {
  const href = item.kind === "diagnosis" ? `/d/${item.id}` : `/q/${item.id}`;
  const badge =
    item.kind === "diagnosis"
      ? item.severity && SEVERITY_META[item.severity]
      : item.priceAssessment && PRICE_ASSESSMENT_META[item.priceAssessment];
  const Icon = item.kind === "diagnosis" ? Stethoscope : FileText;

  return (
    <li>
      <Link
        href={href}
        className="group flex items-center gap-3 rounded-2xl border bg-card p-3 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-[0_14px_30px_-22px_var(--primary)] active:scale-[0.99]"
      >
        <div className="grid size-16 shrink-0 place-items-center overflow-hidden rounded-xl bg-(image:--grad-soft)">
          {item.thumbUrl ? (
            // eslint-disable-next-line @next/next/no-img-element -- short-lived signed URL
            <img src={item.thumbUrl} alt="" className="size-full object-cover" />
          ) : (
            <Icon className="size-6 text-primary" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold">{item.title}</p>
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Icon className="size-3" />
            {item.kind === "diagnosis" ? categoryLabel(item.category) : "Quote check"} ·{" "}
            {dateFormat.format(new Date(item.createdAt))}
          </p>
          {badge && (
            <Badge variant="outline" className={cn("mt-1.5 text-[11px]", badge.className)}>
              {badge.label}
            </Badge>
          )}
        </div>
        <ChevronRight className="size-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
      </Link>
    </li>
  );
}

export function HistoryList({ items }: { items: HistoryItem[] }) {
  return (
    <ul className="mt-6 space-y-3">
      {items.map((item) => (
        <Row key={`${item.kind}-${item.id}`} item={item} />
      ))}
    </ul>
  );
}
