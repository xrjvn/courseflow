"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { AssignmentStatus, AssignmentPriority } from "@/lib/types";

type AssignmentPayload = {
  title: string;
  description?: string;
  course_id: string;
  due_at: string;
  status: AssignmentStatus;
  priority: AssignmentPriority;
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

function getStatusField(formData: FormData): AssignmentStatus {
  const raw = getRequiredField(formData, "status");
  if (raw === "not_started" || raw === "in_progress" || raw === "completed") {
    return raw;
  }
  throw new Error("Invalid status value");
}

function getPriorityField(formData: FormData): AssignmentPriority {
  const raw = getRequiredField(formData, "priority");
  if (raw === "low" || raw === "medium" || raw === "high") {
    return raw;
  }
  throw new Error("Invalid priority value");
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

export async function createAssignmentAction(formData: FormData) {
  const title = getRequiredField(formData, "title");
  const description = getOptionalField(formData, "description");
  const courseId = getRequiredField(formData, "course_id");
  const dueAt = getRequiredField(formData, "due_at");
  const status = getStatusField(formData);
  const priority = getPriorityField(formData);

  const supabase = await createSupabaseServerClient();
  const userId = await getCurrentUserId();

  const payload: AssignmentPayload & { user_id: string } = {
    user_id: userId,
    title,
    description,
    course_id: courseId,
    due_at: new Date(dueAt).toISOString(),
    status,
    priority,
  };

  const { error } = await supabase.from("assignments").insert(payload);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/assignments");
}

export async function updateAssignmentAction(formData: FormData) {
  const id = getRequiredField(formData, "id");
  const title = getRequiredField(formData, "title");
  const description = getOptionalField(formData, "description");
  const courseId = getRequiredField(formData, "course_id");
  const dueAt = getRequiredField(formData, "due_at");
  const status = getStatusField(formData);
  const priority = getPriorityField(formData);

  const supabase = await createSupabaseServerClient();
  const userId = await getCurrentUserId();

  const payload: AssignmentPayload = {
    title,
    description,
    course_id: courseId,
    due_at: new Date(dueAt).toISOString(),
    status,
    priority,
  };

  const { error } = await supabase
    .from("assignments")
    .update(payload)
    .eq("id", id)
    .eq("user_id", userId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/assignments");
}

export async function deleteAssignmentAction(formData: FormData) {
  const id = getRequiredField(formData, "id");

  const supabase = await createSupabaseServerClient();
  const userId = await getCurrentUserId();

  const { error } = await supabase
    .from("assignments")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/assignments");
}

