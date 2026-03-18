"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FileText, Zap, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatedGroup } from "@/components/ui/animated-group";

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-[var(--bg-base)] text-[var(--text-primary)]">
      {/* NAVBAR */}
      <header
        className={`sticky top-0 z-30 border-b border-[var(--border-subtle)] transition-colors ${
          scrolled ? "bg-[var(--bg-base)]/90 backdrop-blur" : "bg-[var(--bg-base)]"
        }`}
      >
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2">
            <div
              style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-xs font-semibold text-white"
            >
              CF
            </div>
            <span className="text-sm font-medium text-[var(--text-primary)]">
              Courseflow
            </span>
          </Link>

          <div className="hidden items-center gap-3 sm:flex">
            <Button variant="outline" asChild size="sm">
              <Link href="/auth/signin">Sign in</Link>
            </Button>
            <Button
              asChild
              size="sm"
              className="border-0 text-xs font-medium text-white"
              style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}
            >
              <Link href="/auth/signup">Get started free</Link>
            </Button>
          </div>

          <button
            className="inline-flex items-center justify-center rounded-md p-2 text-[var(--text-secondary)] hover:bg-white/5 sm:hidden"
            aria-label="Toggle navigation"
            onClick={() => setIsMenuOpen((prev) => !prev)}
          >
            <span className="sr-only">Open menu</span>
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            >
              {isMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <>
                  <path d="M4 7h16" />
                  <path d="M4 12h16" />
                  <path d="M4 17h16" />
                </>
              )}
            </svg>
          </button>
        </div>

        {isMenuOpen && (
          <div className="border-t border-[var(--border-subtle)] bg-[var(--bg-base)] px-4 pb-4 pt-2 sm:hidden">
            <div className="flex flex-col gap-2">
              <Button variant="outline" asChild size="sm" className="justify-center">
                <Link href="/auth/signin">Sign in</Link>
              </Button>
              <Button
                asChild
                size="sm"
                className="justify-center border-0 text-xs font-medium text-white"
                style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}
              >
                <Link href="/auth/signup">Get started free</Link>
              </Button>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1 bg-[var(--bg-base)]">
        {/* HERO SECTION 2 */}
        <section className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 flex justify-center">
            <div className="h-[520px] w-[520px] translate-y-[-10%] rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.08)_0%,transparent_70%)] blur-3xl" />
          </div>
          <div className="relative mx-auto flex max-w-5xl flex-col gap-12 px-4 pb-16 pt-16 md:flex-row md:items-center md:pb-20 md:pt-20">
            <AnimatedGroup preset="slide" className="flex-1 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(99,102,241,0.4)] bg-[rgba(99,102,241,0.08)] px-3 py-1 text-[11px] font-medium text-[var(--text-secondary)]">
                ✦ Built for university students
              </div>
              <div className="space-y-4">
                <h1 className="text-3xl font-semibold leading-[1.05] tracking-[-0.05em] text-[var(--text-primary)] sm:text-4xl md:text-5xl lg:text-[52px]">
                  Your syllabus.
                  <br />
                  Your semester.
                  <br />
                  <span
                    style={{
                      background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                      display: "inline-block",
                    }}
                  >
                    Instantly organized.
                  </span>
                </h1>
                <p className="max-w-md text-[15px] leading-relaxed text-[var(--text-secondary)] sm:text-[16px]">
                  Upload any syllabus PDF and Courseflow automatically tracks
                  every assignment, exam, and deadline — across all your
                  courses.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Button
                  asChild
                  className="rounded-full px-5 py-2.5 text-sm font-medium text-white"
                  style={{
                    background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                  }}
                >
                  <Link href="/auth/signup">Upload your syllabus free</Link>
                </Button>
                <Button variant="ghost" asChild className="rounded-full px-5 py-2.5 text-sm">
                  <Link href="/auth/signin">Sign in</Link>
                </Button>
              </div>
              <div className="space-y-0.5 text-xs text-[var(--text-muted)]">
                <p>✓ Entire semester organized in seconds</p>
                <p>✓ Every due date, automatically prioritized</p>
              </div>
            </AnimatedGroup>

            <AnimatedGroup
              preset="blur-slide"
              className="flex-1"
              variants={{
                container: {
                  hidden: { opacity: 0, y: 20 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { staggerChildren: 0.08 },
                  },
                },
              }}
            >
              <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-[0_40px_80px_rgba(0,0,0,0.6)]">
                <div className="flex h-8 items-center gap-1.5 border-b border-[var(--border-subtle)] bg-[var(--bg-base)] px-3">
                  <span className="h-2 w-2 rounded-full bg-[#ef4444]" />
                  <span className="h-2 w-2 rounded-full bg-[#f59e0b]" />
                  <span className="h-2 w-2 rounded-full bg-[#22c55e]" />
                </div>
                <div className="flex bg-[var(--bg-base)]">
                  <div className="flex w-32 flex-col gap-0.5 border-r border-[var(--border-subtle)] bg-[var(--bg-base)] p-2">
                    <div className="flex h-6 items-center gap-1.5 rounded bg-[rgba(99,102,241,0.15)] px-2 text-[10px] font-medium text-[#6366f1]">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#6366f1]" />
                      Dashboard
                    </div>
                    <div className="flex h-6 items-center gap-1.5 rounded px-2 text-[10px] text-[var(--text-muted)]">
                      <span className="h-1.5 w-1.5 rounded-full bg-[rgba(255,255,255,0.08)]" />
                      Courses
                    </div>
                    <div className="flex h-6 items-center gap-1.5 rounded px-2 text-[10px] text-[var(--text-muted)]">
                      <span className="h-1.5 w-1.5 rounded-full bg-[rgba(255,255,255,0.08)]" />
                      Assignments
                    </div>
                    <div className="flex h-6 items-center gap-1.5 rounded px-2 text-[10px] text-[var(--text-muted)]">
                      <span className="h-1.5 w-1.5 rounded-full bg-[rgba(255,255,255,0.08)]" />
                      Planner
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col gap-2 bg-[var(--bg-base)] p-3">
                    <div className="grid grid-cols-4 gap-1.5">
                      {[
                        { label: "Courses", value: "3" },
                        { label: "Assignments", value: "17" },
                        { label: "Due this week", value: "3" },
                        { label: "Done", value: "1" },
                      ].map((stat) => (
                        <div
                          key={stat.label}
                          className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-2"
                        >
                          <p className="text-sm font-medium text-[rgba(255,255,255,0.85)]">
                            {stat.value}
                          </p>
                          <p className="text-[9px] text-[rgba(255,255,255,0.3)]">
                            {stat.label}
                          </p>
                        </div>
                      ))}
                    </div>
                    <div className="rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-2">
                      <p className="mb-1.5 text-[9px] font-medium uppercase tracking-[0.18em] text-[rgba(255,255,255,0.25)]">
                        Upcoming
                      </p>
                      <div className="space-y-1">
                        {[
                          {
                            name: "Topic Quiz 6",
                            date: "Mar 19",
                            color: "#f59e0b",
                            priority: "medium",
                            priorityColor: "#f59e0b",
                          },
                          {
                            name: "Lab 7",
                            date: "Mar 21",
                            color: "#f59e0b",
                            priority: "medium",
                            priorityColor: "#f59e0b",
                          },
                          {
                            name: "Assignment 5",
                            date: "Mar 28",
                            color: "#8b5cf6",
                            priority: "low",
                            priorityColor: "#22c55e",
                          },
                        ].map((item, idx) => (
                          <div
                            key={item.name}
                            className={`flex items-center gap-2 py-1 ${
                              idx < 2 ? "border-b border-[rgba(255,255,255,0.04)]" : ""
                            }`}
                          >
                            <span
                              className="h-1.5 w-1.5 rounded-full"
                              style={{ backgroundColor: item.color }}
                            />
                            <span className="flex-1 text-[10px] text-[rgba(255,255,255,0.7)]">
                              {item.name}
                            </span>
                            <span className="text-[9px] font-mono text-[rgba(255,255,255,0.25)]">
                              {item.date}
                            </span>
                            <span
                              className="rounded-full px-2 py-0.5 text-[9px] font-medium"
                              style={{
                                backgroundColor: `${item.priorityColor}1f`,
                                color: item.priorityColor,
                              }}
                            >
                              {item.priority}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedGroup>
          </div>
        </section>

        {/* STATS BAR */}
        <section className="border-y border-[var(--border-subtle)] bg-[var(--bg-surface)]">
          <div className="mx-auto flex max-w-5xl divide-x divide-[var(--border-subtle)] px-6">
            <div className="flex flex-1 flex-col items-center py-6 text-center">
              <span className="text-[10px] font-medium uppercase tracking-[0.25em] text-[var(--text-muted)]">
                Upload a syllabus in
              </span>
              <span className="mt-2 text-sm font-medium text-[var(--text-primary)]">
                30 seconds
              </span>
            </div>
            <div className="flex flex-1 flex-col items-center py-6 text-center">
              <span className="text-[10px] font-medium uppercase tracking-[0.25em] text-[var(--text-muted)]">
                Assignments tracked
              </span>
              <span className="mt-2 text-sm font-medium text-[var(--text-primary)]">
                Automatically
              </span>
            </div>
            <div className="flex flex-1 flex-col items-center py-6 text-center">
              <span className="text-[10px] font-medium uppercase tracking-[0.25em] text-[var(--text-muted)]">
                Works with
              </span>
              <span className="mt-2 text-sm font-medium text-[var(--text-primary)]">
                Any university
              </span>
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section className="bg-[var(--bg-base)] py-20">
          <div className="mx-auto max-w-5xl px-6">
            <div className="mb-12 text-center text-[10px] font-medium uppercase tracking-[0.25em] text-[var(--text-muted)]">
              Why Courseflow
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="relative overflow-hidden rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6">
                <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-[#7c6aff] to-transparent" />
                <div className="mb-4 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-[rgba(124,106,255,0.1)]">
                  <FileText size={18} strokeWidth={1.5} color="#7c6aff" />
                </div>
                <h3 className="mb-2 text-[14px] font-medium text-[var(--text-primary)]">
                  Upload your syllabus
                </h3>
                <p className="text-[13px] leading-relaxed text-[var(--text-secondary)]">
                  Drop in a PDF. AI reads every due date, exam, and assignment
                  instantly. No manual entry ever.
                </p>
              </div>
              <div className="relative overflow-hidden rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6">
                <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-[#7c6aff] to-transparent" />
                <div className="mb-4 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-[rgba(124,106,255,0.1)]">
                  <Zap size={18} strokeWidth={1.5} color="#7c6aff" />
                </div>
                <h3 className="mb-2 text-[14px] font-medium text-[var(--text-primary)]">
                  Smart priority scoring
                </h3>
                <p className="text-[13px] leading-relaxed text-[var(--text-secondary)]">
                  Every assignment weighted by how much it&apos;s worth. Know
                  what actually matters before it&apos;s too late.
                </p>
              </div>
              <div className="relative overflow-hidden rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6">
                <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-[#7c6aff] to-transparent" />
                <div className="mb-4 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-[rgba(124,106,255,0.1)]">
                  <CalendarDays size={18} strokeWidth={1.5} color="#7c6aff" />
                </div>
                <h3 className="mb-2 text-[14px] font-medium text-[var(--text-primary)]">
                  One view for everything
                </h3>
                <p className="text-[13px] leading-relaxed text-[var(--text-secondary)]">
                  All your courses, all deadlines, one clean dashboard. Weekly
                  planner included.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-[var(--border-subtle)] bg-[var(--bg-base)]">
        <div className="mx-auto max-w-5xl px-6 py-8 text-center text-[12px] text-[var(--text-muted)]">
          Courseflow · Built for students · 2026
        </div>
      </footer>
    </div>
  );
}
