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
    <aside className="hidden w-64 shrink-0 border-r border-neutral-800 bg-neutral-950/80 px-4 py-4 md:flex md:flex-col">
      <div className="mb-8 flex items-center gap-2 px-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500/10 text-sm font-semibold text-sky-400">
          CF
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold tracking-tight text-neutral-50">
            Courseflow
          </span>
          <span className="text-xs text-neutral-400">
            Student productivity
          </span>
        </div>
      </div>
      <nav className="space-y-1">
        {navItems.map((item) => {
          const active = isActive(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={[
                "flex items-center rounded-md px-2 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-neutral-800 text-neutral-50"
                  : "text-neutral-400 hover:bg-neutral-900 hover:text-neutral-50",
              ].join(" ")}
            >
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto pt-6 text-xs text-neutral-500">
        <p className="px-2">MVP preview · v0.1</p>
      </div>
    </aside>
  );
}

