export default function LoadingSurveys() {
  return (
    <div className="animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-7 w-32 rounded bg-zinc-200 dark:bg-zinc-800" />
        <div className="h-9 w-28 rounded-md bg-zinc-200 dark:bg-zinc-800" />
      </div>
      <div className="mt-6 flex flex-col gap-3">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-16 rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950"
          />
        ))}
      </div>
    </div>
  );
}
