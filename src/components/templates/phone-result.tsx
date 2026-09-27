import { FaucetArt } from "@/components/templates/illustrations";
import { cn, cssVars } from "@/lib/utils";

/**
 * A miniature of the real result screen inside a phone frame. Colors follow
 * the template's --accent / --accent-soft variables.
 */
export function PhoneResult({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative w-[252px] shrink-0 rounded-[2.6rem] bg-[#15171c] p-[9px] shadow-[0_30px_60px_-20px_rgba(20,20,30,0.45)]",
        className
      )}
    >
      <div className="overflow-hidden rounded-[2.05rem] bg-white text-[#15171c]">
        <div className="flex items-center justify-between px-5 pb-1 pt-2.5 text-[10px] font-semibold">
          <span>9:41</span>
          <span className="h-[18px] w-[70px] rounded-full bg-[#15171c]" />
          <span className="flex items-end gap-[2px]">
            <span className="h-1.5 w-[3px] rounded-sm bg-current" />
            <span className="h-2 w-[3px] rounded-sm bg-current" />
            <span className="h-2.5 w-[3px] rounded-sm bg-current" />
          </span>
        </div>

        <div className="space-y-2.5 px-3.5 pb-5 pt-2 text-left">
          <div className="flex gap-1.5">
            {[0, 1].map((i) => (
              <div
                key={i}
                className="size-12 overflow-hidden rounded-lg border border-black/10"
                style={cssVars({
                  "--ill-ink": "#2a2d34",
                  "--ill-soft": i === 0 ? "#e9e4d8" : "#dcd6c8",
                  "--ill-accent": "var(--accent)",
                })}
              >
                <FaucetArt tiles className={cn("size-full", i === 1 && "scale-150")} />
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-1">
            <span className="rounded-full bg-(--accent-soft) px-2 py-0.5 text-[9px] font-semibold text-(--accent)">
              Fix soon
            </span>
            <span className="rounded-full border border-black/10 px-2 py-0.5 text-[9px] font-medium">
              Medium confidence
            </span>
          </div>

          <p className="text-[17px] font-bold leading-tight tracking-tight">Worn faucet cartridge</p>

          <div className="rounded-xl border border-black/10 p-2.5">
            <p className="text-[9px] font-semibold uppercase tracking-wide text-black/45">Most likely</p>
            <p className="mt-0.5 text-[10.5px] leading-snug text-black/75">
              The seals inside the handle cartridge have hardened, so water seeps past when it&apos;s off.
            </p>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-black/10 p-2.5">
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-wide text-black/45">Fix it yourself?</p>
              <p className="mt-0.5 text-[10.5px] text-black/75">30–45 min · basic tools</p>
            </div>
            <span className="rounded-full bg-(--accent) px-2.5 py-1 text-[10px] font-bold text-(--accent-ink)">DIY</span>
          </div>

          <div className="rounded-xl border border-black/10 p-2.5">
            <div className="flex items-start justify-between gap-2">
              <p className="text-[10.5px] font-medium leading-snug">Replacement cartridge</p>
              <p className="text-[10.5px] font-bold">$12–$35</p>
            </div>
            <div className="mt-1.5 flex gap-1">
              <span className="rounded bg-black/[0.06] px-1.5 py-0.5 text-[8.5px] font-medium">Home Depot ↗</span>
              <span className="rounded bg-black/[0.06] px-1.5 py-0.5 text-[8.5px] font-medium">Amazon ↗</span>
            </div>
          </div>

          <div className="rounded-xl bg-(--accent-soft) p-2.5">
            <p className="text-[9px] font-semibold uppercase tracking-wide text-(--accent)">A pro should charge</p>
            <p className="text-[22px] font-bold leading-tight tracking-tight">$150–$300</p>
            <p className="text-[9px] text-black/50">Typical range; varies by region and access.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
