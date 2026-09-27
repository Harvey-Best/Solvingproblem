"use client";

import { useEffect, useState } from "react";
import { Stethoscope } from "lucide-react";

const DIAGNOSIS_MESSAGES = [
  "Looking closely at your photos…",
  "Checking for anything unsafe…",
  "Working out the most likely cause…",
  "Pricing parts and pro labor…",
  "Writing up your fix…",
];

export function DiagnosingOverlay({ messages = DIAGNOSIS_MESSAGES }: { messages?: string[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => Math.min(i + 1, messages.length - 1)), 5000);
    return () => clearInterval(id);
  }, [messages.length]);

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 bg-background/95 px-6 text-center backdrop-blur-sm"
    >
      <div className="relative grid size-24 place-items-center">
        <span className="absolute inset-0 animate-ping rounded-full bg-(--glow-a)/40" />
        <span className="absolute inset-2 rounded-full bg-(image:--grad) shadow-[0_12px_30px_-10px_var(--primary)]" />
        <Stethoscope className="relative size-10 text-white" />
      </div>
      <div className="space-y-2">
        <p key={index} className="animate-in fade-in slide-in-from-bottom-1 font-display text-2xl font-semibold duration-500">
          {messages[index]}
        </p>
        <p className="text-sm text-muted-foreground">This usually takes 20–40 seconds. Keep this screen open.</p>
      </div>
      <div className="h-1.5 w-56 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-(image:--grad) transition-[width] duration-[5000ms] ease-linear"
          style={{ width: `${Math.min(95, ((index + 1) / messages.length) * 95)}%` }}
        />
      </div>
    </div>
  );
}
