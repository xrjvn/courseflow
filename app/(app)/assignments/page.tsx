import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  createAssignmentAction,
  updateAssignmentAction,
  deleteAssignmentAction,
  importSyllabusSuggestionsAction,
} from "./actions";
import type {
  AssignmentStatus,
  AssignmentPriority,
  SyllabusSuggestion,
} from "@/lib/types";
import { formatDateShort, toInputDateTimeLocal } from "@/lib/date";
import { StatusBadge } from "@/components/ui/status-badge";
import { PriorityBadge } from "@/components/ui/priority-badge";

type CourseOption = {
  id: string;
  name: string;
  code: string | null;
  color: string | null;
};

type AssignmentRow = {
  id: string;
  user_id: string;
  course_id: string;
  title: string;
  description: string | null;
  due_at: string;
  status: AssignmentStatus;
  priority: AssignmentPriority;
  created_at: string;
  updated_at: string;
};

type SyllabusRow = {
  id: string;
  course_id: string;
  status: "parsed";
  parsed_suggestions: SyllabusSuggestion[] | null;
};

async function getAssignmentsAndCourses(): Promise<{
  assignments: AssignmentRow[];
  courses: CourseOption[];
  syllabi: SyllabusRow[];
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
    return { assignments: [], courses: [], syllabi: [] };
  }

  const [
    { data: assignmentsData, error: assignmentsError },
    { data: coursesData, error: coursesError },
    { data: syllabiData, error: syllabiError },
  ] = await Promise.all([
    supabase
      .from("assignments")
      .select(
        `
          id,
          user_id,
          course_id,
          title,
          description,
          due_at,
          status,
          priority,
          created_at,
          updated_at
        `,
      )
      .eq("user_id", user.id)
      .order("due_at", { ascending: true }),
    supabase
      .from("courses")
      .select("id, name, code, color")
      .eq("user_id", user.id)
      .order("name", { ascending: true }),
    supabase
      .from("syllabi")
      .select("id, course_id, status, parsed_suggestions")
      .eq("user_id", user.id)
      .eq("status", "parsed")
      .not("parsed_suggestions", "is", null),
  ]);

  if (assignmentsError) throw new Error(assignmentsError.message);
  if (coursesError) throw new Error(coursesError.message);
  if (syllabiError) throw new Error(syllabiError.message);

  const assignments = (assignmentsData ?? []) as AssignmentRow[];
  const courses = (coursesData ?? []) as CourseOption[];
  const syllabi = (syllabiData ?? []) as SyllabusRow[];

  return { assignments, courses, syllabi };
}

export default async function AssignmentsPage() {
  const { assignments, courses, syllabi } = await getAssignmentsAndCourses();

  const coursesById = new Map(courses.map((c) => [c.id, c] as const));
  const syllabusGroups = syllabi
    .map((s) => ({
      syllabusId: s.id,
      courseId: s.course_id,
      course: coursesById.get(s.course_id),
      suggestions: Array.isArray(s.parsed_suggestions) ? s.parsed_suggestions : [],
    }))
    .filter((g) => g.suggestions.length > 0 && g.course);

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-sm font-medium text-neutral-100">Assignments</h2>
          <p className="mt-1 text-xs text-neutral-500">
            Centralize all of your coursework in one place.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button className="inline-flex items-center rounded-full border border-neutral-700 px-3 py-1.5 text-xs font-medium text-neutral-200 hover:border-neutral-500 hover:bg-neutral-900">
            Filter
          </button>
          <details className="group">
            <summary className="inline-flex cursor-pointer items-center rounded-full bg-sky-500 px-3 py-1.5 text-xs font-semibold text-neutral-950 shadow-sm hover:bg-sky-400">
              Add assignment
            </summary>
            <div className="absolute right-4 z-20 mt-2 w-full max-w-lg rounded-2xl border border-neutral-800 bg-neutral-950/95 p-4 shadow-xl shadow-black/50 sm:right-8">
              <h3 className="text-xs font-medium text-neutral-100">
                New assignment
              </h3>
              <p className="mt-1 text-[11px] text-neutral-500">
                Add upcoming work and connect it to a course.
              </p>
              <form className="mt-4 space-y-3" action={createAssignmentAction}>
                <div className="space-y-1">
                  <label
                    htmlFor="title"
                    className="text-[11px] font-medium text-neutral-200"
                  >
                    Title
                  </label>
                  <input
                    id="title"
                    name="title"
                    type="text"
                    required
                    className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-xs text-neutral-50 outline-none placeholder:text-neutral-600 focus:border-sky-500"
                    placeholder="Problem set 3"
                  />
                </div>
                <div className="space-y-1">
                  <label
                    htmlFor="description"
                    className="text-[11px] font-medium text-neutral-200"
                  >
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={2}
                    className="w-full resize-none rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-xs text-neutral-50 outline-none placeholder:text-neutral-600 focus:border-sky-500"
                    placeholder="Short description or notes"
                  />
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="space-y-1">
                    <label
                      htmlFor="course_id"
                      className="text-[11px] font-medium text-neutral-200"
                    >
                      Course
                    </label>
                    <select
                      id="course_id"
                      name="course_id"
                      required
                      className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-2 py-2 text-xs text-neutral-50 outline-none focus:border-sky-500"
                    >
                      <option value="">Select a course</option>
                      {courses.map((course) => (
                        <option key={course.id} value={course.id}>
                          {course.name}
                          {course.code ? ` · ${course.code}` : ""}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label
                      htmlFor="due_at"
                      className="text-[11px] font-medium text-neutral-200"
                    >
                      Due date
                    </label>
                    <input
                      id="due_at"
                      name="due_at"
                      type="datetime-local"
                      required
                      className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-2 py-2 text-xs text-neutral-50 outline-none placeholder:text-neutral-600 focus:border-sky-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label
                      htmlFor="status"
                      className="text-[11px] font-medium text-neutral-200"
                    >
                      Status
                    </label>
                    <select
                      id="status"
                      name="status"
                      required
                      defaultValue="not_started"
                      className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-2 py-2 text-xs text-neutral-50 outline-none focus:border-sky-500"
                    >
                      <option value="not_started">Not started</option>
                      <option value="in_progress">In progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="space-y-1">
                    <label
                      htmlFor="priority"
                      className="text-[11px] font-medium text-neutral-200"
                    >
                      Priority
                    </label>
                    <select
                      id="priority"
                      name="priority"
                      required
                      defaultValue="medium"
                      className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-2 py-2 text-xs text-neutral-50 outline-none focus:border-sky-500"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="submit"
                    className="inline-flex items-center rounded-full bg-sky-500 px-3 py-1.5 text-xs font-semibold text-neutral-950 shadow-sm hover:bg-sky-400"
                  >
                    Save assignment
                  </button>
                </div>
              </form>
            </div>
          </details>
        </div>
      </header>

      {assignments.length === 0 ? (
        <section className="rounded-xl border border-dashed border-neutral-800 bg-neutral-900/40 p-6 text-sm text-neutral-400">
          You don&apos;t have any assignments yet. Add your first assignment to
          start planning your workload.
        </section>
      ) : (
        <section className="rounded-xl border border-neutral-800 bg-neutral-900/60">
          <div className="hidden border-b border-neutral-800 px-4 py-2 text-[11px] text-neutral-400 sm:grid sm:grid-cols-[minmax(0,2fr)_minmax(0,1.2fr)_minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,0.8fr)_auto] sm:gap-3">
            <span>Title</span>
            <span>Course</span>
            <span>Due</span>
            <span>Status</span>
            <span>Priority</span>
            <span className="text-right">Actions</span>
          </div>
          <div className="divide-y divide-neutral-800">
            {assignments.map((assignment) => {
              const course = courses.find(
                (c) => c.id === assignment.course_id,
              );
              return (
                <article
                  key={assignment.id}
                  className="px-4 py-3 text-xs sm:grid sm:grid-cols-[minmax(0,2fr)_minmax(0,1.2fr)_minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,0.8fr)_auto] sm:gap-3"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-neutral-100">
                      {assignment.title}
                    </p>
                    {assignment.description ? (
                      <p className="text-[11px] text-neutral-400 line-clamp-2">
                        {assignment.description}
                      </p>
                    ) : null}
                    <div className="mt-1 flex items-center gap-2 text-[11px] text-neutral-500 sm:hidden">
                      <span>
                        {course ? course.name : "No course"}{" "}
                        {course?.code ? `· ${course.code}` : ""}
                      </span>
                      <span>·</span>
                      <span>{formatDateShort(assignment.due_at)}</span>
                    </div>
                  </div>
                  <div className="hidden items-center text-xs text-neutral-300 sm:flex">
                    {course ? (
                      <span>
                        {course.name}
                        {course.code ? ` · ${course.code}` : ""}
                      </span>
                    ) : (
                      <span className="text-neutral-500">No course</span>
                    )}
                  </div>
                  <div className="hidden items-center text-xs text-neutral-300 sm:flex">
                    {formatDateShort(assignment.due_at)}
                  </div>
                  <div className="mt-2 flex items-center text-[11px] sm:mt-0 sm:flex">
                    <StatusBadge status={assignment.status} />
                  </div>
                  <div className="mt-2 flex items-center text-[11px] sm:mt-0 sm:flex">
                    <PriorityBadge priority={assignment.priority} />
                  </div>
                  <div className="mt-2 flex items-center justify-end gap-2 sm:mt-0">
                    <details className="group text-[11px] text-neutral-400">
                      <summary className="inline-flex cursor-pointer items-center rounded-full border border-neutral-700 px-2.5 py-1 text-[11px] font-medium text-neutral-200 hover:border-neutral-500 hover:bg-neutral-900">
                        Edit
                      </summary>
                      <form
                        className="mt-3 space-y-2 rounded-lg border border-neutral-800 bg-neutral-950/90 p-3"
                        action={updateAssignmentAction}
                      >
                        <input type="hidden" name="id" value={assignment.id} />
                        <div className="space-y-1">
                          <label
                            htmlFor={`title-${assignment.id}`}
                            className="text-[11px] font-medium text-neutral-200"
                          >
                            Title
                          </label>
                          <input
                            id={`title-${assignment.id}`}
                            name="title"
                            type="text"
                            defaultValue={assignment.title}
                            required
                            className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-xs text-neutral-50 outline-none placeholder:text-neutral-600 focus:border-sky-500"
                          />
                        </div>
                        <div className="space-y-1">
                          <label
                            htmlFor={`description-${assignment.id}`}
                            className="text-[11px] font-medium text-neutral-200"
                          >
                            Description
                          </label>
                          <textarea
                            id={`description-${assignment.id}`}
                            name="description"
                            rows={2}
                            defaultValue={assignment.description ?? ""}
                            className="w-full resize-none rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-xs text-neutral-50 outline-none placeholder:text-neutral-600 focus:border-sky-500"
                          />
                        </div>
                        <div className="grid gap-2 sm:grid-cols-3">
                          <div className="space-y-1">
                            <label
                              htmlFor={`course_id-${assignment.id}`}
                              className="text-[11px] font-medium text-neutral-200"
                            >
                              Course
                            </label>
                            <select
                              id={`course_id-${assignment.id}`}
                              name="course_id"
                              defaultValue={assignment.course_id}
                              required
                              className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-2 py-2 text-xs text-neutral-50 outline-none focus:border-sky-500"
                            >
                              {courses.map((course) => (
                                <option key={course.id} value={course.id}>
                                  {course.name}
                                  {course.code ? ` · ${course.code}` : ""}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="space-y-1">
                            <label
                              htmlFor={`due_at-${assignment.id}`}
                              className="text-[11px] font-medium text-neutral-200"
                            >
                              Due date
                            </label>
                            <input
                              id={`due_at-${assignment.id}`}
                              name="due_at"
                              type="datetime-local"
                              required
                              defaultValue={toInputDateTimeLocal(
                                assignment.due_at,
                              )}
                              className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-2 py-2 text-xs text-neutral-50 outline-none placeholder:text-neutral-600 focus:border-sky-500"
                            />
                          </div>
                          <div className="space-y-1">
                            <label
                              htmlFor={`status-${assignment.id}`}
                              className="text-[11px] font-medium text-neutral-200"
                            >
                              Status
                            </label>
                            <select
                              id={`status-${assignment.id}`}
                              name="status"
                              defaultValue={assignment.status}
                              required
                              className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-2 py-2 text-xs text-neutral-50 outline-none focus:border-sky-500"
                            >
                              <option value="not_started">Not started</option>
                              <option value="in_progress">In progress</option>
                              <option value="completed">Completed</option>
                            </select>
                          </div>
                        </div>
                        <div className="grid gap-2 sm:grid-cols-3">
                          <div className="space-y-1">
                            <label
                              htmlFor={`priority-${assignment.id}`}
                              className="text-[11px] font-medium text-neutral-200"
                            >
                              Priority
                            </label>
                            <select
                              id={`priority-${assignment.id}`}
                              name="priority"
                              defaultValue={assignment.priority}
                              required
                              className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-2 py-2 text-xs text-neutral-50 outline-none focus:border-sky-500"
                            >
                              <option value="low">Low</option>
                              <option value="medium">Medium</option>
                              <option value="high">High</option>
                            </select>
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
                    <form
                      action={deleteAssignmentAction}
                      className="shrink-0"
                    >
                      <input type="hidden" name="id" value={assignment.id} />
                      <button
                        type="submit"
                        className="inline-flex items-center rounded-full border border-red-900/60 px-2.5 py-1 text-[11px] font-medium text-red-300 hover:border-red-500/80 hover:bg-red-950/60"
                      >
                        Delete
                      </button>
                    </form>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}

      <section className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium text-neutral-100">From syllabus</h2>
          <span className="text-xs text-neutral-500">
            {syllabusGroups.length === 0
              ? "No parsed syllabi yet"
              : `${syllabusGroups.length} course${syllabusGroups.length === 1 ? "" : "s"}`}
          </span>
        </div>

        {syllabusGroups.length === 0 ? (
          <div className="mt-4 rounded-lg border border-dashed border-neutral-800 bg-neutral-900/40 p-6 text-sm text-neutral-400">
            Upload a syllabus on the Courses page to generate suggestions you can review and import here.
          </div>
        ) : (
          <div className="mt-4 space-y-4">
            {syllabusGroups.map((group) => (
              <div
                key={group.syllabusId}
                className="rounded-lg border border-neutral-800 bg-neutral-950/40 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-neutral-100">
                      {group.course!.name}
                      {group.course!.code ? ` · ${group.course!.code}` : ""}
                    </p>
                    <p className="mt-1 text-[11px] text-neutral-500">
                      Select items to create real assignments.
                    </p>
                  </div>
                </div>

                <form action={importSyllabusSuggestionsAction} className="mt-3 space-y-3">
                  <input type="hidden" name="syllabus_id" value={group.syllabusId} />
                  <div className="space-y-2">
                    {group.suggestions.map((s) => {
                      const dueLabel =
                        s.suggestedDueAt
                          ? formatDateShort(s.suggestedDueAt)
                          : s.rawDateText
                            ? s.rawDateText
                            : "No due date";

                      const canImport = Boolean(s.suggestedDueAt || s.rawDateText);

                      return (
                        <label
                          key={s.id}
                          className={`flex items-start gap-3 rounded-lg border border-neutral-800 bg-neutral-950/60 px-3 py-2 ${
                            canImport ? "cursor-pointer" : "opacity-60"
                          }`}
                        >
                          <input
                            type="checkbox"
                            name="suggestion_id"
                            value={s.id}
                            disabled={!canImport}
                            className="mt-1 h-4 w-4 rounded border-neutral-700 bg-neutral-950 text-sky-500"
                          />
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="text-sm font-medium text-neutral-100">
                                {s.title}
                              </p>
                              <span className="rounded-full bg-neutral-800 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-neutral-200">
                                {s.type}
                              </span>
                              <span className="text-[11px] text-neutral-400">
                                {dueLabel}
                              </span>
                            </div>
                            {s.notes ? (
                              <p className="mt-1 text-[11px] text-neutral-500">
                                {s.notes}
                              </p>
                            ) : null}
                          </div>
                        </label>
                      );
                    })}
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="inline-flex items-center rounded-full bg-sky-500 px-3 py-1.5 text-xs font-semibold text-neutral-950 shadow-sm hover:bg-sky-400"
                    >
                      Import selected
                    </button>
                  </div>
                </form>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

