import { NextResponse } from "next/server";
import { travelContextSchema } from "@/lib/validation/input";
import { generateTravelPlan, GeminiError } from "@/lib/gemini/client";
import { normalizeTravelPlan } from "@/lib/plan/normalize";
import { checkRateLimit } from "@/lib/rate-limit";
import { getCachedPlan, setCachedPlan, hashContext } from "@/lib/cache";
import type {
  ApiErrorCode,
  ApiErrorResponse,
  TravelContext,
  GenerateTravelResponse,
} from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

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
      { headers: { "Retry-After": String(rate.retryAfterSeconds) } }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return errorResponse("invalid_json", "Request body must be valid JSON.");
  }

  const parsed = travelContextSchema.safeParse(body);
  if (!parsed.success) {
    return errorResponse(
      "validation_failed",
      "Some inputs are invalid. Please review your choices.",
      { details: parsed.error.flatten() }
    );
  }

  const context: TravelContext = parsed.data;
  const cacheKey = hashContext(context);

  const cached = getCachedPlan(cacheKey);
  if (cached) {
    return NextResponse.json<GenerateTravelResponse>({
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
    const { plan: rawPlan, model } = await generateTravelPlan(context);
    const plan = normalizeTravelPlan(rawPlan, context);
    setCachedPlan(cacheKey, plan);

    return NextResponse.json<GenerateTravelResponse>({
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
    return errorResponse("upstream_error", "Failed to generate your travel odyssey. Please try again.");
  }
}

function getClientId(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  return request.headers.get("x-real-ip")?.trim() || "anonymous";
}

function toClientMessage(code: ApiErrorCode): string {
  switch (code) {
    case "rate_limited":
      return "The travel planner service is busy. Please try again shortly.";
    case "timeout":
      return "The AI took too long to build your itinerary. Please try a simpler destination or request fewer days.";
    case "empty_response":
    case "invalid_ai_output":
      return "We encountered an issue parsing the generated itinerary. Please try again.";
    case "misconfigured":
      return "The travel generation service is not properly configured.";
    default:
      return "An unexpected error occurred while preparing your travel plan. Please retry.";
  }
}

interface ErrorOptions {
  details?: unknown;
  headers?: Record<string, string>;
}

function errorResponse(
  code: ApiErrorCode,
  message: string,
  options: ErrorOptions = {}
): NextResponse {
  const payload: ApiErrorResponse = { error: message, code };
  if (options.details !== undefined) payload.details = options.details;
  return NextResponse.json(payload, {
    status: ERROR_STATUS[code],
    headers: options.headers,
  });
}
