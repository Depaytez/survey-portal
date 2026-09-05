import { listCustomerCareRequests } from "@/lib/supabase/queries/requests";
import { requestStatuses } from "@/lib/validation/requests";
import { RequestStatusSelect } from "../request-status-select";
import { updateCustomerCareStatus } from "./actions";
import Link from "next/link";

const CATEGORY_LABELS: Record<string, string> = {
  general: "General",
  technical_issue: "Technical Issue",
  question: "Question",
  feedback: "Feedback",
};

export default async function CustomerCarePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;
  const status = typeof sp.status === "string" ? sp.status : undefined;
  const requests = await listCustomerCareRequests(status);

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
        Customer Care Requests
      </h1>

      <div className="mt-4 flex flex-wrap gap-2">
        <Link
          href="/admin/customer-care"
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
            href={`/admin/customer-care?status=${s}`}
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
        <div className="mt-6 rounded-lg border border-dashed border-zinc-300 bg-white/60 p-8 text-center dark:border-zinc-700 dark:bg-zinc-950/60">
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
                  <p className="font-medium text-zinc-900 dark:text-zinc-50">{request.name}</p>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">{request.email}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                    {CATEGORY_LABELS[request.category] ?? request.category}
                  </span>
                  <RequestStatusSelect
                    id={request.id}
                    status={request.status}
                    onUpdate={updateCustomerCareStatus}
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
