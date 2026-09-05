import { listAdmins } from "@/lib/supabase/queries/admins";
import { InviteAdminForm } from "./invite-admin-form";
import { ResendInviteButton } from "./resend-invite-button";
import { adminCardClass, dividedListClass } from "@/lib/ui";

export default async function AdminsPage() {
  const admins = await listAdmins();

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">Administrators</h1>

      <div className={`mt-6 ${adminCardClass}`}>
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
        <ul className={`mt-3 ${dividedListClass}`}>
          {admins.map((admin) => (
            <li
              key={admin.id}
              className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-sm"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-zinc-900 dark:text-zinc-50">
                    {admin.fullName}
                  </span>
                  {admin.isPending ? (
                    <span className="rounded-full bg-accent/10 px-2 py-0.5 text-xs text-accent">
                      Invite pending
                    </span>
                  ) : null}
                </div>
                <span className="text-zinc-500 dark:text-zinc-400">{admin.email}</span>
              </div>
              <div className="flex items-center gap-3">
                {admin.isPending ? (
                  <ResendInviteButton email={admin.email} />
                ) : null}
                <span className="text-zinc-500 dark:text-zinc-400">
                  Added {new Date(admin.createdAt).toLocaleDateString()}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
