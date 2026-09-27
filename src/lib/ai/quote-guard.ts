import type { PriceAssessment, QuoteCheck } from "@/lib/ai/quote-schema";

/**
 * Deterministic checks on top of the model, so the rules the product promises
 * hold no matter what the model wrote:
 *  - a deposit over 30% is always flagged, using the higher of the printed
 *    percent and deposit / total,
 *  - a missing license number is always flagged ("N/A" counts as missing),
 *  - the typical range is always a real range (never one number),
 *  - the above/within/below label always agrees with the numbers shown.
 * Returns which rules fired so they can be logged for review.
 */
export type QuoteGuardFlag = "deposit_over_30" | "no_license" | "range_widened" | "assessment_recomputed";

const LIMITS = { line_items: 40, red_flags: 8, questions_to_ask: 8 };

export const DEPOSIT_GUIDELINE_PERCENT = 30;

function assessmentFor(total: number, low: number, high: number): PriceAssessment {
  if (total < low) return "below_typical";
  if (total > high) return "above_typical";
  return "within_typical";
}

export function normalizeQuoteCheck(input: QuoteCheck): { quote: QuoteCheck; flags: QuoteGuardFlag[] } {
  const flags: QuoteGuardFlag[] = [];
  const q: QuoteCheck = {
    ...input,
    line_items: input.line_items.slice(0, LIMITS.line_items),
    red_flags: input.red_flags.slice(0, LIMITS.red_flags),
    questions_to_ask: input.questions_to_ask.slice(0, LIMITS.questions_to_ask),
    contractor: { ...input.contractor },
    typical_range: { ...input.typical_range },
  };

  // Typical range: non-negative, ordered, and never a single number.
  let low = Math.max(0, input.typical_range.low || 0);
  let high = Math.max(0, input.typical_range.high || 0);
  if (low > high) [low, high] = [high, low];
  if (high > 0 && Math.round(low) === Math.round(high)) {
    low = Math.round(low * 0.85);
    high = Math.round(high * 1.15);
    flags.push("range_widened");
  }
  q.typical_range.low = low;
  q.typical_range.high = high;

  // Deposit percent: the quote is the contractor's own document, so a printed
  // percent is only trusted when the amounts don't say it's higher.
  const total = q.quote_total && q.quote_total > 0 ? q.quote_total : null;
  if (q.deposit_amount != null && q.deposit_amount > 0 && total) {
    const computed = Math.round((q.deposit_amount / total) * 100);
    q.deposit_percent = Math.max(q.deposit_percent ?? 0, computed);
  }
  // Our flag replaces any the model raised on the same topic (matched on the
  // label only, so an unrelated flag that mentions "up front" can't hide it).
  const withoutModelFlags = (re: RegExp) => q.red_flags.filter((f) => !re.test(f.flag));
  if (q.deposit_percent != null && q.deposit_percent > DEPOSIT_GUIDELINE_PERCENT) {
    q.red_flags = [
      {
        flag: `Deposit over ${DEPOSIT_GUIDELINE_PERCENT}%`,
        severity: q.deposit_percent > 50 ? "serious" : "caution",
        explanation: `This quote asks for about ${Math.round(q.deposit_percent)}% up front. A common guideline is ${DEPOSIT_GUIDELINE_PERCENT}% or less (some states cap it). Ask to tie payments to finished milestones.`,
      },
      ...withoutModelFlags(/deposit|down payment/i),
    ];
    flags.push("deposit_over_30");
  }

  // "N/A", "pending" or "licensed & insured" aren't license numbers.
  const hasLicenseNumber = /\d{3,}/.test(q.contractor.license_number);
  if (!hasLicenseNumber && q.readability !== "unreadable") {
    q.red_flags = [
      ...withoutModelFlags(/licen[cs]e/i),
      {
        flag: "No license number on the quote",
        severity: "caution",
        explanation:
          "Ask for their state license number and look it up before signing. It may just be on a page you didn't photograph.",
      },
    ];
    flags.push("no_license");
  }

  // Keep the label consistent with the numbers the page shows side by side.
  if (total && high > 0) {
    const computed = assessmentFor(total, low, high);
    if (computed !== q.price_assessment) {
      q.price_assessment = computed;
      flags.push("assessment_recomputed");
    }
  }

  return { quote: q, flags };
}
