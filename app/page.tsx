export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-950 px-4">
      <main className="mx-auto flex w-full max-w-4xl flex-col gap-10 rounded-3xl border border-neutral-800 bg-neutral-950/80 px-6 py-10 text-neutral-50 shadow-[0_18px_60px_rgba(0,0,0,0.65)] sm:px-10 sm:py-12 lg:flex-row lg:items-center">
        <section className="flex-1 space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-neutral-800 bg-neutral-900/80 px-3 py-1 text-xs text-neutral-400">
            <span className="inline-flex h-1.5 w-1.5 rounded-full bg-sky-400" />
            Built for university students
          </div>
          <div className="space-y-3">
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Stay ahead of every{" "}
              <span className="bg-gradient-to-r from-sky-400 to-sky-300 bg-clip-text text-transparent">
                course, assignment, and week
              </span>
              .
            </h1>
            <p className="text-sm text-neutral-400 sm:text-base">
              Courseflow is a focused productivity workspace for university
              students. Track your courses, assignments, and weekly workload in
              a single, simple dashboard.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <a
              href="/auth/signup"
              className="inline-flex items-center rounded-full bg-sky-500 px-4 py-2 text-sm font-semibold text-neutral-950 shadow-sm hover:bg-sky-400"
            >
              Get started free
            </a>
            <a
              href="/auth/signin"
              className="inline-flex items-center rounded-full border border-neutral-700 px-4 py-2 text-sm font-medium text-neutral-200 hover:border-neutral-500 hover:bg-neutral-900"
            >
              Sign in
            </a>
          </div>
          <div className="flex flex-wrap gap-4 text-xs text-neutral-500">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-neutral-900 text-[10px]">
                ✓
              </span>
              No cluttered calendars
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-neutral-900 text-[10px]">
                ✓
              </span>
              Designed for fast weekly planning
            </div>
          </div>
        </section>

        <section className="flex-1">
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-4">
            <div className="mb-3 flex items-center justify-between text-xs text-neutral-400">
              <span>Dashboard preview</span>
              <span className="rounded-full bg-neutral-800 px-2 py-0.5 text-[10px] uppercase tracking-wide">
                MVP
              </span>
            </div>
            <div className="space-y-3 rounded-xl border border-neutral-800 bg-neutral-950/60 p-3">
              <div className="grid gap-2 sm:grid-cols-3">
                <div className="rounded-lg border border-neutral-800 bg-neutral-900/80 p-2">
                  <p className="text-[10px] text-neutral-500">
                    Assignments this week
                  </p>
                  <p className="mt-1 text-lg font-semibold tracking-tight">
                    0
                  </p>
                </div>
                <div className="rounded-lg border border-neutral-800 bg-neutral-900/80 p-2">
                  <p className="text-[10px] text-neutral-500">Courses</p>
                  <p className="mt-1 text-lg font-semibold tracking-tight">
                    0
                  </p>
                </div>
                <div className="rounded-lg border border-neutral-800 bg-neutral-900/80 p-2">
                  <p className="text-[10px] text-neutral-500">
                    Planner coverage
                  </p>
                  <p className="mt-1 text-lg font-semibold tracking-tight">
                    0%
                  </p>
                </div>
              </div>
              <div className="rounded-lg border border-dashed border-neutral-800 bg-neutral-900/60 p-3 text-[11px] text-neutral-500">
                Once you&apos;re signed in, your dashboard, courses, assignments
                and weekly planner live in a clean, focused workspace.
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
