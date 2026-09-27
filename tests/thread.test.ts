import { describe, expect, it } from "vitest";

import { MOCK_DIAGNOSIS, MOCK_FOLLOW_UP } from "@/lib/ai/mock";
import { latestDiagnosis, successfulTurns, toExchanges, type ThreadMessage } from "@/lib/thread";

const msg = (role: "user" | "assistant", extra: Partial<ThreadMessage> = {}): ThreadMessage => ({
  id: Math.random().toString(36),
  role,
  content: role === "user" ? "answer" : "what changed",
  result_json: role === "assistant" ? MOCK_FOLLOW_UP : null,
  error: null,
  created_at: new Date().toISOString(),
  ...extra,
});

describe("thread helpers", () => {
  it("pairs answers with replies and skips failed ones when replaying", () => {
    const exchanges = toExchanges([
      msg("user", { content: "first" }),
      msg("assistant"),
      msg("user", { content: "second" }),
      msg("assistant", { result_json: null, error: "timeout" }),
    ]);
    expect(exchanges).toHaveLength(2);
    expect(successfulTurns(exchanges).map((t) => t.answer)).toEqual(["first"]);
  });

  it("uses the latest successful follow-up as the current diagnosis", () => {
    expect(latestDiagnosis(MOCK_DIAGNOSIS, [])).toBe(MOCK_DIAGNOSIS);
    expect(latestDiagnosis(MOCK_DIAGNOSIS, toExchanges([msg("user"), msg("assistant")]))).toBe(MOCK_FOLLOW_UP);
  });
});
