import Link from "next/link";
import { listStakeholderRequests } from "@/lib/supabase/queries/requests";
import { requestStatuses } from "@/lib/validation/requests";
import { RequestStatusSelect } from "../request-status-select";
import { updateStakeholderStatus } from "./actions";
import { emptyStateClass } from "@/lib/ui";

const INTEREST_LABELS: Record<string, string> = {
  tourism_development_partnership: "Tourism Development Partnership",
  research_collaboration: "Research Collaboration",
  data_research_support: "Data / Research Support",
  investment_programme_discussion: "Investment / Programme Discussion",
  general_inquiry: "General Inquiry",
};

export default async function StakeholderRequestsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const status = typeof sp.status === "string" ? sp.status : undefined;
  const requests = await listStakeholderRequests(status);

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
        Stakeholder Requests
      </h1>

      <div className="mt-4 flex flex-wrap gap-2">
        <Link
          href="/admin/stakeholder-requests"
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            !status
              ? "bg-primary/10 text-primary"
              : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
          }`}
        >
          All
        </Link>
        {requestStatuses.map((s) => (
          <Link
            key={s}
            href={`/admin/stakeholder-requests?status=${s}`}
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              status === s
                ? "bg-primary/10 text-primary"
                : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
            }`}
          >
            {s}
          </Link>
        ))}
      </div>

      {requests.length === 0 ? (
        <div className={`mt-6 ${emptyStateClass}`}>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            {status ? `No ${status.toLowerCase()} requests.` : "No requests yet."}
          </p>
        </div>
      ) : (
        <ul className="mt-6 flex flex-col gap-3">
          {requests.map((request) => (
            <li
              key={request.id}
              className="rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-zinc-900 dark:text-zinc-50">
                    {request.organizationName}
                  </p>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    {request.contactName} · {request.email}
                    {request.phone ? ` · ${request.phone}` : ""}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                    {INTEREST_LABELS[request.interestType] ?? request.interestType}
                  </span>
                  <RequestStatusSelect
                    id={request.id}
                    status={request.status}
                    onUpdate={updateStakeholderStatus}
                  />
                </div>
              </div>
              <p className="mt-3 whitespace-pre-wrap text-sm text-zinc-700 dark:text-zinc-300">
                {request.message}
              </p>
              <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
                {new Date(request.createdAt).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
