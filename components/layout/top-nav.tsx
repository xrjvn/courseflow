"use client";

import Link from "next/link";

type TopNavProps = {
  title: string;
};

export default function TopNav({ title }: TopNavProps) {
  return (
    <header className="sticky top-0 z-10 border-b border-neutral-800 bg-neutral-950/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex flex-col">
          <span className="text-xs font-medium uppercase tracking-[0.2em] text-neutral-500">
            Overview
          </span>
          <h1 className="text-lg font-semibold tracking-tight text-neutral-50 sm:text-xl">
            {title}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/assignments"
            className="hidden rounded-full border border-neutral-700 px-3 py-1.5 text-xs font-medium text-neutral-200 hover:border-neutral-500 hover:bg-neutral-900 sm:inline-flex"
          >
            View assignments
          </Link>
          <button className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-sky-400 text-xs font-semibold text-neutral-950 shadow-sm">
            AS
          </button>
        </div>
      </div>
    </header>
  );
}

