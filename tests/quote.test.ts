import { describe, expect, it } from "vitest";

import { normalizeQuoteCheck } from "@/lib/ai/quote-guard";
import { MOCK_QUOTE } from "@/lib/ai/quote-mock";
import type { QuoteCheck } from "@/lib/ai/quote-schema";

const withLicense: QuoteCheck = {
  ...MOCK_QUOTE,
  contractor: { ...MOCK_QUOTE.contractor, license_number: "CA-1234567" },
  deposit_amount: 500,
  red_flags: [],
};

describe("normalizeQuoteCheck", () => {
  it("flags a deposit over 30%, computing the percent from the total", () => {
    const { quote, flags } = normalizeQuoteCheck(MOCK_QUOTE); // $1,200 of $2,350 = 51%
    expect(quote.deposit_percent).toBe(51);
    expect(flags).toContain("deposit_over_30");
    expect(quote.red_flags[0].flag).toMatch(/deposit over 30%/i);
    expect(quote.red_flags[0].severity).toBe("serious");
  });

  it("doesn't flag a deposit at or under 30%", () => {
    const { quote, flags } = normalizeQuoteCheck(withLicense); // $500 of $2,350 = 21%
    expect(flags).not.toContain("deposit_over_30");
    expect(quote.red_flags).toEqual([]);
  });

  it("doesn't duplicate a deposit flag the model already raised", () => {
    const { quote } = normalizeQuoteCheck({
      ...MOCK_QUOTE,
      red_flags: [{ flag: "Large deposit", severity: "serious", explanation: "51% up front is high." }],
    });
    expect(quote.red_flags.filter((f) => /deposit/i.test(f.flag))).toHaveLength(1);
  });

  it("uses deposit / total when the printed percent understates it", () => {
    const { quote, flags } = normalizeQuoteCheck({ ...withLicense, deposit_amount: 6000, deposit_percent: 30, quote_total: 10000 });
    expect(quote.deposit_percent).toBe(60);
    expect(flags).toContain("deposit_over_30");
  });

  it("isn't hidden by an unrelated model flag that mentions paying up front", () => {
    const { quote, flags } = normalizeQuoteCheck({
      ...withLicense,
      deposit_amount: 6000,
      quote_total: 10000,
      red_flags: [{ flag: "Cash only", severity: "caution", explanation: "They want cash up front for materials." }],
    });
    expect(flags).toContain("deposit_over_30");
    expect(quote.red_flags.map((f) => f.flag)).toEqual(["Deposit over 30%", "Cash only"]);
  });

  it("treats placeholder license text as missing", () => {
    for (const license_number of ["N/A", "pending", "Licensed & insured"]) {
      const { flags } = normalizeQuoteCheck({ ...withLicense, contractor: { ...withLicense.contractor, license_number } });
      expect(flags, license_number).toContain("no_license");
    }
  });

  it("flags a missing license number unless the quote is unreadable", () => {
    expect(normalizeQuoteCheck(MOCK_QUOTE).flags).toContain("no_license");
    expect(normalizeQuoteCheck({ ...MOCK_QUOTE, readability: "unreadable" }).flags).not.toContain("no_license");
    expect(normalizeQuoteCheck(withLicense).flags).not.toContain("no_license");
  });

  it("never returns a single-number typical range", () => {
    const { quote, flags } = normalizeQuoteCheck({
      ...withLicense,
      typical_range: { low: 2000, high: 2000, note: "n" },
    });
    expect(quote.typical_range.low).toBeLessThan(quote.typical_range.high);
    expect(flags).toContain("range_widened");
  });

  it("fixes an inverted range and keeps the label consistent with the numbers", () => {
    const { quote, flags } = normalizeQuoteCheck({
      ...withLicense,
      quote_total: 5000,
      typical_range: { low: 3200, high: 1800, note: "n" },
      price_assessment: "within_typical",
    });
    expect(quote.typical_range).toMatchObject({ low: 1800, high: 3200 });
    expect(quote.price_assessment).toBe("above_typical");
    expect(flags).toContain("assessment_recomputed");
  });

  it("leaves the label alone when there's no total to compare", () => {
    const { quote } = normalizeQuoteCheck({ ...withLicense, quote_total: null, price_assessment: "cant_tell" });
    expect(quote.price_assessment).toBe("cant_tell");
  });
});
