import { createSupabaseServerClient } from "@/lib/supabase/server";

type AssignmentStatus = "not_started" | "in_progress" | "completed";
type AssignmentPriority = "low" | "medium" | "high";

type CourseInfo = {
  id: string;
  name: string;
  code: string | null;
};

type AssignmentForPlanner = {
  id: string;
  title: string;
  due_at: string;
  status: AssignmentStatus;
  priority: AssignmentPriority;
  course_id: string;
};

type PlannerDay = {
  key: string;
  label: string;
  weekdayShort: string;
  assignments: AssignmentForPlanner[];
};

type PlannerData = {
  days: PlannerDay[];
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

function formatDayLabel(date: Date): string {
  return date.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function dayKey(date: Date): string {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getWeekDays(base: Date): PlannerDay[] {
  const start = startOfWeek(base);
  const days: PlannerDay[] = [];

  for (let i = 0; i < 7; i += 1) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);

    days.push({
      key: dayKey(d),
      label: formatDayLabel(d),
      weekdayShort: d.toLocaleDateString(undefined, { weekday: "short" }),
      assignments: [],
    });
  }

  return days;
}

async function getPlannerData(): Promise<PlannerData> {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw new Error(userError.message);
  }

  if (!user) {
    return { days: getWeekDays(new Date()), coursesById: {} };
  }

  const userId = user.id;
  const now = new Date();
  const weekStart = startOfWeek(now).toISOString();
  const weekEnd = endOfWeek(now).toISOString();

  const [{ data: assignmentsData, error: assignmentsError }, { data: coursesData, error: coursesError }] =
    await Promise.all([
      supabase
        .from("assignments")
        .select("id, title, due_at, status, priority, course_id")
        .eq("user_id", userId)
        .gte("due_at", weekStart)
        .lt("due_at", weekEnd)
        .order("due_at", { ascending: true }),
      supabase
        .from("courses")
        .select("id, name, code")
        .eq("user_id", userId),
    ]);

  if (assignmentsError) {
    throw new Error(assignmentsError.message);
  }

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

  const baseWeek = getWeekDays(now);
  const assignmentsByDay = new Map<string, AssignmentForPlanner[]>();

  for (const row of assignmentsData ?? []) {
    const date = new Date(row.due_at as string);
    const key = dayKey(date);
    const list = assignmentsByDay.get(key) ?? [];
    list.push({
      id: row.id as string,
      title: row.title as string,
      due_at: row.due_at as string,
      status: row.status as AssignmentStatus,
      priority: row.priority as AssignmentPriority,
      course_id: row.course_id as string,
    });
    assignmentsByDay.set(key, list);
  }

  const days: PlannerDay[] = baseWeek.map((day) => ({
    ...day,
    assignments: assignmentsByDay.get(day.key) ?? [],
  }));

  return { days, coursesById };
}

export default async function PlannerPage() {
  const { days, coursesById } = await getPlannerData();

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-sm font-medium text-neutral-100">
            Weekly planner
          </h2>
          <p className="mt-1 text-xs text-neutral-500">
            A simple weekly view that groups assignments by due date for the
            current week.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-neutral-400">
          <span className="rounded-full border border-neutral-700 px-3 py-1.5 font-medium">
            Current week
          </span>
        </div>
      </header>

      <section className="overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900/60">
        <div className="grid grid-cols-7 border-b border-neutral-800 bg-neutral-900/80 text-xs font-medium text-neutral-300">
          {days.map((day) => (
            <div key={day.key} className="px-3 py-2 text-center">
              {day.weekdayShort}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 divide-x divide-neutral-800 text-xs">
          {days.map((day) => (
            <div
              key={day.key}
              className="min-h-[180px] border-t border-neutral-800 bg-neutral-950/40 p-3 align-top"
            >
              <p className="mb-1 text-[11px] font-medium uppercase tracking-wide text-neutral-500">
                {day.label}
              </p>
              {day.assignments.length === 0 ? (
                <div className="mt-1 rounded-lg border border-dashed border-neutral-800 bg-neutral-900/40 p-3 text-[11px] text-neutral-500">
                  No assignments due on this day.
                </div>
              ) : (
                <ul className="mt-1 space-y-1.5">
                  {day.assignments.map((assignment) => {
                    const course = coursesById[assignment.course_id];
                    return (
                      <li
                        key={assignment.id}
                        className="rounded-lg border border-neutral-800 bg-neutral-950/80 px-2.5 py-2"
                      >
                        <p className="text-[12px] font-medium text-neutral-100">
                          {assignment.title}
                        </p>
                        <p className="mt-0.5 text-[11px] text-neutral-500">
                          {course ? course.name : "No course"}
                          {course?.code ? ` · ${course.code}` : ""}
                        </p>
                        <div className="mt-1 flex items-center gap-2 text-[10px]">
                          <span
                            className={`inline-flex rounded-full px-2 py-0.5 font-medium ${
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
                            className={`inline-flex rounded-full px-2 py-0.5 font-medium ${
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
          ))}
        </div>
      </section>
    </div>
  );
}

