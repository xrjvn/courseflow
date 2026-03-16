import type { AssignmentPriority } from "@/lib/types";

type PriorityBadgeProps = {
  priority: AssignmentPriority;
  className?: string;
};

export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
  const base =
    "inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium " +
    (className ?? "");

  const variant =
    priority === "high"
      ? "bg-red-900/60 text-red-300"
      : priority === "medium"
        ? "bg-amber-900/60 text-amber-300"
        : "bg-neutral-800 text-neutral-200";

  return <span className={`${base} ${variant}`}>{priority}</span>;
}

