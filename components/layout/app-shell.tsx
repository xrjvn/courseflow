"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "./sidebar";
import TopNav from "./top-nav";

type AppShellProps = {
  children: ReactNode;
};

function getPageTitle(pathname: string): string {
  if (pathname.startsWith("/dashboard")) return "Dashboard";
  if (pathname.startsWith("/courses")) return "Courses";
  if (pathname.startsWith("/assignments")) return "Assignments";
  if (pathname.startsWith("/planner")) return "Planner";
  return "Courseflow";
}

export default function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const title = getPageTitle(pathname);

  return (
    <div className="min-h-screen bg-bg-base text-text-primary">
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex flex-1 flex-col">
          <TopNav title={title} />
          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-6xl">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}

