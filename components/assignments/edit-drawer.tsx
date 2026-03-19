"use client";

import { useState } from "react";
import {
  updateAssignmentAction,
  deleteAssignmentAction,
} from "@/app/(app)/assignments/actions";
import { formatDateShort, toInputDateTimeLocal } from "@/lib/date";
import type { AssignmentPriority, AssignmentStatus } from "@/lib/types";
import { StatusBadge } from "@/components/ui/status-badge";
import { PriorityBadge } from "@/components/ui/priority-badge";

export type AssignmentForDrawer = {
  id: string;
  course_id: string;
  title: string;
  description: string | null;
  due_at: string;
  status: AssignmentStatus;
  priority: AssignmentPriority;
};

export type CourseOption = {
  id: string;
  name: string;
  code: string | null;
  color: string | null;
};

type EditDrawerProps = {
  assignment: AssignmentForDrawer | null;
  courses: CourseOption[];
  isOpen: boolean;
  onClose: () => void;
};

export function EditDrawer({
  assignment,
  courses,
  isOpen,
  onClose,
}: EditDrawerProps) {
  if (!assignment) return null;

  return (
    <div className={`fixed inset-0 z-40 ${isOpen ? "" : "hidden"}`}>
      <button
        type="button"
        aria-label="Close edit drawer"
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />
      <aside className="fixed right-0 top-0 bottom-0 z-50 w-[400px] bg-[var(--bg-surface)] border-l border-[var(--border-subtle)] shadow-[-8px_0_32px_rgba(0,0,0,0.4)] p-6 transform transition-transform duration-200 translate-x-0">
        <div className="flex items-center justify-between">
          <h3 className="text-[14px] font-medium text-[var(--text-primary)]">
            Edit assignment
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer text-xl text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            aria-label="Close drawer"
          >
            ×
          </button>
        </div>

        <form
          className="mt-6"
          action={updateAssignmentAction}
          onSubmit={() => {
            setTimeout(() => onClose(), 150);
          }}
        >
          <input type="hidden" name="id" value={assignment.id} />

          <div className="mb-4">
            <label
              htmlFor={`title-${assignment.id}`}
              className="mb-1.5 block text-xs font-medium text-[var(--text-secondary)]"
            >
              Title
            </label>
            <input
              id={`title-${assignment.id}`}
              name="title"
              type="text"
              defaultValue={assignment.title}
              required
              className="w-full rounded-lg border border-[var(--border-default)] bg-[var(--bg-elevated)] px-3 py-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[#6366f1] focus:ring-1 focus:ring-[rgba(99,102,241,0.3)] transition duration-150"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor={`description-${assignment.id}`}
              className="mb-1.5 block text-xs font-medium text-[var(--text-secondary)]"
            >
              Description
            </label>
            <textarea
              id={`description-${assignment.id}`}
              name="description"
              rows={3}
              defaultValue={assignment.description ?? ""}
              className="w-full rounded-lg border border-[var(--border-default)] bg-[var(--bg-elevated)] px-3 py-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[#6366f1] focus:ring-1 focus:ring-[rgba(99,102,241,0.3)] transition duration-150"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor={`course_id-${assignment.id}`}
              className="mb-1.5 block text-xs font-medium text-[var(--text-secondary)]"
            >
              Course
            </label>
            <select
              id={`course_id-${assignment.id}`}
              name="course_id"
              defaultValue={assignment.course_id}
              required
              className="w-full rounded-lg border border-[var(--border-default)] bg-[var(--bg-elevated)] px-3 py-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[#6366f1] focus:ring-1 focus:ring-[rgba(99,102,241,0.3)] transition duration-150"
            >
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.name}
                  {course.code ? ` · ${course.code}` : ""}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label
              htmlFor={`due_at-${assignment.id}`}
              className="mb-1.5 block text-xs font-medium text-[var(--text-secondary)]"
            >
              Due date
            </label>
            <input
              id={`due_at-${assignment.id}`}
              name="due_at"
              type="datetime-local"
              required
              defaultValue={toInputDateTimeLocal(assignment.due_at)}
              className="w-full rounded-lg border border-[var(--border-default)] bg-[var(--bg-elevated)] px-3 py-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[#6366f1] focus:ring-1 focus:ring-[rgba(99,102,241,0.3)] transition duration-150"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor={`status-${assignment.id}`}
              className="mb-1.5 block text-xs font-medium text-[var(--text-secondary)]"
            >
              Status
            </label>
            <select
              id={`status-${assignment.id}`}
              name="status"
              defaultValue={assignment.status}
              required
              className="w-full rounded-lg border border-[var(--border-default)] bg-[var(--bg-elevated)] px-3 py-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[#6366f1] focus:ring-1 focus:ring-[rgba(99,102,241,0.3)] transition duration-150"
            >
              <option value="not_started">Not started</option>
              <option value="in_progress">In progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className="mb-4">
            <label
              htmlFor={`priority-${assignment.id}`}
              className="mb-1.5 block text-xs font-medium text-[var(--text-secondary)]"
            >
              Priority
            </label>
            <select
              id={`priority-${assignment.id}`}
              name="priority"
              defaultValue={assignment.priority}
              required
              className="w-full rounded-lg border border-[var(--border-default)] bg-[var(--bg-elevated)] px-3 py-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[#6366f1] focus:ring-1 focus:ring-[rgba(99,102,241,0.3)] transition duration-150"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div className="mt-4 border-t border-[var(--border-subtle)] pt-4">
            <button
              type="submit"
              className="w-full rounded-lg py-2.5 text-sm font-medium text-white"
              style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}
            >
              Save changes
            </button>
          </div>
        </form>
      </aside>
    </div>
  );
}

function getDueToneClass(dueAtIso: string): string {
  const due = new Date(dueAtIso);
  const now = new Date();

  if (Number.isNaN(due.getTime())) return "text-[var(--text-secondary)]";
  if (due.getTime() < now.getTime()) return "text-[#f87171]";

  const in7Days = now.getTime() + 7 * 24 * 60 * 60 * 1000;
  if (due.getTime() <= in7Days) return "text-[#fbbf24]";

  return "text-[var(--text-secondary)]";
}

type AssignmentsClientProps = {
  assignments: AssignmentForDrawer[];
  courses: CourseOption[];
};

export function AssignmentsClient({ assignments, courses }: AssignmentsClientProps) {
  const [editingAssignment, setEditingAssignment] =
    useState<AssignmentForDrawer | null>(null);

  if (assignments.length === 0) {
    return (
      <section className="rounded-xl border border-dashed border-neutral-800 bg-neutral-900/40 p-6 text-sm text-neutral-400">
        You don&apos;t have any assignments yet. Add your first assignment to
        start planning your workload.
      </section>
    );
  }

  return (
    <>
      <section className="overflow-hidden rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)]">
        <div className="hidden bg-[var(--bg-base)] border-b border-[var(--border-subtle)] px-4 py-3 text-[11px] font-medium uppercase tracking-widest text-[var(--text-muted)] sm:grid sm:grid-cols-[minmax(0,2fr)_minmax(0,1.2fr)_minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,0.8fr)_auto] sm:gap-3">
          <span className="text-left">Title</span>
          <span className="text-left">Course</span>
          <span className="text-left">Due</span>
          <span className="text-left">Status</span>
          <span className="text-left">Priority</span>
          <span className="text-right">Actions</span>
        </div>
        <div>
          {assignments.map((assignment) => {
            const course = courses.find((c) => c.id === assignment.course_id);
            const dueTone = getDueToneClass(assignment.due_at);

            return (
              <article
                key={assignment.id}
                className="group border-b border-[rgba(255,255,255,0.04)] last:border-b-0 px-4 py-3 text-xs transition duration-150 hover:bg-[rgba(255,255,255,0.02)] sm:grid sm:grid-cols-[minmax(0,2fr)_minmax(0,1.2fr)_minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,0.8fr)_auto] sm:gap-3"
              >
                <div className="space-y-1">
                  <p className="text-sm font-medium text-[var(--text-primary)]">
                    {assignment.title}
                  </p>
                  {assignment.description ? (
                    <p className="truncate whitespace-nowrap text-xs text-[var(--text-muted)] mt-0.5">
                      {assignment.description}
                    </p>
                  ) : null}
                  <div className="mt-1 flex items-center gap-2 sm:hidden">
                    <span className="inline-block rounded-md bg-[var(--bg-elevated)] px-2 py-0.5 text-xs text-[var(--text-secondary)]">
                      {course ? course.name : "No course"}{" "}
                      {course?.code ? `· ${course.code}` : ""}
                    </span>
                    <span className={`font-mono text-sm ${dueTone}`}>
                      {formatDateShort(assignment.due_at)}
                    </span>
                  </div>
                </div>
                <div className="hidden items-center sm:flex">
                  {course ? (
                    <span className="inline-block rounded-md bg-[var(--bg-elevated)] px-2 py-0.5 text-xs text-[var(--text-secondary)]">
                      {course.name}
                      {course.code ? ` · ${course.code}` : ""}
                    </span>
                  ) : (
                    <span className="inline-block rounded-md bg-[var(--bg-elevated)] px-2 py-0.5 text-xs text-[var(--text-secondary)]">
                      No course
                    </span>
                  )}
                </div>
                <div className="hidden items-center sm:flex">
                  <span className={`font-mono text-sm ${dueTone}`}>
                    {formatDateShort(assignment.due_at)}
                  </span>
                </div>
                <div className="mt-2 flex items-center sm:mt-0 sm:flex">
                  <StatusBadge
                    status={assignment.status}
                    className={
                      assignment.status === "not_started"
                        ? "!bg-[rgba(255,255,255,0.06)] !text-[var(--text-muted)] !px-2.5 !text-xs"
                        : assignment.status === "in_progress"
                          ? "!bg-[rgba(99,102,241,0.12)] !text-[#818cf8] !px-2.5 !text-xs"
                          : "!bg-[rgba(16,185,129,0.12)] !text-[#34d399] !px-2.5 !text-xs"
                    }
                  />
                </div>
                <div className="mt-2 flex items-center sm:mt-0 sm:flex">
                  <PriorityBadge
                    priority={assignment.priority}
                    className={
                      assignment.priority === "high"
                        ? "!bg-[rgba(239,68,68,0.12)] !text-[#f87171] !border-0 !px-2.5 !text-xs"
                        : assignment.priority === "medium"
                          ? "!bg-[rgba(245,158,11,0.12)] !text-[#fbbf24] !border-0 !px-2.5 !text-xs"
                          : "!bg-[rgba(16,185,129,0.12)] !text-[#34d399] !border-0 !px-2.5 !text-xs"
                    }
                  />
                </div>
                <div className="mt-2 flex items-center justify-end gap-1 opacity-100 transition-opacity duration-150 sm:mt-0 sm:opacity-0 group-hover:opacity-100">
                  <button
                    type="button"
                    onClick={() => setEditingAssignment(assignment)}
                    className="inline-flex cursor-pointer items-center rounded-lg px-2 py-1 text-xs font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                  >
                    Edit
                  </button>
                  <form action={deleteAssignmentAction} className="shrink-0">
                    <input type="hidden" name="id" value={assignment.id} />
                    <button
                      type="submit"
                      className="inline-flex items-center rounded-lg px-2 py-1 text-xs font-medium text-[rgba(239,68,68,0.5)] hover:text-[#f87171]"
                    >
                      Delete
                    </button>
                  </form>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <EditDrawer
        assignment={editingAssignment}
        courses={courses}
        isOpen={editingAssignment !== null}
        onClose={() => setEditingAssignment(null)}
      />
    </>
  );
}

