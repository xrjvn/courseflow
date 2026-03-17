import OpenAI from "openai";

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing env var: ${name}. Add it to .env.local (and Vercel env vars).`,
    );
  }
  return value;
}

export function createOpenAIClient() {
  return new OpenAI({
    apiKey: requiredEnv("OPENAI_API_KEY"),
  });
}

