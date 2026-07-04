import {
  GoogleGenerativeAI,
  GoogleGenerativeAIAbortError,
  GoogleGenerativeAIFetchError,
} from "@google/generative-ai";
import type { ZodError } from "zod";
import { geminiResponseSchema } from "@/lib/gemini/schema";
import { buildPrompt, buildRepairPrompt } from "@/lib/gemini/prompt";
import { rawMealPlanSchema, type RawMealPlanParsed } from "@/lib/validation/output";
import type { ApiErrorCode, DayContext } from "@/lib/types";

const DEFAULT_MODEL = "gemini-2.0-flash";
const REQUEST_TIMEOUT_MS = 25_000;
const MAX_OUTPUT_TOKENS = 4096;

/** Error carrying a stable, client-safe code for HTTP mapping. */
export class GeminiError extends Error {
  readonly code: ApiErrorCode;
  constructor(code: ApiErrorCode, message: string) {
    super(message);
    this.name = "GeminiError";
    this.code = code;
  }
}

export interface GeneratedPlan {
  plan: RawMealPlanParsed;
  model: string;
}

type ParseResult =
  | { ok: true; value: RawMealPlanParsed }
  | { ok: false; reason: string };

/**
 * Generates and validates a meal plan with a real Gemini call.
 *
 * Strategy:
 *   1. One primary call using native structured output.
 *   2. If the response is unparseable or fails Zod validation, ONE repair
 *      retry that feeds the invalid output back for self-correction.
 *   3. Transport failures (timeout, rate limit, 5xx) surface as typed
 *      `GeminiError`s so the caller can map them to precise HTTP responses;
 *      they are intentionally not auto-retried to avoid amplifying load and
 *      burning quota during a demo.
 */
export async function generateMealPlan(context: DayContext): Promise<GeneratedPlan> {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    throw new GeminiError("misconfigured", "GEMINI_API_KEY is not configured");
  }

  const modelName = process.env.GEMINI_MODEL?.trim() || DEFAULT_MODEL;
  const model = new GoogleGenerativeAI(apiKey).getGenerativeModel({
    model: modelName,
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: geminiResponseSchema,
      temperature: 0.5,
      maxOutputTokens: MAX_OUTPUT_TOKENS,
    },
  });

  const firstText = await callModel(model, buildPrompt(context));
  const firstParse = parsePlan(firstText);
  if (firstParse.ok) {
    return { plan: firstParse.value, model: modelName };
  }

  const repairedText = await callModel(
    model,
    buildRepairPrompt(context, firstText, firstParse.reason),
  );
  const repairedParse = parsePlan(repairedText);
  if (repairedParse.ok) {
    return { plan: repairedParse.value, model: modelName };
  }

  throw new GeminiError(
    "invalid_ai_output",
    "The AI response did not match the required format",
  );
}

async function callModel(
  model: ReturnType<GoogleGenerativeAI["getGenerativeModel"]>,
  prompt: string,
): Promise<string> {
  try {
    const result = await model.generateContent(prompt, {
      timeout: REQUEST_TIMEOUT_MS,
    });
    const text = result.response.text()?.trim();
    if (!text) {
      throw new GeminiError("empty_response", "The AI returned an empty response");
    }
    return text;
  } catch (error) {
    throw classifyError(error);
  }
}

function parsePlan(text: string): ParseResult {
  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch {
    return { ok: false, reason: "Response was not valid JSON" };
  }
  const parsed = rawMealPlanSchema.safeParse(json);
  if (!parsed.success) {
    return { ok: false, reason: summarizeZodError(parsed.error) };
  }
  return { ok: true, value: parsed.data };
}

function summarizeZodError(error: ZodError): string {
  return error.issues
    .slice(0, 5)
    .map((issue) => `${issue.path.join(".") || "root"}: ${issue.message}`)
    .join("; ");
}

function classifyError(error: unknown): GeminiError {
  if (error instanceof GeminiError) {
    return error;
  }
  if (error instanceof GoogleGenerativeAIAbortError) {
    return new GeminiError("timeout", "The AI request timed out");
  }
  if (error instanceof GoogleGenerativeAIFetchError) {
    const status = error.status ?? 0;
    if (status === 429) {
      return new GeminiError("rate_limited", "The AI service is rate limited");
    }
    if (status === 400 || status === 401 || status === 403) {
      return new GeminiError("misconfigured", "The AI request was rejected");
    }
    if (status >= 500) {
      return new GeminiError("upstream_error", "The AI service is unavailable");
    }
  }
  const message = error instanceof Error ? error.message : String(error);
  if (/quota|rate limit/i.test(message)) {
    return new GeminiError("rate_limited", "The AI service is rate limited");
  }
  return new GeminiError("upstream_error", "Failed to reach the AI service");
}
