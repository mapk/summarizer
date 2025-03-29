"use server";

import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";

export async function summarizeText(text: string, type: "word" | "sentence") {
  try {
    const prompt =
      type === "word"
        ? `Summarize the following text into a single word that captures its essence:\n\n${text}`
        : `Summarize the following text into a single, concise sentence:\n\n${text}`;

    const { text: summary } = await generateText({
      model: openai("gpt-3.5-turbo"),
      prompt,
      system:
        "You are a helpful AI assistant that specializes in summarizing text. Your summaries are concise, accurate, and capture the essence of the original text.",
      maxRetries: 3,
    });

    return summary.trim();
  } catch (error) {
    console.error("Error in summarizeText:", error);
    if (
      error &&
      typeof error === "object" &&
      "statusCode" in error &&
      error.statusCode === 429
    ) {
      return "Rate limit reached. Please wait a moment before trying again.";
    }
    return type === "word"
      ? "Error"
      : "An error occurred while generating the summary. Please try again later.";
  }
}
