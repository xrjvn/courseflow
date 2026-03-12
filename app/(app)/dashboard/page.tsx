import { createSupabaseServerClient } from "@/lib/supabase/server";

type AssignmentStatus = "not_started" | "in_progress" | "completed";
type AssignmentPriority = "low" | "medium" | "high";

type CourseInfo = {
  id: string;
  name: string;
  code: string | null;
};

type AssignmentSummary = {
  id: string;
  title: string;
  due_at: string;
  status: AssignmentStatus;
  priority: AssignmentPriority;
  course_id: string;
};

type DashboardData = {
  totalCourses: number;
  totalAssignments: number;
  assignmentsDueThisWeek: number;
  completedAssignments: number;
  upcomingAssignments: AssignmentSummary[];
  overdueAssignments: AssignmentSummary[];
  coursesById: Record<string, CourseInfo>;
};

function startOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay(); // 0 (Sun) - 6 (Sat)
  const diff = (day + 6) % 7; // days since Monday
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - diff);
  return d;
}

function endOfWeek(date: Date): Date {
  const start = startOfWeek(date);
  const end = new Date(start);
  end.setDate(start.getDate() + 7);
  return end;
}

function formatDueDate(value: string): string {
  const date = new Date(value);
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

async function getDashboardData(): Promise<DashboardData> {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw new Error(userError.message);
  }

  if (!user) {
    return {
      totalCourses: 0,
      totalAssignments: 0,
      assignmentsDueThisWeek: 0,
      completedAssignments: 0,
      upcomingAssignments: [],
      overdueAssignments: [],
      coursesById: {},
    };
  }

  const userId = user.id;
  const now = new Date();
  const nowIso = now.toISOString();
  const weekStart = startOfWeek(now).toISOString();
  const weekEnd = endOfWeek(now).toISOString();

  const [{ count: coursesCount }, { count: assignmentsCount }, { count: completedCount }] =
    await Promise.all([
      supabase
        .from("courses")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId),
      supabase
        .from("assignments")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId),
      supabase
        .from("assignments")
        .select("id", { count: "exact", head: true })
        .eq("user_id", userId)
        .eq("status", "completed"),
    ]);

  const { count: dueThisWeekCount } = await supabase
    .from("assignments")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .gte("due_at", weekStart)
    .lt("due_at", weekEnd);

  const { data: upcomingData, error: upcomingError } = await supabase
    .from("assignments")
    .select("id, title, due_at, status, priority, course_id")
    .eq("user_id", userId)
    .gte("due_at", nowIso)
    .order("due_at", { ascending: true })
    .limit(5);

  if (upcomingError) {
    throw new Error(upcomingError.message);
  }

  const { data: overdueData, error: overdueError } = await supabase
    .from("assignments")
    .select("id, title, due_at, status, priority, course_id")
    .eq("user_id", userId)
    .lt("due_at", nowIso)
    .neq("status", "completed")
    .order("due_at", { ascending: true })
    .limit(5);

  if (overdueError) {
    throw new Error(overdueError.message);
  }

  const { data: coursesData, error: coursesError } = await supabase
    .from("courses")
    .select("id, name, code")
    .eq("user_id", userId);

  if (coursesError) {
    throw new Error(coursesError.message);
  }

  const coursesById: Record<string, CourseInfo> = {};
  for (const course of coursesData ?? []) {
    coursesById[course.id as string] = {
      id: course.id as string,
      name: course.name as string,
      code: (course.code ?? null) as string | null,
    };
  }

  return {
    totalCourses: coursesCount ?? 0,
    totalAssignments: assignmentsCount ?? 0,
    assignmentsDueThisWeek: dueThisWeekCount ?? 0,
    completedAssignments: completedCount ?? 0,
    upcomingAssignments: (upcomingData ?? []) as AssignmentSummary[],
    overdueAssignments: (overdueData ?? []) as AssignmentSummary[],
    coursesById,
  };
}

export default async function DashboardPage() {
  const {
    totalCourses,
    totalAssignments,
    assignmentsDueThisWeek,
    completedAssignments,
    upcomingAssignments,
    overdueAssignments,
    coursesById,
  } = await getDashboardData();

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-4">
          <p className="text-xs font-medium text-neutral-400">Courses</p>
          <p className="mt-2 text-2xl font-semibold tracking-tight text-neutral-50">
            {totalCourses}
          </p>
          <p className="mt-1 text-xs text-neutral-500">
            Add your courses to get started.
          </p>
        </div>
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-4">
          <p className="text-xs font-medium text-neutral-400">Assignments</p>
          <p className="mt-2 text-2xl font-semibold tracking-tight text-neutral-50">
            {totalAssignments}
          </p>
          <p className="mt-1 text-xs text-neutral-500">
            All assignments across your courses.
          </p>
        </div>
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-4">
          <p className="text-xs font-medium text-neutral-400">
            Due this week
          </p>
          <p className="mt-2 text-2xl font-semibold tracking-tight text-neutral-50">
            {assignmentsDueThisWeek}
          </p>
          <p className="mt-1 text-xs text-neutral-500">
            Assignments with due dates in the current week.
          </p>
        </div>
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-4">
          <p className="text-xs font-medium text-neutral-400">
            Completed assignments
          </p>
          <p className="mt-2 text-2xl font-semibold tracking-tight text-neutral-50">
            {completedAssignments}
          </p>
          <p className="mt-1 text-xs text-neutral-500">
            Finished work across the semester.
          </p>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-4 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-neutral-100">
              Upcoming assignments
            </h2>
            <span className="text-xs text-neutral-500">
              {upcomingAssignments.length === 0
                ? "Nothing due soon"
                : `Next ${upcomingAssignments.length} due`}
            </span>
          </div>
          {upcomingAssignments.length === 0 ? (
            <div className="mt-4 rounded-lg border border-dashed border-neutral-800 bg-neutral-900/40 p-6 text-sm text-neutral-400">
              As you add assignments with future due dates, the next few items
              will appear here.
            </div>
          ) : (
            <ul className="mt-4 space-y-2 text-xs">
              {upcomingAssignments.map((assignment) => {
                const course = coursesById[assignment.course_id];
                return (
                  <li
                    key={assignment.id}
                    className="flex items-center justify-between rounded-lg border border-neutral-800 bg-neutral-950/60 px-3 py-2"
                  >
                    <div className="space-y-0.5">
                      <p className="text-sm font-medium text-neutral-100">
                        {assignment.title}
                      </p>
                      <p className="text-[11px] text-neutral-500">
                        {course ? course.name : "No course"}
                        {course?.code ? ` · ${course.code}` : ""} ·{" "}
                        {formatDueDate(assignment.due_at)}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium ${
                          assignment.status === "completed"
                            ? "bg-emerald-900/50 text-emerald-300"
                            : assignment.status === "in_progress"
                              ? "bg-sky-900/50 text-sky-300"
                              : "bg-neutral-800 text-neutral-200"
                        }`}
                      >
                        {assignment.status.replace("_", " ")}
                      </span>
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium ${
                          assignment.priority === "high"
                            ? "bg-red-900/60 text-red-300"
                            : assignment.priority === "medium"
                              ? "bg-amber-900/60 text-amber-300"
                              : "bg-neutral-800 text-neutral-200"
                        }`}
                      >
                        {assignment.priority}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-4">
          <h2 className="text-sm font-medium text-neutral-100">
            Overdue assignments
          </h2>
          {overdueAssignments.length === 0 ? (
            <p className="mt-3 text-sm text-neutral-400">
              You&apos;re caught up. Anything overdue will show up here.
            </p>
          ) : (
            <ul className="mt-3 space-y-2 text-xs">
              {overdueAssignments.map((assignment) => {
                const course = coursesById[assignment.course_id];
                return (
                  <li
                    key={assignment.id}
                    className="flex items-center justify-between rounded-lg border border-red-900/60 bg-red-950/40 px-3 py-2"
                  >
                    <div className="space-y-0.5">
                      <p className="text-sm font-medium text-red-100">
                        {assignment.title}
                      </p>
                      <p className="text-[11px] text-red-200/80">
                        {course ? course.name : "No course"}
                        {course?.code ? ` · ${course.code}` : ""} · Due{" "}
                        {formatDueDate(assignment.due_at)}
                      </p>
                    </div>
                    <span className="inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium bg-red-900/80 text-red-100">
                      Overdue
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}

