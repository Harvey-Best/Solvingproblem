import Anthropic from "@anthropic-ai/sdk";
import { describe, expect, it, vi } from "vitest";

import { buildDiagnosisMessages, parseDiagnosisText, runDiagnosis, supportsAdaptiveThinking } from "@/lib/ai/diagnose";
import { MOCK_DIAGNOSIS } from "@/lib/ai/mock";

function message(text: string, stop_reason: Anthropic.Message["stop_reason"] = "end_turn") {
  return {
    id: "msg_test",
    type: "message",
    role: "assistant",
    model: "claude-sonnet-4-6",
    content: [{ type: "text", text, citations: null }],
    stop_reason,
    stop_sequence: null,
    usage: { input_tokens: 1000, output_tokens: 400 },
  } as unknown as Anthropic.Message;
}

function fakeClient(...responses: (Anthropic.Message | Error)[]) {
  const create = vi.fn();
  for (const r of responses) {
    if (r instanceof Error) create.mockRejectedValueOnce(r);
    else create.mockResolvedValueOnce(r);
  }
  return { client: { messages: { create } } as unknown as Pick<Anthropic, "messages">, create };
}

const input = {
  images: [{ mediaType: "image/jpeg" as const, base64: "AAAA" }],
  description: "Kitchen faucet drips",
  category: "plumbing",
};
const opts = { model: "claude-sonnet-4-6", effort: "low" as const };

describe("runDiagnosis", () => {
  it("returns the parsed diagnosis on the first valid response", async () => {
    const { client, create } = fakeClient(message(JSON.stringify(MOCK_DIAGNOSIS)));
    const run = await runDiagnosis(input, { client, ...opts });
    expect(run.ok).toBe(true);
    expect(run.attempts).toBe(1);
    expect(create).toHaveBeenCalledTimes(1);
    if (run.ok) expect(run.diagnosis.title).toBe(MOCK_DIAGNOSIS.title);
  });

  it("retries once when the output doesn't parse, then succeeds", async () => {
    const { client, create } = fakeClient(message("{not json"), message(JSON.stringify(MOCK_DIAGNOSIS)));
    const run = await runDiagnosis(input, { client, ...opts });
    expect(run.ok).toBe(true);
    expect(run.attempts).toBe(2);
    expect(create).toHaveBeenCalledTimes(2);
    expect(run.inputTokens).toBe(2000);
    expect(run.outputTokens).toBe(800);
  });

  it("gives up after two bad responses and keeps the raw text for review", async () => {
    const { client, create } = fakeClient(
      message(JSON.stringify({ title: "only a title" })),
      message(JSON.stringify({ title: "still wrong" }))
    );
    const run = await runDiagnosis(input, { client, ...opts });
    expect(run.ok).toBe(false);
    expect(create).toHaveBeenCalledTimes(2);
    if (!run.ok) {
      expect(run.errorKind).toBe("invalid_output");
      expect(run.error).toMatch(/schema/);
    }
    expect(run.rawResponse).toContain("still wrong");
  });

  it("retries a response truncated by max_tokens", async () => {
    const { client } = fakeClient(
      message('{"title": "Worn', "max_tokens"),
      message(JSON.stringify(MOCK_DIAGNOSIS))
    );
    const run = await runDiagnosis(input, { client, ...opts });
    expect(run.ok).toBe(true);
    expect(run.attempts).toBe(2);
  });

  it("does not retry a refusal", async () => {
    const { client, create } = fakeClient(message("", "refusal"));
    const run = await runDiagnosis(input, { client, ...opts });
    expect(run.ok).toBe(false);
    expect(create).toHaveBeenCalledTimes(1);
    if (!run.ok) expect(run.errorKind).toBe("refusal");
  });

  it("does not retry API errors (the SDK already retried)", async () => {
    const { client, create } = fakeClient(new Error("socket hang up"));
    const run = await runDiagnosis(input, { client, ...opts });
    expect(run.ok).toBe(false);
    expect(create).toHaveBeenCalledTimes(1);
    if (!run.ok) expect(run.errorKind).toBe("api_error");
  });

  it("sends images before the text, a JSON schema, and adaptive thinking", async () => {
    const { client, create } = fakeClient(message(JSON.stringify(MOCK_DIAGNOSIS)));
    await runDiagnosis(input, { client, ...opts });
    const params = create.mock.calls[0][0] as Anthropic.MessageCreateParamsNonStreaming;
    const content = params.messages[0].content as Anthropic.ContentBlockParam[];
    expect(content.map((b) => b.type)).toEqual(["image", "text"]);
    expect(params.output_config?.format?.type).toBe("json_schema");
    expect(params.output_config?.effort).toBe("low");
    expect(params.thinking).toEqual({ type: "adaptive" });
  });

  it("never logs image bytes", async () => {
    const { client } = fakeClient(message(JSON.stringify(MOCK_DIAGNOSIS)));
    const run = await runDiagnosis(input, { client, ...opts });
    expect(JSON.stringify(run.request)).not.toContain("AAAA");
    expect(run.request.image_count).toBe(1);
  });

  it("applies the safety guard to model output", async () => {
    const { client } = fakeClient(message(JSON.stringify(MOCK_DIAGNOSIS)));
    const run = await runDiagnosis({ ...input, description: "drips, and there's a rotten egg smell" }, { client, ...opts });
    expect(run.ok).toBe(true);
    if (run.ok) {
      expect(run.diagnosis.severity).toBe("call_pro_now");
      expect(run.overrides).toEqual(["gas"]);
    }
  });
});

describe("parseDiagnosisText", () => {
  it("rejects values outside the enums", () => {
    const bad = { ...MOCK_DIAGNOSIS, severity: "meh" };
    const parsed = parseDiagnosisText(JSON.stringify(bad));
    expect(parsed.ok).toBe(false);
  });
});

describe("supportsAdaptiveThinking", () => {
  it.each([
    ["claude-sonnet-4-6", true],
    ["claude-sonnet-5", true],
    ["claude-opus-5", true],
    ["claude-haiku-4-5", false],
    ["claude-sonnet-4-5", false],
  ])("%s -> %s", (model, expected) => {
    expect(supportsAdaptiveThinking(model)).toBe(expected);
  });
});

describe("follow-ups", () => {
  const history = {
    original: MOCK_DIAGNOSIS,
    turns: [{ answer: "It drips from the tip of the spout.", result: { ...MOCK_DIAGNOSIS, confidence: "high" as const } }],
  };

  it("replays the thread as alternating turns with cache breakpoints on the first and newest user turns", () => {
    const messages = buildDiagnosisMessages({ ...input, history, newAnswer: "It's a Moen faucet." });
    expect(messages.map((m) => m.role)).toEqual(["user", "assistant", "user", "assistant", "user"]);

    const first = messages[0].content as Anthropic.ContentBlockParam[];
    expect(first.map((b) => b.type)).toEqual(["image", "text"]);
    expect((first[1] as Anthropic.TextBlockParam).cache_control).toEqual({ type: "ephemeral" });

    const last = messages[4].content as Anthropic.TextBlockParam[];
    expect(last[0].text).toContain("It's a Moen faucet.");
    expect(last[0].cache_control).toEqual({ type: "ephemeral" });

    // Earlier answers are replayed as plain text so the cached prefix stays stable.
    expect(messages[2].content).toContain("It drips from the tip of the spout.");
    expect(JSON.parse(messages[1].content as string).title).toBe(MOCK_DIAGNOSIS.title);
  });

  it("sends only the photo turn for a first diagnosis", () => {
    expect(buildDiagnosisMessages(input)).toHaveLength(1);
  });

  it("applies the safety guard to answers given in follow-ups", async () => {
    const { client } = fakeClient(message(JSON.stringify({ ...MOCK_DIAGNOSIS, what_changed: "Nothing new." })));
    const run = await runDiagnosis({ ...input, history, newAnswer: "Also, I smell gas near the stove." }, { client, ...opts });
    expect(run.ok).toBe(true);
    if (run.ok) {
      expect(run.diagnosis.severity).toBe("call_pro_now");
      expect(run.overrides).toEqual(["gas"]);
      expect(run.diagnosis.what_changed).toBe("Nothing new.");
    }
  });

  it("clears what_changed on a first diagnosis", async () => {
    const { client } = fakeClient(message(JSON.stringify({ ...MOCK_DIAGNOSIS, what_changed: "stray text" })));
    const run = await runDiagnosis(input, { client, ...opts });
    if (run.ok) expect(run.diagnosis.what_changed).toBe("");
  });

  it("counts cached prompt tokens", async () => {
    const cachedMessage = message(JSON.stringify(MOCK_DIAGNOSIS));
    Object.assign(cachedMessage.usage, { cache_read_input_tokens: 5000, cache_creation_input_tokens: 0 });
    const { client } = fakeClient(cachedMessage);
    const run = await runDiagnosis({ ...input, history, newAnswer: "Moen" }, { client, ...opts });
    expect(run.cacheReadTokens).toBe(5000);
    expect(run.inputTokens).toBe(6000);
  });
});
