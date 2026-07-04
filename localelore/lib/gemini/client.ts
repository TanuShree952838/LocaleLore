import {
  GoogleGenerativeAI,
  GoogleGenerativeAIAbortError,
  GoogleGenerativeAIFetchError,
} from "@google/generative-ai";
import type { ZodError } from "zod";
import { SYSTEM_INSTRUCTION, buildPrompt, buildRepairPrompt } from "@/lib/gemini/prompt";
import { rawTravelPlanSchema, type RawTravelPlanParsed } from "@/lib/validation/output";
import type { ApiErrorCode, TravelContext } from "@/lib/types";

/**
 * Ordered fallback model chain — only models confirmed available on v1beta.
 *
 * Key findings from diagnostics:
 * - gemini-2.5-flash: works but returns PROSE if responseMimeType is not set.
 *   Fix: set responseMimeType="application/json" WITHOUT responseSchema.
 *   responseSchema causes truncation on large responses; MIME type alone is reliable.
 * - gemini-2.5-flash-lite: newer lightweight model, good fallback.
 * - gemini-2.0-flash / 2.0-flash-lite: HTTP 404 — retired from v1beta, removed
 *   from the chain (they only added latency and guaranteed-failed attempts).
 */
const MODEL_FALLBACK_CHAIN = [
  "gemini-2.5-flash",
  "gemini-2.5-flash-lite",
];

const REQUEST_TIMEOUT_MS = 120_000;
const MAX_OUTPUT_TOKENS = 8192;

/** Error carrying a stable, client-safe code for HTTP mapping. */
export class GeminiError extends Error {
  readonly code: ApiErrorCode;
  constructor(code: ApiErrorCode, message: string) {
    super(message);
    this.name = "GeminiError";
    this.code = code;
  }
}

export interface GeneratedTravelPlan {
  plan: RawTravelPlanParsed;
  model: string;
}

type ParseResult =
  | { ok: true; value: RawTravelPlanParsed }
  | { ok: false; reason: string };

/**
 * Generates and validates a travel plan with a real Gemini call.
 *
 * Strategy:
 *   1. Walk the MODEL_FALLBACK_CHAIN until one model succeeds.
 *   2. For each model: one primary call with responseMimeType=application/json
 *      (forces JSON output without schema-induced truncation).
 *   3. If Zod validation fails, ONE repair retry.
 *   4. If repair also fails, move to the next model.
 *   5. misconfigured (bad key) stops immediately.
 *   6. 429 rate-limit and 404 not-found advance to next model.
 */
export async function generateTravelPlan(context: TravelContext): Promise<GeneratedTravelPlan> {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    throw new GeminiError("misconfigured", "GEMINI_API_KEY is not configured");
  }

  // Allow overriding the primary model via env; insert it at the front of the chain
  const envModel = process.env.GEMINI_MODEL?.trim();
  const chain = envModel
    ? [envModel, ...MODEL_FALLBACK_CHAIN.filter((m) => m !== envModel)]
    : MODEL_FALLBACK_CHAIN;

  const genAI = new GoogleGenerativeAI(apiKey);
  let lastError: GeminiError = new GeminiError("upstream_error", "All models exhausted");

  for (const modelName of chain) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        systemInstruction: SYSTEM_INSTRUCTION,
        generationConfig: {
          // responseMimeType forces JSON output reliably across all Gemini 2.x models.
          // We intentionally omit responseSchema to avoid token-limit truncation issues
          // that occur when the schema enforcement cuts the JSON object mid-stream.
          responseMimeType: "application/json",
          temperature: 0.65,
          maxOutputTokens: MAX_OUTPUT_TOKENS,
        },
      });

      const firstText = await callModel(model, buildPrompt(context));
      const firstParse = parsePlan(firstText);
      if (firstParse.ok) {
        return { plan: firstParse.value, model: modelName };
      }

      console.warn(`[LocaleLore] First parse failed (${modelName}): ${firstParse.reason}. Attempting repair...`);
      const repairedText = await callModel(
        model,
        buildRepairPrompt(context, firstText, firstParse.reason),
      );
      const repairedParse = parsePlan(repairedText);
      if (repairedParse.ok) {
        return { plan: repairedParse.value, model: modelName };
      }

      console.warn(`[LocaleLore] Repair failed (${modelName}): ${repairedParse.reason}. Trying next model...`);
      lastError = new GeminiError(
        "invalid_ai_output",
        `AI response schema mismatch: ${repairedParse.reason}`,
      );
    } catch (err) {
      const geminiErr = err instanceof GeminiError ? err : classifyError(err);
      console.warn(`[LocaleLore] ✗ Model ${modelName}: [${geminiErr.code}] ${geminiErr.message}`);

      // Bad API key — stop immediately, no point trying other models with same key
      if (geminiErr.code === "misconfigured") {
        throw geminiErr;
      }

      lastError = geminiErr;
      // rate_limited / upstream_error / timeout / empty_response → try next model
    }
  }

  throw lastError;
}

async function callModel(
  model: ReturnType<GoogleGenerativeAI["getGenerativeModel"]>,
  prompt: string,
): Promise<string> {
  try {
    const result = await withTimeout(
      model.generateContent(prompt),
      REQUEST_TIMEOUT_MS,
    );
    let text = result.response.text()?.trim();
    if (!text) {
      throw new GeminiError("empty_response", "The AI returned an empty response");
    }
    // Strip markdown code fences if model wrapped despite JSON mime type
    if (text.startsWith("```")) {
      text = text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();
    }
    // Extract the outermost JSON object (handles any leading/trailing prose)
    const jsonStart = text.indexOf("{");
    const jsonEnd = text.lastIndexOf("}");
    if (jsonStart !== -1 && jsonEnd !== -1 && jsonStart < jsonEnd) {
      text = text.slice(jsonStart, jsonEnd + 1);
    }
    return text;
  } catch (error) {
    if (error instanceof GeminiError) throw error;
    throw classifyError(error);
  }
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(
      () => reject(new GeminiError("timeout", "The AI request timed out")),
      ms,
    );
    promise.then(
      (value) => { clearTimeout(timer); resolve(value); },
      (error) => { clearTimeout(timer); reject(error); },
    );
  });
}

function parsePlan(text: string): ParseResult {
  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch {
    return { ok: false, reason: "Response was not valid JSON" };
  }
  const parsed = rawTravelPlanSchema.safeParse(json);
  if (!parsed.success) {
    const summary = summarizeZodError(parsed.error);
    console.error("[LocaleLore] Zod failure:", summary);
    return { ok: false, reason: summary };
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
  if (error instanceof GeminiError) return error;

  if (error instanceof GoogleGenerativeAIAbortError) {
    return new GeminiError("timeout", "The AI request timed out");
  }

  if (error instanceof GoogleGenerativeAIFetchError) {
    const status = error.status ?? 0;
    console.error(`[LocaleLore] Gemini HTTP ${status}:`, error.message.slice(0, 300));
    if (status === 429) {
      return new GeminiError("rate_limited", "Free tier quota exceeded");
    }
    if (status === 400 || status === 401 || status === 403) {
      return new GeminiError("misconfigured", `API key rejected (HTTP ${status})`);
    }
    // 404 = model not found/deprecated, 5xx = service down — both are retryable
    return new GeminiError("upstream_error", `Gemini unavailable (HTTP ${status})`);
  }

  const message = error instanceof Error ? error.message : String(error);
  console.error(`[LocaleLore] Unknown error:`, message.slice(0, 200));
  if (/quota|rate.?limit/i.test(message)) {
    return new GeminiError("rate_limited", "Rate limit exceeded");
  }
  return new GeminiError("upstream_error", "Failed to reach AI service");
}
