export default function LoadingAnalytics() {
  return (
    <div className="mx-auto max-w-3xl animate-pulse">
      <div className="h-4 w-40 rounded bg-zinc-200 dark:bg-zinc-800" />
      <div className="mt-3 h-7 w-32 rounded bg-zinc-200 dark:bg-zinc-800" />
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="h-20 rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950" />
        <div className="h-20 rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950" />
        <div className="h-20 rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950" />
        <div className="h-20 rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950" />
      </div>
      <div className="mt-6 h-64 rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950" />
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="h-56 rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950" />
        <div className="h-56 rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950" />
      </div>
    </div>
  );
}
