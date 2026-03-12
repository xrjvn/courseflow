import { createBrowserClient } from "@supabase/ssr";

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing env var: ${name}. Add it to .env.local (and Vercel env vars).`,
    );
  }
  return value;
}

export function createSupabaseBrowserClient() {
  return createBrowserClient(
    requiredEnv("NEXT_PUBLIC_SUPABASE_URL"),
    requiredEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
  );
}

