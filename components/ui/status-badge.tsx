import type { AssignmentStatus } from "@/lib/types";

type StatusBadgeProps = {
  status: AssignmentStatus;
  className?: string;
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const base =
    "inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium " +
    (className ?? "");

  const variant =
    status === "completed"
      ? "bg-emerald-900/50 text-emerald-300"
      : status === "in_progress"
        ? "bg-sky-900/50 text-sky-300"
        : "bg-[rgba(255,255,255,0.06)] text-text-secondary";

  return (
    <span className={`${base} ${variant}`}>
      {status.replace("_", " ")}
    </span>
  );
}

