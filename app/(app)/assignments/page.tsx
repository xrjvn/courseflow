export default function AssignmentsPage() {
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
          <button className="inline-flex items-center rounded-full bg-sky-500 px-3 py-1.5 text-xs font-semibold text-neutral-950 shadow-sm hover:bg-sky-400">
            Add assignment
          </button>
        </div>
      </header>

      <section className="rounded-xl border border-dashed border-neutral-800 bg-neutral-900/40 p-6 text-sm text-neutral-400">
        This table will show all of your assignments across courses, with
        filters for status, course, and due date. For now, it&apos;s a styled
        placeholder while we implement the data layer.
      </section>
    </div>
  );
}

