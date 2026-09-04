import Link from "next/link";

export function SurveyClosed({ title }: { title: string }) {
  return (
    <div className="mx-auto max-w-xl px-6 py-20 text-center">
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">{title}</h1>
      <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
        This survey is now closed and is no longer accepting responses. Thank
        you to everyone who took part — your input helps shape better
        tourism experiences across Africa.
      </p>
      <Link
        href="/"
        className="mt-8 inline-block rounded-md border border-zinc-300 px-6 py-2.5 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-50 dark:hover:bg-zinc-900"
      >
        Back to Home
      </Link>
    </div>
  );
}
