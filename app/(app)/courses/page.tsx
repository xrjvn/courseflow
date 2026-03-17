import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { SyllabusStatus } from "@/lib/types";
import { SyllabusStatusBadge } from "@/components/ui/syllabus-status-badge";
import {
  createCourseAction,
  updateCourseAction,
  deleteCourseAction,
} from "./actions";

type Course = {
  id: string;
  user_id: string;
  name: string;
  code: string | null;
  semester: string | null;
  color: string | null;
  created_at: string;
  updated_at: string;
};

type SyllabusRow = {
  id: string;
  course_id: string;
  status: SyllabusStatus;
};

async function getCoursesAndSyllabi(): Promise<{
  courses: Course[];
  syllabiByCourseId: Record<string, SyllabusRow>;
}> {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw new Error(userError.message);
  }

  if (!user) {
    return { courses: [], syllabiByCourseId: {} };
  }

  const { data: coursesData, error: coursesError } = await supabase
    .from("courses")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (coursesError) {
    throw new Error(coursesError.message);
  }

  const { data: syllabiData, error: syllabiError } = await supabase
    .from("syllabi")
    .select("id, course_id, status")
    .eq("user_id", user.id);

  if (syllabiError) {
    throw new Error(syllabiError.message);
  }

  const syllabiByCourseId: Record<string, SyllabusRow> = {};
  for (const row of syllabiData ?? []) {
    syllabiByCourseId[row.course_id as string] = {
      id: row.id as string,
      course_id: row.course_id as string,
      status: row.status as SyllabusStatus,
    };
  }

  return {
    courses: (coursesData ?? []) as Course[],
    syllabiByCourseId,
  };
}

export default async function CoursesPage({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const { courses, syllabiByCourseId } = await getCoursesAndSyllabi();

  const syllabusImported =
    typeof searchParams?.syllabusImported === "string"
      ? searchParams.syllabusImported === "1"
      : false;

  const importedCountRaw =
    typeof searchParams?.importedCount === "string"
      ? searchParams.importedCount
      : "";
  const importedCount = Number.parseInt(importedCountRaw, 10);

  const importedCourseId =
    typeof searchParams?.courseId === "string" ? searchParams.courseId : "";

  const importedCourseName =
    importedCourseId && courses.length
      ? courses.find((c) => c.id === importedCourseId)?.name
      : undefined;

  return (
    <div className="space-y-6">
      {syllabusImported && Number.isFinite(importedCount) ? (
        <details
          className="rounded-xl border border-emerald-900/60 bg-emerald-950/30 px-4 py-3"
          open
        >
          <summary className="cursor-pointer select-none text-xs font-medium text-emerald-200">
            Dismiss
          </summary>
          <p className="mt-2 text-sm text-emerald-100">
            {importedCount} assignment{importedCount === 1 ? "" : "s"} imported
            from {importedCourseName ?? "course"}.
          </p>
        </details>
      ) : null}
      <header className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-medium text-neutral-100">Courses</h2>
          <p className="mt-1 text-xs text-neutral-500">
            Track the classes that drive your workload.
          </p>
        </div>
        <details className="group">
          <summary className="inline-flex cursor-pointer items-center rounded-full bg-sky-500 px-3 py-1.5 text-xs font-semibold text-neutral-950 shadow-sm hover:bg-sky-400">
            Add course
          </summary>
          <div className="absolute right-4 z-20 mt-2 w-full max-w-md rounded-2xl border border-neutral-800 bg-neutral-950/95 p-4 shadow-xl shadow-black/50 sm:right-8">
            <h3 className="text-xs font-medium text-neutral-100">
              New course
            </h3>
            <p className="mt-1 text-[11px] text-neutral-500">
              Add the classes that define your semester.
            </p>
            <form className="mt-4 space-y-3" action={createCourseAction}>
              <div className="space-y-1">
                <label
                  htmlFor="name"
                  className="text-[11px] font-medium text-neutral-200"
                >
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-xs text-neutral-50 outline-none placeholder:text-neutral-600 focus:border-sky-500"
                  placeholder="Introduction to Algorithms"
                />
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="space-y-1">
                  <label
                    htmlFor="code"
                    className="text-[11px] font-medium text-neutral-200"
                  >
                    Code
                  </label>
                  <input
                    id="code"
                    name="code"
                    type="text"
                    className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-xs text-neutral-50 outline-none placeholder:text-neutral-600 focus:border-sky-500"
                    placeholder="CS101"
                  />
                </div>
                <div className="space-y-1">
                  <label
                    htmlFor="semester"
                    className="text-[11px] font-medium text-neutral-200"
                  >
                    Semester
                  </label>
                  <input
                    id="semester"
                    name="semester"
                    type="text"
                    className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-xs text-neutral-50 outline-none placeholder:text-neutral-600 focus:border-sky-500"
                    placeholder="Fall 2026"
                  />
                </div>
                <div className="space-y-1">
                  <label
                    htmlFor="color"
                    className="text-[11px] font-medium text-neutral-200"
                  >
                    Color
                  </label>
                  <input
                    id="color"
                    name="color"
                    type="text"
                    className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-xs text-neutral-50 outline-none placeholder:text-neutral-600 focus:border-sky-500"
                    placeholder="#0ea5e9"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="submit"
                  className="inline-flex items-center rounded-full bg-sky-500 px-3 py-1.5 text-xs font-semibold text-neutral-950 shadow-sm hover:bg-sky-400"
                >
                  Save course
                </button>
              </div>
            </form>
          </div>
        </details>
      </header>

      {courses.length === 0 ? (
        <section className="rounded-xl border border-dashed border-neutral-800 bg-neutral-900/40 p-6 text-sm text-neutral-400">
          You don&apos;t have any courses yet. Add your first course to start
          planning your semester.
        </section>
      ) : (
        <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => {
            const syllabus = syllabiByCourseId[course.id];
            const syllabusStatus: SyllabusStatus | "none" =
              syllabus?.status ?? "none";

            return (
            <article
              key={course.id}
              className="flex flex-col justify-between rounded-xl border border-neutral-800 bg-neutral-900/60 p-4"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm font-medium text-neutral-100">
                    {course.name}
                  </h3>
                  <div className="flex items-center gap-2">
                    {course.code ? (
                      <span className="rounded-full border border-neutral-700 bg-neutral-900 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-neutral-300">
                        {course.code}
                      </span>
                    ) : null}
                    <SyllabusStatusBadge status={syllabusStatus} />
                  </div>
                </div>
                {course.semester ? (
                  <p className="text-xs text-neutral-400">{course.semester}</p>
                ) : (
                  <p className="text-xs text-neutral-500">
                    No semester set yet.
                  </p>
                )}
              </div>
              <div className="mt-4 space-y-3">
                <details className="group text-xs text-neutral-400">
                  <summary className="inline-flex cursor-pointer items-center rounded-full border border-neutral-700 px-2.5 py-1 text-[11px] font-medium text-neutral-200 hover:border-neutral-500 hover:bg-neutral-900">
                    Upload syllabus
                  </summary>
                  <form
                    className="mt-3 space-y-2 rounded-lg border border-neutral-800 bg-neutral-950/90 p-3"
                    action="/api/syllabi/upload"
                    method="post"
                    encType="multipart/form-data"
                  >
                    <input type="hidden" name="course_id" value={course.id} />
                    <div className="space-y-1">
                      <label
                        htmlFor={`syllabus-${course.id}`}
                        className="text-[11px] font-medium text-neutral-200"
                      >
                        Syllabus PDF
                      </label>
                      <input
                        id={`syllabus-${course.id}`}
                        name="file"
                        type="file"
                        accept="application/pdf,.pdf"
                        required
                        className="block w-full text-[11px] text-neutral-300 file:mr-3 file:rounded-full file:border file:border-neutral-700 file:bg-neutral-900 file:px-3 file:py-1.5 file:text-[11px] file:font-medium file:text-neutral-200 hover:file:border-neutral-500 hover:file:bg-neutral-800"
                      />
                      <p className="text-[11px] text-neutral-500">
                        Uploading a new file will replace the existing syllabus.
                      </p>
                    </div>
                    <div className="flex justify-end pt-1">
                      <button
                        type="submit"
                        className="inline-flex items-center rounded-full bg-sky-500 px-3 py-1.5 text-[11px] font-semibold text-neutral-950 shadow-sm hover:bg-sky-400"
                      >
                        Upload PDF
                      </button>
                    </div>
                  </form>
                </details>

                <div className="flex items-center justify-between gap-2">
                  <details className="group w-full text-xs text-neutral-400">
                  <summary className="inline-flex cursor-pointer items-center rounded-full border border-neutral-700 px-2.5 py-1 text-[11px] font-medium text-neutral-200 hover:border-neutral-500 hover:bg-neutral-900">
                    Edit
                  </summary>
                  <form
                    className="mt-3 space-y-2 rounded-lg border border-neutral-800 bg-neutral-950/90 p-3"
                    action={updateCourseAction}
                  >
                    <input type="hidden" name="id" value={course.id} />
                    <div className="space-y-1">
                      <label
                        htmlFor={`name-${course.id}`}
                        className="text-[11px] font-medium text-neutral-200"
                      >
                        Name
                      </label>
                      <input
                        id={`name-${course.id}`}
                        name="name"
                        type="text"
                        defaultValue={course.name}
                        required
                        className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-xs text-neutral-50 outline-none placeholder:text-neutral-600 focus:border-sky-500"
                      />
                    </div>
                    <div className="grid gap-2 sm:grid-cols-3">
                      <div className="space-y-1">
                        <label
                          htmlFor={`code-${course.id}`}
                          className="text-[11px] font-medium text-neutral-200"
                        >
                          Code
                        </label>
                        <input
                          id={`code-${course.id}`}
                          name="code"
                          type="text"
                          defaultValue={course.code ?? ""}
                          className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-xs text-neutral-50 outline-none placeholder:text-neutral-600 focus:border-sky-500"
                        />
                      </div>
                      <div className="space-y-1">
                        <label
                          htmlFor={`semester-${course.id}`}
                          className="text-[11px] font-medium text-neutral-200"
                        >
                          Semester
                        </label>
                        <input
                          id={`semester-${course.id}`}
                          name="semester"
                          type="text"
                          defaultValue={course.semester ?? ""}
                          className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-xs text-neutral-50 outline-none placeholder:text-neutral-600 focus:border-sky-500"
                        />
                      </div>
                      <div className="space-y-1">
                        <label
                          htmlFor={`color-${course.id}`}
                          className="text-[11px] font-medium text-neutral-200"
                        >
                          Color
                        </label>
                        <input
                          id={`color-${course.id}`}
                          name="color"
                          type="text"
                          defaultValue={course.color ?? ""}
                          className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-xs text-neutral-50 outline-none placeholder:text-neutral-600 focus:border-sky-500"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        type="submit"
                        className="inline-flex items-center rounded-full bg-sky-500 px-3 py-1.5 text-[11px] font-semibold text-neutral-950 shadow-sm hover:bg-sky-400"
                      >
                        Save changes
                      </button>
                    </div>
                  </form>
                </details>
                <form action={deleteCourseAction} className="shrink-0">
                  <input type="hidden" name="id" value={course.id} />
                  <button
                    type="submit"
                    className="inline-flex items-center rounded-full border border-red-900/60 px-2.5 py-1 text-[11px] font-medium text-red-300 hover:border-red-500/80 hover:bg-red-950/60"
                  >
                    Delete
                  </button>
                </form>
              </div>
              </div>
            </article>
            );
          })}
        </section>
      )}
    </div>
  );
}

