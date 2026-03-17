import Link from "next/link";

type TopNavProps = {
  title: string;
};

export default function TopNav({ title }: TopNavProps) {
  return (
    <header className="sticky top-0 z-10 border-b border-border-subtle bg-bg-base/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex flex-col">
          <span className="text-xs font-medium uppercase tracking-[0.2em] text-text-muted">
            Overview
          </span>
          <h1 className="text-lg font-medium tracking-tight text-text-primary sm:text-xl">
            {title}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/assignments"
            className="hidden rounded-full border border-border-default bg-transparent px-3 py-1.5 text-xs font-medium text-text-secondary hover:bg-[rgba(255,255,255,0.04)] hover:text-text-primary sm:inline-flex"
          >
            View assignments
          </Link>
          <form method="post" action="/auth/signout">
            <button
              type="submit"
              className="flex h-8 items-center justify-center rounded-full border border-border-default bg-transparent px-3 text-xs font-medium text-text-secondary hover:bg-[rgba(255,255,255,0.04)] hover:text-text-primary"
            >
              Sign out
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}


