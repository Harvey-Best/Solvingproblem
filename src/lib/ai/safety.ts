import type { Diagnosis } from "@/lib/ai/schema";
import type { Hazard } from "@/lib/diagnosis-meta";

/**
 * Deterministic safety net on top of the model. If the homeowner's own words
 * report one of the "stop and call a pro now" hazards, we force the result to
 * escalate even if the model under-called it. The model is still responsible
 * for hazards it can only see in the photos.
 *
 * Patterns are deliberately specific: over-escalating a chirping smoke
 * detector or a stove igniter would teach people to ignore the red banner.
 */

type EscalatingHazard = Extract<
  Hazard,
  "gas" | "carbon_monoxide" | "electrical" | "water_near_electrical" | "structural"
>;

// Characters allowed between two related words: same sentence, short gap.
const GAP = (n: number) => `[^.!?\\n]{0,${n}}`;
const ELEC = String.raw`(?:outlets?|switch(?:es)?|panel|breakers?|wires?|wiring|plugs?|sockets?|fixtures?|electrical|light switch|cords?)`;
const ELEC_WET = String.raw`(?:outlets?|electrical panel|breaker (?:box|panel)|fuse box|panel box|light fixtures?|ceiling lights?|junction box|sockets?|power strips?|wiring|light switch)`;
const WATER = String.raw`(?:water(?!\s*(?:heater|softener|pressure|filter|bill|line))|leak\w*|drip\w*|flood\w*|wet|puddl\w*|pooling)`;
const STRUCT = String.raw`(?:ceiling|beams?|joists?|floors?|roof(?:line)?|walls?|foundation|header|deck|balcony|stairs?|staircase)`;
const FAILING = String.raw`(?:sag\w*|bow(?:ing|ed|s)?|buckl\w*|collaps\w*|caving|giving way)`;

function both(a: string, b: string, gap: number) {
  return new RegExp(`\\b${a}\\b${GAP(gap)}\\b${b}\\b|\\b${b}\\b${GAP(gap)}\\b${a}\\b`, "i");
}

const RULES: { hazard: EscalatingHazard; patterns: RegExp[]; unless?: RegExp }[] = [
  {
    hazard: "gas",
    patterns: [
      new RegExp(
        String.raw`\b(?:smell\w*|odou?r|whiff)\b${GAP(25)}\b(?:gas|propane|rotten eggs?|sulfur|sulphur)\b`,
        "i"
      ),
      /\b(?:gas|propane)\s+(?:is\s+)?(?:smell|odou?r|leak)\w*/i,
      /\bleak\w*\s+(?:of\s+)?(?:gas|propane)\b/i,
      /\brotten[- ]eggs?\b/i,
      new RegExp(String.raw`\bhiss\w*\b${GAP(30)}\bgas (?:line|pipe|meter|valve)\b`, "i"),
    ],
  },
  {
    hazard: "carbon_monoxide",
    patterns: [
      /\bcarbon monoxide\b/i,
      /\bco\s+(?:alarm|detector|monitor|reading)s?\b/i,
    ],
    // A chirp is almost always a low battery / end-of-life signal, not CO.
    unless: /\bchirp/i,
  },
  {
    hazard: "electrical",
    patterns: [
      /\bspark(?:s|ed|ing)?\b(?!\s*plugs?)/i,
      /\barc(?:ing|ed)\b/i,
      /\b(?:got|get|getting)\s+(?:a\s+)?shock(?:ed)?\b|\bshocked me\b/i,
      both(String.raw`(?:burning|burnt|scorch\w*|melt\w*|smok\w*)`, ELEC, 30),
      both(ELEC, String.raw`(?:hot to the touch|too hot to touch)`, 20),
    ],
    // Stove/grill igniters spark by design.
    unless: /\b(?:ignit\w*|stove|burner|cooktop|range|grill|spark plugs?|lighter)\b/i,
  },
  {
    hazard: "water_near_electrical",
    patterns: [both(WATER, ELEC_WET, 40)],
  },
  {
    hazard: "structural",
    patterns: [both(FAILING, STRUCT, 30)],
  },
];

export function detectTextHazards(text: string): EscalatingHazard[] {
  if (!text.trim()) return [];
  const found: EscalatingHazard[] = [];
  for (const rule of RULES) {
    if (rule.unless?.test(text)) continue;
    if (rule.patterns.some((p) => p.test(text))) found.push(rule.hazard);
  }
  return found;
}

export const EMERGENCY_STEPS: Record<EscalatingHazard, string[]> = {
  gas: [
    "Get everyone out of the house now.",
    "Don't flip light switches, unplug anything, light a flame, or start a car in an attached garage.",
    "From outside, call your gas company's emergency line or 911.",
    "Don't go back in until the gas company or fire department says it's safe.",
  ],
  carbon_monoxide: [
    "Get everyone, including pets, outside into fresh air now.",
    "Call 911 from outside. If anyone has a headache, dizziness, or nausea, tell the dispatcher.",
    "Don't go back in until the fire department says it's safe.",
    "Have a licensed HVAC tech inspect fuel-burning appliances before using them again.",
  ],
  electrical: [
    "Don't touch the outlet, switch, or wires.",
    "If you can reach your electrical panel while standing somewhere dry, switch off the breaker for that circuit (or the main).",
    "If you see smoke or flames, get out and call 911.",
    "Have a licensed electrician check it before using that circuit again.",
  ],
  water_near_electrical: [
    "Stay out of any standing water.",
    "If you can reach the panel without touching water, switch off power to the affected area.",
    "Shut off the water at the main shutoff valve if you can reach it safely.",
    "Call an electrician and a plumber before turning that power back on.",
  ],
  structural: [
    "Keep everyone out from under (or off of) the sagging area.",
    "If water is involved, catch it with buckets and shut off the source.",
    "Move valuables out of the area only if it's safe to do so.",
    "Call a general contractor or structural engineer today.",
  ],
};

const GUARD_WARNINGS: Record<EscalatingHazard, string> = {
  gas: "You mentioned a gas smell. Treat it as a leak: leave the house and call the gas company from outside.",
  carbon_monoxide:
    "You mentioned carbon monoxide. Get everyone into fresh air and call 911 before doing anything else.",
  electrical:
    "Sparking, burning, or a shock means a live fault. Don't touch it; cut power at the breaker if you can do it safely.",
  water_near_electrical:
    "Water and electricity together can electrocute. Stay out of the water and cut the power if you can reach the panel safely.",
  structural:
    "Sagging or bowing structure can give way without warning. Keep people out from under it.",
};

const LIMITS = {
  alternative_causes: 4,
  safety_warnings: 5,
  diy_steps: 15,
  tools_needed: 12,
  parts: 8,
  follow_up_questions: 4,
};

function cleanRange(low: number, high: number) {
  const a = Math.max(0, Number.isFinite(low) ? low : 0);
  const b = Math.max(0, Number.isFinite(high) ? high : 0);
  return a <= b ? { low: a, high: b } : { low: b, high: a };
}

/**
 * Makes a schema-valid diagnosis safe to render: trims runaway lists, fixes
 * inverted price ranges, keeps severity/verdict consistent, and applies the
 * text-based safety escalation. Returns which hazards the guard escalated so
 * we can log them for review.
 */
export function normalizeDiagnosis(
  input: Diagnosis,
  userText: string
): { diagnosis: Diagnosis; overrides: EscalatingHazard[] } {
  const d: Diagnosis = {
    ...input,
    alternative_causes: input.alternative_causes.slice(0, LIMITS.alternative_causes),
    safety_warnings: input.safety_warnings.slice(0, LIMITS.safety_warnings),
    diy_steps: input.diy_steps.slice(0, LIMITS.diy_steps),
    tools_needed: input.tools_needed.slice(0, LIMITS.tools_needed),
    parts: input.parts.slice(0, LIMITS.parts).map((p) => {
      const { low, high } = cleanRange(p.price_low, p.price_high);
      return { ...p, price_low: low, price_high: high };
    }),
    pro_cost_range: {
      ...input.pro_cost_range,
      ...cleanRange(input.pro_cost_range.low, input.pro_cost_range.high),
    },
    follow_up_questions: input.follow_up_questions.slice(0, LIMITS.follow_up_questions),
  };

  const hazards = detectTextHazards(userText);
  const overrides: EscalatingHazard[] = [];

  if (hazards.length > 0 && d.severity !== "call_pro_now") {
    // The model gave a non-emergency answer to an emergency description.
    // Replace its DIY steps with the standard "do this now" steps.
    overrides.push(...hazards);
    d.severity = "call_pro_now";
    d.severity_reason = `You described a possible ${hazards
      .map((h) => h.replace(/_/g, " "))
      .join(" and ")} hazard, which we always treat as an emergency until a professional has checked it.`;
    d.diy_steps = hazards.flatMap((h) => EMERGENCY_STEPS[h]);
    d.time_estimate = "";
  }

  for (const hazard of hazards) {
    if (!d.safety_warnings.some((w) => w.hazard === hazard)) {
      d.safety_warnings = [{ hazard, warning: GUARD_WARNINGS[hazard] }, ...d.safety_warnings];
      if (!overrides.includes(hazard)) overrides.push(hazard);
    }
  }

  if (d.severity === "call_pro_now" && d.diy_verdict !== "call_pro") {
    d.diy_verdict = "call_pro";
    d.diy_verdict_reason = "This is a safety issue, so it's a job for a licensed professional.";
    d.time_estimate = "";
  }

  return { diagnosis: d, overrides };
}
