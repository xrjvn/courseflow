import { FileText, BarChart2, CalendarDays, GraduationCap } from "lucide-react";
import { BentoGrid, BentoCard } from "@/components/ui/bento-grid";

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
          <div className="pointer-events-none absolute inset-x-0 top-12 flex justify-center">
            <div className="h-80 w-80 rounded-full bg-[radial-gradient(circle_at_top,rgba(124,106,255,0.16),transparent_60%)] blur-3xl" />
          </div>
          <div className="pointer-events-none absolute inset-x-24 top-40 hidden justify-center sm:flex">
            <div className="h-64 w-64 rounded-full bg-[radial-gradient(circle_at_center,rgba(124,106,255,0.12),transparent_60%)] blur-3xl" />
          </div>
          <div className="relative mx-auto flex max-w-6xl flex-col items-start justify-center gap-8 px-4 py-12 sm:px-6 lg:px-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(124,106,255,0.35)] bg-[rgba(124,106,255,0.08)] px-3 py-1 text-[11px] font-medium text-[var(--text-secondary)] shadow-[0_0_24px_rgba(124,106,255,0.35)]">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
              Built for university students
            </div>

            <div className="space-y-4 max-w-2xl">
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
            {/* 3D mockup */}
            <div className="mt-10 hidden w-full max-w-xl transform-gpu perspective-[2000px] md:block">
              <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 shadow-[0_40px_120px_rgba(0,0,0,0.9)] [transform:rotateX(18deg)_rotateY(-18deg)]">
                <div className="mb-3 flex items-center justify-between text-[10px] text-[var(--text-secondary)]">
                  <span className="h-2 w-16 rounded-full bg-[rgba(255,255,255,0.06)]" />
                  <span className="h-2 w-8 rounded-full bg-[rgba(255,255,255,0.04)]" />
                </div>
                <div className="grid gap-2 sm:grid-cols-3">
                  <div className="rounded-lg border border-[var(--border-subtle)] bg-[rgba(255,255,255,0.02)] p-2">
                    <p className="text-[10px] text-[var(--text-muted)]">
                      Assignments this week
                    </p>
                    <p className="mt-2 text-xl font-medium text-[var(--text-primary)]">
                      7
                    </p>
                  </div>
                  <div className="rounded-lg border border-[var(--border-subtle)] bg-[rgba(255,255,255,0.02)] p-2">
                    <p className="text-[10px] text-[var(--text-muted)]">
                      Courses
                    </p>
                    <p className="mt-2 text-xl font-medium text-[var(--text-primary)]">
                      5
                    </p>
                  </div>
                  <div className="rounded-lg border border-[var(--border-subtle)] bg-[rgba(255,255,255,0.02)] p-2">
                    <p className="text-[10px] text-[var(--text-muted)]">
                      Planner coverage
                    </p>
                    <p className="mt-2 text-xl font-medium text-[var(--text-primary)]">
                      86%
                    </p>
                  </div>
                </div>
                <div className="mt-3 rounded-lg border border-dashed border-[var(--border-subtle)] bg-[rgba(255,255,255,0.01)] p-3">
                  <div className="mb-2 flex items-center justify-between text-[10px] text-[var(--text-secondary)]">
                    <span>Upcoming this week</span>
                    <span>View planner</span>
                  </div>
                  <div className="space-y-1.5 text-[10px] text-[var(--text-muted)]">
                    <div className="flex items-center justify-between">
                      <span>CS 201 · Problem Set 3</span>
                      <span>Tue</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Bio 110 · Lab report</span>
                      <span>Thu</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>History 240 · Midterm</span>
                      <span>Fri</span>
                    </div>
                  </div>
                </div>
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
            <BentoGrid className="auto-rows-[18rem] md:auto-rows-[22rem]">
              <BentoCard
                name="Upload your syllabus"
                description="Drop in any PDF. AI reads every due date, exam, and assignment in seconds. Your entire semester organized before your first class."
                Icon={FileText}
                href="/auth/signup"
                cta="Start with a syllabus"
                className="md:col-span-2 md:row-span-2"
                background={
                  <div className="absolute inset-0 overflow-hidden">
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(124,106,255,0.3),transparent_60%)]" />
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.24),transparent_60%)] mix-blend-screen" />
                  </div>
                }
              />
              <BentoCard
                name="Smart priority scoring"
                description="Every assignment weighted by how much it's worth. Know what actually matters before it's too late."
                Icon={BarChart2}
                href="/auth/signup"
                cta="See how it ranks work"
                className="md:col-span-1"
                background={<div />}
              />
              <BentoCard
                name="Weekly planner"
                description="All your courses, all your deadlines, one clean dashboard. See your entire week at a glance."
                Icon={CalendarDays}
                href="/auth/signup"
                cta="View the planner"
                className="md:col-span-1"
                background={<div />}
              />
              <BentoCard
                name="Works with any university"
                description="If your professor can email it, CourseFlow can read it. Any format, any school, any course."
                Icon={GraduationCap}
                href="/auth/signup"
                cta="Check compatibility"
                className="md:col-span-3 md:row-span-1"
                background={<div />}
              />
            </BentoGrid>
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
