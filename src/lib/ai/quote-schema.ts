import { z } from "zod";

/** What a proper quote should spell out. The UI renders these as a checklist. */
export const QUOTE_CHECKLIST = [
  { key: "scope", label: "Scope of work" },
  { key: "materials", label: "Materials & models" },
  { key: "permit", label: "Permits" },
  { key: "cleanup", label: "Cleanup & haul-away" },
  { key: "warranty", label: "Warranty" },
  { key: "payment_terms", label: "Payment terms" },
  { key: "timeline", label: "Timeline" },
  { key: "license_insurance", label: "License & insurance" },
] as const;

export const CHECK_STATUSES = ["included", "vague", "missing"] as const;
export type CheckStatus = (typeof CHECK_STATUSES)[number];

export const PRICE_ASSESSMENTS = ["below_typical", "within_typical", "above_typical", "cant_tell"] as const;
export type PriceAssessment = (typeof PRICE_ASSESSMENTS)[number];

const checkItem = z.object({
  status: z.enum(CHECK_STATUSES),
  note: z.string().describe("What the quote says about it, or why it matters if missing. One short sentence."),
});

export const quoteCheckSchema = z.object({
  title: z.string().describe('3-7 word name, e.g. "Water heater replacement quote"'),
  job_summary: z.string().describe("1-2 sentences: what this quote is for, as you read it"),
  readability: z.enum(["clear", "partial", "unreadable"]),
  contractor: z
    .object({
      name: z.string(),
      license_number: z.string(),
      phone_or_email: z.string(),
    })
    .describe('Exactly as printed. Use "" for anything not visible. Never guess.'),
  line_items: z
    .array(
      z.object({
        description: z.string(),
        amount: z.number().nullable().describe("USD as printed; null if not readable or not priced"),
        note: z.string().describe('Short comment, or "" if nothing to add'),
      })
    )
    .describe("Only items actually on the page, in order"),
  quote_total: z.number().nullable().describe("USD total as printed; null if not shown or not readable"),
  deposit_amount: z.number().nullable().describe("USD due up front; null if not stated"),
  deposit_percent: z.number().nullable().describe("Percent due up front if stated or computable; null otherwise"),
  checklist: z.object({
    scope: checkItem,
    materials: checkItem,
    permit: checkItem,
    cleanup: checkItem,
    warranty: checkItem,
    payment_terms: checkItem,
    timeline: checkItem,
    license_insurance: checkItem,
  }),
  red_flags: z
    .array(
      z.object({
        flag: z.string().describe("Short label"),
        severity: z.enum(["caution", "serious"]),
        explanation: z.string().describe("Why it matters and what to do, 1-2 sentences"),
      })
    )
    .describe("Most serious first. Empty if nothing is actually wrong."),
  typical_range: z.object({
    low: z.number().describe("USD"),
    high: z.number().describe("USD"),
    note: z.string().describe("What drives the range; must say it varies by region and access. Never one number."),
  }),
  price_assessment: z.enum(PRICE_ASSESSMENTS),
  price_assessment_note: z.string().describe("One sentence explaining the assessment"),
  questions_to_ask: z.array(z.string()).describe("3-6 specific questions to ask before signing"),
  bottom_line: z.string().describe("1-2 plain, hedged sentences on what to do next"),
});

export type QuoteCheck = z.infer<typeof quoteCheckSchema>;
