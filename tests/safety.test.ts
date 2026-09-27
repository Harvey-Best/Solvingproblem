import { describe, expect, it } from "vitest";

import { MOCK_DIAGNOSIS } from "@/lib/ai/mock";
import { detectTextHazards, EMERGENCY_STEPS, normalizeDiagnosis } from "@/lib/ai/safety";
import type { Diagnosis } from "@/lib/ai/schema";

describe("detectTextHazards", () => {
  it.each([
    ["I smell gas near the stove", "gas"],
    ["there's a rotten egg smell in the basement", "gas"],
    ["Possible gas leak by the meter", "gas"],
    ["smells like propane in the garage", "gas"],
    ["the carbon monoxide alarm is going off", "carbon_monoxide"],
    ["CO detector beeping 4 times", "carbon_monoxide"],
    ["outlet sparks when I plug in the vacuum", "electrical"],
    ["burning smell coming from the outlet in the kitchen", "electrical"],
    ["the light switch plate is hot to the touch", "electrical"],
    ["I got shocked touching the dryer", "electrical"],
    ["scorch marks around the socket", "electrical"],
    ["water dripping from the ceiling light", "water_near_electrical"],
    ["water leaking into the electrical panel", "water_near_electrical"],
    ["the ceiling is sagging after the leak upstairs", "structural"],
    ["basement wall is bowing inward", "structural"],
    // Exemptions only apply to the sentence and pattern they were written for.
    ["The outlet behind the stove is sparking and smells like burning plastic", "electrical"],
    ["Kitchen outlet next to the range stopped working.\nNow it's sparking when I plug things in", "electrical"],
    ["The stove clicks. Also the burning smell is coming from the outlet", "electrical"],
    ["It's not chirping, the carbon monoxide alarm is going off nonstop and we have headaches", "carbon_monoxide"],
    ["The CO detector chirped once. Now we all have headaches", "carbon_monoxide"],
  ])("flags %j as %s", (text, hazard) => {
    expect(detectTextHazards(text)).toContain(hazard);
  });

  it.each([
    "my gas water heater makes a popping noise",
    "gas water heater leaking water from the bottom",
    "the CO detector keeps chirping every minute",
    "smoke detector chirping",
    "my stove igniter keeps sparking and clicking",
    "The range was installed last year. The burner igniter keeps sparking",
    "lawn mower won't start, maybe the spark plug",
    "burning smell the first time the furnace turns on this fall",
    "the gutter is sagging at one end",
    "hairline crack in the drywall above the door",
    "toilet keeps running",
    "",
  ])("does not flag %j", (text) => {
    expect(detectTextHazards(text)).toEqual([]);
  });
});

describe("normalizeDiagnosis", () => {
  it("leaves a benign diagnosis alone", () => {
    const { diagnosis, overrides } = normalizeDiagnosis(MOCK_DIAGNOSIS, "kitchen faucet drips");
    expect(overrides).toEqual([]);
    expect(diagnosis.severity).toBe("fix_soon");
    expect(diagnosis.diy_verdict).toBe("diy");
    expect(diagnosis.diy_steps).toEqual(MOCK_DIAGNOSIS.diy_steps);
  });

  it("escalates when the homeowner reports a gas smell the model under-called", () => {
    const { diagnosis, overrides } = normalizeDiagnosis(MOCK_DIAGNOSIS, "faucet drips and I smell gas");
    expect(overrides).toEqual(["gas"]);
    expect(diagnosis.severity).toBe("call_pro_now");
    expect(diagnosis.diy_verdict).toBe("call_pro");
    expect(diagnosis.time_estimate).toBe("");
    expect(diagnosis.diy_steps).toEqual(EMERGENCY_STEPS.gas);
    expect(diagnosis.safety_warnings[0].hazard).toBe("gas");
  });

  it("keeps the model's own emergency steps when it already escalated", () => {
    const modelEscalated: Diagnosis = {
      ...MOCK_DIAGNOSIS,
      severity: "call_pro_now",
      diy_verdict: "call_pro",
      diy_steps: ["Leave the house now."],
      safety_warnings: [{ hazard: "gas", warning: "Leave now." }],
    };
    const { diagnosis, overrides } = normalizeDiagnosis(modelEscalated, "I smell gas");
    expect(overrides).toEqual([]);
    expect(diagnosis.diy_steps).toEqual(["Leave the house now."]);
    expect(diagnosis.safety_warnings).toHaveLength(1);
  });

  it("forces a pro verdict whenever severity is call_pro_now", () => {
    const inconsistent: Diagnosis = { ...MOCK_DIAGNOSIS, severity: "call_pro_now", diy_verdict: "diy" };
    const { diagnosis } = normalizeDiagnosis(inconsistent, "");
    expect(diagnosis.diy_verdict).toBe("call_pro");
  });

  it("fixes inverted or negative price ranges and trims long lists", () => {
    const messy: Diagnosis = {
      ...MOCK_DIAGNOSIS,
      parts: [{ name: "x", price_low: 30, price_high: 10, search_query: "x" }],
      pro_cost_range: { low: -50, high: 200, note: "n" },
      follow_up_questions: ["a", "b", "c", "d", "e", "f"],
    };
    const { diagnosis } = normalizeDiagnosis(messy, "");
    expect(diagnosis.parts[0]).toMatchObject({ price_low: 10, price_high: 30 });
    expect(diagnosis.pro_cost_range).toMatchObject({ low: 0, high: 200 });
    expect(diagnosis.follow_up_questions).toHaveLength(4);
  });
});
