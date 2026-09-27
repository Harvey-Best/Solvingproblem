/**
 * Enums + display labels shared by the model schema, the API and the UI.
 * No runtime deps so client components can import it cheaply.
 */

export const CATEGORIES = [
  { id: "plumbing", label: "Plumbing", emoji: "🚰" },
  { id: "electrical", label: "Electrical", emoji: "⚡" },
  { id: "hvac", label: "HVAC", emoji: "🌡️" },
  { id: "walls_paint", label: "Walls & Paint", emoji: "🧱" },
  { id: "roof_gutters", label: "Roof & Gutters", emoji: "🏠" },
  { id: "appliances", label: "Appliances", emoji: "🔌" },
  { id: "doors_windows", label: "Doors & Windows", emoji: "🚪" },
  { id: "outdoor", label: "Outdoor", emoji: "🌳" },
  { id: "not_sure", label: "Not sure", emoji: "🤔" },
] as const;

export type CategoryId = (typeof CATEGORIES)[number]["id"];
export const CATEGORY_IDS = CATEGORIES.map((c) => c.id) as [CategoryId, ...CategoryId[]];

/** What the model classifies into ("not_sure" is a user answer, not a diagnosis). */
export const MODEL_CATEGORY_IDS = [
  "plumbing",
  "electrical",
  "hvac",
  "walls_paint",
  "roof_gutters",
  "appliances",
  "doors_windows",
  "outdoor",
  "other",
] as const;
export type ModelCategoryId = (typeof MODEL_CATEGORY_IDS)[number];

export function categoryLabel(id: string | null | undefined): string {
  if (id === "other") return "Other";
  return CATEGORIES.find((c) => c.id === id)?.label ?? "Other";
}

export const SEVERITIES = ["cosmetic", "fix_soon", "urgent", "call_pro_now"] as const;
export type Severity = (typeof SEVERITIES)[number];

export const SEVERITY_META: Record<Severity, { label: string; className: string; blurb: string }> = {
  cosmetic: {
    label: "Cosmetic",
    className: "bg-emerald-100 text-emerald-900 border-emerald-200",
    blurb: "Looks bad, but it isn't hurting anything.",
  },
  fix_soon: {
    label: "Fix soon",
    className: "bg-amber-100 text-amber-900 border-amber-200",
    blurb: "Not an emergency, but it'll get worse or cost more if you wait.",
  },
  urgent: {
    label: "Urgent",
    className: "bg-orange-100 text-orange-900 border-orange-300",
    blurb: "Deal with this in the next day or two.",
  },
  call_pro_now: {
    label: "Stop and call a pro now",
    className: "bg-red-600 text-white border-red-700",
    blurb: "Safety risk. Follow the steps below first, then call a professional.",
  },
};

export const DIY_VERDICTS = ["diy", "diy_if_handy", "call_pro"] as const;
export type DiyVerdict = (typeof DIY_VERDICTS)[number];

export const DIY_VERDICT_META: Record<DiyVerdict, { label: string; className: string }> = {
  diy: { label: "DIY", className: "bg-emerald-600 text-white" },
  diy_if_handy: { label: "DIY if handy", className: "bg-amber-500 text-white" },
  call_pro: { label: "Call a pro", className: "bg-slate-800 text-white" },
};

export const CONFIDENCE_LEVELS = ["low", "medium", "high"] as const;
export type Confidence = (typeof CONFIDENCE_LEVELS)[number];

export const CONFIDENCE_LABEL: Record<Confidence, string> = {
  low: "Low confidence",
  medium: "Medium confidence",
  high: "High confidence",
};

export const HAZARDS = [
  "gas",
  "carbon_monoxide",
  "electrical",
  "water_near_electrical",
  "structural",
  "mold",
  "fire",
  "other",
] as const;
export type Hazard = (typeof HAZARDS)[number];

export const HAZARD_LABEL: Record<Hazard, string> = {
  gas: "Gas",
  carbon_monoxide: "Carbon monoxide",
  electrical: "Electrical",
  water_near_electrical: "Water near electrical",
  structural: "Structural",
  mold: "Mold exposure",
  fire: "Fire",
  other: "Safety",
};
