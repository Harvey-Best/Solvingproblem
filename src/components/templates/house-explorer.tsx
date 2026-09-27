"use client";

import { useState } from "react";

import { HOUSE_HOTSPOTS, HouseCutawayArt } from "@/components/templates/illustrations";
import { cn } from "@/lib/utils";

const SPOTS: Record<
  keyof typeof HOUSE_HOTSPOTS,
  { symptom: string; cause: string; detail: string; verdict: string; price: string; priceLabel: string }
> = {
  faucet: {
    symptom: "Kitchen faucet drips",
    cause: "Worn cartridge",
    detail: "30-minute swap. A plumber would charge $150–$300.",
    verdict: "DIY",
    price: "$12",
    priceLabel: "part",
  },
  heater: {
    symptom: "Water heater pops and rumbles",
    cause: "Sediment buildup",
    detail: "Flush the tank with a garden hose. About an hour.",
    verdict: "DIY if handy",
    price: "$0",
    priceLabel: "garden hose",
  },
  breaker: {
    symptom: "Breaker trips every morning",
    cause: "Overloaded circuit",
    detail: "Needs an electrician. We'll tell you what to say.",
    verdict: "Call a pro",
    price: "$150+",
    priceLabel: "typical visit",
  },
  toilet: {
    symptom: "Toilet keeps running",
    cause: "Worn flapper",
    detail: "Ten minutes, no tools. Saves a few hundred gallons a month.",
    verdict: "DIY",
    price: "$8",
    priceLabel: "part",
  },
  crack: {
    symptom: "Hairline crack above a door",
    cause: "Normal settling",
    detail: "Cosmetic. Tape, mud, and paint. Watch it if it grows.",
    verdict: "DIY",
    price: "$15",
    priceLabel: "patch kit",
  },
};

type SpotId = keyof typeof SPOTS;

export function HouseExplorer() {
  const [active, setActive] = useState<SpotId>("faucet");
  const spot = SPOTS[active];

  return (
    <div className="rounded-3xl border-2 border-(--ink) bg-[#FFFBF4] p-4 shadow-[8px_8px_0_0_var(--ink)] sm:p-5">
      <div className="flex items-center justify-between px-1 pb-2">
        <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-(--muted)">Tap a problem</p>
        <p className="font-mono text-[11px] text-(--muted)">Examples</p>
      </div>

      <div className="relative">
        <HouseCutawayArt className="w-full" />
        {(Object.keys(HOUSE_HOTSPOTS) as SpotId[]).map((id) => {
          const { x, y } = HOUSE_HOTSPOTS[id];
          const selected = id === active;
          return (
            <button
              key={id}
              type="button"
              onClick={() => setActive(id)}
              aria-pressed={selected}
              aria-label={SPOTS[id].symptom}
              className="group absolute grid size-9 -translate-x-1/2 -translate-y-1/2 cursor-pointer place-items-center"
              style={{ left: `${(x / 360) * 100}%`, top: `${(y / 320) * 100}%` }}
            >
              {!selected && <span className="t-pulse absolute inset-1.5 rounded-full bg-(--accent)" />}
              <span
                className={cn(
                  "relative grid place-items-center rounded-full border-2 border-(--ink) transition-all duration-200 group-hover:scale-110 group-active:scale-90",
                  selected ? "size-6 bg-(--ink)" : "size-4 bg-(--accent)"
                )}
              >
                {selected && <span className="size-2 rounded-full bg-(--accent)" />}
              </span>
            </button>
          );
        })}
      </div>

      <div
        key={active}
        className="t-rise mt-3 flex items-stretch overflow-hidden rounded-2xl border-2 border-(--ink) bg-(--bg)"
      >
        <div className="min-w-0 flex-1 p-4">
          <p className="font-mono text-[11px] uppercase tracking-wider text-(--muted)">{spot.symptom}</p>
          <p className="mt-1 text-xl font-extrabold leading-tight tracking-tight">{spot.cause}</p>
          <p className="mt-1 text-sm leading-snug text-(--muted)">{spot.detail}</p>
        </div>
        <div className="flex w-28 shrink-0 flex-col items-center justify-center border-l-2 border-dashed border-(--ink) bg-(--accent) px-2 py-3 text-center">
          <span className="text-[10px] font-bold uppercase tracking-wide">{spot.verdict}</span>
          <span className="text-3xl font-extrabold leading-none tracking-tight">{spot.price}</span>
          <span className="mt-0.5 text-[10px] font-medium">{spot.priceLabel}</span>
        </div>
      </div>
    </div>
  );
}
