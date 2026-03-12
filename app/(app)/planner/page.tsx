export default function PlannerPage() {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-sm font-medium text-neutral-100">
            Weekly planner
          </h2>
          <p className="mt-1 text-xs text-neutral-500">
            A simple weekly view that will group assignments by due date.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-neutral-400">
          <button className="rounded-full border border-neutral-700 px-3 py-1.5 font-medium hover:border-neutral-500 hover:bg-neutral-900">
            Previous week
          </button>
          <button className="rounded-full border border-neutral-700 px-3 py-1.5 font-medium hover:border-neutral-500 hover:bg-neutral-900">
            Next week
          </button>
        </div>
      </header>

      <section className="overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900/60">
        <div className="grid grid-cols-7 border-b border-neutral-800 bg-neutral-900/80 text-xs font-medium text-neutral-300">
          {days.map((day) => (
            <div key={day} className="px-3 py-2 text-center">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 divide-x divide-neutral-800 text-xs">
          {days.map((day) => (
            <div
              key={day}
              className="min-h-[160px] border-t border-neutral-800 bg-neutral-950/40 p-3 align-top"
            >
              <p className="mb-2 text-[11px] font-medium uppercase tracking-wide text-neutral-500">
                {day}
              </p>
              <div className="rounded-lg border border-dashed border-neutral-800 bg-neutral-900/40 p-3 text-[11px] text-neutral-500">
                Assignments due on this day will appear here once we connect the
                data.
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

