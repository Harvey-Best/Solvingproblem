import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const db = vi.hoisted(() => ({ row: null as unknown, thread: [] as unknown[], lookups: 0 }));
vi.mock("@/lib/supabase/admin", () => ({
  createAdminClient: () => ({
    from: () => ({
      select: () => ({
        eq: () => ({
          maybeSingle: async () => {
            db.lookups++;
            return { data: db.row, error: null };
          },
        }),
      }),
    }),
  }),
}));
vi.mock("@/lib/diagnoses", () => ({ getThread: async () => db.thread }));

import type { Diagnosis } from "@/lib/ai/schema";
import { MOCK_DIAGNOSIS, MOCK_FOLLOW_UP } from "@/lib/ai/mock";
import {
  SHARE_ID_BYTES,
  getSharedDiagnosis,
  isShareId,
  newShareId,
  shareCardPath,
  shareDescription,
  shareLink,
  sharePath,
  shortTimeEstimate,
  toPublicDiagnosis,
} from "@/lib/share";

describe("share ids", () => {
  it("are 22 URL-safe characters carrying 16 random bytes", () => {
    const id = newShareId();
    expect(id).toMatch(/^[A-Za-z0-9_-]{22}$/);
    expect(Buffer.from(id, "base64url")).toHaveLength(SHARE_ID_BYTES);
    expect(SHARE_ID_BYTES * 8).toBeGreaterThanOrEqual(128);
    expect(encodeURIComponent(id)).toBe(id);
  });

  it("don't repeat and use the whole alphabet", () => {
    const ids = Array.from({ length: 5000 }, newShareId);
    expect(new Set(ids).size).toBe(ids.length);
    // 110,000 characters: every one of the 64 base64url symbols shows up.
    expect(new Set(ids.join("")).size).toBe(64);
    // No shared prefixes worth guessing from (e.g. a timestamp or counter).
    expect(new Set(ids.map((id) => id.slice(0, 4))).size).toBeGreaterThan(4900);
  });

  it("are validated before any lookup", () => {
    expect(isShareId(newShareId())).toBe(true);
    for (const bad of ["", "abc", `${newShareId()}x`, "AAAAAAAAAAAAAAAAAAAAA=", "AAAAAAAAAAAAAAAAAAAA/+", "../../etc/passwd", null, 42]) {
      expect(isShareId(bad)).toBe(false);
    }
  });

  it("map to stable page and image paths", () => {
    expect(sharePath("abc")).toBe("/s/abc");
    expect(shareCardPath("abc")).toBe("/og/share/abc");
    expect(shareCardPath("abc", "square")).toBe("/og/share/abc?format=square");
    expect(shareLink("abc")).toEqual({ url: "/s/abc", imageUrl: "/og/share/abc?format=square" });
    expect(shareLink("abc", "https://homedoctor.app").url).toBe("https://homedoctor.app/s/abc");
  });
});

/** A diagnoses row as the database holds it, with everything that must stay private. */
const PRIVATE = {
  description: "PRIVATE-DESCRIPTION: 12 Elm St, my son Jake broke it",
  image_paths: ["anon/PRIVATE-IMAGE-PATH/1.jpg"],
  user_id: "PRIVATE-USER-ID",
  anon_id: "PRIVATE-ANON-ID",
  ip_hash: "PRIVATE-IP-HASH",
  utm: { utm_source: "PRIVATE-UTM" },
};
const RESULT: Diagnosis = {
  ...MOCK_DIAGNOSIS,
  severity_reason: "You described PRIVATE-SEVERITY-REASON.",
  safety_warnings: [
    { hazard: "water_near_electrical", warning: "PRIVATE-WARNING by Jake's room" },
    { hazard: "water_near_electrical", warning: "PRIVATE-WARNING-2" },
    { hazard: "mold", warning: "PRIVATE-WARNING-3" },
  ],
  diy_verdict_reason: "PRIVATE-VERDICT-REASON",
  alternative_causes: [{ cause: "PRIVATE-ALT", how_to_tell: "PRIVATE-HOW-TO-TELL" }],
  diy_steps: ["PRIVATE-STEP"],
  tools_needed: ["PRIVATE-TOOL"],
  parts: [
    { name: "PRIVATE-PART", price_low: 12, price_high: 35, search_query: "PRIVATE-QUERY" },
    { name: "PRIVATE-PART-2", price_low: 4, price_high: 8, search_query: "PRIVATE-QUERY-2" },
  ],
  what_to_tell_the_pro: "PRIVATE-TELL-THE-PRO",
  follow_up_questions: ["PRIVATE-QUESTION"],
  what_changed: "PRIVATE-WHAT-CHANGED",
};

describe("toPublicDiagnosis", () => {
  const pub = toPublicDiagnosis({ ...RESULT, ...PRIVATE } as unknown as Diagnosis);

  it("keeps exactly the public fields", () => {
    expect(Object.keys(pub).sort()).toEqual(
      [
        "category",
        "confidence",
        "diy_verdict",
        "hazards",
        "likely_cause",
        "parts",
        "pro_cost_range",
        "severity",
        "time_estimate",
        "title",
      ].sort()
    );
    expect(Object.keys(pub.pro_cost_range).sort()).toEqual(["high", "low", "note"]);
    expect(Object.keys(pub.parts).sort()).toEqual(["count", "high", "low"]);
  });

  it("never includes photos, the homeowner's words, ids or follow-up text", () => {
    for (const key of [
      "description",
      "image_paths",
      "user_id",
      "anon_id",
      "ip_hash",
      "utm",
      "severity_reason",
      "safety_warnings",
      "diy_verdict_reason",
      "alternative_causes",
      "diy_steps",
      "tools_needed",
      "what_to_tell_the_pro",
      "follow_up_questions",
      "what_changed",
    ]) {
      expect(pub).not.toHaveProperty(key);
    }
    const json = JSON.stringify(pub);
    expect(json).not.toMatch(/PRIVATE|Jake|Elm St/);
  });

  it("keeps the values that matter", () => {
    expect(pub).toMatchObject({
      title: MOCK_DIAGNOSIS.title,
      category: "plumbing",
      severity: "fix_soon",
      likely_cause: MOCK_DIAGNOSIS.likely_cause,
      confidence: "medium",
      diy_verdict: "diy",
      time_estimate: "30-45 minutes",
      pro_cost_range: MOCK_DIAGNOSIS.pro_cost_range,
      parts: { count: 2, low: 16, high: 43 },
      hazards: ["water_near_electrical", "mold"],
    });
  });

  it("drops the DIY time when it's a job for a pro", () => {
    const pro = toPublicDiagnosis({ ...RESULT, diy_verdict: "call_pro", parts: [], safety_warnings: [] });
    expect(pro.time_estimate).toBe("");
    expect(pro.parts).toEqual({ count: 0, low: 0, high: 0 });
    expect(pro.hazards).toEqual([]);
  });
});

describe("share copy", () => {
  it("shortens time estimates for chips and cards", () => {
    expect(shortTimeEstimate("30-45 minutes")).toBe("30–45 min");
    expect(shortTimeEstimate("20 to 30 minutes")).toBe("20–30 min");
    expect(shortTimeEstimate("1-2 hours")).toBe("1–2 hours");
    expect(shortTimeEstimate("")).toBe("");
  });

  it("describes the result in one line for link previews", () => {
    const d = toPublicDiagnosis(MOCK_DIAGNOSIS);
    expect(shareDescription(d)).toBe(
      "Fix soon. DIY, about 30–45 min. A pro typically charges $150–$300. Diagnosed from a photo with Home Doctor."
    );
    expect(shareDescription({ ...d, diy_verdict: "call_pro", time_estimate: "" })).toContain("Best left to a pro.");
  });
});

describe("getSharedDiagnosis", () => {
  beforeEach(() => {
    db.row = null;
    db.thread = [];
    db.lookups = 0;
  });

  it("skips the database for malformed ids", async () => {
    expect(await getSharedDiagnosis("not-a-share-id")).toBeNull();
    expect(db.lookups).toBe(0);
  });

  it("is null for unknown or revoked links, and unfinished diagnoses", async () => {
    expect(await getSharedDiagnosis(newShareId())).toBeNull();
    db.row = { id: "d1", status: "pending", result_json: null };
    expect(await getSharedDiagnosis(newShareId())).toBeNull();
  });

  it("shows the latest version after follow-ups, projected", async () => {
    const id = newShareId();
    db.row = { id: "d1", status: "complete", result_json: RESULT };
    db.thread = [
      { id: "q", role: "user", content: "PRIVATE-ANSWER", result_json: null, error: null, created_at: "1" },
      { id: "a", role: "assistant", content: "PRIVATE-WHAT-CHANGED", result_json: { ...MOCK_FOLLOW_UP, title: "Updated title" }, error: null, created_at: "2" },
    ];
    const shared = await getSharedDiagnosis(id);
    expect(shared?.shareId).toBe(id);
    expect(shared?.diagnosis.title).toBe("Updated title");
    expect(shared?.diagnosis.confidence).toBe("high");
    expect(JSON.stringify(shared)).not.toMatch(/PRIVATE/);
  });
});
