export type AssignmentStatus = "not_started" | "in_progress" | "completed";

export type AssignmentPriority = "low" | "medium" | "high";

export type SyllabusStatus = "pending" | "parsed" | "failed";

export type SyllabusSuggestionType =
  | "assignment"
  | "exam"
  | "quiz"
  | "project"
  | "reading"
  | "other";

export type SyllabusSuggestion = {
  /** Stable identifier within the parsed_suggestions array (local UUID or index-based ID). */
  id: string;
  /** Short human-readable title, e.g. "Midterm Exam" or "Homework 3". */
  title: string;
  /** High-level type of work extracted from the syllabus. */
  type: SyllabusSuggestionType;
  /** Optional longer description or notes from the syllabus text. */
  description?: string;
  /**
   * Raw date text as it appeared in the syllabus, e.g. "Oct 18", "Week 3".
   * Always stored, even if suggestedDueAt is null.
   */
  rawDateText?: string;
  /**
   * Parsed ISO timestamp (UTC) if the model could confidently extract a due date.
   * Null when the date is ambiguous or missing.
   */
  suggestedDueAt?: string | null;
  /** Optional additional context, e.g. chapter, week, or grading notes. */
  notes?: string;
};


