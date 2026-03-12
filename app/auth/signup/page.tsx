import Link from "next/link";

export default function SignUpPage() {
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
              Create your student workspace
            </span>
          </div>
        </div>

        <form className="space-y-4">
          <div className="space-y-1.5">
            <label
              htmlFor="name"
              className="text-xs font-medium text-neutral-200"
            >
              Full name
            </label>
            <input
              id="name"
              type="text"
              autoComplete="name"
              className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-neutral-50 outline-none ring-0 placeholder:text-neutral-600 focus:border-sky-500 focus:outline-none"
              placeholder="Alex Student"
            />
          </div>
          <div className="space-y-1.5">
            <label
              htmlFor="email"
              className="text-xs font-medium text-neutral-200"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-neutral-50 outline-none ring-0 placeholder:text-neutral-600 focus:border-sky-500 focus:outline-none"
              placeholder="you@university.edu"
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
              type="password"
              autoComplete="new-password"
              className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-sm text-neutral-50 outline-none ring-0 placeholder:text-neutral-600 focus:border-sky-500 focus:outline-none"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            className="mt-2 inline-flex w-full items-center justify-center rounded-lg bg-sky-500 px-3 py-2 text-sm font-semibold text-neutral-950 shadow-sm hover:bg-sky-400"
          >
            Create account
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-neutral-500">
          Already have an account?{" "}
          <Link
            href="/auth/signin"
            className="font-medium text-sky-400 hover:text-sky-300"
          >
            Sign in
          </Link>
          .
        </p>
      </div>
    </div>
  );
}

