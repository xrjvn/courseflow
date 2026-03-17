export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--bg-base)] text-[var(--text-primary)]">
      {/* NAVBAR */}
      <header className="sticky top-0 z-20 border-b border-[var(--border-subtle)] bg-[var(--bg-base)]/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[linear-gradient(135deg,#7c6aff,#a855f7)] text-sm font-semibold text-white">
              CF
            </div>
            <span className="text-sm font-medium text-[var(--text-primary)]">
              Courseflow
            </span>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/auth/signin"
              className="text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            >
              Sign in
            </a>
            <a
              href="/auth/signup"
              className="inline-flex items-center rounded-full bg-[linear-gradient(135deg,#7c6aff,#a855f7)] px-4 py-1.5 text-xs font-semibold text-white shadow-sm"
            >
              Get started free
            </a>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="flex-1 bg-[var(--bg-base)]">
        {/* HERO */}
        <section className="relative flex min-h-[calc(100vh-4rem)] items-center">
          <div className="pointer-events-none absolute inset-x-0 top-24 flex justify-center">
            <div className="h-72 w-72 rounded-full bg-[radial-gradient(circle_at_center,rgba(124,106,255,0.18),transparent_60%)] blur-3xl" />
          </div>
          <div className="relative mx-auto flex max-w-6xl flex-col items-start justify-center gap-8 px-4 py-12 sm:px-6 lg:px-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(124,106,255,0.35)] bg-[rgba(124,106,255,0.08)] px-3 py-1 text-[11px] font-medium text-[var(--text-secondary)] shadow-[0_0_24px_rgba(124,106,255,0.35)]">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
              Built for university students
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl font-semibold leading-tight tracking-[-0.04em] text-[var(--text-primary)] sm:text-5xl md:text-6xl lg:text-[64px]">
                Your syllabus.
                <br />
                Your semester.
                <br />
                <span className="bg-[linear-gradient(135deg,#7c6aff,#a855f7)] bg-clip-text text-transparent">
                  Instantly organized.
                </span>
              </h1>
              <p className="max-w-xl text-[15px] text-[var(--text-secondary)] sm:text-[17px]">
                Upload any syllabus PDF and Courseflow automatically tracks every
                assignment, exam, and deadline — across all your courses.
              </p>
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-3">
              <a
                href="/auth/signup"
                className="inline-flex items-center rounded-full bg-[linear-gradient(135deg,#7c6aff,#a855f7)] px-4 py-2 text-xs font-semibold text-white shadow-sm sm:text-sm"
              >
                Upload your syllabus free
              </a>
              <a
                href="/auth/signin"
                className="inline-flex items-center rounded-full border border-[var(--border-subtle)] bg-transparent px-4 py-2 text-xs font-medium text-[var(--text-secondary)] hover:bg-[rgba(255,255,255,0.04)] hover:text-[var(--text-primary)] sm:text-sm"
              >
                Sign in
              </a>
            </div>

            <div className="mt-3 flex flex-col gap-1 text-[11px] text-[var(--text-secondary)] sm:text-xs">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-[rgba(124,106,255,0.18)] text-[var(--accent)] text-[10px]">
                  ✓
                </span>
                <span>Entire semester organized in seconds</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-[rgba(124,106,255,0.18)] text-[var(--accent)] text-[10px]">
                  ✓
                </span>
                <span>Every due date, automatically prioritized</span>
              </div>
            </div>
          </div>
        </section>

        {/* SOCIAL PROOF */}
        <section className="border-y border-[var(--border-subtle)] bg-[var(--bg-surface)]">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-4 py-5 text-center sm:flex-row sm:text-left sm:px-6 lg:px-8">
            <div className="flex flex-col items-center sm:items-start">
              <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--text-muted)]">
                Upload a syllabus in
              </span>
              <span className="mt-1 text-sm font-medium text-[var(--text-primary)]">
                30 seconds
              </span>
            </div>
            <div className="flex flex-col items-center sm:items-start">
              <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--text-muted)]">
                Assignments tracked
              </span>
              <span className="mt-1 text-sm font-medium text-[var(--text-primary)]">
                automatically
              </span>
            </div>
            <div className="flex flex-col items-center sm:items-start">
              <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--text-muted)]">
                Works with
              </span>
              <span className="mt-1 text-sm font-medium text-[var(--text-primary)]">
                any university
              </span>
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section className="bg-[var(--bg-base)]">
          <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="mb-8 text-center text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--text-muted)]">
              Why Courseflow
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {/* Card 1 */}
              <div className="relative overflow-hidden rounded-[12px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 before:absolute before:inset-x-0 before:top-0 before:h-0.5 before:bg-[linear-gradient(90deg,#7c6aff,#a855f7)] before:content-['']">
                <div className="mb-4 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[rgba(124,106,255,0.15)] text-[var(--accent)]">
                  <span className="text-xs">⬆</span>
                </div>
                <h3 className="text-sm font-medium text-[var(--text-primary)]">
                  Upload your syllabus
                </h3>
                <p className="mt-2 text-[13px] leading-relaxed text-[var(--text-secondary)]">
                  Drop in a PDF. AI reads every due date, exam, and assignment in
                  seconds. No manual entry ever.
                </p>
              </div>

              {/* Card 2 */}
              <div className="relative overflow-hidden rounded-[12px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 before:absolute before:inset-x-0 before:top-0 before:h-0.5 before:bg-[linear-gradient(90deg,#7c6aff,#a855f7)] before:content-['']">
                <div className="mb-4 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[rgba(124,106,255,0.15)] text-[var(--accent)]">
                  <span className="text-xs">⚡</span>
                </div>
                <h3 className="text-sm font-medium text-[var(--text-primary)]">
                  Smart priority scoring
                </h3>
                <p className="mt-2 text-[13px] leading-relaxed text-[var(--text-secondary)]">
                  Every assignment is weighted by how much it&apos;s worth. Know
                  what actually matters before it&apos;s too late.
                </p>
              </div>

              {/* Card 3 */}
              <div className="relative overflow-hidden rounded-[12px] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 before:absolute before:inset-x-0 before:top-0 before:h-0.5 before:bg-[linear-gradient(90deg,#7c6aff,#a855f7)] before:content-['']">
                <div className="mb-4 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[rgba(124,106,255,0.15)] text-[var(--accent)]">
                  <span className="text-xs">▦</span>
                </div>
                <h3 className="text-sm font-medium text-[var(--text-primary)]">
                  One view for everything
                </h3>
                <p className="mt-2 text-[13px] leading-relaxed text-[var(--text-secondary)]">
                  All your courses, all your deadlines, one clean dashboard.
                  Weekly planner included.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-[var(--border-subtle)] bg-[var(--bg-base)]">
        <div className="mx-auto max-w-6xl px-4 py-6 text-center text-[11px] text-[var(--text-muted)]">
          Courseflow · Built for students · 2026
        </div>
      </footer>
    </div>
  );
}
