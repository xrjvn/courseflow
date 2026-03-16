```markdown
# Courseflow

A full-stack student productivity app that helps university students organize courses, assignments, and weekly workload in a single, simple workspace.

---

## Overview

Courseflow is a minimal but production-like SaaS-style app built with Next.js App Router and Supabase.  
It focuses on a tight MVP:

- Email/password authentication
- Course management
- Assignment management
- Dashboard with real data
- Weekly planner derived from assignment due dates

The codebase is structured as a portfolio-quality reference for a modern full-stack TypeScript app.

---

## Live Demo

Coming soon — will be deployed on Vercel.

Production URL: (to be added)

---

## Why it was built

- **Demonstrate** a clean, production-aligned Next.js + Supabase architecture.
- **Explore** a realistic student workflow: courses → assignments → weekly planning.
- **Practice** building a small but coherent SaaS UI (auth → dashboard → CRUD views → planner).
- **Serve** as a foundation that can be safely extended (notifications, richer planner, analytics) without rewrites.

---

## Key features (current MVP)

- **Authentication**
  - Email/password sign up & sign in (Supabase Auth)
  - Protected app routes (`/dashboard`, `/courses`, `/assignments`, `/planner`)
  - Server-side session validation via App Router

- **Courses**
  - View all courses for the logged-in user
  - Create, edit, and delete courses
  - Optional fields: course code, semester, color
  - Clean card-based layout with inline edit/delete

- **Assignments**
  - View all assignments for the logged-in user
  - Each assignment linked to a course
  - Create, edit, and delete assignments
  - Fields: title, description, course, due date/time, status, priority
  - Table-like layout with responsive mobile/desktop design

- **Dashboard**
  - Summary cards:
    - Total courses
    - Total assignments
    - Assignments due this week
    - Completed assignments
  - Upcoming assignments (next few due)
  - Overdue assignments list (if any)

- **Weekly Planner**
  - Current-week view (Monday–Sunday)
  - Assignments grouped by `due_at` day
  - Includes course info, status, and priority
  - Empty states per day when nothing is due

---

## Screenshots

*(To be added after deployment)*

- Dashboard view
- Assignments manager
- Weekly planner

---

## Tech stack

- **Frontend**
  - [Next.js](https://nextjs.org/) App Router
  - [React](https://react.dev/)
  - [TypeScript](https://www.typescriptlang.org/)
  - [Tailwind CSS v4](https://tailwindcss.com/) (atomic utility classes, dark theme)

- **Backend / Data**
  - [Supabase](https://supabase.com/) (PostgreSQL + Auth + RLS)
  - [`@supabase/supabase-js`](https://github.com/supabase/supabase-js)
  - [`@supabase/ssr`](https://github.com/supabase/supabase-js/tree/master/packages/ssr) for Next.js server-side sessions

- **Deployment**
  - Intended for [Vercel](https://vercel.com/) + Supabase

---

## Architecture overview

- **App routing**
  - Public:
    - `/` – Marketing/landing
    - `/auth/signin` – Sign in
    - `/auth/signup` – Sign up
  - Authenticated group (`app/(app)/`):
    - `/dashboard`
    - `/courses`
    - `/assignments`
    - `/planner`
  - `(app)/layout.tsx`:
    - Server Component that:
      - Creates a Supabase server client
      - Calls `supabase.auth.getUser()`
      - Redirects unauthenticated users to `/auth/signin`
      - Wraps content in the shared `AppShell` (sidebar + top nav)

- **Supabase integration**
  - `lib/supabase/client.ts`
    - `createSupabaseBrowserClient()` for client components (if needed later)
  - `lib/supabase/server.ts`
    - `createSupabaseServerClient()` using `@supabase/ssr` + `next/headers` cookies
    - Used by server components and server actions

- **Server actions**
  - Implemented per feature area:
    - `app/auth/actions.ts` – sign in, sign up
    - `app/(app)/courses/actions.ts` – create/update/delete courses
    - `app/(app)/assignments/actions.ts` – create/update/delete assignments
  - All actions:
    - Validate `FormData`
    - Use the server Supabase client
    - Filter mutations by `user_id`
    - Revalidate the corresponding path (e.g. `/courses`, `/assignments`)

- **UI structure**
  - `components/layout/app-shell.tsx` – main app shell (sidebar + top nav)
  - `components/layout/sidebar.tsx` – navigation links
  - `components/layout/top-nav.tsx` – page title + sign out
  - `components/ui/status-badge.tsx` – status chip (not_started / in_progress / completed)
  - `components/ui/priority-badge.tsx` – priority chip (low / medium / high)
  - Tailwind classes provide a consistent dark SaaS look across all pages

---

## Authentication & security overview

- **Authentication**
  - Supabase email/password auth (`supabase.auth.signUp`, `supabase.auth.signInWithPassword`)
  - Server actions handle form submissions for `/auth/signup` and `/auth/signin`
  - After signup:
    - A database trigger (configured in Supabase) is expected to create `public.profiles` from `auth.users` using `raw_user_meta_data.full_name`.
    - The app passes `full_name` via `signUp` `options.data`.

- **Session handling**
  - `createSupabaseServerClient()` reads/writes auth cookies via `@supabase/ssr` and `next/headers`.
  - `(app)/layout.tsx` calls `supabase.auth.getUser()` and redirects unauthenticated users.
  - `/auth/signout` route handler calls `supabase.auth.signOut()` and redirects back to `/auth/signin`.

- **Authorization (RLS)**
  - Database tables use **Row Level Security** (RLS) in Supabase.
  - Typical policy pattern (conceptual):
    - `profiles`: `id = auth.uid()` for all operations.
    - `courses`: `user_id = auth.uid()` for SELECT/INSERT/UPDATE/DELETE.
    - `assignments`: `user_id = auth.uid()` for SELECT/INSERT/UPDATE/DELETE.
  - The app also filters by `user_id` in queries as a second layer of safety.

---

## Database schema summary

Minimal tables:

- **profiles**
  - `id` (uuid, PK, FK → `auth.users.id`)
  - `full_name` (text)
  - `created_at` (timestamptz, default now)
  - `updated_at` (timestamptz, default now)

- **courses**
  - `id` (uuid, PK)
  - `user_id` (uuid, FK → `auth.users.id`)
  - `name` (text, required)
  - `code` (text, optional)
  - `semester` (text, optional)
  - `color` (text, optional)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

- **assignments**
  - `id` (uuid, PK)
  - `user_id` (uuid, FK → `auth.users.id`)
  - `course_id` (uuid, FK → `courses.id`)
  - `title` (text, required)
  - `description` (text, optional)
  - `due_at` (timestamptz, required)
  - `status` (enum: `not_started` | `in_progress` | `completed`)
  - `priority` (enum: `low` | `medium` | `high`)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

Planner logic is **derived** from `assignments.due_at`. There is **no** separate planner table.

---

## Local setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/<your-username>/courseflow.git
   cd courseflow
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Create `.env.local`**

   ```bash
   cp .env.local.example .env.local
   ```

   Then fill in the Supabase values (see next section).

4. **Run the dev server**

   ```bash
   npm run dev
   ```

   Visit `http://localhost:3000`.

5. **Set up Supabase**
   - Create a new Supabase project.
   - Apply the SQL schema for `profiles`, `courses`, `assignments`, enums, RLS policies, and the trigger that creates `profiles` from `auth.users`.
   - Enable email/password authentication in the Supabase Auth settings.

---

## Required environment variables

In `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Notes:

- Both are provided by Supabase in the project settings.
- These vars must also be configured in your Vercel project for production.

---

## Deployment notes

- **Vercel + Supabase**
  - Deploy via Vercel connected to the GitHub repo.
  - Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in Vercel project settings.
  - Ensure the Supabase project URL and anon key match the environment used in development.

- **Database migrations**
  - Apply the SQL schema in Supabase’s SQL editor (or via migrations if you add a migration system).
  - Confirm RLS policies are active and behave as expected before exposing the app.

- **Auth redirect settings**
  - In Supabase Auth settings, set the Site URL to your deployed Vercel URL.
  - The app uses cookie-based sessions via `@supabase/ssr`, so no custom OAuth redirect handling is required for the current MVP (no OAuth providers are enabled).

---

## Future improvements (not yet implemented)

These are realistic extensions that fit the existing architecture:

- **Better UX & feedback**
  - Inline success/error messaging for server actions (e.g. toast notifications).
  - Loading indicators on forms and key data sections.

- **Filtering & sorting**
  - Filters on `/assignments` by course, status, and priority.
  - Additional sort options (e.g., by course, by priority).

- **Richer planner**
  - Navigate between weeks (previous/next) instead of only the current week.
  - Visual indicators for overdue items within the planner.

- **Notifications & reminders**
  - Email or in-app reminders for upcoming and overdue assignments.

- **Profiles & settings**
  - User profile page (edit full name).
  - Settings for timezone and week start (Sunday vs Monday).

- **Testing & tooling**
  - Add unit tests and/or integration tests for server actions.
  - Add basic E2E coverage for auth and CRUD flows.

Courseflow is intentionally small and focused; the current codebase is structured to support these extensions without major refactors.
```