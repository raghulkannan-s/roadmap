import {
  GoogleGenerativeAI,
  SchemaType,
} from "@google/generative-ai";
import type { ResponseSchema } from "@google/generative-ai";
import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { TODO_SYSTEM_PROMPT } from "@/lib/prompts";

import type { GenerateRequest } from "@/lib/types";
import type { GenerationFallback } from "@/lib/types";

const MAX_PROMPT_LENGTH = 500;
const GEMINI_TIMEOUT_MS = 90_000;

export async function POST(request: Request) {
  let generationStage: "none" | "request" | "parse" | "save" = "none";

  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Authentication required. Please sign in with Google to generate plans." },
        { status: 401 }
      );
    }

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

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.error("[API] GEMINI_API_KEY is not set");
      return NextResponse.json(
        { success: false, error: "Server configuration error. API key not found." },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const modelName = process.env.GEMINI_MODEL || "gemini-3.5-flash-lite";
    const responseSchema: ResponseSchema = {
      type: SchemaType.OBJECT,
      properties: {
        status: {
          type: SchemaType.STRING,
          format: "enum",
          enum: ["success", "fallback"],
        },
        message: { type: SchemaType.STRING },
        title: { type: SchemaType.STRING },
        description: { type: SchemaType.STRING },
        categories: {
          type: SchemaType.ARRAY,
          items: {
            type: SchemaType.OBJECT,
            properties: {
              id: { type: SchemaType.STRING },
              name: { type: SchemaType.STRING },
              tasks: {
                type: SchemaType.ARRAY,
                items: {
                  type: SchemaType.OBJECT,
                  properties: {
                    id: { type: SchemaType.STRING },
                    title: { type: SchemaType.STRING },
                    description: { type: SchemaType.STRING },
                    priority: {
                      type: SchemaType.STRING,
                      format: "enum",
                      enum: ["high", "medium", "low"],
                    },
                    isCompleted: { type: SchemaType.BOOLEAN },
                  },
                  required: ["id", "title", "description", "priority", "isCompleted"],
                },
              },
            },
            required: ["id", "name", "tasks"],
          },
        },
      },
      required: ["status", "message", "title", "description", "categories"],
    };
    const model = genAI.getGenerativeModel(
      {
        model: modelName,
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema,
          temperature: 0.2,
          maxOutputTokens: 1600,
        },
      },
      { timeout: GEMINI_TIMEOUT_MS }
    );

    const startedAt = Date.now();

    console.log(
      `[API] Fetching Gemini response: model=${modelName}, promptLength=${body.prompt.length}`
    );

    generationStage = "request";
    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: body.prompt }],
        },
      ],
      systemInstruction: {
        role: "system",
        parts: [{ text: TODO_SYSTEM_PROMPT }],
      },
    });

    console.log(`[API] Gemini response received in ${Date.now() - startedAt}ms`);

    const responseText = result.response.text();
    generationStage = "parse";

    const cleanJson = responseText
      .replace(/```json?\n?/g, "")
      .replace(/```/g, "")
      .trim();

    const data = JSON.parse(cleanJson) as {
      status?: unknown;
      message?: unknown;
      title?: unknown;
      description?: unknown;
      categories?: unknown;
    };

    if (
      (data.status !== "success" && data.status !== "fallback") ||
      typeof data.message !== "string" ||
      typeof data.title !== "string" ||
      typeof data.description !== "string" ||
      !Array.isArray(data.categories)
    ) {
      throw new Error("AI response did not match the todo schema");
    }

    if (data.status === "fallback") {
      const fallback: GenerationFallback = {
        status: "fallback",
        message: data.message,
        title: data.title,
        description: data.description,
        categories: [],
      };

      console.warn(`[API] Gemini returned fallback: ${fallback.message}`);
      return NextResponse.json({ success: true, data: fallback });
    }

    generationStage = "save";
    const todo = await prisma.todoList.create({
      data: {
        userId: session.user.id,
        title: data.title,
        description: data.description ?? "",
        categories: data.categories,
        prompt: body.prompt,
      },
    });

    console.log(
      `[API] Todo generated and saved to cloud in ${Date.now() - startedAt}ms`
    );

    return NextResponse.json({
      success: true,
      data: { ...todo, status: "success", message: data.message },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const isTimeout =
      errorMessage.toLowerCase().includes("aborted") ||
      errorMessage.toLowerCase().includes("timeout");

    if (isTimeout) {
      console.warn(
        `[API] Gemini request timed out after ${GEMINI_TIMEOUT_MS}ms`
      );
    } else {
      console.error("[API] Generation failed:", error);
    }

    if (generationStage === "request" || generationStage === "parse") {
      const fallback: GenerationFallback = {
        status: "fallback",
        message: isTimeout
          ? "The AI service took longer than 90 seconds to respond."
          : errorMessage,
        title: "Unable to generate todo list",
        description: "",
        categories: [],
      };

      return NextResponse.json({ success: true, data: fallback });
    }

    const message =
      error instanceof SyntaxError
        ? "AI returned invalid data. Please try again."
        : errorMessage;

    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
