import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock only the network-touching function; keep the real GeminiError class so
// the route's `instanceof` checks work exactly as in production.
vi.mock("@/lib/gemini/client", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/gemini/client")>();
  return { ...actual, generateTravelPlan: vi.fn() };
});

import { generateTravelPlan, GeminiError } from "@/lib/gemini/client";
import { POST } from "@/app/api/generate-travel/route";
import { __resetRateLimiter } from "@/lib/rate-limit";
import { __resetCache } from "@/lib/cache";
import { makeContext, makeRawPlan } from "./fixtures";

const mockGenerate = vi.mocked(generateTravelPlan);

let ipCounter = 0;
function makeRequest(body: unknown, ip?: string): Request {
  ipCounter += 1;
  return new Request("http://localhost/api/generate-travel", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-forwarded-for": ip ?? `10.0.0.${ipCounter}`,
    },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

beforeEach(() => {
  __resetRateLimiter();
  __resetCache();
  mockGenerate.mockReset();
  delete process.env.RATE_LIMIT_MAX;
});

describe("POST /api/generate-travel", () => {
  it("returns a normalized travel plan on the happy path", async () => {
    mockGenerate.mockResolvedValue({ plan: makeRawPlan(), model: "gemini-2.5-flash" });

    const res = await POST(makeRequest(makeContext()));
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.plan.attractions).toHaveLength(2);
    expect(json.plan.attractions[0].id).toBe("attraction-0");
    expect(json.plan.budget.estimatedTotal).toBe(75);
    expect(json.meta.cached).toBe(false);
    expect(json.meta.model).toBe("gemini-2.5-flash");
  });

  it("serves a cached plan on an identical second request", async () => {
    mockGenerate.mockResolvedValue({ plan: makeRawPlan(), model: "gemini-2.5-flash" });
    const ip = "10.9.9.9";

    const first = await POST(makeRequest(makeContext(), ip));
    expect((await first.json()).meta.cached).toBe(false);

    const second = await POST(makeRequest(makeContext(), ip));
    const secondJson = await second.json();
    expect(secondJson.meta.cached).toBe(true);
    expect(mockGenerate).toHaveBeenCalledTimes(1);
  });

  it("rejects a non-JSON body with 400", async () => {
    const res = await POST(makeRequest("not json"));
    expect(res.status).toBe(400);
    expect((await res.json()).code).toBe("invalid_json");
    expect(mockGenerate).not.toHaveBeenCalled();
  });

  it("rejects invalid input with 400 and details", async () => {
    const res = await POST(makeRequest(makeContext({ budget: 0 })));
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.code).toBe("validation_failed");
    expect(json.details).toBeDefined();
    expect(mockGenerate).not.toHaveBeenCalled();
  });

  it("rejects a blank body with 400", async () => {
    const res = await POST(makeRequest({}));
    expect(res.status).toBe(400);
    expect((await res.json()).code).toBe("validation_failed");
  });

  it("enforces the rate limit with 429 + Retry-After", async () => {
    process.env.RATE_LIMIT_MAX = "1";
    __resetRateLimiter();
    mockGenerate.mockResolvedValue({ plan: makeRawPlan(), model: "m" });
    const ip = "10.5.5.5";

    const first = await POST(makeRequest(makeContext(), ip));
    expect(first.status).toBe(200);

    const second = await POST(makeRequest(makeContext({ budget: 999 }), ip));
    expect(second.status).toBe(429);
    expect(second.headers.get("Retry-After")).toBeTruthy();
    expect((await second.json()).code).toBe("rate_limited");
  });

  it.each([
    ["timeout", 504],
    ["rate_limited", 429],
    ["empty_response", 502],
    ["invalid_ai_output", 502],
    ["upstream_error", 502],
    ["misconfigured", 500],
  ] as const)("maps GeminiError '%s' to HTTP %i", async (code, status) => {
    mockGenerate.mockRejectedValue(new GeminiError(code, "boom"));
    const res = await POST(makeRequest(makeContext()));
    expect(res.status).toBe(status);
    expect((await res.json()).code).toBe(code);
  });

  it("maps an unexpected error to 502", async () => {
    mockGenerate.mockRejectedValue(new Error("kaboom"));
    const res = await POST(makeRequest(makeContext()));
    expect(res.status).toBe(502);
    expect((await res.json()).code).toBe("upstream_error");
  });
});
