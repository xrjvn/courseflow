"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type {
  AssignmentStatus,
  AssignmentPriority,
  SyllabusSuggestion,
} from "@/lib/types";

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

function coerceDueAt(suggestion: SyllabusSuggestion): string | null {
  if (suggestion.suggestedDueAt) {
    const parsed = new Date(suggestion.suggestedDueAt);
    if (!Number.isNaN(parsed.getTime())) return parsed.toISOString();
  }

  if (suggestion.rawDateText) {
    const parsed = new Date(suggestion.rawDateText);
    if (!Number.isNaN(parsed.getTime())) return parsed.toISOString();
  }

  return null;
}

export async function importSyllabusSuggestionsAction(formData: FormData) {
  const syllabusId = getRequiredField(formData, "syllabus_id");
  const selectedIds = formData.getAll("suggestion_id").filter((v) => typeof v === "string") as string[];

  if (selectedIds.length === 0) {
    revalidatePath("/assignments");
    return;
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw new Error(userError.message);
  }
  if (!user) {
    throw new Error("Not authenticated");
  }

  const { data: syllabusRow, error: syllabusError } = await supabase
    .from("syllabi")
    .select("id, course_id, parsed_suggestions, status")
    .eq("id", syllabusId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (syllabusError) {
    throw new Error(syllabusError.message);
  }
  if (!syllabusRow) {
    throw new Error("Syllabus not found");
  }
  if (syllabusRow.status !== "parsed") {
    throw new Error("Syllabus is not parsed");
  }

  const parsed = syllabusRow.parsed_suggestions as unknown;
  if (!Array.isArray(parsed)) {
    throw new Error("Syllabus suggestions are missing");
  }

  const allSuggestions = parsed as SyllabusSuggestion[];
  const suggestionsToImport = allSuggestions.filter((s) =>
    selectedIds.includes(s.id),
  );

  const courseId = syllabusRow.course_id as string;
  const userId = user.id;

  const inserts: Array<AssignmentPayload & { user_id: string }> = [];

  for (const suggestion of suggestionsToImport) {
    const dueAt = coerceDueAt(suggestion);
    if (!dueAt) {
      // Skip items without a usable due date in MVP.
      continue;
    }

    // Duplicate prevention (MVP):
    // If an assignment already exists with same (user_id, course_id, title, due_at), skip it.
    const { data: existing, error: existsError } = await supabase
      .from("assignments")
      .select("id")
      .eq("user_id", userId)
      .eq("course_id", courseId)
      .eq("title", suggestion.title)
      .eq("due_at", dueAt)
      .limit(1);

    if (existsError) {
      throw new Error(existsError.message);
    }
    if (existing && existing.length > 0) {
      continue;
    }

    const description =
      suggestion.description?.trim() ||
      suggestion.notes?.trim() ||
      undefined;

    inserts.push({
      user_id: userId,
      course_id: courseId,
      title: suggestion.title,
      description,
      due_at: dueAt,
      status: "not_started",
      priority: "medium",
    });
  }

  if (inserts.length > 0) {
    const { error: insertError } = await supabase.from("assignments").insert(inserts);
    if (insertError) {
      throw new Error(insertError.message);
    }
  }

  revalidatePath("/assignments");
}

