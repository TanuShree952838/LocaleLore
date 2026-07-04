import { describe, it } from "vitest";
import { GoogleGenerativeAI } from "@google/generative-ai";

const hasKey = Boolean(process.env.GEMINI_API_KEY);

describe.runIf(hasKey)("LIVE Gemini diagnostic", () => {
  it("raw SDK call reveals the true error", async () => {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
    const model = genAI.getGenerativeModel({
      model: process.env.GEMINI_MODEL || "gemini-2.0-flash",
    });
    try {
      const r = await model.generateContent('Reply as JSON: {"ok":true}');
      // eslint-disable-next-line no-console
      console.log("RAW_OK", r.response.text());
    } catch (e) {
      const err = e as { name?: string; message?: string; status?: number; cause?: unknown };
      // eslint-disable-next-line no-console
      console.log("RAW_ERR", JSON.stringify({
        name: err?.name,
        message: err?.message,
        status: err?.status,
        cause: String(err?.cause),
      }));
    }
  }, 45000);
});
