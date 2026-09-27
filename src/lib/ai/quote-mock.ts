import type { QuoteCheck } from "@/lib/ai/quote-schema";

/** Canned quote review for AI_MOCK=1 and the dev preview. */
export const MOCK_QUOTE: QuoteCheck = {
  title: "Water heater replacement quote",
  job_summary:
    "Replace a 40-gallon gas water heater with a new 50-gallon gas unit, including labor and haul-away of the old tank.",
  readability: "clear",
  contractor: { name: "Reliable Plumbing & Drain", license_number: "", phone_or_email: "(555) 201-4410" },
  line_items: [
    { description: "50-gal gas water heater", amount: 1450, note: "Brand and model not listed" },
    { description: "Labor: remove old, install new", amount: 900, note: "" },
    { description: "Haul away old tank", amount: 0, note: "Listed as included" },
    { description: "New flex gas line and venting", amount: null, note: "Mentioned, no price shown" },
  ],
  quote_total: 2350,
  deposit_amount: 1200,
  deposit_percent: null,
  checklist: {
    scope: { status: "included", note: "Remove old tank, install new 50-gal gas unit." },
    materials: { status: "vague", note: "Says \"50-gal gas heater\" with no brand, model, or efficiency rating." },
    permit: { status: "missing", note: "Water heater swaps usually need a permit; the quote doesn't mention one." },
    cleanup: { status: "included", note: "Haul-away of the old tank is listed." },
    warranty: { status: "vague", note: "Says \"manufacturer warranty\" but nothing about labor." },
    payment_terms: { status: "included", note: "$1,200 due at signing, balance on completion." },
    timeline: { status: "missing", note: "No start date or install time." },
    license_insurance: { status: "missing", note: "No license number or insurance info on the page." },
  },
  red_flags: [
    {
      flag: "No permit mentioned",
      severity: "caution",
      explanation: "Most areas require a permit for gas water heaters. Ask who pulls it and whether it's in the price.",
    },
  ],
  typical_range: {
    low: 1800,
    high: 3200,
    note: "Typical range for a 50-gal gas unit installed; varies by region and access. Higher if venting or gas lines need upgrades.",
  },
  price_assessment: "within_typical",
  price_assessment_note: "The total sits in the middle of the typical range for this job.",
  questions_to_ask: [
    "What brand and model is the water heater, and what's its warranty?",
    "Is the permit included in the $2,350? Who pulls it?",
    "What's your labor warranty on the install?",
    "Can the deposit be lower, with the rest due after inspection?",
    "What's your license number, and can you send proof of insurance?",
  ],
  bottom_line:
    "The price looks reasonable for this job. Get the permit, model, and labor warranty in writing and ask to lower the deposit before you sign.",
};
