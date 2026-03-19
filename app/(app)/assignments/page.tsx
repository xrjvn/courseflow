import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  createAssignmentAction,
  updateAssignmentAction,
  deleteAssignmentAction,
} from "./actions";
import type { AssignmentStatus, AssignmentPriority } from "@/lib/types";
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

async function getAssignmentsAndCourses(): Promise<{
  assignments: AssignmentRow[];
  courses: CourseOption[];
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
    return { assignments: [], courses: [] };
  }

  const [
    { data: assignmentsData, error: assignmentsError },
    { data: coursesData, error: coursesError },
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
  ]);

  if (assignmentsError) throw new Error(assignmentsError.message);
  if (coursesError) throw new Error(coursesError.message);

  const assignments = (assignmentsData ?? []) as AssignmentRow[];
  const courses = (coursesData ?? []) as CourseOption[];

  return { assignments, courses };
}

function getDueToneClass(dueAtIso: string): string {
  const due = new Date(dueAtIso);
  const now = new Date();

  if (Number.isNaN(due.getTime())) return "text-[var(--text-secondary)]";

  if (due.getTime() < now.getTime()) return "text-[#f87171]";

  const in7Days = now.getTime() + 7 * 24 * 60 * 60 * 1000;
  if (due.getTime() <= in7Days) return "text-[#fbbf24]";

  return "text-[var(--text-secondary)]";
}

export default async function AssignmentsPage() {
  const { assignments, courses } = await getAssignmentsAndCourses();

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-end">
        <div className="flex flex-wrap items-center gap-2">
          <button className="inline-flex items-center rounded-lg border border-[var(--border-default)] bg-transparent px-4 py-2 text-sm font-medium text-[var(--text-secondary)]">
            Filter
          </button>
          <details className="group">
            <summary
              className="inline-flex cursor-pointer items-center rounded-lg px-4 py-2 text-sm font-medium text-white"
              style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}
            >
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
        <section className="overflow-hidden rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)]">
          <div className="hidden bg-[var(--bg-base)] border-b border-[var(--border-subtle)] px-4 py-3 text-[11px] font-medium uppercase tracking-widest text-[var(--text-muted)] sm:grid sm:grid-cols-[minmax(0,2fr)_minmax(0,1.2fr)_minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,0.8fr)_auto] sm:gap-3">
            <span className="text-left">Title</span>
            <span className="text-left">Course</span>
            <span className="text-left">Due</span>
            <span className="text-left">Status</span>
            <span className="text-left">Priority</span>
            <span className="text-right">Actions</span>
          </div>
          <div>
            {assignments.map((assignment) => {
              const course = courses.find(
                (c) => c.id === assignment.course_id,
              );
              const dueTone = getDueToneClass(assignment.due_at);
              return (
                <article
                  key={assignment.id}
                  className="group border-b border-[rgba(255,255,255,0.04)] last:border-b-0 px-4 py-3 text-xs transition duration-150 hover:bg-[rgba(255,255,255,0.02)] sm:grid sm:grid-cols-[minmax(0,2fr)_minmax(0,1.2fr)_minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,0.8fr)_auto] sm:gap-3"
                >
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-[var(--text-primary)]">
                      {assignment.title}
                    </p>
                    {assignment.description ? (
                      <p className="truncate whitespace-nowrap text-xs text-[var(--text-muted)] mt-0.5">
                        {assignment.description}
                      </p>
                    ) : null}
                    <div className="mt-1 flex items-center gap-2 sm:hidden">
                      <span className="inline-block rounded-md bg-[var(--bg-elevated)] px-2 py-0.5 text-xs text-[var(--text-secondary)]">
                        {course ? course.name : "No course"}{" "}
                        {course?.code ? `· ${course.code}` : ""}
                      </span>
                      <span className={`font-mono text-sm ${dueTone}`}>
                        {formatDateShort(assignment.due_at)}
                      </span>
                    </div>
                  </div>
                  <div className="hidden items-center sm:flex">
                    {course ? (
                      <span className="inline-block rounded-md bg-[var(--bg-elevated)] px-2 py-0.5 text-xs text-[var(--text-secondary)]">
                        {course.name}
                        {course.code ? ` · ${course.code}` : ""}
                      </span>
                    ) : (
                      <span className="inline-block rounded-md bg-[var(--bg-elevated)] px-2 py-0.5 text-xs text-[var(--text-secondary)]">
                        No course
                      </span>
                    )}
                  </div>
                  <div className="hidden items-center sm:flex">
                    <span className={`font-mono text-sm ${dueTone}`}>
                      {formatDateShort(assignment.due_at)}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center sm:mt-0 sm:flex">
                    <StatusBadge
                      status={assignment.status}
                      className={
                        assignment.status === "not_started"
                          ? "!bg-[rgba(255,255,255,0.06)] !text-[var(--text-muted)] !px-2.5 !text-xs"
                          : assignment.status === "in_progress"
                            ? "!bg-[rgba(99,102,241,0.12)] !text-[#818cf8] !px-2.5 !text-xs"
                            : "!bg-[rgba(16,185,129,0.12)] !text-[#34d399] !px-2.5 !text-xs"
                      }
                    />
                  </div>
                  <div className="mt-2 flex items-center sm:mt-0 sm:flex">
                    <PriorityBadge
                      priority={assignment.priority}
                      className={
                        assignment.priority === "high"
                          ? "!bg-[rgba(239,68,68,0.12)] !text-[#f87171] !border-0 !px-2.5 !text-xs"
                          : assignment.priority === "medium"
                            ? "!bg-[rgba(245,158,11,0.12)] !text-[#fbbf24] !border-0 !px-2.5 !text-xs"
                            : "!bg-[rgba(16,185,129,0.12)] !text-[#34d399] !border-0 !px-2.5 !text-xs"
                      }
                    />
                  </div>
                  <div className="mt-2 flex items-center justify-end gap-1 opacity-100 transition-opacity duration-150 sm:mt-0 sm:opacity-0 group-hover:opacity-100">
                    <details className="group text-[11px]">
                      <summary className="inline-flex cursor-pointer items-center rounded-lg px-2 py-1 text-xs font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)]">
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
                        className="inline-flex items-center rounded-lg px-2 py-1 text-xs font-medium text-[rgba(239,68,68,0.5)] hover:text-[#f87171]"
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
    </div>
  );
}

