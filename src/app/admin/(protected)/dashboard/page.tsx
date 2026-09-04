import { requireAdmin } from "@/lib/auth";

export default async function AdminDashboardPage() {
  const session = await requireAdmin();

  return (
    <div>
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
        Dashboard
      </h1>
      <p className="mt-2 max-w-prose text-sm text-zinc-600 dark:text-zinc-400">
        Signed in as <strong>{session.profile.full_name}</strong>. Survey
        management, response tables, and analytics are built out in later
        stages of Version 1.
      </p>
    </div>
  );
}
