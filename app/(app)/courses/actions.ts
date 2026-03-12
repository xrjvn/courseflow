"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type CoursePayload = {
  name: string;
  code?: string;
  semester?: string;
  color?: string;
};

function getRequiredField(formData: FormData, name: string): string {
  const value = formData.get(name);
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`Missing field: ${name}`);
  }
  return value.trim();
}

function getOptionalField(formData: FormData, name: string): string | undefined {
  const value = formData.get(name);
  if (typeof value !== "string") {
    return undefined;
  }
  const trimmed = value.trim();
  return trimmed.length ? trimmed : undefined;
}

async function getCurrentUserId(): Promise<string> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    throw new Error(error.message);
  }

  if (!user) {
    throw new Error("Not authenticated");
  }

  return user.id;
}

export async function createCourseAction(formData: FormData) {
  const name = getRequiredField(formData, "name");
  const code = getOptionalField(formData, "code");
  const semester = getOptionalField(formData, "semester");
  const color = getOptionalField(formData, "color");

  const supabase = await createSupabaseServerClient();
  const userId = await getCurrentUserId();

  const payload: CoursePayload & { user_id: string } = {
    user_id: userId,
    name,
    code,
    semester,
    color,
  };

  const { error } = await supabase.from("courses").insert(payload);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/courses");
}

export async function updateCourseAction(formData: FormData) {
  const id = getRequiredField(formData, "id");
  const name = getRequiredField(formData, "name");
  const code = getOptionalField(formData, "code");
  const semester = getOptionalField(formData, "semester");
  const color = getOptionalField(formData, "color");

  const supabase = await createSupabaseServerClient();
  const userId = await getCurrentUserId();

  const payload: CoursePayload = {
    name,
    code,
    semester,
    color,
  };

  const { error } = await supabase
    .from("courses")
    .update(payload)
    .eq("id", id)
    .eq("user_id", userId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/courses");
}

export async function deleteCourseAction(formData: FormData) {
  const id = getRequiredField(formData, "id");

  const supabase = await createSupabaseServerClient();
  const userId = await getCurrentUserId();

  const { error } = await supabase
    .from("courses")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/courses");
}

