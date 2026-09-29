import posthog from "posthog-js";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const ph = vi.hoisted(() => ({
  PostHog: vi.fn(),
  captureImmediate: vi.fn(),
  after: vi.fn(),
}));
vi.mock("posthog-node", () => ({
  PostHog: ph.PostHog.mockImplementation(function () {
    return { captureImmediate: ph.captureImmediate };
  }),
}));
vi.mock("next/server", () => ({ after: ph.after }));

import { syncIdentity, track } from "@/lib/analytics";

const USER = "7b0c7f5e-2f4a-4d7e-9a57-0d7c1c1c9b11";

async function loadTrackServer() {
  // Fresh module each time, so the cached client follows the stubbed env.
  vi.resetModules();
  return (await import("@/lib/analytics-server")).trackServer;
}

beforeEach(() => {
  vi.spyOn(console, "debug").mockImplementation(() => {});
  vi.spyOn(console, "info").mockImplementation(() => {});
  vi.spyOn(console, "error").mockImplementation(() => {});
  ph.captureImmediate.mockResolvedValue(undefined);
});

afterEach(() => {
  posthog.__loaded = false;
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
  vi.clearAllMocks();
});

describe("track (browser)", () => {
  it("is a no-op without a PostHog key and doesn't throw", () => {
    const capture = vi.spyOn(posthog, "capture");
    expect(() => track("landing_view")).not.toThrow();
    expect(() => track("diagnosis_complete", { severity: "low", photo_count: 2 })).not.toThrow();
    expect(capture).not.toHaveBeenCalled();
    expect(console.debug).toHaveBeenCalledWith("[track]", "landing_view", {});
  });

  it("captures through PostHog once it's initialized", () => {
    const capture = vi.spyOn(posthog, "capture").mockReturnValue(undefined);
    posthog.__loaded = true;
    track("diagnose_start", { signed_in: true });
    expect(capture).toHaveBeenCalledWith("diagnose_start", { signed_in: true });
    expect(console.debug).not.toHaveBeenCalled();
  });

  it("swallows PostHog errors", () => {
    vi.spyOn(posthog, "capture").mockImplementation(() => {
      throw new Error("boom");
    });
    posthog.__loaded = true;
    expect(() => track("followup_sent", { turn: 1 })).not.toThrow();
  });

  it("also sends events to Google Analytics when its tag is on the page", () => {
    const gtag = vi.fn();
    vi.stubGlobal("window", { gtag });
    try {
      track("diagnosis_complete", { severity: "low" });
      track("landing_view");
      expect(gtag).toHaveBeenCalledWith("event", "diagnosis_complete", { severity: "low" });
      expect(gtag).toHaveBeenCalledWith("event", "landing_view", {});
    } finally {
      vi.unstubAllGlobals();
    }
  });

  it("swallows Google Analytics errors", () => {
    vi.stubGlobal("window", {
      gtag: () => {
        throw new Error("boom");
      },
    });
    try {
      expect(() => track("landing_view")).not.toThrow();
    } finally {
      vi.unstubAllGlobals();
    }
  });
});

describe("initGoogleAnalytics (browser)", () => {
  async function load() {
    vi.resetModules();
    return (await import("@/lib/google-analytics")).initGoogleAnalytics;
  }

  afterEach(() => vi.unstubAllGlobals());

  it("queues js and config ahead of any event when a measurement ID is set", async () => {
    vi.stubEnv("NEXT_PUBLIC_GA_ID", "G-TEST123");
    const win: Window = {} as Window;
    vi.stubGlobal("window", win);
    (await load())();
    track("landing_view");
    const queued = (win.dataLayer ?? []).map((args) => Array.from(args as IArguments).slice(0, 2));
    expect(queued[0][0]).toBe("js");
    expect(queued.slice(1)).toEqual([
      ["config", "G-TEST123"],
      ["event", "landing_view"],
    ]);
  });

  it("does nothing without a valid measurement ID", async () => {
    vi.stubEnv("NEXT_PUBLIC_GA_ID", "not-an-id");
    const win: Window = {} as Window;
    vi.stubGlobal("window", win);
    (await load())();
    expect(win.gtag).toBeUndefined();
    expect(win.dataLayer).toBeUndefined();
  });
});

describe("syncIdentity (browser)", () => {
  function stubPostHog({ distinctId, identified }: { distinctId: string; identified: boolean }) {
    posthog.__loaded = true;
    vi.spyOn(posthog, "get_distinct_id").mockReturnValue(distinctId);
    vi.spyOn(posthog, "_isIdentified").mockReturnValue(identified);
    return {
      identify: vi.spyOn(posthog, "identify").mockReturnValue(undefined),
      reset: vi.spyOn(posthog, "reset").mockReturnValue(undefined),
    };
  }

  it("does nothing before PostHog is initialized", () => {
    const identify = vi.spyOn(posthog, "identify");
    const reset = vi.spyOn(posthog, "reset");
    syncIdentity(USER);
    syncIdentity(null);
    expect(identify).not.toHaveBeenCalled();
    expect(reset).not.toHaveBeenCalled();
  });

  it("identifies an anonymous visitor by user id, keeping their anonymous events", () => {
    const { identify, reset } = stubPostHog({ distinctId: "anon-device-id", identified: false });
    syncIdentity(USER);
    expect(identify).toHaveBeenCalledWith(USER);
    expect(reset).not.toHaveBeenCalled();
  });

  it("skips identify when already identified as that user", () => {
    const { identify, reset } = stubPostHog({ distinctId: USER, identified: true });
    syncIdentity(USER);
    expect(identify).not.toHaveBeenCalled();
    expect(reset).not.toHaveBeenCalled();
  });

  it("starts fresh before identifying a different account", () => {
    const { identify, reset } = stubPostHog({ distinctId: "someone-else", identified: true });
    syncIdentity(USER);
    expect(reset).toHaveBeenCalledOnce();
    expect(identify).toHaveBeenCalledWith(USER);
  });

  it("resets after sign-out, only once", () => {
    const { reset } = stubPostHog({ distinctId: USER, identified: true });
    syncIdentity(null);
    expect(reset).toHaveBeenCalledOnce();

    stubPostHog({ distinctId: "new-anon-id", identified: false });
    syncIdentity(null);
    expect(reset).toHaveBeenCalledOnce();
  });
});

describe("trackServer", () => {
  it("logs instead of sending without a PostHog key, and doesn't throw", async () => {
    vi.stubEnv("NEXT_PUBLIC_POSTHOG_KEY", "");
    const trackServer = await loadTrackServer();
    expect(() => trackServer("signup", USER)).not.toThrow();
    expect(ph.PostHog).not.toHaveBeenCalled();
    expect(ph.after).not.toHaveBeenCalled();
    expect(console.info).toHaveBeenCalledWith(JSON.stringify({ analytics: "signup", distinct_id: USER }));
  });

  it("sends to PostHog with the user id as distinct id and flushes after the response", async () => {
    vi.stubEnv("NEXT_PUBLIC_POSTHOG_KEY", "phc_test");
    vi.stubEnv("NEXT_PUBLIC_POSTHOG_HOST", "https://eu.i.posthog.com");
    const trackServer = await loadTrackServer();

    trackServer("subscribe", USER, { plan: "month", status: "active", deferred_billing: false });

    expect(ph.PostHog).toHaveBeenCalledWith("phc_test", {
      host: "https://eu.i.posthog.com",
      flushAt: 1,
      flushInterval: 0,
    });
    expect(ph.captureImmediate).toHaveBeenCalledWith({
      distinctId: USER,
      event: "subscribe",
      properties: { plan: "month", status: "active", deferred_billing: false },
    });
    // The send is handed to after(), which keeps a serverless function alive until it settles.
    expect(ph.after).toHaveBeenCalledOnce();
    await expect(ph.after.mock.calls[0][0]()).resolves.toBeUndefined();
    expect(console.info).not.toHaveBeenCalled();
  });

  it("reuses one client across events", async () => {
    vi.stubEnv("NEXT_PUBLIC_POSTHOG_KEY", "phc_test");
    const trackServer = await loadTrackServer();
    trackServer("signup", USER);
    trackServer("trial_start", USER, { trial_ends_at: "2026-10-04T00:00:00.000Z" });
    expect(ph.PostHog).toHaveBeenCalledOnce();
    expect(ph.captureImmediate).toHaveBeenCalledTimes(2);
    expect(ph.captureImmediate).toHaveBeenLastCalledWith({
      distinctId: USER,
      event: "trial_start",
      properties: { trial_ends_at: "2026-10-04T00:00:00.000Z" },
    });
  });

  it("never throws when PostHog or after() fails", async () => {
    vi.stubEnv("NEXT_PUBLIC_POSTHOG_KEY", "phc_test");
    const trackServer = await loadTrackServer();

    ph.captureImmediate.mockRejectedValueOnce(new Error("network down"));
    expect(() => trackServer("cancel", USER, { plan: "year", ended: true })).not.toThrow();
    await expect(ph.after.mock.calls[0][0]()).resolves.toBeUndefined();
    expect(console.error).toHaveBeenCalledWith("posthog capture failed", { event: "cancel", error: "network down" });

    ph.after.mockImplementationOnce(() => {
      throw new Error("after() called outside a request scope");
    });
    expect(() => trackServer("cancel", USER)).not.toThrow();

    ph.captureImmediate.mockImplementationOnce(() => {
      throw new Error("sync failure");
    });
    expect(() => trackServer("cancel", USER)).not.toThrow();
  });
});
