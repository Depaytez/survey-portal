import { panelClass } from "@/lib/ui";

export default function LoadingSurvey() {
  return (
    <div className="mx-auto max-w-xl px-6 py-16">
      <div className={`${panelClass} animate-pulse text-center`}>
        <div className="mx-auto h-6 w-2/3 rounded bg-zinc-200 dark:bg-zinc-800" />
        <div className="mx-auto mt-4 h-4 w-full rounded bg-zinc-200 dark:bg-zinc-800" />
        <div className="mx-auto mt-2 h-4 w-5/6 rounded bg-zinc-200 dark:bg-zinc-800" />
        <div className="mx-auto mt-8 h-10 w-36 rounded-md bg-zinc-200 dark:bg-zinc-800" />
      </div>
    </div>
  );
}
