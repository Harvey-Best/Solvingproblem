import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { isGoogleSignInEnabled } from "@/lib/auth-providers";

function settings(external: Record<string, boolean>) {
  return new Response(JSON.stringify({ external }), { status: 200, headers: { "content-type": "application/json" } });
}

beforeEach(() => {
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://example.supabase.co");
  vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", "sb_publishable_test");
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("isGoogleSignInEnabled", () => {
  it("follows Supabase's auth settings", async () => {
    const fetchMock = vi.fn().mockResolvedValue(settings({ email: true, google: true }));
    vi.stubGlobal("fetch", fetchMock);
    expect(await isGoogleSignInEnabled()).toBe(true);
    expect(fetchMock).toHaveBeenCalledWith(
      "https://example.supabase.co/auth/v1/settings",
      expect.objectContaining({ headers: { apikey: "sb_publishable_test" } })
    );

    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(settings({ email: true, google: false })));
    expect(await isGoogleSignInEnabled()).toBe(false);
  });

  it("hides the button when the settings can't be read", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));
    expect(await isGoogleSignInEnabled()).toBe(false);
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("nope", { status: 500 })));
    expect(await isGoogleSignInEnabled()).toBe(false);
  });

  it("is off without Supabase", async () => {
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "");
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    expect(await isGoogleSignInEnabled()).toBe(false);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
