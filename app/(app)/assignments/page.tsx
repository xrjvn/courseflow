import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  createAssignmentAction,
} from "./actions";
import type { AssignmentStatus, AssignmentPriority } from "@/lib/types";
import { AssignmentsClient } from "@/components/assignments/edit-drawer";

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

      <AssignmentsClient assignments={assignments} courses={courses} />
    </div>
  );
}

