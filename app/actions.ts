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
      model: openai("gpt-4o-mini"),
      prompt,
      system:
        "You are a helpful AI assistant that specializes in summarizing text. Your summaries are concise, accurate, and capture the essence of the original text.",
    });

    return summary.trim();
  } catch (error) {
    console.error("Error in summarizeText:", error);
    return type === "word"
      ? "Error"
      : "An error occurred while generating the summary.";
  }
}
