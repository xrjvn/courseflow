import pdfParse from "pdf-parse";
import { createOpenAIClient } from "./client";
import type { SyllabusSuggestion } from "@/lib/types";

const MODEL_NAME = "gpt-4.1-mini";

export async function extractTextFromPdf(buffer: Buffer): Promise<string> {
  const data = await pdfParse(buffer);
  return data.text ?? "";
}

export async function generateSyllabusSuggestions(
  rawText: string,
): Promise<SyllabusSuggestion[]> {
  const client = createOpenAIClient();

  const systemPrompt = `
You are helping a university student extract a course plan from a syllabus.

The user will give you raw syllabus text. You must respond with a JSON object of the following shape, and nothing else:

{
  "items": SyllabusSuggestion[]
}

Where:

type SyllabusSuggestion = {
  id: string;                  // stable identifier, e.g. "item-1", "item-2"
  title: string;               // short title, e.g. "Midterm Exam", "Homework 3"
  type: "assignment" | "exam" | "quiz" | "project" | "reading" | "other";
  description?: string;        // optional longer description
  rawDateText?: string;        // date text as written in the syllabus, e.g. "Oct 18"
  suggestedDueAt?: string | null; // ISO 8601 date-time in UTC if confident, otherwise null
  notes?: string;              // optional context such as chapter, week, or grading notes
};

Guidelines:
- Only include meaningful items like assignments, quizzes, exams, projects, and important readings.
- Do NOT invent items that are not mentioned.
- If you are unsure about an exact date, set suggestedDueAt to null but keep rawDateText.
- Keep titles short and user-friendly.
- Respond with VALID JSON ONLY (no markdown, no explanation).
`;

  const completion = await client.chat.completions.create({
    model: MODEL_NAME,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: systemPrompt },
      {
        role: "user",
        content: rawText.slice(0, 40_000),
      },
    ],
  });

  const content = completion.choices[0]?.message?.content;
  if (!content) {
    throw new Error("Empty response from AI model");
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(content);
  } catch {
    throw new Error("Failed to parse AI response as JSON");
  }

  if (
    typeof parsed !== "object" ||
    parsed === null ||
    !Array.isArray((parsed as { items?: unknown }).items)
  ) {
    throw new Error("AI response JSON does not contain an 'items' array");
  }

  const items = (parsed as { items: unknown }).items;
  return items as SyllabusSuggestion[];
}

