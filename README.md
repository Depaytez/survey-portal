# African Tourism Research Platform

A research data collection and analytics platform supporting the African
Tourism research initiative. Public visitors take a survey; internal admins
manage the survey, review responses, view analytics, and handle
customer-care/stakeholder inquiries. See
[`docs/AFRICAN-TOURISM-MASTER-PROJECT-CONCEPT.md`](docs/AFRICAN-TOURISM-MASTER-PROJECT-CONCEPT.md)
for full product scope and [`docs/AGENT-STANDARDS.md`](docs/AGENT-STANDARDS.md)
for engineering standards.

## Tech Stack

- **Framework**: Next.js 16 (App Router, Turbopack, React 19)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Database & Auth**: Supabase (PostgreSQL, Row Level Security, Supabase Auth)
- **Validation**: Zod
- **Charts**: Recharts
- **Hosting**: Vercel (recommended)

---

## 1. Prerequisites

- Node.js 20.9+ (Next.js 16's minimum)
- A [Supabase](https://supabase.com) account (free tier is fine for development)
- A [Vercel](https://vercel.com) account (for production deployment)
- The [Supabase CLI](https://supabase.com/docs/guides/cli) — no global install
  needed, `npx supabase` works directly

---

## 2. Local Development Setup

### 2.1 Clone and install

```bash
git clone https://github.com/Depaytez/survey-portal.git
cd survey-portal
npm install
```

### 2.2 Create a Supabase project

1. Go to the [Supabase dashboard](https://supabase.com/dashboard) and create a
   new project (or use an existing one dedicated to this app). Wait for it to
   finish provisioning.
2. **Project Settings → Data API**: copy the **Project URL**.
3. **Project Settings → API Keys**: copy the **anon/publishable** key and the
   **service_role/secret** key.
4. **Account (top-right avatar) → Access Tokens**: generate a personal access
   token. This is what lets the Supabase CLI push migrations on your behalf —
   treat it like a password.

### 2.3 Configure environment variables

```bash
cp .env.example .env.local
```

Fill in the four values from step 2.2. **`.env.example` is the single source
of truth for what variables this app needs and where to find each one** —
if you ever add a new one, update that file in the same change.

### 2.4 Link the database and push the schema

```bash
npx supabase link --project-ref <your-project-ref>
npx supabase db push
```

`<your-project-ref>` is the subdomain in your Project URL — the `abcdefgh` in
`https://abcdefgh.supabase.co`. This applies every migration in
`supabase/migrations/`, which includes the full schema, Row Level Security
policies, and a seed migration that loads the real Africa Tourism survey
questionnaire (as **DRAFT** — it's never auto-published).

### 2.5 Generate TypeScript types

```bash
npx supabase gen types typescript --linked > src/types/database.types.ts
```

Re-run this any time you add or change a migration, and also run
`npx next typegen` after adding new routes (Next.js's own route-param types).

### 2.6 Configure Supabase Auth redirect URLs

**Authentication → URL Configuration** in the Supabase dashboard: add
`http://localhost:3000/auth/callback` to **Redirect URLs**. This is required
for the admin-invite and password-reset email links to work — without it,
Supabase silently rejects the `redirectTo` and those flows break.

### 2.7 Create the first admin account

```bash
npm run create-admin -- --email=you@example.com --name="Your Name"
```

This prints a one-time password — save it, then sign in at
`/admin/login`. (Once you have one admin, you can invite additional ones
in-app from `/admin/admins` instead of using this script again.)

### 2.8 Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the public site, and
[http://localhost:3000/admin/login](http://localhost:3000/admin/login) for
the admin tool.

---

## 3. Production Deployment (Vercel)

### 3.1 Connect the repository

Import the GitHub repo into a new Vercel project (or connect it via the
Vercel dashboard). Vercel auto-detects Next.js — no custom build
configuration is needed.

### 3.2 Set environment variables in Vercel

**This is the step that's easiest to forget, and the app will build
successfully without it, then fail at runtime with a generic "server error"
on first page load.** In the Vercel project → **Settings → Environment
Variables**, add for the **Production** environment (and Preview, if you
want preview deployments to work too):

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

Use either the same Supabase project as local dev, or a separate
production-only project (recommended once you have real respondent data —
see §3.5).

`supabase_personal_access_token` is **not** needed on Vercel — it's only
used by the CLI for local migration pushes, never read by the running app.

### 3.3 Add the production URL to Supabase's redirect allowlist

Same as local dev (§2.6), but for your real domain:
**Authentication → URL Configuration → Redirect URLs**, add
`https://your-production-domain/auth/callback`.

### 3.4 Configure custom SMTP (strongly recommended before real use)

Supabase's built-in email service is rate-limited to a handful of emails per
hour and isn't intended for production — the admin-invite and
"forgot password" flows depend on it. Before relying on those in production:
**Project Settings → Authentication → SMTP Settings**, configure a real
provider (Resend, Postmark, SES, etc.). Without this, invite/reset emails
can silently fail to arrive once you exceed the default rate limit.

### 3.5 Decide: shared or separate Supabase project for production

If you've been developing against a single Supabase project, consider
creating a **separate production project** before going live, so local
testing never touches real respondent data. If you do this:

1. Create the new project, repeat §2.2–2.6 against it.
2. Point Vercel's environment variables at the new project.
3. Run `npm run create-admin` against it for the first production admin.

### 3.6 Deploy

Push to the branch Vercel is watching (or trigger a deploy manually). After
it's live, run through the checklist below.

### 3.7 Post-deploy verification checklist

- [ ] Public homepage loads (`/`)
- [ ] `/admin/login` loads and you can sign in
- [ ] `/admin/dashboard` shows real stats (not an error page)
- [ ] Publish the real survey from `/admin/surveys` when ready, then confirm
      `/survey/africa-tourism-expectations-survey` loads and accepts a test
      submission
- [ ] Submit a test entry on `/contact` and `/stakeholder-interest`, confirm
      it shows up under `/admin/customer-care` / `/admin/stakeholder-requests`
- [ ] Send a real admin invite from `/admin/admins` to an email you control,
      confirm the email arrives and the set-password flow completes
- [ ] Try "Forgot password?" on `/admin/login`, confirm that email arrives too

---

## 4. Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the local dev server (Turbopack) |
| `npm run build` | Production build |
| `npm run start` | Run a production build locally |
| `npm run lint` | Run ESLint |
| `npm run create-admin -- --email=... --name="..."` | Provision an admin account (local tooling only — never deploy this) |

---

## 5. Database Migrations

This project uses the Supabase CLI's imperative migration workflow — SQL
files in `supabase/migrations/`, applied in filename (timestamp) order.

To make a schema change:

```bash
npx supabase migration new descriptive_name
# edit the generated file in supabase/migrations/
npx supabase db push
npx supabase gen types typescript --linked > src/types/database.types.ts
```

Read [`docs/AGENT-STANDARDS.md`](docs/AGENT-STANDARDS.md) before altering
existing tables — prefer additive changes, and never edit a migration that's
already been pushed to a shared project; add a new one instead.

---

## 6. Project Structure

```text
src/
  app/
    (public)/          Public site — landing page, /contact, /stakeholder-interest, /survey/[slug]
    admin/
      login/            Public admin sign-in
      forgot-password/  Public password-reset request
      set-password/     Where invite/reset email links land
      (protected)/      Everything else — dashboard, surveys, requests, admins (all require an admin session)
        surveys/[id]/analytics/       Per-survey KPIs, trend chart, per-question breakdowns
        surveys/[id]/analytics/export/  Route Handler — streams the raw responses as CSV
    auth/callback/      Exchanges invite/reset email links for a real session
  components/           Shared UI (site header/footer/background, brand mark)
  lib/
    supabase/           Client factories (browser/server/admin) + query modules
    validation/         Zod schemas + shared constants safe for both client and server code
  types/database.types.ts   Generated from the live schema — don't hand-edit
supabase/
  migrations/           Every schema/RLS/function change, in order
scripts/
  create-admin.ts       Local-only admin provisioning script
```

---

## 7. Troubleshooting

**"This page couldn't load / A server error occurred" in production, but
the build succeeded.** Almost always missing environment variables in
Vercel — see §3.2.

**Admin invite or password-reset email never arrives.** Two possibilities:
(1) if you invited an email that already has an account, no email is sent by
design — the app tells you this in the success message; (2) Supabase's
default mailer is rate-limited to a few emails/hour — configure custom SMTP
for production (§3.4).

**A protected `/admin/*` page doesn't redirect unauthenticated visitors.**
Check that `src/proxy.ts` exists at that exact path (not the project root —
Next.js 16 requires the proxy file live alongside `src/app`, since this
project uses a `src/` directory) and that `next build`'s output includes a
"Proxy (Middleware)" line. Every protected page also independently calls
`requireAdmin()`, so this is defense-in-depth, not the only gate — but it
should still be registered correctly.

**`supabase link` or `supabase db push` fails with `403` / "does not have
the necessary privileges".** The CLI is authenticated to the wrong Supabase
account — `npx supabase projects list` will confirm this by showing
projects that aren't this one. Run `npx supabase login` to re-authenticate
as the account that actually owns this project, then retry.
