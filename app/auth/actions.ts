"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function getStringField(formData: FormData, name: string): string {
  const value = formData.get(name);
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`Missing field: ${name}`);
  }
  return value.trim();
}

export async function signUpAction(formData: FormData) {
  const fullName = getStringField(formData, "fullName");
  const email = getStringField(formData, "email");
  const password = getStringField(formData, "password");

  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });

  if (error) {
    throw new Error(error.message);
  }

  redirect("/dashboard");
}

export async function signInAction(formData: FormData) {
  const email = getStringField(formData, "email");
  const password = getStringField(formData, "password");

  const supabase = await createSupabaseServerClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message);
  }

  redirect("/dashboard");
}

