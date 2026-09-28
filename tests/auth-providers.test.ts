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

describe("googleClientId", () => {
  const CLIENT = "1234567890-abcdef.apps.googleusercontent.com";

  async function freshModule() {
    vi.resetModules();
    return import("@/lib/auth-providers");
  }

  function redirectTo(location: string) {
    return new Response(null, { status: 302, headers: { location } });
  }

  it("prefers GOOGLE_CLIENT_ID without calling Supabase", async () => {
    vi.stubEnv("GOOGLE_CLIENT_ID", CLIENT);
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    const { googleClientId } = await freshModule();
    expect(await googleClientId()).toBe(CLIENT);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("reads the client id from Supabase's Google redirect, once per hour", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(redirectTo(`https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT}&response_type=code`));
    vi.stubGlobal("fetch", fetchMock);
    const { googleClientId } = await freshModule();
    expect(await googleClientId()).toBe(CLIENT);
    expect(await googleClientId()).toBe(CLIENT);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0][0]).toContain("https://example.supabase.co/auth/v1/authorize?provider=google");
    expect(fetchMock.mock.calls[0][1]).toMatchObject({ redirect: "manual" });
  });

  it("returns null (so the page uses the redirect flow) when it can't find a valid id", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(redirectTo("https://accounts.google.com/o/oauth2/v2/auth?client_id=evil")));
    expect(await (await freshModule()).googleClientId()).toBeNull();
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));
    expect(await (await freshModule()).googleClientId()).toBeNull();
    vi.stubEnv("GOOGLE_CLIENT_ID", "not-a-client-id");
    expect(await (await freshModule()).googleClientId()).toBeNull();
  });
});
