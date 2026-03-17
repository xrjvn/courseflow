"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = {
  label: string;
  href: string;
};

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Courses", href: "/courses" },
  { label: "Assignments", href: "/assignments" },
  { label: "Planner", href: "/planner" },
];

function isActive(pathname: string, href: string) {
  if (href === "/dashboard") {
    return pathname === "/dashboard";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 border-r border-border-subtle bg-bg-base px-4 py-4 md:flex md:flex-col">
      <div className="mb-6 flex items-center gap-2 px-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[linear-gradient(135deg,#7c6aff,#a855f7)] text-sm font-semibold text-white">
          CF
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold tracking-tight text-text-primary">
            Courseflow
          </span>
          <span className="text-xs text-text-secondary">
            Student productivity
          </span>
        </div>
      </div>
      <div className="px-2 pb-2 text-[9px] font-medium uppercase tracking-widest text-text-muted">
        Workspace
      </div>
      <nav className="space-y-1">
        {navItems.map((item) => {
          const active = isActive(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={[
                "group relative flex items-center justify-between rounded-md px-2 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-[rgba(124,106,255,0.12)] text-text-primary"
                  : "text-text-muted hover:bg-[rgba(255,255,255,0.04)] hover:text-text-secondary",
              ].join(" ")}
            >
              {active ? (
                <span className="absolute left-0 top-1 bottom-1 w-[3px] rounded-r-sm bg-[linear-gradient(180deg,#7c6aff,#a855f7)]" />
              ) : null}
              <span className="pl-2">{item.label}</span>
              <span className="hidden rounded-full bg-[rgba(124,106,255,0.15)] px-2 py-0.5 text-[10px] font-medium text-[#a78bfa]">
                0
              </span>
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto border-t border-border-subtle pt-4">
        <div className="flex items-center gap-3 px-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[linear-gradient(135deg,#7c6aff,#a855f7)] text-xs font-semibold text-white">
            AS
          </div>
          <div className="min-w-0">
            <p className="truncate text-xs font-medium text-text-secondary">
              Student
            </p>
            <p className="truncate text-[11px] text-text-muted">
              courseflow.app
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}

