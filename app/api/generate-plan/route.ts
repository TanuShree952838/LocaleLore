import { NextResponse } from "next/server";
import { dayContextSchema } from "@/lib/validation/input";
import { generateMealPlan, GeminiError } from "@/lib/gemini/client";
import { normalizePlan } from "@/lib/plan/normalize";
import { checkRateLimit } from "@/lib/rate-limit";
import { getCachedPlan, setCachedPlan, hashContext } from "@/lib/cache";
import type {
  ApiErrorCode,
  ApiErrorResponse,
  DayContext,
  GeneratePlanResponse,
} from "@/lib/types";

// Requires Node APIs (crypto, Gemini SDK) and must never be statically cached.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
// Headroom for the model fallback chain (primary + one repair per model).
export const maxDuration = 60;

const ERROR_STATUS: Record<ApiErrorCode, number> = {
  invalid_json: 400,
  validation_failed: 400,
  rate_limited: 429,
  timeout: 504,
  empty_response: 502,
  invalid_ai_output: 502,
  upstream_error: 502,
  misconfigured: 500,
};

export async function POST(request: Request): Promise<NextResponse> {
  const clientId = getClientId(request);

  const rate = checkRateLimit(clientId);
  if (!rate.allowed) {
    return errorResponse(
      "rate_limited",
      "Too many requests. Please wait a moment and try again.",
      { headers: { "Retry-After": String(rate.retryAfterSeconds) } },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return errorResponse("invalid_json", "Request body must be valid JSON.");
  }

  const parsed = dayContextSchema.safeParse(body);
  if (!parsed.success) {
    return errorResponse(
      "validation_failed",
      "Some inputs are invalid. Please review the form.",
      { details: parsed.error.flatten() },
    );
  }

  const context: DayContext = parsed.data;
  const cacheKey = hashContext(context);

  const cached = getCachedPlan(cacheKey);
  if (cached) {
    return NextResponse.json<GeneratePlanResponse>({
      plan: cached,
      meta: {
        model: "cache",
        latencyMs: 0,
        cached: true,
        revised: cached.budget.status === "revised_to_fit",
      },
    });
  }

  const startedAt = Date.now();
  try {
    const { plan: rawPlan, model } = await generateMealPlan(context);
    const plan = normalizePlan(rawPlan, context);
    setCachedPlan(cacheKey, plan);

    return NextResponse.json<GeneratePlanResponse>({
      plan,
      meta: {
        model,
        latencyMs: Date.now() - startedAt,
        cached: false,
        revised: plan.budget.status === "revised_to_fit",
      },
    });
  } catch (error) {
    if (error instanceof GeminiError) {
      return errorResponse(error.code, toClientMessage(error.code));
    }
    return errorResponse("upstream_error", "Failed to generate a plan. Please try again.");
  }
}

/** Derives a best-effort client identifier for rate limiting. */
function getClientId(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  return request.headers.get("x-real-ip")?.trim() || "anonymous";
}

/** Maps internal error codes to user-safe messages (no internals leaked). */
function toClientMessage(code: ApiErrorCode): string {
  switch (code) {
    case "rate_limited":
      return "The service is busy. Please wait a moment and try again.";
    case "timeout":
      return "Planning took too long. Try simpler inputs and retry.";
    case "empty_response":
    case "invalid_ai_output":
      return "We couldn't read the generated plan. Please try again.";
    case "misconfigured":
      return "The planning service is temporarily unavailable.";
    default:
      return "Something went wrong while generating your plan. Please try again.";
  }
}

interface ErrorOptions {
  details?: unknown;
  headers?: Record<string, string>;
}

function errorResponse(
  code: ApiErrorCode,
  message: string,
  options: ErrorOptions = {},
): NextResponse {
  const payload: ApiErrorResponse = { error: message, code };
  if (options.details !== undefined) payload.details = options.details;
  return NextResponse.json(payload, {
    status: ERROR_STATUS[code],
    headers: options.headers,
  });
}
