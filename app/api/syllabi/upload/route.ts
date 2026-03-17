import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { extractTextFromPdf, generateSyllabusSuggestions } from "@/lib/ai/syllabus";
import { importSyllabusSuggestionsForCourse } from "@/app/(app)/assignments/actions";

export const runtime = "nodejs";

const SYLLABI_BUCKET = "syllabi";
const MAX_FILE_BYTES = 10 * 1024 * 1024; // 10MB

function isPdfFile(file: File): boolean {
  if (file.type === "application/pdf") return true;
  const name = file.name.toLowerCase();
  return name.endsWith(".pdf");
}

function jsonError(message: string, status = 400) {
  return NextResponse.json({ ok: false, error: message }, { status });
}

export async function POST(request: Request) {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    return jsonError(userError.message, 401);
  }

  if (!user) {
    return jsonError("Not authenticated", 401);
  }

  const formData = await request.formData();

  const courseId = formData.get("course_id");
  if (typeof courseId !== "string" || !courseId.trim()) {
    return jsonError("Missing field: course_id", 400);
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return jsonError("Missing file", 400);
  }

  if (!isPdfFile(file)) {
    return jsonError("File must be a PDF", 415);
  }

  if (file.size > MAX_FILE_BYTES) {
    return jsonError("File is too large (max 10MB)", 413);
  }

  // Validate the current user owns the course
  const { data: course, error: courseError } = await supabase
    .from("courses")
    .select("id")
    .eq("id", courseId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (courseError) {
    return jsonError(courseError.message, 400);
  }

  if (!course) {
    return jsonError("Course not found", 404);
  }

  // Use a server-only admin client for trusted writes to Storage + DB.
  // This bypasses RLS for the syllabi row and avoids Storage policy pitfalls.
  const admin = createSupabaseAdminClient();

  // Use a stable path so re-uploads replace the same object.
  const userId = user.id as string;
  const storagePath = `${userId}/${courseId}/syllabus.pdf`;

  const { error: uploadError } = await admin.storage
    .from(SYLLABI_BUCKET)
    .upload(storagePath, file, {
      contentType: "application/pdf",
      upsert: true,
    });

  if (uploadError) {
    return jsonError(uploadError.message, 400);
  }

  // Attempt parsing: download PDF, extract text, call AI, store suggestions.
  try {
    const { data: downloadData, error: downloadError } = await admin.storage
      .from(SYLLABI_BUCKET)
      .download(storagePath);

    if (downloadError || !downloadData) {
      throw new Error(downloadError?.message ?? "Failed to download syllabus");
    }

    const buffer = Buffer.from(await downloadData.arrayBuffer());
    const rawText = await extractTextFromPdf(buffer);
    const suggestions = await generateSyllabusSuggestions(rawText);

    // Select existing syllabi row for this user + course
    const {
      data: existingSyllabus,
      error: selectError,
    } = await admin
      .from("syllabi")
      .select("id")
      .eq("user_id", userId)
      .eq("course_id", courseId)
      .maybeSingle();

    if (selectError) {
      throw new Error(selectError.message);
    }

    const parsedPayload = {
      user_id: userId,
      course_id: courseId,
      storage_path: storagePath,
      original_filename: file.name,
      mime_type: "application/pdf",
      status: "parsed" as const,
      parsed_at: new Date().toISOString(),
      parsed_suggestions: suggestions,
      error_message: null,
    };

    if (existingSyllabus) {
      const { error: updateError } = await admin
        .from("syllabi")
        .update(parsedPayload)
        .eq("id", existingSyllabus.id);

      if (updateError) {
        throw new Error(updateError.message);
      }
    } else {
      const { error: insertError } = await admin
        .from("syllabi")
        .insert(parsedPayload);

      if (insertError) {
        throw new Error(insertError.message);
      }
    }

    // Auto-import all suggestions immediately after parsing.
    const { importedCount } = await importSyllabusSuggestionsForCourse({
      supabase,
      userId,
      courseId,
      suggestions,
    });

    const redirectUrl = new URL("/courses", request.url);
    redirectUrl.searchParams.set("syllabusImported", "1");
    redirectUrl.searchParams.set("importedCount", String(importedCount));
    redirectUrl.searchParams.set("courseId", courseId);
    return NextResponse.redirect(redirectUrl, 303);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Unknown parsing error";

    // Select existing syllabi row again for failure path
    const {
      data: existingSyllabus,
      error: selectError,
    } = await admin
      .from("syllabi")
      .select("id")
      .eq("user_id", userId)
      .eq("course_id", courseId)
      .maybeSingle();

    if (selectError) {
      return jsonError(selectError.message, 500);
    }

    const failedPayload = {
      user_id: userId,
      course_id: courseId,
      storage_path: storagePath,
      original_filename: file.name,
      mime_type: "application/pdf",
      status: "failed" as const,
      parsed_at: null,
      parsed_suggestions: null,
      error_message: message,
    };

    if (existingSyllabus) {
      const { error: updateError } = await admin
        .from("syllabi")
        .update(failedPayload)
        .eq("id", existingSyllabus.id);

      if (updateError) {
        return jsonError(updateError.message, 500);
      }
    } else {
      const { error: insertError } = await admin
        .from("syllabi")
        .insert(failedPayload);

      if (insertError) {
        return jsonError(insertError.message, 500);
      }
    }
  }

  return NextResponse.redirect(new URL("/courses", request.url), 303);
}

