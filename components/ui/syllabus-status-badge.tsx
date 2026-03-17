import type { SyllabusStatus } from "@/lib/types";

type SyllabusStatusBadgeProps = {
  status: SyllabusStatus | "none";
};

export function SyllabusStatusBadge({ status }: SyllabusStatusBadgeProps) {
  const base =
    "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide";

  if (status === "none") {
    return (
      <span className={`${base} border border-neutral-700 bg-neutral-900 text-neutral-300`}>
        No syllabus
      </span>
    );
  }

  if (status === "pending") {
    return (
      <span className={`${base} bg-sky-900/50 text-sky-300`}>
        Pending
      </span>
    );
  }

  if (status === "parsed") {
    return (
      <span className={`${base} bg-emerald-900/50 text-emerald-300`}>
        Parsed
      </span>
    );
  }

  return (
    <span className={`${base} bg-red-900/60 text-red-300`}>
      Failed
    </span>
  );
}

