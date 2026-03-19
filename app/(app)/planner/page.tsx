import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { AssignmentStatus, AssignmentPriority } from "@/lib/types";
import { startOfWeek, endOfWeek } from "@/lib/date";
import { StatusBadge } from "@/components/ui/status-badge";
import { PriorityBadge } from "@/components/ui/priority-badge";
import { FullScreenCalendar } from "@/components/ui/fullscreen-calendar";

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
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw new Error(userError.message);
  }

  const userId = user?.id;

  let calendarData: Array<{
    day: Date;
    events: { id: string; name: string; time: string; datetime: string }[];
  }> = [];

  if (userId) {
    const [{ data: assignmentsData, error: assignmentsError }, { data: coursesData, error: coursesError }] =
      await Promise.all([
        supabase
          .from("assignments")
          .select("id, title, due_at, priority, course_id")
          .eq("user_id", userId),
        supabase
          .from("courses")
          .select("id, name")
          .eq("user_id", userId),
      ]);

    if (assignmentsError) {
      throw new Error(assignmentsError.message);
    }

    if (coursesError) {
      throw new Error(coursesError.message);
    }

    // Fetching courses for completeness (course names can be used later without changing schema).
    const coursesById: Record<string, string> = {};
    for (const course of coursesData ?? []) {
      coursesById[course.id as string] = course.name as string;
    }
    void coursesById;

    function localDayKey(date: Date): string {
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const day = date.getDate().toString().padStart(2, "0");
      return `${year}-${month}-${day}`;
    }

    const groupedByDay = new Map<
      string,
      {
        day: Date;
        events: { id: string; name: string; time: string; datetime: string }[];
      }
    >();

    for (const row of assignmentsData ?? []) {
      const dueAt = new Date(row.due_at as string);
      const key = localDayKey(dueAt);

      const existing =
        groupedByDay.get(key) ?? {
          day: new Date(row.due_at as string),
          events: [],
        };

      existing.events.push({
        id: row.id as string,
        name: row.title as string,
        time: row.priority as string,
        datetime: row.due_at as string,
      });

      groupedByDay.set(key, existing);
    }

    calendarData = Array.from(groupedByDay.values()).sort(
      (a, b) => a.day.getTime() - b.day.getTime()
    );
  }

  return (
    <div className="h-full flex flex-col gap-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-sm font-medium text-neutral-100">
            Planner
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

      <section className="flex-1 min-h-0">
        <FullScreenCalendar data={calendarData} />
      </section>
    </div>
  );
}

