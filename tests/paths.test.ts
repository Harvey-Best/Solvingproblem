import { describe, expect, it } from "vitest";

import { buildUploadPath, pathBelongsTo } from "@/lib/storage-paths";
import { safeNextPath } from "@/lib/utils";
import { extractAttribution } from "@/lib/utm";

const USER = "11111111-1111-4111-8111-111111111111";
const ANON = "22222222-2222-4222-8222-222222222222";
const OTHER = "33333333-3333-4333-8333-333333333333";
const FILE = "44444444-4444-4444-8444-444444444444";

describe("upload paths", () => {
  it("builds paths under the user prefix when signed in, else the anon prefix", () => {
    expect(buildUploadPath({ userId: USER, anonId: ANON }, "image/jpeg")).toMatch(new RegExp(`^u/${USER}/.+\\.jpg$`));
    expect(buildUploadPath({ userId: null, anonId: ANON }, "image/png")).toMatch(new RegExp(`^a/${ANON}/.+\\.png$`));
    expect(buildUploadPath({ userId: null, anonId: null }, "image/jpeg")).toBeNull();
  });

  it("accepts the caller's own user and anon paths", () => {
    const owner = { userId: USER, anonId: ANON };
    expect(pathBelongsTo(`u/${USER}/${FILE}.jpg`, owner)).toBe(true);
    // uploaded anonymously, then signed in before submitting
    expect(pathBelongsTo(`a/${ANON}/${FILE}.jpg`, owner)).toBe(true);
  });

  it("rejects other people's paths and anything malformed", () => {
    const owner = { userId: USER, anonId: ANON };
    expect(pathBelongsTo(`u/${OTHER}/${FILE}.jpg`, owner)).toBe(false);
    expect(pathBelongsTo(`a/${OTHER}/${FILE}.jpg`, owner)).toBe(false);
    expect(pathBelongsTo(`a/${ANON}/../${OTHER}/${FILE}.jpg`, owner)).toBe(false);
    expect(pathBelongsTo(`a/${ANON}/${FILE}.gif`, owner)).toBe(false);
    expect(pathBelongsTo(`u/${USER}/${FILE}.jpg`, { userId: null, anonId: ANON })).toBe(false);
  });
});

describe("safeNextPath", () => {
  it.each([
    ["/d/abc", "/d/abc"],
    ["//evil.com", "/"],
    ["https://evil.com", "/"],
    ["/\\evil.com", "/"],
    [null, "/"],
  ])("%j -> %j", (input, expected) => {
    expect(safeNextPath(input)).toBe(expected);
  });
});

describe("extractAttribution", () => {
  it("captures utm params, click ids and an external referrer", () => {
    const url = new URL("https://homedoctor.app/?utm_source=tiktok&utm_campaign=launch&ttclid=abc");
    const out = extractAttribution(url, "https://www.tiktok.com/foo?x=1");
    expect(out).toMatchObject({
      utm_source: "tiktok",
      utm_campaign: "launch",
      ttclid: "abc",
      referrer: "https://www.tiktok.com/foo",
      landing_path: "/",
    });
  });

  it("ignores visits without campaign params", () => {
    expect(extractAttribution(new URL("https://homedoctor.app/diagnose"), null)).toBeNull();
  });
});
