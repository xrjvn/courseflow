import Link from "next/link";
import { signInAction } from "../actions";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--bg-base)]">
      <div className="mx-auto w-full max-w-sm px-6">
        <div className="mb-4 flex items-center justify-center">
          <div
            style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}
            className="mx-auto flex h-8 w-8 items-center justify-center rounded-lg text-xs font-semibold text-white"
          >
            CF
          </div>
        </div>
        <div className="mb-1 text-center text-[18px] font-medium text-[var(--text-primary)]">
          Courseflow
        </div>
        <div className="mb-8 text-center text-[13px] text-[var(--text-secondary)]">
          Sign in to your workspace
        </div>

        <form action={signInAction}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="text-[12px] mb-1.5 font-medium text-[var(--text-secondary)]"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              className="w-full rounded-lg border border-[var(--border-default)] bg-[var(--bg-surface)] px-3 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[#6366f1] focus:ring-1 focus:ring-[rgba(99,102,241,0.3)] transition duration-150"
              placeholder="you@university.edu"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="text-[12px] mb-1.5 font-medium text-[var(--text-secondary)]"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              className="w-full rounded-lg border border-[var(--border-default)] bg-[var(--bg-surface)] px-3 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[#6366f1] focus:ring-1 focus:ring-[rgba(99,102,241,0.3)] transition duration-150"
              placeholder="••••••••"
              required
            />
          </div>
          <button
            type="submit"
            className="mt-6 inline-flex w-full items-center justify-center rounded-lg px-3 py-2.5 text-sm font-medium text-white transition duration-150 hover:opacity-90"
            style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}
          >
            Sign in
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-[var(--text-muted)]">
          Don&apos;t have an account?{" "}
          <Link
            href="/auth/signup"
            className="font-medium text-[#6366f1] hover:underline"
          >
            Create one
          </Link>
          .
        </p>
      </div>
    </div>
  );
}

