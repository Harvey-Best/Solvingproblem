import { Check } from "lucide-react";

/** A plain question-and-answer list, styled like the pricing FAQ. */
export function PageFaq({ id, title = "Questions", faqs }: { id: string; title?: string; faqs: { q: string; a: string }[] }) {
  return (
    <section aria-labelledby={id} className="mt-12">
      <h2 id={id} className="font-display text-2xl font-semibold">
        {title}
      </h2>
      <div className="mt-4 divide-y rounded-2xl border bg-card">
        {faqs.map((f) => (
          <div key={f.q} className="p-4">
            <h3 className="flex items-start gap-2 font-semibold">
              <Check className="mt-0.5 size-4 shrink-0 text-primary" /> {f.q}
            </h3>
            <p className="mt-1.5 pl-6 text-[15px] leading-relaxed text-muted-foreground">{f.a}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
