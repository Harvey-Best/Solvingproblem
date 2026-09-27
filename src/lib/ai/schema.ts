import { z } from "zod";

import {
  CONFIDENCE_LEVELS,
  DIY_VERDICTS,
  HAZARDS,
  MODEL_CATEGORY_IDS,
  SEVERITIES,
} from "@/lib/diagnosis-meta";

/**
 * The strict JSON contract the model must return. It's sent to the API as a
 * structured-output schema, then re-validated here, so the UI can trust it.
 * Keep it to plain types: structured outputs doesn't support length/size
 * constraints, so limits are applied in normalizeDiagnosis() instead.
 */
export const diagnosisSchema = z.object({
  title: z
    .string()
    .describe('3-6 word name for the problem, e.g. "Worn faucet cartridge"'),
  category: z.enum(MODEL_CATEGORY_IDS),
  likely_cause: z
    .string()
    .describe("1-2 sentences: the most likely cause, hedged appropriately"),
  confidence: z.enum(CONFIDENCE_LEVELS),
  alternative_causes: z
    .array(
      z.object({
        cause: z.string(),
        how_to_tell: z.string().describe("A quick check the homeowner can do to rule it in or out"),
      })
    )
    .describe("0-3 other plausible causes"),
  severity: z.enum(SEVERITIES),
  severity_reason: z.string().describe("One sentence explaining the severity"),
  safety_warnings: z
    .array(
      z.object({
        hazard: z.enum(HAZARDS),
        warning: z.string().describe("What to do or avoid, in one or two plain sentences"),
      })
    )
    .describe("Empty if there is no real hazard. Most urgent first."),
  diy_verdict: z.enum(DIY_VERDICTS),
  diy_verdict_reason: z.string().describe("One line on why"),
  time_estimate: z
    .string()
    .describe('Rough DIY time like "20-30 minutes". Empty string if call_pro.'),
  diy_steps: z
    .array(z.string())
    .describe("Numbered-order steps in plain language. Empty if call_pro_now."),
  tools_needed: z.array(z.string()),
  parts: z.array(
    z.object({
      name: z.string(),
      price_low: z.number().describe("USD"),
      price_high: z.number().describe("USD"),
      search_query: z
        .string()
        .describe("Specific search string for Home Depot / Amazon, e.g. \"Moen 1225 replacement cartridge\""),
    })
  ),
  pro_cost_range: z.object({
    low: z.number().describe("USD, parts + labor"),
    high: z.number().describe("USD, parts + labor"),
    note: z.string().describe("What drives the range. Never a single figure."),
  }),
  what_to_tell_the_pro: z
    .string()
    .describe("2-3 sentences in the homeowner's voice to say on the phone"),
  follow_up_questions: z
    .array(z.string())
    .describe("0-4 questions whose answers would most change or firm up the diagnosis"),
  what_changed: z
    .string()
    .describe(
      "Follow-ups only: 1-2 sentences on what changed from your previous answer and why. Empty string on the first diagnosis."
    ),
});

export type Diagnosis = z.infer<typeof diagnosisSchema>;
