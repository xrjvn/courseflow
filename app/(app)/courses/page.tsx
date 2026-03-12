export default function CoursesPage() {
  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-medium text-neutral-100">Courses</h2>
          <p className="mt-1 text-xs text-neutral-500">
            Track the classes that drive your workload.
          </p>
        </div>
        <button className="inline-flex items-center rounded-full bg-sky-500 px-3 py-1.5 text-xs font-semibold text-neutral-950 shadow-sm hover:bg-sky-400">
          Add course
        </button>
      </header>

      <section className="rounded-xl border border-dashed border-neutral-800 bg-neutral-900/40 p-6 text-sm text-neutral-400">
        You don&apos;t have any courses yet. For the MVP, this page is a stub –
        we&apos;ll wire it up to Supabase and real forms next.
      </section>
    </div>
  );
}

