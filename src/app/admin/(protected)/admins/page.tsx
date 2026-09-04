import { listAdmins } from "@/lib/supabase/queries/admins";
import { InviteAdminForm } from "./invite-admin-form";

export default async function AdminsPage() {
  const admins = await listAdmins();

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">Administrators</h1>

      <div className="mt-6 rounded-lg border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950">
        <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">Invite an Admin</h2>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          They&apos;ll receive an email with a link to set their own password — no password is
          ever shared manually.
        </p>
        <div className="mt-4">
          <InviteAdminForm />
        </div>
      </div>

      <div className="mt-6">
        <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
          Current Administrators
        </h2>
        <ul className="mt-3 divide-y divide-zinc-200 rounded-lg border border-zinc-200 bg-white dark:divide-zinc-800 dark:border-zinc-800 dark:bg-zinc-950">
          {admins.map((admin) => (
            <li key={admin.id} className="flex items-center justify-between px-4 py-3 text-sm">
              <span className="text-zinc-900 dark:text-zinc-50">{admin.fullName}</span>
              <span className="text-zinc-500 dark:text-zinc-400">
                Added {new Date(admin.createdAt).toLocaleDateString()}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
