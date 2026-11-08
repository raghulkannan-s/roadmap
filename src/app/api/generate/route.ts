import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

import { getSystemPrompt } from "@/lib/prompts";

import type { GenerateRequest } from "@/lib/types";

const MAX_PROMPT_LENGTH = 500;

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as GenerateRequest;

    if (!body.prompt || typeof body.prompt !== "string") {
      return NextResponse.json(
        { success: false, error: "Prompt is required." },
        { status: 400 }
      );
    }

    if (body.prompt.length > MAX_PROMPT_LENGTH) {
      return NextResponse.json(
        { success: false, error: `Prompt must be under ${MAX_PROMPT_LENGTH} characters.` },
        { status: 400 }
      );
    }

    if (!body.mode || !["roadmap", "todo"].includes(body.mode)) {
      return NextResponse.json(
        { success: false, error: "Mode must be 'roadmap' or 'todo'." },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.error("[API] GEMINI_API_KEY is not set");
      return NextResponse.json(
        { success: false, error: "Server configuration error. API key not found." },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const systemPrompt = getSystemPrompt(body.mode);

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: body.prompt }],
        },
      ],
      systemInstruction: {
        role: "system",
        parts: [{ text: systemPrompt }],
      },
    });

    const responseText = result.response.text();

    // Gemini sometimes wraps JSON in markdown code fences, so we strip them
    const cleanJson = responseText
      .replace(/```json?\n?/g, "")
      .replace(/```/g, "")
      .trim();

    const data = JSON.parse(cleanJson);

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("[API] Generation failed:", error);

    const message =
      error instanceof SyntaxError
        ? "AI returned invalid data. Please try again."
        : "Failed to generate. Please try again.";

    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

