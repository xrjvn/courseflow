import Link from "next/link";
import { signInAction } from "../actions";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-950 px-4">
      <div className="w-full max-w-md rounded-2xl border border-neutral-800 bg-neutral-950/80 p-6 shadow-xl shadow-black/50">
        <div className="mb-6 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500/10 text-sm font-semibold text-sky-400">
            CF
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold tracking-tight text-neutral-50">
              Courseflow
            </span>
            <span className="text-xs text-neutral-400">
              Sign in to your workspace
            </span>
          </div>
        </div>

        <form className="space-y-4" action={signInAction}>
          <div className="space-y-1.5">
            <label
              htmlFor="email"
              className="text-xs font-medium text-neutral-200"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-neutral-50 outline-none ring-0 placeholder:text-neutral-600 focus:border-sky-500 focus:outline-none"
              placeholder="you@university.edu"
              required
            />
          </div>
          <div className="space-y-1.5">
            <label
              htmlFor="password"
              className="text-xs font-medium text-neutral-200"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-neutral-50 outline-none ring-0 placeholder:text-neutral-600 focus:border-sky-500 focus:outline-none"
              placeholder="••••••••"
              required
            />
          </div>
          <button
            type="submit"
            className="mt-2 inline-flex w-full items-center justify-center rounded-lg bg-sky-500 px-3 py-2 text-sm font-semibold text-neutral-950 shadow-sm hover:bg-sky-400"
          >
            Sign in
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-neutral-500">
          Don&apos;t have an account?{" "}
          <Link
            href="/auth/signup"
            className="font-medium text-sky-400 hover:text-sky-300"
          >
            Create one
          </Link>
          .
        </p>
      </div>
    </div>
  );
}

