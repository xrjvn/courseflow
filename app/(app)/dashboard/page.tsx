import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { AssignmentStatus, AssignmentPriority } from "@/lib/types";
import { startOfWeek, endOfWeek, formatDateShort } from "@/lib/date";
import { StatusBadge } from "@/components/ui/status-badge";
import { PriorityBadge } from "@/components/ui/priority-badge";

type CourseSummary = {
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
  plannerCoveragePercent: number;
  completedAssignments: number;
  upcomingAssignments: AssignmentSummary[];
  overdueAssignments: AssignmentSummary[];
  coursesById: Record<string, CourseSummary>;
};

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
      plannerCoveragePercent: 0,
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
    .lt("due_at", weekEnd)
    .neq("status", "completed");

  const { data: dueThisWeekDates, error: dueThisWeekDatesError } = await supabase
    .from("assignments")
    .select("due_at")
    .eq("user_id", userId)
    .gte("due_at", weekStart)
    .lt("due_at", weekEnd)
    .neq("status", "completed");

  if (dueThisWeekDatesError) {
    throw new Error(dueThisWeekDatesError.message);
  }

  const daysWithAssignments = new Set<string>();
  for (const row of dueThisWeekDates ?? []) {
    const dueAt = row.due_at as string;
    const d = new Date(dueAt);
    const key = `${d.getFullYear()}-${(d.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${d.getDate().toString().padStart(2, "0")}`;
    daysWithAssignments.add(key);
  }

  const plannerCoveragePercent = Math.round(
    (daysWithAssignments.size / 7) * 100,
  );

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

  const coursesById: Record<string, CourseSummary> = {};
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
    plannerCoveragePercent,
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
    plannerCoveragePercent,
    completedAssignments,
    upcomingAssignments,
    overdueAssignments,
    coursesById,
  } = await getDashboardData();

  const statCardClass =
    "relative overflow-hidden rounded-[10px] border border-border-subtle bg-bg-surface p-4";

  const statCardHighlightClass =
    "before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-px " +
    "before:bg-[linear-gradient(90deg,transparent,rgba(124,106,255,0.3),transparent)]";

  return (
    <div className="space-y-6 p-6">
      <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className={`${statCardClass} ${statCardHighlightClass}`}>
          <p className="text-[11px] font-medium text-text-muted">Courses</p>
          <p className="mt-2 text-3xl font-medium tracking-tight text-text-primary">
            {totalCourses}
          </p>
          <p className="mt-1 text-[11px] text-text-muted">
            Add your courses to get started.
          </p>
        </div>
        <div className={`${statCardClass} ${statCardHighlightClass}`}>
          <p className="text-[11px] font-medium text-text-muted">Assignments</p>
          <p className="mt-2 text-3xl font-medium tracking-tight text-text-primary">
            {totalAssignments}
          </p>
          <p className="mt-1 text-[11px] text-text-muted">
            All assignments across your courses.
          </p>
        </div>
        <div className={`${statCardClass} ${statCardHighlightClass}`}>
          <p className="text-[11px] font-medium text-text-muted">Due this week</p>
          <p className="mt-2 text-3xl font-medium tracking-tight text-text-primary">
            {assignmentsDueThisWeek}
          </p>
          <p className="mt-1 text-[11px] text-text-muted">
            Assignments with due dates in the current week.
          </p>
        </div>
        <div className={`${statCardClass} ${statCardHighlightClass}`}>
          <p className="text-[11px] font-medium text-text-muted">
            Completed assignments
          </p>
          <p className="mt-2 text-3xl font-medium tracking-tight text-text-primary">
            {completedAssignments}
          </p>
          <p className="mt-1 text-[11px] text-text-muted">
            Finished work across the semester.
          </p>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-[10px] border border-border-subtle bg-bg-surface p-4 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-text-primary">
              Upcoming assignments
            </h2>
            <span className="text-xs text-text-muted">
              {upcomingAssignments.length === 0
                ? "Nothing due soon"
                : `Next ${upcomingAssignments.length} due`}
            </span>
          </div>
          {upcomingAssignments.length === 0 ? (
            <div className="mt-4 rounded-[10px] border border-dashed border-border-subtle bg-bg-elevated p-6 text-sm text-text-secondary">
              As you add assignments with future due dates, the next few items
              will appear here.
            </div>
          ) : (
            <ul className="mt-4 overflow-hidden rounded-[10px] border border-border-subtle bg-bg-elevated">
              {upcomingAssignments.map((assignment) => {
                const course = coursesById[assignment.course_id];
                return (
                  <li
                    key={assignment.id}
                    className="flex items-center justify-between px-3 py-2 border-b border-[rgba(255,255,255,0.04)] last:border-b-0"
                  >
                    <div className="space-y-0.5">
                      <p className="text-[13px] font-medium text-text-primary">
                        {assignment.title}
                      </p>
                      <p className="text-[11px] font-mono text-text-muted">
                        {course ? course.name : "No course"}
                        {course?.code ? ` · ${course.code}` : ""} ·{" "}
                        {formatDateShort(assignment.due_at)}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <StatusBadge status={assignment.status} />
                      <PriorityBadge priority={assignment.priority} />
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
        <div className="rounded-[10px] border border-border-subtle bg-bg-surface p-4">
          <h2 className="text-sm font-medium text-text-primary">
            Overdue assignments
          </h2>
          {overdueAssignments.length === 0 ? (
            <p className="mt-3 text-sm text-text-secondary">
              You&apos;re caught up. Anything overdue will show up here.
            </p>
          ) : (
            <ul className="mt-3 overflow-hidden rounded-[10px] border border-border-subtle bg-bg-elevated">
              {overdueAssignments.map((assignment) => {
                const course = coursesById[assignment.course_id];
                return (
                  <li
                    key={assignment.id}
                    className="flex items-center justify-between px-3 py-2 border-b border-[rgba(255,255,255,0.04)] last:border-b-0"
                  >
                    <div className="space-y-0.5">
                      <p className="text-[13px] font-medium text-text-primary">
                        {assignment.title}
                      </p>
                      <p className="text-[11px] font-mono text-text-muted">
                        {course ? course.name : "No course"}
                        {course?.code ? ` · ${course.code}` : ""} · Due{" "}
                        {formatDateShort(assignment.due_at)}
                      </p>
                    </div>
                    <span className="inline-flex rounded-full border border-[rgba(239,68,68,0.15)] bg-[rgba(239,68,68,0.12)] px-2 py-0.5 text-[11px] font-medium text-[#f87171]">
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

