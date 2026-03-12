export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-4">
          <p className="text-xs font-medium text-neutral-400">
            Assignments this week
          </p>
          <p className="mt-2 text-2xl font-semibold tracking-tight text-neutral-50">
            0
          </p>
          <p className="mt-1 text-xs text-neutral-500">
            You&apos;ll see your weekly workload here.
          </p>
        </div>
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-4">
          <p className="text-xs font-medium text-neutral-400">Courses</p>
          <p className="mt-2 text-2xl font-semibold tracking-tight text-neutral-50">
            0
          </p>
          <p className="mt-1 text-xs text-neutral-500">
            Add your courses to get started.
          </p>
        </div>
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-4">
          <p className="text-xs font-medium text-neutral-400">
            Planner coverage
          </p>
          <p className="mt-2 text-2xl font-semibold tracking-tight text-neutral-50">
            0%
          </p>
          <p className="mt-1 text-xs text-neutral-500">
            Plan your week to stay ahead.
          </p>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-4 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-neutral-100">
              Upcoming assignments
            </h2>
            <span className="text-xs text-neutral-500">Nothing due yet</span>
          </div>
          <div className="mt-4 rounded-lg border border-dashed border-neutral-800 bg-neutral-900/40 p-6 text-sm text-neutral-400">
            As you add assignments, the next 7 days of work will show up here.
          </div>
        </div>
        <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-4">
          <h2 className="text-sm font-medium text-neutral-100">
            This week at a glance
          </h2>
          <p className="mt-3 text-sm text-neutral-400">
            A simple weekly snapshot will appear here, so you can see your
            academic load at a glance.
          </p>
        </div>
      </section>
    </div>
  );
}

